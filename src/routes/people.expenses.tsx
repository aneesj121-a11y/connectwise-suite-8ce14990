import { createFileRoute } from "@tanstack/react-router";
import { HubPage } from "@/components/hubs/page";
import { SectionCard, StatusPill, KpiCard, RiskBadge } from "@/components/enterprise/primitives";
import { EXPENSES } from "@/lib/people-data";
import { DollarSign, Clock, TrendingUp, Sparkles, Paperclip } from "lucide-react";

const ACCENT = "oklch(0.58 0.18 280)";

export const Route = createFileRoute("/people/expenses")({
  head: () => ({ meta: [{ title: "Expenses — Limnn People" }] }),
  component: Expenses,
});

function Expenses() {
  const flagged = EXPENSES.filter((e) => e.flagged);
  return (
    <HubPage title="Expenses" description="Employee expenses, approvals and anomaly detection.">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Total (MTD)" value="$12.4K" icon={DollarSign} />
        <KpiCard label="Pending" value="$3.2K" icon={Clock} />
        <KpiCard label="Avg expense" value="$420" icon={TrendingUp} />
        <KpiCard label="AI flagged" value={String(flagged.length)} icon={Sparkles} />
      </div>

      <SectionCard>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border">
              <th className="py-2 pr-3">Date</th><th className="py-2 pr-3">Employee</th><th className="py-2 pr-3">Category</th><th className="py-2 pr-3">Description</th><th className="py-2 pr-3 text-right">Amount</th><th className="py-2 pr-3 text-center">Receipt</th><th className="py-2 pr-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {EXPENSES.map((e) => (
              <tr key={e.id} className={e.flagged ? "bg-rose-500/5" : ""}>
                <td className="py-2 pr-3 text-muted-foreground text-[11px]">{e.date}</td>
                <td className="py-2 pr-3">{e.employee}</td>
                <td className="py-2 pr-3">{e.category}</td>
                <td className="py-2 pr-3 text-muted-foreground">{e.description}</td>
                <td className="py-2 pr-3 text-right font-mono">${e.amount.toLocaleString()}</td>
                <td className="py-2 pr-3 text-center">{e.receipt ? <Paperclip className="h-3.5 w-3.5 inline text-muted-foreground" /> : <span className="text-rose-500">—</span>}</td>
                <td className="py-2 pr-3"><StatusPill level={e.status === "Approved" ? "green" : e.status === "Flagged" ? "red" : "yellow"}>{e.status}</StatusPill></td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>

      <SectionCard
        title={<span className="inline-flex items-center gap-2"><span className="h-6 w-6 rounded-md grid place-items-center" style={{ background: `color-mix(in oklab, ${ACCENT} 14%, transparent)`, color: ACCENT }}><Sparkles className="h-3 w-3" /></span> AI anomaly detection</span>}
      >
        <ul className="space-y-2 text-sm">
          {flagged.map((f) => (
            <li key={f.id} className="rounded-lg border p-3 flex items-start gap-3" style={{ borderColor: `color-mix(in oklab, var(--destructive) 25%, var(--border))` }}>
              <span className="h-6 w-6 rounded-md grid place-items-center" style={{ background: "color-mix(in oklab, var(--destructive) 14%, transparent)", color: "var(--destructive)" }}>
                <Sparkles className="h-3 w-3" />
              </span>
              <div className="flex-1">
                <div className="font-medium">{f.id} · {f.employee} · ${f.amount}</div>
                <div className="text-xs text-muted-foreground">{f.flagReason}</div>
              </div>
              <RiskBadge confidence={92} />
            </li>
          ))}
        </ul>
      </SectionCard>
    </HubPage>
  );
}
