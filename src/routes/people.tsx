import { createFileRoute, Outlet } from "@tanstack/react-router";
import { PeopleAiFab } from "@/components/people/people-ai-fab";

export const Route = createFileRoute("/people")({
  head: () => ({ meta: [{ title: "Limnn People — HRIS & Talent" }] }),
  component: () => (
    <>
      <Outlet />
      <PeopleAiFab />
    </>
  ),
});
