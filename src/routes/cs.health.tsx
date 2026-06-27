import { createFileRoute } from "@tanstack/react-router";
import { HubStub } from "@/components/hubs/page";
export const Route = createFileRoute("/cs/health")({
  component: () => (
    <HubStub
      title="Health Scoring"
      description="Composite health model — usage, sentiment, NPS, support load, exec engagement."
      bullets={["Weighted factor model", "Drift detection per account", "Cohort comparisons", "Configurable thresholds"]}
    />
  ),
});
