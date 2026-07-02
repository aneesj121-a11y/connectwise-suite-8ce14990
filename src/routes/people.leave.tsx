import { createFileRoute } from "@tanstack/react-router";
import { HubPage } from "@/components/hubs/page";
import { SectionCard, StatusPill, Avatar } from "@/components/enterprise/primitives";
import { LEAVE_REQUESTS } from "@/lib/people-data";
import { Check, X } from "lucide-react";
import { useState } from "react";

const ACCENT = "oklch(0.58 0.18 280)";
const TABS = ["Pending Approvals", "Calendar", "Balances", "Policies"] as const;

export const Route = createFileRoute("/people/leave")({
  head: () => ({ meta: [{ title: "Leave — Limnn People" }] }),
  component: Leave,
});

const TYPE_COLOR: Record<string, string> = {
  Annual: "#2C69CF",
  Sick: "#EF4444",
  Personal: "#6366F1",
  WFH: "#10B981",
  Parental: "#EC4899",
};

function Leave() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Pending Approvals");
  return (
    <HubPage title="Leave" description="Approvals, calendar, balances and policy configuration.">
      <div className="flex items-center gap-1 border-b border-border mb-2">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="text-sm px-3 py-2 border-b-2 transition"
            style={{
              borderColor: tab === t ? ACCENT : "transparent",
              color: tab === t ? "var(--foreground)" : "var(--muted-foreground)",
              fontWeight: tab === t ? 600 : 400,
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Pending Approvals" && (
        <SectionCard>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border">
                <th className="py-2 pr-3">Employee</th><th className="py-2 pr-3">Type</th><th className="py-2 pr-3">Dates</th><th className="py-2 pr-3">Days</th><th className="py-2 pr-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {LEAVE_REQUESTS.map((l) => (
                <tr key={l.id}>
                  <td className="py-2 pr-3"><div className="flex items-center gap-2"><Avatar name={l.employee} size={24} /><span className="font-medium">{l.employee}</span></div></td>
                  <td className="py-2 pr-3"><span className="text-[11px] px-2 py-0.5 rounded-full font-medium" style={{ background: `color-mix(in oklab, ${TYPE_COLOR[l.type]} 12%, transparent)`, color: TYPE_COLOR[l.type] }}>{l.type}</span></td>
                  <td className="py-2 pr-3 text-muted-foreground">{l.start} → {l.end}</td>
                  <td className="py-2 pr-3 font-mono">{l.days}</td>
                  <td className="py-2 pr-3 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button className="h-7 w-7 grid place-items-center rounded-md border border-border hover:bg-emerald-500/10 text-emerald-600" title="Approve"><Check className="h-3.5 w-3.5" /></button>
                      <button className="h-7 w-7 grid place-items-center rounded-md border border-border hover:bg-rose-500/10 text-rose-600" title="Reject"><X className="h-3.5 w-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>
      )}

      {tab === "Calendar" && (
        <SectionCard title="July 2026">
          <div className="overflow-x-auto">
            <div className="min-w-[900px]">
              <div className="grid grid-cols-[160px_repeat(31,_minmax(24px,_1fr))] gap-px bg-border rounded overflow-hidden">
                <div className="bg-card p-2 text-[10px] text-muted-foreground">Employee</div>
                {Array.from({ length: 31 }).map((_, i) => (
                  <div key={i} className="bg-card p-1 text-[9px] text-center text-muted-foreground">{i + 1}</div>
                ))}
                {LEAVE_REQUESTS.slice(0, 6).map((l) => (
                  <div key={l.id} className="contents">
                    <div className="bg-card p-2 text-xs truncate">{l.employee}</div>
                    {Array.from({ length: 31 }).map((_, i) => {
                      const startDay = parseInt(l.start.split(" ")[1]) - 1;
                      const inRange = i >= startDay && i < startDay + l.days;
                      return (
                        <div key={i} className="bg-card min-h-[26px]" style={{ background: inRange ? TYPE_COLOR[l.type] : undefined, opacity: inRange ? 0.8 : 1 }} />
                      );
                    })}
                  </div>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-3 text-[11px]">
                {Object.entries(TYPE_COLOR).map(([k, v]) => (
                  <span key={k} className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded" style={{ background: v }} />{k}</span>
                ))}
              </div>
            </div>
          </div>
        </SectionCard>
      )}

      {tab === "Balances" && (
        <SectionCard title="Balances by team">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            {["Engineering", "Sales", "Marketing", "Ops"].map((d) => (
              <div key={d} className="rounded-lg border border-border p-3">
                <div className="text-xs text-muted-foreground">{d} · avg annual</div>
                <div className="text-2xl font-display font-semibold">12.4d</div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {tab === "Policies" && (
        <SectionCard title="Leave policies">
          <ul className="text-sm space-y-2.5">
            <li className="flex items-center justify-between"><span>Annual leave — Full-time</span><StatusPill level="green">20 days / yr</StatusPill></li>
            <li className="flex items-center justify-between"><span>Sick leave</span><StatusPill level="green">10 days / yr</StatusPill></li>
            <li className="flex items-center justify-between"><span>Parental leave (primary carer)</span><StatusPill level="blue">18 weeks paid</StatusPill></li>
            <li className="flex items-center justify-between"><span>Bereavement</span><StatusPill level="neutral">5 days</StatusPill></li>
            <li className="flex items-center justify-between"><span>WFH cap</span><StatusPill level="blue">Unlimited w/ mgr approval</StatusPill></li>
          </ul>
        </SectionCard>
      )}
    </HubPage>
  );
}
