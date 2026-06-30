import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import {
  moduleById,
  quizFor,
  QUESTIONS,
  modulesForTrack,
  trackById,
} from "@/lib/lms-data";
import { StudyBuddy } from "@/components/lms/study-buddy";
import { SectionCard, StatusPill } from "@/components/enterprise/primitives";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Lock,
  Upload,
  FileText,
  ListChecks,
  AlertTriangle,
  Gauge,
  ChevronRight,
  PlayCircle,
} from "lucide-react";

export const Route = createFileRoute("/lms/module/$id")({
  head: ({ params }) => ({ meta: [{ title: `Module · ${params.id} — Limnn LMS` }] }),
  component: ModulePlayer,
});

type Tab = "watch" | "quiz" | "practical";

function ModulePlayer() {
  const { id } = useParams({ from: "/lms/module/$id" });
  const module = moduleById(id);
  if (!module) return <div className="container-page py-10">Module not found.</div>;
  const track = trackById(module.trackId)!;
  const allModules = modulesForTrack(module.trackId);
  const idx = allModules.findIndex((m) => m.id === module.id);
  const prev = allModules[idx - 1];
  const next = allModules[idx + 1];

  const [tab, setTab] = useState<Tab>("watch");
  const [watched, setWatched] = useState(34);
  const [speed, setSpeed] = useState<1 | 1.25 | 1.5 | 2>(1);
  const [chapterMenu, setChapterMenu] = useState(module.hasChapterMenu);

  const canProceed = watched >= module.minWatchPct;
  const tabs: { id: Tab; label: string; show: boolean; locked?: boolean }[] = [
    { id: "watch", label: "Module", show: true },
    { id: "quiz", label: "Quiz", show: module.hasQuiz, locked: !canProceed },
    { id: "practical", label: "Practical", show: module.hasPractical },
  ];

  return (
    <div className="container-page py-6">
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
        <Link to="/lms" className="hover:text-foreground">My Learning</Link>
        <ChevronRight className="h-3 w-3" />
        <span style={{ color: track.color }}>{track.name}</span>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-medium">{module.title}</span>
      </div>

      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">{module.title}</h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">{module.description}</p>
        </div>
        <div className="flex items-center gap-2">
          {prev && (
            <Link to="/lms/module/$id" params={{ id: prev.id }} className="h-9 px-3 rounded-md border border-border text-sm inline-flex items-center gap-1.5 hover:bg-accent">
              <ArrowLeft className="h-3.5 w-3.5" /> Prev
            </Link>
          )}
          {next && (
            <Link
              to="/lms/module/$id"
              params={{ id: next.id }}
              className="h-9 px-3 rounded-md text-sm font-medium text-white inline-flex items-center gap-1.5 disabled:opacity-40"
              style={{ background: canProceed ? track.color : "var(--muted)", color: canProceed ? "#fff" : "var(--muted-foreground)", pointerEvents: canProceed ? "auto" : "none" }}
            >
              Next <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-4 border-b border-border">
        {tabs.filter(t => t.show).map((t) => (
          <button
            key={t.id}
            onClick={() => !t.locked && setTab(t.id)}
            disabled={t.locked}
            className="relative px-3 py-2 text-sm font-medium transition disabled:opacity-50"
            style={{
              color: tab === t.id ? "var(--foreground)" : "var(--muted-foreground)",
              borderBottom: tab === t.id ? `2px solid ${track.color}` : "2px solid transparent",
            }}
          >
            {t.label} {t.locked && <Lock className="inline h-3 w-3 ml-1" />}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-4">
        <div className="space-y-4 min-w-0">
          {tab === "watch" && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-4">
                <div className="rounded-xl overflow-hidden border border-border" style={{ background: "#F6F1E6" }}>
                  <Player module={module} speed={speed} />
                  <div className="px-4 py-3 flex items-center gap-3 flex-wrap" style={{ background: "#0F172A", color: "#fff" }}>
                    <div className="flex items-center gap-1">
                      <Gauge className="h-3.5 w-3.5 opacity-70" />
                      <span className="text-[11px] uppercase tracking-wider opacity-70 mr-1">Speed</span>
                      {([1, 1.25, 1.5, 2] as const).map((s) => (
                        <button
                          key={s}
                          onClick={() => setSpeed(s)}
                          className="text-xs px-2 py-0.5 rounded mr-1"
                          style={{
                            background: speed === s ? track.color : "rgba(255,255,255,0.08)",
                            color: "#fff",
                          }}
                        >
                          {s}x
                        </button>
                      ))}
                    </div>
                    <div className="ml-auto flex items-center gap-2 text-[11px]">
                      <span className="opacity-70">Watched</span>
                      <span className="font-mono">{watched}%</span>
                      <div className="w-32 h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full" style={{ width: `${watched}%`, background: track.color }} />
                      </div>
                      {!module.allowSkipping && (
                        <span className="inline-flex items-center gap-1 text-amber-300">
                          <Lock className="h-3 w-3" /> Skipping disabled · min {module.minWatchPct}%
                        </span>
                      )}
                      <button
                        onClick={() => setWatched(Math.min(100, watched + 15))}
                        className="text-[11px] underline opacity-80 hover:opacity-100"
                      >
                        +15% (demo)
                      </button>
                    </div>
                  </div>
                </div>
                {chapterMenu && module.chapters && (
                  <aside className="rounded-xl border border-border bg-card p-3">
                    <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground mb-2">Chapters</div>
                    <ul className="space-y-1">
                      {module.chapters.map((c, i) => (
                        <li key={i}>
                          <button className="w-full flex items-center gap-2 text-left px-2 py-1.5 rounded-md hover:bg-accent text-sm">
                            <PlayCircle className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="flex-1">{c.label}</span>
                            <span className="text-[10px] font-mono text-muted-foreground">
                              {Math.floor(c.t / 60)}:{String(c.t % 60).padStart(2, "0")}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </aside>
                )}
              </div>

              <SectionCard
                title="Module settings"
                action={
                  module.hasChapterMenu && (
                    <button
                      onClick={() => setChapterMenu((v) => !v)}
                      className="text-xs px-2 py-1 rounded-md border border-border hover:bg-accent"
                    >
                      {chapterMenu ? "Hide" : "Show"} chapter menu
                    </button>
                  )
                }
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <Meta label="Type" value={module.type.toUpperCase()} />
                  <Meta label="Duration" value={`${module.durationMin} min`} />
                  <Meta label="Min watch %" value={`${module.minWatchPct}%`} />
                  <Meta label="Skipping" value={module.allowSkipping ? "Allowed" : "Disabled"} />
                </div>
                {module.resources && (
                  <div className="mt-4">
                    <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground mb-2">Resources</div>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {module.resources.map((r, i) => (
                        <li key={i} className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="flex-1">{r.name}</span>
                          <StatusPill level="neutral">{r.type}</StatusPill>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </SectionCard>
            </>
          )}

          {tab === "quiz" && <QuizView moduleId={module.id} accent={track.color} />}
          {tab === "practical" && <PracticalView accent={track.color} />}
        </div>

        <div>
          <StudyBuddy module={module} />
        </div>
      </div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{label}</div>
      <div className="text-sm font-medium mt-0.5">{value}</div>
    </div>
  );
}

function Player({ module, speed }: { module: ReturnType<typeof moduleById>; speed: number }) {
  if (!module) return null;
  if (module.type === "youtube" || module.type === "vimeo" || module.type === "loom") {
    return (
      <iframe
        src={module.src}
        title={module.title}
        className="w-full aspect-video bg-black"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }
  if (module.type === "doc") {
    return (
      <div className="aspect-video grid place-items-center text-center p-8" style={{ background: "#F6F1E6", color: "#0F172A" }}>
        <div>
          <FileText className="h-8 w-8 mx-auto mb-2 opacity-70" />
          <div className="font-display text-lg font-semibold">Practical assessment</div>
          <div className="text-sm opacity-70 mt-1">Switch to the Practical tab to submit.</div>
        </div>
      </div>
    );
  }
  return (
    <video
      key={`${module.id}-${speed}`}
      src={module.src}
      controls
      controlsList="nodownload"
      playbackrate={speed}
      className="w-full aspect-video bg-black"
    />
  );
}

function QuizView({ moduleId, accent }: { moduleId: string; accent: string }) {
  const quiz = quizFor(moduleId);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  if (!quiz) return <SectionCard title="No quiz">This module has no quiz.</SectionCard>;
  const qs = quiz.questions.map((qid) => QUESTIONS.find((q) => q.id === qid)!).filter(Boolean);
  const correct = qs.filter((q) => answers[q.id] === q.correct).length;
  const pct = qs.length ? Math.round((correct / qs.length) * 100) : 0;
  const passed = pct >= quiz.passPct;

  return (
    <SectionCard
      title="Module quiz"
      subtitle={`Pass at ${quiz.passPct}% · Attempts: ${quiz.attemptLimit === "unlimited" ? "Unlimited" : quiz.attemptLimit}`}
      action={
        <div className="flex items-center gap-2">
          <StatusPill level={submitted ? (passed ? "green" : "red") : "neutral"}>
            {submitted ? (passed ? `Passed · ${pct}%` : `Failed · ${pct}%`) : "Not submitted"}
          </StatusPill>
        </div>
      }
    >
      {!passed && submitted && (
        <div className="mb-3 rounded-lg border p-3 flex items-start gap-2" style={{ borderColor: "color-mix(in oklab, var(--destructive) 30%, var(--border))", background: "color-mix(in oklab, var(--destructive) 6%, transparent)" }}>
          <AlertTriangle className="h-4 w-4 mt-0.5 text-[color:var(--destructive)]" />
          <div className="text-sm">
            <div className="font-medium">Hard gate</div>
            <div className="text-muted-foreground text-xs">You must pass this quiz to proceed to the next module.</div>
          </div>
        </div>
      )}
      <ol className="space-y-4">
        {qs.map((q, i) => (
          <li key={q.id} className="rounded-lg border border-border p-3">
            <div className="flex items-start gap-2 mb-2">
              <span className="text-xs font-mono text-muted-foreground">Q{i + 1}</span>
              <span className="text-sm font-medium flex-1">{q.prompt}</span>
              <StatusPill level={q.type === "scenario" ? "blue" : "neutral"}>{q.type === "scenario" ? "Scenario" : "MCQ"}</StatusPill>
            </div>
            <div className="grid gap-1.5">
              {q.options.map((opt, j) => {
                const chosen = answers[q.id] === j;
                const isCorrect = submitted && j === q.correct;
                const isWrong = submitted && chosen && j !== q.correct;
                return (
                  <button
                    key={j}
                    disabled={submitted}
                    onClick={() => setAnswers((a) => ({ ...a, [q.id]: j }))}
                    className="text-left text-sm px-3 py-2 rounded-md border transition"
                    style={{
                      borderColor: isCorrect
                        ? "var(--success)"
                        : isWrong
                        ? "var(--destructive)"
                        : chosen
                        ? accent
                        : "var(--border)",
                      background: chosen
                        ? `color-mix(in oklab, ${accent} 8%, transparent)`
                        : "transparent",
                    }}
                  >
                    <span className="font-mono text-[11px] text-muted-foreground mr-2">{String.fromCharCode(65 + j)}</span>
                    {opt}
                    {isCorrect && <CheckCircle2 className="inline h-3.5 w-3.5 ml-2 text-[color:var(--success)]" />}
                  </button>
                );
              })}
            </div>
            {submitted && <p className="text-xs text-muted-foreground mt-2">{q.explanation}</p>}
          </li>
        ))}
      </ol>
      <div className="mt-4 flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          {Object.keys(answers).length}/{qs.length} answered
        </div>
        {!submitted ? (
          <button
            onClick={() => setSubmitted(true)}
            disabled={Object.keys(answers).length < qs.length}
            className="h-9 px-4 rounded-md text-sm font-medium text-white disabled:opacity-40"
            style={{ background: accent }}
          >
            Submit quiz
          </button>
        ) : (
          <button
            onClick={() => {
              setAnswers({});
              setSubmitted(false);
            }}
            className="h-9 px-4 rounded-md border border-border text-sm font-medium hover:bg-accent"
          >
            Retake
          </button>
        )}
      </div>
    </SectionCard>
  );
}

function PracticalView({ accent }: { accent: string }) {
  const [text, setText] = useState("");
  const [file, setFile] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <SectionCard title="Submission received">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-[color:var(--success)] mt-0.5" />
          <div>
            <div className="font-medium">Your practical has been queued for evaluation.</div>
            <div className="text-sm text-muted-foreground">Average review SLA is 48 hours. You'll be notified in Limnn Threads.</div>
          </div>
        </div>
      </SectionCard>
    );
  }

  return (
    <SectionCard
      title="Practical assessment"
      subtitle="Upload a file (video, doc, screenshot) or submit a written response. Both accepted."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground mb-1.5">Upload</div>
          <label
            className="block rounded-lg border-2 border-dashed border-border p-6 text-center cursor-pointer hover:bg-accent/40"
          >
            <Upload className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
            <div className="text-sm font-medium">{file ?? "Drop a file or click to browse"}</div>
            <div className="text-xs text-muted-foreground mt-1">Up to 100MB · MP4, PDF, DOCX, PNG</div>
            <input
              type="file"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0]?.name ?? null)}
            />
          </label>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground mb-1.5">Written response</div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={9}
            placeholder="Walk us through your approach…"
            className="w-full rounded-lg border border-border bg-card text-sm p-3 focus:outline-none focus:ring-2 focus:ring-ring/40"
          />
          <div className="text-[10px] text-muted-foreground mt-1">{text.length} chars</div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <ListChecks className="h-3.5 w-3.5" /> Rubric is visible to your evaluator
        </div>
        <button
          onClick={() => setSubmitted(true)}
          disabled={!text && !file}
          className="h-9 px-4 rounded-md text-sm font-medium text-white disabled:opacity-40"
          style={{ background: accent }}
        >
          Submit for evaluation
        </button>
      </div>
    </SectionCard>
  );
}
