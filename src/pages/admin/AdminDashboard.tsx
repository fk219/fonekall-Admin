import { Building2, Bot, Users, DollarSign, Phone, TrendingUp, AlertCircle, Zap, Loader2 } from "lucide-react";
import { MetricCard } from "@/components/admin/MetricCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useRetellData } from "@/hooks/useRetellData";
export function AdminDashboard() {
  const { dashboardStats, organizations, loading } = useRetellData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your KnightCall AI platform
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard 
          title="Total Organizations" 
          value={dashboardStats?.total_organizations || 0} 
          change="+12%" 
          changeType="positive" 
          icon={Building2} 
          description="from last month" 
        />
        <MetricCard 
          title="Active Agents" 
          value={dashboardStats?.active_agents || 0} 
          change="+23%" 
          changeType="positive" 
          icon={Bot} 
          description="deployed agents" 
        />
        <MetricCard 
          title="Monthly Revenue" 
          value={`$${dashboardStats?.monthly_revenue?.toLocaleString() || "0"}`} 
          change="+8%" 
          changeType="positive" 
          icon={DollarSign} 
          description="from last month" 
        />
        <MetricCard 
          title="Total Calls" 
          value={dashboardStats?.total_calls?.toLocaleString() || "0"} 
          change="+156" 
          changeType="positive" 
          icon={Phone} 
          description="all time" 
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* System Health */}
        <Card className="card-enhanced">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-admin-accent" />
              System Health
            </CardTitle>
            <CardDescription>Real-time platform status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>API Response Time</span>
                <span className="text-success">{dashboardStats?.system_health?.api_response_time || 142}ms</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uptime</span>
                <span className="text-success">{dashboardStats?.system_health?.uptime || 99.98}%</span>
              </div>
              <Progress value={dashboardStats?.system_health?.uptime || 99.98} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Active Connections</span>
                <span>{dashboardStats?.system_health?.active_connections?.toLocaleString() || 2847}</span>
              </div>
              <Progress value={68} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Top Organizations */}
        <Card className="card-enhanced">
          <CardHeader>
            <CardTitle>Top Organizations</CardTitle>
            <CardDescription>By monthly usage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {organizations.slice(0, 4).map((org) => (
                <div key={org.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{org.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {org.current_month_calls.toLocaleString()} calls
                    </p>
                  </div>
                  <Badge variant="secondary">${org.total_spent?.toFixed(2) || "0.00"}</Badge>
                </div>
              ))}
              {organizations.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  No organizations found
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="card-enhanced">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest platform events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[{
              action: "New organization registered",
              org: "StartupCo",
              time: "2 minutes ago",
              type: "success"
            }, {
              action: "Agent deployment failed",
              org: "TechCorp",
              time: "15 minutes ago",
              type: "error"
            }, {
              action: "Credit limit reached",
              org: "SmallBiz Inc",
              time: "1 hour ago",
              type: "warning"
            }, {
              action: "Subscription upgraded",
              org: "Enterprise Corp",
              time: "2 hours ago",
              type: "success"
            }].map((activity, i) => <div key={i} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${activity.type === "success" ? "bg-success" : activity.type === "error" ? "bg-destructive" : "bg-warning"}`} />
                  <div className="space-y-1 flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.org} • {activity.time}
                    </p>
                  </div>
                </div>)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="card-enhanced">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
              <Building2 className="w-6 h-6" />
              <span className="text-sm">Add Organization</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
              <Bot className="w-6 h-6" />
              <span className="text-sm">Deploy Agent</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
              <DollarSign className="w-6 h-6" />
              <span className="text-sm">Add Credits</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
              <Users className="w-6 h-6" />
              <span className="text-sm">Manage Users</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
              <TrendingUp className="w-6 h-6" />
              <span className="text-sm">View Analytics</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
              <AlertCircle className="w-6 h-6" />
              <span className="text-sm">System Alerts</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>;
}