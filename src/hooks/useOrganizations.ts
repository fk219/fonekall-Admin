import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Organization {
  id: string;
  name: string;
  email?: string;
  plan: string;
  created_at: string;
  credit_balance: number;
  current_month_calls: number;
  monthly_call_limit: number;
  is_active: boolean;
  domain?: string;
  support_email?: string;
  agents_count?: number;
  total_calls?: number;
  total_spend?: number;
  phone_numbers?: string[];
  last_activity?: string;
}

export interface OrganizationStats {
  totalOrganizations: number;
  activeAgents: number;
  totalCredits: number;
  monthlyRevenue: number;
}

export function useOrganizations() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [stats, setStats] = useState<OrganizationStats>({
    totalOrganizations: 0,
    activeAgents: 0,
    totalCredits: 0,
    monthlyRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      
      // Fetch organizations with related data
      const { data: orgsData, error: orgsError } = await supabase
        .from('organizations')
        .select(`
          *,
          agents:agents(count),
          phone_numbers:phone_numbers(number),
          users:users(count)
        `);

      if (orgsError) throw orgsError;

      // Fetch call stats separately to avoid GROUP BY issues
      const { data: callStatsData, error: callStatsError } = await supabase
        .from('calls')
        .select('organization_id, call_cost')
        .not('call_cost', 'is', null);

      if (callStatsError) throw callStatsError;

      // Process call statistics by organization
      const callStatsByOrg = callStatsData?.reduce((acc: Record<string, { count: number; totalCost: number }>, call) => {
        const orgId = call.organization_id;
        if (!acc[orgId]) {
          acc[orgId] = { count: 0, totalCost: 0 };
        }
        acc[orgId].count += 1;
        acc[orgId].totalCost += call.call_cost || 0;
        return acc;
      }, {}) || {};

      // Process organizations data
      const processedOrgs: Organization[] = orgsData?.map(org => {
        const callStats = callStatsByOrg[org.id] || { count: 0, totalCost: 0 };
        
        return {
          id: org.id,
          name: org.name,
          email: org.support_email,
          plan: org.plan || 'starter',
          created_at: org.created_at,
          credit_balance: org.credit_balance || 0,
          current_month_calls: org.current_month_calls || 0,
          monthly_call_limit: org.monthly_call_limit || 1000,
          is_active: org.is_active ?? true,
          domain: org.domain,
          support_email: org.support_email,
          agents_count: org.agents?.[0]?.count || 0,
          total_calls: callStats.count,
          total_spend: callStats.totalCost,
          phone_numbers: org.phone_numbers?.map((pn: any) => pn.number) || [],
          last_activity: org.updated_at
        };
      }) || [];

      setOrganizations(processedOrgs);

      // Calculate stats
      const totalCredits = processedOrgs.reduce((sum, org) => sum + org.credit_balance, 0);
      const activeAgents = processedOrgs.reduce((sum, org) => sum + (org.agents_count || 0), 0);
      const monthlyRevenue = processedOrgs.reduce((sum, org) => sum + (org.total_spend || 0), 0);

      setStats({
        totalOrganizations: processedOrgs.length,
        activeAgents,
        totalCredits,
        monthlyRevenue
      });

    } catch (error) {
      console.error('Error fetching organizations:', error);
      toast({
        title: "Error",
        description: "Failed to fetch organizations data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addCredits = async (organizationId: string, amount: number, description?: string) => {
    try {
      // Get current balance
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

      // Record transaction
      const { error: transactionError } = await supabase
        .from('credit_transactions')
        .insert({
          organization_id: organizationId,
          transaction_type: 'addition',
          amount: amount,
          balance_before: org.credit_balance || 0,
          balance_after: newBalance,
          description: description || `Manual credit addition`,
          reference_type: 'manual',
          reference_id: organizationId
        });

      if (transactionError) throw transactionError;

      // Refresh data
      await fetchOrganizations();

      toast({
        title: "Credits Added",
        description: `Successfully added ${amount} credits`
      });

      return true;
    } catch (error) {
      console.error('Error adding credits:', error);
      toast({
        title: "Error",
        description: "Failed to add credits",
        variant: "destructive"
      });
      return false;
    }
  };

  const getCreditHistory = async (organizationId: string) => {
    try {
      const { data, error } = await supabase
        .from('credit_transactions')
        .select('*')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching credit history:', error);
      return [];
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  return {
    organizations,
    stats,
    loading,
    addCredits,
    getCreditHistory,
    refetch: fetchOrganizations
  };
}