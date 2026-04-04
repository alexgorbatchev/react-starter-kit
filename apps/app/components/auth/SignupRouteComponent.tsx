import { Route } from "@/routes/(auth)/signup";
import { SignupPage } from "./SignupPage";

export function SignupRouteComponent() {
  const search = Route.useSearch();

  return <SignupPage returnTo={search.returnTo} />;
}
