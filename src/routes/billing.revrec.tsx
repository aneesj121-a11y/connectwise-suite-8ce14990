import { createFileRoute } from "@tanstack/react-router";
import { HubStub } from "@/components/hubs/page";
export const Route = createFileRoute("/billing/revrec")({
  component: () => (
    <HubStub
      title="Revenue Recognition"
      description="ASC 606 compliant revenue schedules and deferred revenue waterfall."
      bullets={["Performance obligation tracking", "Deferred revenue waterfall", "Journal entry export", "Audit-ready trail"]}
    />
  ),
});
