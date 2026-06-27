import { createFileRoute } from "@tanstack/react-router";
import { HubPage } from "@/components/hubs/page";
import { SectionCard, KpiCard, StatusPill } from "@/components/enterprise/primitives";
import { hubInsights } from "@/lib/hubs-data";
import { Receipt, ArrowDownToLine, ArrowUpToLine, Clock } from "lucide-react";

export const Route = createFileRoute("/billing/arap")({
  head: () => ({ meta: [{ title: "Billing — AR / AP" }] }),
  component: ArapPage,
});

const AR = [
  { b: "Current", v: 78400, pct: 62 },
  { b: "1–30", v: 31200, pct: 24 },
  { b: "31–60", v: 12800, pct: 10 },
  { b: "61–90", v: 4900, pct: 4 },
  { b: ">90", v: 0, pct: 0 },
];
const AP = [
  { vendor: "Twilio", amount: 18400, due: "Jul 02", status: "Scheduled" },
  { vendor: "AWS", amount: 42100, due: "Jul 05", status: "Scheduled" },
  { vendor: "OpenAI", amount: 21800, due: "Jul 12", status: "Pending approval" },
  { vendor: "Datadog", amount: 6400, due: "Jul 18", status: "Scheduled" },
  { vendor: "Notion", amount: 1200, due: "Jul 22", status: "Scheduled" },
];

function ArapPage() {
  const ap = AP.reduce((s, x) => s + x.amount, 0);
  return (
    <HubPage
      title="AR / AP"
      description="Receivables aging and payables schedule across vendors."
      insights={hubInsights("billing")}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Total AR" value={`$${(AR.reduce((s,r)=>s+r.v,0)/1000).toFixed(0)}k`} icon={ArrowDownToLine} delta={6} />
        <KpiCard label="Total AP (30d)" value={`$${(ap/1000).toFixed(0)}k`} icon={ArrowUpToLine} delta={-3} />
        <KpiCard label="DSO" value="44d" delta={2} icon={Clock} />
        <KpiCard label="DPO" value="38d" delta={-1} icon={Receipt} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <SectionCard title="AR aging">
          <ul className="space-y-2.5">
            {AR.map((r) => (
              <li key={r.b}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-muted-foreground">{r.b}</span>
                  <span className="font-mono text-xs">${r.v.toLocaleString()}</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${r.pct}%`, background: "var(--primary)" }} />
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Upcoming AP">
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-muted-foreground border-b border-border">
              <tr>
                <th className="py-2 pr-3 font-medium">Vendor</th>
                <th className="py-2 pr-3 font-medium text-right">Amount</th>
                <th className="py-2 pr-3 font-medium">Due</th>
                <th className="py-2 pr-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {AP.map((v) => (
                <tr key={v.vendor}>
                  <td className="py-2.5 pr-3 font-medium">{v.vendor}</td>
                  <td className="py-2.5 pr-3 text-right font-mono text-xs">${v.amount.toLocaleString()}</td>
                  <td className="py-2.5 pr-3 text-xs">{v.due}</td>
                  <td className="py-2.5 pr-3"><StatusPill level={v.status === "Scheduled" ? "blue" : "yellow"}>{v.status}</StatusPill></td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>
      </div>
    </HubPage>
  );
}
