import { createFileRoute } from "@tanstack/react-router";
import { HubPage } from "@/components/hubs/page";
import { SectionCard, KpiCard, StatusPill } from "@/components/enterprise/primitives";
import { hubInsights } from "@/lib/hubs-data";
import { RotateCcw, ThumbsUp, ThumbsDown, Lightbulb } from "lucide-react";

export const Route = createFileRoute("/grid/retros")({
  head: () => ({ meta: [{ title: "Grid — Retros" }] }),
  component: RetrosPage,
});

const RETRO = {
  went_well: [
    "AI coach v1 shipped on time and exceeded NPS target",
    "Cross-team Slack triage cut response time by 40%",
    "Salesforce sync alpha had zero P1s in first 2 weeks",
  ],
  not_well: [
    "Three story carry-overs from sprint 23 (capacity miss)",
    "Specs for WebRTC fallback arrived mid-sprint",
    "QA bottleneck on Friday — 6 PRs queued",
  ],
  actions: [
    { item: "Lock spec review by Day 2 of sprint planning", owner: "Anees", due: "Sprint 25" },
    { item: "Add Mia as QA reviewer for AI squad", owner: "Priya", due: "This week" },
    { item: "Demo dry-run every Thursday", owner: "Alex", due: "Recurring" },
  ],
};

function RetrosPage() {
  return (
    <HubPage
      title="Retros"
      description="Sprint retrospectives with AI-aggregated themes and follow-through tracking."
      insights={hubInsights("grid")}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Retros run" value="22" icon={RotateCcw} />
        <KpiCard label="Actions closed" value="84%" delta={6} icon={ThumbsUp} />
        <KpiCard label="Recurring themes" value="3" icon={Lightbulb} />
        <KpiCard label="Avg mood" value="7.4/10" delta={3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <SectionCard title="What went well" subtitle={`${RETRO.went_well.length} items`}>
          <ul className="space-y-2 text-sm">
            {RETRO.went_well.map((x) => (
              <li key={x} className="flex items-start gap-2"><ThumbsUp className="h-3.5 w-3.5 mt-0.5 shrink-0" style={{ color: "var(--success)" }} /><span>{x}</span></li>
            ))}
          </ul>
        </SectionCard>
        <SectionCard title="What didn't" subtitle={`${RETRO.not_well.length} items`}>
          <ul className="space-y-2 text-sm">
            {RETRO.not_well.map((x) => (
              <li key={x} className="flex items-start gap-2"><ThumbsDown className="h-3.5 w-3.5 mt-0.5 shrink-0" style={{ color: "var(--destructive)" }} /><span>{x}</span></li>
            ))}
          </ul>
        </SectionCard>
        <SectionCard title="Action items">
          <ul className="space-y-2 text-sm">
            {RETRO.actions.map((a) => (
              <li key={a.item} className="border border-border rounded-md p-2.5">
                <div className="text-sm font-medium leading-tight">{a.item}</div>
                <div className="mt-1.5 flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">{a.owner}</span>
                  <StatusPill level="blue">{a.due}</StatusPill>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </HubPage>
  );
}
