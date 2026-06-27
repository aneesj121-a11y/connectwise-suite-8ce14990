import { createFileRoute } from "@tanstack/react-router";
import { HubPage } from "@/components/hubs/page";
import { SectionCard, KpiCard, StatusPill } from "@/components/enterprise/primitives";
import { hubInsights } from "@/lib/hubs-data";
import { Goal, Target, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/grid/okrs")({
  head: () => ({ meta: [{ title: "Grid — OKRs" }] }),
  component: OkrsPage,
});

const OKRS = [
  {
    objective: "Become the #1 AI dialer for mid-market",
    owner: "Anees Naveed",
    krs: [
      { kr: "Reach $5M ARR run-rate", progress: 64, target: "$5.0M", current: "$3.2M" },
      { kr: "NPS ≥ 55", progress: 78, target: "55", current: "48" },
      { kr: "Win rate vs Aircall ≥ 55%", progress: 52, target: "55%", current: "44%" },
    ],
  },
  {
    objective: "Make Limnn AI feel magical out of the box",
    owner: "Priya Shah",
    krs: [
      { kr: "Median time-to-value ≤ 5 days", progress: 71, target: "5d", current: "7.2d" },
      { kr: "AI coach adoption ≥ 80%", progress: 82, target: "80%", current: "73%" },
      { kr: "Auto-deflect rate ≥ 35%", progress: 60, target: "35%", current: "27%" },
    ],
  },
  {
    objective: "Build a category-defining brand",
    owner: "Marcus Lee",
    krs: [
      { kr: "Inbound demos +50% QoQ", progress: 88, target: "+50%", current: "+44%" },
      { kr: "Organic traffic 80k/mo", progress: 56, target: "80k", current: "44.8k" },
    ],
  },
];

function OkrsPage() {
  const flat = OKRS.flatMap((o) => o.krs);
  const avg = Math.round(flat.reduce((s, k) => s + k.progress, 0) / flat.length);
  return (
    <HubPage
      title="OKRs"
      description="Quarterly objectives & key results with live progress."
      insights={hubInsights("grid")}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Active objectives" value={`${OKRS.length}`} icon={Goal} />
        <KpiCard label="Key results" value={`${flat.length}`} icon={Target} />
        <KpiCard label="Avg attainment" value={`${avg}%`} delta={6} icon={TrendingUp} />
        <KpiCard label="On track" value={`${flat.filter(k=>k.progress>=70).length}`} />
      </div>

      <div className="space-y-3">
        {OKRS.map((o) => (
          <SectionCard
            key={o.objective}
            title={o.objective}
            subtitle={`Owner · ${o.owner}`}
          >
            <ul className="space-y-3">
              {o.krs.map((k) => (
                <li key={k.kr}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium">{k.kr}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-muted-foreground font-mono">{k.current} / {k.target}</span>
                      <StatusPill level={k.progress >= 70 ? "green" : k.progress >= 50 ? "yellow" : "red"}>{k.progress}%</StatusPill>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full" style={{
                      width: `${k.progress}%`,
                      background: k.progress >= 70 ? "var(--success)" : k.progress >= 50 ? "var(--warning)" : "var(--destructive)",
                    }} />
                  </div>
                </li>
              ))}
            </ul>
          </SectionCard>
        ))}
      </div>
    </HubPage>
  );
}
