import { Building2, Bot, Users, DollarSign, Phone, TrendingUp, AlertCircle, Zap } from "lucide-react";
import { MetricCard } from "@/components/admin/MetricCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
export function AdminDashboard() {
  return <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your KnightCall AI platform
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Total Organizations" value={247} change="+12%" changeType="positive" icon={Building2} description="from last month" />
        <MetricCard title="Active Agents" value={1834} change="+23%" changeType="positive" icon={Bot} description="deployed agents" />
        <MetricCard title="Monthly Revenue" value="$48,392" change="+8%" changeType="positive" icon={DollarSign} description="from last month" />
        <MetricCard title="Total Calls Today" value={12847} change="+156" changeType="positive" icon={Phone} description="vs yesterday" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* System Health */}
        <Card className="bg-gradient-surface border-admin-border bg-gray-50">
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
                <span className="text-success">142ms</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uptime</span>
                <span className="text-success">99.98%</span>
              </div>
              <Progress value={99.98} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Active Connections</span>
                <span>2,847</span>
              </div>
              <Progress value={68} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Top Organizations */}
        <Card className="bg-gradient-surface border-admin-border">
          <CardHeader>
            <CardTitle>Top Organizations</CardTitle>
            <CardDescription>By monthly usage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[{
              name: "TechCorp Solutions",
              calls: 8934,
              revenue: "$12,450"
            }, {
              name: "Global Dynamics",
              calls: 6721,
              revenue: "$9,820"
            }, {
              name: "Innovation Labs",
              calls: 5412,
              revenue: "$7,650"
            }, {
              name: "Future Systems",
              calls: 4238,
              revenue: "$6,340"
            }].map((org, i) => <div key={i} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{org.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {org.calls.toLocaleString()} calls
                    </p>
                  </div>
                  <Badge variant="secondary">{org.revenue}</Badge>
                </div>)}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="bg-gradient-surface border-admin-border bg-gray-50">
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
      <Card className="bg-gradient-surface border-admin-border">
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