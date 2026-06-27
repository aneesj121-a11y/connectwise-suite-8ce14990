import { createFileRoute } from "@tanstack/react-router";
import { HubPage } from "@/components/hubs/page";
import { SectionCard, KpiCard, StatusPill, RiskBadge } from "@/components/enterprise/primitives";
import { TrendingUp, Sparkles, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/cs/expansion")({
  head: () => ({ meta: [{ title: "Customer Success — Expansion Ops" }] }),
  component: ExpansionPage,
});

const EXPANSION = [
  { acct: "Acme Corporation", trigger: "Seats at 92% of licensed", arr: 220800, opp: 64000, conf: 87, lookalike: "Globex (won $86k)" },
  { acct: "Atlas Robotics",   trigger: "AI minutes 138% of plan",  arr: 115200, opp: 18000, conf: 79, lookalike: "Acme Upsell (won $42k)" },
  { acct: "Bluebird Media",   trigger: "Adopted 9/12 core modules", arr: 76800, opp: 28000, conf: 82, lookalike: "Initech (won $75k)" },
  { acct: "Northwind Bank",   trigger: "Compliance pack inquiry",   arr: 504000, opp: 96000, conf: 71, lookalike: "Helios (lost)" },
];

function ExpansionPage() {
  const total = EXPANSION.reduce((s, e) => s + e.opp, 0);
  return (
    <HubPage
      title="Expansion Ops"
      description="High-intent upsell pipeline driven by usage signals and lookalike matching."
      insights={[
        { title: "ICP lookalike match", body: "Bluebird Media matches the profile of 3 past expansions averaging $48k. Recommend AE handoff.", confidence: 84, cta: "Route to AE" },
        { title: "Usage cliff: Atlas", body: "AI minutes consistently at 130%+ of plan for 6 weeks. Pre-emptive overage conversation suggested.", confidence: 79 },
      ]}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Pipeline ARR"      value={`$${(total/1000).toFixed(0)}k`} delta={18} icon={TrendingUp} spark={[120,140,160,180,170,190,206]} />
        <KpiCard label="Open expansions"   value={`${EXPANSION.length}`} delta={2} />
        <KpiCard label="Avg AI confidence" value={`${Math.round(EXPANSION.reduce((s,e)=>s+e.conf,0)/EXPANSION.length)}%`} delta={5} />
        <KpiCard label="Win rate (TTM)"    value="62%" delta={4} />
      </div>

      <SectionCard title="Expansion candidates" subtitle="Ranked by ML intent + lookalike score">
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-muted-foreground border-b border-border">
            <tr>
              <th className="py-2 pr-3 font-medium">Account</th>
              <th className="py-2 pr-3 font-medium">Trigger</th>
              <th className="py-2 pr-3 font-medium text-right">ARR</th>
              <th className="py-2 pr-3 font-medium text-right">Est. expansion</th>
              <th className="py-2 pr-3 font-medium">AI lookalike</th>
              <th className="py-2 pr-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {EXPANSION.map((e) => (
              <tr key={e.acct} className="hover:bg-muted/40">
                <td className="py-3 pr-3 font-medium">{e.acct}</td>
                <td className="py-3 pr-3 text-xs">
                  <StatusPill level="blue">{e.trigger}</StatusPill>
                  <span className="ml-1.5 align-middle"><RiskBadge confidence={e.conf} /></span>
                </td>
                <td className="py-3 pr-3 text-right font-mono text-xs">${e.arr.toLocaleString()}</td>
                <td className="py-3 pr-3 text-right font-mono text-sm font-semibold">${e.opp.toLocaleString()}</td>
                <td className="py-3 pr-3 text-xs text-muted-foreground flex items-center gap-1"><Sparkles className="h-3 w-3" />{e.lookalike}</td>
                <td className="py-3 pr-3 text-right">
                  <button className="inline-flex items-center text-xs font-medium" style={{ color: "var(--primary)" }}>
                    Draft quote <ChevronRight className="h-3 w-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>
    </HubPage>
  );
}
