import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Building2, 
  CreditCard, 
  Phone, 
  Users, 
  Calendar, 
  DollarSign,
  Activity,
  Settings,
  BarChart3,
  Mail,
  Globe,
  Shield
} from 'lucide-react';
import { RetellOrganization } from '@/hooks/useRetellOrganizations';
import { useToast } from '@/hooks/use-toast';

interface OrganizationDetailData {
  organization: RetellOrganization & {
    agents?: any[];
    phone_numbers?: any[];
    users?: any[];
  };
  recentCalls: any[];
  creditHistory: any[];
}

interface ComprehensiveOrganizationModalProps {
  organization: RetellOrganization | null;
  isOpen: boolean;
  onClose: () => void;
  onAddCredits: (orgId: string, amount: number, description?: string) => Promise<boolean>;
  getOrganizationDetails: (orgId: string) => Promise<OrganizationDetailData | null>;
}

export function ComprehensiveOrganizationModal({
  organization,
  isOpen,
  onClose,
  onAddCredits,
  getOrganizationDetails
}: ComprehensiveOrganizationModalProps) {
  const [creditAmount, setCreditAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [detailedData, setDetailedData] = useState<OrganizationDetailData | null>(null);
  const [dataLoading, setDataLoading] = useState(false);
  const { toast } = useToast();

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
      // Refresh detailed data
      await fetchDetailedData();
    }
    setLoading(false);
  };

  const fetchDetailedData = async () => {
    if (!organization) return;
    
    setDataLoading(true);
    try {
      const data = await getOrganizationDetails(organization.id);
      setDetailedData(data);
    } catch (error) {
      console.error('Error fetching detailed data:', error);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && organization) {
      fetchDetailedData();
    }
  }, [isOpen, organization]);

  if (!organization) return null;

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-success text-success-foreground' : 'bg-destructive text-destructive-foreground';
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'enterprise': return 'bg-primary text-primary-foreground';
      case 'professional': return 'bg-accent text-accent-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto card-enhanced">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-foreground">
            <Building2 className="w-6 h-6 text-primary" />
            {organization.name}
            <Badge className={getStatusColor(organization.is_active)}>
              {organization.is_active ? 'Active' : 'Inactive'}
            </Badge>
            <Badge className={getPlanColor(organization.plan)}>
              {organization.plan}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="billing">Billing & Credits</TabsTrigger>
            <TabsTrigger value="activity">Call Activity</TabsTrigger>
            <TabsTrigger value="team">Team & Assets</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Organization Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="card-enhanced">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Organization Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-sm">
                    <span className="text-muted-foreground">ID:</span>
                    <span className="ml-2 font-mono text-xs">{organization.id.slice(0, 8)}...</span>
                  </div>
                  {organization.domain && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Domain:</span>
                      <span className="ml-2">{organization.domain}</span>
                    </div>
                  )}
                  {organization.support_email && (
                    <div className="text-sm flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      <span className="text-muted-foreground">Support:</span>
                      <span className="ml-1">{organization.support_email}</span>
                    </div>
                  )}
                  <div className="text-sm flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span className="text-muted-foreground">Joined:</span>
                    <span className="ml-1">{new Date(organization.created_at).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-enhanced">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Calls:</span>
                    <span className="font-medium">{organization.total_calls?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">This Month:</span>
                    <span className="font-medium">{organization.current_month_calls?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Call Limit:</span>
                    <span className="font-medium">{organization.monthly_call_limit?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Agents:</span>
                    <span className="font-medium">{organization.agents_count || 0}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-enhanced">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Financial Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Credit Balance:</span>
                    <span className="font-medium text-primary">{organization.credit_balance?.toFixed(4) || '0.0000'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Spent:</span>
                    <span className="font-medium">${organization.total_spend?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Plan Value:</span>
                    <span className="font-medium">
                      ${organization.plan === 'enterprise' ? '299' : organization.plan === 'professional' ? '99' : '29'}/month
                    </span>
                  </div>
                  {organization.auto_recharge_enabled && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Auto Recharge:</span>
                      <span className="font-medium text-success">
                        ${organization.auto_recharge_amount || 50}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Settings Overview */}
            {(organization.data_storage_setting || organization.low_credit_threshold) && (
              <Card className="card-enhanced">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Settings & Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {organization.data_storage_setting && (
                    <div>
                      <h4 className="font-medium mb-1">Data Storage</h4>
                      <Badge variant="outline">{organization.data_storage_setting}</Badge>
                    </div>
                  )}
                  {organization.low_credit_threshold && (
                    <div>
                      <h4 className="font-medium mb-1">Low Credit Alert</h4>
                      <Badge variant="outline">${organization.low_credit_threshold}</Badge>
                    </div>
                  )}
                  {organization.stripe_customer_id && (
                    <div>
                      <h4 className="font-medium mb-1">Stripe Customer</h4>
                      <Badge variant="outline" className="font-mono text-xs">
                        {organization.stripe_customer_id.slice(0, 12)}...
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            {/* Credit Management */}
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Credit Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Current Balance</h4>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {organization.credit_balance?.toFixed(4) || '0.0000'}
                      </div>
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
                  <Activity className="w-5 h-5" />
                  Recent Credit Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dataLoading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading transaction history...</div>
                ) : detailedData?.creditHistory.length ? (
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
                      {detailedData.creditHistory.slice(0, 10).map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>
                            <Badge 
                              variant={transaction.transaction_type === 'addition' ? 'default' : 'secondary'}
                              className={
                                transaction.transaction_type === 'addition' 
                                  ? 'bg-success text-success-foreground' 
                                  : 'bg-destructive text-destructive-foreground'
                              }
                            >
                              {transaction.transaction_type}
                            </Badge>
                          </TableCell>
                          <TableCell className={`font-medium ${
                            transaction.transaction_type === 'addition' ? 'text-success' : 'text-destructive'
                          }`}>
                            {transaction.transaction_type === 'addition' ? '+' : ''}
                            {transaction.amount?.toFixed(4)}
                          </TableCell>
                          <TableCell>{transaction.balance_after?.toFixed(4)}</TableCell>
                          <TableCell className="text-muted-foreground max-w-xs truncate">
                            {transaction.description}
                          </TableCell>
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
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            {/* Recent Calls */}
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Recent Call Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dataLoading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading call history...</div>
                ) : detailedData?.recentCalls.length ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Direction</TableHead>
                        <TableHead>From/To</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Cost</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {detailedData.recentCalls.map((call) => (
                        <TableRow key={call.id}>
                          <TableCell>
                            <Badge variant="outline">{call.direction || 'Unknown'}</Badge>
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {call.direction === 'outbound' ? call.to_number : call.from_number}
                          </TableCell>
                          <TableCell>
                            {call.duration_seconds ? 
                              `${Math.floor(call.duration_seconds / 60)}:${(call.duration_seconds % 60).toString().padStart(2, '0')}` : 
                              'N/A'
                            }
                          </TableCell>
                          <TableCell className="font-medium">
                            ${call.call_cost?.toFixed(4) || '0.0000'}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={call.status === 'completed' ? 'default' : 'secondary'}
                              className={call.status === 'completed' ? 'bg-success text-success-foreground' : ''}
                            >
                              {call.status || 'Unknown'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(call.created_at).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">No recent call activity</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            {/* Team Members */}
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Team Members
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dataLoading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading team data...</div>
                ) : detailedData?.organization.users?.length ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Joined</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {detailedData.organization.users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            {user.first_name || user.last_name ? 
                              `${user.first_name || ''} ${user.last_name || ''}`.trim() : 
                              'N/A'
                            }
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{user.role || 'User'}</Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(user.created_at).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">No team members found</div>
                )}
              </CardContent>
            </Card>

            {/* Phone Numbers */}
            {detailedData?.organization.phone_numbers?.length ? (
              <Card className="card-enhanced">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    Phone Numbers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {detailedData.organization.phone_numbers.map((phone, index) => (
                      <div key={(phone as any)?.id || index} className="p-3 border rounded-lg">
                        <div className="font-mono font-medium">
                          {typeof phone === 'string' ? phone : (phone as any)?.number || 'Unknown'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {typeof phone === 'object' && phone ? 
                            `${(phone as any)?.type || 'Unknown type'} • ${(phone as any)?.status || 'Unknown status'}` : 
                            'Phone Number'
                          }
                        </div>
                        {typeof phone === 'object' && phone && (phone as any)?.nickname && (
                          <div className="text-sm text-muted-foreground">{(phone as any).nickname}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </TabsContent>
        </Tabs>

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