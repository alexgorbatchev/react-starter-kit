import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui";
import { Calendar, Download, FileText, Filter } from "lucide-react";

const reports = [
  {
    date: "2024-01-01",
    id: 1,
    name: "Monthly Sales Report",
    status: "Ready",
    type: "Sales",
  },
  {
    date: "2024-01-15",
    id: 2,
    name: "User Activity Report",
    status: "Ready",
    type: "Analytics",
  },
  {
    date: "2024-01-20",
    id: 3,
    name: "Financial Summary",
    status: "Processing",
    type: "Finance",
  },
  {
    date: "2024-01-25",
    id: 4,
    name: "Performance Metrics",
    status: "Ready",
    type: "Performance",
  },
];

export function ReportsPage() {
  return (
    <div className="space-y-6 p-6" data-testid="ReportsPage">
      <div>
        <h2 className="text-2xl font-bold">Reports</h2>
        <p className="text-muted-foreground">
          Generate and download various reports for your data.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>
            Filter reports by type and date range
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <Label className="sr-only" htmlFor="report-type-filter">
                Report type
              </Label>
              <Select>
                <SelectTrigger id="report-type-filter">
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="analytics">Analytics</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label className="sr-only" htmlFor="date-range-filter">
                Date range
              </Label>
              <Select>
                <SelectTrigger id="date-range-filter">
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                  <SelectItem value="90days">Last 90 days</SelectItem>
                  <SelectItem value="year">This year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="gap-2">
              <Filter className="h-4 w-4" />
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Generate New Report</CardTitle>
          <CardDescription>
            Create a custom report based on your needs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Button className="h-24 flex-col gap-2" variant="outline">
              <FileText className="h-6 w-6" />
              <span>Sales Report</span>
            </Button>
            <Button className="h-24 flex-col gap-2" variant="outline">
              <FileText className="h-6 w-6" />
              <span>User Report</span>
            </Button>
            <Button className="h-24 flex-col gap-2" variant="outline">
              <FileText className="h-6 w-6" />
              <span>Financial Report</span>
            </Button>
            <Button className="h-24 flex-col gap-2" variant="outline">
              <FileText className="h-6 w-6" />
              <span>Custom Report</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>Your recently generated reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.map((report) => (
              <div
                className="flex items-center justify-between rounded-lg border p-4"
                key={report.id}
              >
                <div className="flex items-center gap-4">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{report.name}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{report.type}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {report.date}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      report.status === "Ready"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {report.status}
                  </span>
                  <Button
                    aria-label={`Download ${report.name}`}
                    disabled={report.status !== "Ready"}
                    size="sm"
                    variant="ghost"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
