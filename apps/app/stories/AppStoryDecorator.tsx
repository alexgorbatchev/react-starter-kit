import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RouterContextProvider,
  createMemoryHistory,
  createRouter,
} from "@tanstack/react-router";

import { billingQueryKey } from "../lib/queries/billing";
import { sessionQueryKey } from "../lib/queries/session";
import { routeTree } from "../lib/routeTree.gen";

export interface IStorySessionData {
  user: {
    email: string;
    name?: string | null;
  };
  session: {
    activeOrganizationId?: string | null;
  };
}

export interface IStoryBillingState {
  cancelAtPeriodEnd: boolean;
  periodEnd: string | null;
  plan: "starter" | "pro";
  status: "active" | "canceled" | "trialing";
}

export interface IAppStoryParameters {
  billing?: IStoryBillingState | null;
  initialHref?: string;
  session?: IStorySessionData | null;
}

export const authenticatedSession: IStorySessionData = {
  user: {
    email: "alex@example.com",
    name: "Alex Example",
  },
  session: {
    activeOrganizationId: "org_storybook",
  },
};

export const activeStarterBilling: IStoryBillingState = {
  cancelAtPeriodEnd: false,
  periodEnd: "2026-12-31T00:00:00.000Z",
  plan: "starter",
  status: "active",
};

export const cancelingProBilling: IStoryBillingState = {
  cancelAtPeriodEnd: true,
  periodEnd: "2026-06-30T00:00:00.000Z",
  plan: "pro",
  status: "active",
};

type StoryRenderer = () => ReactNode;

interface IAppStoryDecoratorProps {
  children: ReactNode;
  parameters?: IAppStoryParameters;
}

export function renderWithAppStoryDecorator(
  renderStory: StoryRenderer,
  parameters?: IAppStoryParameters,
): ReactNode {
  return (
    <AppStoryDecorator parameters={parameters}>
      {renderStory()}
    </AppStoryDecorator>
  );
}

function createStoryQueryClient(parameters: IAppStoryParameters): QueryClient {
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: {
        retry: false,
      },
      queries: {
        gcTime: Infinity,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
        retry: false,
        staleTime: Infinity,
      },
    },
  });

  const session = parameters.session ?? null;
  queryClient.setQueryData(sessionQueryKey, session);

  if (parameters.billing !== undefined) {
    const activeOrganizationId = session?.session.activeOrganizationId ?? null;
    queryClient.setQueryData(
      [...billingQueryKey, activeOrganizationId] as const,
      parameters.billing,
    );
  }

  return queryClient;
}

export function AppStoryDecorator({
  children,
  parameters,
}: IAppStoryDecoratorProps) {
  const resolvedParameters = parameters ?? {};
  const initialHref = resolvedParameters.initialHref ?? "/login";
  const [queryClient] = useState(() =>
    createStoryQueryClient(resolvedParameters),
  );
  const [router] = useState(() =>
    createRouter({
      routeTree,
      history: createMemoryHistory({ initialEntries: [initialHref] }),
      context: {
        queryClient,
      },
    }),
  );
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    void router.load().then(() => {
      if (isMounted) {
        setIsReady(true);
      }
    });

    return () => {
      isMounted = false;
      queryClient.clear();
    };
  }, [queryClient, router]);

  if (!isReady) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <RouterContextProvider router={router}>{children}</RouterContextProvider>
    </QueryClientProvider>
  );
}
