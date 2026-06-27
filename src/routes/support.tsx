import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { HubPage } from "@/components/hubs/page";
import { KpiCard, SectionCard, StatusPill, TrendSpark, Avatar } from "@/components/enterprise/primitives";
import { hubInsights } from "@/lib/hubs-data";
import {
  Inbox,
  Timer,
  CheckCircle2,
  Smile,
  Phone,
  Mail,
  MessageCircle,
  Users,
  TrendingUp,
} from "lucide-react";

export const Route = createFileRoute("/support")({
  head: () => ({ meta: [{ title: "Support Center — Dashboard" }] }),
  component: SupportDashboard,
});

type Role = "agent" | "manager";

const AGENT_KPIS = [
  { label: "My open tickets", value: "14", delta: -8, spark: [22, 20, 19, 17, 16, 15, 14], icon: Inbox },
  { label: "Avg response (mine)", value: "2m 12s", delta: -14, spark: [180, 170, 160, 150, 145, 138, 132], icon: Timer },
  { label: "Resolved today", value: "23", delta: 18, spark: [12, 14, 17, 19, 20, 22, 23], icon: CheckCircle2 },
  { label: "My CSAT", value: "4.8", delta: 4, spark: [4.5, 4.6, 4.6, 4.7, 4.7, 4.8, 4.8], icon: Smile },
];

const MANAGER_KPIS = [
  { label: "Team open tickets", value: "182", delta: -6, spark: [210, 205, 198, 192, 188, 185, 182], icon: Inbox },
  { label: "Team avg FRT", value: "3m 04s", delta: -11, spark: [220, 215, 205, 198, 192, 188, 184], icon: Timer },
  { label: "Resolved (today)", value: "318", delta: 12, spark: [240, 260, 275, 290, 300, 312, 318], icon: CheckCircle2 },
  { label: "Team CSAT", value: "4.6", delta: 2, spark: [4.4, 4.5, 4.5, 4.5, 4.6, 4.6, 4.6], icon: Smile },
];

const AGENTS = [
  { name: "Priya Mehta", open: 18, frt: "2m 04s", resolved: 31, csat: 4.9, status: "green" as const },
  { name: "Liam Chen", open: 21, frt: "3m 12s", resolved: 24, csat: 4.7, status: "green" as const },
  { name: "Sofia Alvarez", open: 27, frt: "4m 41s", resolved: 19, csat: 4.4, status: "yellow" as const },
  { name: "Marcus Okafor", open: 32, frt: "6m 18s", resolved: 14, csat: 4.1, status: "red" as const },
  { name: "Hana Tanaka", open: 16, frt: "2m 33s", resolved: 28, csat: 4.8, status: "green" as const },
];

const CHANNEL_MIX = [
  { ch: "Chat", icon: MessageCircle, count: 84, pct: 46 },
  { ch: "Email", icon: Mail, count: 62, pct: 34 },
  { ch: "Voice", icon: Phone, count: 36, pct: 20 },
];

function SupportDashboard() {
  const [role, setRole] = useState<Role>("manager");
  const kpis = role === "manager" ? MANAGER_KPIS : AGENT_KPIS;
  const insights = hubInsights("chat");

  return (
    <HubPage
      title="Support Center"
      description={role === "manager" ? "Team performance, SLA health, and queue load across all channels." : "Your queue, response health, and CSAT for today."}
      actions={
        <div className="inline-flex rounded-md border border-border bg-card p-0.5 text-xs">
          {(["agent", "manager"] as Role[]).map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className="px-3 py-1.5 rounded-[6px] font-medium capitalize"
              style={{
                background: role === r ? "var(--primary)" : "transparent",
                color: role === r ? "var(--primary-foreground)" : "var(--muted-foreground)",
              }}
            >
              {r === "agent" ? "Agent view" : "Manager view"}
            </button>
          ))}
        </div>
      }
      insights={insights}
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <KpiCard key={k.label} {...k} />
        ))}
      </div>

      {role === "manager" ? (
        <SectionCard
          title="Team performance"
          subtitle="Live agent load, response health, and CSAT"
          action={
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="h-3 w-3" /> {AGENTS.length} agents online
            </span>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[11px] uppercase tracking-wide text-muted-foreground border-b border-border">
                  <th className="text-left py-2 font-medium">Agent</th>
                  <th className="text-right py-2 font-medium">Open</th>
                  <th className="text-right py-2 font-medium">FRT</th>
                  <th className="text-right py-2 font-medium">Resolved</th>
                  <th className="text-right py-2 font-medium">CSAT</th>
                  <th className="text-right py-2 font-medium">Load</th>
                </tr>
              </thead>
              <tbody>
                {AGENTS.map((a) => (
                  <tr key={a.name} className="border-b border-border last:border-0">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <Avatar name={a.name} size={24} />
                        <span className="font-medium">{a.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-right font-mono">{a.open}</td>
                    <td className="py-3 text-right font-mono text-muted-foreground">{a.frt}</td>
                    <td className="py-3 text-right font-mono">{a.resolved}</td>
                    <td className="py-3 text-right font-mono">{a.csat}</td>
                    <td className="py-3 text-right">
                      <StatusPill level={a.status}>{a.status === "green" ? "Healthy" : a.status === "yellow" ? "Stretched" : "Overloaded"}</StatusPill>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      ) : (
        <SectionCard title="My day" subtitle="Personal pipeline & goals">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-border p-4">
              <div className="text-xs text-muted-foreground">Daily resolve goal</div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-display text-2xl font-semibold">23 / 30</span>
                <span className="text-xs text-[color:var(--success)]">77%</span>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full" style={{ width: "77%", background: "var(--primary)" }} />
              </div>
            </div>
            <div className="rounded-lg border border-border p-4">
              <div className="text-xs text-muted-foreground">Weekly CSAT trend</div>
              <div className="mt-1 flex items-end justify-between">
                <span className="font-display text-2xl font-semibold">4.8</span>
                <TrendSpark values={[4.4, 4.5, 4.5, 4.6, 4.7, 4.7, 4.8]} width={120} height={36} />
              </div>
            </div>
          </div>
        </SectionCard>
      )}

      <div className="grid lg:grid-cols-2 gap-4">
        <SectionCard title="Channel mix (today)" subtitle="Volume across omnichannel queue">
          <ul className="space-y-3">
            {CHANNEL_MIX.map((c) => (
              <li key={c.ch} className="flex items-center gap-3">
                <c.icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium w-16">{c.ch}</span>
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full" style={{ width: `${c.pct}%`, background: "var(--primary)" }} />
                </div>
                <span className="text-xs font-mono text-muted-foreground w-12 text-right">{c.count}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
        <SectionCard
          title="SLA breach watch"
          subtitle="Tickets at risk in the next hour"
          action={<span className="inline-flex items-center gap-1 text-xs" style={{ color: "var(--destructive)" }}><TrendingUp className="h-3 w-3" /> 4 escalating</span>}
        >
          <ul className="space-y-2.5 text-sm">
            {[
              { id: "#4821", customer: "Northwind Logistics", left: "12m", prio: "red" as const },
              { id: "#4807", customer: "Atlas Robotics", left: "28m", prio: "yellow" as const },
              { id: "#4799", customer: "Helix Health", left: "41m", prio: "yellow" as const },
              { id: "#4781", customer: "Vega Capital", left: "54m", prio: "yellow" as const },
            ].map((t) => (
              <li key={t.id} className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                <div>
                  <div className="font-mono text-[11px] text-muted-foreground">{t.id}</div>
                  <div className="font-medium">{t.customer}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{t.left} left</span>
                  <StatusPill level={t.prio}>{t.prio === "red" ? "Breach" : "Warning"}</StatusPill>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </HubPage>
  );
}
