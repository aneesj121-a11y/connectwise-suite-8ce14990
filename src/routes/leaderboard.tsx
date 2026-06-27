import { createFileRoute } from "@tanstack/react-router";
import { HubStub } from "@/components/hubs/page";
export const Route = createFileRoute("/leaderboard")({
  component: () => (
    <HubStub
      title="Leaderboard"
      description="Rep ranking by attainment, activity index, and AI-graded call quality."
      bullets={["Attainment %", "Calls / connects / meetings booked", "AI call score", "Pipeline created", "Win rate"]}
    />
  ),
});
