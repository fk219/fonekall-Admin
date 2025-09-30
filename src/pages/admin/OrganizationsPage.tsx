import { useState } from "react";
import { Plus, Search, MoreHorizontal, Building2, Bot, CreditCard, Users, Eye, Loader2, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ComprehensiveOrganizationModal } from "@/components/admin/ComprehensiveOrganizationModal";
import { CreateOrganizationModal } from "@/components/admin/CreateOrganizationModal";
import { useRetellOrganizations, RetellOrganization } from "@/hooks/useRetellOrganizations";
import { MetricCard } from "@/components/admin/MetricCard";

export function OrganizationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrganization, setSelectedOrganization] = useState<RetellOrganization | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const { organizations, stats, loading, addCredits, getOrganizationDetails, refetch } = useRetellOrganizations();

  const filteredOrgs = organizations.filter(org =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (org.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Organizations</h1>
          <p className="text-muted-foreground">
            Manage all registered organizations and their subscriptions
          </p>
        </div>
        <Button 
          className="btn-premium shadow-elevated hover:shadow-soft"
          onClick={() => setIsCreateModalOpen(true)}
          data-testid="button-add-organization"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Organization
        </Button>
      </div>

      {/* Stats Cards */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-gradient-surface border-border shadow-elevated">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-8 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-4">
          <MetricCard
            title="Total Organizations"
            value={stats.totalOrganizations}
            icon={Building2}
            description="Active organizations"
          />
          <MetricCard
            title="Active Agents"
            value={stats.activeAgents}
            icon={Bot}
            description="Deployed across all orgs"
          />
          <MetricCard
            title="Total Credits"
            value={stats.totalCredits.toLocaleString()}
            icon={CreditCard}
            description="Available credits"
          />
          <MetricCard
            title="Monthly Revenue"
            value={`$${stats.monthlyRevenue.toLocaleString()}`}
            icon={DollarSign}
            description="This month's revenue"
          />
        </div>
      )}

      {/* Search and Filters */}
      <Card className="card-enhanced shadow-soft">
        <CardHeader>
          <CardTitle>Organizations List</CardTitle>
          <CardDescription>
            View and manage all organizations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search organizations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center space-x-4 p-4">
                  <div className="rounded-full bg-muted h-10 w-10"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                    <div className="h-3 bg-muted rounded w-1/6"></div>
                  </div>
                  <div className="h-6 bg-muted rounded w-20"></div>
                  <div className="h-6 bg-muted rounded w-16"></div>
                  <div className="h-4 bg-muted rounded w-12"></div>
                </div>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organization</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Agents</TableHead>
                  <TableHead>Credits</TableHead>
                  <TableHead>Total Calls</TableHead>
                  <TableHead>Monthly Spend</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrgs.map((org) => (
                  <TableRow 
                    key={org.id} 
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => {
                      setSelectedOrganization(org);
                      setIsModalOpen(true);
                    }}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-gradient-primary text-white">
                            {org.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{org.name}</div>
                          <div className="text-sm text-muted-foreground">{org.email || org.support_email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPlanColor(org.plan)}>{org.plan}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(org.is_active)}>
                        {org.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{org.agents_count || 0}</TableCell>
                    <TableCell className="font-medium">{org.credit_balance.toLocaleString()}</TableCell>
                    <TableCell className="font-medium">{org.total_calls || 0}</TableCell>
                    <TableCell className="font-medium">${(org.total_spend || 0).toFixed(2)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(org.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            className="h-8 w-8 p-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrganization(org);
                            setIsModalOpen(true);
                          }}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>Edit Organization</DropdownMenuItem>
                          <DropdownMenuItem>Add Credits</DropdownMenuItem>
                          <DropdownMenuItem>Manage Subscription</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            Suspend Organization
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <ComprehensiveOrganizationModal
        organization={selectedOrganization}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedOrganization(null);
        }}
        onAddCredits={addCredits}
        getOrganizationDetails={getOrganizationDetails}
      />

      <CreateOrganizationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => refetch()}
      />
    </div>
  );
}