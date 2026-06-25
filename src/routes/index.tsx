import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "@/components/dashboard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Limnn Dialer — Workspace" },
      { name: "description", content: "Enterprise dialer for sales, support, and customer success teams." },
    ],
  }),
  component: Dashboard,
});
