import { createFileRoute } from "@tanstack/react-router";
import { HubPage } from "@/components/hubs/page";
import { SectionCard, KpiCard, RiskBadge, StatusPill } from "@/components/enterprise/primitives";
import { Wand2, Play, Plus } from "lucide-react";

export const Route = createFileRoute("/chat/macros")({
  head: () => ({ meta: [{ title: "Support — AI Macros" }] }),
  component: MacrosPage,
});

const MACROS = [
  { name: "Refund + close ticket",     trigger: "/refund",   steps: ["Validate eligibility", "Issue refund (Stripe)", "Email confirmation", "Close ticket"], usage: 412, ai: false },
  { name: "Escalate to on-call",       trigger: "/escalate", steps: ["Tag P1", "Page on-call duo", "Internal note + customer ack"], usage: 188, ai: false },
  { name: "Send status page link",     trigger: "/status",   steps: ["Detect channel locale", "Insert link", "Promise update in 30m"], usage: 622, ai: false },
  { name: "[Suggested] WebRTC reset",  trigger: "/wrtc-fix", steps: ["Send reset steps", "Attach KB article", "Schedule follow-up in 1h"], usage: 0,   ai: true, conf: 92 },
];

function MacrosPage() {
  return (
    <HubPage
      title="AI Macros"
      description="Single-keystroke executables. Limnn AI watches repetitive agent workflows and proposes new macros."
      actions={
        <button className="h-9 px-3 rounded-md text-sm font-medium text-primary-foreground inline-flex items-center gap-1.5" style={{ background: "var(--primary)" }}>
          <Plus className="h-3.5 w-3.5" /> Build macro
        </button>
      }
      insights={[
        { title: "Suggested: WebRTC reset", body: "Detected 23 occurrences of the same 3-step pattern this week — promote to macro?", confidence: 92, cta: "Promote" },
        { title: "Underused: /escalate",     body: "Macro exists but 4 tickets last week were escalated manually. Surface as a hint.", confidence: 78 },
      ]}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Active macros"     value="14" icon={Wand2} />
        <KpiCard label="Runs this week"    value="1,422" delta={18} icon={Play} />
        <KpiCard label="Avg time saved"    value="6m 12s" delta={9} />
        <KpiCard label="AI suggestions"    value="2" />
      </div>

      <SectionCard title="Macro library">
        <ul className="space-y-2">
          {MACROS.map((m) => (
            <li key={m.name} className="rounded-md border border-border p-3">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{m.name}</span>
                  <code className="text-[11px] font-mono px-1.5 py-0.5 rounded" style={{ background: "var(--muted)" }}>{m.trigger}</code>
                  {m.ai && <RiskBadge confidence={m.conf!} label="AI" />}
                </div>
                <div className="flex items-center gap-2">
                  <StatusPill level={m.ai ? "yellow" : "green"}>{m.ai ? "Suggested" : "Live"}</StatusPill>
                  <span className="text-[11px] text-muted-foreground">{m.usage} runs</span>
                </div>
              </div>
              <ol className="text-[11px] text-muted-foreground flex flex-wrap items-center gap-1">
                {m.steps.map((s, i) => (
                  <li key={i} className="inline-flex items-center gap-1">
                    <span className="rounded-full bg-muted px-1.5 py-0.5">{s}</span>
                    {i < m.steps.length - 1 && <span className="text-border">→</span>}
                  </li>
                ))}
              </ol>
            </li>
          ))}
        </ul>
      </SectionCard>
    </HubPage>
  );
}
