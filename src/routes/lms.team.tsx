import { createFileRoute } from "@tanstack/react-router";
import { HubPage } from "@/components/hubs/page";
import { KpiCard, SectionCard, StatusPill, TrendSpark, Avatar } from "@/components/enterprise/primitives";
import { TEAM_STATS } from "@/lib/lms-extra";
import { ENROLLMENTS, trackById } from "@/lib/lms-data";
import { Users, GraduationCap, Award, AlertTriangle, Clock4, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/lms/team")({
  head: () => ({ meta: [{ title: "Team Stats — Limnn LMS" }] }),
  component: TeamStats,
});

function TeamStats() {
  const totalMembers = TEAM_STATS.reduce((s, t) => s + t.members, 0);
  const avgCompletion = Math.round(TEAM_STATS.reduce((s, t) => s + t.avgCompletion * t.members, 0) / totalMembers);
  const atRisk = TEAM_STATS.reduce((s, t) => s + t.atRisk, 0);
  const hours = TEAM_STATS.reduce((s, t) => s + t.hoursThisMonth, 0);

  return (
    <HubPage
      title="Team Stats"
      description="Cross-team learning health, certification coverage, and retraining signals."
      insights={[
        { title: "Marketing is lagging", body: "Avg completion 68% vs org 81%. 2 members flagged. Suggest a 30-min kickoff.", confidence: 87, cta: "Send nudge" },
        { title: "Support Ops at risk", body: "5 members below 60% completion on the P1 drill. Auto-enroll in remedial track?", confidence: 91, cta: "Enroll cohort" },
        { title: "Sales certification spike", body: "AIO certifications +18% WoW after Naveed's bootcamp. Replicate format in CS.", confidence: 79 },
      ]}
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="People in scope"      value={String(totalMembers)} icon={Users} />
        <KpiCard label="Avg completion"       value={`${avgCompletion}%`} delta={6} icon={GraduationCap} />
        <KpiCard label="Active certifications" value="71%" delta={4} icon={Award} />
        <KpiCard label="Flagged for retraining" value={String(atRisk)} delta={-12} icon={AlertTriangle} />
      </div>

      <SectionCard title="Teams" subtitle={`${TEAM_STATS.length} teams · ${hours.toLocaleString()} learning hours this month`}>
        <div className="overflow-x-auto -m-5">
          <table className="w-full text-sm">
            <thead className="text-[11px] uppercase tracking-wide text-muted-foreground">
              <tr className="border-b border-border">
                <th className="text-left font-medium px-5 py-2.5">Team</th>
                <th className="text-left font-medium px-3 py-2.5">Manager</th>
                <th className="text-right font-medium px-3 py-2.5">People</th>
                <th className="text-left font-medium px-3 py-2.5 w-[220px]">Avg completion</th>
                <th className="text-right font-medium px-3 py-2.5">Certified</th>
                <th className="text-right font-medium px-3 py-2.5">Quiz avg</th>
                <th className="text-right font-medium px-3 py-2.5">Hours / mo</th>
                <th className="text-left font-medium px-3 py-2.5">Trend</th>
                <th className="text-left font-medium px-5 py-2.5">Health</th>
              </tr>
            </thead>
            <tbody>
              {TEAM_STATS.map((t) => {
                const trk = trackById(t.trendingTrack);
                const health = t.atRisk >= 4 ? "red" : t.atRisk >= 2 ? "yellow" : "green";
                return (
                  <tr key={t.id} className="border-b border-border/60 hover:bg-accent/40">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span className="h-7 w-7 rounded-md grid place-items-center" style={{ background: `color-mix(in oklab, ${t.color} 14%, transparent)`, color: t.color }}>
                          <Users className="h-3.5 w-3.5" />
                        </span>
                        <div>
                          <div className="font-medium text-[13px]">{t.name}</div>
                          <div className="text-[11px] text-muted-foreground">Top track: {trk?.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3"><div className="flex items-center gap-1.5"><Avatar name={t.manager} /> <span className="text-[12px]">{t.manager}</span></div></td>
                    <td className="px-3 py-3 text-right font-mono text-[12px]">{t.members}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden min-w-[80px]">
                          <div className="h-full rounded-full" style={{ width: `${t.avgCompletion}%`, background: t.color }} />
                        </div>
                        <span className="font-mono text-[11px] w-9 text-right">{t.avgCompletion}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-[12px]">{t.certifiedPct}%</td>
                    <td className="px-3 py-3 text-right font-mono text-[12px]">{t.avgQuizScore}</td>
                    <td className="px-3 py-3 text-right font-mono text-[12px]">{t.hoursThisMonth}</td>
                    <td className="px-3 py-3"><TrendSpark values={t.spark} color={t.color} /></td>
                    <td className="px-5 py-3">
                      <StatusPill level={health as "red" | "yellow" | "green"}>
                        {t.atRisk} at risk
                      </StatusPill>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <SectionCard title="Members needing attention" subtitle="Low completion or repeat quiz failures">
          <ul className="space-y-2">
            {ENROLLMENTS.filter((e) => e.retrainingFlag || e.completionPct < 60).map((e, i) => (
              <li key={i} className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Avatar name={e.trainee} />
                  <div className="min-w-0">
                    <div className="text-[13px] font-medium truncate">{e.trainee}</div>
                    <div className="text-[11px] text-muted-foreground truncate">
                      {trackById(e.trackId)?.name} · {e.cohort} · {e.lastQuizAttempts} attempts
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-mono text-[11px] text-muted-foreground">{e.completionPct}%</span>
                  <StatusPill level={e.retrainingFlag ? "red" : "yellow"}>
                    {e.retrainingFlag ? "Retrain" : "Behind"}
                  </StatusPill>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Manager actions" subtitle="One-click team operations">
          <div className="grid grid-cols-1 gap-2">
            {[
              { icon: GraduationCap, label: "Assign new mandatory track",  meta: "Choose audience + due date" },
              { icon: Clock4,        label: "Schedule live coaching",      meta: "Block 30 min on the team calendar" },
              { icon: AlertTriangle, label: "Auto-enroll at-risk cohort",  meta: "8 members will be enrolled" },
              { icon: TrendingUp,    label: "Export team performance PDF", meta: "Shareable with your VP" },
            ].map((a, i) => (
              <button key={i} className="flex items-center gap-3 rounded-lg border border-border px-3 py-2.5 text-left hover:bg-accent">
                <span className="h-8 w-8 rounded-md grid place-items-center bg-primary/10 text-primary">
                  <a.icon className="h-4 w-4" />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-[13px] font-medium">{a.label}</span>
                  <span className="block text-[11px] text-muted-foreground">{a.meta}</span>
                </span>
              </button>
            ))}
          </div>
        </SectionCard>
      </div>
    </HubPage>
  );
}
