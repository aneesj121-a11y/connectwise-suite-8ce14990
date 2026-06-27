import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { HubPage } from "@/components/hubs/page";
import { SectionCard, KpiCard, StatusPill, RiskBadge } from "@/components/enterprise/primitives";
import { RefreshCw, AlertTriangle, CalendarDays, KanbanSquare } from "lucide-react";

export const Route = createFileRoute("/cs/renewals")({
  head: () => ({ meta: [{ title: "Customer Success — Renewals" }] }),
  component: RenewalsPage,
});

type Renewal = {
  acct: string; arr: number; renewsIn: number; risk: "green" | "yellow" | "red"; util: number; corridor: string; owner: string;
};
const RENEWALS: Renewal[] = [
  { acct: "Helios Health",     arr: 153600, renewsIn: 18, risk: "red",    util: 41, corridor: "8–12%",  owner: "Priya S." },
  { acct: "Vanta Logistics",   arr: 264000, renewsIn: 24, risk: "red",    util: 33, corridor: "10–15%", owner: "Jordan K." },
  { acct: "Northwind Bank",    arr: 504000, renewsIn: 41, risk: "yellow", util: 62, corridor: "4–8%",   owner: "Marcus L." },
  { acct: "Pioneer Mutual",    arr: 374400, renewsIn: 52, risk: "yellow", util: 54, corridor: "5–9%",   owner: "Marcus L." },
  { acct: "Acme Corporation",  arr: 220800, renewsIn: 78, risk: "green",  util: 86, corridor: "0–3%",   owner: "Priya S." },
  { acct: "Atlas Robotics",    arr: 115200, renewsIn: 85, risk: "green",  util: 78, corridor: "0%",     owner: "Jordan K." },
  { acct: "Bluebird Media",    arr: 76800,  renewsIn: 88, risk: "green",  util: 91, corridor: "0%",     owner: "Priya S." },
];

function RenewalsPage() {
  const [view, setView] = useState<"board" | "timeline">("board");
  const atRisk = RENEWALS.filter((r) => r.risk !== "green");
  const arrAtRisk = atRisk.reduce((s, r) => s + r.arr, 0);

  return (
    <HubPage
      title="Renewals Engine"
      description="Track contracts expiring across 30 / 60 / 90 day horizons with AI risk + discount guidance."
      actions={
        <div className="inline-flex rounded-md border border-border overflow-hidden">
          <button onClick={() => setView("board")} className={`h-8 px-3 text-xs font-medium inline-flex items-center gap-1 ${view==="board"?"bg-primary text-primary-foreground":""}`}>
            <KanbanSquare className="h-3.5 w-3.5" /> Board
          </button>
          <button onClick={() => setView("timeline")} className={`h-8 px-3 text-xs font-medium inline-flex items-center gap-1 ${view==="timeline"?"bg-primary text-primary-foreground":""}`}>
            <CalendarDays className="h-3.5 w-3.5" /> Timeline
          </button>
        </div>
      }
      insights={[
        { title: "Discount corridor: Helios",  body: "Low utilization + competitive pressure suggests 8–12% retention discount maximizes NPV.", confidence: 88, cta: "Apply guidance" },
        { title: "Auto-flagged at risk",        body: `${atRisk.length} accounts flagged this cycle based on usage + sentiment composite drop.`, confidence: 92 },
      ]}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Renewing 90d"   value={`${RENEWALS.length}`} icon={RefreshCw} />
        <KpiCard label="ARR at stake"   value={`$${(RENEWALS.reduce((s,r)=>s+r.arr,0)/1000).toFixed(0)}k`} delta={5} />
        <KpiCard label="ARR at risk"    value={`$${(arrAtRisk/1000).toFixed(0)}k`} delta={-3} icon={AlertTriangle} />
        <KpiCard label="Retention rate" value="94%" delta={1} />
      </div>

      {view === "board" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {[
            { label: "0 – 30 days", filter: (r: Renewal) => r.renewsIn <= 30 },
            { label: "31 – 60 days", filter: (r: Renewal) => r.renewsIn > 30 && r.renewsIn <= 60 },
            { label: "61 – 90 days", filter: (r: Renewal) => r.renewsIn > 60 },
          ].map((col) => {
            const items = RENEWALS.filter(col.filter);
            return (
              <SectionCard key={col.label} title={col.label} subtitle={`${items.length} accounts`}>
                <ul className="space-y-2">
                  {items.map((r) => (
                    <li key={r.acct} className="rounded-md border border-border p-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{r.acct}</span>
                        <StatusPill level={r.risk}>{r.risk === "red" ? "At risk" : r.risk === "yellow" ? "Watch" : "Healthy"}</StatusPill>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>${(r.arr/1000).toFixed(0)}k ARR · util {r.util}%</span>
                        <span>{r.owner}</span>
                      </div>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <RiskBadge confidence={92} label="Disc" />
                        <span className="text-[11px] font-mono text-muted-foreground">corridor {r.corridor}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </SectionCard>
            );
          })}
        </div>
      ) : (
        <SectionCard title="Timeline">
          <ul className="space-y-3">
            {RENEWALS.sort((a, b) => a.renewsIn - b.renewsIn).map((r) => (
              <li key={r.acct} className="grid grid-cols-[140px_1fr_120px_80px] items-center gap-3">
                <div className="text-xs text-muted-foreground">in {r.renewsIn} days</div>
                <div className="relative h-2 rounded-full bg-muted overflow-hidden">
                  <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${(r.renewsIn/90)*100}%`, background: r.risk === "red" ? "var(--destructive)" : r.risk === "yellow" ? "var(--warning)" : "var(--success)" }} />
                </div>
                <div className="text-sm font-medium truncate">{r.acct}</div>
                <div className="text-right text-xs font-mono">${(r.arr/1000).toFixed(0)}k</div>
              </li>
            ))}
          </ul>
        </SectionCard>
      )}
    </HubPage>
  );
}
