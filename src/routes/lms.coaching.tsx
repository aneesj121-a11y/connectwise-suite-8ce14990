import { createFileRoute } from "@tanstack/react-router";
import { HubPage } from "@/components/hubs/page";
import { KpiCard, SectionCard, StatusPill } from "@/components/enterprise/primitives";
import { ROLEPLAYS } from "@/lib/lms-extra";
import { Mic, Sparkles, Play, Clock, Trophy, Target } from "lucide-react";

export const Route = createFileRoute("/lms/coaching")({
  head: () => ({ meta: [{ title: "AI Roleplay & Coaching — Limnn Learning" }] }),
  component: Coaching,
});

const DIFF_LEVEL = { Beginner: "green", Intermediate: "yellow", Advanced: "red" } as const;

function Coaching() {
  const attempts = ROLEPLAYS.reduce((s, r) => s + r.attempts, 0);
  const scored = ROLEPLAYS.filter((r) => r.bestScore !== undefined);
  const avgBest = Math.round(scored.reduce((s, r) => s + (r.bestScore ?? 0), 0) / Math.max(scored.length, 1));

  return (
    <HubPage
      title="AI Roleplay & Live Coaching"
      description="Practice live conversations with Limnn AI personas. Get scored on discovery, objection handling, empathy and next-step clarity."
      insights={[
        { title: "Skill gap: Pricing pushback", body: "Your last 4 attempts averaged 71. Try the mid-market scenario with the new pricing rubric.", confidence: 88, cta: "Start scenario" },
        { title: "Coach available", body: "Naveed has 30 min open Thu 2pm for a live review of your CIO discovery recording.", confidence: 0, cta: "Book session" },
      ]}
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="Scenarios available" value={String(ROLEPLAYS.length)} icon={Target} />
        <KpiCard label="Your attempts (30d)" value={String(attempts)} delta={45} icon={Mic} />
        <KpiCard label="Best avg score" value={`${avgBest}`} delta={9} icon={Trophy} />
        <KpiCard label="AI feedback time" value="<6s" icon={Sparkles} />
      </div>

      <SectionCard title="Scenario library" subtitle="Live AI persona · realtime transcript scoring · auto-generated coaching notes">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ROLEPLAYS.map((r) => (
            <article key={r.id} className="rounded-xl border border-border bg-card p-4 flex flex-col">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-display font-semibold text-[14px] leading-snug">{r.title}</h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5 italic">Persona: {r.persona}</p>
                </div>
                <StatusPill level={DIFF_LEVEL[r.difficulty]}>{r.difficulty}</StatusPill>
              </div>
              <p className="text-[12px] text-muted-foreground mt-2 leading-relaxed">{r.scenario}</p>
              <div className="mt-3 flex flex-wrap gap-1">
                {r.skills.map((s) => (
                  <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{s}</span>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {r.durationMin} min</span>
                <span>{r.attempts} attempts {r.bestScore !== undefined && <>· best <b className="text-foreground font-mono">{r.bestScore}</b></>}</span>
              </div>
              <div className="mt-3 flex gap-2">
                <button className="flex-1 h-9 rounded-md text-[12px] font-medium text-primary-foreground inline-flex items-center justify-center gap-1.5" style={{ background: "var(--primary)" }}>
                  <Play className="h-3.5 w-3.5" /> Start roleplay
                </button>
                <button className="h-9 px-3 rounded-md text-[12px] font-medium border border-border hover:bg-accent">
                  Rubric
                </button>
              </div>
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="How AI scoring works">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-[12px]">
          {[
            { icon: Mic, t: "1 — You talk", b: "Browser mic captures the call. No audio leaves your device unless you opt in." },
            { icon: Sparkles, t: "2 — Live transcript", b: "Limnn AI streams a turn-by-turn transcript with sentiment and silence markers." },
            { icon: Target, t: "3 — Rubric scoring", b: "Each rubric criterion is scored 0–100 with concrete evidence quotes." },
            { icon: Trophy, t: "4 — Coaching notes", b: "Personalised follow-up modules are auto-recommended into your Assignments." },
          ].map((s, i) => (
            <div key={i} className="rounded-lg border border-border p-3">
              <s.icon className="h-4 w-4 text-primary" />
              <div className="font-medium mt-2">{s.t}</div>
              <p className="text-muted-foreground mt-1 leading-relaxed">{s.b}</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </HubPage>
  );
}
