import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Building2, Phone, Bot, CreditCard, Users, Calendar, DollarSign, Activity, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Organization {
  id: string;
  name: string;
  email: string;
  plan: string;
  status: string;
  agents: number;
  credits: number;
  usage: string;
  joinDate: string;
  phone?: string;
  username?: string;
  password?: string;
  totalCalls?: number;
  monthlySpend?: number;
  lastActivity?: string;
}

interface OrganizationDetailModalProps {
  organization: Organization | null;
  isOpen: boolean;
  onClose: () => void;
}

export function OrganizationDetailModal({ organization, isOpen, onClose }: OrganizationDetailModalProps) {
  const [creditAmount, setCreditAmount] = useState("");
  const [isAddingCredits, setIsAddingCredits] = useState(false);
  const { toast } = useToast();

  if (!organization) return null;

  const handleAddCredits = async () => {
    if (!creditAmount || parseInt(creditAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid credit amount",
        variant: "destructive",
      });
      return;
    }

    setIsAddingCredits(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Credits Added",
      description: `Successfully added ${creditAmount} credits to ${organization.name}`,
    });
    
    setCreditAmount("");
    setIsAddingCredits(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-success text-success-foreground";
      case "Trial":
        return "bg-warning text-warning-foreground";
      case "Suspended":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "Enterprise":
        return "bg-primary text-primary-foreground";
      case "Professional":
        return "bg-gradient-accent text-white";
      case "Starter":
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
                  <p className="text-sm">{organization.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Phone Number</Label>
                  <p className="text-sm">{organization.phone || "+1 (555) 123-4567"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Join Date</Label>
                  <p className="text-sm">{new Date(organization.joinDate).toLocaleDateString()}</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Username</Label>
                  <p className="text-sm font-mono">{organization.username || "org_" + organization.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Password</Label>
                  <p className="text-sm font-mono">{"*".repeat(12)}</p>
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
                    <Badge className={getStatusColor(organization.status)}>{organization.status}</Badge>
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
                <div className="text-2xl font-bold">{organization.agents}</div>
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
                <div className="text-2xl font-bold">{organization.totalCalls || 1247}</div>
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
                <div className="text-2xl font-bold">{organization.usage}</div>
                <p className="text-xs text-muted-foreground">Current month</p>
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
                    <div className="text-2xl font-bold text-primary">{organization.credits.toLocaleString()}</div>
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
                <div className="space-y-2">
                  {[
                    { date: "2024-03-15", action: "Added", amount: 1000, balance: organization.credits },
                    { date: "2024-03-10", action: "Used", amount: -250, balance: organization.credits - 1000 },
                    { date: "2024-03-05", action: "Added", amount: 500, balance: organization.credits - 750 },
                  ].map((transaction, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${transaction.amount > 0 ? 'bg-success' : 'bg-warning'}`} />
                        <div>
                          <p className="text-sm font-medium">{transaction.action} Credits</p>
                          <p className="text-xs text-muted-foreground">{transaction.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${transaction.amount > 0 ? 'text-success' : 'text-warning'}`}>
                          {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">Balance: {transaction.balance.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
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
                  <p className="text-sm text-muted-foreground">{organization.lastActivity || "2 hours ago"}</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h5 className="font-medium text-sm mb-2">Success Rate</h5>
                  <p className="text-sm text-muted-foreground">94.2%</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h5 className="font-medium text-sm mb-2">Avg Call Duration</h5>
                  <p className="text-sm text-muted-foreground">3m 24s</p>
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