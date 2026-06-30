import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { HubPage } from "@/components/hubs/page";
import { SectionCard, StatusPill, Avatar, KpiCard, AiInsightCard } from "@/components/enterprise/primitives";
import { SUBMISSIONS, moduleById, trackById, type Submission } from "@/lib/lms-data";
import { ClipboardCheck, FileText, Inbox, MessageSquare, Sparkles, Clock } from "lucide-react";

export const Route = createFileRoute("/lms/evaluator")({
  head: () => ({ meta: [{ title: "Evaluator — Limnn Learning" }] }),
  component: Page,
});

function Page() {
  const [active, setActive] = useState<Submission>(SUBMISSIONS[0]);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState("");

  const pending = SUBMISSIONS.filter((s) => s.status === "Pending");
  const total = active.rubric?.reduce((s, r) => s + (scores[r.criterion] ?? r.score ?? 0), 0) ?? 0;
  const max = active.rubric?.reduce((s, r) => s + r.max, 0) ?? 0;

  return (
    <HubPage
      title="Evaluator Queue"
      description="Practical assessments awaiting your review. Scoped to trainees assigned to you."
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Pending" value={String(pending.length)} icon={Inbox} />
        <KpiCard label="Avg turnaround" value="38h" delta={-12} icon={Clock} />
        <KpiCard label="Graded this week" value="9" delta={6} icon={ClipboardCheck} />
        <KpiCard label="Returned" value="1" icon={MessageSquare} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4">
        <SectionCard title="Submission queue">
          <ul className="space-y-1.5">
            {SUBMISSIONS.map((s) => {
              const m = moduleById(s.moduleId);
              const t = trackById(s.trackId);
              const isActive = s.id === active.id;
              return (
                <li key={s.id}>
                  <button
                    onClick={() => {
                      setActive(s);
                      setScores({});
                      setNotes("");
                    }}
                    className="w-full text-left rounded-lg border p-3 transition"
                    style={{
                      borderColor: isActive ? "var(--primary)" : "var(--border)",
                      background: isActive ? "color-mix(in oklab, var(--primary) 6%, transparent)" : "transparent",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Avatar name={s.trainee} />
                      <span className="text-sm font-medium flex-1 truncate">{s.trainee}</span>
                      <StatusPill level={s.status === "Pending" ? "yellow" : s.status === "Graded" ? "green" : "neutral"}>
                        {s.status}
                      </StatusPill>
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      <span style={{ color: t?.color }}>{t?.name}</span> · {m?.title}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-1">Submitted {s.submittedAt}</div>
                  </button>
                </li>
              );
            })}
          </ul>
        </SectionCard>

        <div className="space-y-4">
          <SectionCard
            title={`${active.trainee} — ${moduleById(active.moduleId)?.title}`}
            subtitle={`${trackById(active.trackId)?.name} · Submitted ${active.submittedAt}`}
            action={<StatusPill level={active.status === "Pending" ? "yellow" : "green"}>{active.status}</StatusPill>}
          >
            <div className="rounded-lg border border-border p-3 bg-muted/30">
              <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground mb-1.5">
                {active.type === "file" ? "Uploaded file" : "Written response"}
              </div>
              {active.type === "file" ? (
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="font-mono">{active.preview}</span>
                  <button className="ml-auto text-xs underline">Open in viewer</button>
                </div>
              ) : (
                <p className="text-sm leading-relaxed">{active.preview}</p>
              )}
            </div>
          </SectionCard>

          <SectionCard title="Rubric scoring" subtitle={`Total: ${total} / ${max}`}>
            <div className="space-y-3">
              {active.rubric?.map((r) => {
                const val = scores[r.criterion] ?? r.score ?? 0;
                return (
                  <div key={r.criterion}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{r.criterion}</span>
                      <span className="text-xs font-mono">{val} / {r.max}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={r.max}
                      value={val}
                      onChange={(e) => setScores((s) => ({ ...s, [r.criterion]: Number(e.target.value) }))}
                      className="w-full"
                    />
                  </div>
                );
              })}
            </div>
            <div className="mt-4">
              <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground mb-1.5">Evaluator notes</div>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Strengths, gaps, what to revisit…"
                className="w-full rounded-md border border-border bg-card text-sm p-2.5 focus:outline-none focus:ring-2 focus:ring-ring/40"
              />
            </div>
            <div className="mt-3 flex items-center gap-2">
              <button className="h-9 px-4 rounded-md text-sm font-medium text-primary-foreground" style={{ background: "var(--primary)" }}>
                Submit grade
              </button>
              <button className="h-9 px-4 rounded-md border border-border text-sm hover:bg-accent">Return for revision</button>
            </div>
          </SectionCard>

          <div>
            <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground mb-2 flex items-center gap-1.5">
              <Sparkles className="h-3 w-3" /> Limnn AI insights
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              <AiInsightCard
                title="Draft a grade for this submission"
                body={`Based on rubric anchors and similar past submissions, suggested score is 81/100. Strongest area: discovery quality. Weakest: next-step clarity.`}
                cta="Apply draft scores"
                confidence={87}
              />
              <AiInsightCard
                title="Training gap detected"
                body={`${active.trainee}'s last 3 submissions consistently lose points on objection handling. Recommend re-assigning module A2.`}
                cta="Re-assign A2"
                confidence={79}
              />
            </div>
          </div>
        </div>
      </div>
    </HubPage>
  );
}
