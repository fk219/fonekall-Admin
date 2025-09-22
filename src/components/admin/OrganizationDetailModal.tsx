import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Building2, Phone, Bot, CreditCard, Users, Calendar, DollarSign, Activity, Plus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Organization } from "@/hooks/useOrganizations";
import { supabase } from "@/integrations/supabase/client";

interface CreditTransaction {
  id: string;
  created_at: string;
  transaction_type: string;
  amount: number;
  balance_before: number;
  balance_after: number;
  description: string;
}

interface OrganizationDetailModalProps {
  organization: Organization | null;
  isOpen: boolean;
  onClose: () => void;
  onAddCredits: (orgId: string, amount: number, description?: string) => Promise<boolean>;
}

export function OrganizationDetailModal({ organization, isOpen, onClose, onAddCredits }: OrganizationDetailModalProps) {
  // All hooks must be called before any conditional returns
  const [creditAmount, setCreditAmount] = useState("");
  const [isAddingCredits, setIsAddingCredits] = useState(false);
  const [creditHistory, setCreditHistory] = useState<CreditTransaction[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const { toast } = useToast();

  const fetchCreditHistory = async () => {
    if (!organization) return;
    
    setLoadingHistory(true);
    try {
      const { data, error } = await supabase
        .from('credit_transactions')
        .select('*')
        .eq('organization_id', organization.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setCreditHistory(data || []);
    } catch (error) {
      console.error('Error fetching credit history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleAddCredits = async () => {
    if (!organization || !creditAmount || parseFloat(creditAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid credit amount",
        variant: "destructive",
      });
      return;
    }

    setIsAddingCredits(true);
    const success = await onAddCredits(
      organization.id, 
      parseFloat(creditAmount),
      `Manual credit addition by admin`
    );
    
    if (success) {
      setCreditAmount("");
      await fetchCreditHistory(); // Refresh history
    }
    
    setIsAddingCredits(false);
  };

  useEffect(() => {
    if (isOpen && organization) {
      fetchCreditHistory();
    }
  }, [isOpen, organization]);

  // Early return after all hooks are called
  if (!organization) return null;

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? "bg-success text-success-foreground" 
      : "bg-destructive text-destructive-foreground";
  };

  const getPlanColor = (plan: string) => {
    switch (plan.toLowerCase()) {
      case "enterprise":
        return "bg-primary text-primary-foreground";
      case "professional":
        return "bg-gradient-accent text-white";
      case "starter":
        return "bg-secondary text-secondary-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary-foreground" />
            </div>
            {organization.name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Basic Information */}
          <Card className="lg:col-span-2 bg-gradient-surface border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Organization Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Organization ID</Label>
                  <p className="font-mono text-sm">{organization.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                  <p className="text-sm">{organization.email || organization.support_email || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Phone Numbers</Label>
                  <p className="text-sm">
                    {organization.phone_numbers?.length 
                      ? organization.phone_numbers.join(', ')
                      : 'No phone numbers'
                    }
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Join Date</Label>
                  <p className="text-sm">{new Date(organization.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Domain</Label>
                  <p className="text-sm">{organization.domain || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Monthly Call Limit</Label>
                  <p className="text-sm">{organization.monthly_call_limit.toLocaleString()}</p>
                </div>
              </div>

              <Separator />

              <div className="flex gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Plan</Label>
                  <div className="mt-1">
                    <Badge className={getPlanColor(organization.plan)}>{organization.plan}</Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  <div className="mt-1">
                    <Badge className={getStatusColor(organization.is_active)}>
                      {organization.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="space-y-4">
            <Card className="bg-gradient-surface border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Bot className="w-4 h-4 text-primary" />
                  Agents Deployed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{organization.agents_count || 0}</div>
                <p className="text-xs text-muted-foreground">Active agents</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-surface border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" />
                  Total Calls
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{organization.total_calls || 0}</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-surface border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-primary" />
                  Monthly Spend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${(organization.total_spend || 0).toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Total spend</p>
              </CardContent>
            </Card>
          </div>

          {/* Credit Management */}
          <Card className="lg:col-span-3 bg-gradient-surface border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Credit Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Current Balance</h4>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{organization.credit_balance.toLocaleString()}</div>
                      <p className="text-sm text-muted-foreground">Available credits</p>
                    </div>
                  </div>

                <div>
                  <h4 className="font-medium mb-3">Add Credits</h4>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={creditAmount}
                      onChange={(e) => setCreditAmount(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleAddCredits}
                      disabled={isAddingCredits}
                      className="bg-gradient-primary hover:opacity-90"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      {isAddingCredits ? "Adding..." : "Add"}
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-3">Credit History</h4>
                {loadingHistory ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="ml-2 text-sm text-muted-foreground">Loading history...</span>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {creditHistory.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">No credit history found</p>
                    ) : (
                      creditHistory.map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${
                              transaction.transaction_type === 'addition' ? 'bg-success' : 'bg-warning'
                            }`} />
                            <div>
                              <p className="text-sm font-medium">
                                {transaction.transaction_type === 'addition' ? 'Added' : 'Used'} Credits
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(transaction.created_at).toLocaleDateString()}
                              </p>
                              {transaction.description && (
                                <p className="text-xs text-muted-foreground">{transaction.description}</p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`text-sm font-medium ${
                              transaction.transaction_type === 'addition' ? 'text-success' : 'text-warning'
                            }`}>
                              {transaction.transaction_type === 'addition' ? '+' : '-'}
                              {Math.abs(transaction.amount).toLocaleString()}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Balance: {transaction.balance_after.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Activity & Performance */}
          <Card className="lg:col-span-3 bg-gradient-surface border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Recent Activity & Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h5 className="font-medium text-sm mb-2">Last Activity</h5>
                  <p className="text-sm text-muted-foreground">
                    {organization.last_activity 
                      ? new Date(organization.last_activity).toLocaleString()
                      : "No recent activity"
                    }
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h5 className="font-medium text-sm mb-2">Monthly Calls</h5>
                  <p className="text-sm text-muted-foreground">
                    {organization.current_month_calls} / {organization.monthly_call_limit}
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h5 className="font-medium text-sm mb-2">Auto Recharge</h5>
                  <p className="text-sm text-muted-foreground">
                    ${(organization as any).auto_recharge_amount || 0} when below ${(organization as any).low_credit_threshold || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button className="bg-gradient-primary hover:opacity-90">
            Edit Organization
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}