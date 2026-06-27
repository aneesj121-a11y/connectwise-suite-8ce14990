import { createFileRoute } from "@tanstack/react-router";
import { HubStub } from "@/components/hubs/page";
export const Route = createFileRoute("/marketing/campaigns")({
  component: () => (
    <HubStub
      title="AI Campaigns"
      description="Multi-channel campaign orchestration with generative audience + copy."
      bullets={["Audience builder with lookalike", "AI generated subject/body variants", "Channel orchestration (Email · Ads · LinkedIn)", "Lift attribution"]}
    />
  ),
});
