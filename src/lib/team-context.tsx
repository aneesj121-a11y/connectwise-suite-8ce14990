import { createContext, useContext, useState, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Briefcase,
  Inbox,
  Users,
  ListChecks,
  BarChart3,
  Phone,
  TrendingUp,
  Target,
  Trophy,
  BookOpen,
  Radar,
  Megaphone,
  PieChart,
  Layers,
  PenLine,
  FlaskConical,
  HeartHandshake,
  Activity,
  Sparkles,
  RefreshCw,
  Presentation,
  Rocket,
  Star,
  MessagesSquare,
  Timer,
  Route as RouteIcon,
  Library,
  Wand2,
  Smile,
  Mic,
  KanbanSquare,
  Workflow,
  Map,
  Goal,
  Gauge,
  RotateCcw,
  Wallet,
  Receipt,
  Banknote,
  LineChart,
  FileText,
  Repeat,
  Scale,
  Calculator,
  Headphones,
} from "lucide-react";

export type Team =
  | "sales"
  | "marketing"
  | "cs"
  | "support"
  | "chat"
  | "grid"
  | "billing";

export type NavLink = { to: string; label: string; icon: LucideIcon };

export type HubDef = {
  id: Team;
  label: string;
  tagline: string;
  accentVar: string;
  accentClass: string;
  defaultRoute: string;
  nav: NavLink[];
  tools: NavLink[];
};

export const TEAMS: Record<Team, HubDef> = {
  sales: {
    id: "sales",
    label: "Sales",
    tagline: "Outbound cadences & pipeline",
    accentVar: "var(--sales)",
    accentClass: "text-[color:var(--sales)]",
    defaultRoute: "/",
    nav: [
      { to: "/", label: "Dashboard", icon: LayoutDashboard },
      { to: "/opportunities", label: "Opportunities", icon: Briefcase },
      { to: "/forecast", label: "Forecast", icon: Target },
      { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
      { to: "/playbooks", label: "Playbooks", icon: BookOpen },
    ],
    tools: [
      { to: "/", label: "Power Dialer", icon: Phone },
      { to: "/opportunities", label: "Pipeline", icon: TrendingUp },
    ],
  },
  marketing: {
    id: "marketing",
    label: "Marketing",
    tagline: "Intent, campaigns & growth",
    accentVar: "var(--sales)",
    accentClass: "text-[color:var(--sales)]",
    defaultRoute: "/marketing",
    nav: [
      { to: "/marketing", label: "Growth Analytics", icon: BarChart3 },
      { to: "/marketing/intent", label: "Intent Engine", icon: Radar },
      { to: "/marketing/campaigns", label: "AI Campaigns", icon: Megaphone },
      { to: "/marketing/analytics", label: "Attribution", icon: PieChart },
      { to: "/marketing/segments", label: "Segments", icon: Layers },
      { to: "/marketing/content", label: "Content Studio", icon: PenLine },
      { to: "/marketing/ab-tests", label: "Experiments", icon: FlaskConical },
    ],
    tools: [
      { to: "/marketing/intent", label: "Surging Accounts", icon: TrendingUp },
      { to: "/marketing/campaigns", label: "Active Campaigns", icon: Megaphone },
    ],
  },
  cs: {
    id: "cs",
    label: "Customer Success",
    tagline: "Renewals & account health",
    accentVar: "var(--cs)",
    accentClass: "text-[color:var(--cs)]",
    defaultRoute: "/cs",
    nav: [
      { to: "/cs", label: "Accounts", icon: HeartHandshake },
      { to: "/cs/health", label: "Health Scoring", icon: Activity },
      { to: "/cs/expansion", label: "Expansion Ops", icon: Sparkles },
      { to: "/cs/renewals", label: "Renewals", icon: RefreshCw },
      { to: "/cs/qbr", label: "QBR Builder", icon: Presentation },
      { to: "/cs/onboarding", label: "Onboarding", icon: Rocket },
      { to: "/cs/advocacy", label: "Advocacy", icon: Star },
    ],
    tools: [
      { to: "/cs", label: "Accounts", icon: HeartHandshake },
      { to: "/cs/renewals", label: "Renewals", icon: RefreshCw },
    ],
  },
  support: {
    id: "support",
    label: "Support",
    tagline: "Inbound queue & tickets",
    accentVar: "var(--support)",
    accentClass: "text-[color:var(--support)]",
    defaultRoute: "/chat",
    nav: [
      { to: "/chat", label: "Central Inbox", icon: MessagesSquare },
      { to: "/chat/sla", label: "SLA Triage", icon: Timer },
      { to: "/chat/routing", label: "Smart Routing", icon: RouteIcon },
    ],
    tools: [
      { to: "/chat", label: "Live Queue", icon: Headphones },
      { to: "/chat", label: "Tickets", icon: Inbox },
    ],
  },
  chat: {
    id: "chat",
    label: "Limnn Chat & Support",
    tagline: "Omnichannel inbox & AI deflection",
    accentVar: "var(--support)",
    accentClass: "text-[color:var(--support)]",
    defaultRoute: "/chat",
    nav: [
      { to: "/chat", label: "Central Inbox", icon: MessagesSquare },
      { to: "/chat/sla", label: "SLA Triage", icon: Timer },
      { to: "/chat/routing", label: "Smart Routing", icon: RouteIcon },
      { to: "/chat/kb", label: "Knowledge Base", icon: Library },
      { to: "/chat/macros", label: "AI Macros", icon: Wand2 },
      { to: "/chat/csat", label: "CSAT & Insights", icon: Smile },
      { to: "/chat/voice", label: "Voice & IVR", icon: Mic },
    ],
    tools: [
      { to: "/chat", label: "Live Inbox", icon: Inbox },
      { to: "/chat/sla", label: "SLA Watch", icon: Timer },
    ],
  },
  grid: {
    id: "grid",
    label: "Limnn Grid",
    tagline: "Project ops & sprint delivery",
    accentVar: "var(--sales)",
    accentClass: "text-[color:var(--sales)]",
    defaultRoute: "/grid",
    nav: [
      { to: "/grid", label: "Sprint Board", icon: KanbanSquare },
      { to: "/grid/sprints", label: "Active Sprints", icon: Activity },
      { to: "/grid/automations", label: "Automations", icon: Workflow },
      { to: "/grid/roadmaps", label: "Roadmaps", icon: Map },
      { to: "/grid/okrs", label: "OKRs", icon: Goal },
      { to: "/grid/capacity", label: "Capacity", icon: Gauge },
      { to: "/grid/retros", label: "Retros", icon: RotateCcw },
    ],
    tools: [
      { to: "/grid", label: "My Tasks", icon: ListChecks },
      { to: "/grid/sprints", label: "Sprints", icon: Activity },
    ],
  },
  billing: {
    id: "billing",
    label: "Billing Ops",
    tagline: "Collections, AR/AP & FP&A",
    accentVar: "var(--cs)",
    accentClass: "text-[color:var(--cs)]",
    defaultRoute: "/billing",
    nav: [
      { to: "/billing", label: "Financials", icon: Wallet },
      { to: "/billing/collections", label: "Collections", icon: Banknote },
      { to: "/billing/arap", label: "AR / AP", icon: Receipt },
      { to: "/billing/fpa", label: "FP&A Engine", icon: LineChart },
      { to: "/billing/invoices", label: "Invoices", icon: FileText },
      { to: "/billing/subscriptions", label: "Subscriptions", icon: Repeat },
      { to: "/billing/revrec", label: "Revenue Rec", icon: Scale },
      { to: "/billing/tax", label: "Tax & Compliance", icon: Calculator },
    ],
    tools: [
      { to: "/billing/collections", label: "Collections", icon: Banknote },
      { to: "/billing/invoices", label: "Invoices", icon: FileText },
    ],
  },
};

type Ctx = {
  team: Team;
  setTeam: (t: Team) => void;
  inCall: boolean;
  setInCall: (v: boolean) => void;
};

const TeamCtx = createContext<Ctx | null>(null);

export function TeamProvider({ children }: { children: ReactNode }) {
  const [team, setTeam] = useState<Team>("sales");
  const [inCall, setInCall] = useState(false);
  return (
    <TeamCtx.Provider value={{ team, setTeam, inCall, setInCall }}>{children}</TeamCtx.Provider>
  );
}

export function useTeam() {
  const ctx = useContext(TeamCtx);
  if (!ctx) throw new Error("useTeam must be inside TeamProvider");
  return ctx;
}
