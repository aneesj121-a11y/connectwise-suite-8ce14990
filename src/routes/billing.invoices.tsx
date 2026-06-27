import { createFileRoute } from "@tanstack/react-router";
import { HubStub } from "@/components/hubs/page";
export const Route = createFileRoute("/billing/invoices")({
  component: () => (
    <HubStub
      title="Invoices"
      description="Draft / sent / paid / overdue invoices with bulk actions."
      bullets={["Bulk send / void / remind", "Invoice templates", "Auto-charge on file", "Branded PDF"]}
    />
  ),
});
