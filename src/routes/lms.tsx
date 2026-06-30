import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/lms")({
  head: () => ({ meta: [{ title: "Limnn Learning — Enablement" }] }),
  component: () => <Outlet />,
});
