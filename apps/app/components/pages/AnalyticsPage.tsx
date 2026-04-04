import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui";
import { Activity, DollarSign, TrendingUp, Users } from "lucide-react";

const metrics = [
  {
    change: "+20.1% from last month",
    color: "text-green-600",
    icon: DollarSign,
    title: "Total Revenue",
    value: "$45,231.89",
  },
  {
    change: "+180 from last month",
    color: "text-blue-600",
    icon: Users,
    title: "Active Users",
    value: "2,350",
  },
  {
    change: "+0.5% from last month",
    color: "text-purple-600",
    icon: TrendingUp,
    title: "Conversion Rate",
    value: "3.2%",
  },
  {
    change: "+12s from last month",
    color: "text-orange-600",
    icon: Activity,
    title: "Avg. Session Duration",
    value: "4m 32s",
  },
];

const topPages = [
  { page: "/dashboard", percentage: 35, views: 12543 },
  { page: "/products", percentage: 25, views: 8932 },
  { page: "/settings", percentage: 18, views: 6421 },
  { page: "/reports", percentage: 13, views: 4532 },
  { page: "/about", percentage: 9, views: 3221 },
];

export function AnalyticsPage() {
  return (
    <div className="space-y-6 p-6" data-testid="AnalyticsPage">
      <div>
        <h2 className="text-2xl font-bold">Analytics</h2>
        <p className="text-muted-foreground">
          Track your application's performance and user engagement metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">{metric.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>
              Monthly revenue for the past 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-64 items-center justify-center text-muted-foreground">
              <div className="text-center">
                <TrendingUp className="mx-auto mb-2 h-12 w-12" />
                <p>Chart visualization would go here</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>New vs returning users over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-64 items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Users className="mx-auto mb-2 h-12 w-12" />
                <p>Chart visualization would go here</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Pages</CardTitle>
          <CardDescription>
            Most visited pages in your application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPages.map((item) => (
              <div key={item.page} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="mb-1 flex justify-between">
                    <span className="text-sm font-medium">{item.page}</span>
                    <span className="text-sm text-muted-foreground">
                      {item.views.toLocaleString()} views
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-secondary">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
