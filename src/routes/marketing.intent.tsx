import { createFileRoute } from "@tanstack/react-router";
import { HubStub } from "@/components/hubs/page";
export const Route = createFileRoute("/marketing/intent")({
  component: () => (
    <HubStub
      title="Intent Engine"
      description="Third-party intent signals, surging accounts, and ICP-weighted keyword heatmap."
      bullets={["G2 + Bombora + first-party blend", "Surge score per account", "Keyword heatmap", "Auto-route to AE on threshold breach"]}
    />
  ),
});
