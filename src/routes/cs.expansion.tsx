import { createFileRoute } from "@tanstack/react-router";
import { HubStub } from "@/components/hubs/page";
export const Route = createFileRoute("/cs/expansion")({
  component: () => (
    <HubStub
      title="Expansion Ops"
      description="Upsell / cross-sell signal detection and white-space mapping."
      bullets={["Seat utilization triggers", "Feature usage spikes", "White-space by product line", "Auto-generated expansion plays"]}
    />
  ),
});
