import { createFileRoute } from "@tanstack/react-router";
import { HubStub } from "@/components/hubs/page";
export const Route = createFileRoute("/billing/tax")({
  component: () => (
    <HubStub
      title="Tax & Compliance"
      description="Multi-jurisdiction tax calculation and compliance reporting."
      bullets={["Avalara / Stripe Tax sync", "VAT / GST handling", "Nexus monitor", "Auto-filing prep"]}
    />
  ),
});
