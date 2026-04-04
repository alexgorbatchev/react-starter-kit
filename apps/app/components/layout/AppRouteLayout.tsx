import { AuthErrorBoundary } from "@/components/auth";
import { Layout } from "@/components/layout";
import { Outlet } from "@tanstack/react-router";

export function AppRouteLayout() {
  return (
    <AuthErrorBoundary>
      <Layout>
        <Outlet />
      </Layout>
    </AuthErrorBoundary>
  );
}
