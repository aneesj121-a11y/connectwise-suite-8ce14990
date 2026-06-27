import { createFileRoute } from "@tanstack/react-router";
import { SPRINT_TASKS, hubInsights, type SprintTask } from "@/lib/hubs-data";
import { Avatar, RiskBadge } from "@/components/enterprise/primitives";
import { HubPage } from "@/components/hubs/page";
import { Flag, Plus } from "lucide-react";

export const Route = createFileRoute("/grid")({
  head: () => ({ meta: [{ title: "Limnn Grid — Sprint Board" }] }),
  component: GridPage,
});

const COLUMNS: { id: SprintTask["status"]; label: string; tint: string }[] = [
  { id: "todo", label: "To do", tint: "var(--muted-foreground)" },
  { id: "doing", label: "In progress", tint: "var(--primary)" },
  { id: "review", label: "Review", tint: "var(--warning)" },
  { id: "done", label: "Done", tint: "var(--success)" },
];

const PRIORITY: Record<SprintTask["priority"], { color: string; label: string }> = {
  urgent: { color: "var(--destructive)", label: "Urgent" },
  high: { color: "oklch(0.62 0.18 30)", label: "High" },
  med: { color: "var(--warning)", label: "Med" },
  low: { color: "var(--muted-foreground)", label: "Low" },
};

function GridPage() {
  return (
    <HubPage
      title="Sprint Board"
      description="Sprint 24 · Limnn Platform · Day 7 of 14"
      actions={
        <button className="h-9 px-3 rounded-md text-sm font-medium text-primary-foreground inline-flex items-center gap-1.5" style={{ background: "var(--primary)" }}>
          <Plus className="h-3.5 w-3.5" /> New task
        </button>
      }
      insights={hubInsights("grid")}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        {COLUMNS.map((col) => {
          const items = SPRINT_TASKS.filter((t) => t.status === col.id);
          const pts = items.reduce((s, t) => s + t.points, 0);
          return (
            <div key={col.id} className="rounded-xl border border-border bg-card flex flex-col min-h-[420px]">
              <header className="px-3.5 py-3 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: col.tint }} />
                  <span className="text-sm font-medium">{col.label}</span>
                  <span className="text-xs text-muted-foreground">{items.length}</span>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">{pts} pts</span>
              </header>
              <div className="flex-1 p-2.5 space-y-2">
                {items.map((t) => {
                  const p = PRIORITY[t.priority];
                  return (
                    <article key={t.id} className="rounded-lg border border-border bg-card p-3 hover:shadow-sm transition">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="text-[10px] font-mono text-muted-foreground">{t.tag}</span>
                        <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-medium" style={{ color: p.color }}>
                          <Flag className="h-2.5 w-2.5" /> {p.label}
                        </span>
                      </div>
                      <div className="text-sm font-medium leading-snug">{t.title}</div>
                      <div className="mt-2.5 flex items-center justify-between">
                        <div className="flex -space-x-1.5">
                          {t.assignees.map((a) => (
                            <Avatar key={a} name={a} />
                          ))}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                          <span className="font-mono">{t.points}pt</span>
                          <span>{t.due}</span>
                        </div>
                      </div>
                      {t.priority === "urgent" && (
                        <div className="mt-2"><RiskBadge confidence={84} label="Blocker" /></div>
                      )}
                    </article>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </HubPage>
  );
}
