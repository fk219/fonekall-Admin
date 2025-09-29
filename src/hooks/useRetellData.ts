import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface RetellOrganization {
  id: string;
  name: string;
  created_at: string;
  plan: string;
  credit_balance: number;
  current_month_calls: number;
  monthly_call_limit: number;
  is_active: boolean;
  total_spent?: number;
  last_call_date?: string;
  agents_count?: number;
  phone_numbers_count?: number;
}

interface DashboardStats {
  total_organizations: number;
  active_agents: number;
  monthly_revenue: number;
  total_calls: number;
  system_health: {
    api_response_time: number;
    uptime: number;
    active_connections: number;
  };
}

export const useRetellData = () => {
  const [organizations, setOrganizations] = useState<RetellOrganization[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchOrganizations = async () => {
    try {
      const { data: orgsData, error: orgsError } = await supabase
        .from('organizations')
        .select(`
          *,
          agents:agents(count),
          phone_numbers:phone_numbers(count),
          calls:calls(count, call_cost, created_at)
        `);

      if (orgsError) throw orgsError;

      // Process organizations data
      const processedOrgs: RetellOrganization[] = orgsData?.map(org => {
        const calls = org.calls || [];
        const totalSpent = calls.reduce((sum: number, call: any) => 
          sum + (call.call_cost || 0), 0);
        
        const lastCall = calls.length > 0 
          ? calls.sort((a: any, b: any) => 
              new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            )[0]
          : null;

        return {
          id: org.id,
          name: org.name,
          created_at: org.created_at,
          plan: org.plan,
          credit_balance: org.credit_balance,
          current_month_calls: org.current_month_calls,
          monthly_call_limit: org.monthly_call_limit,
          is_active: org.is_active,
          total_spent: totalSpent,
          last_call_date: lastCall?.created_at,
          agents_count: org.agents?.[0]?.count || 0,
          phone_numbers_count: org.phone_numbers?.[0]?.count || 0,
        };
      }) || [];

      setOrganizations(processedOrgs);

      // Calculate dashboard stats
      const totalCalls = await getTotalCalls();
      const activeAgents = await getActiveAgents();
      const monthlyRevenue = await getMonthlyRevenue();

      setDashboardStats({
        total_organizations: processedOrgs.length,
        active_agents: activeAgents,
        monthly_revenue: monthlyRevenue,
        total_calls: totalCalls,
        system_health: {
          api_response_time: 45, // Mock data
          uptime: 99.9,
          active_connections: 156,
        }
      });

    } catch (error) {
      console.error('Error fetching organizations:', error);
      toast({
        title: "Error",
        description: "Failed to fetch organization data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTotalCalls = async (): Promise<number> => {
    const { count, error } = await supabase
      .from('calls')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('Error fetching total calls:', error);
      return 0;
    }
    return count || 0;
  };

  const getActiveAgents = async (): Promise<number> => {
    const { count, error } = await supabase
      .from('agents')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');
    
    if (error) {
      console.error('Error fetching active agents:', error);
      return 0;
    }
    return count || 0;
  };

  const getMonthlyRevenue = async (): Promise<number> => {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from('calls')
      .select('call_cost')
      .gte('created_at', startOfMonth.toISOString());
    
    if (error) {
      console.error('Error fetching monthly revenue:', error);
      return 0;
    }

    return data?.reduce((sum, call) => sum + (call.call_cost || 0), 0) || 0;
  };

  const addCredits = async (organizationId: string, amount: number, description?: string) => {
    try {
      setLoading(true);
      
      // Get current organization data
      const { data: org, error: fetchError } = await supabase
        .from('organizations')
        .select('credit_balance')
        .eq('id', organizationId)
        .single();

      if (fetchError) throw fetchError;

      const newBalance = (org.credit_balance || 0) + amount;

      // Update organization balance
      const { error: updateError } = await supabase
        .from('organizations')
        .update({ 
          credit_balance: newBalance,
          updated_at: new Date().toISOString() 
        })
        .eq('id', organizationId);

      if (updateError) throw updateError;

      // Record the transaction
      const { error: transactionError } = await supabase
        .from('credit_transactions')
        .insert({
          organization_id: organizationId,
          transaction_type: 'addition',
          amount: amount,
          balance_before: org.credit_balance,
          balance_after: newBalance,
          reference_type: 'manual',
          reference_id: 'admin_credit_addition',
          description: description || `Admin added ${amount} credits`
        });

      if (transactionError) throw transactionError;

      toast({
        title: "Credits Added",
        description: `Successfully added ${amount} credits to the organization`,
      });

      // Refresh organizations data
      await fetchOrganizations();

    } catch (error) {
      console.error('Error adding credits:', error);
      toast({
        title: "Error",
        description: "Failed to add credits",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrganizationPlan = async (organizationId: string, newPlan: string) => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from('organizations')
        .update({ 
          plan: newPlan,
          updated_at: new Date().toISOString() 
        })
        .eq('id', organizationId);

      if (error) throw error;

      toast({
        title: "Plan Updated",
        description: `Successfully updated organization plan to ${newPlan}`,
      });

      // Refresh organizations data
      await fetchOrganizations();

    } catch (error) {
      console.error('Error updating plan:', error);
      toast({
        title: "Error",
        description: "Failed to update organization plan",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  return {
    organizations,
    dashboardStats,
    loading,
    addCredits,
    updateOrganizationPlan,
    refetch: fetchOrganizations,
  };
};