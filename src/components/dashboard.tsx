import { useTeam, TEAMS, type Team } from "@/lib/team-context";
import {
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
  TrendingUp,
  Clock,
  Target,
  Headphones,
  AlertTriangle,
  HeartPulse,
  HeartHandshake,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Circle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function Dashboard() {
  const { team } = useTeam();
  const t = TEAMS[team];

  const greeting = () => {
    const h = new Date().getHours();
    return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  };

  return (
    <div className="container-page py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div
            className="chip mb-3"
            style={{
              background: "color-mix(in oklab, " + t.accentVar + " 14%, transparent)",
              color: t.accentVar,
            }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: t.accentVar }} />
            {t.label} workspace
          </div>
          <h1 className="font-serif text-5xl text-foreground leading-tight">
            {greeting()}, Anees.
          </h1>
          <p className="text-muted-foreground mt-1">{teamGreeting(team)}</p>
        </div>
        <div className="flex gap-2">
          <button className="h-10 px-4 rounded-lg bg-ink text-ink-foreground text-sm font-medium inline-flex items-center gap-2">
            {team === "sales" ? "Start power dial" : team === "support" ? "Join queue" : "Open playbook"}
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
          <button className="h-10 px-4 rounded-lg border border-border bg-card text-sm font-medium hover:border-border-strong">
            {team === "sales" ? "Cadence builder" : team === "support" ? "Routing rules" : "Health scoring"}
          </button>
        </div>
      </div>

      {/* KPIs */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis(team).map((k) => (
          <KpiCard key={k.label} {...k} accent={t.accentVar} />
        ))}
      </section>

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 space-y-5">
          {team === "sales" && <SalesPipelineCard />}
          {team === "support" && <SupportQueueCard />}
          {team === "cs" && <AccountsHealthCard />}

          <ActivityFeed team={team} />
        </div>

        <div className="space-y-5">
          <AiCoach team={team} />
          <TasksCard team={team} />
          <SystemHealth />
        </div>
      </div>
    </div>
  );
}

function teamGreeting(team: Team) {
  if (team === "sales") return "5 cadences running. Queue is loaded for power dial.";
  if (team === "support") return "12 calls waiting. Avg wait 38s — under SLA.";
  return "4 renewals this week. 2 accounts need a check-in.";
}

type Kpi = { label: string; value: string; sub?: string; icon: LucideIcon; tone?: "ok" | "warn" | "bad" };

function kpis(team: Team): Kpi[] {
  if (team === "sales")
    return [
      { label: "Dials today", value: "147", sub: "+23 vs avg", icon: PhoneOutgoing, tone: "ok" },
      { label: "Connect rate", value: "32%", sub: "industry 22%", icon: Target, tone: "ok" },
      { label: "Talk time", value: "3h 14m", icon: Clock },
      { label: "Meetings booked", value: "8", sub: "goal 10", icon: TrendingUp },
      { label: "Pipeline added", value: "$84.2k", icon: TrendingUp, tone: "ok" },
      { label: "Cadences", value: "5", sub: "active", icon: Sparkles },
    ];
  if (team === "support")
    return [
      { label: "In queue", value: "12", sub: "3 priority", icon: PhoneIncoming, tone: "warn" },
      { label: "Avg wait", value: "38s", sub: "SLA 60s", icon: Clock, tone: "ok" },
      { label: "Answered", value: "94%", icon: Target, tone: "ok" },
      { label: "AHT", value: "5m 12s", icon: Headphones },
      { label: "Tickets open", value: "47", sub: "9 SLA risk", icon: AlertTriangle, tone: "warn" },
      { label: "CSAT", value: "4.7", sub: "/ 5.0", icon: HeartPulse, tone: "ok" },
    ];
  return [
    { label: "Active accounts", value: "128", icon: HeartHandshake },
    { label: "At risk", value: "6", sub: "needs touch", icon: AlertTriangle, tone: "bad" },
    { label: "Renewals 30d", value: "$317k", icon: TrendingUp },
    { label: "Health avg", value: "82", sub: "/ 100", icon: HeartPulse, tone: "ok" },
    { label: "QBRs this wk", value: "4", icon: Clock },
    { label: "NPS", value: "+54", sub: "+6 mo/mo", icon: TrendingUp, tone: "ok" },
  ];
}

function KpiCard({ label, value, sub, icon: Icon, tone, accent }: Kpi & { accent: string }) {
  const toneClass =
    tone === "ok"
      ? "text-[color:var(--success)]"
      : tone === "warn"
      ? "text-[color:var(--warning)]"
      : tone === "bad"
      ? "text-[color:var(--destructive)]"
      : "text-muted-foreground";
  return (
    <div className="surface-card p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <Icon className="h-3.5 w-3.5" style={{ color: accent }} />
      </div>
      <div className="mt-2 font-serif text-3xl tracking-tight">{value}</div>
      {sub && <div className={["text-[11px] mt-0.5", toneClass].join(" ")}>{sub}</div>}
    </div>
  );
}

/* ---------- Team-specific main cards ---------- */

function SalesPipelineCard() {
  const rows = [
    { name: "Acme Corp", contact: "Pat Prospect", stage: "Discovery", value: "$24.0k", next: "Demo · today 3:00pm" },
    { name: "Globex", contact: "Sam Vendor", stage: "Proposal", value: "$48.5k", next: "Follow-up call" },
    { name: "Initech", contact: "Dana Boss", stage: "Negotiation", value: "$112.0k", next: "Send redlines" },
    { name: "Umbrella", contact: "Ravi Lee", stage: "Discovery", value: "$18.0k", next: "Cadence: LinkedIn touch" },
    { name: "Hooli", contact: "Jess Park", stage: "Qualified", value: "$32.0k", next: "Intro call · 6/26" },
  ];
  return (
    <Card title="Live pipeline" subtitle="Deals attached to your active cadences" action="Open pipeline →">
      <div className="divide-y divide-border">
        {rows.map((r) => (
          <div key={r.name} className="py-3 grid grid-cols-12 gap-3 items-center">
            <div className="col-span-4">
              <div className="font-medium text-sm">{r.name}</div>
              <div className="text-xs text-muted-foreground">{r.contact}</div>
            </div>
            <div className="col-span-2">
              <span className="chip">{r.stage}</span>
            </div>
            <div className="col-span-2 font-mono text-sm">{r.value}</div>
            <div className="col-span-3 text-xs text-muted-foreground truncate">{r.next}</div>
            <div className="col-span-1 text-right">
              <Link to="/call" className="text-xs font-medium" style={{ color: "var(--sales)" }}>
                Call →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function SupportQueueCard() {
  const rows = [
    { from: "+1 415 555 0142", account: "Acme Corp · Pro", waiting: "00:42", priority: "P1", topic: "Login outage", tickets: 2 },
    { from: "+44 20 7946 0011", account: "Globex · Ent", waiting: "00:31", priority: "P2", topic: "Billing issue", tickets: 1 },
    { from: "+1 312 555 0190", account: "Hooli · Pro", waiting: "00:22", priority: "P2", topic: "API errors", tickets: 0 },
    { from: "+1 646 555 0123", account: "Initech · Starter", waiting: "00:18", priority: "P3", topic: "How-to question", tickets: 0 },
    { from: "+33 1 70 36 0011", account: "Umbrella · Ent", waiting: "00:09", priority: "P1", topic: "Webhook failure", tickets: 1 },
  ];
  const pColor = (p: string) =>
    p === "P1" ? "var(--destructive)" : p === "P2" ? "var(--warning)" : "var(--muted-foreground)";
  return (
    <Card title="Live inbound queue" subtitle="Smart routed by skill & priority" action="Open queue →">
      <div className="divide-y divide-border">
        {rows.map((r) => (
          <div key={r.from} className="py-3 grid grid-cols-12 gap-3 items-center">
            <div className="col-span-1">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded text-primary-foreground" style={{ background: pColor(r.priority) }}>
                {r.priority}
              </span>
            </div>
            <div className="col-span-4">
              <div className="font-medium text-sm">{r.account}</div>
              <div className="text-xs text-muted-foreground font-mono">{r.from}</div>
            </div>
            <div className="col-span-3 text-sm">{r.topic}</div>
            <div className="col-span-2 text-xs text-muted-foreground">{r.tickets} open ticket{r.tickets !== 1 && "s"}</div>
            <div className="col-span-1 font-mono text-sm tabular-nums">{r.waiting}</div>
            <div className="col-span-1 text-right">
              <Link to="/call" className="text-xs font-medium" style={{ color: "var(--support)" }}>
                Pick up →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function AccountsHealthCard() {
  const rows = [
    { name: "Acme Corp", arr: "$84k", health: 92, trend: "up", renewal: "Jul 14", owner: "You" },
    { name: "Globex", arr: "$120k", health: 64, trend: "down", renewal: "Jul 02", owner: "You" },
    { name: "Initech", arr: "$48k", health: 38, trend: "down", renewal: "Jun 30", owner: "You" },
    { name: "Umbrella", arr: "$210k", health: 88, trend: "flat", renewal: "Aug 11", owner: "Mia" },
    { name: "Hooli", arr: "$56k", health: 71, trend: "up", renewal: "Sep 05", owner: "You" },
  ];
  return (
    <Card title="Accounts to touch" subtitle="Sorted by renewal risk × ARR" action="All accounts →">
      <div className="divide-y divide-border">
        {rows.map((r) => (
          <div key={r.name} className="py-3 grid grid-cols-12 gap-3 items-center">
            <div className="col-span-3">
              <div className="font-medium text-sm">{r.name}</div>
              <div className="text-xs text-muted-foreground">Owner · {r.owner}</div>
            </div>
            <div className="col-span-2 font-mono text-sm">{r.arr}</div>
            <div className="col-span-4 flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${r.health}%`,
                    background:
                      r.health >= 80 ? "var(--success)" : r.health >= 60 ? "var(--warning)" : "var(--destructive)",
                  }}
                />
              </div>
              <span className="text-xs font-medium w-7 text-right">{r.health}</span>
            </div>
            <div className="col-span-2 text-xs text-muted-foreground">Renews {r.renewal}</div>
            <div className="col-span-1 text-right">
              <Link to="/call" className="text-xs font-medium" style={{ color: "var(--cs)" }}>
                Call →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ---------- Side cards ---------- */

function AiCoach({ team }: { team: Team }) {
  const t = TEAMS[team];
  const tips = {
    sales: [
      "3 leads opened pricing page in last 24h — call them first.",
      "Best connect window today: 4–5pm PT (74% answer rate).",
      "Acme Corp matches your Globex win — reuse that deck.",
    ],
    support: [
      "Spike of login issues from EU region — likely SSO outage.",
      "Suggested macro: 'Webhook retry policy' for Umbrella.",
      "2 P1 callers are enterprise — auto-prioritized.",
    ],
    cs: [
      "Initech health dropped 14 points — usage down across 3 features.",
      "Globex eligible for expansion: 92% seat utilization.",
      "Draft QBR for Acme is ready to review.",
    ],
  }[team];

  return (
    <div className="surface-card p-5">
      <div className="flex items-center gap-2">
        <div className="h-7 w-7 rounded-lg grid place-items-center text-primary-foreground" style={{ background: t.accentVar }}>
          <Sparkles className="h-3.5 w-3.5" />
        </div>
        <div>
          <div className="text-sm font-semibold">Limnn AI coach</div>
          <div className="text-[11px] text-muted-foreground">Live signals for {t.label.toLowerCase()}</div>
        </div>
      </div>
      <ul className="mt-4 space-y-2.5">
        {tips.map((tip, i) => (
          <li key={i} className="flex gap-2.5 text-sm">
            <span className="h-1.5 w-1.5 rounded-full mt-1.5 shrink-0" style={{ background: t.accentVar }} />
            <span className="text-foreground/90 leading-snug">{tip}</span>
          </li>
        ))}
      </ul>
      <button className="mt-4 w-full h-9 rounded-md border border-border text-xs font-medium hover:bg-accent">
        Ask the AI →
      </button>
    </div>
  );
}

function TasksCard({ team }: { team: Team }) {
  const tasks = {
    sales: [
      { t: "Cadence: LinkedIn touch — Umbrella pilot", tag: "Cadence", due: "Today" },
      { t: "Call Pat Prospect re: intro", tag: "Cadence", due: "Today" },
      { t: "Send Acme proposal v3", tag: null, due: "Tomorrow" },
      { t: "Prep Q3 board deck", tag: null, due: "Fri" },
    ],
    support: [
      { t: "Follow up: Globex billing case #4421", tag: "Ticket", due: "Today" },
      { t: "Review on-call rotation", tag: null, due: "Today" },
      { t: "Macro audit for Q3", tag: null, due: "Fri" },
    ],
    cs: [
      { t: "Initech save call — book today", tag: "Risk", due: "Today" },
      { t: "Send Acme QBR pre-read", tag: "QBR", due: "Tomorrow" },
      { t: "Renewal proposal — Globex", tag: "Renewal", due: "6/30" },
    ],
  }[team];

  return (
    <div className="surface-card p-5">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold">My tasks</div>
        <button className="text-xs text-muted-foreground hover:text-foreground">All →</button>
      </div>
      <ul className="mt-3 space-y-2">
        {tasks.map((task, i) => (
          <li key={i} className="flex items-center gap-2.5 text-sm py-1.5">
            <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="flex-1 truncate">{task.t}</span>
            {task.tag && <span className="chip">{task.tag}</span>}
            <span className="text-xs text-muted-foreground font-mono">{task.due}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SystemHealth() {
  const items = [
    { l: "Voice trunk", v: "OK" },
    { l: "AI transcription", v: "OK" },
    { l: "CRM sync", v: "OK" },
  ];
  return (
    <div className="surface-card p-5">
      <div className="text-sm font-semibold mb-3">System health</div>
      <ul className="space-y-2">
        {items.map((it) => (
          <li key={it.l} className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{it.l}</span>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[color:var(--success)]">
              <CheckCircle2 className="h-3.5 w-3.5" /> {it.v}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ActivityFeed({ team }: { team: Team }) {
  const items =
    team === "sales"
      ? [
          { who: "Pat Prospect (Acme)", what: "answered your call", when: "12m ago", outcome: "Booked demo" },
          { who: "Sam Vendor (Globex)", what: "replied to your voicemail", when: "1h ago", outcome: "Wants pricing" },
          { who: "Cadence", what: "moved 8 leads to Step 3", when: "2h ago" },
        ]
      : team === "support"
      ? [
          { who: "Jess (Hooli)", what: "called back", when: "5m ago", outcome: "Resolved" },
          { who: "Ticket #4421", what: "escalated to T2", when: "22m ago" },
          { who: "Macro", what: "auto-applied to 14 cases", when: "1h ago" },
        ]
      : [
          { who: "Initech", what: "missed scheduled check-in", when: "30m ago", outcome: "Health -8" },
          { who: "Acme renewal", what: "moved to commit", when: "2h ago" },
          { who: "Globex", what: "logged into product 4x today", when: "3h ago" },
        ];
  return (
    <Card title="Recent activity" subtitle="Cross-channel timeline">
      <ul className="divide-y divide-border">
        {items.map((it, i) => (
          <li key={i} className="py-3 flex items-center gap-3 text-sm">
            <span className="h-8 w-8 rounded-full bg-accent grid place-items-center text-xs font-medium">
              {it.who.split(" ")[0][0]}
            </span>
            <div className="flex-1 min-w-0">
              <span className="font-medium">{it.who}</span>{" "}
              <span className="text-muted-foreground">{it.what}</span>
            </div>
            {it.outcome && <span className="chip">{it.outcome}</span>}
            <span className="text-xs text-muted-foreground w-16 text-right font-mono">{it.when}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function Card({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="surface-card p-5">
      <div className="flex items-end justify-between mb-3">
        <div>
          <h3 className="font-serif text-2xl tracking-tight">{title}</h3>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        {action && (
          <button className="text-xs font-medium text-muted-foreground hover:text-foreground">{action}</button>
        )}
      </div>
      {children}
    </section>
  );
}
