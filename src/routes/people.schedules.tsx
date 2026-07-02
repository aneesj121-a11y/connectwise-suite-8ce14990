import { createFileRoute } from "@tanstack/react-router";
import { HubPage } from "@/components/hubs/page";
import { SectionCard, StatusPill, Avatar } from "@/components/enterprise/primitives";
import { EMPLOYEES } from "@/lib/people-data";
import { useState } from "react";

const ACCENT = "oklch(0.58 0.18 280)";
const TABS = ["This Week", "Shifts", "Timesheets", "Templates"] as const;
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const Route = createFileRoute("/people/schedules")({
  head: () => ({ meta: [{ title: "Schedules — Limnn People" }] }),
  component: Schedules,
});

const SCHED = [
  ["9–5", "9–5", "9–5", "OFF", "9–5", "OFF", "OFF"],
  ["10–6", "10–6", "LEAVE", "LEAVE", "10–6", "OFF", "OFF"],
  ["Night", "Night", "Night", "OFF", "OFF", "Night", "Night"],
  ["9–5", "9–5", "9–5", "9–5", "9–5", "OFF", "OFF"],
  ["OFF", "8–4", "8–4", "8–4", "8–4", "OFF", "OFF"],
  ["9–5", "9–5", "9–5", "OFF", "9–5", "OFF", "OFF"],
];

const CELL_COLOR = (t: string) => {
  if (t === "OFF") return { bg: "var(--muted)", fg: "var(--muted-foreground)" };
  if (t === "LEAVE") return { bg: "color-mix(in oklab, #F59E0B 14%, transparent)", fg: "#B45309" };
  if (t === "Night") return { bg: "color-mix(in oklab, #6366F1 14%, transparent)", fg: "#4F46E5" };
  return { bg: "color-mix(in oklab, #2C69CF 14%, transparent)", fg: "#1E40AF" };
};

function Schedules() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("This Week");
  const people = EMPLOYEES.slice(4, 10);

  return (
    <HubPage title="Schedules" description="Weekly rota, shifts, timesheet approvals and templates.">
      <div className="flex items-center gap-1 border-b border-border mb-2">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} className="text-sm px-3 py-2 border-b-2" style={{ borderColor: tab === t ? ACCENT : "transparent", color: tab === t ? "var(--foreground)" : "var(--muted-foreground)", fontWeight: tab === t ? 600 : 400 }}>{t}</button>
        ))}
      </div>

      {tab === "This Week" && (
        <SectionCard title="Week of Jun 30 – Jul 6">
          <div className="overflow-x-auto">
            <div className="min-w-[720px] grid grid-cols-[180px_repeat(7,_1fr)] gap-1.5">
              <div />
              {DAYS.map((d) => <div key={d} className="text-[10px] uppercase tracking-wider text-muted-foreground text-center">{d}</div>)}
              {people.map((p, i) => (
                <div key={p.id} className="contents">
                  <div className="flex items-center gap-2 py-1"><Avatar name={p.name} size={22} /><span className="text-xs font-medium truncate">{p.name}</span></div>
                  {SCHED[i].map((c, j) => {
                    const col = CELL_COLOR(c);
                    return <div key={j} className="rounded-md text-center text-[11px] font-medium py-1.5" style={{ background: col.bg, color: col.fg }}>{c}</div>;
                  })}
                </div>
              ))}
            </div>
          </div>
        </SectionCard>
      )}

      {tab === "Timesheets" && (
        <SectionCard title="Pending timesheets">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border">
                <th className="py-2 pr-3">Employee</th><th className="py-2 pr-3">Week</th><th className="py-2 pr-3">Hours</th><th className="py-2 pr-3">Overtime</th><th className="py-2 pr-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {people.slice(0, 5).map((p, i) => (
                <tr key={p.id}>
                  <td className="py-2 pr-3"><div className="flex items-center gap-2"><Avatar name={p.name} size={22} />{p.name}</div></td>
                  <td className="py-2 pr-3">Jun 23–29</td>
                  <td className="py-2 pr-3 font-mono">{38 + i * 2}h</td>
                  <td className="py-2 pr-3 font-mono">{i * 1.5}h</td>
                  <td className="py-2 pr-3"><StatusPill level={i === 0 ? "yellow" : "blue"}>{i === 0 ? "Awaiting mgr" : "Submitted"}</StatusPill></td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>
      )}

      {tab === "Shifts" && <SectionCard><p className="text-sm text-muted-foreground">Shift patterns and rotations (mock).</p></SectionCard>}
      {tab === "Templates" && <SectionCard><p className="text-sm text-muted-foreground">Reusable roster templates for Ops, Support, Retail.</p></SectionCard>}
    </HubPage>
  );
}
