import { AppRouteLayout } from "@/components/layout/AppRouteLayout";
import { getCachedSession, sessionQueryOptions } from "@/lib/queries/session";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)")({
  beforeLoad: async ({ context, location }) => {
    let session = getCachedSession(context.queryClient);

    if (session === undefined) {
      session = await context.queryClient.fetchQuery(sessionQueryOptions());
    }

    if (!session?.user || !session?.session) {
      throw redirect({
        to: "/login",
        search: { returnTo: location.href },
      });
    }

    return { user: session.user, session };
  },
  component: AppRouteLayout,
});
