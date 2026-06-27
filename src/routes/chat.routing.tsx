import { createFileRoute } from "@tanstack/react-router";
import { HubPage } from "@/components/hubs/page";
import { SectionCard, KpiCard, StatusPill, RiskBadge } from "@/components/enterprise/primitives";
import { Route as RouteIcon, Users, Hash, Sparkles } from "lucide-react";

export const Route = createFileRoute("/chat/routing")({
  head: () => ({ meta: [{ title: "Support — Smart Routing" }] }),
  component: RoutingPage,
});

const RULES = [
  { name: "Enterprise → Tier-1 pod",     match: "tier = Enterprise", cap: "5 concurrent", agents: 4, active: true },
  { name: "Spanish → ES desk",           match: "lang = ES",         cap: "3 concurrent", agents: 2, active: true },
  { name: "Billing → Finance queue",     match: "topic = billing",   cap: "8 concurrent", agents: 3, active: true },
  { name: "Compliance → Legal pod",      match: "tag = compliance",  cap: "2 concurrent", agents: 1, active: false },
];

const SHORTCUTS = [
  { key: "/greet",   text: "Hi {first_name}, thanks for reaching out — I've got this for you." },
  { key: "/wait",    text: "Could you give me 90 seconds while I check on this?" },
  { key: "/close",   text: "Anything else I can help with today? I'll close the ticket otherwise." },
  { key: "/refundOK",text: "Good news — your refund of {amount} is on the way. You'll see it within 3–5 business days." },
];

function RoutingPage() {
  return (
    <HubPage
      title="Smart Routing & Shortcuts"
      description="Concurrent caps, conditional routing, and AI-recommended text expansions."
      insights={[
        { title: "Recommend new shortcut", body: "Mia uses the exact same closing line in 86% of CSAT-5 tickets — promote to /miaClose.", confidence: 89, cta: "Add shortcut" },
        { title: "Compliance rule disabled", body: "5 compliance-tagged tickets routed to general queue last week — consider re-enabling.", confidence: 84 },
      ]}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Routing rules"     value={`${RULES.length}`} icon={RouteIcon} />
        <KpiCard label="Active agents"     value="14"   icon={Users} />
        <KpiCard label="Avg pickup time"   value="38s"  delta={-12} />
        <KpiCard label="Shortcut usage"    value="1.4k/wk" delta={9} icon={Hash} />
      </div>

      <SectionCard title="Routing rules">
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-muted-foreground border-b border-border">
            <tr>
              <th className="py-2 pr-3 font-medium">Rule</th>
              <th className="py-2 pr-3 font-medium">Match</th>
              <th className="py-2 pr-3 font-medium">Concurrency cap</th>
              <th className="py-2 pr-3 font-medium">Agents</th>
              <th className="py-2 pr-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {RULES.map((r) => (
              <tr key={r.name}>
                <td className="py-2.5 pr-3 font-medium">{r.name}</td>
                <td className="py-2.5 pr-3 text-xs"><code className="px-1.5 py-0.5 rounded font-mono" style={{ background: "var(--muted)" }}>{r.match}</code></td>
                <td className="py-2.5 pr-3 text-xs">{r.cap}</td>
                <td className="py-2.5 pr-3 text-xs">{r.agents}</td>
                <td className="py-2.5 pr-3"><StatusPill level={r.active ? "green" : "neutral"}>{r.active ? "Active" : "Disabled"}</StatusPill></td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>

      <SectionCard title="Text-expansion shortcuts" subtitle="Type a shortcut to insert the text">
        <ul className="space-y-2">
          {SHORTCUTS.map((s) => (
            <li key={s.key} className="rounded-md border border-border p-2.5 flex items-start gap-3">
              <code className="text-xs font-mono px-1.5 py-0.5 rounded shrink-0" style={{ background: "var(--muted)" }}>{s.key}</code>
              <span className="text-sm flex-1">{s.text}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 rounded-md border border-dashed border-border p-2.5 text-[11px] flex items-start gap-1.5">
          <Sparkles className="h-3 w-3 mt-0.5" style={{ color: "var(--primary)" }} />
          <span><span className="font-medium">Limnn AI:</span> /miaClose suggested — high-CSAT closing line used 86% by your top agent.</span>
          <RiskBadge confidence={89} />
        </div>
      </SectionCard>
    </HubPage>
  );
}
