import { createFileRoute, Link } from "@tanstack/react-router";
import { HubPage } from "@/components/hubs/page";
import { KpiCard, SectionCard, StatusPill, RiskBadge, Avatar } from "@/components/enterprise/primitives";
import { hubInsights } from "@/lib/hubs-data";
import { EMPLOYEES, DEPT_HEADCOUNT, DEPT_COLORS, FUNNEL } from "@/lib/people-data";
import { Users, UserPlus, CalendarOff, TrendingDown, Sparkles, Calendar, Bell, Rocket } from "lucide-react";

const ACCENT = "oklch(0.58 0.18 280)";

export const Route = createFileRoute("/people/")({
  head: () => ({ meta: [{ title: "People Dashboard — Limnn" }] }),
  component: PeopleDashboard,
});

function PeopleDashboard() {
  const atRisk = [...EMPLOYEES].sort((a, b) => b.flightRisk - a.flightRisk).slice(0, 3);
  const recent = EMPLOYEES.slice(-4);
  const maxDept = Math.max(...Object.values(DEPT_HEADCOUNT));

  return (
    <HubPage
      title="Limnn People"
      description="Workforce overview — headcount, hiring, leave, engagement and retention risk."
      insights={hubInsights("people")}
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="Headcount" value="247" delta={3} icon={Users} spark={[220, 224, 228, 232, 235, 238, 240, 244, 247]} />
        <KpiCard label="Open reqs" value="12" icon={UserPlus} />
        <KpiCard label="Pending leave" value="8" icon={CalendarOff} />
        <KpiCard label="Attrition (TTM)" value="4.2%" delta={-1.4} icon={TrendingDown} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SectionCard title="Recruiting funnel" subtitle="Last 30 days" className="lg:col-span-2">
          <div className="space-y-2.5">
            {FUNNEL.map((s) => {
              const max = FUNNEL[0].count;
              return (
                <div key={s.stage} className="flex items-center gap-3">
                  <span className="w-20 text-xs text-muted-foreground shrink-0">{s.stage}</span>
                  <div className="flex-1 h-6 rounded-md bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-md flex items-center justify-end px-2 text-[11px] font-semibold text-white"
                      style={{ width: `${(s.count / max) * 100}%`, background: s.color }}
                    >
                      {s.count}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard title="Pending actions">
          <ul className="text-sm space-y-2.5">
            <ActionRow icon={CalendarOff} label="Leave requests" count={8} to="/people/leave" />
            <ActionRow icon={Bell} label="Timesheet approvals" count={14} to="/people/schedules" />
            <ActionRow icon={UserPlus} label="Requisitions to sign off" count={2} to="/people/recruiting/requisitions" />
            <ActionRow icon={Rocket} label="Onboarding check-ins" count={5} to="/people/onboarding" />
          </ul>
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SectionCard title="Headcount by department" className="lg:col-span-2">
          <div className="space-y-2.5">
            {Object.entries(DEPT_HEADCOUNT).map(([d, n]) => (
              <div key={d} className="flex items-center gap-3">
                <span className="w-24 text-xs shrink-0">{d}</span>
                <div className="flex-1 h-5 rounded-md bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-md"
                    style={{ width: `${(n / maxDept) * 100}%`, background: DEPT_COLORS[d] }}
                  />
                </div>
                <span className="w-10 text-right text-xs font-mono tabular-nums">{n}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Recent hires">
          <ul className="text-sm divide-y divide-border">
            {recent.map((e) => (
              <li key={e.id} className="py-2 flex items-center gap-2.5">
                <Avatar name={e.name} size={26} />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{e.name}</div>
                  <div className="text-[11px] text-muted-foreground truncate">{e.title} · {e.dept}</div>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">{e.startDate.slice(5)}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <SectionCard
        title={
          <span className="inline-flex items-center gap-2">
            <span
              className="h-6 w-6 rounded-md grid place-items-center"
              style={{ background: `color-mix(in oklab, ${ACCENT} 14%, transparent)`, color: ACCENT }}
            >
              <Sparkles className="h-3 w-3" />
            </span>
            AI attrition risk
          </span>
        }
        subtitle="90-day forecast by department + flagged employees"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Heatmap by department</div>
            <div className="grid grid-cols-6 gap-1.5">
              {Object.entries(DEPT_HEADCOUNT).map(([d]) => {
                const heat = { Engineering: 0.72, Sales: 0.55, Marketing: 0.38, Ops: 0.44, Finance: 0.22, HR: 0.18 }[d] ?? 0.3;
                return (
                  <div key={d} className="text-center">
                    <div
                      className="aspect-square rounded-md grid place-items-center text-[10px] font-semibold text-white"
                      style={{ background: `color-mix(in oklab, ${ACCENT} ${20 + heat * 60}%, var(--muted))` }}
                    >
                      {Math.round(heat * 100)}
                    </div>
                    <div className="text-[9px] text-muted-foreground mt-1 truncate">{d}</div>
                  </div>
                );
              })}
            </div>
            <p className="text-[11px] text-muted-foreground mt-3">
              <span className="inline-flex items-center gap-1"><RiskBadge confidence={87} /></span> 90-day model projects 4–6 exits, concentrated in Engineering platform pod.
            </p>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Flagged employees</div>
            <ul className="space-y-2">
              {atRisk.map((e) => (
                <li key={e.id} className="rounded-lg border border-border p-2.5 flex items-center gap-3">
                  <Avatar name={e.name} size={28} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{e.name}</div>
                    <div className="text-[11px] text-muted-foreground truncate">{e.title} · {e.riskFactors.join(" · ")}</div>
                  </div>
                  <span
                    className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: "color-mix(in oklab, var(--destructive) 12%, transparent)", color: "var(--destructive)" }}
                  >
                    {e.flightRisk}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Company calendar" subtitle="Next 7 days">
        <div className="grid grid-cols-7 gap-2">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => (
            <div key={d} className="rounded-lg border border-border p-2.5 min-h-[92px]">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{d}</div>
              <div className="text-lg font-display font-semibold">{i + 1}</div>
              {i === 1 && <div className="mt-1 text-[10px] px-1.5 py-0.5 rounded" style={{ background: `color-mix(in oklab, ${ACCENT} 14%, transparent)`, color: ACCENT }}>All-hands 4pm</div>}
              {i === 3 && <div className="mt-1 text-[10px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-600">Payroll cutoff</div>}
              {i === 4 && <div className="mt-1 text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600">3 anniversaries</div>}
            </div>
          ))}
        </div>
        <p className="mt-3 text-[11px] text-muted-foreground flex items-center gap-1.5">
          <Calendar className="h-3 w-3" /> Includes 4 probation reviews, 6 work anniversaries, 1 visa renewal.
        </p>
      </SectionCard>
    </HubPage>
  );
}

function ActionRow({
  icon: Icon,
  label,
  count,
  to,
}: {
  icon: typeof Users;
  label: string;
  count: number;
  to: string;
}) {
  return (
    <li>
      <Link to={to} className="flex items-center gap-2.5 rounded-md px-2 py-1.5 hover:bg-accent">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="flex-1">{label}</span>
        <StatusPill level={count > 5 ? "yellow" : "blue"}>{count}</StatusPill>
      </Link>
    </li>
  );
}
