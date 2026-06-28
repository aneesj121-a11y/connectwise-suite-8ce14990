import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  Phone,
  Settings,
  Search,
  Bell,
  Command,
  Sparkles,
  ChevronDown,
  MessageSquareText,
  Shield,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { TEAMS, useTeam, roleAtLeast, type Team, type Role, type HubDef } from "@/lib/team-context";
import { DialerWidget } from "./dialer-widget";
import { LimnnIntelligence } from "./limnn-intelligence";
import { LimnnThread, useLimnnThreadUnread, limnnThreadHasMention } from "./limnn-thread";
import { LimnnThreadNotifier } from "./limnn-thread-notifier";
import { ProfileModal } from "./profile-modal";
import limnnLogo from "@/assets/limnn-logo.png";

const SIDEBAR_BG = "#1E293B";
const SIDEBAR_ACTIVE = "#2C69CF";
const SIDEBAR_INACTIVE = "#94A3B8";
const SIDEBAR_TEXT = "#FFFFFF";

export function AppShell({ children }: { children: ReactNode }) {
  const { team, setTeam, role, setRole } = useTeam();
  const t = TEAMS[team];
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [threadOpen, setThreadOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const visibleNav = t.nav.filter((n) => !n.managerOnly || role === "manager");
  const visibleTools = t.tools.filter((n) => !n.managerOnly || role === "manager");

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Sidebar */}
      <aside
        className="hidden lg:flex w-[252px] shrink-0 flex-col"
        style={{ background: SIDEBAR_BG, color: SIDEBAR_TEXT }}
      >
        <div className="px-5 pt-5 pb-4 flex items-center gap-2">
          <img
            src={limnnLogo}
            alt="limnn"
            className="h-7 w-auto"
            width={1536}
            height={512}
          />
          <span
            className="ml-1 text-[11px] uppercase tracking-[0.18em]"
            style={{ color: SIDEBAR_INACTIVE }}
          >
            Dialer
          </span>
        </div>

        {/* Persistent Limnn Threads launcher — independent of hub */}
        <div className="px-3 pb-2">
          <LimnnThreadsLauncher onClick={() => setThreadOpen(true)} />
        </div>

        {/* Admin Center launcher — prominent, builder ethos */}
        {roleAtLeast(role, "manager") && (
          <div className="px-3 pb-3">
            <AdminCenterLauncher
              active={pathname.startsWith("/admin")}
              role={role}
              onClick={() => navigate({ to: "/admin" })}
            />
          </div>
        )}

        {/* Team switcher */}
        <div className="px-3 pt-2">
          <TeamSwitcher
            open={open}
            setOpen={setOpen}
            onSelect={(v) => {
              setTeam(v);
              setOpen(false);
              navigate({ to: TEAMS[v].defaultRoute });
            }}
          />
        </div>

        <nav className="px-3 mt-4 flex-1 space-y-0.5">
          <div
            className="px-2 pb-1.5 text-[10px] uppercase tracking-[0.12em]"
            style={{ color: SIDEBAR_INACTIVE }}
          >
            Workspace
          </div>
          {visibleNav.map((item) => {
            const active = pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors"
                style={{
                  background: active ? SIDEBAR_ACTIVE : "transparent",
                  color: active ? SIDEBAR_TEXT : SIDEBAR_INACTIVE,
                  fontWeight: active ? 600 : 500,
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                    e.currentTarget.style.color = SIDEBAR_TEXT;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = SIDEBAR_INACTIVE;
                  }
                }}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}

          <div
            className="px-2 pt-5 pb-1.5 text-[10px] uppercase tracking-[0.12em]"
            style={{ color: SIDEBAR_INACTIVE }}
          >
            {t.label} tools
          </div>
          {visibleTools.map((item, i) => (
            <Link
              key={`${item.to}-${i}`}
              to={item.to}
              className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors"
              style={{ color: SIDEBAR_INACTIVE }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                e.currentTarget.style.color = SIDEBAR_TEXT;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = SIDEBAR_INACTIVE;
              }}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div
          className="p-3 mt-2"
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
        >
          <Link
            to="/settings"
            className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors mt-0.5"
            style={{ color: SIDEBAR_INACTIVE }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.06)";
              e.currentTarget.style.color = SIDEBAR_TEXT;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = SIDEBAR_INACTIVE;
            }}
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
          <div className="mt-2 flex items-center gap-2 px-2.5 py-2">
            <button
              onClick={() => setProfileOpen(true)}
              className="h-7 w-7 rounded-full grid place-items-center text-xs font-semibold hover:ring-2 hover:ring-white/20 transition"
              style={{ background: SIDEBAR_ACTIVE, color: SIDEBAR_TEXT }}
              title="Edit profile"
            >
              AN
            </button>
            <div className="text-xs leading-tight flex-1 min-w-0">
              <button
                onClick={() => setProfileOpen(true)}
                className="font-medium truncate text-left hover:underline"
                style={{ color: SIDEBAR_TEXT }}
              >
                Anees Naveed
              </button>
              <button
                onClick={() => {
                  const order: Role[] = ["agent", "manager", "admin", "superadmin"];
                  setRole(order[(order.indexOf(role) + 1) % order.length]);
                }}
                className="inline-flex items-center gap-1 mt-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-medium transition capitalize"
                style={{
                  background: roleAtLeast(role, "admin") ? SIDEBAR_ACTIVE : "rgba(255,255,255,0.08)",
                  color: SIDEBAR_TEXT,
                }}
                title="Cycle role (Agent → Manager → Admin → Super Admin)"
              >
                {role} view · {t.label}
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <TopBar
          threadOpen={threadOpen}
          onToggleThread={() => setThreadOpen((v) => !v)}
          onOpenProfile={() => setProfileOpen(true)}
        />
        <main className="flex-1 min-w-0">{children}</main>
      </div>

      {/* Limnn Thread split column */}
      <LimnnThread open={threadOpen} onClose={() => setThreadOpen(false)} />

      {/* In-app incoming message toasts (fire only when Threads is closed) */}
      <LimnnThreadNotifier threadsOpen={threadOpen} onOpenThreads={() => setThreadOpen(true)} />

      {/* Right intelligence pane */}
      <LimnnIntelligence />

      {/* Persistent dialer */}
      <DialerWidget />

      {/* Profile modal */}
      <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
    </div>
  );
}

function TeamSwitcher({
  open,
  setOpen,
  onSelect,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  onSelect: (t: Team) => void;
}) {
  const { team } = useTeam();
  const t = TEAMS[team];
  const HubIcon = t.hubIcon;
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          color: SIDEBAR_TEXT,
        }}
      >
        <span
          className="h-7 w-7 rounded-md grid place-items-center shrink-0"
          style={{
            background: `color-mix(in oklab, ${t.hubColor} 18%, transparent)`,
            color: t.hubColor,
            border: `1px solid color-mix(in oklab, ${t.hubColor} 30%, transparent)`,
          }}
        >
          <HubIcon className="h-3.5 w-3.5" />
        </span>
        <span className="flex-1 min-w-0">
          <span className="block text-sm font-semibold truncate" style={{ color: SIDEBAR_TEXT, fontFamily: "var(--font-display, Poppins), Poppins, sans-serif" }}>{t.label}</span>
          <span className="block text-[11px] truncate" style={{ color: SIDEBAR_INACTIVE }}>{t.tagline}</span>
        </span>
        <ChevronDown className="h-4 w-4" style={{ color: SIDEBAR_INACTIVE }} />
      </button>
      {open && (
        <div className="absolute z-30 left-0 right-0 mt-1 rounded-lg border border-border bg-popover shadow-lg overflow-hidden">
          {(Object.values(TEAMS) as HubDef[]).filter((h) => h.id !== "support").map((opt) => {
            const OptIcon = opt.hubIcon;
            const active = opt.id === team;
            return (
              <button
                key={opt.id}
                onClick={() => onSelect(opt.id)}
                className="w-full flex items-center gap-2.5 px-2.5 py-2.5 text-left hover:bg-accent text-sm text-popover-foreground"
                style={active ? { background: "color-mix(in oklab, var(--primary) 8%, transparent)" } : undefined}
              >
                <span
                  className="h-8 w-8 rounded-md grid place-items-center shrink-0"
                  style={{
                    background: `color-mix(in oklab, ${opt.hubColor} 12%, transparent)`,
                    color: opt.hubColor,
                    border: `1px solid color-mix(in oklab, ${opt.hubColor} 24%, transparent)`,
                  }}
                >
                  <OptIcon className="h-4 w-4" strokeWidth={1.75} />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block font-semibold text-foreground text-[13px] leading-tight" style={{ fontFamily: "var(--font-display, Poppins), Poppins, sans-serif" }}>{opt.label}</span>
                  <span className="block text-[11px] text-muted-foreground leading-snug mt-0.5">{opt.tagline}</span>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function LimnnThreadsLauncher({ onClick }: { onClick: () => void }) {
  const unread = useLimnnThreadUnread();
  const mention = limnnThreadHasMention();
  return (
    <button
      onClick={onClick}
      className="group relative w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition overflow-hidden"
      style={{
        background: "linear-gradient(135deg, rgba(44,105,207,0.22), rgba(124,58,237,0.18))",
        border: "1px solid rgba(44,105,207,0.35)",
        color: SIDEBAR_TEXT,
      }}
      title="Open Limnn Threads"
    >
      <span
        className="h-8 w-8 rounded-md grid place-items-center shrink-0 shadow-sm"
        style={{ background: "linear-gradient(135deg, #2C69CF, #7C3AED)" }}
      >
        <MessageSquareText className="h-4 w-4 text-white" />
      </span>
      <span className="flex-1 min-w-0">
        <span className="flex items-center gap-1.5 text-[13px] font-semibold leading-tight" style={{ color: SIDEBAR_TEXT, fontFamily: "Poppins, sans-serif" }}>
          Limnn Threads
          {mention && <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: "#EF4444" }} />}
        </span>
        <span className="block text-[10.5px] truncate mt-0.5" style={{ color: SIDEBAR_INACTIVE }}>
          Team chat · Direct messages · Activity
        </span>
      </span>
      {unread > 0 && (
        <span
          className="text-[10px] font-bold min-w-[20px] h-[20px] px-1.5 rounded-full grid place-items-center text-white shrink-0"
          style={{ background: mention ? "#EF4444" : "#2C69CF" }}
        >
          {unread > 99 ? "99+" : unread}
        </span>
      )}
    </button>
  );
}



function TopBar({
  threadOpen,
  onToggleThread,
  onOpenProfile,
}: {
  threadOpen: boolean;
  onToggleThread: () => void;
  onOpenProfile: () => void;
}) {
  const { team } = useTeam();
  const t = TEAMS[team];
  const unread = useLimnnThreadUnread();
  const mention = limnnThreadHasMention();
  return (
    <header className="h-14 border-b border-border bg-background/80 backdrop-blur sticky top-0 z-20">
      <div className="h-full px-6 flex items-center gap-4">
        <div className="chip" style={{ background: "color-mix(in oklab, " + t.accentVar + " 14%, transparent)", color: t.accentVar }}>
          <Sparkles className="h-3 w-3" /> AI engine active
        </div>
        <div className="flex-1 max-w-xl ml-2">
          <label className="relative block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search contacts, deals, tickets…"
              className="w-full h-9 pl-9 pr-16 rounded-md border border-border bg-card text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono text-muted-foreground border border-border rounded px-1.5 py-0.5 inline-flex items-center gap-0.5">
              <Command className="h-2.5 w-2.5" />K
            </span>
          </label>
        </div>
        <button
          onClick={onToggleThread}
          className="relative h-9 w-9 grid place-items-center rounded-md hover:bg-accent transition"
          style={{
            color: threadOpen ? "var(--primary)" : "var(--muted-foreground)",
            background: threadOpen ? "color-mix(in oklab, var(--primary) 12%, transparent)" : undefined,
          }}
          title="Limnn Thread"
        >
          <MessageSquareText className="h-4 w-4" />
          {unread > 0 && (
            <span
              className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full text-[9.5px] font-bold text-white grid place-items-center"
              style={{ background: mention ? "#EF4444" : "#2C69CF" }}
            >
              {unread}
            </span>
          )}
          {mention && <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-rose-400 animate-pulse" />}
        </button>
        <button className="relative h-9 w-9 grid place-items-center rounded-md hover:bg-accent text-muted-foreground">
          <Bell className="h-4 w-4" />
        </button>
        <button className="h-9 px-3.5 rounded-md text-sm font-medium text-primary-foreground inline-flex items-center gap-2 shadow-sm" style={{ background: "var(--primary)" }}>
          <Phone className="h-3.5 w-3.5" /> New call
        </button>
        <button
          onClick={onOpenProfile}
          className="h-9 w-9 rounded-full grid place-items-center text-xs font-semibold text-white hover:ring-2 hover:ring-primary/30 transition"
          style={{ background: "var(--primary)" }}
          title="Your profile"
        >
          AN
        </button>
      </div>
    </header>
  );
}
