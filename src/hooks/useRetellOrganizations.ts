import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface RetellOrganization {
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
  phone_numbers?: any[];
  last_activity?: string;
  // Additional comprehensive data
  primary_color?: string;
  logo_url?: string;
  stripe_customer_id?: string;
  auto_recharge_enabled?: boolean;
  auto_recharge_amount?: number;
  low_credit_threshold?: number;
  branding?: any;
  retell_settings?: any;
  data_storage_setting?: string;
}

export interface OrganizationStats {
  totalOrganizations: number;
  activeAgents: number;
  totalCredits: number;
  monthlyRevenue: number;
  totalCalls: number;
  averageCallDuration: number;
}

export function useRetellOrganizations() {
  const [organizations, setOrganizations] = useState<RetellOrganization[]>([]);
  const [stats, setStats] = useState<OrganizationStats>({
    totalOrganizations: 0,
    activeAgents: 0,
    totalCredits: 0,
    monthlyRevenue: 0,
    totalCalls: 0,
    averageCallDuration: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchOrganizationsWithDetails = async () => {
    try {
      setLoading(true);
      
      // Fetch comprehensive organization data
      const { data: orgsData, error: orgsError } = await supabase
        .from('organizations')
        .select(`
          *,
          agents:agents(count),
          phone_numbers:phone_numbers(number),
          users:users(count)
        `);

      if (orgsError) throw orgsError;

      // Fetch call analytics
      const { data: callsData, error: callsError } = await supabase
        .from('calls')
        .select('organization_id, call_cost, duration_seconds, created_at')
        .not('call_cost', 'is', null);

      if (callsError) throw callsError;

      // Fetch credit transactions for spending analysis
      const { data: creditData, error: creditError } = await supabase
        .from('credit_transactions')
        .select('organization_id, amount, transaction_type, created_at');

      if (creditError) throw creditError;

      // Process call statistics by organization
      const callStatsByOrg = callsData?.reduce((acc: Record<string, any>, call) => {
        const orgId = call.organization_id;
        if (!acc[orgId]) {
          acc[orgId] = { 
            count: 0, 
            totalCost: 0, 
            totalDuration: 0,
            recentCalls: []
          };
        }
        acc[orgId].count += 1;
        acc[orgId].totalCost += call.call_cost || 0;
        acc[orgId].totalDuration += call.duration_seconds || 0;
        acc[orgId].recentCalls.push(call);
        return acc;
      }, {}) || {};

      // Process credit transaction statistics
      const creditStatsByOrg = creditData?.reduce((acc: Record<string, any>, tx) => {
        const orgId = tx.organization_id;
        if (!acc[orgId]) {
          acc[orgId] = { totalSpent: 0, totalAdded: 0, transactionCount: 0 };
        }
        if (tx.transaction_type === 'deduction') {
          acc[orgId].totalSpent += Math.abs(tx.amount);
        } else {
          acc[orgId].totalAdded += tx.amount;
        }
        acc[orgId].transactionCount += 1;
        return acc;
      }, {}) || {};

      // Process organizations data with comprehensive details
      const processedOrgs: RetellOrganization[] = orgsData?.map(org => {
        const callStats = callStatsByOrg[org.id] || { count: 0, totalCost: 0, totalDuration: 0 };
        const creditStats = creditStatsByOrg[org.id] || { totalSpent: 0, totalAdded: 0 };
        
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
          total_spend: creditStats.totalSpent,
          phone_numbers: org.phone_numbers || [],
          last_activity: org.updated_at,
          // Extended details
          primary_color: org.primary_color,
          logo_url: org.logo_url,
          stripe_customer_id: org.stripe_customer_id,
          auto_recharge_enabled: org.auto_recharge_enabled,
          auto_recharge_amount: org.auto_recharge_amount,
          low_credit_threshold: org.low_credit_threshold,
          branding: org.branding,
          retell_settings: org.retell_settings,
          data_storage_setting: org.data_storage_setting
        };
      }) || [];

      setOrganizations(processedOrgs);

      // Calculate comprehensive stats
      const totalCredits = processedOrgs.reduce((sum, org) => sum + org.credit_balance, 0);
      const activeAgents = processedOrgs.reduce((sum, org) => sum + (org.agents_count || 0), 0);
      const monthlyRevenue = processedOrgs.reduce((sum, org) => sum + (org.total_spend || 0), 0);
      const totalCalls = processedOrgs.reduce((sum, org) => sum + (org.total_calls || 0), 0);
      const totalDuration = Object.values(callStatsByOrg).reduce((sum: number, stats: any) => sum + (stats.totalDuration || 0), 0);
      const averageCallDuration = totalCalls > 0 ? totalDuration / totalCalls : 0;

      setStats({
        totalOrganizations: processedOrgs.length,
        activeAgents,
        totalCredits,
        monthlyRevenue,
        totalCalls,
        averageCallDuration
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
      await fetchOrganizationsWithDetails();

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
        .limit(20);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching credit history:', error);
      return [];
    }
  };

  const getOrganizationDetails = async (organizationId: string) => {
    try {
      // Get detailed organization info with related data
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .select(`
          *,
          agents:agents(id, name, status, created_at),
          phone_numbers:phone_numbers(*),
          users:users(id, email, first_name, last_name, role, created_at)
        `)
        .eq('id', organizationId)
        .single();

      if (orgError) throw orgError;

      // Get recent calls
      const { data: callsData, error: callsError } = await supabase
        .from('calls')
        .select('*')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (callsError) throw callsError;

      // Get credit transactions
      const { data: creditsData, error: creditsError } = await supabase
        .from('credit_transactions')
        .select('*')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false })
        .limit(15);

      if (creditsError) throw creditsError;

      return {
        organization: orgData,
        recentCalls: callsData || [],
        creditHistory: creditsData || []
      };
    } catch (error) {
      console.error('Error fetching organization details:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchOrganizationsWithDetails();
  }, []);

  return {
    organizations,
    stats,
    loading,
    addCredits,
    getCreditHistory,
    getOrganizationDetails,
    refetch: fetchOrganizationsWithDetails
  };
}