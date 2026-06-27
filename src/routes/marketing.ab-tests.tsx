import { createFileRoute } from "@tanstack/react-router";
import { HubStub } from "@/components/hubs/page";
export const Route = createFileRoute("/marketing/ab-tests")({
  component: () => (
    <HubStub
      title="Experiments"
      description="A/B and multivariate experiments with Bayesian lift significance."
      bullets={["Bayesian lift + credible intervals", "Auto-stop on significance", "Sequential testing", "Holdout audiences"]}
    />
  ),
});
