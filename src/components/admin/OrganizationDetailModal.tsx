import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Building2, CreditCard, Phone, Users, Calendar, DollarSign, Activity } from 'lucide-react';
import { RetellOrganization } from '@/hooks/useRetellOrganizations';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

interface OrganizationDetailModalProps {
  organization: RetellOrganization | null;
  isOpen: boolean;
  onClose: () => void;
  onAddCredits: (orgId: string, amount: number, description?: string) => Promise<boolean>;
}

export function OrganizationDetailModal({
  organization,
  isOpen,
  onClose,
  onAddCredits
}: OrganizationDetailModalProps) {
  const [creditAmount, setCreditAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [creditHistory, setCreditHistory] = useState<CreditTransaction[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const { toast } = useToast();

  const fetchCreditHistory = async () => {
    if (!organization) return;
    
    setHistoryLoading(true);
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
      setHistoryLoading(false);
    }
  };

  const handleAddCredits = async () => {
    if (!organization || !creditAmount) return;

    const amount = parseFloat(creditAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid credit amount",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    const success = await onAddCredits(organization.id, amount, `Admin credit addition for ${organization.name}`);
    if (success) {
      setCreditAmount('');
      await fetchCreditHistory();
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen && organization) {
      fetchCreditHistory();
    }
  }, [isOpen, organization]);

  if (!organization) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto card-enhanced">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-foreground">
            <Building2 className="w-6 h-6 text-primary" />
            {organization.name}
            <Badge className={organization.is_active ? 'bg-success text-success-foreground' : 'bg-destructive text-destructive-foreground'}>
              {organization.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6">
          {/* Organization Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="card-enhanced">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Organization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold">{organization.name}</div>
                <p className="text-xs text-muted-foreground">{organization.plan} plan</p>
              </CardContent>
            </Card>

            <Card className="card-enhanced">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Agents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{organization.agents_count || 0}</div>
                <p className="text-xs text-muted-foreground">Active agents</p>
              </CardContent>
            </Card>

            <Card className="card-enhanced">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Calls
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{organization.total_calls?.toLocaleString() || 0}</div>
                <p className="text-xs text-muted-foreground">Total calls</p>
              </CardContent>
            </Card>

            <Card className="card-enhanced">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Spend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${(organization.total_spend || 0).toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Total spend</p>
              </CardContent>
            </Card>
          </div>

          {/* Credit Management */}
          <Card className="lg:col-span-3 card-enhanced">
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
                    <div className="space-y-3">
                      <Label htmlFor="creditAmount">Amount</Label>
                      <Input
                        id="creditAmount"
                        type="number"
                        placeholder="Enter credit amount"
                        value={creditAmount}
                        onChange={(e) => setCreditAmount(e.target.value)}
                      />
                      <Button 
                        onClick={handleAddCredits} 
                        disabled={loading || !creditAmount}
                        className="w-full btn-premium"
                      >
                        {loading ? 'Adding...' : 'Add Credits'}
                      </Button>
                    </div>
                  </div>
                </div>
            </CardContent>
          </Card>

          {/* Credit History */}
          <Card className="card-enhanced">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Recent Credit Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {historyLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading transaction history...</div>
              ) : creditHistory.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Balance After</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {creditHistory.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          <Badge 
                            variant={transaction.transaction_type === 'addition' ? 'default' : 'secondary'}
                            className={transaction.transaction_type === 'addition' ? 'bg-success text-success-foreground' : 'bg-destructive text-destructive-foreground'}
                          >
                            {transaction.transaction_type}
                          </Badge>
                        </TableCell>
                        <TableCell className={`font-medium ${transaction.transaction_type === 'addition' ? 'text-success' : 'text-destructive'}`}>
                          {transaction.transaction_type === 'addition' ? '+' : ''}
                          {transaction.amount.toFixed(4)}
                        </TableCell>
                        <TableCell>{transaction.balance_after.toFixed(4)}</TableCell>
                        <TableCell className="text-muted-foreground max-w-xs truncate">{transaction.description}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(transaction.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">No transaction history available</div>
              )}
            </CardContent>
          </Card>

          {/* Organization Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Organization ID:</span>
                  <span className="font-mono text-sm">{organization.id.slice(0, 8)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span>{organization.email || organization.support_email || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Domain:</span>
                  <span>{organization.domain || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Join Date:</span>
                  <span>{new Date(organization.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Activity:</span>
                  <span>{organization.last_activity ? new Date(organization.last_activity).toLocaleDateString() : 'N/A'}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Usage & Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monthly Calls:</span>
                  <span>{organization.current_month_calls?.toLocaleString() || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Call Limit:</span>
                  <span>{organization.monthly_call_limit?.toLocaleString() || 'Unlimited'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Calls:</span>
                  <span>{organization.total_calls?.toLocaleString() || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Auto Recharge:</span>
                  <Badge variant={organization.auto_recharge_enabled ? 'default' : 'secondary'}>
                    {organization.auto_recharge_enabled ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
                {organization.auto_recharge_enabled && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Recharge Amount:</span>
                    <span>${organization.auto_recharge_amount || 50}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button className="btn-premium">
            Edit Organization
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}