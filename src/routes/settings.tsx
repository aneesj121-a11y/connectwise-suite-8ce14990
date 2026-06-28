import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  User, Bell, Palette, Shield, KeyRound, Plug, Phone, Languages, Keyboard,
  Eye, Headphones, Workflow, Users2, Download, LifeBuoy, ChevronRight, Search,
  Sparkles, Lock, Smartphone, MessageSquare, Mail, Calendar, Clock, ExternalLink,
} from "lucide-react";
import { useTeam, roleAtLeast, type Role } from "@/lib/team-context";
import { ProfileModal } from "@/components/profile-modal";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

const ACCENT = "#2C69CF";

type SectionId =
  | "profile" | "notifications" | "appearance" | "language" | "shortcuts"
  | "accessibility" | "calls" | "messaging" | "calendar" | "ai"
  | "security" | "sessions" | "apiKeys" | "integrations"
  | "team" | "automations" | "dataExport" | "support";

type Section = {
  id: SectionId;
  label: string;
  icon: any;
  minRole: Role;
  group: "Personal" | "Workspace" | "Account" | "Help";
  desc: string;
};

const SECTIONS: Section[] = [
  { id: "profile",       label: "Profile & Identity",  icon: User,        minRole: "agent",   group: "Personal",  desc: "Name, title, avatar, availability." },
  { id: "notifications", label: "Notifications",       icon: Bell,        minRole: "agent",   group: "Personal",  desc: "Channels, mentions, quiet hours, digests." },
  { id: "appearance",    label: "Appearance",          icon: Palette,     minRole: "agent",   group: "Personal",  desc: "Theme, density, sidebar behavior." },
  { id: "language",      label: "Language & Region",   icon: Languages,   minRole: "agent",   group: "Personal",  desc: "Language, time zone, date format." },
  { id: "shortcuts",     label: "Keyboard Shortcuts",  icon: Keyboard,    minRole: "agent",   group: "Personal",  desc: "Command palette and quick actions." },
  { id: "accessibility", label: "Accessibility",       icon: Eye,         minRole: "agent",   group: "Personal",  desc: "Motion, contrast, screen reader hints." },

  { id: "calls",         label: "Calls & Dialer",      icon: Phone,       minRole: "agent",   group: "Workspace", desc: "Devices, dispositions, voicemail." },
  { id: "messaging",     label: "Threads & Messaging", icon: MessageSquare, minRole: "agent", group: "Workspace", desc: "Read receipts, thread defaults, drafts." },
  { id: "calendar",      label: "Calendar Sync",       icon: Calendar,    minRole: "agent",   group: "Workspace", desc: "Google / Outlook sync and booking links." },
  { id: "ai",            label: "Limnn AI Preferences", icon: Sparkles,   minRole: "agent",   group: "Workspace", desc: "Copilot tone, summaries, autopilot scope." },
  { id: "automations",   label: "My Automations",      icon: Workflow,    minRole: "manager", group: "Workspace", desc: "Personal triggers and saved playbooks." },
  { id: "team",          label: "Team Preferences",    icon: Users2,      minRole: "manager", group: "Workspace", desc: "Defaults you set for direct reports." },

  { id: "security",      label: "Password & 2FA",      icon: Lock,        minRole: "agent",   group: "Account",   desc: "Password, MFA, recovery codes." },
  { id: "sessions",      label: "Active Sessions",     icon: Smartphone,  minRole: "agent",   group: "Account",   desc: "Devices signed into your account." },
  { id: "apiKeys",       label: "Personal API Tokens", icon: KeyRound,    minRole: "manager", group: "Account",   desc: "Scoped tokens for personal scripts." },
  { id: "integrations",  label: "Connected Apps",      icon: Plug,        minRole: "agent",   group: "Account",   desc: "Authorize / revoke third-party apps." },
  { id: "dataExport",    label: "Data & Privacy",      icon: Download,    minRole: "agent",   group: "Account",   desc: "Export your data, manage privacy." },

  { id: "support",       label: "Help & Support",      icon: LifeBuoy,    minRole: "agent",   group: "Help",      desc: "Contact support, status, docs." },
];

function SettingsPage() {
  const { role } = useTeam();
  const [active, setActive] = useState<SectionId>("profile");
  const [q, setQ] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);

  const visible = useMemo(
    () => SECTIONS.filter((s) => roleAtLeast(role, s.minRole) && (q ? (s.label + s.desc).toLowerCase().includes(q.toLowerCase()) : true)),
    [role, q]
  );
  const grouped = useMemo(() => {
    const g: Record<string, Section[]> = {};
    visible.forEach((s) => { (g[s.group] ||= []).push(s); });
    return g;
  }, [visible]);

  const current = SECTIONS.find((s) => s.id === active) ?? SECTIONS[0];
  const canSeeCurrent = roleAtLeast(role, current.minRole);

  return (
    <div className="min-h-[calc(100vh-56px)]" style={{ fontFamily: "Poppins, sans-serif" }}>
      <div className="max-w-[1200px] mx-auto px-5 py-6">
        {/* Header */}
        <div className="flex items-end justify-between mb-5">
          <div>
            <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Account</div>
            <h1 className="text-[22px] font-semibold mt-0.5">Settings</h1>
            <p className="text-[12.5px] text-muted-foreground mt-0.5">
              Personal preferences and workspace controls — items shown match your role.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 text-[11px] px-2.5 py-1 rounded-full border border-border bg-card">
            <Shield className="h-3 w-3" style={{ color: ACCENT }} />
            <span className="capitalize">Role: <b className="font-semibold">{role}</b></span>
            {!roleAtLeast(role, "admin") && (
              <Link to="/admin" className="ml-1 text-muted-foreground hover:underline inline-flex items-center gap-0.5">
                Admin Center <ExternalLink className="h-2.5 w-2.5" />
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-[260px_1fr] gap-5">
          {/* Left rail */}
          <aside className="rounded-xl border border-border bg-card p-2.5 h-fit sticky top-4">
            <div className="relative mb-2">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search settings…"
                className="w-full h-8 pl-7 pr-2 text-[12px] rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
            </div>
            {Object.entries(grouped).map(([group, items]) => (
              <div key={group} className="mb-2">
                <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground px-2 py-1.5">{group}</div>
                <div className="flex flex-col">
                  {items.map((s) => {
                    const A = s.icon;
                    const on = active === s.id;
                    return (
                      <button
                        key={s.id}
                        onClick={() => setActive(s.id)}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-md text-[12.5px] text-left transition"
                        style={{
                          background: on ? "color-mix(in oklab, #2C69CF 12%, transparent)" : "transparent",
                          color: on ? ACCENT : "hsl(var(--foreground))",
                          fontWeight: on ? 600 : 500,
                        }}
                      >
                        <A className="h-3.5 w-3.5" />
                        <span className="flex-1 truncate">{s.label}</span>
                        {on && <ChevronRight className="h-3 w-3" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </aside>

          {/* Content */}
          <main className="rounded-xl border border-border bg-card p-6 min-w-0">
            {!canSeeCurrent ? (
              <Locked />
            ) : (
              <SectionRouter id={current.id} onEditProfile={() => setProfileOpen(true)} />
            )}
          </main>
        </div>
      </div>

      <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
    </div>
  );
}

function SectionHeader({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3 mb-5 pb-4 border-b border-border">
      <div className="h-9 w-9 grid place-items-center rounded-md" style={{ background: "color-mix(in oklab, #2C69CF 12%, transparent)", color: ACCENT }}>
        <Icon className="h-4.5 w-4.5" />
      </div>
      <div>
        <h2 className="text-[16px] font-semibold">{title}</h2>
        <p className="text-[12.5px] text-muted-foreground mt-0.5">{desc}</p>
      </div>
    </div>
  );
}

function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[1fr_280px] gap-4 py-3 border-b border-border/60 last:border-0">
      <div>
        <div className="text-[13px] font-medium">{label}</div>
        {hint && <div className="text-[11.5px] text-muted-foreground mt-0.5">{hint}</div>}
      </div>
      <div className="flex items-center justify-end">{children}</div>
    </div>
  );
}

function Toggle({ defaultOn = false }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      onClick={() => setOn(!on)}
      className="h-5 w-9 rounded-full transition relative"
      style={{ background: on ? ACCENT : "hsl(var(--muted))" }}
    >
      <span className="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all" style={{ left: on ? "18px" : "2px" }} />
    </button>
  );
}

const inputCls = "h-8 px-2.5 rounded-md border border-border bg-background text-[12.5px] outline-none focus:ring-2 focus:ring-ring/30 min-w-[200px]";

function SectionRouter({ id, onEditProfile }: { id: SectionId; onEditProfile: () => void }) {
  switch (id) {
    case "profile":
      return (
        <div>
          <SectionHeader icon={User} title="Profile & Identity" desc="Your name, role, avatar, and active status." />
          <Row label="Edit your profile" hint="Opens the identity editor with avatar and availability."><button onClick={onEditProfile} className="h-8 px-3 rounded-md text-[12.5px] font-medium text-white" style={{ background: ACCENT }}>Edit profile</button></Row>
          <Row label="Display name" hint="Shown across Limnn surfaces."><input className={inputCls} defaultValue="Anees Naveed" /></Row>
          <Row label="Pronouns" hint="Optional — visible on hover cards."><input className={inputCls} placeholder="they/them" /></Row>
          <Row label="Signature" hint="Used in email replies sent from Limnn."><input className={inputCls} defaultValue="— Anees, Limnn" /></Row>
        </div>
      );
    case "notifications":
      return (
        <div>
          <SectionHeader icon={Bell} title="Notifications" desc="Choose what reaches you, where, and when." />
          <Row label="Desktop push" hint="OS-level toasts for mentions and calls."><Toggle defaultOn /></Row>
          <Row label="Email digest" hint="Daily summary at 8:00 AM local."><Toggle defaultOn /></Row>
          <Row label="Mobile push" hint="When you're away from desktop."><Toggle /></Row>
          <Row label="Mentions only" hint="Mute non-mention activity in busy channels."><Toggle /></Row>
          <Row label="Quiet hours" hint="Pause non-urgent alerts."><input className={inputCls} defaultValue="22:00 → 07:00" /></Row>
        </div>
      );
    case "appearance":
      return (
        <div>
          <SectionHeader icon={Palette} title="Appearance" desc="Theme and density preferences." />
          <Row label="Theme">
            <div className="inline-flex rounded-md border border-border overflow-hidden">
              {["Light", "Cream", "Dark", "System"].map((t, i) => (
                <button key={t} className="px-2.5 h-8 text-[12px]" style={{ background: i === 1 ? ACCENT : "transparent", color: i === 1 ? "#fff" : "inherit" }}>{t}</button>
              ))}
            </div>
          </Row>
          <Row label="Density" hint="How tight rows are packed.">
            <div className="inline-flex rounded-md border border-border overflow-hidden">
              {["Comfortable", "Compact"].map((t, i) => (<button key={t} className="px-2.5 h-8 text-[12px]" style={{ background: i === 0 ? ACCENT : "transparent", color: i === 0 ? "#fff" : "inherit" }}>{t}</button>))}
            </div>
          </Row>
          <Row label="Sidebar auto-collapse" hint="Collapse when viewport is narrow."><Toggle defaultOn /></Row>
        </div>
      );
    case "language":
      return (
        <div>
          <SectionHeader icon={Languages} title="Language & Region" desc="How dates, numbers, and currencies render." />
          <Row label="Language"><select className={inputCls}><option>English (US)</option><option>English (UK)</option><option>Deutsch</option><option>Français</option><option>Español</option></select></Row>
          <Row label="Time zone"><select className={inputCls}><option>America/Los_Angeles</option><option>America/New_York</option><option>Europe/London</option><option>Asia/Dubai</option></select></Row>
          <Row label="Date format"><select className={inputCls}><option>MMM D, YYYY</option><option>DD/MM/YYYY</option><option>YYYY-MM-DD</option></select></Row>
          <Row label="First day of week"><select className={inputCls}><option>Monday</option><option>Sunday</option></select></Row>
        </div>
      );
    case "shortcuts":
      return (
        <div>
          <SectionHeader icon={Keyboard} title="Keyboard Shortcuts" desc="Move faster across Limnn." />
          {[
            ["Open command palette", "⌘ K"], ["New call", "⌘ N"], ["Go to Threads", "G then T"],
            ["Mark all read", "Shift + Esc"], ["Toggle sidebar", "⌘ \\"], ["Search everything", "/"],
          ].map(([k, v]) => (
            <Row key={k} label={k}><kbd className="px-2 py-1 rounded-md border border-border bg-muted text-[11.5px] font-mono">{v}</kbd></Row>
          ))}
        </div>
      );
    case "accessibility":
      return (
        <div>
          <SectionHeader icon={Eye} title="Accessibility" desc="Make Limnn easier on the eyes and ears." />
          <Row label="Reduce motion"><Toggle /></Row>
          <Row label="High contrast"><Toggle /></Row>
          <Row label="Larger UI text"><Toggle /></Row>
          <Row label="Screen reader hints" hint="Extra ARIA labels and live regions."><Toggle defaultOn /></Row>
        </div>
      );
    case "calls":
      return (
        <div>
          <SectionHeader icon={Phone} title="Calls & Dialer" desc="Device routing, voicemail, dispositions." />
          <Row label="Microphone"><select className={inputCls}><option>MacBook Pro Microphone</option><option>Shure MV7</option></select></Row>
          <Row label="Speaker / Headset"><select className={inputCls}><option>AirPods Pro</option><option>System Default</option></select></Row>
          <Row label="Auto-record outbound" hint="Subject to local consent rules."><Toggle defaultOn /></Row>
          <Row label="Voicemail greeting" hint="Personal greeting played after 6 rings."><button className="h-8 px-3 rounded-md text-[12.5px] border border-border bg-background"><Headphones className="inline h-3.5 w-3.5 mr-1" /> Record</button></Row>
          <Row label="Default disposition"><select className={inputCls}><option>Connected — discovery</option><option>Left voicemail</option><option>No answer</option></select></Row>
        </div>
      );
    case "messaging":
      return (
        <div>
          <SectionHeader icon={MessageSquare} title="Threads & Messaging" desc="Defaults for Limnn Threads." />
          <Row label="Read receipts"><Toggle defaultOn /></Row>
          <Row label="Send on Enter" hint="Otherwise Shift + Enter sends."><Toggle defaultOn /></Row>
          <Row label="Auto-expand threads"><Toggle /></Row>
          <Row label="Default channel"><select className={inputCls}><option>#sales-velocity</option><option>#announcements</option></select></Row>
        </div>
      );
    case "calendar":
      return (
        <div>
          <SectionHeader icon={Calendar} title="Calendar Sync" desc="Connect a calendar for meeting context and booking links." />
          <Row label="Google Calendar" hint="Two-way sync of events and free/busy."><button className="h-8 px-3 rounded-md text-[12.5px] font-medium text-white" style={{ background: ACCENT }}>Connect</button></Row>
          <Row label="Outlook 365"><button className="h-8 px-3 rounded-md text-[12.5px] border border-border bg-background">Connect</button></Row>
          <Row label="Default meeting length"><select className={inputCls}><option>30 min</option><option>45 min</option><option>60 min</option></select></Row>
          <Row label="Buffer between meetings"><select className={inputCls}><option>None</option><option>5 min</option><option>10 min</option></select></Row>
        </div>
      );
    case "ai":
      return (
        <div>
          <SectionHeader icon={Sparkles} title="Limnn AI Preferences" desc="Tune the copilot to your voice." />
          <Row label="Tone"><select className={inputCls}><option>Direct & concise</option><option>Warm & consultative</option><option>Formal enterprise</option></select></Row>
          <Row label="Auto-summarize calls" hint="Generate notes within 60s of hang-up."><Toggle defaultOn /></Row>
          <Row label="Draft replies in my voice"><Toggle defaultOn /></Row>
          <Row label="Autopilot scope" hint="Where AI can take action without asking.">
            <select className={inputCls}><option>Suggest only</option><option>Drafts & scheduling</option><option>Drafts, scheduling, CRM updates</option></select>
          </Row>
        </div>
      );
    case "automations":
      return (
        <div>
          <SectionHeader icon={Workflow} title="My Automations" desc="Personal triggers — only affect your queue." />
          {[
            ["Auto-log call notes to Salesforce", true],
            ["Re-route inbound to backup after 2 missed", true],
            ["Snooze low-priority emails until 9am", false],
          ].map(([n, on]) => (<Row key={String(n)} label={String(n)}><Toggle defaultOn={Boolean(on)} /></Row>))}
          <div className="pt-3 mt-3 border-t border-border/60">
            <button className="h-8 px-3 rounded-md text-[12.5px] font-medium text-white" style={{ background: ACCENT }}>+ New automation</button>
          </div>
        </div>
      );
    case "team":
      return (
        <div>
          <SectionHeader icon={Users2} title="Team Preferences" desc="Defaults you push to your direct reports." />
          <Row label="Daily standup time"><input className={inputCls} defaultValue="09:15" /></Row>
          <Row label="Required disposition on every call"><Toggle defaultOn /></Row>
          <Row label="Coaching review cadence"><select className={inputCls}><option>Weekly</option><option>Bi-weekly</option><option>Monthly</option></select></Row>
        </div>
      );
    case "security":
      return (
        <div>
          <SectionHeader icon={Lock} title="Password & 2FA" desc="Keep your account safe." />
          <Row label="Change password"><button className="h-8 px-3 rounded-md text-[12.5px] border border-border bg-background">Update</button></Row>
          <Row label="Two-factor authentication" hint="TOTP app or hardware key."><Toggle defaultOn /></Row>
          <Row label="Backup recovery codes"><button className="h-8 px-3 rounded-md text-[12.5px] border border-border bg-background">View</button></Row>
          <Row label="Single sign-on" hint="Managed by your organization."><span className="text-[12.5px] text-muted-foreground inline-flex items-center gap-1"><Shield className="h-3.5 w-3.5" style={{ color: ACCENT }} /> Okta SSO active</span></Row>
        </div>
      );
    case "sessions":
      return (
        <div>
          <SectionHeader icon={Smartphone} title="Active Sessions" desc="Devices currently signed into your account." />
          <div className="rounded-md border border-border divide-y divide-border">
            {[
              { d: "MacBook Pro · Chrome", loc: "San Francisco, CA", t: "Active now", current: true },
              { d: "iPhone 15 · Limnn iOS", loc: "San Francisco, CA", t: "2h ago" },
              { d: "Windows 11 · Edge", loc: "Austin, TX", t: "3 days ago" },
            ].map((s) => (
              <div key={s.d} className="flex items-center justify-between p-3">
                <div>
                  <div className="text-[13px] font-medium">{s.d} {s.current && <span className="ml-1 text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ background: "color-mix(in oklab, #2C69CF 14%, transparent)", color: ACCENT }}>This device</span>}</div>
                  <div className="text-[11.5px] text-muted-foreground inline-flex items-center gap-1.5 mt-0.5"><Clock className="h-3 w-3" /> {s.t} · {s.loc}</div>
                </div>
                {!s.current && <button className="h-7 px-2.5 rounded-md text-[11.5px] border border-border text-red-600 bg-background">Sign out</button>}
              </div>
            ))}
          </div>
        </div>
      );
    case "apiKeys":
      return (
        <div>
          <SectionHeader icon={KeyRound} title="Personal API Tokens" desc="Scoped tokens for personal scripts and Zapier-style flows." />
          <Row label="Read-only token" hint="Created Apr 12, 2026 · last used 2h ago"><button className="h-8 px-3 rounded-md text-[12.5px] border border-border bg-background">Rotate</button></Row>
          <Row label="Write token (calls + notes)" hint="Created Jan 03, 2026"><button className="h-8 px-3 rounded-md text-[12.5px] border border-border bg-background text-red-600">Revoke</button></Row>
          <div className="pt-3 mt-3 border-t border-border/60">
            <button className="h-8 px-3 rounded-md text-[12.5px] font-medium text-white" style={{ background: ACCENT }}>+ Generate new token</button>
          </div>
        </div>
      );
    case "integrations":
      return (
        <div>
          <SectionHeader icon={Plug} title="Connected Apps" desc="Third-party apps authorized for your account." />
          {[
            { n: "Gmail", s: "Connected · syncs every 2 min", on: true },
            { n: "Google Calendar", s: "Connected", on: true },
            { n: "Zoom", s: "Connected · auto-attach recordings", on: true },
            { n: "Slack (personal)", s: "Not connected", on: false },
            { n: "LinkedIn Sales Nav", s: "Not connected", on: false },
          ].map((i) => (
            <Row key={i.n} label={i.n} hint={i.s}>
              <button className="h-8 px-3 rounded-md text-[12.5px] border border-border bg-background" style={i.on ? { color: "#b91c1c" } : { color: ACCENT, borderColor: ACCENT }}>
                {i.on ? "Disconnect" : "Connect"}
              </button>
            </Row>
          ))}
        </div>
      );
    case "dataExport":
      return (
        <div>
          <SectionHeader icon={Download} title="Data & Privacy" desc="Your personal data and controls." />
          <Row label="Export my data" hint="ZIP archive of calls, notes, messages."><button className="h-8 px-3 rounded-md text-[12.5px] font-medium text-white" style={{ background: ACCENT }}>Request export</button></Row>
          <Row label="Analytics participation" hint="Anonymous product analytics."><Toggle defaultOn /></Row>
          <Row label="Allow AI training on my anonymized calls"><Toggle /></Row>
          <Row label="Delete my account" hint="Requires admin approval."><button className="h-8 px-3 rounded-md text-[12.5px] border border-red-300 text-red-600 bg-background">Request deletion</button></Row>
        </div>
      );
    case "support":
      return (
        <div>
          <SectionHeader icon={LifeBuoy} title="Help & Support" desc="We're here when you need us." />
          <Row label="Contact support" hint="Median response 11 min, 24/7."><button className="h-8 px-3 rounded-md text-[12.5px] font-medium text-white inline-flex items-center gap-1.5" style={{ background: ACCENT }}><Mail className="h-3.5 w-3.5" /> Open ticket</button></Row>
          <Row label="System status"><a className="text-[12.5px] inline-flex items-center gap-1" style={{ color: ACCENT }} href="#">status.limnn.io <ExternalLink className="h-3 w-3" /></a></Row>
          <Row label="Documentation"><a className="text-[12.5px] inline-flex items-center gap-1" style={{ color: ACCENT }} href="#">docs.limnn.io <ExternalLink className="h-3 w-3" /></a></Row>
          <Row label="Keyboard tour"><button className="h-8 px-3 rounded-md text-[12.5px] border border-border bg-background">Restart</button></Row>
        </div>
      );
  }
}

function Locked() {
  return (
    <div className="grid place-items-center text-center py-16">
      <div className="h-12 w-12 rounded-full grid place-items-center mb-3" style={{ background: "color-mix(in oklab, #2C69CF 10%, transparent)", color: ACCENT }}>
        <Lock className="h-5 w-5" />
      </div>
      <h3 className="text-[15px] font-semibold">This setting requires a higher role</h3>
      <p className="text-[12.5px] text-muted-foreground mt-1 max-w-[360px]">Ask your admin to elevate your role or open the Admin Center for organization-level controls.</p>
    </div>
  );
}
