import { useEffect, useMemo, useRef, useState } from "react";
import {
  Hash,
  Lock,
  Search,
  Plus,
  Smile,
  Paperclip,
  Code2,
  AtSign,
  Send,
  CornerDownRight,
  MoreHorizontal,
  Pencil,
  X,
  Bell,
  Pin,
  ChevronDown,
  Home,
  MessageSquare,
  Activity,
  Bookmark,
  FileText,
  MoreHorizontal as DotsH,
  Headphones,
  Video,
  Phone,
  Bold,
  Italic,
  Link2,
  List,
  ListOrdered,
  Mic,
  Settings,
  Moon,
  Clock,
  Globe,
  Volume2,
  Palette,
  ShieldCheck,
  LogOut,
  Camera,
  Sparkles,
  Star,
  CheckCheck,
  Filter,
  Edit3,
  Reply,
} from "lucide-react";
import limnnLogo from "@/assets/limnn-logo.png";

/* =========================================================================
   THEME TOKENS — Limnn brand
   ========================================================================= */
const BG_DEEP = "#0F172A";          // workspace rail (deepest)
const BG_PANEL = "#1E293B";         // channel sidebar
const BG_CANVAS = "#FAF7F0";        // message canvas (cream — matches main app)
const BG_THREAD = "#FFFFFF";        // right pane
const TEXT_LIGHT = "#FFFFFF";
const TEXT_DIM = "#94A3B8";
const TEXT_INK = "#0F172A";
const TEXT_BODY = "#1F2937";
const TEXT_MUTED_INK = "#64748B";
const ACCENT = "#2C69CF";
const ACCENT_SOFT = "rgba(44,105,207,0.12)";
const MENTION = "#EF4444";
const SUCCESS = "#10B981";
const WARN = "#F59E0B";
const BORDER_DARK = "rgba(255,255,255,0.08)";
const BORDER_LIGHT = "rgba(15,23,42,0.08)";
const HOVER_DARK = "rgba(255,255,255,0.06)";
const HOVER_LIGHT = "rgba(44,105,207,0.06)";

/* =========================================================================
   TYPES + MOCK DATA
   ========================================================================= */
type Presence = "active" | "away" | "dnd";
type Member = { id: string; name: string; initials: string; presence: Presence; title?: string; status?: string };
type Reaction = { emoji: string; count: number; me?: boolean };
type Message = {
  id: string;
  authorId: string;
  ts: string;
  text: string;
  reactions?: Reaction[];
  replies?: Message[];
  edited?: boolean;
  pinned?: boolean;
};
type Channel = {
  id: string;
  name: string;
  kind: "channel" | "dm";
  private?: boolean;
  unread?: number;
  mention?: boolean;
  topic?: string;
  memberIds?: string[];
  muted?: boolean;
};
type ActivityItem = {
  id: string;
  kind: "mention" | "reply" | "reaction" | "dm";
  channelId: string;
  authorId: string;
  ts: string;
  text: string;
  unread?: boolean;
};

const MEMBERS: Record<string, Member> = {
  u_anees: { id: "u_anees", name: "Anees Naveed", initials: "AN", presence: "active", title: "Founder", status: "In the garage swapping a 2JZ 🔧" },
  u_priya: { id: "u_priya", name: "Priya Raman", initials: "PR", presence: "active", title: "VP Engineering", status: "Shipping CPQ v2" },
  u_jared: { id: "u_jared", name: "Jared Cole", initials: "JC", presence: "dnd", title: "Sales Lead", status: "On the Acme call 📞" },
  u_mei: { id: "u_mei", name: "Mei Tanaka", initials: "MT", presence: "active", title: "CS Director" },
  u_omar: { id: "u_omar", name: "Omar Idris", initials: "OI", presence: "away", title: "Staff Engineer", status: "PTO until Mon ✈️" },
  u_lina: { id: "u_lina", name: "Lina Park", initials: "LP", presence: "active", title: "Product" },
};

const CHANNELS: Channel[] = [
  { id: "c_ann", name: "announcements", kind: "channel", unread: 2, topic: "Company-wide updates · read-only for most" },
  { id: "c_eng", name: "engineering", kind: "channel", unread: 6, mention: true, topic: "Eng velocity, releases, on-call" },
  { id: "c_sales", name: "sales-velocity", kind: "channel", unread: 3, topic: "Pipeline, deals, quota momentum" },
  { id: "c_cs", name: "customer-success", kind: "channel", topic: "Renewals, health scoring, QBRs" },
  { id: "c_inc", name: "incidents", kind: "channel", private: true, unread: 1, mention: true, topic: "Active incidents — pageable" },
  { id: "c_design", name: "design-crit", kind: "channel", topic: "Design reviews + crit sessions", muted: true },
];

const DMS: Channel[] = [
  { id: "d_priya", name: "Priya Raman", kind: "dm", memberIds: ["u_priya"], unread: 1 },
  { id: "d_jared", name: "Jared Cole", kind: "dm", memberIds: ["u_jared"] },
  { id: "d_mei", name: "Mei Tanaka", kind: "dm", memberIds: ["u_mei"], unread: 2, mention: true },
  { id: "d_omar", name: "Omar Idris", kind: "dm", memberIds: ["u_omar"] },
  { id: "d_lina", name: "Lina Park", kind: "dm", memberIds: ["u_lina"] },
];

const SEED: Record<string, Message[]> = {
  c_eng: [
    {
      id: "m1",
      authorId: "u_priya",
      ts: "9:02 AM",
      pinned: true,
      text: "Rolling EU-WEST failover to canary at 9:15. Telephony team is staged. P0 oncall is @omar.",
      reactions: [{ emoji: "🚀", count: 4, me: true }, { emoji: "👀", count: 2 }],
      replies: [
        { id: "m1r1", authorId: "u_omar", ts: "9:03 AM", text: "Confirmed staged. Runbook v3 loaded." },
        { id: "m1r2", authorId: "u_priya", ts: "9:04 AM", text: "Ack — keep #incidents quiet unless SLO dips." },
      ],
    },
    { id: "m2", authorId: "u_omar", ts: "9:11 AM", text: "Velocity: 47 PRs merged this sprint, p95 review time 2h 14m — best quarter to date.", reactions: [{ emoji: "🔥", count: 6 }, { emoji: "💪", count: 3 }] },
    { id: "m3", authorId: "u_lina", ts: "9:18 AM", text: "Shipping CPQ approvals modal behind `cpq.approvals.v2`. Cutover Thursday after deal desk sync.", reactions: [{ emoji: "✅", count: 5, me: true }] },
    { id: "m4", authorId: "u_priya", ts: "9:24 AM", text: "Heads up @anees — deployment dashboard now shows MTTR per service. Open it from Grid → Sprints." },
  ],
  c_sales: [
    { id: "s1", authorId: "u_jared", ts: "8:48 AM", text: "Acme just countered at 18% — pulling it into deal desk. Need a CFO override before EOD.", reactions: [{ emoji: "🫡", count: 2 }],
      replies: [{ id: "s1r1", authorId: "u_anees", ts: "8:51 AM", text: "Approve if multi-year. Single-year is a hard no past 15%." }] },
    { id: "s2", authorId: "u_mei", ts: "9:05 AM", text: "Q3 quota attainment crossed 92% — three reps already at 100%+. Pushing the leaderboard refresh.", reactions: [{ emoji: "📈", count: 7 }] },
  ],
  c_ann: [{ id: "a1", authorId: "u_anees", ts: "8:30 AM", pinned: true, text: "All-hands Friday at 11:00 PT. Agenda: Q3 close, CPQ launch, and the new EU data residency tier.", reactions: [{ emoji: "🎉", count: 12 }, { emoji: "📌", count: 4 }] }],
  c_cs: [{ id: "cs1", authorId: "u_mei", ts: "9:00 AM", text: "Northwind health dropped to 62 — scheduling QBR pull-in. Expansion thesis still intact." }],
  c_inc: [{ id: "i1", authorId: "u_omar", ts: "9:09 AM", text: "INC-4421 — carrier degradation, EU-WEST. Failover in progress. ETA recovery 8–12 min.", reactions: [{ emoji: "⚠️", count: 3 }] }],
  c_design: [{ id: "dg1", authorId: "u_lina", ts: "Yesterday", text: "Crit on Limnn Threads v2 — Thursday 2pm. Drop figma links in 🧵." }],
  d_priya: [{ id: "dp1", authorId: "u_priya", ts: "8:58 AM", text: "Got 10 min before the failover? Want to align on the CPQ rollout sequencing." }],
  d_jared: [{ id: "dj1", authorId: "u_jared", ts: "Yesterday", text: "Sent the Acme paper trail to deal-desk." }],
  d_mei: [
    { id: "dm1", authorId: "u_mei", ts: "9:12 AM", text: "Northwind exec wants you on the QBR. 30 min Thursday work?" },
    { id: "dm2", authorId: "u_mei", ts: "9:13 AM", text: "Also — advocacy program intake is up 40% MoM 🎯" },
  ],
  d_omar: [{ id: "do1", authorId: "u_omar", ts: "Yesterday", text: "Runbook v3 merged." }],
  d_lina: [{ id: "dl1", authorId: "u_lina", ts: "9:20 AM", text: "Pushed the new empty state — peek when you can." }],
};

const ACTIVITY: ActivityItem[] = [
  { id: "ac1", kind: "mention", channelId: "c_eng", authorId: "u_priya", ts: "9:24 AM", text: "@anees — MTTR per service is live in Grid → Sprints.", unread: true },
  { id: "ac2", kind: "mention", channelId: "c_inc", authorId: "u_omar", ts: "9:09 AM", text: "@anees paging founders on INC-4421.", unread: true },
  { id: "ac3", kind: "dm", channelId: "d_mei", authorId: "u_mei", ts: "9:13 AM", text: "Advocacy intake up 40% MoM 🎯", unread: true },
  { id: "ac4", kind: "reply", channelId: "c_sales", authorId: "u_jared", ts: "8:52 AM", text: "Replied to your Acme thread.", unread: false },
  { id: "ac5", kind: "reaction", channelId: "c_eng", authorId: "u_lina", ts: "9:19 AM", text: "✅ reacted to your CPQ rollout note.", unread: false },
];

const QUICK_EMOJI = ["👍", "🎉", "🚀", "🔥", "🫡", "👀", "✅", "❤️"];

/* =========================================================================
   PRIMITIVES
   ========================================================================= */
function PresenceDot({ p, ring = "transparent" }: { p: Presence; ring?: string }) {
  const c = p === "active" ? SUCCESS : p === "dnd" ? MENTION : "#CBD5E1";
  const ringStyle = p === "away"
    ? { background: "transparent", border: `1.5px solid ${c}` }
    : { background: c };
  return <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ ...ringStyle, boxShadow: `0 0 0 1.5px ${ring}` }} />;
}

function Avatar({ m, size = 28, ring }: { m: Member; size?: number; ring?: string }) {
  const fs = Math.max(10, Math.round(size * 0.4));
  return (
    <div className="relative shrink-0">
      <div
        className="rounded-md grid place-items-center font-semibold text-white"
        style={{ width: size, height: size, fontSize: fs, background: stringToColor(m.id) }}
      >
        {m.initials}
      </div>
      <span className="absolute -bottom-0.5 -right-0.5"><PresenceDot p={m.presence} ring={ring ?? BG_PANEL} /></span>
    </div>
  );
}

function stringToColor(s: string) {
  // Limnn palette — deterministic but on-brand
  const palette = ["#2C69CF", "#7C3AED", "#0EA5E9", "#10B981", "#F59E0B", "#EF4444", "#EC4899"];
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return palette[h % palette.length];
}

function bumpReaction(m: Message, emoji: string): Message {
  const list = m.reactions ?? [];
  const idx = list.findIndex((r) => r.emoji === emoji);
  let next: Reaction[];
  if (idx < 0) next = [...list, { emoji, count: 1, me: true }];
  else {
    const cur = list[idx];
    const me = !cur.me;
    next = list.map((r, i) => i === idx ? { ...r, me, count: r.count + (me ? 1 : -1) } : r);
  }
  return { ...m, reactions: next.filter((r) => r.count > 0) };
}

function nowLabel() {
  return new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

/* =========================================================================
   AGGREGATE COUNTERS (used in sidebar badge)
   ========================================================================= */
export function useLimnnThreadUnread() {
  return [...CHANNELS, ...DMS].reduce((sum, c) => sum + (c.unread ?? 0), 0);
}
export function limnnThreadHasMention() {
  return [...CHANNELS, ...DMS].some((c) => c.mention) || ACTIVITY.some((a) => a.unread && a.kind === "mention");
}

/* =========================================================================
   MAIN COMPONENT — full Slack-style overlay
   ========================================================================= */
type View = "channel" | "activity" | "dms" | "saved" | "drafts";

export function LimnnThread({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [view, setView] = useState<View>("channel");
  const [channelId, setChannelId] = useState("c_eng");
  const [threadOpen, setThreadOpen] = useState<Message | null>(null);
  const [profileOpenFor, setProfileOpenFor] = useState<string | null>(null);
  const [prefsOpen, setPrefsOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [threadDraft, setThreadDraft] = useState("");
  const [data, setData] = useState<Record<string, Message[]>>(SEED);
  const [editing, setEditing] = useState<string | null>(null);
  const [banner, setBanner] = useState<{ author: string; text: string; channel: string } | null>(null);
  const [chSearch, setChSearch] = useState("");
  const [groupsOpen, setGroupsOpen] = useState({ channels: true, dms: true, apps: true });
  const scrollRef = useRef<HTMLDivElement>(null);
  const me = MEMBERS.u_anees;

  const all = useMemo(() => [...CHANNELS, ...DMS], []);
  const active = all.find((c) => c.id === channelId)!;
  const messages = data[channelId] ?? [];

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length, channelId]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => {
      setBanner({ author: "Mei Tanaka", text: "Northwind exec wants you on the QBR…", channel: "DM" });
      setTimeout(() => setBanner(null), 5200);
    }, 1500);
    return () => clearTimeout(t);
  }, [open]);

  // ESC closes
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (prefsOpen) setPrefsOpen(false);
        else if (profileOpenFor) setProfileOpenFor(null);
        else if (threadOpen) setThreadOpen(null);
        else onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, prefsOpen, profileOpenFor, threadOpen, onClose]);

  function send() {
    const text = draft.trim();
    if (!text) return;
    const msg: Message = { id: `m_${Date.now()}`, authorId: "u_anees", ts: nowLabel(), text };
    setData((d) => ({ ...d, [channelId]: [...(d[channelId] ?? []), msg] }));
    setDraft("");
  }
  function sendThread() {
    if (!threadOpen) return;
    const text = threadDraft.trim();
    if (!text) return;
    const reply: Message = { id: `r_${Date.now()}`, authorId: "u_anees", ts: nowLabel(), text };
    setData((d) => {
      const list = (d[channelId] ?? []).map((m) => m.id === threadOpen.id ? { ...m, replies: [...(m.replies ?? []), reply] } : m);
      return { ...d, [channelId]: list };
    });
    setThreadOpen((t) => t ? { ...t, replies: [...(t.replies ?? []), reply] } : t);
    setThreadDraft("");
  }
  function react(messageId: string, emoji: string, inThread = false) {
    setData((d) => {
      const list = (d[channelId] ?? []).map((m) => {
        if (inThread && threadOpen && m.id === threadOpen.id) {
          return { ...m, replies: (m.replies ?? []).map((r) => r.id === messageId ? bumpReaction(r, emoji) : r) };
        }
        if (m.id === messageId) return bumpReaction(m, emoji);
        return m;
      });
      return { ...d, [channelId]: list };
    });
  }
  function saveEdit(messageId: string, text: string) {
    setData((d) => {
      const list = (d[channelId] ?? []).map((m) => m.id === messageId ? { ...m, text, edited: true } : m);
      return { ...d, [channelId]: list };
    });
    setEditing(null);
  }

  if (!open) return null;

  const filteredChannels = CHANNELS.filter((c) => c.name.includes(chSearch.toLowerCase()));
  const filteredDms = DMS.filter((c) => c.name.toLowerCase().includes(chSearch.toLowerCase()));

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] animate-in fade-in duration-150"
        style={{ background: "rgba(15,23,42,0.45)", backdropFilter: "blur(2px)" }}
        onClick={onClose}
      />

      {/* Overlay shell */}
      <div
        className="fixed inset-3 md:inset-6 z-[61] rounded-xl overflow-hidden flex shadow-2xl animate-in zoom-in-95 fade-in duration-200"
        style={{ background: BG_DEEP, color: TEXT_LIGHT, fontFamily: "'Inter', sans-serif" }}
        role="dialog"
        aria-label="Limnn Threads"
      >
        {/* === 1. Workspace Rail === */}
        <nav
          className="w-[68px] shrink-0 flex flex-col items-center py-3 gap-1"
          style={{ background: BG_DEEP, borderRight: `1px solid ${BORDER_DARK}` }}
        >
          <button
            onClick={() => setPrefsOpen(true)}
            className="h-10 w-10 rounded-lg overflow-hidden grid place-items-center mb-2 ring-2 ring-transparent hover:ring-white/20 transition"
            style={{ background: "linear-gradient(135deg, #2C69CF, #7C3AED)" }}
            title="Limnn Workspace"
          >
            <img src={limnnLogo} alt="Limnn" className="h-5 w-auto opacity-90" />
          </button>

          <RailBtn icon={Home} label="Home" active={view === "channel"} onClick={() => setView("channel")} />
          <RailBtn icon={MessageSquare} label="DMs" badge={DMS.reduce((s, d) => s + (d.unread ?? 0), 0)} active={view === "dms"} onClick={() => setView("dms")} />
          <RailBtn icon={Activity} label="Activity" badge={ACTIVITY.filter((a) => a.unread).length} pulse active={view === "activity"} onClick={() => setView("activity")} />
          <RailBtn icon={Bookmark} label="Saved" active={view === "saved"} onClick={() => setView("saved")} />
          <RailBtn icon={FileText} label="Drafts" active={view === "drafts"} onClick={() => setView("drafts")} />
          <RailBtn icon={DotsH} label="More" />

          <div className="mt-auto flex flex-col items-center gap-2">
            <button
              onClick={() => setPrefsOpen(true)}
              className="h-9 w-9 rounded-md grid place-items-center hover:bg-white/5 transition"
              title="Preferences"
            >
              <Settings className="h-4 w-4" style={{ color: TEXT_DIM }} />
            </button>
            <button onClick={() => setProfileOpenFor("u_anees")} className="relative h-9 w-9 rounded-lg overflow-hidden hover:ring-2 hover:ring-white/30 transition" title="Your profile">
              <Avatar m={me} size={36} ring={BG_DEEP} />
            </button>
          </div>
        </nav>

        {/* === 2. Channel Sidebar === */}
        <aside
          className="w-[280px] shrink-0 flex flex-col"
          style={{ background: BG_PANEL, borderRight: `1px solid ${BORDER_DARK}` }}
        >
          {/* Workspace header */}
          <div className="px-4 py-3.5 flex items-center justify-between" style={{ borderBottom: `1px solid ${BORDER_DARK}` }}>
            <div className="min-w-0">
              <div className="text-[15px] font-bold tracking-tight truncate" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Limnn HQ
              </div>
              <div className="text-[11px] flex items-center gap-1.5 mt-0.5" style={{ color: TEXT_DIM }}>
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: SUCCESS }} />
                {Object.values(MEMBERS).filter((m) => m.presence === "active").length} online · 48 members
              </div>
            </div>
            <button onClick={onClose} className="h-7 w-7 grid place-items-center rounded-md hover:bg-white/10 transition" title="Close (Esc)">
              <X className="h-4 w-4" style={{ color: TEXT_DIM }} />
            </button>
          </div>

          {/* Search */}
          <div className="px-3 pt-3 pb-2">
            <label className="relative block">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: TEXT_DIM }} />
              <input
                value={chSearch}
                onChange={(e) => setChSearch(e.target.value)}
                placeholder="Jump to or search…"
                className="w-full h-8 pl-8 pr-2 rounded-md text-[12.5px] outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/40"
                style={{ background: "rgba(255,255,255,0.06)", color: TEXT_LIGHT, border: `1px solid ${BORDER_DARK}` }}
              />
            </label>
          </div>

          {/* Body — scroll */}
          <div className="flex-1 overflow-y-auto pb-3">
            {/* Quick actions */}
            <SideRow icon={MessageSquare} label="Threads" onClick={() => setView("channel")} />
            <SideRow icon={AtSign} label="Mentions & reactions" badge={ACTIVITY.filter((a) => a.unread && (a.kind === "mention" || a.kind === "reaction")).length} onClick={() => setView("activity")} />
            <SideRow icon={Bookmark} label="Saved items" onClick={() => setView("saved")} />
            <SideRow icon={FileText} label="Drafts & sent" onClick={() => setView("drafts")} />

            {/* Channels group */}
            <GroupHeader open={groupsOpen.channels} onToggle={() => setGroupsOpen((g) => ({ ...g, channels: !g.channels }))} label="Channels" action={<Plus className="h-3.5 w-3.5" />} />
            {groupsOpen.channels && filteredChannels.map((c) => (
              <ChannelRow key={c.id} c={c} active={c.id === channelId && view === "channel"} onClick={() => { setChannelId(c.id); setView("channel"); setThreadOpen(null); }} />
            ))}

            {/* DMs group */}
            <GroupHeader open={groupsOpen.dms} onToggle={() => setGroupsOpen((g) => ({ ...g, dms: !g.dms }))} label="Direct messages" action={<Plus className="h-3.5 w-3.5" />} />
            {groupsOpen.dms && filteredDms.map((c) => {
              const m = MEMBERS[c.memberIds![0]];
              return (
                <button
                  key={c.id}
                  onClick={() => { setChannelId(c.id); setView("channel"); setThreadOpen(null); }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-[13px] hover:bg-white/5 transition"
                  style={{
                    background: c.id === channelId && view === "channel" ? ACCENT : "transparent",
                    color: (c.unread || c.mention) ? TEXT_LIGHT : TEXT_DIM,
                    fontWeight: c.unread || c.mention ? 600 : 400,
                  }}
                >
                  <Avatar m={m} size={20} ring={BG_PANEL} />
                  <span className="truncate flex-1 text-left">{m.name}</span>
                  {c.mention && <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: MENTION }} />}
                  {!!c.unread && !c.mention && (
                    <span className="text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full grid place-items-center text-white" style={{ background: ACCENT }}>
                      {c.unread}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Apps */}
            <GroupHeader open={groupsOpen.apps} onToggle={() => setGroupsOpen((g) => ({ ...g, apps: !g.apps }))} label="Apps" action={<Plus className="h-3.5 w-3.5" />} />
            {groupsOpen.apps && (
              <>
                <SideRow icon={Sparkles} label="Limnn AI" iconColor={ACCENT} />
                <SideRow icon={Bell} label="Alerts bot" />
                <SideRow icon={ShieldCheck} label="Deploybot" />
              </>
            )}
          </div>

          {/* Footer — me */}
          <div className="px-3 py-2.5 flex items-center gap-2.5" style={{ borderTop: `1px solid ${BORDER_DARK}` }}>
            <button onClick={() => setProfileOpenFor("u_anees")}>
              <Avatar m={me} size={30} ring={BG_PANEL} />
            </button>
            <div className="min-w-0 flex-1">
              <div className="text-[12.5px] font-semibold truncate">{me.name}</div>
              <button onClick={() => setProfileOpenFor("u_anees")} className="text-[10.5px] truncate text-left hover:underline" style={{ color: TEXT_DIM }}>
                {me.status || "Set a status"}
              </button>
            </div>
            <button onClick={() => setPrefsOpen(true)} className="h-7 w-7 grid place-items-center rounded-md hover:bg-white/10 transition" title="Preferences">
              <Settings className="h-3.5 w-3.5" style={{ color: TEXT_DIM }} />
            </button>
          </div>
        </aside>

        {/* === 3. Center Canvas === */}
        <section className="flex-1 min-w-0 flex flex-col" style={{ background: BG_CANVAS, color: TEXT_INK }}>
          {view === "channel" && (
            <ChannelView
              channel={active}
              messages={messages}
              onOpenThread={setThreadOpen}
              onOpenProfile={setProfileOpenFor}
              onReact={react}
              editing={editing}
              setEditing={setEditing}
              saveEdit={saveEdit}
              draft={draft}
              setDraft={setDraft}
              onSend={send}
              scrollRef={scrollRef}
            />
          )}
          {view === "activity" && <ActivityView onJump={(chId) => { setChannelId(chId); setView("channel"); }} onOpenProfile={setProfileOpenFor} />}
          {view === "dms" && <DMListView onPick={(id) => { setChannelId(id); setView("channel"); }} />}
          {view === "saved" && <EmptyState icon={Bookmark} title="Saved for later" body="Hover any message and bookmark it to save context here." />}
          {view === "drafts" && <EmptyState icon={FileText} title="Drafts & sent" body="Messages you started but didn’t send will live here. Auto-saved every keystroke." />}
        </section>

        {/* === 4. Thread / Profile pane === */}
        {(threadOpen || profileOpenFor) && (
          <aside
            className="w-[400px] shrink-0 flex flex-col animate-in slide-in-from-right duration-200"
            style={{ background: BG_THREAD, color: TEXT_INK, borderLeft: `1px solid ${BORDER_LIGHT}` }}
          >
            {profileOpenFor ? (
              <ProfilePane
                member={MEMBERS[profileOpenFor]}
                isSelf={profileOpenFor === "u_anees"}
                onClose={() => setProfileOpenFor(null)}
                onOpenPrefs={() => { setProfileOpenFor(null); setPrefsOpen(true); }}
              />
            ) : threadOpen ? (
              <ThreadPane
                root={threadOpen}
                channelName={active.name}
                onClose={() => setThreadOpen(null)}
                onOpenProfile={setProfileOpenFor}
                onReact={(id, e) => react(id, e, true)}
                draft={threadDraft}
                setDraft={setThreadDraft}
                onSend={sendThread}
              />
            ) : null}
          </aside>
        )}

        {/* === Floating banner notification === */}
        {banner && (
          <div className="absolute top-4 right-6 z-20 max-w-sm rounded-xl px-4 py-3 shadow-xl flex items-start gap-3 animate-in slide-in-from-top duration-300"
               style={{ background: "rgba(15,23,42,0.95)", color: TEXT_LIGHT, border: `1px solid ${BORDER_DARK}` }}>
            <div className="h-8 w-8 rounded-md grid place-items-center shrink-0" style={{ background: ACCENT_SOFT }}>
              <Bell className="h-4 w-4" style={{ color: ACCENT }} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[12.5px] font-semibold">{banner.author} <span className="font-normal text-slate-400">· {banner.channel}</span></div>
              <div className="text-[12px] truncate" style={{ color: TEXT_DIM }}>{banner.text}</div>
            </div>
            <button onClick={() => setBanner(null)} className="h-5 w-5 grid place-items-center rounded hover:bg-white/10">
              <X className="h-3.5 w-3.5" style={{ color: TEXT_DIM }} />
            </button>
          </div>
        )}
      </div>

      {/* === Preferences modal === */}
      {prefsOpen && <PreferencesModal onClose={() => setPrefsOpen(false)} />}
    </>
  );
}

/* =========================================================================
   RAIL BUTTON
   ========================================================================= */
function RailBtn({ icon: Icon, label, active, onClick, badge, pulse }: { icon: any; label: string; active?: boolean; onClick?: () => void; badge?: number; pulse?: boolean }) {
  return (
    <button
      onClick={onClick}
      className="group relative h-11 w-11 rounded-lg grid place-items-center transition"
      style={{ background: active ? "rgba(44,105,207,0.18)" : "transparent" }}
      title={label}
      onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = HOVER_DARK; }}
      onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
    >
      <Icon className="h-[18px] w-[18px]" style={{ color: active ? "#7DB1FF" : TEXT_DIM }} strokeWidth={active ? 2.4 : 2} />
      <span className="absolute left-[58px] z-50 px-2 py-1 rounded-md text-[11px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition"
            style={{ background: "rgba(15,23,42,0.95)", color: TEXT_LIGHT, border: `1px solid ${BORDER_DARK}` }}>
        {label}
      </span>
      {!!badge && badge > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] px-1 rounded-full text-[9px] font-bold text-white grid place-items-center"
              style={{ background: pulse ? MENTION : ACCENT }}>
          {badge > 99 ? "99+" : badge}
        </span>
      )}
      {pulse && !!badge && <span className="absolute -top-0.5 -right-0.5 h-[16px] w-[16px] rounded-full animate-ping" style={{ background: MENTION, opacity: 0.4 }} />}
    </button>
  );
}

/* =========================================================================
   SIDEBAR ROWS
   ========================================================================= */
function SideRow({ icon: Icon, label, badge, onClick, iconColor }: { icon: any; label: string; badge?: number; onClick?: () => void; iconColor?: string }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-2.5 px-3 py-1.5 text-[13px] hover:bg-white/5 transition" style={{ color: TEXT_DIM }}>
      <Icon className="h-[14px] w-[14px]" style={{ color: iconColor ?? TEXT_DIM }} />
      <span className="flex-1 text-left">{label}</span>
      {!!badge && badge > 0 && (
        <span className="text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full grid place-items-center text-white" style={{ background: MENTION }}>{badge}</span>
      )}
    </button>
  );
}

function GroupHeader({ open, onToggle, label, action }: { open: boolean; onToggle: () => void; label: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-2.5 mt-4 mb-0.5 group">
      <button onClick={onToggle} className="flex items-center gap-1 text-[10.5px] uppercase tracking-[0.12em] font-semibold px-1 py-1 rounded hover:bg-white/5" style={{ color: TEXT_DIM }}>
        <ChevronDown className="h-3 w-3 transition-transform" style={{ transform: open ? "rotate(0deg)" : "rotate(-90deg)" }} />
        {label}
      </button>
      {action && (
        <button className="h-6 w-6 grid place-items-center rounded opacity-0 group-hover:opacity-100 hover:bg-white/10 transition" style={{ color: TEXT_DIM }}>
          {action}
        </button>
      )}
    </div>
  );
}

function ChannelRow({ c, active, onClick }: { c: Channel; active: boolean; onClick: () => void }) {
  const Icon = c.private ? Lock : Hash;
  const isLoud = !!c.unread || !!c.mention;
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2 px-3 py-1.5 text-[13px] transition hover:bg-white/5"
      style={{
        background: active ? ACCENT : "transparent",
        color: active ? TEXT_LIGHT : isLoud ? TEXT_LIGHT : TEXT_DIM,
        fontWeight: active || isLoud ? 600 : 400,
      }}
    >
      <Icon className="h-3.5 w-3.5 opacity-80" />
      <span className="truncate flex-1 text-left">{c.name}</span>
      {c.muted && <span className="text-[9px]" style={{ color: TEXT_DIM }}>muted</span>}
      {c.mention && <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: MENTION }} />}
      {!!c.unread && !c.mention && (
        <span className="text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full grid place-items-center text-white" style={{ background: ACCENT }}>
          {c.unread}
        </span>
      )}
    </button>
  );
}

/* =========================================================================
   CHANNEL VIEW
   ========================================================================= */
function ChannelView({
  channel, messages, onOpenThread, onOpenProfile, onReact, editing, setEditing, saveEdit, draft, setDraft, onSend, scrollRef,
}: {
  channel: Channel;
  messages: Message[];
  onOpenThread: (m: Message) => void;
  onOpenProfile: (id: string) => void;
  onReact: (id: string, e: string) => void;
  editing: string | null;
  setEditing: (id: string | null) => void;
  saveEdit: (id: string, text: string) => void;
  draft: string;
  setDraft: (s: string) => void;
  onSend: () => void;
  scrollRef: React.RefObject<HTMLDivElement | null>;
}) {
  const pinned = messages.find((m) => m.pinned);
  const isDm = channel.kind === "dm";
  const headerMember = isDm ? MEMBERS[channel.memberIds![0]] : null;

  return (
    <>
      {/* Channel header */}
      <header className="h-14 px-5 flex items-center justify-between shrink-0" style={{ borderBottom: `1px solid ${BORDER_LIGHT}`, background: "#FFFFFF" }}>
        <div className="flex items-center gap-2.5 min-w-0">
          {isDm && headerMember ? <Avatar m={headerMember} size={26} ring="#FFFFFF" /> : (
            <div className="h-7 w-7 rounded-md grid place-items-center" style={{ background: ACCENT_SOFT }}>
              {channel.private ? <Lock className="h-3.5 w-3.5" style={{ color: ACCENT }} /> : <Hash className="h-3.5 w-3.5" style={{ color: ACCENT }} />}
            </div>
          )}
          <div className="min-w-0">
            <div className="text-[15px] font-bold tracking-tight flex items-center gap-1.5" style={{ fontFamily: "'Poppins', sans-serif", color: TEXT_INK }}>
              {isDm ? headerMember!.name : channel.name}
              <ChevronDown className="h-3.5 w-3.5" style={{ color: TEXT_MUTED_INK }} />
            </div>
            <div className="text-[11.5px] truncate" style={{ color: TEXT_MUTED_INK }}>
              {isDm ? headerMember!.title : channel.topic}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <HeaderBtn icon={Headphones} label="Huddle" />
          <HeaderBtn icon={Video} label="Video" />
          <HeaderBtn icon={Phone} label="Call" />
          <div className="mx-1.5 h-5 w-px" style={{ background: BORDER_LIGHT }} />
          <HeaderBtn icon={Pin} label="Pins" />
          <HeaderBtn icon={Bell} label="Notifications" />
          <HeaderBtn icon={Search} label="Search" />
          <HeaderBtn icon={MoreHorizontal} label="More" />
        </div>
      </header>

      {/* Pinned banner */}
      {pinned && (
        <div className="px-5 py-2 flex items-center gap-2 text-[12px]" style={{ background: "rgba(245,158,11,0.08)", borderBottom: `1px solid ${BORDER_LIGHT}`, color: TEXT_BODY }}>
          <Pin className="h-3 w-3" style={{ color: WARN }} />
          <span className="font-semibold">Pinned:</span>
          <span className="truncate" style={{ color: TEXT_MUTED_INK }}>{pinned.text}</span>
        </div>
      )}

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-1 py-3">
        <DateDivider label="Today" />
        {messages.map((m) => (
          <MessageRow
            key={m.id}
            m={m}
            onOpenThread={() => onOpenThread(m)}
            onOpenProfile={onOpenProfile}
            onReact={(e) => onReact(m.id, e)}
            editing={editing === m.id}
            startEdit={() => setEditing(m.id)}
            saveEdit={(t) => saveEdit(m.id, t)}
            cancelEdit={() => setEditing(null)}
          />
        ))}
        {messages.length === 0 && <EmptyState icon={Hash} title={`Welcome to #${channel.name}`} body="This is the start of the channel. Send a message to kick it off." />}
      </div>

      {/* Composer */}
      <Composer value={draft} onChange={setDraft} onSend={onSend} placeholder={`Message ${isDm ? headerMember!.name : "#" + channel.name}`} />
    </>
  );
}

function HeaderBtn({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <button className="h-8 w-8 grid place-items-center rounded-md hover:bg-slate-100 transition" title={label}>
      <Icon className="h-4 w-4" style={{ color: TEXT_MUTED_INK }} />
    </button>
  );
}

function DateDivider({ label }: { label: string }) {
  return (
    <div className="relative my-3 px-5 flex items-center">
      <div className="flex-1 h-px" style={{ background: BORDER_LIGHT }} />
      <div className="px-3 text-[11px] font-semibold rounded-full border" style={{ borderColor: BORDER_LIGHT, color: TEXT_MUTED_INK, background: "#FFFFFF" }}>
        {label}
      </div>
      <div className="flex-1 h-px" style={{ background: BORDER_LIGHT }} />
    </div>
  );
}

/* =========================================================================
   MESSAGE ROW
   ========================================================================= */
function MessageRow({
  m, onOpenThread, onOpenProfile, onReact, editing, startEdit, saveEdit, cancelEdit, compact = false,
}: {
  m: Message;
  onOpenThread?: () => void;
  onOpenProfile: (id: string) => void;
  onReact: (e: string) => void;
  editing: boolean;
  startEdit: () => void;
  saveEdit: (t: string) => void;
  cancelEdit: () => void;
  compact?: boolean;
}) {
  const author = MEMBERS[m.authorId];
  const [editText, setEditText] = useState(m.text);
  const replyCount = m.replies?.length ?? 0;

  return (
    <div className="group relative px-5 py-1.5 hover:bg-slate-50 transition">
      <div className="flex gap-3">
        <button onClick={() => onOpenProfile(author.id)} className="shrink-0 mt-0.5">
          <Avatar m={author} size={compact ? 28 : 36} ring="#FFFFFF" />
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <button onClick={() => onOpenProfile(author.id)} className="text-[14px] font-bold hover:underline" style={{ color: TEXT_INK, fontFamily: "'Poppins', sans-serif" }}>
              {author.name}
            </button>
            {author.title && <span className="text-[10.5px] px-1.5 py-px rounded" style={{ background: ACCENT_SOFT, color: ACCENT }}>{author.title}</span>}
            <span className="text-[11px]" style={{ color: TEXT_MUTED_INK }}>{m.ts}</span>
            {m.edited && <span className="text-[10px]" style={{ color: TEXT_MUTED_INK }}>(edited)</span>}
          </div>

          {editing ? (
            <div className="mt-1">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full rounded-md border px-2.5 py-2 text-[13.5px] outline-none focus:ring-2 focus:ring-blue-500/30"
                style={{ borderColor: BORDER_LIGHT, color: TEXT_BODY }}
                rows={2}
                autoFocus
              />
              <div className="mt-1.5 flex items-center justify-end gap-2">
                <button onClick={cancelEdit} className="text-[12px] px-2.5 py-1 rounded-md hover:bg-slate-100" style={{ color: TEXT_MUTED_INK }}>Cancel</button>
                <button onClick={() => saveEdit(editText)} className="text-[12px] px-3 py-1 rounded-md text-white font-medium" style={{ background: ACCENT }}>Save</button>
              </div>
            </div>
          ) : (
            <div className="mt-0.5 text-[13.5px] leading-[1.55]" style={{ color: TEXT_BODY }}>
              <MessageText text={m.text} />
            </div>
          )}

          {/* Reactions */}
          {!!m.reactions?.length && (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {m.reactions.map((r) => (
                <button
                  key={r.emoji}
                  onClick={() => onReact(r.emoji)}
                  className="inline-flex items-center gap-1 h-6 px-2 rounded-full border text-[11.5px] font-medium transition"
                  style={{
                    background: r.me ? ACCENT_SOFT : "#FFFFFF",
                    borderColor: r.me ? "rgba(44,105,207,0.4)" : BORDER_LIGHT,
                    color: r.me ? ACCENT : TEXT_BODY,
                  }}
                >
                  <span>{r.emoji}</span>
                  <span className="tabular-nums">{r.count}</span>
                </button>
              ))}
              <button onClick={() => onReact("👍")} className="h-6 w-6 grid place-items-center rounded-full border hover:bg-slate-100 transition" style={{ borderColor: BORDER_LIGHT }}>
                <Smile className="h-3 w-3" style={{ color: TEXT_MUTED_INK }} />
              </button>
            </div>
          )}

          {/* Thread footer */}
          {replyCount > 0 && onOpenThread && (
            <button
              onClick={onOpenThread}
              className="mt-2 inline-flex items-center gap-2 px-2.5 py-1 rounded-md border hover:border-blue-300 hover:bg-blue-50/40 transition text-[12px]"
              style={{ borderColor: BORDER_LIGHT, color: ACCENT }}
            >
              <div className="flex -space-x-1">
                {(m.replies ?? []).slice(0, 3).map((r) => <Avatar key={r.id} m={MEMBERS[r.authorId]} size={18} ring="#FFFFFF" />)}
              </div>
              <span className="font-semibold">{replyCount} {replyCount === 1 ? "reply" : "replies"}</span>
              <span style={{ color: TEXT_MUTED_INK }}>· View thread</span>
            </button>
          )}
        </div>
      </div>

      {/* Hover action bar */}
      <div className="absolute -top-3 right-5 opacity-0 group-hover:opacity-100 transition flex items-center gap-0.5 rounded-md border bg-white shadow-md px-1 py-0.5" style={{ borderColor: BORDER_LIGHT }}>
        {QUICK_EMOJI.slice(0, 5).map((e) => (
          <button key={e} onClick={() => onReact(e)} className="h-7 w-7 grid place-items-center rounded hover:bg-slate-100 text-[14px]">{e}</button>
        ))}
        <div className="w-px h-5 mx-0.5" style={{ background: BORDER_LIGHT }} />
        {onOpenThread && (
          <button onClick={onOpenThread} className="h-7 w-7 grid place-items-center rounded hover:bg-slate-100" title="Reply in thread">
            <Reply className="h-3.5 w-3.5" style={{ color: TEXT_MUTED_INK }} />
          </button>
        )}
        <button className="h-7 w-7 grid place-items-center rounded hover:bg-slate-100" title="Save">
          <Bookmark className="h-3.5 w-3.5" style={{ color: TEXT_MUTED_INK }} />
        </button>
        {m.authorId === "u_anees" && !editing && (
          <button onClick={startEdit} className="h-7 w-7 grid place-items-center rounded hover:bg-slate-100" title="Edit">
            <Pencil className="h-3.5 w-3.5" style={{ color: TEXT_MUTED_INK }} />
          </button>
        )}
        <button className="h-7 w-7 grid place-items-center rounded hover:bg-slate-100" title="More">
          <MoreHorizontal className="h-3.5 w-3.5" style={{ color: TEXT_MUTED_INK }} />
        </button>
      </div>
    </div>
  );
}

function MessageText({ text }: { text: string }) {
  // simple @mention + #channel + `code` styling
  const parts = text.split(/(\s+)/).map((p, i) => {
    if (p.startsWith("@")) return <span key={i} className="font-semibold px-1 rounded" style={{ background: ACCENT_SOFT, color: ACCENT }}>{p}</span>;
    if (p.startsWith("#")) return <span key={i} className="font-semibold" style={{ color: ACCENT }}>{p}</span>;
    if (p.startsWith("`") && p.endsWith("`")) return <code key={i} className="px-1.5 py-0.5 rounded text-[12px] font-mono" style={{ background: "#F1F5F9", color: "#7C3AED" }}>{p.slice(1, -1)}</code>;
    return <span key={i}>{p}</span>;
  });
  return <>{parts}</>;
}

/* =========================================================================
   COMPOSER
   ========================================================================= */
function Composer({ value, onChange, onSend, placeholder, compact = false }: { value: string; onChange: (s: string) => void; onSend: () => void; placeholder: string; compact?: boolean }) {
  return (
    <div className={compact ? "px-3 pb-3" : "px-5 pb-4 pt-2"} style={{ background: BG_CANVAS }}>
      <div className="rounded-xl border bg-white overflow-hidden shadow-sm" style={{ borderColor: BORDER_LIGHT }}>
        {/* Toolbar */}
        <div className="flex items-center gap-0.5 px-2 py-1.5 border-b" style={{ borderColor: BORDER_LIGHT }}>
          <ComposerBtn icon={Bold} />
          <ComposerBtn icon={Italic} />
          <ComposerBtn icon={Link2} />
          <div className="w-px h-4 mx-1" style={{ background: BORDER_LIGHT }} />
          <ComposerBtn icon={List} />
          <ComposerBtn icon={ListOrdered} />
          <ComposerBtn icon={Code2} />
        </div>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSend(); } }}
          placeholder={placeholder}
          rows={compact ? 2 : 3}
          className="w-full px-3.5 py-2.5 text-[13.5px] outline-none resize-none placeholder:text-slate-400"
          style={{ color: TEXT_BODY }}
        />
        {/* Footer */}
        <div className="flex items-center justify-between px-2 py-1.5 border-t" style={{ borderColor: BORDER_LIGHT }}>
          <div className="flex items-center gap-0.5">
            <ComposerBtn icon={Plus} />
            <ComposerBtn icon={Paperclip} />
            <ComposerBtn icon={AtSign} />
            <ComposerBtn icon={Smile} />
            <ComposerBtn icon={Mic} />
          </div>
          <button
            onClick={onSend}
            disabled={!value.trim()}
            className="h-8 px-3 rounded-md text-[12.5px] font-semibold text-white inline-flex items-center gap-1.5 transition disabled:opacity-40"
            style={{ background: ACCENT }}
          >
            <Send className="h-3.5 w-3.5" /> Send
          </button>
        </div>
      </div>
    </div>
  );
}

function ComposerBtn({ icon: Icon }: { icon: any }) {
  return (
    <button className="h-7 w-7 grid place-items-center rounded hover:bg-slate-100 transition">
      <Icon className="h-3.5 w-3.5" style={{ color: TEXT_MUTED_INK }} />
    </button>
  );
}

/* =========================================================================
   THREAD PANE
   ========================================================================= */
function ThreadPane({
  root, channelName, onClose, onOpenProfile, onReact, draft, setDraft, onSend,
}: {
  root: Message; channelName: string; onClose: () => void; onOpenProfile: (id: string) => void; onReact: (id: string, e: string) => void; draft: string; setDraft: (s: string) => void; onSend: () => void;
}) {
  return (
    <>
      <header className="h-14 px-4 flex items-center justify-between shrink-0" style={{ borderBottom: `1px solid ${BORDER_LIGHT}` }}>
        <div>
          <div className="text-[14px] font-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>Thread</div>
          <div className="text-[11px]" style={{ color: TEXT_MUTED_INK }}>#{channelName}</div>
        </div>
        <button onClick={onClose} className="h-8 w-8 grid place-items-center rounded-md hover:bg-slate-100">
          <X className="h-4 w-4" style={{ color: TEXT_MUTED_INK }} />
        </button>
      </header>
      <div className="flex-1 overflow-y-auto">
        <MessageRow m={root} onOpenProfile={onOpenProfile} onReact={(e) => onReact(root.id, e)} editing={false} startEdit={() => {}} saveEdit={() => {}} cancelEdit={() => {}} />
        <div className="px-5 py-2 text-[11px] font-semibold flex items-center gap-2" style={{ color: TEXT_MUTED_INK }}>
          <div className="flex-1 h-px" style={{ background: BORDER_LIGHT }} />
          {(root.replies?.length ?? 0)} {root.replies?.length === 1 ? "reply" : "replies"}
          <div className="flex-1 h-px" style={{ background: BORDER_LIGHT }} />
        </div>
        {(root.replies ?? []).map((r) => (
          <MessageRow key={r.id} m={r} onOpenProfile={onOpenProfile} onReact={(e) => onReact(r.id, e)} editing={false} startEdit={() => {}} saveEdit={() => {}} cancelEdit={() => {}} compact />
        ))}
      </div>
      <Composer value={draft} onChange={setDraft} onSend={onSend} placeholder="Reply…" compact />
    </>
  );
}

/* =========================================================================
   PROFILE PANE (clicking an avatar)
   ========================================================================= */
function ProfilePane({ member, isSelf, onClose, onOpenPrefs }: { member: Member; isSelf: boolean; onClose: () => void; onOpenPrefs: () => void }) {
  const localTime = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  return (
    <>
      <header className="h-14 px-4 flex items-center justify-between shrink-0" style={{ borderBottom: `1px solid ${BORDER_LIGHT}` }}>
        <div className="text-[14px] font-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>Profile</div>
        <button onClick={onClose} className="h-8 w-8 grid place-items-center rounded-md hover:bg-slate-100">
          <X className="h-4 w-4" style={{ color: TEXT_MUTED_INK }} />
        </button>
      </header>
      <div className="flex-1 overflow-y-auto">
        <div className="p-5">
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="h-20 w-20 rounded-xl grid place-items-center text-white font-bold text-[28px]" style={{ background: stringToColor(member.id), fontFamily: "'Poppins', sans-serif" }}>
                {member.initials}
              </div>
              {isSelf && (
                <button className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-white shadow-md grid place-items-center border" style={{ borderColor: BORDER_LIGHT }}>
                  <Camera className="h-3.5 w-3.5" style={{ color: TEXT_MUTED_INK }} />
                </button>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <div className="text-[18px] font-bold" style={{ fontFamily: "'Poppins', sans-serif", color: TEXT_INK }}>{member.name}</div>
                <PresenceDot p={member.presence} ring="#FFFFFF" />
              </div>
              <div className="text-[12.5px]" style={{ color: TEXT_MUTED_INK }}>{member.title}</div>
              {member.status && (
                <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 rounded-full border text-[12px]" style={{ borderColor: BORDER_LIGHT, background: "#FAFAFA", color: TEXT_BODY }}>
                  {member.status}
                </div>
              )}
              <div className="mt-2 text-[11.5px] flex items-center gap-1.5" style={{ color: TEXT_MUTED_INK }}>
                <Clock className="h-3 w-3" /> {localTime} local time
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-5 grid grid-cols-4 gap-2">
            {[
              { icon: MessageSquare, label: "Message" },
              { icon: Phone, label: "Call" },
              { icon: Video, label: "Huddle" },
              { icon: MoreHorizontal, label: "More" },
            ].map((a) => (
              <button key={a.label} className="flex flex-col items-center gap-1 py-2.5 rounded-lg border hover:bg-slate-50 transition" style={{ borderColor: BORDER_LIGHT }}>
                <a.icon className="h-4 w-4" style={{ color: ACCENT }} />
                <span className="text-[11px] font-medium" style={{ color: TEXT_BODY }}>{a.label}</span>
              </button>
            ))}
          </div>

          {/* Self quick edits */}
          {isSelf && (
            <div className="mt-5 space-y-3">
              <ProfileField label="Display name" defaultValue={member.name} />
              <ProfileField label="What I do" defaultValue={member.title ?? ""} />
              <ProfileField label="Status" defaultValue={member.status ?? ""} placeholder="What's happening?" />
              <div className="grid grid-cols-2 gap-2">
                <ProfileField label="Pronouns" placeholder="they/them" />
                <ProfileField label="Time zone" defaultValue="America/Los Angeles" />
              </div>
              <button onClick={onOpenPrefs} className="w-full mt-2 h-10 rounded-lg text-[13px] font-semibold flex items-center justify-center gap-2 border hover:bg-slate-50 transition" style={{ borderColor: BORDER_LIGHT, color: TEXT_BODY }}>
                <Settings className="h-4 w-4" /> Open all preferences
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function ProfileField({ label, defaultValue, placeholder }: { label: string; defaultValue?: string; placeholder?: string }) {
  return (
    <label className="block">
      <div className="text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: TEXT_MUTED_INK }}>{label}</div>
      <input
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full h-9 px-3 rounded-md border text-[13px] outline-none focus:ring-2 focus:ring-blue-500/30"
        style={{ borderColor: BORDER_LIGHT, color: TEXT_BODY }}
      />
    </label>
  );
}

/* =========================================================================
   ACTIVITY VIEW
   ========================================================================= */
function ActivityView({ onJump, onOpenProfile }: { onJump: (chId: string) => void; onOpenProfile: (id: string) => void }) {
  const [filter, setFilter] = useState<"all" | "mention" | "reply" | "reaction" | "dm">("all");
  const items = ACTIVITY.filter((a) => filter === "all" || a.kind === filter);
  return (
    <>
      <header className="h-14 px-5 flex items-center justify-between shrink-0 bg-white" style={{ borderBottom: `1px solid ${BORDER_LIGHT}` }}>
        <div>
          <div className="text-[15px] font-bold" style={{ fontFamily: "'Poppins', sans-serif", color: TEXT_INK }}>Activity</div>
          <div className="text-[11.5px]" style={{ color: TEXT_MUTED_INK }}>Mentions, replies and reactions across Limnn HQ</div>
        </div>
        <button className="text-[12px] font-medium inline-flex items-center gap-1.5 px-3 h-8 rounded-md border hover:bg-slate-50" style={{ borderColor: BORDER_LIGHT, color: TEXT_BODY }}>
          <CheckCheck className="h-3.5 w-3.5" /> Mark all read
        </button>
      </header>
      {/* Filter chips */}
      <div className="px-5 py-2.5 flex items-center gap-2 bg-white" style={{ borderBottom: `1px solid ${BORDER_LIGHT}` }}>
        <Filter className="h-3.5 w-3.5" style={{ color: TEXT_MUTED_INK }} />
        {(["all", "mention", "reply", "reaction", "dm"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="text-[11.5px] font-medium px-2.5 h-7 rounded-full border transition capitalize"
            style={{
              borderColor: filter === f ? ACCENT : BORDER_LIGHT,
              background: filter === f ? ACCENT_SOFT : "#FFFFFF",
              color: filter === f ? ACCENT : TEXT_BODY,
            }}
          >
            {f === "dm" ? "Direct messages" : f}
          </button>
        ))}
      </div>
      {/* Items */}
      <div className="flex-1 overflow-y-auto py-2">
        {items.map((a) => {
          const author = MEMBERS[a.authorId];
          const ch = [...CHANNELS, ...DMS].find((c) => c.id === a.channelId);
          const iconMap = { mention: AtSign, reply: CornerDownRight, reaction: Smile, dm: MessageSquare };
          const Icon = iconMap[a.kind];
          return (
            <button
              key={a.id}
              onClick={() => onJump(a.channelId)}
              className="w-full text-left px-5 py-3 flex items-start gap-3 hover:bg-slate-50 transition border-l-2"
              style={{ borderColor: a.unread ? ACCENT : "transparent" }}
            >
              <div className="relative">
                <Avatar m={author} size={34} ring={BG_CANVAS} />
                <span className="absolute -bottom-1 -right-1 h-5 w-5 grid place-items-center rounded-full bg-white border" style={{ borderColor: BORDER_LIGHT }}>
                  <Icon className="h-2.5 w-2.5" style={{ color: ACCENT }} />
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-[13px] font-semibold" style={{ color: TEXT_INK }}>{author.name}</span>
                  <span className="text-[11px]" style={{ color: TEXT_MUTED_INK }}>in {ch?.kind === "dm" ? "DM" : `#${ch?.name}`}</span>
                  <span className="text-[11px] ml-auto" style={{ color: TEXT_MUTED_INK }}>{a.ts}</span>
                </div>
                <div className="text-[12.5px] mt-0.5" style={{ color: TEXT_BODY }}>{a.text}</div>
              </div>
              {a.unread && <span className="mt-2 h-2 w-2 rounded-full" style={{ background: ACCENT }} />}
            </button>
          );
        })}
      </div>
    </>
  );
}

/* =========================================================================
   DM LIST + EMPTY STATE
   ========================================================================= */
function DMListView({ onPick }: { onPick: (id: string) => void }) {
  return (
    <>
      <header className="h-14 px-5 flex items-center justify-between shrink-0 bg-white" style={{ borderBottom: `1px solid ${BORDER_LIGHT}` }}>
        <div>
          <div className="text-[15px] font-bold" style={{ fontFamily: "'Poppins', sans-serif", color: TEXT_INK }}>Direct messages</div>
          <div className="text-[11.5px]" style={{ color: TEXT_MUTED_INK }}>Private conversations across your workspace</div>
        </div>
        <button className="h-8 px-3 rounded-md text-[12.5px] font-semibold text-white inline-flex items-center gap-1.5" style={{ background: ACCENT }}>
          <Edit3 className="h-3.5 w-3.5" /> New message
        </button>
      </header>
      <div className="flex-1 overflow-y-auto py-1">
        {DMS.map((d) => {
          const m = MEMBERS[d.memberIds![0]];
          return (
            <button key={d.id} onClick={() => onPick(d.id)} className="w-full px-5 py-3 flex items-center gap-3 hover:bg-slate-50 transition text-left">
              <Avatar m={m} size={36} ring={BG_CANVAS} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[13.5px] font-semibold" style={{ color: TEXT_INK }}>{m.name}</span>
                  {m.title && <span className="text-[10.5px]" style={{ color: TEXT_MUTED_INK }}>· {m.title}</span>}
                </div>
                <div className="text-[12px] truncate" style={{ color: TEXT_MUTED_INK }}>{m.status ?? "—"}</div>
              </div>
              {!!d.unread && (
                <span className="text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full grid place-items-center text-white" style={{ background: d.mention ? MENTION : ACCENT }}>{d.unread}</span>
              )}
            </button>
          );
        })}
      </div>
    </>
  );
}

function EmptyState({ icon: Icon, title, body }: { icon: any; title: string; body: string }) {
  return (
    <div className="flex-1 grid place-items-center px-6">
      <div className="text-center max-w-sm">
        <div className="mx-auto h-14 w-14 rounded-2xl grid place-items-center mb-3" style={{ background: ACCENT_SOFT }}>
          <Icon className="h-6 w-6" style={{ color: ACCENT }} />
        </div>
        <div className="text-[16px] font-bold" style={{ fontFamily: "'Poppins', sans-serif", color: TEXT_INK }}>{title}</div>
        <div className="text-[13px] mt-1.5" style={{ color: TEXT_MUTED_INK }}>{body}</div>
      </div>
    </div>
  );
}

/* =========================================================================
   PREFERENCES MODAL
   ========================================================================= */
function PreferencesModal({ onClose }: { onClose: () => void }) {
  const sections = [
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "sidebar", label: "Sidebar", icon: List },
    { id: "themes", label: "Themes", icon: Palette },
    { id: "messages", label: "Messages & media", icon: MessageSquare },
    { id: "audio", label: "Audio & video", icon: Volume2 },
    { id: "language", label: "Language & region", icon: Globe },
    { id: "privacy", label: "Privacy & visibility", icon: ShieldCheck },
    { id: "account", label: "Account", icon: Settings },
  ];
  const [active, setActive] = useState("notifications");
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center p-6 animate-in fade-in duration-150" style={{ background: "rgba(15,23,42,0.55)" }}>
      <div className="w-full max-w-4xl h-[640px] rounded-2xl overflow-hidden shadow-2xl flex" style={{ background: "#FFFFFF" }}>
        {/* Side */}
        <div className="w-[220px] shrink-0 py-5" style={{ background: "#F8FAFC", borderRight: `1px solid ${BORDER_LIGHT}` }}>
          <div className="px-5 mb-4">
            <div className="text-[15px] font-bold" style={{ fontFamily: "'Poppins', sans-serif", color: TEXT_INK }}>Preferences</div>
            <div className="text-[11px]" style={{ color: TEXT_MUTED_INK }}>Tune Limnn Threads to fit how you work</div>
          </div>
          <nav className="space-y-0.5 px-2">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] rounded-md transition"
                style={{
                  background: active === s.id ? ACCENT_SOFT : "transparent",
                  color: active === s.id ? ACCENT : TEXT_BODY,
                  fontWeight: active === s.id ? 600 : 500,
                }}
              >
                <s.icon className="h-4 w-4" />
                {s.label}
              </button>
            ))}
          </nav>
        </div>
        {/* Main */}
        <div className="flex-1 flex flex-col">
          <header className="h-14 px-6 flex items-center justify-between" style={{ borderBottom: `1px solid ${BORDER_LIGHT}` }}>
            <div className="text-[14px] font-bold capitalize" style={{ fontFamily: "'Poppins', sans-serif", color: TEXT_INK }}>{sections.find((s) => s.id === active)?.label}</div>
            <button onClick={onClose} className="h-8 w-8 grid place-items-center rounded-md hover:bg-slate-100">
              <X className="h-4 w-4" style={{ color: TEXT_MUTED_INK }} />
            </button>
          </header>
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {active === "notifications" && <NotifPrefs />}
            {active === "themes" && <ThemePrefs />}
            {active === "sidebar" && <SidebarPrefs />}
            {active === "messages" && <GenericPrefs items={["Show jumbomoji", "Convert :emoji: shortcodes", "Bigger profile photos in messages", "Show typing indicators"]} />}
            {active === "audio" && <GenericPrefs items={["Use system mic", "Echo cancellation", "Auto-join huddles on speaker", "Push to talk: Space"]} />}
            {active === "language" && <LanguagePrefs />}
            {active === "privacy" && <GenericPrefs items={["Show my presence", "Show typing in DMs", "Allow read receipts", "Allow profile by email lookup"]} />}
            {active === "account" && <AccountPrefs onClose={onClose} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function NotifPrefs() {
  const [mode, setMode] = useState("mentions");
  const [dnd, setDnd] = useState(false);
  return (
    <>
      <PrefBlock title="Notify me about…">
        {(["all", "mentions", "nothing"] as const).map((m) => (
          <label key={m} className="flex items-center gap-2 py-1.5 cursor-pointer">
            <input type="radio" name="notif" checked={mode === m} onChange={() => setMode(m)} className="accent-[#2C69CF]" />
            <span className="text-[13px] capitalize" style={{ color: TEXT_BODY }}>
              {m === "all" ? "All new messages" : m === "mentions" ? "Direct messages, mentions & keywords" : "Nothing"}
            </span>
          </label>
        ))}
      </PrefBlock>
      <PrefBlock title="Do not disturb" right={<Toggle on={dnd} onChange={setDnd} />}>
        <div className="text-[12.5px]" style={{ color: TEXT_MUTED_INK }}>Pause notifications during quiet hours. Mentions queue up but won't ping you.</div>
        {dnd && (
          <div className="mt-3 grid grid-cols-2 gap-3">
            <ProfileField label="From" defaultValue="9:00 PM" />
            <ProfileField label="To" defaultValue="7:00 AM" />
          </div>
        )}
      </PrefBlock>
      <PrefBlock title="Notification sound">
        <select className="w-full h-9 px-3 rounded-md border text-[13px] outline-none" style={{ borderColor: BORDER_LIGHT, color: TEXT_BODY }}>
          <option>Limnn ping (default)</option>
          <option>Knock brush</option>
          <option>Hummus</option>
          <option>None</option>
        </select>
      </PrefBlock>
      <PrefBlock title="My keywords">
        <input placeholder="e.g. limnn, cpq, founders, oncall" className="w-full h-9 px-3 rounded-md border text-[13px] outline-none" style={{ borderColor: BORDER_LIGHT, color: TEXT_BODY }} />
        <div className="text-[11.5px] mt-1.5" style={{ color: TEXT_MUTED_INK }}>You'll be notified when these words appear in any channel you're in.</div>
      </PrefBlock>
    </>
  );
}

function ThemePrefs() {
  const themes = [
    { id: "limnn", label: "Limnn (default)", bg: BG_DEEP, accent: ACCENT },
    { id: "midnight", label: "Midnight", bg: "#020617", accent: "#7C3AED" },
    { id: "forest", label: "Forest", bg: "#0F2A1E", accent: SUCCESS },
    { id: "rose", label: "Rose", bg: "#3F0F1B", accent: "#EC4899" },
    { id: "ember", label: "Ember", bg: "#2A140F", accent: "#F59E0B" },
    { id: "porcelain", label: "Porcelain (light)", bg: "#F8FAFC", accent: ACCENT },
  ];
  const [pick, setPick] = useState("limnn");
  return (
    <PrefBlock title="Workspace theme">
      <div className="grid grid-cols-3 gap-3">
        {themes.map((t) => (
          <button
            key={t.id}
            onClick={() => setPick(t.id)}
            className="rounded-xl overflow-hidden border-2 transition text-left"
            style={{ borderColor: pick === t.id ? ACCENT : BORDER_LIGHT }}
          >
            <div className="h-16 flex" style={{ background: t.bg }}>
              <div className="w-3" style={{ background: t.accent }} />
              <div className="flex-1 p-2 space-y-1">
                <div className="h-1.5 w-12 rounded" style={{ background: "rgba(255,255,255,0.3)" }} />
                <div className="h-1.5 w-8 rounded" style={{ background: "rgba(255,255,255,0.15)" }} />
              </div>
            </div>
            <div className="px-3 py-2 text-[12px] font-medium flex items-center justify-between" style={{ color: TEXT_BODY }}>
              {t.label}
              {pick === t.id && <Star className="h-3 w-3 fill-current" style={{ color: ACCENT }} />}
            </div>
          </button>
        ))}
      </div>
    </PrefBlock>
  );
}

function SidebarPrefs() {
  return (
    <>
      <PrefBlock title="Density"><GenericRadios items={["Comfortable", "Compact"]} /></PrefBlock>
      <PrefBlock title="Show in sidebar"><GenericChecks items={["Unread channels only", "Mentions", "Drafts", "Starred", "Apps", "External connections"]} defaults={[false, true, true, true, true, false]} /></PrefBlock>
      <PrefBlock title="Sort"><GenericRadios items={["By alphabetical order", "By priority (unread first)", "By recent activity"]} defaultIndex={1} /></PrefBlock>
    </>
  );
}

function LanguagePrefs() {
  return (
    <>
      <PrefBlock title="Language">
        <select className="w-full h-9 px-3 rounded-md border text-[13px] outline-none" style={{ borderColor: BORDER_LIGHT, color: TEXT_BODY }}>
          <option>English (US)</option><option>English (UK)</option><option>Français</option><option>Deutsch</option><option>日本語</option>
        </select>
      </PrefBlock>
      <PrefBlock title="Time zone">
        <select className="w-full h-9 px-3 rounded-md border text-[13px] outline-none" style={{ borderColor: BORDER_LIGHT, color: TEXT_BODY }}>
          <option>(GMT-08:00) America/Los Angeles</option><option>(GMT-05:00) America/New York</option><option>(GMT+00:00) Europe/London</option><option>(GMT+05:00) Asia/Karachi</option>
        </select>
      </PrefBlock>
      <PrefBlock title="Spelling"><GenericChecks items={["Check spelling as you type", "Use system dictionary"]} defaults={[true, true]} /></PrefBlock>
    </>
  );
}

function AccountPrefs({ onClose }: { onClose: () => void }) {
  return (
    <>
      <PrefBlock title="Workspace">
        <div className="flex items-center gap-3 p-3 rounded-lg border" style={{ borderColor: BORDER_LIGHT }}>
          <div className="h-10 w-10 rounded-lg grid place-items-center" style={{ background: "linear-gradient(135deg,#2C69CF,#7C3AED)" }}>
            <img src={limnnLogo} alt="" className="h-5 w-auto" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-semibold" style={{ color: TEXT_INK }}>Limnn HQ</div>
            <div className="text-[11.5px]" style={{ color: TEXT_MUTED_INK }}>limnn.slack-like.app · 48 members</div>
          </div>
          <button className="text-[12px] font-medium px-3 h-8 rounded-md border hover:bg-slate-50" style={{ borderColor: BORDER_LIGHT, color: TEXT_BODY }}>Switch</button>
        </div>
      </PrefBlock>
      <PrefBlock title="Sessions"><GenericChecks items={["Sign me out after 7 days of inactivity", "Require 2FA for new device sign-ins"]} defaults={[true, true]} /></PrefBlock>
      <div className="pt-2">
        <button onClick={onClose} className="inline-flex items-center gap-2 h-9 px-3 rounded-md text-[12.5px] font-semibold border hover:bg-red-50" style={{ borderColor: BORDER_LIGHT, color: MENTION }}>
          <LogOut className="h-3.5 w-3.5" /> Sign out of Limnn HQ
        </button>
      </div>
    </>
  );
}

function PrefBlock({ title, children, right }: { title: string; children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <section className="rounded-xl border p-4" style={{ borderColor: BORDER_LIGHT, background: "#FFFFFF" }}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-[13px] font-bold" style={{ fontFamily: "'Poppins', sans-serif", color: TEXT_INK }}>{title}</div>
        {right}
      </div>
      <div>{children}</div>
    </section>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className="relative h-5 w-9 rounded-full transition"
      style={{ background: on ? ACCENT : "#CBD5E1" }}
    >
      <span className="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition" style={{ left: on ? "18px" : "2px" }} />
    </button>
  );
}

function GenericPrefs({ items }: { items: string[] }) {
  return (
    <PrefBlock title="Options">
      {items.map((i) => (
        <label key={i} className="flex items-center justify-between py-2 text-[13px]" style={{ color: TEXT_BODY }}>
          <span>{i}</span>
          <ToggleLocal />
        </label>
      ))}
    </PrefBlock>
  );
}
function ToggleLocal() {
  const [v, setV] = useState(true);
  return <Toggle on={v} onChange={setV} />;
}

function GenericRadios({ items, defaultIndex = 0 }: { items: string[]; defaultIndex?: number }) {
  const [i, setI] = useState(defaultIndex);
  return (
    <div>
      {items.map((item, idx) => (
        <label key={item} className="flex items-center gap-2 py-1.5 cursor-pointer">
          <input type="radio" checked={i === idx} onChange={() => setI(idx)} className="accent-[#2C69CF]" />
          <span className="text-[13px]" style={{ color: TEXT_BODY }}>{item}</span>
        </label>
      ))}
    </div>
  );
}

function GenericChecks({ items, defaults }: { items: string[]; defaults: boolean[] }) {
  const [state, setState] = useState(defaults);
  return (
    <div>
      {items.map((item, idx) => (
        <label key={item} className="flex items-center gap-2 py-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={state[idx]}
            onChange={(e) => setState((s) => s.map((v, i) => i === idx ? e.target.checked : v))}
            className="accent-[#2C69CF]"
          />
          <span className="text-[13px]" style={{ color: TEXT_BODY }}>{item}</span>
        </label>
      ))}
    </div>
  );
}

// keep tree-shake happy
export const __members = MEMBERS;
export { ChevronDown };
