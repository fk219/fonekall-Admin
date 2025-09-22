import { useState } from 'react';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Plus, DollarSign, TrendingUp, Users, Calendar } from 'lucide-react';
import { MetricCard } from '@/components/admin/MetricCard';

export const SubscriptionsPage = () => {
  const { subscriptions, creditTransactions, loading, addCredits, updateSubscription, toggleAutoRecharge } = useSubscriptions();
  const { toast } = useToast();
  const [isAddCreditsOpen, setIsAddCreditsOpen] = useState(false);
  const [selectedOrgId, setSelectedOrgId] = useState('');
  const [creditAmount, setCreditAmount] = useState('');
  const [creditDescription, setCreditDescription] = useState('');

  const handleAddCredits = async () => {
    if (!selectedOrgId || !creditAmount) {
      toast({
        title: "Error",
        description: "Please select an organization and enter a credit amount",
        variant: "destructive"
      });
      return;
    }

    const result = await addCredits(selectedOrgId, parseFloat(creditAmount), creditDescription || 'Manual credit addition');
    
    if (result.success) {
      toast({
        title: "Success",
        description: "Credits added successfully"
      });
      setIsAddCreditsOpen(false);
      setCreditAmount('');
      setCreditDescription('');
      setSelectedOrgId('');
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to add credits",
        variant: "destructive"
      });
    }
  };

  const handlePlanChange = async (orgId: string, newPlan: string) => {
    const result = await updateSubscription(orgId, newPlan);
    
    if (result.success) {
      toast({
        title: "Success",
        description: "Subscription plan updated successfully"
      });
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to update subscription",
        variant: "destructive"
      });
    }
  };

  const handleAutoRechargeToggle = async (orgId: string, enabled: boolean) => {
    const result = await toggleAutoRecharge(orgId, enabled);
    
    if (result.success) {
      toast({
        title: "Success",
        description: `Auto-recharge ${enabled ? 'enabled' : 'disabled'} successfully`
      });
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to update auto-recharge",
        variant: "destructive"
      });
    }
  };

  const totalRevenue = subscriptions.reduce((sum, sub) => sum + sub.amount, 0);
  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active').length;
  const totalCreditsAdded = creditTransactions
    .filter(tx => tx.transaction_type === 'addition')
    .reduce((sum, tx) => sum + tx.amount, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Loading subscriptions...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Subscription & Credit Management</h1>
          <p className="text-muted-foreground">
            Manage organization subscriptions, credits, and billing settings
          </p>
        </div>
        <Dialog open={isAddCreditsOpen} onOpenChange={setIsAddCreditsOpen}>
          <DialogTrigger asChild>
            <Button className="btn-premium shadow-elevated hover:shadow-soft">
              <Plus className="w-4 h-4 mr-2" />
              Add Credits
            </Button>
          </DialogTrigger>
          <DialogContent className="card-enhanced">
            <DialogHeader>
              <DialogTitle className="text-foreground">Add Credits to Organization</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="organization">Organization</Label>
                <Select value={selectedOrgId} onValueChange={setSelectedOrgId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select organization" />
                  </SelectTrigger>
                  <SelectContent>
                    {subscriptions.map(sub => (
                      <SelectItem key={sub.organization_id} value={sub.organization_id}>
                        {sub.organization_id} ({sub.plan})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="amount">Credit Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={creditAmount}
                  onChange={(e) => setCreditAmount(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  placeholder="Reason for credit addition"
                  value={creditDescription}
                  onChange={(e) => setCreditDescription(e.target.value)}
                />
              </div>
              <Button onClick={handleAddCredits} className="w-full btn-premium">
                Add Credits
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          change="+12.5%"
          changeType="positive"
          icon={DollarSign}
        />
        <MetricCard
          title="Active Subscriptions"
          value={activeSubscriptions.toString()}
          change="+5"
          changeType="positive"
          icon={Users}
        />
        <MetricCard
          title="Credits Added (Month)"
          value={totalCreditsAdded.toFixed(2)}
          change="+8.2%"
          changeType="positive"
          icon={CreditCard}
        />
        <MetricCard
          title="Avg Plan Value"
          value={`$${activeSubscriptions > 0 ? (totalRevenue / activeSubscriptions).toFixed(0) : '0'}`}
          change="+3.1%"
          changeType="positive"
          icon={TrendingUp}
        />
      </div>

      {/* Subscriptions Table */}
      <Card className="card-enhanced">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Active Subscriptions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-muted-foreground">Organization</TableHead>
                <TableHead className="text-muted-foreground">Plan</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">Amount</TableHead>
                <TableHead className="text-muted-foreground">Auto Recharge</TableHead>
                <TableHead className="text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.map((subscription) => (
                <TableRow key={subscription.id}>
                  <TableCell className="font-medium text-foreground">
                    {subscription.organization_id}
                  </TableCell>
                  <TableCell>
                    <Select 
                      value={subscription.plan} 
                      onValueChange={(value) => handlePlanChange(subscription.organization_id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="starter">Starter</SelectItem>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="enterprise">Enterprise</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={subscription.status === 'active' ? 'default' : 'secondary'}
                      className={subscription.status === 'active' ? 'bg-success text-success-foreground' : ''}
                    >
                      {subscription.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-foreground">
                    ${subscription.amount}/month
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={subscription.auto_renew}
                      onCheckedChange={(checked) => handleAutoRechargeToggle(subscription.organization_id, checked)}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedOrgId(subscription.organization_id);
                        setIsAddCreditsOpen(true);
                      }}
                    >
                      Add Credits
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent Credit Transactions */}
      <Card className="card-enhanced">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Recent Credit Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-muted-foreground">Organization</TableHead>
                <TableHead className="text-muted-foreground">Type</TableHead>
                <TableHead className="text-muted-foreground">Amount</TableHead>
                <TableHead className="text-muted-foreground">Balance After</TableHead>
                <TableHead className="text-muted-foreground">Description</TableHead>
                <TableHead className="text-muted-foreground">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {creditTransactions.slice(0, 10).map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium text-foreground">
                    {transaction.organization_id}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={transaction.transaction_type === 'addition' ? 'default' : 'secondary'}
                      className={transaction.transaction_type === 'addition' ? 'bg-success text-success-foreground' : 'bg-destructive text-destructive-foreground'}
                    >
                      {transaction.transaction_type}
                    </Badge>
                  </TableCell>
                  <TableCell className={`font-medium ${transaction.transaction_type === 'addition' ? 'text-success' : 'text-destructive'}`}>
                    {transaction.transaction_type === 'addition' ? '+' : '-'}
                    {Math.abs(transaction.amount).toFixed(4)}
                  </TableCell>
                  <TableCell className="text-foreground">
                    {transaction.balance_after.toFixed(4)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {transaction.description}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(transaction.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};