import { createFileRoute } from "@tanstack/react-router";
import { HubStub } from "@/components/hubs/page";
export const Route = createFileRoute("/forecast")({
  component: () => (
    <HubStub
      title="Forecast"
      description="Weighted, commit, and best-case forecast with AI confidence bands."
      bullets={[
        "Weighted vs. commit vs. best-case rollup by rep, team, and segment",
        "AI confidence band based on stage velocity and rep historicals",
        "Roll-up commit submission with slip / push reasons",
        "Quota attainment pacing and gap-to-plan",
      ]}
    />
  ),
});
