import { AppErrorBoundary } from "@/components/auth";
import { Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export function RootRoute() {
  return (
    <AppErrorBoundary>
      <Outlet />
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </AppErrorBoundary>
  );
}
