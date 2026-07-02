import { createFileRoute } from "@tanstack/react-router";
import { HubPage } from "@/components/hubs/page";
import { SectionCard, Avatar } from "@/components/enterprise/primitives";
import { EMPLOYEES, DEPT_COLORS } from "@/lib/people-data";

export const Route = createFileRoute("/people/org-chart")({
  head: () => ({ meta: [{ title: "Org Chart — Limnn People" }] }),
  component: OrgChart,
});

function OrgChart() {
  const ceo = EMPLOYEES.find((e) => e.title.includes("Chief Executive"))!;
  const vps = EMPLOYEES.filter((e) => e.managerId === ceo.id && e.title.startsWith("VP"));
  const reportsOf = (mid: string) => EMPLOYEES.filter((e) => e.managerId === mid);

  return (
    <HubPage title="Org Chart" description="Reporting structure across the company. Click a card to highlight the chain.">
      <SectionCard>
        <div className="overflow-x-auto">
          <div className="min-w-[900px] flex flex-col items-center gap-6 py-4">
            <OrgNode emp={ceo} count={vps.length} />
            <div className="h-6 w-px bg-border" />
            <div className="flex items-start gap-6">
              {vps.map((vp) => {
                const subs = reportsOf(vp.id);
                return (
                  <div key={vp.id} className="flex flex-col items-center gap-4">
                    <OrgNode emp={vp} count={subs.length} />
                    {subs.length > 0 && (
                      <>
                        <div className="h-5 w-px bg-border" />
                        <div className="flex items-start gap-4">
                          {subs.map((m) => {
                            const ms = reportsOf(m.id);
                            return (
                              <div key={m.id} className="flex flex-col items-center gap-3">
                                <OrgNode emp={m} count={ms.length} />
                                {ms.length > 0 && (
                                  <>
                                    <div className="h-4 w-px bg-border" />
                                    <div className="flex items-start gap-3">
                                      {ms.map((s) => (
                                        <OrgNode key={s.id} emp={s} count={0} compact />
                                      ))}
                                    </div>
                                  </>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </SectionCard>
    </HubPage>
  );
}

function OrgNode({ emp, count, compact }: { emp: typeof EMPLOYEES[number]; count: number; compact?: boolean }) {
  const color = DEPT_COLORS[emp.dept] ?? "#6366F1";
  return (
    <div
      className={`rounded-lg bg-card shadow-sm hover:shadow-md transition cursor-pointer flex items-center gap-2.5 ${compact ? "p-2 min-w-[180px]" : "p-3 min-w-[220px]"}`}
      style={{ borderLeft: `4px solid ${color}`, border: "1px solid var(--border)", borderLeftWidth: 4, borderLeftColor: color }}
    >
      <Avatar name={emp.name} size={compact ? 26 : 32} />
      <div className="flex-1 min-w-0">
        <div className={`font-medium truncate ${compact ? "text-[12px]" : "text-sm"}`}>{emp.name}</div>
        <div className="text-[10.5px] text-muted-foreground truncate">{emp.title}</div>
        <span
          className="mt-1 inline-block text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded"
          style={{ background: `color-mix(in oklab, ${color} 14%, transparent)`, color }}
        >
          {emp.dept}
        </span>
      </div>
      {count > 0 && (
        <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground shrink-0">
          {count}
        </span>
      )}
    </div>
  );
}
