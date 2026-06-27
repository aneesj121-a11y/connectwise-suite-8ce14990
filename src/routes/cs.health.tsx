import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { HubPage } from "@/components/hubs/page";
import { SectionCard, KpiCard } from "@/components/enterprise/primitives";
import { Activity, Settings2, AlertTriangle, Sparkles } from "lucide-react";

export const Route = createFileRoute("/cs/health")({
  head: () => ({ meta: [{ title: "Customer Success — Health Scoring" }] }),
  component: HealthPage,
});

type Factor = { id: string; label: string; weight: number; signal: string; trend: number };

const SEED: Factor[] = [
  { id: "usage",   label: "Product Utilization",  weight: 30, signal: "Daily active seats / licensed", trend: -4 },
  { id: "sent",    label: "Sentiment",            weight: 15, signal: "Support + survey NLP score",    trend: 2 },
  { id: "exec",    label: "Exec Engagement",      weight: 10, signal: "QBR + exec touches / quarter",  trend: 0 },
  { id: "supp",    label: "Support Load",         weight: 15, signal: "P1/P2 tickets / month",         trend: 6 },
  { id: "adopt",   label: "Feature Adoption",     weight: 15, signal: "Breadth across 12 core modules",trend: 3 },
  { id: "billing", label: "Billing Behavior",     weight: 10, signal: "Days payable + dunning hits",   trend: -1 },
  { id: "nps",     label: "NPS",                  weight: 5,  signal: "Latest rolling NPS",            trend: 1 },
];

function HealthPage() {
  const [factors, setFactors] = useState(SEED);
  const total = factors.reduce((s, f) => s + f.weight, 0);

  return (
    <HubPage
      title="Health Scoring Matrix"
      description="Tune the weighting model that drives every account's composite health score."
      insights={[
        { title: "Anomaly detected — Helios Health", body: "Product utilization dropped 38% in 7 days, right after the v4.2 release. Investigate feature regressions.", confidence: 93, cta: "Open account" },
        { title: "Weight imbalance", body: "Utilization weighted 30% but explains only 18% of churn variance in your cohort. Consider redistributing.", confidence: 81, cta: "Re-balance" },
      ]}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Avg health" value="68" delta={-2} icon={Activity} />
        <KpiCard label="Healthy %"  value="54%" delta={1} />
        <KpiCard label="At risk"    value="11" delta={3} icon={AlertTriangle} />
        <KpiCard label="Model fit"  value="0.82" delta={4} />
      </div>

      <SectionCard
        title="Weighted factors"
        subtitle={`Total weight ${total}% · must equal 100`}
        action={<button className="h-8 px-2.5 rounded-md text-xs font-medium text-primary-foreground inline-flex items-center gap-1" style={{ background: "var(--primary)" }}><Settings2 className="h-3 w-3" /> Save model</button>}
      >
        <ul className="divide-y divide-border">
          {factors.map((f) => (
            <li key={f.id} className="py-3 grid grid-cols-[1fr_220px_120px_80px] items-center gap-4">
              <div>
                <div className="font-medium text-sm">{f.label}</div>
                <div className="text-[11px] text-muted-foreground">{f.signal}</div>
              </div>
              <input type="range" min={0} max={50} value={f.weight}
                onChange={(e) => setFactors((arr) => arr.map((x) => x.id === f.id ? { ...x, weight: Number(e.target.value) } : x))}
                className="w-full accent-[var(--primary)]" />
              <div className="text-xs text-muted-foreground">
                <span className={f.trend > 0 ? "text-[color:var(--destructive)]" : f.trend < 0 ? "text-[color:var(--success)]" : ""}>
                  {f.trend > 0 ? "+" : ""}{f.trend}% trend
                </span>
              </div>
              <div className="text-right font-mono font-semibold">{f.weight}%</div>
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard title="Anomaly stream" subtitle="Live ML flags — change detection across the book">
        <ul className="space-y-2 text-sm">
          {[
            { acct: "Helios Health", note: "Utilization −38% in 7d post v4.2 release", conf: 93 },
            { acct: "Vanta Logistics", note: "Support tickets +220% week-over-week", conf: 88 },
            { acct: "Pioneer Mutual", note: "Exec attendance at QBR dropped to 1 of 4", conf: 74 },
          ].map((a, i) => (
            <li key={i} className="flex items-start gap-2 rounded-md border border-border p-2.5">
              <Sparkles className="h-3.5 w-3.5 mt-0.5" style={{ color: "var(--primary)" }} />
              <div className="flex-1">
                <div className="font-medium">{a.acct}</div>
                <div className="text-xs text-muted-foreground">{a.note}</div>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ background: "color-mix(in oklab, var(--primary) 10%, transparent)", color: "var(--primary)" }}>{a.conf}%</span>
            </li>
          ))}
        </ul>
      </SectionCard>
    </HubPage>
  );
}
