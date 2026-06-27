import { createFileRoute } from "@tanstack/react-router";
import { HubPage } from "@/components/hubs/page";
import { SectionCard, KpiCard, StatusPill } from "@/components/enterprise/primitives";
import { hubInsights } from "@/lib/hubs-data";
import { Workflow, Plus, Zap, Activity } from "lucide-react";

export const Route = createFileRoute("/grid/automations")({
  head: () => ({ meta: [{ title: "Grid — Automations" }] }),
  component: AutomationsPage,
});

const FLOWS = [
  { name: "Closed Won → CS handoff task", trigger: "Deal stage = Closed Won", runs: 142, success: 98, status: "On" },
  { name: "Ticket P1 → Slack on-call", trigger: "Ticket priority = P1", runs: 88, success: 100, status: "On" },
  { name: "Health < 50 → CSM alert", trigger: "Account health drop", runs: 24, success: 95, status: "On" },
  { name: "Invoice overdue 7d → dunning", trigger: "Invoice DPD ≥ 7", runs: 36, success: 91, status: "On" },
  { name: "Renewal 90d → QBR draft", trigger: "Renewal < 90 days", runs: 12, success: 100, status: "Off" },
  { name: "AI macro suggestion → auto-reply", trigger: "Macro confidence > 92%", runs: 218, success: 96, status: "On" },
];

function AutomationsPage() {
  return (
    <HubPage
      title="Automations"
      description="No-code workflow builder for cross-hub triggers and AI actions."
      actions={
        <button className="h-9 px-3 rounded-md text-sm font-medium text-primary-foreground inline-flex items-center gap-1.5" style={{ background: "var(--primary)" }}>
          <Plus className="h-3.5 w-3.5" /> New automation
        </button>
      }
      insights={hubInsights("grid")}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Active flows" value={`${FLOWS.filter(f=>f.status==="On").length}`} icon={Workflow} />
        <KpiCard label="Runs (7d)" value="520" delta={18} icon={Activity} />
        <KpiCard label="Success rate" value="96%" delta={2} icon={Zap} />
        <KpiCard label="Time saved" value="84h" delta={11} />
      </div>

      <SectionCard title="Automations">
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-muted-foreground border-b border-border">
            <tr>
              <th className="py-2 pr-3 font-medium">Workflow</th>
              <th className="py-2 pr-3 font-medium">Trigger</th>
              <th className="py-2 pr-3 font-medium text-right">Runs 7d</th>
              <th className="py-2 pr-3 font-medium text-right">Success</th>
              <th className="py-2 pr-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {FLOWS.map((f) => (
              <tr key={f.name} className="hover:bg-muted/40">
                <td className="py-2.5 pr-3 font-medium">{f.name}</td>
                <td className="py-2.5 pr-3 text-xs text-muted-foreground">{f.trigger}</td>
                <td className="py-2.5 pr-3 text-right font-mono text-xs">{f.runs}</td>
                <td className="py-2.5 pr-3 text-right font-mono text-xs">{f.success}%</td>
                <td className="py-2.5 pr-3"><StatusPill level={f.status === "On" ? "green" : "neutral"}>{f.status}</StatusPill></td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>
    </HubPage>
  );
}
