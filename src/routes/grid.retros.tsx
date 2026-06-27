import { createFileRoute } from "@tanstack/react-router";
import { HubStub } from "@/components/hubs/page";
export const Route = createFileRoute("/grid/retros")({
  component: () => (
    <HubStub
      title="Retros"
      description="Retrospective board with AI theme clustering and action tracking."
      bullets={["Start / Stop / Continue board", "AI theme clustering", "Action items with owners", "Retro-over-retro insights"]}
    />
  ),
});
