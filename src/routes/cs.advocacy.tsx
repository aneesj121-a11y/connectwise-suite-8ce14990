import { createFileRoute } from "@tanstack/react-router";
import { HubStub } from "@/components/hubs/page";
export const Route = createFileRoute("/cs/advocacy")({
  component: () => (
    <HubStub
      title="Advocacy"
      description="References, case studies, NPS promoters, and review pipelines."
      bullets={["Promoter detection", "Reference request workflow", "Case study pipeline", "Review platform sync (G2 / Gartner)"]}
    />
  ),
});
