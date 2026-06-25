import { Link, useRouterState } from "@tanstack/react-router";
import {
  Phone,
  LayoutDashboard,
  Users,
  ListChecks,
  BarChart3,
  Settings,
  Search,
  Bell,
  Headphones,
  Inbox,
  HeartHandshake,
  TrendingUp,
  Command,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { TEAMS, useTeam, type Team } from "@/lib/team-context";
import { DialerWidget } from "./dialer-widget";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/queue", label: "Queue", icon: Inbox },
  { to: "/contacts", label: "Contacts", icon: Users },
  { to: "/cadences", label: "Cadences", icon: ListChecks },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { team, setTeam } = useTeam();
  const t = TEAMS[team];
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-[252px] shrink-0 flex-col border-r border-border bg-sidebar">
        <div className="px-5 pt-5 pb-3 flex items-center gap-2">
          <div
            className="h-9 w-9 rounded-lg grid place-items-center text-primary-foreground font-serif text-xl"
            style={{ background: "var(--primary)" }}
          >
            L
          </div>
          <div>
            <div className="text-sm font-semibold tracking-tight">Limnn Dialer</div>
            <div className="text-[11px] text-muted-foreground">Enterprise voice</div>
          </div>
        </div>

        {/* Team switcher */}
        <div className="px-3 pt-2">
          <TeamSwitcher open={open} setOpen={setOpen} onSelect={(v) => { setTeam(v); setOpen(false); }} />
        </div>

        <nav className="px-3 mt-4 flex-1 space-y-0.5">
          <div className="px-2 pb-1.5 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            Workspace
          </div>
          {NAV.map((item) => {
            const active = pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={[
                  "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors",
                  active
                    ? "bg-accent text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/60",
                ].join(" ")}
              >
                <Icon className="h-4 w-4" />
                {item.label}
                {active && (
                  <span
                    className="ml-auto h-1.5 w-1.5 rounded-full"
                    style={{ background: t.accentVar }}
                  />
                )}
              </Link>
            );
          })}

          <div className="px-2 pt-5 pb-1.5 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            {t.label} tools
          </div>
          {teamTools(team).map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/60"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-border">
          <Link
            to="/settings"
            className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/60"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
          <div className="mt-2 flex items-center gap-2 px-2.5 py-2">
            <div className="h-7 w-7 rounded-full bg-secondary text-secondary-foreground grid place-items-center text-xs font-medium">
              AN
            </div>
            <div className="text-xs leading-tight">
              <div className="font-medium">Anees Naveed</div>
              <div className="text-muted-foreground">Admin · {t.label}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <TopBar />
        <main className="flex-1 min-w-0">{children}</main>
      </div>

      {/* Persistent dialer */}
      <DialerWidget />
    </div>
  );
}

function teamTools(team: Team) {
  if (team === "sales")
    return [
      { to: "/", label: "Power Dialer", icon: Phone },
      { to: "/", label: "Pipeline", icon: TrendingUp },
    ];
  if (team === "support")
    return [
      { to: "/", label: "Live Queue", icon: Headphones },
      { to: "/", label: "Tickets", icon: Inbox },
    ];
  return [
    { to: "/", label: "Accounts", icon: HeartHandshake },
    { to: "/", label: "Renewals", icon: TrendingUp },
  ];
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
        className="w-full flex items-center gap-2.5 rounded-lg border border-border bg-card px-2.5 py-2 text-left hover:border-border-strong transition"
      >
        <span
          className="h-2.5 w-2.5 rounded-full shrink-0"
          style={{ background: t.accentVar }}
        />
        <span className="flex-1 min-w-0">
          <span className="block text-sm font-medium truncate">{t.label}</span>
          <span className="block text-[11px] text-muted-foreground truncate">{t.tagline}</span>
        </span>
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
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
