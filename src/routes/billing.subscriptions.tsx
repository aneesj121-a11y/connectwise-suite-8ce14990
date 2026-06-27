import { createFileRoute } from "@tanstack/react-router";
import { HubPage } from "@/components/hubs/page";
import { SectionCard, KpiCard, StatusPill, RiskBadge } from "@/components/enterprise/primitives";
import { hubInsights } from "@/lib/hubs-data";
import { Repeat, RefreshCw, TrendingUp, Users } from "lucide-react";

export const Route = createFileRoute("/billing/subscriptions")({
  head: () => ({ meta: [{ title: "Billing — Subscriptions" }] }),
  component: SubsPage,
});

const SUBS = [
  { account: "Acme Corporation", plan: "Platform Pro · 50 seats", mrr: 18400, term: "Annual", renewal: "2026-11-04", status: "Active", risk: 18 },
  { account: "Northwind Bank", plan: "Enterprise · 220 seats", mrr: 42000, term: "Annual", renewal: "2026-09-12", status: "Active", risk: 38 },
  { account: "Helios Health", plan: "Platform · 80 seats", mrr: 12800, term: "Annual", renewal: "2026-08-30", status: "At risk", risk: 78 },
  { account: "Atlas Robotics", plan: "Growth · 30 seats", mrr: 9600, term: "Annual", renewal: "2027-01-18", status: "Active", risk: 12 },
  { account: "Pioneer Mutual", plan: "Enterprise · 160 seats", mrr: 31200, term: "Multi-yr", renewal: "2026-10-21", status: "Active", risk: 46 },
  { account: "Bluebird Media", plan: "Growth · 18 seats", mrr: 6400, term: "Monthly", renewal: "2026-07-14", status: "Active", risk: 6 },
];

function SubsPage() {
  const mrr = SUBS.reduce((s, x) => s + x.mrr, 0);
  return (
    <HubPage
      title="Subscriptions"
      description="Active subscriptions, billing terms, and renewal exposure."
      insights={hubInsights("billing")}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Active subs" value={`${SUBS.length}`} icon={Users} />
        <KpiCard label="Total MRR" value={`$${(mrr/1000).toFixed(0)}k`} delta={8} icon={Repeat} />
        <KpiCard label="Renewing 90d" value="3" icon={RefreshCw} />
        <KpiCard label="Avg expansion" value="+18%" delta={4} icon={TrendingUp} />
      </div>

      <SectionCard title="Subscription book">
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-muted-foreground border-b border-border">
            <tr>
              <th className="py-2 pr-3 font-medium">Account</th>
              <th className="py-2 pr-3 font-medium">Plan</th>
              <th className="py-2 pr-3 font-medium">Term</th>
              <th className="py-2 pr-3 font-medium text-right">MRR</th>
              <th className="py-2 pr-3 font-medium">Renewal</th>
              <th className="py-2 pr-3 font-medium">Status</th>
              <th className="py-2 pr-3 font-medium">Churn risk</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {SUBS.map((s) => (
              <tr key={s.account} className="hover:bg-muted/40">
                <td className="py-2.5 pr-3 font-medium">{s.account}</td>
                <td className="py-2.5 pr-3 text-xs text-muted-foreground">{s.plan}</td>
                <td className="py-2.5 pr-3 text-xs">{s.term}</td>
                <td className="py-2.5 pr-3 text-right font-mono text-xs">${s.mrr.toLocaleString()}</td>
                <td className="py-2.5 pr-3 text-xs text-muted-foreground">{s.renewal}</td>
                <td className="py-2.5 pr-3"><StatusPill level={s.status === "Active" ? "green" : "yellow"}>{s.status}</StatusPill></td>
                <td className="py-2.5 pr-3"><RiskBadge confidence={s.risk} label="Risk" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>
    </HubPage>
  );
}
