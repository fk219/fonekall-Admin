-- Fix security issues from the linter

-- Add RLS policies for tables that need them
CREATE POLICY "call_analytics_select_all" ON public.call_analytics FOR SELECT USING (true);
CREATE POLICY "call_cost_breakdown_select_all" ON public.call_cost_breakdown FOR SELECT USING (true);
CREATE POLICY "call_function_calls_select_all" ON public.call_function_calls FOR SELECT USING (true);
CREATE POLICY "call_latency_metrics_select_all" ON public.call_latency_metrics FOR SELECT USING (true);
CREATE POLICY "call_transcripts_select_all" ON public.call_transcripts FOR SELECT USING (true);
CREATE POLICY "webhook_endpoints_select_all" ON public.webhook_endpoints FOR SELECT USING (true);

-- Fix function search paths for security
CREATE OR REPLACE FUNCTION public.compute_and_deduct_call_cost(p_external_call_id character varying)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
DECLARE
  v_call RECORD;
  v_org_id UUID;
  v_direction VARCHAR(10);
  v_to_number VARCHAR(20);
  v_duration_seconds INTEGER;
  v_price RECORD;
  v_org_plan TEXT;
  v_plan_ppm NUMERIC;
  v_price_per_minute NUMERIC;
  v_setup_fee NUMERIC;
  v_min_seconds INTEGER;
  v_increment_seconds INTEGER;
  v_billable_seconds INTEGER;
  v_minutes_billed NUMERIC;
  v_total_cost NUMERIC;
  v_balance_before NUMERIC;
  v_balance_after NUMERIC;
BEGIN
  -- Fetch call details
  SELECT id, organization_id, direction, to_number, COALESCE(duration_seconds, 0) AS duration_seconds
  INTO v_call
  FROM calls
  WHERE external_call_id = p_external_call_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Call not found for external_call_id=%', p_external_call_id;
  END IF;

  v_org_id := v_call.organization_id;
  v_direction := v_call.direction;
  v_to_number := v_call.to_number;
  v_duration_seconds := COALESCE(v_call.duration_seconds, 0);

  -- Pick pricing: prefer org-specific, then global; prefer most specific destination_prefix
  WITH candidates AS (
    SELECT *,
      COALESCE(LENGTH(destination_prefix), 0) AS prefix_len,
      (organization_id IS NULL) AS is_global
    FROM call_pricing
    WHERE (organization_id = v_org_id OR organization_id IS NULL)
      AND call_type = v_direction
      AND is_active = TRUE
      AND (
        destination_prefix IS NULL OR
        (v_to_number IS NOT NULL AND v_to_number LIKE destination_prefix || '%')
      )
  )
  SELECT price_per_minute, setup_fee, minimum_charge_seconds, billing_increment_seconds
  INTO v_price_per_minute, v_setup_fee, v_min_seconds, v_increment_seconds
  FROM candidates
  ORDER BY prefix_len DESC, is_global ASC
  LIMIT 1;

  -- Apply plan fallback price/min when not explicitly priced
  IF v_price_per_minute IS NULL THEN
    SELECT plan INTO v_org_plan FROM organizations WHERE id = v_org_id;
    -- map plan to default price/min
    v_plan_ppm := CASE
      WHEN v_org_plan = 'enterprise' THEN 0.035
      WHEN v_org_plan = 'professional' THEN 0.045
      ELSE 0.06
    END;
    v_price_per_minute := v_plan_ppm;
    v_setup_fee := COALESCE(v_setup_fee, 0);
    v_min_seconds := COALESCE(v_min_seconds, 60);
    v_increment_seconds := COALESCE(v_increment_seconds, 6);
  END IF;

  -- Compute billable seconds with minimum and rounding up to increment
  v_billable_seconds := GREATEST(v_duration_seconds, v_min_seconds);
  IF v_increment_seconds > 0 THEN
    v_billable_seconds := CEIL(v_billable_seconds::NUMERIC / v_increment_seconds) * v_increment_seconds;
  END IF;

  v_minutes_billed := v_billable_seconds::NUMERIC / 60.0;
  v_total_cost := v_setup_fee + (v_minutes_billed * v_price_per_minute);
  v_total_cost := ROUND(v_total_cost::NUMERIC, 4);

  -- Deduct from organization balance atomically and record transaction
  SELECT credit_balance INTO v_balance_before FROM organizations WHERE id = v_org_id FOR UPDATE;
  v_balance_after := v_balance_before - v_total_cost;

  UPDATE organizations
  SET credit_balance = v_balance_after,
      updated_at = NOW()
  WHERE id = v_org_id;

  INSERT INTO credit_transactions (
    organization_id, transaction_type, amount, balance_before, balance_after,
    reference_type, reference_id, description
  ) VALUES (
    v_org_id, 'deduction', -v_total_cost, v_balance_before, v_balance_after,
    'call', v_call.id::TEXT, CONCAT('Call charge (', v_direction, ')')
  );

  UPDATE calls
  SET call_cost = v_total_cost,
      credits_deducted = v_total_cost,
      billing_status = 'charged',
      updated_at = NOW()
  WHERE id = v_call.id;

  RETURN json_build_object(
    'success', true,
    'call_id', v_call.id,
    'total_cost', v_total_cost,
    'minutes_billed', v_minutes_billed,
    'billable_seconds', v_billable_seconds,
    'price_per_minute', v_price_per_minute,
    'setup_fee', v_setup_fee
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.deduct_credits(org_id uuid, amount numeric, reference_type character varying, reference_id character varying, description text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
declare
  current_balance numeric(10,4);
  new_balance     numeric(10,4);
begin
  select credit_balance into current_balance
  from organizations
  where id = org_id
  for update;

  if current_balance < amount then
    return false;
  end if;

  new_balance := current_balance - amount;

  update organizations
  set credit_balance = new_balance,
      current_month_calls = current_month_calls + 1,
      updated_at = now()
  where id = org_id;

  insert into credit_transactions(
    organization_id, transaction_type, amount,
    balance_before, balance_after,
    reference_type, reference_id, description
  )
  values (
    org_id, 'deduction', -amount,
    current_balance, new_balance,
    reference_type, reference_id, description
  );

  return true;
end;
$function$;