-- Fix RLS policies for credit_transactions to allow admin operations
DROP POLICY IF EXISTS "organization_access" ON public.credit_transactions;

-- Create new RLS policy that allows access based on organization_id matching current context
CREATE POLICY "credit_transactions_organization_policy" 
ON public.credit_transactions 
FOR ALL 
USING (
  organization_id = COALESCE(
    NULLIF(current_setting('request.headers.x-client-organization', true), '')::uuid,
    (SELECT organization_id FROM users WHERE id = auth.uid())
  )
);

-- Also create a subscription management table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL,
  plan VARCHAR NOT NULL DEFAULT 'starter',
  status VARCHAR NOT NULL DEFAULT 'active',
  amount NUMERIC NOT NULL DEFAULT 0,
  auto_renew BOOLEAN NOT NULL DEFAULT true,
  current_period_start TIMESTAMP WITH TIME ZONE DEFAULT now(),
  current_period_end TIMESTAMP WITH TIME ZONE DEFAULT (now() + INTERVAL '1 month'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on subscriptions table
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for subscriptions
CREATE POLICY "subscriptions_organization_policy" 
ON public.subscriptions 
FOR ALL 
USING (
  organization_id::text = (current_setting('request.headers', true)::json ->> 'x-client-organization')
);

-- Insert default subscriptions for existing organizations
INSERT INTO public.subscriptions (organization_id, plan, amount)
SELECT 
  id,
  COALESCE(plan, 'starter'),
  CASE 
    WHEN plan = 'enterprise' THEN 299
    WHEN plan = 'professional' THEN 99
    ELSE 29
  END
FROM public.organizations
WHERE id NOT IN (SELECT organization_id FROM public.subscriptions);

-- Create function to update subscription timestamps
CREATE OR REPLACE FUNCTION public.update_subscription_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates on subscriptions
CREATE TRIGGER update_subscriptions_updated_at
BEFORE UPDATE ON public.subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_subscription_updated_at_column();