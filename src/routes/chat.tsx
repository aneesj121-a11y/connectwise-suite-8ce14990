import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { StatusPill, RiskBadge, Avatar } from "@/components/enterprise/primitives";
import { TICKETS, hubInsights, type Ticket } from "@/lib/hubs-data";
import { Mail, MessageCircle, Globe, Phone, MessageSquare, Hash, Send, Sparkles, Paperclip } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const Route = createFileRoute("/chat")({
  head: () => ({ meta: [{ title: "Limnn Chat — Central Inbox" }] }),
  component: ChatPage,
});

const CHANNEL_ICON: Record<Ticket["channel"], LucideIcon> = {
  Email: Mail,
  WhatsApp: MessageCircle,
  Web: Globe,
  Voice: Phone,
  SMS: MessageSquare,
  Slack: Hash,
};

function ChatPage() {
  const [activeId, setActiveId] = useState(TICKETS[0].id);
  const active = TICKETS.find((t) => t.id === activeId)!;
  const insights = hubInsights("chat");

  return (
    <div className="h-[calc(100vh-3.5rem)] flex">
      {/* Ticket list */}
      <aside className="w-[340px] shrink-0 border-r border-border bg-card flex flex-col">
        <div className="px-4 py-3 border-b border-border">
          <div className="flex items-center justify-between">
            <h1 className="font-display text-base font-semibold">Inbox</h1>
            <span className="text-xs text-muted-foreground">{TICKETS.filter((t) => t.unread).length} unread</span>
          </div>
          <div className="mt-2 flex gap-1 text-[11px]">
            {["All", "Mine", "Mentions", "P1"].map((c, i) => (
              <button key={c} className={`px-2 py-1 rounded-md font-medium ${i === 0 ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>
                {c}
              </button>
            ))}
          </div>
        </div>
        <ul className="flex-1 overflow-y-auto">
          {TICKETS.map((t) => {
            const Icon = CHANNEL_ICON[t.channel];
            const sel = t.id === activeId;
            return (
              <li key={t.id}>
                <button
                  onClick={() => setActiveId(t.id)}
                  className={`w-full text-left px-4 py-3 border-b border-border ${sel ? "bg-muted" : "hover:bg-muted/40"}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-sm font-medium truncate flex-1">{t.customer}</span>
                    <StatusPill level={t.priority === "P1" ? "red" : t.priority === "P2" ? "yellow" : "neutral"}>{t.priority}</StatusPill>
                  </div>
                  <div className="text-xs font-medium truncate">{t.subject}</div>
                  <div className="text-[11px] text-muted-foreground truncate mt-0.5">{t.preview}</div>
                  <div className="mt-1.5 flex items-center justify-between text-[10px]">
                    <span className="text-muted-foreground">SLA · {t.sla}</span>
                    <span className="text-muted-foreground">{t.assignee}</span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* Active conversation */}
      <section className="flex-1 min-w-0 flex flex-col">
        <header className="px-6 py-3 border-b border-border bg-card">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-display text-base font-semibold">{active.subject}</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {active.customer} · {active.channel} · Assigned to {active.assignee}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <StatusPill level={active.sentiment === "neg" ? "red" : active.sentiment === "pos" ? "green" : "neutral"}>
                {active.sentiment === "neg" ? "Negative" : active.sentiment === "pos" ? "Positive" : "Neutral"}
              </StatusPill>
              <RiskBadge confidence={87} label="Intent" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 bg-background">
          <Bubble who={active.customer} when="9:14 AM" text={active.preview + " Could you advise?"} />
          <Bubble who="Limnn agent" when="9:16 AM" text="Hi — thanks for reaching out, looking into this now." me />
          <Bubble who={active.customer} when="9:22 AM" text="Appreciated. We're seeing this across 4 reps in EU." />
          <div className="rounded-lg border border-dashed border-border bg-card p-3 max-w-2xl">
            <div className="flex items-center gap-1.5 text-[11px] mb-1.5" style={{ color: "var(--primary)" }}>
              <Sparkles className="h-3 w-3" /> AI suggested reply · 92%
            </div>
            <p className="text-sm">
              We've identified a regional carrier degradation in EU-WEST. Failover is rolling out now — typical recovery 8–12 min. I'll send a status link and follow up within the hour.
            </p>
            <div className="mt-2 flex gap-1.5">
              <button className="text-[11px] px-2 py-1 rounded-md font-medium text-primary-foreground" style={{ background: "var(--primary)" }}>Use</button>
              <button className="text-[11px] px-2 py-1 rounded-md font-medium text-muted-foreground hover:bg-muted">Refine</button>
            </div>
          </div>
        </div>

        <div className="border-t border-border bg-card p-3">
          <div className="rounded-lg border border-border bg-background p-2 flex items-end gap-2">
            <button className="h-7 w-7 grid place-items-center text-muted-foreground hover:bg-muted rounded">
              <Paperclip className="h-3.5 w-3.5" />
            </button>
            <textarea rows={2} placeholder="Reply to customer…" className="flex-1 resize-none bg-transparent text-sm outline-none" />
            <button className="h-8 w-8 grid place-items-center rounded-md text-primary-foreground" style={{ background: "var(--primary)" }}>
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Customer context */}
      <aside className="w-[280px] shrink-0 border-l border-border bg-card overflow-y-auto p-4 space-y-4 hidden xl:block">
        <div>
          <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground mb-2">Customer</div>
          <div className="flex items-center gap-2">
            <Avatar name={active.customer} size={32} />
            <div className="min-w-0">
              <div className="text-sm font-medium truncate">{active.customer}</div>
              <div className="text-xs text-muted-foreground">Enterprise · ARR $504k</div>
            </div>
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground mb-2">AI insights</div>
          <ul className="space-y-2 text-xs">
            {insights.map((i) => (
              <li key={i.title} className="rounded-md border border-border p-2">
                <div className="font-medium">{i.title}</div>
                <div className="text-muted-foreground mt-0.5">{i.body}</div>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}

function Bubble({ who, when, text, me }: { who: string; when: string; text: string; me?: boolean }) {
  return (
    <div className={`flex gap-2 ${me ? "justify-end" : ""}`}>
      {!me && <Avatar name={who} size={26} />}
      <div className="max-w-2xl">
        <div className={`text-[11px] mb-1 ${me ? "text-right text-muted-foreground" : "text-muted-foreground"}`}>
          {who} · {when}
        </div>
        <div
          className="rounded-lg px-3 py-2 text-sm"
          style={{
            background: me ? "var(--primary)" : "var(--card)",
            color: me ? "var(--primary-foreground)" : "var(--foreground)",
            border: me ? "none" : "1px solid var(--border)",
          }}
        >
          {text}
        </div>
      </div>
    </div>
  );
}
