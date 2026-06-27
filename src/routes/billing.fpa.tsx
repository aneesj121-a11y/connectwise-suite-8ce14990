import { createFileRoute } from "@tanstack/react-router";
import { HubStub } from "@/components/hubs/page";
export const Route = createFileRoute("/billing/fpa")({
  component: () => (
    <HubStub
      title="FP&A Engine"
      description="Rolling forecast, scenario planning, and variance vs. plan."
      bullets={["Rolling 12-month forecast", "Scenario planner (base / upside / downside)", "Variance analysis", "Driver-based modeling"]}
    />
  ),
});
