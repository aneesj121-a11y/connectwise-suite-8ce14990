import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Mic,
  MicOff,
  Pause,
  PhoneOff,
  PhoneForwarded,
  Users,
  Grid3x3,
  Volume2,
  StickyNote,
  Sparkles,
  Building2,
  Mail,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Activity,
  Tag,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTeam, TEAMS, type Team } from "@/lib/team-context";

export const Route = createFileRoute("/call")({
  head: () => ({ meta: [{ title: "Active call — Limnn Dialer" }] }),
  component: CallScreen,
});

function CallScreen() {
  const { team, setInCall } = useTeam();
  const t = TEAMS[team];
  const [seconds, setSeconds] = useState(74);
  const [muted, setMuted] = useState(false);
  const [held, setHeld] = useState(false);
  const [disp, setDisp] = useState<string | null>(null);

  useEffect(() => {
    setInCall(true);
    const i = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(i);
  }, [setInCall]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className="container-page py-6">
      <div className="flex items-center justify-between mb-5">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to workspace
        </Link>
        <div className="flex items-center gap-2 text-xs">
          <span className="chip" style={{ background: "color-mix(in oklab, var(--success) 16%, transparent)", color: "var(--success)" }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--success)" }} /> Live
          </span>
          <span className="chip">Recording</span>
          <span className="chip">{t.label} call</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Center: caller + controls + transcript */}
        <section className="xl:col-span-8 space-y-5">
          {/* Caller card */}
          <div className="surface-card p-6 flex items-center gap-5">
            <div className="h-16 w-16 rounded-2xl grid place-items-center text-2xl font-display text-primary-foreground" style={{ background: t.accentVar }}>
              PP
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="font-display text-3xl tracking-tight">Pat Prospect</h1>
                <span className="chip">VP Engineering</span>
              </div>
              <div className="text-sm text-muted-foreground mt-0.5">
                Acme Corp · +1 (415) 555-0142 · San Francisco
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-3xl tabular-nums tracking-tight">{mm}:{ss}</div>
              <div className="text-[11px] text-muted-foreground uppercase tracking-wider mt-0.5">talk time</div>
            </div>
          </div>

          {/* Controls */}
          <div className="surface-card p-4">
            <div className="grid grid-cols-6 gap-2">
              <CtrlBtn icon={muted ? MicOff : Mic} label={muted ? "Unmute" : "Mute"} active={muted} onClick={() => setMuted(!muted)} />
              <CtrlBtn icon={Pause} label={held ? "Resume" : "Hold"} active={held} onClick={() => setHeld(!held)} />
              <CtrlBtn icon={PhoneForwarded} label="Transfer" />
              <CtrlBtn icon={Users} label="Conference" />
              <CtrlBtn icon={Grid3x3} label="Keypad" />
              <Link
                to="/"
                onClick={() => setInCall(false)}
                className="h-16 rounded-xl text-primary-foreground inline-flex flex-col items-center justify-center gap-1 text-xs font-medium"
                style={{ background: "var(--destructive)" }}
              >
                <PhoneOff className="h-5 w-5" /> End
              </Link>
            </div>
            <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><Volume2 className="h-3 w-3" /> MacBook Pro mic · output -3 dB</span>
              <span className="inline-flex items-center gap-1.5"><Activity className="h-3 w-3" /> Network excellent · MOS 4.4</span>
            </div>
          </div>

          {/* Live transcript */}
          <div className="surface-card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" style={{ color: t.accentVar }} />
                <h3 className="font-display text-xl">Live transcript</h3>
                <span className="chip">Auto-summary on</span>
              </div>
              <button className="text-xs text-muted-foreground hover:text-foreground">Copy</button>
            </div>
            <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
              {transcript.map((line, i) => (
                <div key={i} className="flex gap-3">
                  <div className="text-[10px] font-mono text-muted-foreground w-10 mt-0.5 shrink-0">{line.t}</div>
                  <div className="flex-1">
                    <div
                      className="text-[10px] uppercase tracking-wider mb-0.5"
                      style={{ color: line.who === "Agent" ? t.accentVar : "var(--muted-foreground)" }}
                    >
                      {line.who}
                    </div>
                    <div className="text-sm leading-snug">{line.text}</div>
                  </div>
                </div>
              ))}
              <div className="flex gap-3 opacity-60">
                <div className="text-[10px] font-mono text-muted-foreground w-10 mt-0.5 shrink-0">{mm}:{ss}</div>
                <div className="flex-1">
                  <div className="text-[10px] uppercase tracking-wider mb-0.5 text-muted-foreground">Listening…</div>
                  <div className="flex items-center gap-1">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50 animate-pulse"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Right rail */}
        <aside className="xl:col-span-4 space-y-5">
          {/* AI coach */}
          <div className="surface-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-7 w-7 rounded-lg grid place-items-center text-primary-foreground" style={{ background: t.accentVar }}>
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <div>
                <div className="text-sm font-semibold">AI coach</div>
                <div className="text-[11px] text-muted-foreground">Realtime · {sentimentLabel(team)}</div>
              </div>
              <div className="ml-auto flex items-center gap-1">
                <Dot color="var(--success)" /><Dot color="var(--success)" /><Dot color="var(--success)" /><Dot color="var(--warning)" /><Dot color="var(--muted-foreground)" />
              </div>
            </div>
            <ul className="space-y-2.5 text-sm">
              {coachTips(team).map((c, i) => (
                <li key={i} className="flex gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full mt-2 shrink-0" style={{ background: t.accentVar }} />
                  <span className="leading-snug">{c}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CRM context */}
          <div className="surface-card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-xl">Context</h3>
              <span className="chip">CRM synced</span>
            </div>
            <div className="space-y-3 text-sm">
              <Row icon={Building2} label="Account" value="Acme Corp · 412 employees" />
              {team === "sales" && <Row icon={Tag} label="Deal" value="Acme Pro · $24,000 · Discovery" />}
              {team === "support" && <Row icon={Tag} label="Ticket" value="#4498 · Login outage · P1" />}
              {team === "cs" && <Row icon={Tag} label="Account health" value="92 / 100 · Renews Jul 14" />}
              <Row icon={Mail} label="Last email" value="3 days ago · 'Re: Pilot timeline'" />
              <Row icon={Calendar} label="Last meeting" value="Jun 18 · Discovery call" />
              <Row icon={Activity} label="Product usage" value="Daily active · 14 seats" />
            </div>
            <button className="mt-4 w-full h-9 rounded-md border border-border text-xs font-medium hover:bg-accent inline-flex items-center justify-center gap-1.5">
              Open full record <ChevronRight className="h-3 w-3" />
            </button>
          </div>

          {/* Disposition + cadence */}
          <div className="surface-card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-xl">Wrap up</h3>
              <span className="text-[11px] text-muted-foreground">Required before next call</span>
            </div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">Disposition</div>
            <div className="grid grid-cols-2 gap-1.5">
              {dispositions(team).map((d) => (
                <button
                  key={d}
                  onClick={() => setDisp(d)}
                  className={[
                    "h-9 rounded-md border text-xs font-medium transition",
                    disp === d
                      ? "border-foreground bg-foreground text-background"
                      : "border-border hover:bg-accent",
                  ].join(" ")}
                >
                  {d}
                </button>
              ))}
            </div>

            <div className="text-[11px] uppercase tracking-wider text-muted-foreground mt-4 mb-2">Quick notes</div>
            <div className="relative">
              <StickyNote className="absolute left-3 top-3 h-3.5 w-3.5 text-muted-foreground" />
              <textarea
                rows={3}
                placeholder="Auto-filled from transcript on hangup…"
                className="w-full rounded-md border border-border bg-card pl-9 pr-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 resize-none"
              />
            </div>

            <div className="text-[11px] uppercase tracking-wider text-muted-foreground mt-4 mb-2">Next step</div>
            <div className="surface-card p-3 flex items-center gap-2.5" style={{ borderColor: "var(--border-strong)" }}>
              <CheckCircle2 className="h-4 w-4" style={{ color: t.accentVar }} />
              <div className="flex-1 text-sm">
                {nextStep(team)} <span className="text-muted-foreground">· suggested</span>
              </div>
              <button className="text-xs font-medium" style={{ color: t.accentVar }}>Schedule</button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

const transcript = [
  { t: "00:02", who: "Agent", text: "Hi Pat — thanks for taking the call. Is now still a good time for fifteen minutes?" },
  { t: "00:07", who: "Pat Prospect", text: "Yes, perfect. I've got the team in the room actually." },
  { t: "00:14", who: "Agent", text: "Amazing. Last time we left off, you mentioned routing inbound was the biggest pain. Has that changed?" },
  { t: "00:22", who: "Pat Prospect", text: "It's gotten worse. We onboarded two new reps and the queue is a mess." },
  { t: "00:31", who: "Agent", text: "Got it. Let me walk through how Limnn handles skills-based routing and then we can map it to your setup." },
  { t: "00:48", who: "Pat Prospect", text: "Before that — what's pricing look like for fifty seats with the AI add-on?" },
];

function coachTips(team: Team) {
  if (team === "sales")
    return [
      "Buyer asked about pricing — pivot to value first, then send the official quote in chat.",
      "Mention the Globex case study — same industry, similar pain.",
      "You're talking 64% of the time. Aim for closer to 45%.",
    ];
  if (team === "support")
    return [
      "Caller is Enterprise SSO. Escalation path: T2 — Sam B.",
      "Known issue: SSO outage EU-WEST since 14:02 UTC.",
      "Suggested macro applied. Confirm email on file.",
    ];
  return [
    "Mention upcoming Q3 features they requested in last QBR.",
    "Health dropped — ask about the 3 features with declining usage.",
    "Pre-fill renewal at 12% uplift (peer benchmark).",
  ];
}

function dispositions(team: Team) {
  if (team === "sales")
    return ["Connected · interested", "Meeting booked", "Not interested", "Voicemail", "Wrong number", "Callback"];
  if (team === "support")
    return ["Resolved", "Workaround given", "Escalated", "Awaiting customer", "Bug filed", "Transfer"];
  return ["Health check ✓", "Expansion lead", "At-risk flagged", "Renewal commit", "QBR scheduled", "Churn risk"];
}

function nextStep(team: Team) {
  if (team === "sales") return "Cadence step 4 — send pricing one-pager in 1 day";
  if (team === "support") return "Follow-up call once SSO outage resolves";
  return "Internal QBR prep + send pre-read by Friday";
}

function sentimentLabel(team: Team) {
  if (team === "support") return "Caller frustrated, easing";
  return "Engaged · positive";
}

function Row({ icon: Icon, label, value }: { icon: typeof Mic; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="h-3.5 w-3.5 mt-0.5 text-muted-foreground shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="text-sm">{value}</div>
      </div>
    </div>
  );
}

function Dot({ color }: { color: string }) {
  return <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />;
}

function CtrlBtn({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: typeof Mic;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "h-16 rounded-xl border flex flex-col items-center justify-center gap-1 text-[10px] uppercase tracking-wider transition",
        active
          ? "bg-foreground text-background border-foreground"
          : "border-border bg-card hover:bg-accent text-foreground",
      ].join(" ")}
    >
      <Icon className="h-5 w-5" />
      {label}
    </button>
  );
}
