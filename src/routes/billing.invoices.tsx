import { createFileRoute } from "@tanstack/react-router";
import { HubPage } from "@/components/hubs/page";
import { SectionCard, KpiCard, StatusPill, FilterBar } from "@/components/enterprise/primitives";
import { INVOICES, hubInsights } from "@/lib/hubs-data";
import { FileText, Plus, Download } from "lucide-react";

export const Route = createFileRoute("/billing/invoices")({
  head: () => ({ meta: [{ title: "Billing — Invoices" }] }),
  component: InvoicesPage,
});

function InvoicesPage() {
  const paid = INVOICES.filter((i) => i.status === "Paid");
  const open = INVOICES.filter((i) => i.status === "Sent");
  return (
    <HubPage
      title="Invoices"
      description="All issued invoices with status, aging, and audit trail."
      actions={
        <>
          <button className="h-9 px-3 rounded-md border border-border text-sm font-medium inline-flex items-center gap-1.5 hover:bg-accent">
            <Download className="h-3.5 w-3.5" /> Export CSV
          </button>
          <button className="h-9 px-3 rounded-md text-sm font-medium text-primary-foreground inline-flex items-center gap-1.5" style={{ background: "var(--primary)" }}>
            <Plus className="h-3.5 w-3.5" /> New invoice
          </button>
        </>
      }
      insights={hubInsights("billing")}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Total invoices" value={`${INVOICES.length}`} icon={FileText} />
        <KpiCard label="Paid (qtr)" value={`${paid.length}`} delta={6} />
        <KpiCard label="Outstanding" value={`${open.length}`} delta={-2} />
        <KpiCard label="Issued (this mo)" value="14" delta={11} />
      </div>

      <SectionCard title="Invoice ledger">
        <FilterBar chips={["All", "Sent", "Paid", "Overdue", "Draft"]} active="All" />
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-muted-foreground border-b border-border">
            <tr>
              <th className="py-2 pr-3 font-medium">Invoice</th>
              <th className="py-2 pr-3 font-medium">Account</th>
              <th className="py-2 pr-3 font-medium text-right">Amount</th>
              <th className="py-2 pr-3 font-medium">Due</th>
              <th className="py-2 pr-3 font-medium">Status</th>
              <th className="py-2 pr-3 font-medium text-right">DPD</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {INVOICES.map((i) => (
              <tr key={i.id} className="hover:bg-muted/40">
                <td className="py-2.5 pr-3 font-mono text-xs">{i.number}</td>
                <td className="py-2.5 pr-3 font-medium">{i.account}</td>
                <td className="py-2.5 pr-3 text-right font-mono text-xs">${i.amount.toLocaleString()}</td>
                <td className="py-2.5 pr-3 text-xs text-muted-foreground">{i.due}</td>
                <td className="py-2.5 pr-3">
                  <StatusPill level={i.status === "Paid" ? "green" : i.status === "Overdue" ? "red" : i.status === "Sent" ? "blue" : "neutral"}>{i.status}</StatusPill>
                </td>
                <td className="py-2.5 pr-3 text-right text-xs">{i.dpd > 0 ? <span className="text-[color:var(--destructive)] font-medium">{i.dpd}d</span> : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>
    </HubPage>
  );
}
