import { createFileRoute } from "@tanstack/react-router";
import { HubStub } from "@/components/hubs/page";
export const Route = createFileRoute("/cs/renewals")({
  component: () => (
    <HubStub
      title="Renewals"
      description="Renewal calendar, at-risk renewals, auto-renew vs. manual mix."
      bullets={["90 / 60 / 30 day pipeline", "At-risk flagging", "Renewal proposal generator", "Multi-year uplift calculator"]}
    />
  ),
});
