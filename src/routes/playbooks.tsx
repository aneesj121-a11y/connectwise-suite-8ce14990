import { createFileRoute } from "@tanstack/react-router";
import { HubStub } from "@/components/hubs/page";
export const Route = createFileRoute("/playbooks")({
  component: () => (
    <HubStub
      title="Playbooks"
      description="Sales playbooks and AI battlecards triggered by call context."
      bullets={["Discovery, demo, negotiation playbooks", "AI battlecards for top competitors", "Objection library with proven rebuttals", "Stage-gate exit criteria"]}
    />
  ),
});
