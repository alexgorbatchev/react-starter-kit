import { Route } from "@/routes/(auth)/login";
import { LoginPage } from "./LoginPage";

export function LoginRouteComponent() {
  const search = Route.useSearch();

  return <LoginPage returnTo={search.returnTo} />;
}
