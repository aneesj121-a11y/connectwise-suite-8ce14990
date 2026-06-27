import { createFileRoute } from "@tanstack/react-router";
import { HubStub } from "@/components/hubs/page";
export const Route = createFileRoute("/billing/collections")({
  component: () => (
    <HubStub
      title="Collections"
      description="Dunning automations, promise-to-pay tracking, and outbound call queues."
      bullets={["Dunning sequences", "Promise-to-pay log", "Auto-dialer integration", "Settlement workflow"]}
    />
  ),
});
