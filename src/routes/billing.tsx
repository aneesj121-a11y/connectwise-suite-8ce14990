import { createFileRoute } from "@tanstack/react-router";
import { KpiCard, SectionCard, StatusPill, RiskBadge } from "@/components/enterprise/primitives";
import { INVOICES, hubInsights } from "@/lib/hubs-data";
import { HubPage } from "@/components/hubs/page";
import { Wallet, TrendingUp, AlertOctagon, Clock, FileText, Sparkles, Phone } from "lucide-react";

export const Route = createFileRoute("/billing")({
  head: () => ({ meta: [{ title: "Billing Ops — Financials" }] }),
  component: BillingPage,
});

function BillingPage() {
  const mrr = INVOICES.filter((i) => i.status !== "Draft").reduce((s, i) => s + i.amount, 0);
  const overdue = INVOICES.filter((i) => i.status === "Overdue");
  const overdueAmt = overdue.reduce((s, i) => s + i.amount, 0);
  const highRisk = INVOICES.filter((i) => i.risk >= 70);

  return (
    <HubPage
      title="Financials"
      description="Live MRR, AR aging, and ML-driven collections risk."
      insights={hubInsights("billing")}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Total MRR" value={`$${(mrr / 1000).toFixed(0)}k`} delta={9} icon={Wallet} spark={[120, 124, 128, 130, 134, 138, 142]} />
        <KpiCard label="Net new MRR" value="$24.8k" delta={14} icon={TrendingUp} spark={[14, 16, 18, 19, 22, 23, 24.8]} />
        <KpiCard label="Overdue" value={`$${(overdueAmt / 1000).toFixed(0)}k`} delta={-5} icon={AlertOctagon} />
        <KpiCard label="DSO" value="44d" delta={6} icon={Clock} spark={[38, 39, 40, 41, 42, 43, 44]} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <SectionCard
          title="Collections Risk"
          subtitle="Ranked by ML default probability"
          className="lg:col-span-2"
          action={
            <button className="h-8 px-2.5 rounded-md text-xs font-medium text-primary-foreground inline-flex items-center gap-1.5" style={{ background: "var(--primary)" }}>
              <Sparkles className="h-3 w-3" /> Auto-dunning
            </button>
          }
        >
          <ul className="divide-y divide-border">
            {highRisk.sort((a, b) => b.risk - a.risk).map((i) => (
              <li key={i.id} className="py-3 flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg grid place-items-center" style={{ background: "color-mix(in oklab, var(--destructive) 14%, transparent)", color: "var(--destructive)" }}>
                  <AlertOctagon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{i.account}</div>
                  <div className="text-xs text-muted-foreground">{i.number} · {i.dpd} days past due</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-sm">${i.amount.toLocaleString()}</div>
                  <RiskBadge confidence={i.risk} label="Risk" />
                </div>
                <button className="ml-2 inline-flex items-center gap-1 text-xs font-medium" style={{ color: "var(--primary)" }}>
                  <Phone className="h-3 w-3" /> Call
                </button>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="AR aging">
          <ul className="space-y-2.5">
            {[
              { b: "Current", v: 78400, pct: 62 },
              { b: "1–30", v: 31200, pct: 24 },
              { b: "31–60", v: 12800, pct: 10 },
              { b: "61–90", v: 4900, pct: 4 },
              { b: ">90", v: 0, pct: 0 },
            ].map((r) => (
              <li key={r.b} className="text-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-muted-foreground">{r.b}</span>
                  <span className="font-mono text-xs">${r.v.toLocaleString()}</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${r.pct}%`, background: "var(--primary)" }} />
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <SectionCard title="Recent invoices" action={
        <button className="h-8 px-2.5 rounded-md border border-border text-xs font-medium inline-flex items-center gap-1.5 hover:bg-accent">
          <FileText className="h-3 w-3" /> Export CSV
        </button>
      }>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-muted-foreground border-b border-border">
              <tr>
                <th className="py-2 pr-3 font-medium">Invoice</th>
                <th className="py-2 pr-3 font-medium">Account</th>
                <th className="py-2 pr-3 font-medium text-right">Amount</th>
                <th className="py-2 pr-3 font-medium">Due</th>
                <th className="py-2 pr-3 font-medium">Status</th>
                <th className="py-2 pr-3 font-medium">DPD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {INVOICES.map((i) => (
                <tr key={i.id} className="hover:bg-muted/40">
                  <td className="py-2.5 pr-3 font-mono text-xs">{i.number}</td>
                  <td className="py-2.5 pr-3">{i.account}</td>
                  <td className="py-2.5 pr-3 text-right font-mono text-xs">${i.amount.toLocaleString()}</td>
                  <td className="py-2.5 pr-3 text-xs text-muted-foreground">{i.due}</td>
                  <td className="py-2.5 pr-3">
                    <StatusPill level={i.status === "Paid" ? "green" : i.status === "Overdue" ? "red" : i.status === "Sent" ? "blue" : "neutral"}>{i.status}</StatusPill>
                  </td>
                  <td className="py-2.5 pr-3 text-xs">{i.dpd > 0 ? <span className="text-[color:var(--destructive)] font-medium">{i.dpd}d</span> : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </HubPage>
  );
}
