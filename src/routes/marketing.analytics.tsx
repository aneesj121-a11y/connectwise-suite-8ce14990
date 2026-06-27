import { createFileRoute } from "@tanstack/react-router";
import { HubStub } from "@/components/hubs/page";
export const Route = createFileRoute("/marketing/analytics")({
  component: () => (
    <HubStub
      title="Attribution & Analytics"
      description="First / last / linear / AI-weighted attribution with cohort retention."
      bullets={["Multi-touch attribution", "Cohort retention curves", "Channel ROI mix", "Pipeline contribution by source"]}
    />
  ),
});
