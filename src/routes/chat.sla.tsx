import { createFileRoute } from "@tanstack/react-router";
import { HubStub } from "@/components/hubs/page";
export const Route = createFileRoute("/chat/sla")({
  component: () => (
    <HubStub
      title="SLA Triage"
      description="Tickets ranked by breach risk and time-to-first-response."
      bullets={["Breach countdown", "Predictive escalation", "Auto reassign on idle", "SLA policy editor"]}
    />
  ),
});
