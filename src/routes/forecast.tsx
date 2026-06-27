import { createFileRoute } from "@tanstack/react-router";
import { HubPage } from "@/components/hubs/page";
import { SectionCard, KpiCard, StatusPill, RiskBadge } from "@/components/enterprise/primitives";
import { Target, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/forecast")({
  head: () => ({ meta: [{ title: "Sales — Forecast" }] }),
  component: ForecastPage,
});

const REP_FORECAST = [
  { rep: "Anees Naveed",     quota: 250000, commit: 210000, bestCase: 295000, closed: 162000, win: 32 },
  { rep: "Priya Mehta",      quota: 220000, commit: 180000, bestCase: 240000, closed: 142000, win: 29 },
  { rep: "Marcus Lee",       quota: 200000, commit: 155000, bestCase: 235000, closed: 118000, win: 27 },
  { rep: "Jordan Kim",       quota: 180000, commit: 165000, bestCase: 210000, closed: 122000, win: 35 },
];

const STAGE_FUNNEL = [
  { stage: "Lead",        count: 142, value: 1820000, weight: 0.10 },
  { stage: "Qualified",   count:  86, value: 1340000, weight: 0.25 },
  { stage: "Proposal",    count:  48, value:  892000, weight: 0.45 },
  { stage: "Negotiation", count:  21, value:  462000, weight: 0.70 },
  { stage: "Closing",     count:   9, value:  198000, weight: 0.90 },
];

function ForecastPage() {
  const totalQuota = REP_FORECAST.reduce((s, r) => s + r.quota, 0);
  const totalClosed = REP_FORECAST.reduce((s, r) => s + r.closed, 0);
  const totalCommit = REP_FORECAST.reduce((s, r) => s + r.commit, 0);
  const weighted = STAGE_FUNNEL.reduce((s, f) => s + f.value * f.weight, 0);
  const max = Math.max(...STAGE_FUNNEL.map((f) => f.value));

  return (
    <HubPage
      title="Forecast Panel"
      description="Quota attainment, weighted pipeline, and AI-projected quarterly close."
      insights={[
        { title: "AI projected close: $812k",   body: "Confidence interval ±9%. Risk factors: 3 deals slipping in negotiation, EU pipeline thin.", confidence: 84, cta: "Open risk deals" },
        { title: "Marcus pacing 71% to quota",  body: "On current run-rate, projected attainment 89%. Consider routing 2 SDR-sourced leads.", confidence: 78, cta: "Route leads" },
      ]}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Quota"            value={`$${(totalQuota/1000).toFixed(0)}k`} icon={Target} />
        <KpiCard label="Closed QTD"       value={`$${(totalClosed/1000).toFixed(0)}k`} delta={12} icon={CheckCircle2} />
        <KpiCard label="Commit"           value={`$${(totalCommit/1000).toFixed(0)}k`} delta={4} />
        <KpiCard label="AI projected"     value={`$${(weighted/1000).toFixed(0)}k`} delta={6} icon={TrendingUp} />
      </div>

      <SectionCard title="Rep attainment" subtitle="Closed vs commit vs best-case vs quota">
        <ul className="space-y-3">
          {REP_FORECAST.map((r) => {
            const pctClosed = (r.closed / r.quota) * 100;
            const pctCommit = (r.commit / r.quota) * 100;
            return (
              <li key={r.rep}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium">{r.rep}</span>
                  <span className="text-muted-foreground">${(r.closed/1000).toFixed(0)}k / ${(r.quota/1000).toFixed(0)}k · win {r.win}%</span>
                </div>
                <div className="relative h-3 rounded-full bg-muted overflow-hidden">
                  <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${Math.min(100,pctCommit)}%`, background: "color-mix(in oklab, var(--primary) 35%, transparent)" }} />
                  <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${Math.min(100,pctClosed)}%`, background: "var(--primary)" }} />
                </div>
              </li>
            );
          })}
        </ul>
      </SectionCard>

      <SectionCard title="Weighted pipeline funnel" subtitle="Probability-weighted value by stage">
        <ul className="space-y-2">
          {STAGE_FUNNEL.map((f) => (
            <li key={f.stage} className="grid grid-cols-[120px_1fr_140px_70px] items-center gap-3">
              <span className="text-xs font-medium">{f.stage}</span>
              <div className="h-6 rounded bg-muted overflow-hidden">
                <div className="h-full rounded flex items-center justify-end pr-2 text-[10px] font-mono text-primary-foreground"
                  style={{ width: `${(f.value/max)*100}%`, background: "var(--primary)" }}>
                  ${(f.value/1000).toFixed(0)}k
                </div>
              </div>
              <span className="text-xs text-muted-foreground">{f.count} deals · w {Math.round(f.weight*100)}%</span>
              <RiskBadge confidence={Math.round(70 + f.weight*25)} />
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard title="Quarterly committing">
        <div className="grid grid-cols-3 gap-3 text-sm">
          {[
            { label: "Worst case", val: totalClosed,  pill: "red"    as const, sub: "high-confidence floor" },
            { label: "Commit",     val: totalCommit,  pill: "yellow" as const, sub: "expected outcome" },
            { label: "Best case",  val: REP_FORECAST.reduce((s, r) => s + r.bestCase, 0), pill: "green" as const, sub: "if upside lands" },
          ].map((c) => (
            <div key={c.label} className="rounded-lg border border-border p-3">
              <div className="flex items-center gap-2 mb-1">
                <StatusPill level={c.pill}>{c.label}</StatusPill>
              </div>
              <div className="font-display text-2xl font-semibold">${(c.val/1000).toFixed(0)}k</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">{c.sub}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-md border border-dashed border-border p-2.5 text-[11px] flex items-start gap-1.5">
          <AlertTriangle className="h-3 w-3 mt-0.5 text-[color:var(--warning)]" />
          <span><span className="font-medium">Limnn AI:</span> 3 negotiation deals at risk of slipping to next quarter — combined $148k at 65% historic win-rate.</span>
        </div>
      </SectionCard>
    </HubPage>
  );
}
