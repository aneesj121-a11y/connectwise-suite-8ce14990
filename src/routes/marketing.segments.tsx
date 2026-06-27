import { createFileRoute } from "@tanstack/react-router";
import { HubStub } from "@/components/hubs/page";
export const Route = createFileRoute("/marketing/segments")({
  component: () => (
    <HubStub
      title="Segments"
      description="AI audience segmentation, ICP scoring, and lookalike modeling."
      bullets={["ICP fit score", "AI clustering of behavioral segments", "Lookalike from win history", "Suppression & consent management"]}
    />
  ),
});
