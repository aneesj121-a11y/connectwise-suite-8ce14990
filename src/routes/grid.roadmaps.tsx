import { createFileRoute } from "@tanstack/react-router";
import { HubStub } from "@/components/hubs/page";
export const Route = createFileRoute("/grid/roadmaps")({
  component: () => (
    <HubStub
      title="Roadmaps"
      description="Now / Next / Later swimlanes with linked initiatives and OKR alignment."
      bullets={["Quarterly timeline", "OKR linkage", "Dependency graph", "Public roadmap export"]}
    />
  ),
});
