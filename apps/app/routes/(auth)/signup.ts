import { SignupRouteComponent } from "@/components/auth/SignupRouteComponent";
import { getSafeRedirectUrl } from "@/lib/auth-config";
import { sessionQueryOptions } from "@/lib/queries/session";
import { createFileRoute, isRedirect, redirect } from "@tanstack/react-router";
import { z } from "zod";

const searchSchema = z.object({
  returnTo: z
    .string()
    .optional()
    .transform((value) => {
      const safeRedirectUrl = getSafeRedirectUrl(value);
      return safeRedirectUrl === "/" ? undefined : safeRedirectUrl;
    })
    .catch(undefined),
});

export const Route = createFileRoute("/(auth)/signup")({
  validateSearch: searchSchema,
  beforeLoad: async ({ context, search }) => {
    try {
      const session = await context.queryClient.fetchQuery(
        sessionQueryOptions(),
      );

      if (session?.user && session?.session) {
        throw redirect({ to: search.returnTo ?? "/" });
      }
    } catch (error) {
      if (isRedirect(error)) {
        throw error;
      }
    }
  },
  component: SignupRouteComponent,
});
