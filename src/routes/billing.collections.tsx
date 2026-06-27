import { createFileRoute } from "@tanstack/react-router";
import { HubPage } from "@/components/hubs/page";
import { SectionCard, KpiCard, StatusPill, RiskBadge } from "@/components/enterprise/primitives";
import { INVOICES, hubInsights } from "@/lib/hubs-data";
import { Banknote, Phone, AlertOctagon, Mail, Sparkles } from "lucide-react";

export const Route = createFileRoute("/billing/collections")({
  head: () => ({ meta: [{ title: "Billing — Collections" }] }),
  component: CollectionsPage,
});

const DUNNING = [
  { step: "Reminder email", trigger: "5d before due", sent: 142 },
  { step: "Friendly nudge", trigger: "1d overdue", sent: 64 },
  { step: "Past-due email", trigger: "7d overdue", sent: 28 },
  { step: "Phone outreach", trigger: "14d overdue", sent: 12 },
  { step: "Escalation to AR lead", trigger: "30d overdue", sent: 4 },
];

function CollectionsPage() {
  const overdue = INVOICES.filter((i) => i.status === "Overdue");
  const totalOverdue = overdue.reduce((s, i) => s + i.amount, 0);
  return (
    <HubPage
      title="Collections"
      description="ML-ranked dunning queue with auto-call dispatch."
      actions={
        <button className="h-9 px-3 rounded-md text-sm font-medium text-primary-foreground inline-flex items-center gap-1.5" style={{ background: "var(--primary)" }}>
          <Sparkles className="h-3.5 w-3.5" /> Start AI dunning
        </button>
      }
      insights={hubInsights("billing")}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Total overdue" value={`$${(totalOverdue/1000).toFixed(0)}k`} icon={AlertOctagon} />
        <KpiCard label="Accounts" value={`${overdue.length}`} icon={Banknote} />
        <KpiCard label="Avg DPD" value={`${Math.round(overdue.reduce((s,i)=>s+i.dpd,0)/Math.max(1,overdue.length))}d`} delta={-4} />
        <KpiCard label="Recovery rate" value="78%" delta={3} />
      </div>

      <SectionCard title="Active dunning queue">
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-muted-foreground border-b border-border">
            <tr>
              <th className="py-2 pr-3 font-medium">Invoice</th>
              <th className="py-2 pr-3 font-medium">Account</th>
              <th className="py-2 pr-3 font-medium text-right">Amount</th>
              <th className="py-2 pr-3 font-medium text-right">DPD</th>
              <th className="py-2 pr-3 font-medium">Default risk</th>
              <th className="py-2 pr-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {overdue.sort((a,b)=>b.risk-a.risk).map((i) => (
              <tr key={i.id} className="hover:bg-muted/40">
                <td className="py-2.5 pr-3 font-mono text-xs">{i.number}</td>
                <td className="py-2.5 pr-3 font-medium">{i.account}</td>
                <td className="py-2.5 pr-3 text-right font-mono text-xs">${i.amount.toLocaleString()}</td>
                <td className="py-2.5 pr-3 text-right text-[color:var(--destructive)] font-medium">{i.dpd}d</td>
                <td className="py-2.5 pr-3"><RiskBadge confidence={i.risk} label="Risk" /></td>
                <td className="py-2.5 pr-3 text-right">
                  <div className="inline-flex gap-1.5">
                    <button className="inline-flex items-center gap-1 text-[11px] font-medium" style={{ color: "var(--primary)" }}>
                      <Phone className="h-3 w-3" /> Call
                    </button>
                    <button className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                      <Mail className="h-3 w-3" /> Email
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>

      <SectionCard title="Dunning cadence">
        <ul className="divide-y divide-border">
          {DUNNING.map((d) => (
            <li key={d.step} className="py-2.5 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">{d.step}</div>
                <div className="text-[11px] text-muted-foreground">Triggered {d.trigger}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono text-muted-foreground">{d.sent} sent (30d)</span>
                <StatusPill level="green">Active</StatusPill>
              </div>
            </li>
          ))}
        </ul>
      </SectionCard>
    </HubPage>
  );
}
