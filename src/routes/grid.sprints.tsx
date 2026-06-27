import { createFileRoute } from "@tanstack/react-router";
import { HubPage } from "@/components/hubs/page";
import { SectionCard, KpiCard, StatusPill, RiskBadge } from "@/components/enterprise/primitives";
import { hubInsights } from "@/lib/hubs-data";
import { Activity, Target, Timer, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/grid/sprints")({
  head: () => ({ meta: [{ title: "Grid — Active Sprints" }] }),
  component: SprintsPage,
});

const SPRINTS = [
  { id: "S-24", name: "Platform · Sprint 24", team: "Platform", points: 42, done: 28, status: "Running", days: 7, risk: 38 },
  { id: "S-24b", name: "AI · Sprint 24", team: "AI", points: 36, done: 21, status: "Running", days: 7, risk: 62 },
  { id: "S-24c", name: "Integrations · Sprint 24", team: "Integrations", points: 28, done: 24, status: "Running", days: 7, risk: 14 },
  { id: "S-23", name: "Platform · Sprint 23", team: "Platform", points: 40, done: 40, status: "Closed", days: 0, risk: 0 },
  { id: "S-23b", name: "AI · Sprint 23", team: "AI", points: 32, done: 28, status: "Closed", days: 0, risk: 0 },
];

function SprintsPage() {
  return (
    <HubPage
      title="Active Sprints"
      description="Cross-team sprint health, velocity, and burn-down."
      insights={hubInsights("grid")}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Active sprints" value="3" icon={Activity} />
        <KpiCard label="Avg velocity" value="34" delta={4} icon={TrendingUp} />
        <KpiCard label="Forecast completion" value="84%" delta={-3} icon={Target} />
        <KpiCard label="Cycle time" value="3.2d" delta={-8} icon={Timer} />
      </div>

      <SectionCard title="Sprint overview">
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-muted-foreground border-b border-border">
            <tr>
              <th className="py-2 pr-3 font-medium">Sprint</th>
              <th className="py-2 pr-3 font-medium">Team</th>
              <th className="py-2 pr-3 font-medium">Status</th>
              <th className="py-2 pr-3 font-medium text-right">Days left</th>
              <th className="py-2 pr-3 font-medium">Progress</th>
              <th className="py-2 pr-3 font-medium">Risk</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {SPRINTS.map((s) => {
              const pct = Math.round((s.done / s.points) * 100);
              return (
                <tr key={s.id} className="hover:bg-muted/40">
                  <td className="py-2.5 pr-3 font-medium">{s.name}</td>
                  <td className="py-2.5 pr-3 text-xs">{s.team}</td>
                  <td className="py-2.5 pr-3"><StatusPill level={s.status === "Running" ? "blue" : "green"}>{s.status}</StatusPill></td>
                  <td className="py-2.5 pr-3 text-right font-mono text-xs">{s.days || "—"}</td>
                  <td className="py-2.5 pr-3 min-w-[180px]">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 rounded-full bg-muted flex-1 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "var(--primary)" }} />
                      </div>
                      <span className="font-mono text-[11px] tabular-nums w-16 text-right">{s.done}/{s.points}</span>
                    </div>
                  </td>
                  <td className="py-2.5 pr-3">{s.risk > 0 ? <RiskBadge confidence={s.risk} label="Slip" /> : <span className="text-xs text-muted-foreground">—</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </SectionCard>
    </HubPage>
  );
}
