import { createFileRoute } from "@tanstack/react-router";
import { HubPage } from "@/components/hubs/page";
import { SectionCard, KpiCard, StatusPill } from "@/components/enterprise/primitives";
import { hubInsights } from "@/lib/hubs-data";
import { Scale, BookOpen, Calendar, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/billing/revrec")({
  head: () => ({ meta: [{ title: "Billing — Revenue Recognition" }] }),
  component: RevRecPage,
});

const SCHEDULE = [
  { contract: "Acme · MSA FY26", billed: 220800, recognized: 92000, deferred: 128800, method: "Ratable 12mo", status: "On track" },
  { contract: "Northwind · Enterprise FY26", billed: 504000, recognized: 168000, deferred: 336000, method: "Ratable 12mo", status: "On track" },
  { contract: "Pioneer · 3yr Lock", billed: 936000, recognized: 156000, deferred: 780000, method: "Ratable 36mo", status: "On track" },
  { contract: "Atlas · Pilot", billed: 28800, recognized: 28800, deferred: 0, method: "Point in time", status: "Closed" },
  { contract: "Helios · Pro Services", billed: 48000, recognized: 32000, deferred: 16000, method: "Milestone", status: "Pending milestone" },
];

function RevRecPage() {
  const billed = SCHEDULE.reduce((s, r) => s + r.billed, 0);
  const recog = SCHEDULE.reduce((s, r) => s + r.recognized, 0);
  const deferred = SCHEDULE.reduce((s, r) => s + r.deferred, 0);
  return (
    <HubPage
      title="Revenue Recognition"
      description="ASC 606 / IFRS 15 schedules across active contracts."
      insights={hubInsights("billing")}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Billed (YTD)" value={`$${(billed/1000).toFixed(0)}k`} icon={BookOpen} />
        <KpiCard label="Recognized" value={`$${(recog/1000).toFixed(0)}k`} delta={9} icon={CheckCircle2} />
        <KpiCard label="Deferred" value={`$${(deferred/1000).toFixed(0)}k`} icon={Calendar} />
        <KpiCard label="Standard" value="ASC 606" icon={Scale} />
      </div>

      <SectionCard title="Recognition schedule">
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-muted-foreground border-b border-border">
            <tr>
              <th className="py-2 pr-3 font-medium">Contract</th>
              <th className="py-2 pr-3 font-medium text-right">Billed</th>
              <th className="py-2 pr-3 font-medium text-right">Recognized</th>
              <th className="py-2 pr-3 font-medium text-right">Deferred</th>
              <th className="py-2 pr-3 font-medium">Method</th>
              <th className="py-2 pr-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {SCHEDULE.map((r) => (
              <tr key={r.contract} className="hover:bg-muted/40">
                <td className="py-2.5 pr-3 font-medium">{r.contract}</td>
                <td className="py-2.5 pr-3 text-right font-mono text-xs">${r.billed.toLocaleString()}</td>
                <td className="py-2.5 pr-3 text-right font-mono text-xs">${r.recognized.toLocaleString()}</td>
                <td className="py-2.5 pr-3 text-right font-mono text-xs">${r.deferred.toLocaleString()}</td>
                <td className="py-2.5 pr-3 text-xs text-muted-foreground">{r.method}</td>
                <td className="py-2.5 pr-3"><StatusPill level={r.status === "On track" ? "green" : r.status === "Closed" ? "blue" : "yellow"}>{r.status}</StatusPill></td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>
    </HubPage>
  );
}
