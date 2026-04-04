import { ReportsPage } from "@/components/pages/ReportsPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/reports")({
  component: ReportsPage,
});
