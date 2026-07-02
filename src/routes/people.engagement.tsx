import { createFileRoute } from "@tanstack/react-router";
import { HubPage } from "@/components/hubs/page";
import { SectionCard, KpiCard, RiskBadge } from "@/components/enterprise/primitives";
import { Heart, TrendingUp, MessageSquare, Sparkles } from "lucide-react";

const ACCENT = "oklch(0.58 0.18 280)";

export const Route = createFileRoute("/people/engagement")({
  head: () => ({ meta: [{ title: "Engagement — Limnn People" }] }),
  component: Engagement,
});

const PULSE = [
  { cat: "Manager quality", score: 8.1 },
  { cat: "Career growth", score: 6.4 },
  { cat: "Compensation", score: 5.8 },
  { cat: "Recognition", score: 7.5 },
  { cat: "Wellbeing", score: 7.2 },
  { cat: "Purpose", score: 8.4 },
  { cat: "Belonging", score: 7.9 },
  { cat: "Workload", score: 5.2 },
];

function scoreColor(s: number) {
  if (s >= 7) return "#10B981";
  if (s >= 5) return "#F59E0B";
  return "#EF4444";
}

function Engagement() {
  return (
    <HubPage title="Engagement" description="Pulse surveys, sentiment and eNPS.">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="eNPS" value="42" delta={6} icon={Heart} />
        <KpiCard label="Response rate" value="78%" delta={4} icon={MessageSquare} />
        <KpiCard label="Engagement" value="7.2/10" delta={2} icon={TrendingUp} />
        <KpiCard label="12mo trend" value="↑" spark={[6.4, 6.6, 6.5, 6.8, 6.9, 7.0, 7.1, 7.2]} icon={TrendingUp} />
      </div>

      <SectionCard title="Pulse survey — Q2" subtitle="Scores by category (0–10)">
        <div className="space-y-2.5">
          {PULSE.map((p) => (
            <div key={p.cat} className="flex items-center gap-3">
              <span className="w-40 text-xs shrink-0">{p.cat}</span>
              <div className="flex-1 h-5 bg-muted rounded overflow-hidden">
                <div className="h-full rounded" style={{ width: `${p.score * 10}%`, background: scoreColor(p.score) }} />
              </div>
              <span className="w-10 text-right text-xs font-mono">{p.score.toFixed(1)}</span>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title={<span className="inline-flex items-center gap-2"><span className="h-6 w-6 rounded-md grid place-items-center" style={{ background: `color-mix(in oklab, ${ACCENT} 14%, transparent)`, color: ACCENT }}><Sparkles className="h-3 w-3" /></span> AI Sentiment</span>}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Sentiment trend</div>
            <div className="text-2xl font-display font-semibold text-emerald-600">+6.4pt</div>
            <p className="text-xs text-muted-foreground">Positive share up 6.4pt QoQ. Negative sentiment down 3.1pt.</p>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Key concerns</div>
            <ul className="text-xs space-y-1">
              <li>· Workload (mentioned 41x)</li>
              <li>· Comp transparency (32x)</li>
              <li>· Cross-team dependencies (24x)</li>
            </ul>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Emerging themes</div>
            <ul className="text-xs space-y-1">
              <li>+ AI tooling excitement</li>
              <li>+ New office (Sydney) sentiment</li>
              <li>+ Career growth momentum</li>
            </ul>
          </div>
        </div>
        <div className="mt-3"><RiskBadge confidence={85} /></div>
      </SectionCard>
    </HubPage>
  );
}
