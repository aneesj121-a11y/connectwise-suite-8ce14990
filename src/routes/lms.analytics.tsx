import { createFileRoute } from "@tanstack/react-router";
import { HubPage } from "@/components/hubs/page";
import { KpiCard, SectionCard } from "@/components/enterprise/primitives";
import { TEAM_STATS, SKILLS, SKILL_MATRIX, heatColor } from "@/lib/lms-extra";
import { BarChart3, TrendingUp, DollarSign, GitCompare } from "lucide-react";

export const Route = createFileRoute("/lms/analytics")({
  head: () => ({ meta: [{ title: "Skill-gap & ROI — Limnn LMS" }] }),
  component: Analytics,
});

function Analytics() {
  return (
    <HubPage
      title="Skill-gap & ROI Analytics"
      description="Where every team is strong and weak — and the financial return of every learning hour invested."
      insights={[
        { title: "Highest leverage: Objection handling", body: "Lifting Sales from 72 → 85 correlates with +$148k pipeline / month based on last 6 mo.", confidence: 84, cta: "Build path" },
        { title: "Marketing → Discovery gap", body: "Marketing scores 50 on Discovery. Cross-train with the Sales AIO track for 4 weeks.", confidence: 78 },
      ]}
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="Avg skill score" value="74"      delta={5}  icon={BarChart3} />
        <KpiCard label="Hours invested (Q)" value="3,140" delta={18} icon={TrendingUp} />
        <KpiCard label="$ / learning hour"  value="$142"  delta={9}  icon={DollarSign} />
        <KpiCard label="Cohorts active"    value="6"      icon={GitCompare} />
      </div>

      <SectionCard title="Skill-gap heatmap" subtitle="Team × competency · darker green = strength, red = gap">
        <div className="overflow-x-auto">
          <table className="w-full text-[12px] border-separate border-spacing-1">
            <thead>
              <tr>
                <th className="text-left font-medium text-muted-foreground px-2 py-1.5 w-[160px]">Team</th>
                {SKILLS.map((s) => (
                  <th key={s} className="text-left font-medium text-muted-foreground px-2 py-1.5 whitespace-nowrap">{s}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TEAM_STATS.map((t) => (
                <tr key={t.id}>
                  <td className="px-2 py-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full" style={{ background: t.color }} />
                      <span className="font-medium">{t.name}</span>
                    </div>
                  </td>
                  {SKILLS.map((s) => {
                    const v = SKILL_MATRIX[t.id][s];
                    return (
                      <td
                        key={s}
                        className="px-2 py-2 rounded-md text-center font-mono text-[12px] border border-border"
                        style={{ background: heatColor(v) }}
                      >
                        {v}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <SectionCard title="Cohort comparison" subtitle="Q1-26 vs Q4-25">
          <ul className="space-y-2.5 text-[13px]">
            {[
              { label: "Time to first cert", a: "11 d", b: "14 d", win: "Q1-26" },
              { label: "Foundation pass-rate (1st try)", a: "82%", b: "74%", win: "Q1-26" },
              { label: "Avg quiz score", a: "87", b: "82", win: "Q1-26" },
              { label: "Practical re-submission rate", a: "12%", b: "9%", win: "Q4-25" },
            ].map((r, i) => (
              <li key={i} className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2">
                <span className="text-muted-foreground">{r.label}</span>
                <span className="flex items-center gap-3 font-mono text-[12px]">
                  <span className={r.win === "Q1-26" ? "text-foreground font-semibold" : "text-muted-foreground"}>{r.a}</span>
                  <span className="text-muted-foreground">vs</span>
                  <span className={r.win === "Q4-25" ? "text-foreground font-semibold" : "text-muted-foreground"}>{r.b}</span>
                </span>
              </li>
            ))}
          </ul>
        </SectionCard>
        <SectionCard title="ROI snapshot" subtitle="Modeled from CRM + LMS join">
          <dl className="grid grid-cols-2 gap-3 text-[12px]">
            {[
              { l: "Pipeline lift (Sales)", v: "+$148k / mo" },
              { l: "Avg deal cycle reduction", v: "−6.2 days" },
              { l: "Support CSAT lift", v: "+0.4 pts" },
              { l: "Ramp time saved", v: "−9 days" },
              { l: "Voluntary attrition", v: "−14%" },
              { l: "Cost per certified hire", v: "$486" },
            ].map((m, i) => (
              <div key={i} className="rounded-lg border border-border p-3">
                <dt className="text-muted-foreground">{m.l}</dt>
                <dd className="mt-1 font-display text-xl font-semibold tracking-tight">{m.v}</dd>
              </div>
            ))}
          </dl>
        </SectionCard>
      </div>
    </HubPage>
  );
}
