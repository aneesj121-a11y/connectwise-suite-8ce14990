import { createFileRoute } from "@tanstack/react-router";
import { HubPage } from "@/components/hubs/page";
import { SectionCard, KpiCard, RiskBadge } from "@/components/enterprise/primitives";
import { Mic, Phone, GitBranch, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/chat/voice")({
  head: () => ({ meta: [{ title: "Support — Voice & IVR" }] }),
  component: VoicePage,
});

const NODES = [
  { id: "n1", label: "Welcome menu",          type: "Greeting",   drop: 4,  next: ["Billing", "Tech", "Sales", "Operator"] },
  { id: "n2", label: "Tech support sub-menu", type: "Menu",       drop: 22, next: ["Dialer", "Recording", "Integrations", "Back"] },
  { id: "n3", label: "Account verify",        type: "Verify",     drop: 18, next: ["Verified", "Failed"] },
  { id: "n4", label: "Queue: Tier-1 Tech",    type: "Queue",      drop: 11, next: ["Agent"] },
  { id: "n5", label: "After-hours catch-all", type: "Voicemail",  drop: 38, next: ["Voicemail saved"] },
];

function VoicePage() {
  return (
    <HubPage
      title="Voice & IVR"
      description="Visual call-flow builder with AI-driven drop-off analysis."
      actions={
        <button className="h-9 px-3 rounded-md text-sm font-medium text-primary-foreground inline-flex items-center gap-1.5" style={{ background: "var(--primary)" }}>
          <GitBranch className="h-3.5 w-3.5" /> Edit flow
        </button>
      }
      insights={[
        { title: "Drop-off spike — Tech sub-menu", body: "22% of callers abandon at node 2. Flattening to a 2-option menu typically improves containment by 9pp.", confidence: 87, cta: "Restructure" },
        { title: "After-hours volume +31%",        body: "Recommend a callback offer instead of pure voicemail at node 5.", confidence: 81 },
      ]}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Inbound calls (7d)" value="3,418" delta={6} icon={Phone} />
        <KpiCard label="Containment"        value="64%"  delta={2} icon={Mic} />
        <KpiCard label="Abandon rate"       value="11%"  delta={-3} icon={AlertTriangle} />
        <KpiCard label="Avg menu depth"     value="2.3"  delta={-0.4} />
      </div>

      <SectionCard title="Flow nodes" subtitle="Drop-off measured per node">
        <ul className="space-y-2">
          {NODES.map((n) => (
            <li key={n.id} className="rounded-md border border-border p-3">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-muted-foreground">{n.id}</span>
                  <span className="font-medium">{n.label}</span>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{n.type}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs" style={{ color: n.drop > 20 ? "var(--destructive)" : n.drop > 10 ? "var(--warning)" : "var(--success)" }}>
                    {n.drop}% drop
                  </span>
                  {n.drop > 15 && <RiskBadge confidence={88} label="Fix" />}
                </div>
              </div>
              <div className="flex items-center gap-1 flex-wrap text-[11px] text-muted-foreground">
                <span>→</span>
                {n.next.map((nx) => (
                  <span key={nx} className="rounded-full bg-muted px-2 py-0.5">{nx}</span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </SectionCard>
    </HubPage>
  );
}
