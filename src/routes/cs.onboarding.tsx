import { createFileRoute } from "@tanstack/react-router";
import { HubStub } from "@/components/hubs/page";
export const Route = createFileRoute("/cs/onboarding")({
  component: () => (
    <HubStub
      title="Onboarding"
      description="Time-to-value milestones, blockers, and automated nudges."
      bullets={["Milestone templates per persona", "Auto-nudges on stall", "TTV tracker", "Handoff from Sales"]}
    />
  ),
});
