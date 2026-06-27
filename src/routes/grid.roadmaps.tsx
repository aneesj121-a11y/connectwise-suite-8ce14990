import { createFileRoute } from "@tanstack/react-router";
import { HubPage } from "@/components/hubs/page";
import { SectionCard, KpiCard, StatusPill, RiskBadge } from "@/components/enterprise/primitives";
import { hubInsights } from "@/lib/hubs-data";
import { Map, Flag, Calendar } from "lucide-react";

export const Route = createFileRoute("/grid/roadmaps")({
  head: () => ({ meta: [{ title: "Grid — Roadmaps" }] }),
  component: RoadmapsPage,
});

const QUARTERS = ["Q3 FY26", "Q4 FY26", "Q1 FY27"];
const ITEMS = [
  { name: "WebRTC fallback", team: "Platform", q: "Q3 FY26", status: "On track", conf: 84 },
  { name: "AI live coach v2", team: "AI", q: "Q3 FY26", status: "At risk", conf: 58 },
  { name: "Salesforce bi-directional sync", team: "Integrations", q: "Q3 FY26", status: "On track", conf: 78 },
  { name: "Multi-region call routing", team: "Platform", q: "Q4 FY26", status: "Planned", conf: 70 },
  { name: "Predictive churn signals", team: "AI", q: "Q4 FY26", status: "Planned", conf: 66 },
  { name: "Mobile app GA", team: "Mobile", q: "Q1 FY27", status: "Planned", conf: 55 },
  { name: "ServiceNow integration", team: "Integrations", q: "Q1 FY27", status: "Planned", conf: 62 },
];

function RoadmapsPage() {
  return (
    <HubPage
      title="Roadmaps"
      description="Quarterly delivery plan across squads with confidence and dependencies."
      insights={hubInsights("grid")}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Q3 items" value={`${ITEMS.filter(i=>i.q==="Q3 FY26").length}`} icon={Map} />
        <KpiCard label="At risk" value={`${ITEMS.filter(i=>i.status==="At risk").length}`} icon={Flag} />
        <KpiCard label="Avg confidence" value={`${Math.round(ITEMS.reduce((s,i)=>s+i.conf,0)/ITEMS.length)}%`} icon={Calendar} />
        <KpiCard label="Delivered YTD" value="38" delta={9} />
      </div>

      <SectionCard title="Roadmap by quarter">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {QUARTERS.map((q) => (
            <div key={q} className="rounded-lg border border-border bg-card">
              <div className="px-3 py-2 border-b border-border text-xs font-medium uppercase tracking-wider text-muted-foreground">{q}</div>
              <ul className="p-2 space-y-2">
                {ITEMS.filter((i) => i.q === q).map((i) => (
                  <li key={i.name} className="rounded-md border border-border p-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-sm font-medium leading-tight">{i.name}</div>
                      <StatusPill level={i.status === "At risk" ? "yellow" : i.status === "On track" ? "green" : "blue"}>{i.status}</StatusPill>
                    </div>
                    <div className="mt-1.5 flex items-center justify-between">
                      <span className="text-[11px] text-muted-foreground">{i.team}</span>
                      <RiskBadge confidence={i.conf} label="Conf" />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </SectionCard>
    </HubPage>
  );
}
