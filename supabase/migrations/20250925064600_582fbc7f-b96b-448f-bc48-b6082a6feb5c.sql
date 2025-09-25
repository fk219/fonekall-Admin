-- Fix RLS policy for credit_transactions to allow admin operations
DROP POLICY IF EXISTS "credit_transactions_organization_policy" ON public.credit_transactions;

-- Create a more permissive RLS policy that allows admin operations
CREATE POLICY "credit_transactions_admin_access" 
ON public.credit_transactions 
FOR ALL 
USING (
  -- Allow if organization_id matches the header or user's org
  organization_id = COALESCE(
    NULLIF(current_setting('request.headers.x-client-organization', true), '')::uuid,
    (SELECT organization_id FROM users WHERE id = auth.uid())
  )
  OR
  -- Allow if user is admin (assuming admin users can access all orgs)
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
)
WITH CHECK (
  -- Same check for inserts
  organization_id = COALESCE(
    NULLIF(current_setting('request.headers.x-client-organization', true), '')::uuid,
    (SELECT organization_id FROM users WHERE id = auth.uid())
  )
  OR
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);