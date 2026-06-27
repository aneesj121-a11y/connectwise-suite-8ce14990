import { createFileRoute } from "@tanstack/react-router";
import { HubStub } from "@/components/hubs/page";
export const Route = createFileRoute("/billing/arap")({
  component: () => (
    <HubStub
      title="AR / AP"
      description="Receivables aging and payables schedule in a single ledger view."
      bullets={["AR aging buckets", "AP run scheduling", "Vendor master", "Cash position rollup"]}
    />
  ),
});
