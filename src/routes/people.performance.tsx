import { createFileRoute } from "@tanstack/react-router";
import { HubPage } from "@/components/hubs/page";
import { SectionCard, StatusPill, Avatar, RiskBadge } from "@/components/enterprise/primitives";
import { KEY_ROLES } from "@/lib/people-data";
import { Sparkles } from "lucide-react";
import { useState } from "react";

const ACCENT = "oklch(0.58 0.18 280)";
const TABS = ["Reviews", "Goals", "Calibration", "Succession"] as const;
const RATINGS = [
  { label: "Exceptional", pct: 12, color: "#10B981" },
  { label: "Strong", pct: 34, color: "#2C69CF" },
  { label: "Meets", pct: 41, color: "#94A3B8" },
  { label: "Needs Improvement", pct: 10, color: "#F59E0B" },
  { label: "Unsatisfactory", pct: 3, color: "#EF4444" },
];

export const Route = createFileRoute("/people/performance")({
  head: () => ({ meta: [{ title: "Performance — Limnn People" }] }),
  component: Perf,
});

function Perf() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Reviews");
  const [tone, setTone] = useState("Constructive");

  return (
    <HubPage title="Performance" description="Reviews, goals, calibration and succession planning.">
      <div className="flex items-center gap-1 border-b border-border mb-2">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} className="text-sm px-3 py-2 border-b-2" style={{ borderColor: tab === t ? ACCENT : "transparent", color: tab === t ? "var(--foreground)" : "var(--muted-foreground)", fontWeight: tab === t ? 600 : 400 }}>{t}</button>
        ))}
      </div>

      {tab === "Reviews" && (
        <>
          <SectionCard title="H1 2026 review cycle" subtitle="189 of 243 submitted · 12 days remaining">
            <div className="h-2 rounded-full bg-muted overflow-hidden mb-4">
              <div className="h-full rounded-full" style={{ width: "78%", background: ACCENT }} />
            </div>
            <div className="grid grid-cols-5 gap-3">
              {RATINGS.map((r) => (
                <div key={r.label}>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground truncate">{r.label}</div>
                  <div className="mt-1 h-2 rounded bg-muted overflow-hidden"><div className="h-full" style={{ width: `${r.pct * 2}%`, background: r.color }} /></div>
                  <div className="mt-1 text-xs font-mono">{r.pct}%</div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            title={
              <span className="inline-flex items-center gap-2">
                <span className="h-6 w-6 rounded-md grid place-items-center" style={{ background: `color-mix(in oklab, ${ACCENT} 14%, transparent)`, color: ACCENT }}>
                  <Sparkles className="h-3 w-3" />
                </span>
                AI Review Copilot
              </span>
            }
            subtitle="Draft a review from OKRs, 1:1 notes, project outcomes and peer feedback"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs text-muted-foreground">Tone:</span>
              {["Constructive", "Direct", "Encouraging"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className="text-xs px-2.5 py-1 rounded-full border transition"
                  style={{
                    borderColor: tone === t ? ACCENT : "var(--border)",
                    background: tone === t ? `color-mix(in oklab, ${ACCENT} 10%, transparent)` : "transparent",
                    color: tone === t ? ACCENT : "var(--muted-foreground)",
                  }}
                >
                  {t}
                </button>
              ))}
              <RiskBadge confidence={82} />
            </div>
            <div className="rounded-md border border-border bg-muted/40 p-3 text-sm leading-relaxed">
              <p className="mb-2"><b>Priya Sharma — H1 2026</b></p>
              <p className="mb-2">Priya has delivered exceptional platform-level impact this half, shipping the ingestion rewrite two sprints ahead of schedule and mentoring two junior engineers into their first production incidents.</p>
              <p className="mb-2">Growth area: increasing visibility of her work across the org. Encourage her to present the ingestion architecture at the next engineering all-hands and to draft an RFC for the query layer.</p>
              <p className="italic text-muted-foreground">Overall: Strong — trending Exceptional if scope broadens in H2.</p>
            </div>
            <div className="mt-3 flex justify-end gap-2">
              <button className="h-8 px-3 rounded-md border border-border text-sm hover:bg-accent">Regenerate</button>
              <button className="h-8 px-3 rounded-md text-white text-sm font-medium" style={{ background: ACCENT }}>Use draft</button>
            </div>
          </SectionCard>
        </>
      )}

      {tab === "Goals" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { title: "Ship AI live coach v2 to GA", pct: 72, status: "On track", level: "green" as const },
            { title: "Grow APAC pipeline by 40%", pct: 58, status: "At risk", level: "yellow" as const },
            { title: "Reduce onboarding time to 21d", pct: 89, status: "Ahead", level: "green" as const },
            { title: "Launch new comp bands", pct: 34, status: "Behind", level: "red" as const },
            { title: "Achieve SOC2 Type II", pct: 91, status: "Ahead", level: "green" as const },
          ].map((g) => (
            <SectionCard key={g.title} title={g.title}>
              <div className="flex items-center justify-between mb-2 text-xs"><span className="text-muted-foreground">{g.pct}%</span><StatusPill level={g.level}>{g.status}</StatusPill></div>
              <div className="h-2 rounded bg-muted overflow-hidden"><div className="h-full" style={{ width: `${g.pct}%`, background: ACCENT }} /></div>
            </SectionCard>
          ))}
        </div>
      )}

      {tab === "Calibration" && <SectionCard><p className="text-sm text-muted-foreground">Manager calibration matrix (mock).</p></SectionCard>}

      {tab === "Succession" && (
        <>
          <SectionCard title="Key roles" subtitle="Successor readiness for critical leadership positions">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border"><th className="py-2 pr-3">Role</th><th className="py-2 pr-3">Current</th><th className="py-2 pr-3">Successor 1</th><th className="py-2 pr-3">Successor 2</th><th className="py-2 pr-3">Risk</th></tr></thead>
              <tbody className="divide-y divide-border">
                {KEY_ROLES.map((r) => (
                  <tr key={r.role}>
                    <td className="py-2 pr-3 font-medium">{r.role}</td>
                    <td className="py-2 pr-3"><div className="flex items-center gap-2"><Avatar name={r.current} size={22} />{r.current}</div></td>
                    <td className="py-2 pr-3"><div className="text-xs"><div>{r.ready1}</div><div className="text-muted-foreground">{r.readiness1}</div></div></td>
                    <td className="py-2 pr-3"><div className="text-xs"><div>{r.ready2}</div><div className="text-muted-foreground">{r.readiness2}</div></div></td>
                    <td className="py-2 pr-3"><StatusPill level={r.risk}>{r.risk === "red" ? "High" : r.risk === "yellow" ? "Medium" : "Low"}</StatusPill></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </SectionCard>
          <SectionCard
            title={<span className="inline-flex items-center gap-2"><span className="h-6 w-6 rounded-md grid place-items-center" style={{ background: `color-mix(in oklab, ${ACCENT} 14%, transparent)`, color: ACCENT }}><Sparkles className="h-3 w-3" /></span> AI insight</span>}
          >
            <p className="text-sm">The <b>Head of Data</b> role is your largest succession gap: no internal candidate is ready in the next 12 months, and Priya Sharma's flight risk (78%) leaves the pipeline exposed. Recommend opening an external search and initiating a retention conversation with Priya this week.</p>
            <div className="mt-2"><RiskBadge confidence={88} /></div>
          </SectionCard>
        </>
      )}
    </HubPage>
  );
}
