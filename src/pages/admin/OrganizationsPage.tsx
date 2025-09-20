import { useState } from "react";
import { Plus, Search, MoreHorizontal, Building2, Bot, CreditCard, Users } from "lucide-react";
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

const organizations = [
  {
    id: "1",
    name: "TechCorp Solutions",
    email: "admin@techcorp.com",
    plan: "Enterprise",
    status: "Active",
    agents: 24,
    credits: 5420,
    usage: "$2,340",
    joinDate: "2024-01-15",
  },
  {
    id: "2",
    name: "Global Dynamics",
    email: "contact@globaldynamics.com",
    plan: "Professional",
    status: "Active",
    agents: 18,
    credits: 3200,
    usage: "$1,890",
    joinDate: "2024-02-08",
  },
  {
    id: "3",
    name: "Innovation Labs",
    email: "info@innovationlabs.io",
    plan: "Professional",
    status: "Active",
    agents: 12,
    credits: 2100,
    usage: "$1,420",
    joinDate: "2024-02-22",
  },
  {
    id: "4",
    name: "StartupCo",
    email: "team@startupco.com",
    plan: "Starter",
    status: "Trial",
    agents: 3,
    credits: 500,
    usage: "$89",
    joinDate: "2024-03-10",
  },
  {
    id: "5",
    name: "SmallBiz Inc",
    email: "contact@smallbiz.com",
    plan: "Starter",
    status: "Suspended",
    agents: 5,
    credits: 0,
    usage: "$156",
    joinDate: "2024-01-28",
  },
];

export function OrganizationsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrgs = organizations.filter(org =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        return "bg-admin-accent text-white";
      case "Starter":
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
        <Button className="bg-gradient-primary hover:opacity-90">
          <Plus className="w-4 h-4 mr-2" />
          Add Organization
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-surface border-admin-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Organizations</CardTitle>
            <Building2 className="h-4 w-4 text-admin-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{organizations.length}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-surface border-admin-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <Bot className="h-4 w-4 text-admin-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {organizations.reduce((sum, org) => sum + org.agents, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all organizations
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-surface border-admin-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
            <CreditCard className="h-4 w-4 text-admin-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {organizations.reduce((sum, org) => sum + org.credits, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Available credits
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-surface border-admin-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-admin-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$6,895</div>
            <p className="text-xs text-muted-foreground">
              +8% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="bg-gradient-surface border-admin-border">
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

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organization</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Agents</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrgs.map((org) => (
                <TableRow key={org.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gradient-primary text-white">
                          {org.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{org.name}</div>
                        <div className="text-sm text-muted-foreground">{org.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPlanColor(org.plan)}>{org.plan}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(org.status)}>{org.status}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{org.agents}</TableCell>
                  <TableCell>{org.credits.toLocaleString()}</TableCell>
                  <TableCell className="font-medium">{org.usage}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(org.joinDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
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
        </CardContent>
      </Card>
    </div>
  );
}