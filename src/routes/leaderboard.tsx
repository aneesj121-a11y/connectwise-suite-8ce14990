import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { HubPage } from "@/components/hubs/page";
import { SectionCard, KpiCard, Avatar, RiskBadge } from "@/components/enterprise/primitives";
import { Trophy, Phone, TrendingUp, Sparkles } from "lucide-react";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({ meta: [{ title: "Sales — Leaderboard" }] }),
  component: LeaderboardPage,
});

type Metric = "revenue" | "activity" | "pipeline";

const REPS = [
  { name: "Jordan Kim",  revenue: 142000, calls: 312, dials: 1410, pipeline: 286000, winRate: 35, gap: "Discovery depth", trainer: "Win-call review #14" },
  { name: "Anees Naveed",revenue: 162000, calls: 281, dials: 1280, pipeline: 245000, winRate: 32, gap: "Negotiation",     trainer: "Pricing objection module" },
  { name: "Priya Mehta", revenue: 138000, calls: 264, dials: 1190, pipeline: 232000, winRate: 30, gap: "Multi-thread",    trainer: "Champion-building track" },
  { name: "Marcus Lee",  revenue: 118000, calls: 218, dials: 980,  pipeline: 198000, winRate: 27, gap: "Activity volume", trainer: "Outbound rhythm reset" },
  { name: "Sara Allen",  revenue: 96000,  calls: 192, dials: 880,  pipeline: 174000, winRate: 24, gap: "Cold opener",     trainer: "Pattern-interrupt drills" },
];

function LeaderboardPage() {
  const [metric, setMetric] = useState<Metric>("revenue");
  const sorted = [...REPS].sort((a, b) => (metric === "revenue" ? b.revenue - a.revenue : metric === "activity" ? b.calls - a.calls : b.pipeline - a.pipeline));
  const max = Math.max(...sorted.map((r) => metric === "revenue" ? r.revenue : metric === "activity" ? r.calls : r.pipeline));
  const [open, setOpen] = useState<string | null>(null);

  return (
    <HubPage
      title="Performance Control"
      description="Stack-rank reps and surface skill gaps with AI-recommended training tracks."
      insights={[
        { title: "Skill gap pattern",   body: "Negotiation losses correlate with deals over $80k where discount > 18%. 3 reps share this pattern.", confidence: 86, cta: "Build cohort program" },
        { title: "Activity outlier",    body: "Sara's dials are healthy but call → meeting drops 38% vs team. Try the new opener template.", confidence: 81 },
      ]}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Team revenue"   value="$656k" delta={14} icon={Trophy} />
        <KpiCard label="Calls (week)"   value="1,267" delta={6}  icon={Phone} />
        <KpiCard label="Pipeline created" value="$1.14M" delta={9} icon={TrendingUp} />
        <KpiCard label="Avg win rate"   value="29.6%" delta={2} />
      </div>

      <SectionCard
        title="Stack ranking"
        subtitle="Filter by metric — click a rep to open the manager review drawer"
        action={
          <div className="inline-flex rounded-md border border-border overflow-hidden text-xs">
            {(["revenue","activity","pipeline"] as Metric[]).map((m) => (
              <button key={m} onClick={() => setMetric(m)} className={`h-7 px-2.5 capitalize font-medium ${metric===m?"bg-primary text-primary-foreground":""}`}>{m}</button>
            ))}
          </div>
        }
      >
        <ul className="divide-y divide-border">
          {sorted.map((r, i) => {
            const val = metric === "revenue" ? r.revenue : metric === "activity" ? r.calls : r.pipeline;
            const display = metric === "activity" ? val.toString() : `$${(val/1000).toFixed(0)}k`;
            const isOpen = open === r.name;
            return (
              <li key={r.name}>
                <button onClick={() => setOpen(isOpen ? null : r.name)} className="w-full py-3 grid grid-cols-[28px_28px_1fr_160px_100px] items-center gap-3 text-left hover:bg-muted/30 px-2 -mx-2 rounded">
                  <span className="font-mono text-xs text-muted-foreground">#{i+1}</span>
                  <Avatar name={r.name} size={28} />
                  <div>
                    <div className="text-sm font-medium">{r.name}</div>
                    <div className="text-[11px] text-muted-foreground">win {r.winRate}% · {r.calls} calls</div>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(val/max)*100}%`, background: "var(--primary)" }} />
                  </div>
                  <div className="text-right font-mono text-sm font-semibold">{display}</div>
                </button>
                {isOpen && (
                  <div className="ml-12 mr-2 mb-3 rounded-lg border border-border p-3 bg-muted/30 text-xs">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Sparkles className="h-3 w-3" style={{ color: "var(--primary)" }} />
                      <span className="font-medium">Manager review · AI audit</span>
                      <RiskBadge confidence={88} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-muted-foreground text-[10px] uppercase tracking-wider">Gap</div>
                        <div className="font-medium">{r.gap}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground text-[10px] uppercase tracking-wider">Recommended track</div>
                        <div className="font-medium">{r.trainer}</div>
                      </div>
                    </div>
                    <div className="mt-2 flex gap-1.5">
                      <button className="h-7 px-2 rounded text-[11px] font-medium text-primary-foreground" style={{ background: "var(--primary)" }}>Assign training</button>
                      <button className="h-7 px-2 rounded text-[11px] font-medium border border-border">Open 1:1 notes</button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </SectionCard>
    </HubPage>
  );
}
