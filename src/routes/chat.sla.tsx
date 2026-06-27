import { createFileRoute } from "@tanstack/react-router";
import { HubPage } from "@/components/hubs/page";
import { SectionCard, KpiCard, StatusPill, RiskBadge } from "@/components/enterprise/primitives";
import { Timer, AlertTriangle, Shuffle } from "lucide-react";

export const Route = createFileRoute("/chat/sla")({
  head: () => ({ meta: [{ title: "Support — SLA Triage" }] }),
  component: SlaPage,
});

const QUEUE = [
  { ticket: "T-4821", acct: "Vanta Logistics", tier: "Enterprise", priority: "P1", breach: 12,  channel: "WhatsApp", agent: "Sam D." },
  { ticket: "T-4819", acct: "Helios Health",   tier: "Enterprise", priority: "P1", breach: 27,  channel: "Email",    agent: "Mia P." },
  { ticket: "T-4815", acct: "Acme Corp",       tier: "Growth",     priority: "P2", breach: 42,  channel: "Voice",    agent: "Alex R." },
  { ticket: "T-4811", acct: "Northwind Bank",  tier: "Enterprise", priority: "P2", breach: 58,  channel: "Web",      agent: "Mia P." },
  { ticket: "T-4805", acct: "Pioneer Mutual",  tier: "Enterprise", priority: "P2", breach: 134, channel: "Email",    agent: "Jordan K." },
  { ticket: "T-4802", acct: "Bluebird Media",  tier: "Growth",     priority: "P3", breach: 280, channel: "Slack",    agent: "Alex R." },
];

function SlaPage() {
  const breaching = QUEUE.filter((q) => q.breach < 60).length;
  return (
    <HubPage
      title="SLA Triage"
      description="Live SLA risk monitor with predictive breach detection and auto-route suggestions."
      insights={[
        { title: "2 tickets will breach <30 min", body: "Vanta + Helios both P1 enterprise. Auto-route to on-call duo recommended.", confidence: 95, cta: "Reassign" },
        { title: "Tier-1 saturation", body: "Mia is at 6/5 concurrent Enterprise tickets — shift 2 to Jordan to balance.", confidence: 88, cta: "Rebalance" },
      ]}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Active tickets"   value={`${QUEUE.length}`} icon={Timer} />
        <KpiCard label="Breaching <1h"    value={`${breaching}`} delta={2} icon={AlertTriangle} />
        <KpiCard label="P1 in queue"      value="2" />
        <KpiCard label="Median TTR"       value="38m" delta={-12} />
      </div>

      <SectionCard title="SLA queue" subtitle="Sorted by minutes-to-breach">
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-muted-foreground border-b border-border">
            <tr>
              <th className="py-2 pr-3 font-medium">Ticket</th>
              <th className="py-2 pr-3 font-medium">Account / tier</th>
              <th className="py-2 pr-3 font-medium">Priority</th>
              <th className="py-2 pr-3 font-medium">Channel</th>
              <th className="py-2 pr-3 font-medium">Agent</th>
              <th className="py-2 pr-3 font-medium">Breach risk</th>
              <th className="py-2 pr-3 font-medium text-right">SLA left</th>
              <th className="py-2 pr-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {QUEUE.sort((a,b)=>a.breach-b.breach).map((q) => {
              const level = q.breach < 30 ? "red" : q.breach < 60 ? "yellow" : "green";
              return (
                <tr key={q.ticket} className="hover:bg-muted/40">
                  <td className="py-2.5 pr-3 font-mono text-xs">{q.ticket}</td>
                  <td className="py-2.5 pr-3"><div className="text-sm font-medium">{q.acct}</div><div className="text-[11px] text-muted-foreground">{q.tier}</div></td>
                  <td className="py-2.5 pr-3"><StatusPill level={q.priority === "P1" ? "red" : q.priority === "P2" ? "yellow" : "neutral"}>{q.priority}</StatusPill></td>
                  <td className="py-2.5 pr-3 text-xs">{q.channel}</td>
                  <td className="py-2.5 pr-3 text-xs">{q.agent}</td>
                  <td className="py-2.5 pr-3"><RiskBadge confidence={level === "red" ? 95 : level === "yellow" ? 78 : 30} label="Breach" /></td>
                  <td className="py-2.5 pr-3 text-right font-mono text-xs">{q.breach}m</td>
                  <td className="py-2.5 pr-3 text-right">
                    <button className="inline-flex items-center gap-1 text-xs font-medium" style={{ color: "var(--primary)" }}>
                      <Shuffle className="h-3 w-3" /> Reassign
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </SectionCard>
    </HubPage>
  );
}
