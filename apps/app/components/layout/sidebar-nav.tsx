import type { FileRoutesByTo } from "@/lib/routeTree.gen";
import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";

interface ISidebarNavItem {
  icon: LucideIcon;
  label: string;
  to: keyof FileRoutesByTo;
}

interface ISidebarNavProps {
  items: readonly ISidebarNavItem[];
}

export function SidebarNav({ items }: ISidebarNavProps) {
  return (
    <nav className="flex-1 p-4 space-y-1" data-testid="SidebarNav">
      {items.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
          activeProps={{
            className: "bg-accent text-accent-foreground",
          }}
        >
          <item.icon className="h-4 w-4" />
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
