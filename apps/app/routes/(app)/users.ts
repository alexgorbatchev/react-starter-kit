import { UsersPage } from "@/components/pages/UsersPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/users")({
  component: UsersPage,
});
