import { createFileRoute } from "@tanstack/react-router";
import { HubPage } from "@/components/hubs/page";
import { KpiCard, SectionCard, StatusPill, FilterBar } from "@/components/enterprise/primitives";
import { ASSIGNMENTS } from "@/lib/lms-extra";
import { trackById } from "@/lib/lms-data";
import { ClipboardList, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/lms/assignments")({
  head: () => ({ meta: [{ title: "My Assignments — Limnn LMS" }] }),
  component: Assignments,
});

const FILTERS = ["All", "Required", "Optional", "Overdue", "Complete"] as const;
type F = typeof FILTERS[number];

function Assignments() {
  const [filter, setFilter] = useState<F>("All");
  const required = ASSIGNMENTS.filter((a) => a.required).length;
  const overdue = ASSIGNMENTS.filter((a) => a.status === "Overdue").length;
  const done = ASSIGNMENTS.filter((a) => a.status === "Complete").length;

  const rows = ASSIGNMENTS.filter((a) => {
    if (filter === "All") return true;
    if (filter === "Required") return a.required;
    if (filter === "Optional") return !a.required;
    if (filter === "Overdue") return a.status === "Overdue";
    if (filter === "Complete") return a.status === "Complete";
    return true;
  });

  return (
    <HubPage
      title="Assignments & Learning Paths"
      description="Required tracks, due dates, and AI-recommended courses based on your role and performance."
      insights={[
        { title: "SOC2 refresher due in 4 days", body: "Complete 38% remaining to stay compliant. Average completion time: 22 min.", confidence: 95, cta: "Resume" },
        { title: "Recommended: Live Coaching", body: "Your last 3 call QA scores trended down. This 18-min module covers your gap.", confidence: 82, cta: "Enroll" },
      ]}
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="Required" value={String(required)} icon={ClipboardList} />
        <KpiCard label="Overdue" value={String(overdue)} delta={overdue ? -100 : 0} icon={AlertCircle} />
        <KpiCard label="Completed (90d)" value={String(done)} delta={20} icon={CheckCircle2} />
        <KpiCard label="Avg time to complete" value="36 min" icon={Clock} />
      </div>

      <SectionCard title="Your queue" subtitle="Sorted by urgency">
        <FilterBar chips={[...FILTERS]} active={filter} onSelect={(c) => setFilter(c as F)} />
        <ul className="space-y-2">
          {rows.map((a) => {
            const trk = trackById(a.trackId);
            const level =
              a.status === "Overdue" ? "red" :
              a.status === "Complete" ? "green" :
              a.status === "In progress" ? "blue" : "neutral";
            return (
              <li key={a.id} className="rounded-lg border border-border p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-display font-semibold text-[14px]">{a.title}</span>
                      {a.required && <StatusPill level="red">Required</StatusPill>}
                      {!a.required && <StatusPill level="blue">Recommended</StatusPill>}
                      <StatusPill level={level as "red" | "green" | "blue" | "neutral"}>{a.status}</StatusPill>
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-1">
                      {trk?.name} · {a.audience} · Due {a.dueIn} ({a.dueDate})
                    </div>
                    <p className="text-[12px] text-muted-foreground mt-1.5 italic">Why: {a.reason}</p>
                  </div>
                  <button
                    className="h-8 px-3 rounded-md text-[12px] font-medium text-primary-foreground shrink-0"
                    style={{ background: "var(--primary)" }}
                  >
                    {a.status === "Complete" ? "Review" : a.status === "Not started" ? "Start" : "Continue"}
                  </button>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${a.completionPct}%`, background: trk?.color ?? "var(--primary)" }} />
                </div>
              </li>
            );
          })}
        </ul>
      </SectionCard>
    </HubPage>
  );
}
