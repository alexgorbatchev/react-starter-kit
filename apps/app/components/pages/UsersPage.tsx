import {
  Avatar,
  AvatarFallback,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "@repo/ui";
import {
  MoreVertical,
  Search,
  UserPlus,
  Users as UsersIcon,
} from "lucide-react";

const users = [
  {
    email: "john.doe@example.com",
    id: 1,
    lastActive: "2 hours ago",
    name: "John Doe",
    role: "Admin",
    status: "Active",
  },
  {
    email: "jane.smith@example.com",
    id: 2,
    lastActive: "5 minutes ago",
    name: "Jane Smith",
    role: "Editor",
    status: "Active",
  },
  {
    email: "bob.johnson@example.com",
    id: 3,
    lastActive: "2 days ago",
    name: "Bob Johnson",
    role: "Viewer",
    status: "Inactive",
  },
  {
    email: "alice.brown@example.com",
    id: 4,
    lastActive: "1 hour ago",
    name: "Alice Brown",
    role: "Editor",
    status: "Active",
  },
  {
    email: "charlie.wilson@example.com",
    id: 5,
    lastActive: "30 minutes ago",
    name: "Charlie Wilson",
    role: "Viewer",
    status: "Active",
  },
];

export function UsersPage() {
  return (
    <div className="space-y-6 p-6" data-testid="UsersPage">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Users</h2>
          <p className="text-muted-foreground">
            Manage user accounts and permissions.
          </p>
        </div>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          Add User
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              +10% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UsersIcon className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">892</div>
            <p className="text-xs text-muted-foreground">72% of total users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              New This Month
            </CardTitle>
            <UserPlus className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48</div>
            <p className="text-xs text-muted-foreground">
              +32% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>View and manage all user accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex gap-4">
            <div className="relative flex-1">
              <Label className="sr-only" htmlFor="user-search-input">
                Search users
              </Label>
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
              <Input
                className="pl-10"
                id="user-search-input"
                placeholder="Search users..."
              />
            </div>
            <Button variant="outline">Filter</Button>
          </div>

          <div className="rounded-lg border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-4 text-left font-medium">User</th>
                    <th className="p-4 text-left font-medium">Role</th>
                    <th className="p-4 text-left font-medium">Status</th>
                    <th className="p-4 text-left font-medium">Last Active</th>
                    <th className="p-4 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr className="border-b" key={user.id}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>
                              {user.name
                                .split(" ")
                                .map((namePart) => namePart[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="rounded-full bg-secondary px-2 py-1 text-xs font-medium">
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${
                            user.status === "Active"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {user.lastActive}
                      </td>
                      <td className="p-4">
                        <Button
                          aria-label={`Open actions for ${user.name}`}
                          size="sm"
                          variant="ghost"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
