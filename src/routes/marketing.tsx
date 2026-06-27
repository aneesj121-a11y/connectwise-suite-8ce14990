import { createFileRoute } from "@tanstack/react-router";
import { KpiCard, SectionCard, StatusPill, RiskBadge, FilterBar, PageHeader } from "@/components/enterprise/primitives";
import { CAMPAIGNS, INTENT_SIGNALS, hubInsights } from "@/lib/hubs-data";
import { HubPage } from "@/components/hubs/page";
import { Megaphone, Radar, TrendingUp, Target, DollarSign, Plus } from "lucide-react";

export const Route = createFileRoute("/marketing")({
  head: () => ({ meta: [{ title: "Marketing — Growth Analytics" }] }),
  component: MarketingPage,
});

function MarketingPage() {
  return (
    <HubPage
      title="Growth Analytics"
      description="Pipeline contribution, channel ROI, and AI-driven campaign lift."
      actions={
        <button className="h-9 px-3 rounded-md text-sm font-medium text-primary-foreground inline-flex items-center gap-1.5" style={{ background: "var(--primary)" }}>
          <Plus className="h-3.5 w-3.5" /> New campaign
        </button>
      }
      insights={hubInsights("marketing")}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Pipeline sourced" value="$2.41M" delta={18} icon={TrendingUp} spark={[12, 18, 14, 22, 20, 26, 31]} />
        <KpiCard label="MQL → SQL" value="34%" delta={4} icon={Target} spark={[28, 30, 29, 31, 32, 33, 34]} />
        <KpiCard label="CAC payback" value="11.2 mo" delta={-6} icon={DollarSign} spark={[14, 13, 13, 12, 12, 11.5, 11.2]} />
        <KpiCard label="Avg AI lift" value="+32%" delta={9} icon={Radar} spark={[18, 22, 24, 27, 29, 30, 32]} />
      </div>

      <SectionCard
        title="Active AI Campaigns"
        subtitle={`${CAMPAIGNS.filter((c) => c.status === "Running").length} running · ${CAMPAIGNS.length} total`}
        action={
          <button className="h-8 px-2.5 rounded-md border border-border text-xs font-medium inline-flex items-center gap-1.5 hover:bg-accent">
            <Megaphone className="h-3 w-3" /> Manage
          </button>
        }
      >
        <FilterBar chips={["All", "Running", "Scheduled", "Paused", "Draft"]} active="All" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-muted-foreground border-b border-border">
              <tr>
                <th className="py-2 pr-3 font-medium">Campaign</th>
                <th className="py-2 pr-3 font-medium">Channel</th>
                <th className="py-2 pr-3 font-medium">Status</th>
                <th className="py-2 pr-3 font-medium">Audience</th>
                <th className="py-2 pr-3 font-medium text-right">Spend</th>
                <th className="py-2 pr-3 font-medium text-right">Conv</th>
                <th className="py-2 pr-3 font-medium text-right">AI lift</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {CAMPAIGNS.map((c) => (
                <tr key={c.id} className="hover:bg-muted/40">
                  <td className="py-2.5 pr-3 font-medium">{c.name}</td>
                  <td className="py-2.5 pr-3 text-muted-foreground">{c.channel}</td>
                  <td className="py-2.5 pr-3">
                    <StatusPill
                      level={c.status === "Running" ? "green" : c.status === "Scheduled" ? "blue" : c.status === "Paused" ? "yellow" : "neutral"}
                    >
                      {c.status}
                    </StatusPill>
                  </td>
                  <td className="py-2.5 pr-3 text-muted-foreground text-xs">{c.audience}</td>
                  <td className="py-2.5 pr-3 text-right font-mono text-xs">${c.spend.toLocaleString()}</td>
                  <td className="py-2.5 pr-3 text-right font-mono text-xs">{c.conv}%</td>
                  <td className="py-2.5 pr-3 text-right">
                    {c.aiLift > 0 ? <RiskBadge confidence={c.aiLift} label="Lift" /> : <span className="text-xs text-muted-foreground">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard title="Top intent signals" subtitle="Surging accounts in last 7 days">
        <ul className="divide-y divide-border">
          {INTENT_SIGNALS.map((s) => (
            <li key={s.account} className="py-2.5 flex items-center gap-3">
              <Radar className="h-3.5 w-3.5 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{s.account}</div>
                <div className="text-xs text-muted-foreground">{s.topic} · {s.employees}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-mono">{s.score}</div>
                <div className={`text-[11px] font-medium ${s.change >= 0 ? "text-[color:var(--success)]" : "text-[color:var(--destructive)]"}`}>
                  {s.change >= 0 ? "+" : ""}{s.change}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </SectionCard>
    </HubPage>
  );
}
