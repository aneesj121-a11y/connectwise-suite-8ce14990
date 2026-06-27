import { createFileRoute } from "@tanstack/react-router";
import { HubStub } from "@/components/hubs/page";
export const Route = createFileRoute("/grid/capacity")({
  component: () => (
    <HubStub
      title="Capacity"
      description="Team capacity heatmap with workload balancing recommendations."
      bullets={["Per-rep capacity heatmap", "Skill coverage", "PTO + on-call awareness", "AI rebalance suggestions"]}
    />
  ),
});
