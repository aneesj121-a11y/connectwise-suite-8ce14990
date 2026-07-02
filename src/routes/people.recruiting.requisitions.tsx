import { createFileRoute } from "@tanstack/react-router";
import { HubPage } from "@/components/hubs/page";
import { SectionCard, StatusPill, KpiCard } from "@/components/enterprise/primitives";
import { REQUISITIONS } from "@/lib/people-data";
import { Sparkles, Plus, RefreshCw, Briefcase, CheckCircle2, Clock as ClockIcon, TimerReset } from "lucide-react";
import { useState } from "react";

const ACCENT = "oklch(0.58 0.18 280)";

export const Route = createFileRoute("/people/recruiting/requisitions")({
  head: () => ({ meta: [{ title: "Requisitions — Limnn People" }] }),
  component: Requisitions,
});

function Requisitions() {
  const [showNew, setShowNew] = useState(false);
  return (
    <HubPage
      title="Requisitions"
      description="All open, filled and pending approval requisitions."
      actions={
        <>
          <button className="h-9 px-3 rounded-md border border-border text-sm inline-flex items-center gap-1.5 hover:bg-accent">
            <RefreshCw className="h-3.5 w-3.5" /> New Backfill
          </button>
          <button
            onClick={() => setShowNew(true)}
            className="h-9 px-3 rounded-md text-sm font-medium text-white inline-flex items-center gap-1.5"
            style={{ background: ACCENT }}
          >
            <Plus className="h-3.5 w-3.5" /> New Req
          </button>
        </>
      }
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Open reqs" value="12" icon={Briefcase} />
        <KpiCard label="Filled (30d)" value="3" delta={12} icon={CheckCircle2} />
        <KpiCard label="Avg time to fill" value="28d" delta={-4} icon={TimerReset} />
        <KpiCard label="Pending approval" value="2" icon={ClockIcon} />
      </div>

      <SectionCard>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border">
                <th className="py-2 pr-3">Req ID</th><th className="py-2 pr-3">Title</th><th className="py-2 pr-3">Type</th><th className="py-2 pr-3">Dept</th><th className="py-2 pr-3">Hiring mgr</th><th className="py-2 pr-3">Priority</th><th className="py-2 pr-3">Status</th><th className="py-2 pr-3 text-right">Candidates</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {REQUISITIONS.map((r) => (
                <tr key={r.id} className="hover:bg-accent/40">
                  <td className="py-2 pr-3 font-mono text-[11px]">{r.id}</td>
                  <td className="py-2 pr-3 font-medium">{r.title}</td>
                  <td className="py-2 pr-3">{r.type === "new" ? "🆕 New" : "🔄 Backfill"}</td>
                  <td className="py-2 pr-3">{r.dept}</td>
                  <td className="py-2 pr-3">{r.hiringManager}</td>
                  <td className="py-2 pr-3"><StatusPill level={r.priority === "P0" ? "red" : r.priority === "P1" ? "yellow" : "neutral"}>{r.priority}</StatusPill></td>
                  <td className="py-2 pr-3"><StatusPill level={r.status === "Filled" ? "green" : r.status === "Offer" ? "blue" : r.status === "On Hold" ? "yellow" : "neutral"}>{r.status}</StatusPill></td>
                  <td className="py-2 pr-3 text-right font-mono">{r.candidates}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {showNew && (
        <div className="fixed inset-0 bg-black/40 z-50 grid place-items-center p-4" onClick={() => setShowNew(false)}>
          <div className="w-full max-w-2xl bg-card rounded-xl border border-border p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-display text-xl font-semibold mb-1">New requisition</h2>
            <p className="text-xs text-muted-foreground mb-5">Fill out the form or let AI draft it for you.</p>

            <div
              className="rounded-lg border p-4 mb-4"
              style={{ background: `color-mix(in oklab, ${ACCENT} 5%, transparent)`, borderColor: `color-mix(in oklab, ${ACCENT} 25%, var(--border))` }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4" style={{ color: ACCENT }} />
                <span className="font-medium text-sm">AI Draft</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium" style={{ background: `color-mix(in oklab, ${ACCENT} 14%, transparent)`, color: ACCENT }}>Beta</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">Describe the role in one sentence — AI drafts the full JD, requirements, and salary band.</p>
              <div className="flex gap-2">
                <input
                  defaultValue="Senior AE for APAC, mid-market SaaS, quota $1.4M"
                  className="flex-1 h-9 px-3 rounded-md border border-border bg-background text-sm"
                />
                <button className="h-9 px-3 rounded-md text-white text-sm font-medium" style={{ background: ACCENT }}>
                  Generate
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Job title" value="Senior Account Executive — APAC" />
              <Field label="Department" value="Sales" />
              <Field label="Hiring manager" value="Tomoko Ishida" />
              <Field label="Priority" value="P1" />
              <Field label="Location" value="Singapore / Remote" />
              <Field label="Salary band" value="$155k – $195k + 50% variable" />
            </div>
            <div className="mt-3">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">AI-drafted JD</div>
              <div className="rounded-md border border-border bg-muted/40 p-3 text-xs leading-relaxed max-h-40 overflow-auto">
                <b>Responsibilities:</b> Own a book of APAC mid-market accounts, close $1.4M ARR annually, partner with SDR and CS.<br />
                <b>Requirements:</b> 5+ years SaaS closing, MEDDPICC, English + one APAC language.<br />
                <b>Nice-to-have:</b> Contact center / dialer experience, Singapore-based.<br />
                <b>Salary suggestion:</b> $155k – $195k base + 50% variable (P75 APAC band).
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setShowNew(false)} className="h-9 px-3 rounded-md border border-border text-sm hover:bg-accent">Cancel</button>
              <button className="h-9 px-3 rounded-md text-white text-sm font-medium" style={{ background: ACCENT }}>Create requisition</button>
            </div>
          </div>
        </div>
      )}
    </HubPage>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <span className="block text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{label}</span>
      <input defaultValue={value} className="w-full h-9 px-3 rounded-md border border-border bg-background text-sm" />
    </label>
  );
}
