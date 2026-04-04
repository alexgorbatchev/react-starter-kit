import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { NotFound } from "./components/not-found";
import { queryClient } from "./lib/query";
import { routeTree } from "./lib/routeTree.gen";
import "./styles/globals.css";

const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: "intent",
  defaultNotFoundComponent: NotFound,
});

export function Main() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      {import.meta.env.DEV && (
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition="bottom-right"
        />
      )}
    </QueryClientProvider>
  );
}

const container = document.getElementById("root");

if (container) {
  const root = createRoot(container);

  root.render(
    <StrictMode>
      <Main />
    </StrictMode>,
  );

  if (import.meta.hot) {
    import.meta.hot.dispose(() => root.unmount());
  }
}

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
