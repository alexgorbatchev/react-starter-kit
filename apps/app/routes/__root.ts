import { RootRoute } from "@/components/RootRoute";
import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext } from "@tanstack/react-router";

export interface IRootRouteContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<IRootRouteContext>()({
  component: RootRoute,
});
