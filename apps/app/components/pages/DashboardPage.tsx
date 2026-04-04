import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui";
import { Activity, FileText, TrendingUp, Users } from "lucide-react";

const stats = [
  { change: "+12%", icon: Users, title: "Total Users", value: "1,234" },
  { change: "+5%", icon: Activity, title: "Active Sessions", value: "89" },
  { change: "+23%", icon: FileText, title: "Reports Generated", value: "456" },
  { change: "+2.1%", icon: TrendingUp, title: "Growth Rate", value: "18.2%" },
];

export function DashboardPage() {
  return (
    <div className="space-y-6 p-6" data-testid="DashboardPage">
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your application.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.change}</span> from last
                month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest events in your application</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-center gap-4">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <div className="flex-1">
                    <p className="text-sm">User action performed</p>
                    <p className="text-xs text-muted-foreground">
                      {item} hour{item > 1 ? "s" : ""} ago
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <button
                className="rounded-lg border p-4 text-left transition-colors hover:bg-accent"
                type="button"
              >
                <FileText className="mb-2 h-5 w-5" />
                <p className="text-sm font-medium">Generate Report</p>
              </button>
              <button
                className="rounded-lg border p-4 text-left transition-colors hover:bg-accent"
                type="button"
              >
                <Users className="mb-2 h-5 w-5" />
                <p className="text-sm font-medium">Manage Users</p>
              </button>
              <button
                className="rounded-lg border p-4 text-left transition-colors hover:bg-accent"
                type="button"
              >
                <Activity className="mb-2 h-5 w-5" />
                <p className="text-sm font-medium">View Analytics</p>
              </button>
              <button
                className="rounded-lg border p-4 text-left transition-colors hover:bg-accent"
                type="button"
              >
                <TrendingUp className="mb-2 h-5 w-5" />
                <p className="text-sm font-medium">Export Data</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
