import { createFileRoute } from "@tanstack/react-router";
import { HubPage } from "@/components/hubs/page";
import { SectionCard, KpiCard, RiskBadge, Avatar } from "@/components/enterprise/primitives";
import { hubInsights } from "@/lib/hubs-data";
import { Gauge, Users, AlertOctagon } from "lucide-react";

export const Route = createFileRoute("/grid/capacity")({
  head: () => ({ meta: [{ title: "Grid — Team Capacity" }] }),
  component: CapacityPage,
});

const TEAM = [
  { name: "Mia P.", role: "Eng — Platform", load: 142, sprint: 21, skill: 92 },
  { name: "Sam D.", role: "Eng — Platform", load: 96, sprint: 14, skill: 88 },
  { name: "Alex R.", role: "Eng — AI", load: 108, sprint: 18, skill: 84 },
  { name: "Jordan K.", role: "Eng — Integrations", load: 78, sprint: 12, skill: 81 },
  { name: "Priya S.", role: "Design", load: 64, sprint: 8, skill: 76 },
];

function CapacityPage() {
  const avg = Math.round(TEAM.reduce((s, t) => s + t.load, 0) / TEAM.length);
  const over = TEAM.filter((t) => t.load > 100);
  return (
    <HubPage
      title="Team Capacity"
      description="Manager view — utilization, skill coverage, and reallocation suggestions."
      insights={hubInsights("grid")}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Team size" value={`${TEAM.length}`} icon={Users} />
        <KpiCard label="Avg utilization" value={`${avg}%`} delta={4} icon={Gauge} />
        <KpiCard label="Over capacity" value={`${over.length}`} icon={AlertOctagon} />
        <KpiCard label="Bench %" value="8%" />
      </div>

      <SectionCard title="Utilization by member">
        <ul className="space-y-3">
          {TEAM.map((m) => {
            const over = m.load > 100;
            return (
              <li key={m.name}>
                <div className="flex items-center gap-3 mb-1.5">
                  <Avatar name={m.name} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{m.name}</div>
                    <div className="text-[11px] text-muted-foreground">{m.role} · {m.sprint} pts sprint</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <RiskBadge confidence={m.skill} label="Skill" />
                    <span className="text-[11px] font-mono tabular-nums w-12 text-right" style={{ color: over ? "var(--destructive)" : "var(--foreground)" }}>{m.load}%</span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full" style={{
                    width: `${Math.min(100, m.load)}%`,
                    background: over ? "var(--destructive)" : m.load > 85 ? "var(--warning)" : "var(--success)",
                  }} />
                </div>
              </li>
            );
          })}
        </ul>
      </SectionCard>
    </HubPage>
  );
}
