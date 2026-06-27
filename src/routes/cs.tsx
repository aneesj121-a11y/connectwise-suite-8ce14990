import { createFileRoute } from "@tanstack/react-router";
import { KpiCard, SectionCard, StatusPill, RiskBadge, FilterBar } from "@/components/enterprise/primitives";
import { ACCOUNTS, hubInsights } from "@/lib/hubs-data";
import { HubPage } from "@/components/hubs/page";
import { HeartHandshake, TrendingUp, AlertTriangle, RefreshCw, Phone } from "lucide-react";

export const Route = createFileRoute("/cs")({
  head: () => ({ meta: [{ title: "Customer Success — Accounts" }] }),
  component: CSPage,
});

function CSPage() {
  const atRisk = ACCOUNTS.filter((a) => a.risk !== "green").length;
  const arr = ACCOUNTS.reduce((s, a) => s + a.arr, 0);
  return (
    <HubPage
      title="Accounts"
      description="Predictive churn risk, health score, and revenue posture across your book."
      insights={hubInsights("cs")}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Total ARR" value={`$${(arr / 1000).toFixed(0)}k`} delta={12} icon={HeartHandshake} spark={[1600, 1640, 1680, 1700, 1740, 1700, 1710]} />
        <KpiCard label="Net retention" value="112%" delta={3} icon={TrendingUp} spark={[105, 107, 108, 110, 109, 111, 112]} />
        <KpiCard label="At-risk accounts" value={`${atRisk}`} delta={-8} icon={AlertTriangle} />
        <KpiCard label="Renewals 90d" value="9" delta={2} icon={RefreshCw} />
      </div>

      <SectionCard title="Book of business" subtitle={`${ACCOUNTS.length} accounts · ML churn risk live`}>
        <FilterBar chips={["All", "At risk", "Expansion", "Renewing 90d", "Owner: me"]} active="All" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-muted-foreground border-b border-border">
              <tr>
                <th className="py-2 pr-3 font-medium">Account</th>
                <th className="py-2 pr-3 font-medium">Owner</th>
                <th className="py-2 pr-3 font-medium">Health</th>
                <th className="py-2 pr-3 font-medium">Churn risk</th>
                <th className="py-2 pr-3 font-medium text-right">MRR</th>
                <th className="py-2 pr-3 font-medium text-right">ARR</th>
                <th className="py-2 pr-3 font-medium text-right">NRR</th>
                <th className="py-2 pr-3 font-medium">Renewal</th>
                <th className="py-2 pr-3 font-medium">Last touch</th>
                <th className="py-2 pr-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {ACCOUNTS.map((a) => (
                <tr key={a.id} className="hover:bg-muted/40">
                  <td className="py-2.5 pr-3 font-medium">{a.name}</td>
                  <td className="py-2.5 pr-3 text-muted-foreground text-xs">{a.owner}</td>
                  <td className="py-2.5 pr-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${a.health}%`, background: a.risk === "green" ? "var(--success)" : a.risk === "yellow" ? "var(--warning)" : "var(--destructive)" }} />
                      </div>
                      <span className="text-xs font-mono">{a.health}</span>
                    </div>
                  </td>
                  <td className="py-2.5 pr-3">
                    <StatusPill level={a.risk}>
                      {a.risk === "green" ? "Healthy" : a.risk === "yellow" ? "Watch" : "At risk"}
                    </StatusPill>
                    <span className="ml-1.5 align-middle"><RiskBadge confidence={a.risk === "red" ? 92 : a.risk === "yellow" ? 76 : 64} /></span>
                  </td>
                  <td className="py-2.5 pr-3 text-right font-mono text-xs">${a.mrr.toLocaleString()}</td>
                  <td className="py-2.5 pr-3 text-right font-mono text-xs">${a.arr.toLocaleString()}</td>
                  <td className="py-2.5 pr-3 text-right font-mono text-xs">{a.nrr}%</td>
                  <td className="py-2.5 pr-3 text-xs text-muted-foreground">{a.renewal}</td>
                  <td className="py-2.5 pr-3 text-xs text-muted-foreground">{a.lastTouch}</td>
                  <td className="py-2.5 pr-3 text-right">
                    <button className="inline-flex items-center gap-1 text-xs font-medium" style={{ color: "var(--primary)" }}>
                      <Phone className="h-3 w-3" /> Call
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </HubPage>
  );
}
