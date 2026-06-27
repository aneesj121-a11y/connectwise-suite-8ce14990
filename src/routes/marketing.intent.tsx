import { createFileRoute } from "@tanstack/react-router";
import { HubPage } from "@/components/hubs/page";
import { SectionCard, KpiCard, RiskBadge, StatusPill, FilterBar } from "@/components/enterprise/primitives";
import { INTENT_SIGNALS, hubInsights } from "@/lib/hubs-data";
import { Radar, Flame, TrendingUp, Building2, Plus } from "lucide-react";

export const Route = createFileRoute("/marketing/intent")({
  head: () => ({ meta: [{ title: "Marketing — Intent Engine" }] }),
  component: IntentPage,
});

const TOPICS = [
  { topic: "AI dialer", surge: 38, accounts: 12, change: 24 },
  { topic: "Call recording compliance", surge: 27, accounts: 9, change: 18 },
  { topic: "Conversation intelligence", surge: 22, accounts: 14, change: 11 },
  { topic: "Contact center AI", surge: 19, accounts: 21, change: 7 },
  { topic: "Outbound sales tooling", surge: 16, accounts: 18, change: -4 },
];

function IntentPage() {
  return (
    <HubPage
      title="Intent Engine"
      description="ICP accounts ranked by surge in research activity, with auto-routed plays."
      actions={
        <button className="h-9 px-3 rounded-md text-sm font-medium text-primary-foreground inline-flex items-center gap-1.5" style={{ background: "var(--primary)" }}>
          <Plus className="h-3.5 w-3.5" /> Build sequence
        </button>
      }
      insights={hubInsights("marketing")}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Surging accounts" value="48" delta={22} icon={Flame} spark={[22, 26, 31, 35, 38, 42, 48]} />
        <KpiCard label="ICP overlap" value="64%" delta={6} icon={Building2} />
        <KpiCard label="Avg intent score" value="78" delta={9} icon={Radar} />
        <KpiCard label="MQL conversion" value="34%" delta={4} icon={TrendingUp} />
      </div>

      <SectionCard title="Top surging accounts" subtitle="Ranked by 7-day intent delta">
        <FilterBar chips={["All", "Tier 1", "FinServ", "Healthcare", "Logistics"]} active="All" />
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-muted-foreground border-b border-border">
            <tr>
              <th className="py-2 pr-3 font-medium">Account</th>
              <th className="py-2 pr-3 font-medium">Topic</th>
              <th className="py-2 pr-3 font-medium">Employees</th>
              <th className="py-2 pr-3 font-medium text-right">Score</th>
              <th className="py-2 pr-3 font-medium text-right">Δ 7d</th>
              <th className="py-2 pr-3 font-medium">Tier</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {INTENT_SIGNALS.map((s) => (
              <tr key={s.account} className="hover:bg-muted/40">
                <td className="py-2.5 pr-3 font-medium">{s.account}</td>
                <td className="py-2.5 pr-3 text-xs text-muted-foreground">{s.topic}</td>
                <td className="py-2.5 pr-3 text-xs">{s.employees}</td>
                <td className="py-2.5 pr-3 text-right font-mono text-xs">{s.score}</td>
                <td className="py-2.5 pr-3 text-right font-mono text-xs" style={{ color: s.change >= 0 ? "var(--success)" : "var(--destructive)" }}>
                  {s.change >= 0 ? "+" : ""}{s.change}
                </td>
                <td className="py-2.5 pr-3"><StatusPill level={s.score >= 85 ? "red" : s.score >= 75 ? "yellow" : "blue"}>
                  {s.score >= 85 ? "Hot" : s.score >= 75 ? "Warm" : "Watch"}
                </StatusPill></td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>

      <SectionCard title="Trending topics" subtitle="Across monitored ICP">
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {TOPICS.map((t) => (
            <li key={t.topic} className="rounded-lg border border-border p-3 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">{t.topic}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{t.accounts} accounts engaged</div>
              </div>
              <div className="text-right">
                <div className="font-mono text-sm">+{t.surge}%</div>
                <RiskBadge confidence={70 + t.surge} label="Trend" />
              </div>
            </li>
          ))}
        </ul>
      </SectionCard>
    </HubPage>
  );
}
