import { createFileRoute } from "@tanstack/react-router";
import { HubPage } from "@/components/hubs/page";
import { SectionCard, KpiCard, StatusPill, RiskBadge, FilterBar } from "@/components/enterprise/primitives";
import { CAMPAIGNS, hubInsights } from "@/lib/hubs-data";
import { Megaphone, Plus, Play, Pause } from "lucide-react";

export const Route = createFileRoute("/marketing/campaigns")({
  head: () => ({ meta: [{ title: "Marketing — AI Campaigns" }] }),
  component: CampaignsPage,
});

function CampaignsPage() {
  const totalSpend = CAMPAIGNS.reduce((s, c) => s + c.spend, 0);
  const running = CAMPAIGNS.filter((c) => c.status === "Running");
  const avgLift = Math.round(CAMPAIGNS.filter((c) => c.aiLift > 0).reduce((s, c) => s + c.aiLift, 0) / CAMPAIGNS.filter((c) => c.aiLift > 0).length);

  return (
    <HubPage
      title="AI Campaigns"
      description="Audience design, channel mix, and ML lift attribution per campaign."
      actions={
        <button className="h-9 px-3 rounded-md text-sm font-medium text-primary-foreground inline-flex items-center gap-1.5" style={{ background: "var(--primary)" }}>
          <Plus className="h-3.5 w-3.5" /> New campaign
        </button>
      }
      insights={hubInsights("marketing")}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Live campaigns" value={`${running.length}`} icon={Megaphone} />
        <KpiCard label="Total spend (qtr)" value={`$${(totalSpend / 1000).toFixed(0)}k`} delta={11} />
        <KpiCard label="Avg AI lift" value={`+${avgLift}%`} delta={6} />
        <KpiCard label="Pipeline sourced" value="$2.41M" delta={18} />
      </div>

      <SectionCard title="All campaigns">
        <FilterBar chips={["All", "Email", "LinkedIn", "Webinar", "Paid Search", "Display"]} active="All" />
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-muted-foreground border-b border-border">
            <tr>
              <th className="py-2 pr-3 font-medium">Campaign</th>
              <th className="py-2 pr-3 font-medium">Channel</th>
              <th className="py-2 pr-3 font-medium">Audience</th>
              <th className="py-2 pr-3 font-medium">Status</th>
              <th className="py-2 pr-3 font-medium text-right">Spend</th>
              <th className="py-2 pr-3 font-medium text-right">Conv</th>
              <th className="py-2 pr-3 font-medium text-right">Lift</th>
              <th className="py-2 pr-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {CAMPAIGNS.map((c) => (
              <tr key={c.id} className="hover:bg-muted/40">
                <td className="py-2.5 pr-3 font-medium">{c.name}</td>
                <td className="py-2.5 pr-3 text-xs text-muted-foreground">{c.channel}</td>
                <td className="py-2.5 pr-3 text-xs text-muted-foreground">{c.audience}</td>
                <td className="py-2.5 pr-3">
                  <StatusPill level={c.status === "Running" ? "green" : c.status === "Scheduled" ? "blue" : c.status === "Paused" ? "yellow" : "neutral"}>{c.status}</StatusPill>
                </td>
                <td className="py-2.5 pr-3 text-right font-mono text-xs">${c.spend.toLocaleString()}</td>
                <td className="py-2.5 pr-3 text-right font-mono text-xs">{c.conv}%</td>
                <td className="py-2.5 pr-3 text-right">{c.aiLift > 0 ? <RiskBadge confidence={c.aiLift} label="Lift" /> : <span className="text-xs text-muted-foreground">—</span>}</td>
                <td className="py-2.5 pr-3 text-right">
                  <button className="inline-flex items-center gap-1 text-xs font-medium" style={{ color: "var(--primary)" }}>
                    {c.status === "Running" ? <><Pause className="h-3 w-3" /> Pause</> : <><Play className="h-3 w-3" /> Launch</>}
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
