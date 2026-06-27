import { createFileRoute } from "@tanstack/react-router";
import { HubStub } from "@/components/hubs/page";
export const Route = createFileRoute("/grid/automations")({
  component: () => (
    <HubStub
      title="Automations"
      description="Trigger / condition / action workflows + AI-suggested automations."
      bullets={["Visual workflow builder", "AI-suggested automations from patterns", "Webhook triggers", "Audit log"]}
    />
  ),
});
