import { createFileRoute } from "@tanstack/react-router";
import { HubStub } from "@/components/hubs/page";
export const Route = createFileRoute("/billing/subscriptions")({
  component: () => (
    <HubStub
      title="Subscriptions"
      description="Subscription lifecycle and MRR movements: new, expansion, contraction, churn."
      bullets={["MRR movement waterfall", "Pause / resume / cancel flows", "Proration engine", "Coupon + discount governance"]}
    />
  ),
});
