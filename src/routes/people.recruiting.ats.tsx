import { createFileRoute } from "@tanstack/react-router";
import { HubPage } from "@/components/hubs/page";
import { SectionCard, StatusPill, Avatar, RiskBadge } from "@/components/enterprise/primitives";
import { CANDIDATES, REQUISITIONS, type Candidate } from "@/lib/people-data";
import { Sparkles, Star, X } from "lucide-react";
import { useState } from "react";

const ACCENT = "oklch(0.58 0.18 280)";

export const Route = createFileRoute("/people/recruiting/ats")({
  head: () => ({ meta: [{ title: "ATS Kanban — Limnn People" }] }),
  component: ATS,
});

const COLS: { key: Candidate["stage"]; color: string; bg: string }[] = [
  { key: "Applied", color: "#94A3B8", bg: "color-mix(in oklab, #94A3B8 8%, transparent)" },
  { key: "Screening", color: "#2C69CF", bg: "color-mix(in oklab, #2C69CF 8%, transparent)" },
  { key: "Interview", color: "#F59E0B", bg: "color-mix(in oklab, #F59E0B 8%, transparent)" },
  { key: "Offer", color: "#6366F1", bg: "color-mix(in oklab, #6366F1 8%, transparent)" },
  { key: "Hired", color: "#10B981", bg: "color-mix(in oklab, #10B981 8%, transparent)" },
  { key: "Rejected", color: "#EF4444", bg: "color-mix(in oklab, #EF4444 8%, transparent)" },
];

function ATS() {
  const [req, setReq] = useState(REQUISITIONS[0].id);
  const [selected, setSelected] = useState<Candidate | null>(null);
  const cards = CANDIDATES.filter((c) => c.reqId === req || CANDIDATES.length < 20);

  return (
    <HubPage
      title="ATS Board"
      description="Drag candidates through the pipeline. AI screens and matches every applicant."
      actions={
        <select
          value={req}
          onChange={(e) => setReq(e.target.value)}
          className="h-9 px-3 rounded-md border border-border bg-card text-sm"
        >
          {REQUISITIONS.map((r) => (
            <option key={r.id} value={r.id}>{r.id} — {r.title}</option>
          ))}
        </select>
      }
    >
      <SectionCard
        title={
          <span className="inline-flex items-center gap-2">
            <span className="h-6 w-6 rounded-md grid place-items-center" style={{ background: `color-mix(in oklab, ${ACCENT} 14%, transparent)`, color: ACCENT }}>
              <Sparkles className="h-3 w-3" />
            </span>
            AI screening today
          </span>
        }
      >
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="rounded-lg border border-border p-3"><div className="text-2xl font-display font-semibold text-emerald-600">14</div><div className="text-[11px] text-muted-foreground">Strong match (&gt;85%)</div></div>
          <div className="rounded-lg border border-border p-3"><div className="text-2xl font-display font-semibold text-amber-600">31</div><div className="text-[11px] text-muted-foreground">Moderate (60–85%)</div></div>
          <div className="rounded-lg border border-border p-3"><div className="text-2xl font-display font-semibold text-rose-600">62</div><div className="text-[11px] text-muted-foreground">Low match (&lt;60%)</div></div>
        </div>
      </SectionCard>

      <div className="grid grid-cols-6 gap-3 min-w-[1100px] overflow-x-auto">
        {COLS.map((col) => {
          const stageCards = cards.filter((c) => c.stage === col.key);
          const collapsed = col.key === "Rejected";
          return (
            <div key={col.key} className="rounded-xl p-2.5" style={{ background: col.bg, minWidth: collapsed ? 100 : 180 }}>
              <div className="flex items-center justify-between px-1 mb-2">
                <span className="text-xs font-semibold" style={{ color: col.color }}>{col.key}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full" style={{ background: `color-mix(in oklab, ${col.color} 14%, transparent)`, color: col.color }}>{stageCards.length}</span>
              </div>
              {!collapsed && (
                <div className="space-y-2">
                  {stageCards.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelected(c)}
                      className="w-full text-left rounded-lg border border-border bg-card p-2.5 hover:shadow-md transition"
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <Avatar name={c.name} size={22} />
                        <span className="text-sm font-medium truncate flex-1">{c.name}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                        <span className="px-1.5 py-0.5 rounded bg-muted">{c.source}</span>
                        <span className="inline-flex items-center gap-0.5"><Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />{c.rating}</span>
                      </div>
                      <div className="flex items-center justify-between mt-1.5">
                        <RiskBadge confidence={c.matchPct} label="Match" />
                        <span className="text-[10px] text-muted-foreground">{c.daysInStage}d</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selected && (
        <div className="fixed inset-y-0 right-0 w-[420px] bg-card border-l border-border shadow-2xl z-50 flex flex-col">
          <header className="p-4 border-b border-border flex items-start gap-3">
            <Avatar name={selected.name} size={40} />
            <div className="flex-1 min-w-0">
              <div className="font-display text-lg font-semibold">{selected.name}</div>
              <div className="text-xs text-muted-foreground">{selected.source} · {selected.stage} · {selected.daysInStage}d in stage</div>
            </div>
            <button onClick={() => setSelected(null)} className="h-8 w-8 grid place-items-center rounded-md hover:bg-accent"><X className="h-4 w-4" /></button>
          </header>
          <div className="flex-1 overflow-auto p-4 space-y-4 text-sm">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 inline-flex items-center gap-1.5"><Sparkles className="h-3 w-3" style={{ color: ACCENT }} /> AI summary</div>
              <p className="text-xs leading-relaxed">7 years enterprise sales at Salesforce and Zoom Phone, closed $2.1M last FY. Strong MEDDPICC discipline, previously beat quota 4/5 years. Referred by Henrik Larsen.</p>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">Skills match</div>
              {[
                { s: "Enterprise SaaS", v: 92 },
                { s: "MEDDPICC", v: 88 },
                { s: "APAC territory", v: 74 },
                { s: "Dialer / CCaaS", v: 58 },
              ].map((s) => (
                <div key={s.s} className="mb-2">
                  <div className="flex justify-between text-[11px] mb-0.5"><span>{s.s}</span><span className="font-mono">{s.v}%</span></div>
                  <div className="h-1.5 bg-muted rounded"><div className="h-full rounded" style={{ width: `${s.v}%`, background: ACCENT }} /></div>
                </div>
              ))}
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Culture fit</div>
              <StatusPill level="green">Strong · 87%</StatusPill>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Red flags</div>
              <ul className="text-xs space-y-1">
                <li className="text-amber-600">· 3 jobs in 4 years — tenure trending short</li>
              </ul>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">Suggested interview questions</div>
              <ol className="text-xs space-y-1.5 list-decimal list-inside">
                <li>Walk me through your largest APAC deal — champion, decision process, key blockers.</li>
                <li>How do you decide when to disqualify a deal in the first two calls?</li>
                <li>What's your ramp plan for a new SaaS product with no APAC references?</li>
              </ol>
            </div>
          </div>
          <div className="p-3 border-t border-border">
            <button className="w-full h-10 rounded-md text-white text-sm font-medium inline-flex items-center justify-center gap-1.5" style={{ background: ACCENT }}>
              <Sparkles className="h-3.5 w-3.5" /> Generate interview kit
            </button>
          </div>
        </div>
      )}
    </HubPage>
  );
}
