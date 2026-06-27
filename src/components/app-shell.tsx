import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  Phone,
  Settings,
  Search,
  Bell,
  Command,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { TEAMS, useTeam, type Team } from "@/lib/team-context";
import { DialerWidget } from "./dialer-widget";
import { LimnnIntelligence } from "./limnn-intelligence";
import limnnLogo from "@/assets/limnn-logo.png";

const SIDEBAR_BG = "#1E293B";
const SIDEBAR_ACTIVE = "#2C69CF";
const SIDEBAR_INACTIVE = "#94A3B8";
const SIDEBAR_TEXT = "#FFFFFF";

export function AppShell({ children }: { children: ReactNode }) {
  const { team, setTeam } = useTeam();
  const t = TEAMS[team];
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

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

        {/* Team switcher */}
        <div className="px-3 pt-2">
          <TeamSwitcher open={open} setOpen={setOpen} onSelect={(v) => { setTeam(v); setOpen(false); }} />
        </div>

        <nav className="px-3 mt-4 flex-1 space-y-0.5">
          <div
            className="px-2 pb-1.5 text-[10px] uppercase tracking-[0.12em]"
            style={{ color: SIDEBAR_INACTIVE }}
          >
            Workspace
          </div>
          {t.nav.map((item) => {
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
          {t.tools.map((item, i) => (
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
            <Settings className="h-4 w-4" />
            Settings
          </Link>
          <div className="mt-2 flex items-center gap-2 px-2.5 py-2">
            <div
              className="h-7 w-7 rounded-full grid place-items-center text-xs font-semibold"
              style={{ background: SIDEBAR_ACTIVE, color: SIDEBAR_TEXT }}
            >
              AN
            </div>
            <div className="text-xs leading-tight">
              <div className="font-medium" style={{ color: SIDEBAR_TEXT }}>Anees Naveed</div>
              <div style={{ color: SIDEBAR_INACTIVE }}>Admin · {t.label}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <TopBar />
        <main className="flex-1 min-w-0">{children}</main>
      </div>

      {/* Right intelligence pane */}
      <LimnnIntelligence />

      {/* Persistent dialer */}
      <DialerWidget />
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
          className="h-2.5 w-2.5 rounded-full shrink-0"
          style={{ background: SIDEBAR_ACTIVE }}
        />
        <span className="flex-1 min-w-0">
          <span className="block text-sm font-medium truncate" style={{ color: SIDEBAR_TEXT }}>{t.label}</span>
          <span className="block text-[11px] truncate" style={{ color: SIDEBAR_INACTIVE }}>{t.tagline}</span>
        </span>
        <ChevronDown className="h-4 w-4" style={{ color: SIDEBAR_INACTIVE }} />
      </button>
      {open && (
        <div className="absolute z-30 left-0 right-0 mt-1 rounded-lg border border-border bg-popover shadow-lg overflow-hidden">
          {(Object.values(TEAMS) as (typeof TEAMS)[Team][]).map((opt) => (
            <button
              key={opt.id}
              onClick={() => onSelect(opt.id)}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 text-left hover:bg-accent text-sm"
            >
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: opt.accentVar }} />
              <span className="flex-1">
                <span className="block font-medium">{opt.label}</span>
                <span className="block text-[11px] text-muted-foreground">{opt.tagline}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function TopBar() {
  const { team } = useTeam();
  const t = TEAMS[team];
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
        <button className="h-9 w-9 grid place-items-center rounded-md hover:bg-accent text-muted-foreground">
          <Bell className="h-4 w-4" />
        </button>
        <button
          className="h-9 px-3.5 rounded-md text-sm font-medium text-primary-foreground inline-flex items-center gap-2 shadow-sm"
          style={{ background: "var(--primary)" }}
        >
          <Phone className="h-3.5 w-3.5" /> New call
        </button>
      </div>
    </header>
  );
}
