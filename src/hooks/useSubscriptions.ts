import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Subscription {
  id: string;
  organization_id: string;
  plan: string;
  status: 'active' | 'cancelled' | 'expired';
  current_period_start: string;
  current_period_end: string;
  amount: number;
  currency: string;
  auto_renew: boolean;
  created_at: string;
  updated_at: string;
  organization_name: string;
}

interface CreditTransaction {
  id: string;
  organization_id: string;
  transaction_type: string;
  amount: number;
  balance_before: number;
  balance_after: number;
  description: string;
  reference_type: string;
  reference_id: string;
  created_at: string;
}

export const useSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [creditTransactions, setCreditTransactions] = useState<CreditTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubscriptions = async () => {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select(`
          id,
          name,
          plan,
          credit_balance,
          auto_recharge_enabled,
          auto_recharge_amount,
          low_credit_threshold,
          created_at,
          updated_at
        `);

      if (error) throw error;

      // Transform to subscription format for display
      const transformedSubs = data?.map(org => ({
        id: org.id,
        organization_id: org.id,
        plan: org.plan,
        status: 'active' as const,
        current_period_start: org.created_at,
        current_period_end: new Date(new Date(org.created_at).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        amount: org.plan === 'enterprise' ? 299 : org.plan === 'professional' ? 99 : 29,
        currency: 'USD',
        auto_renew: org.auto_recharge_enabled,
        created_at: org.created_at,
        updated_at: org.updated_at,
        organization_name: org.name
      })) || [];

      setSubscriptions(transformedSubs);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    }
  };

  const fetchCreditTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('credit_transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setCreditTransactions(data || []);
    } catch (error) {
      console.error('Error fetching credit transactions:', error);
    }
  };

  const addCredits = async (organizationId: string, amount: number, description: string) => {
    try {
      // Get current balance
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .select('credit_balance')
        .eq('id', organizationId)
        .single();

      if (orgError) throw orgError;

      const balanceBefore = org.credit_balance || 0;
      const balanceAfter = balanceBefore + amount;

      // Update organization balance
      const { error: updateError } = await supabase
        .from('organizations')
        .update({ 
          credit_balance: balanceAfter,
          updated_at: new Date().toISOString()
        })
        .eq('id', organizationId);

      if (updateError) throw updateError;

      // Record transaction
      const { error: transactionError } = await supabase
        .from('credit_transactions')
        .insert({
          organization_id: organizationId,
          transaction_type: 'addition',
          amount: amount,
          balance_before: balanceBefore,
          balance_after: balanceAfter,
          description: description,
          reference_type: 'manual',
          reference_id: 'admin-add'
        });

      if (transactionError) throw transactionError;

      // Refresh data
      await Promise.all([fetchSubscriptions(), fetchCreditTransactions()]);
      
      return { success: true };
    } catch (error) {
      console.error('Error adding credits:', error);
      return { success: false, error: error.message };
    }
  };

  const updateSubscription = async (organizationId: string, plan: string) => {
    try {
      const { error } = await supabase
        .from('organizations')
        .update({ 
          plan: plan,
          updated_at: new Date().toISOString()
        })
        .eq('id', organizationId);

      if (error) throw error;

      await fetchSubscriptions();
      return { success: true };
    } catch (error) {
      console.error('Error updating subscription:', error);
      return { success: false, error: error.message };
    }
  };

  const toggleAutoRecharge = async (organizationId: string, enabled: boolean, amount?: number) => {
    try {
      const updateData: any = { 
        auto_recharge_enabled: enabled,
        updated_at: new Date().toISOString()
      };

      if (amount !== undefined) {
        updateData.auto_recharge_amount = amount;
      }

      const { error } = await supabase
        .from('organizations')
        .update(updateData)
        .eq('id', organizationId);

      if (error) throw error;

      await fetchSubscriptions();
      return { success: true };
    } catch (error) {
      console.error('Error updating auto recharge:', error);
      return { success: false, error: error.message };
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchSubscriptions(), fetchCreditTransactions()]);
      setLoading(false);
    };

    loadData();
  }, []);

  return {
    subscriptions,
    creditTransactions,
    loading,
    addCredits,
    updateSubscription,
    toggleAutoRecharge,
    refetch: () => Promise.all([fetchSubscriptions(), fetchCreditTransactions()])
  };
};