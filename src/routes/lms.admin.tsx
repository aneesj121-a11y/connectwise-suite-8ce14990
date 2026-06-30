import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { HubPage } from "@/components/hubs/page";
import { SectionCard, StatusPill, KpiCard, AiInsightCard, FilterBar } from "@/components/enterprise/primitives";
import { TRACKS, MODULES, QUESTIONS, ENROLLMENTS, trackById } from "@/lib/lms-data";
import {
  Plus,
  Copy,
  GripVertical,
  EyeOff,
  HelpCircle,
  Tag,
  FileText,
  Upload,
  Download,
  Library,
  Sparkles,
  Users,
  Clock,
  BookOpen,
  Sliders,
  Layers3,
} from "lucide-react";

export const Route = createFileRoute("/lms/admin")({
  head: () => ({ meta: [{ title: "Enablement Admin — Limnn Learning" }] }),
  component: Page,
});

type Tab = "builder" | "questions" | "quizzes" | "scorm" | "resources" | "analytics";

const TABS: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "builder", label: "Course Builder", icon: BookOpen },
  { id: "questions", label: "Question Bank", icon: HelpCircle },
  { id: "quizzes", label: "Quiz Builder", icon: Sliders },
  { id: "scorm", label: "SCORM Import", icon: Layers3 },
  { id: "resources", label: "Resource Library", icon: Library },
  { id: "analytics", label: "Tracking & Analytics", icon: Users },
];

function Page() {
  const [tab, setTab] = useState<Tab>("builder");

  return (
    <HubPage
      title="Enablement Admin"
      description="Build tracks, manage the question bank, govern resources and track every learner."
      actions={
        <button className="h-9 px-3 rounded-md text-sm font-medium text-primary-foreground inline-flex items-center gap-1.5" style={{ background: "var(--primary)" }}>
          <Plus className="h-3.5 w-3.5" /> New track
        </button>
      }
      insights={[
        { title: "Foundation completion lag", body: "18% of cohort Q1-26 hasn't finished Foundation. Nudge in Threads?", confidence: 89, cta: "Send nudge" },
        { title: "Quiz outlier", body: "Module G2 has a 41% first-attempt fail rate — likely question quality.", confidence: 84, cta: "Review questions" },
      ]}
    >
      <div className="flex flex-wrap items-center gap-1 border-b border-border">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="px-3 py-2 text-sm font-medium inline-flex items-center gap-1.5 transition"
            style={{
              color: tab === t.id ? "var(--foreground)" : "var(--muted-foreground)",
              borderBottom: tab === t.id ? "2px solid var(--primary)" : "2px solid transparent",
            }}
          >
            <t.icon className="h-3.5 w-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      {tab === "builder" && <BuilderTab />}
      {tab === "questions" && <QuestionsTab />}
      {tab === "quizzes" && <QuizBuilderTab />}
      {tab === "scorm" && <ScormTab />}
      {tab === "resources" && <ResourcesTab />}
      {tab === "analytics" && <AnalyticsTab />}
    </HubPage>
  );
}

function BuilderTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
      <SectionCard
        title="Tracks"
        action={<button className="text-xs underline">+ Track</button>}
      >
        <ul className="space-y-1.5">
          {TRACKS.map((t) => (
            <li key={t.id} className="rounded-lg border border-border p-2.5">
              <div className="flex items-center gap-2">
                <span className="h-6 w-6 rounded grid place-items-center" style={{ background: `color-mix(in oklab, ${t.color} 18%, transparent)`, color: t.color }}>
                  <BookOpen className="h-3 w-3" />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{t.name}</div>
                  <div className="text-[10px] text-muted-foreground">{t.modules.length} modules</div>
                </div>
                <button title="Duplicate"><Copy className="h-3.5 w-3.5 text-muted-foreground" /></button>
                <button title="Unpublish"><EyeOff className="h-3.5 w-3.5 text-muted-foreground" /></button>
              </div>
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard
        title="Foundation — modules"
        subtitle="Drag to reorder. Click a module to configure."
        action={
          <button className="h-8 px-3 rounded-md text-xs font-medium text-primary-foreground inline-flex items-center gap-1.5" style={{ background: "var(--primary)" }}>
            <Plus className="h-3 w-3" /> Add module
          </button>
        }
      >
        <ul className="space-y-2">
          {MODULES.filter((m) => m.trackId === "foundation").map((m) => (
            <li key={m.id} className="rounded-lg border border-border p-3">
              <div className="flex items-center gap-2">
                <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                <span className="text-[10px] font-mono text-muted-foreground w-6">#{m.order}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">{m.title}</span>
                    <StatusPill level="blue">{m.type.toUpperCase()}</StatusPill>
                    {m.hasQuiz && <StatusPill level="neutral">Quiz</StatusPill>}
                    {m.hasPractical && <StatusPill level="neutral">Practical</StatusPill>}
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5 truncate">{m.description}</div>
                </div>
                <button className="text-xs underline">Edit</button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 pt-3 border-t border-border">
                <Toggle label="Allow skipping" on={m.allowSkipping} />
                <NumberField label="Min watch %" value={m.minWatchPct} />
                <Toggle label="Chapter menu" on={m.hasChapterMenu} />
                <NumberField label="Duration (min)" value={m.durationMin} />
              </div>
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}

function Toggle({ label, on }: { label: string; on: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span
        className="h-5 w-9 rounded-full relative transition"
        style={{ background: on ? "var(--primary)" : "var(--muted)" }}
      >
        <span
          className="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow"
          style={{ left: on ? "calc(100% - 18px)" : "2px" }}
        />
      </span>
    </div>
  );
}

function NumberField({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{label}</div>
      <input
        defaultValue={value}
        className="mt-0.5 w-full h-7 px-2 rounded border border-border bg-card text-xs font-mono"
      />
    </div>
  );
}

function QuestionsTab() {
  return (
    <>
      <SectionCard
        title="Question Bank"
        subtitle={`${QUESTIONS.length} questions · reusable across modules`}
        action={
          <button className="h-8 px-3 rounded-md text-xs font-medium text-primary-foreground inline-flex items-center gap-1.5" style={{ background: "var(--primary)" }}>
            <Plus className="h-3 w-3" /> New question
          </button>
        }
      >
        <FilterBar chips={["All", "MCQ", "Scenario", "Compliance", "Sales", "Learning"]} active="All" />
        <ul className="space-y-2">
          {QUESTIONS.map((q) => (
            <li key={q.id} className="rounded-lg border border-border p-3">
              <div className="flex items-start gap-2">
                <HelpCircle className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <StatusPill level={q.type === "scenario" ? "blue" : "neutral"}>{q.type}</StatusPill>
                    {q.tags.map((tag) => (
                      <span key={tag} className="text-[10px] inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                        <Tag className="h-2.5 w-2.5" /> {tag}
                      </span>
                    ))}
                  </div>
                  <div className="text-sm font-medium">{q.prompt}</div>
                  <div className="text-[11px] text-muted-foreground mt-1">Correct: <span className="font-mono">{String.fromCharCode(65 + q.correct)}</span> · {q.options.length} options</div>
                </div>
                <button className="text-xs underline">Edit</button>
              </div>
            </li>
          ))}
        </ul>
      </SectionCard>
    </>
  );
}

function QuizBuilderTab() {
  const [attempts, setAttempts] = useState<"3" | "6" | "10" | "unlimited">("6");
  const [pass, setPass] = useState(80);
  const [picked, setPicked] = useState<string[]>(["q1", "q3"]);

  const toggle = (id: string) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
      <SectionCard title="Quiz configuration">
        <div className="space-y-4">
          <div>
            <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground mb-1.5">Bound to module</div>
            <select className="w-full h-9 px-2 rounded-md border border-border bg-card text-sm">
              {MODULES.filter((m) => m.hasQuiz).map((m) => (
                <option key={m.id} value={m.id}>{trackById(m.trackId)?.name} — {m.title}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground mb-1.5">Pass threshold</div>
              <div className="flex items-center gap-2">
                <input type="range" min={50} max={100} value={pass} onChange={(e) => setPass(Number(e.target.value))} className="flex-1" />
                <span className="font-mono text-sm w-12 text-right">{pass}%</span>
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground mb-1.5">Attempt limit</div>
              <select
                value={attempts}
                onChange={(e) => setAttempts(e.target.value as "3" | "6" | "10" | "unlimited")}
                className="w-full h-9 px-2 rounded-md border border-border bg-card text-sm"
              >
                <option value="3">3 attempts</option>
                <option value="6">6 attempts</option>
                <option value="10">10 attempts</option>
                <option value="unlimited">Unlimited</option>
              </select>
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground mb-1.5">
              Pick questions from the bank ({picked.length} selected)
            </div>
            <ul className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
              {QUESTIONS.map((q) => {
                const on = picked.includes(q.id);
                return (
                  <li key={q.id}>
                    <button
                      onClick={() => toggle(q.id)}
                      className="w-full text-left rounded-md border p-2.5 text-sm transition"
                      style={{
                        borderColor: on ? "var(--primary)" : "var(--border)",
                        background: on ? "color-mix(in oklab, var(--primary) 6%, transparent)" : "transparent",
                      }}
                    >
                      <span className="font-mono text-[10px] text-muted-foreground mr-2">{q.id}</span>
                      {q.prompt}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
          <button className="h-9 px-4 rounded-md text-sm font-medium text-primary-foreground" style={{ background: "var(--primary)" }}>
            Save quiz
          </button>
        </div>
      </SectionCard>

      <SectionCard title="Preview">
        <div className="text-xs text-muted-foreground mb-2">
          Trainees will see {picked.length} question{picked.length === 1 ? "" : "s"} · pass at {pass}% · {attempts === "unlimited" ? "Unlimited attempts" : `${attempts} attempts`}.
        </div>
        <AiInsightCard
          title="Question difficulty balance"
          body={`Your selection skews scenario-heavy. Consider adding 1-2 MCQs for retrieval-style anchoring.`}
          confidence={78}
          cta="Suggest 2 MCQs"
        />
      </SectionCard>
    </div>
  );
}

function ScormTab() {
  return (
    <SectionCard title="SCORM import" subtitle="Upload SCORM 1.2 or 2004 packages — Limnn detects manifests automatically.">
      <label className="block rounded-lg border-2 border-dashed border-border p-10 text-center cursor-pointer hover:bg-accent/30">
        <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
        <div className="text-sm font-medium">Drop a .zip SCORM package</div>
        <div className="text-xs text-muted-foreground mt-1">Up to 500MB · interactivity & scoring auto-mapped</div>
        <input type="file" accept=".zip" className="hidden" />
      </label>
      <div className="mt-4 text-xs text-muted-foreground">
        Recently imported: <span className="font-medium text-foreground">compliance-q1-2026.zip</span> · 142 interactions detected
      </div>
    </SectionCard>
  );
}

function ResourcesTab() {
  const items = [
    { name: "Discovery Call SOP.pdf", type: "SOP", size: "1.2 MB", attached: 3 },
    { name: "EU Data Residency.pdf", type: "PDF", size: "880 KB", attached: 2 },
    { name: "Outbound Cadence Scorecard.xlsx", type: "Scorecard", size: "44 KB", attached: 5 },
    { name: "Limnn Product Overview.pdf", type: "PDF", size: "3.4 MB", attached: 7 },
  ];
  return (
    <SectionCard
      title="Resource Library"
      subtitle="SOPs, PDFs, scorecards and reference material attached to modules."
      action={
        <button className="h-8 px-3 rounded-md text-xs font-medium text-primary-foreground inline-flex items-center gap-1.5" style={{ background: "var(--primary)" }}>
          <Upload className="h-3 w-3" /> Upload
        </button>
      }
    >
      <ul className="divide-y divide-border">
        {items.map((r) => (
          <li key={r.name} className="py-2.5 flex items-center gap-3">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{r.name}</div>
              <div className="text-[11px] text-muted-foreground">Attached to {r.attached} modules</div>
            </div>
            <StatusPill level="neutral">{r.type}</StatusPill>
            <span className="text-[11px] font-mono text-muted-foreground">{r.size}</span>
            <button className="text-xs underline">Manage</button>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}

function AnalyticsTab() {
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Enrolled" value={String(ENROLLMENTS.length)} icon={Users} />
        <KpiCard label="Avg completion" value="81%" delta={6} icon={BookOpen} />
        <KpiCard label="Avg time / module" value="42 min" icon={Clock} />
        <KpiCard label="Retraining flags" value={String(ENROLLMENTS.filter((e) => e.retrainingFlag).length)} icon={Sparkles} />
      </div>

      <AiInsightCard
        title="Cohort Q1-26 trending below baseline"
        body="Median completion is 7 pts behind cohort Q4-25 at the same week. Top driver: Foundation module F3 (Security)."
        cta="Open cohort drill-down"
        confidence={86}
      />

      <SectionCard
        title="Trainee tracking"
        action={
          <button className="h-8 px-3 rounded-md border border-border text-xs font-medium inline-flex items-center gap-1.5 hover:bg-accent">
            <Download className="h-3 w-3" /> Export CSV / Excel
          </button>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              <tr>
                <th className="py-2 pr-3">Trainee</th>
                <th className="py-2 pr-3">Cohort</th>
                <th className="py-2 pr-3">Track</th>
                <th className="py-2 pr-3">Enrolled</th>
                <th className="py-2 pr-3 text-right">Time</th>
                <th className="py-2 pr-3 text-right">Sessions</th>
                <th className="py-2 pr-3 text-right">Completion</th>
                <th className="py-2 pr-3 text-right">Attempts</th>
                <th className="py-2 pr-3 text-center">Retrain</th>
              </tr>
            </thead>
            <tbody>
              {ENROLLMENTS.map((e, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="py-2 pr-3 font-medium">{e.trainee}</td>
                  <td className="py-2 pr-3 text-muted-foreground">{e.cohort}</td>
                  <td className="py-2 pr-3" style={{ color: trackById(e.trackId)?.color }}>{trackById(e.trackId)?.name}</td>
                  <td className="py-2 pr-3 text-muted-foreground">{e.enrolledAt}</td>
                  <td className="py-2 pr-3 text-right font-mono">{e.timeSpentMin}m</td>
                  <td className="py-2 pr-3 text-right font-mono">{e.sessions}</td>
                  <td className="py-2 pr-3 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div className="h-full" style={{ width: `${e.completionPct}%`, background: "var(--primary)" }} />
                      </div>
                      <span className="font-mono text-xs">{e.completionPct}%</span>
                    </div>
                  </td>
                  <td className="py-2 pr-3 text-right font-mono">{e.lastQuizAttempts}</td>
                  <td className="py-2 pr-3 text-center">
                    <StatusPill level={e.retrainingFlag ? "red" : "green"}>{e.retrainingFlag ? "Yes" : "No"}</StatusPill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </>
  );
}
