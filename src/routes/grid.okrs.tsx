import { createFileRoute } from "@tanstack/react-router";
import { HubStub } from "@/components/hubs/page";
export const Route = createFileRoute("/grid/okrs")({
  component: () => (
    <HubStub
      title="OKRs"
      description="Company → team → individual OKR tree with progress and confidence."
      bullets={["Hierarchical OKR tree", "Confidence vote per KR", "Auto-progress from linked tasks", "Check-in cadence"]}
    />
  ),
});
