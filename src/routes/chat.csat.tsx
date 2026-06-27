import { createFileRoute } from "@tanstack/react-router";
import { HubStub } from "@/components/hubs/page";
export const Route = createFileRoute("/chat/csat")({
  component: () => (
    <HubStub
      title="CSAT & Insights"
      description="CSAT / CES tracking with AI root-cause clustering on detractor feedback."
      bullets={["CSAT / CES trends", "Theme clustering of feedback", "Detractor cohort drilldown", "Action assignment"]}
    />
  ),
});
