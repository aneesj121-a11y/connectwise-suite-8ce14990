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
} from "lucide-react";

const BG = "#1E293B";
const PANEL = "#22304A";
const MUTED = "#94A3B8";
const TEXT = "#FFFFFF";
const ACCENT = "#2C69CF";
const BORDER = "rgba(255,255,255,0.08)";

type Presence = "active" | "away" | "dnd";
type Member = { id: string; name: string; initials: string; presence: Presence; title?: string };
type Reaction = { emoji: string; count: number; me?: boolean };
type Message = {
  id: string;
  authorId: string;
  ts: string;
  text: string;
  reactions?: Reaction[];
  replies?: Message[];
  edited?: boolean;
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
};

const MEMBERS: Record<string, Member> = {
  u_anees: { id: "u_anees", name: "Anees Naveed", initials: "AN", presence: "active", title: "Founder" },
  u_priya: { id: "u_priya", name: "Priya Raman", initials: "PR", presence: "active", title: "VP Eng" },
  u_jared: { id: "u_jared", name: "Jared Cole", initials: "JC", presence: "dnd", title: "Sales Lead" },
  u_mei: { id: "u_mei", name: "Mei Tanaka", initials: "MT", presence: "active", title: "CS Director" },
  u_omar: { id: "u_omar", name: "Omar Idris", initials: "OI", presence: "away", title: "Staff Eng" },
  u_lina: { id: "u_lina", name: "Lina Park", initials: "LP", presence: "active", title: "Product" },
};

const CHANNELS: Channel[] = [
  { id: "c_ann", name: "announcements", kind: "channel", unread: 2, topic: "Company-wide updates" },
  { id: "c_eng", name: "engineering", kind: "channel", unread: 6, mention: true, topic: "Eng velocity, releases" },
  { id: "c_sales", name: "sales-velocity", kind: "channel", unread: 3, topic: "Pipeline & deals" },
  { id: "c_cs", name: "customer-success", kind: "channel", topic: "Renewals & health" },
  { id: "c_inc", name: "incidents", kind: "channel", private: true, unread: 1, mention: true, topic: "Active incidents" },
];

const DMS: Channel[] = [
  { id: "d_priya", name: "Priya Raman", kind: "dm", memberIds: ["u_priya"], unread: 1 },
  { id: "d_jared", name: "Jared Cole", kind: "dm", memberIds: ["u_jared"] },
  { id: "d_mei", name: "Mei Tanaka", kind: "dm", memberIds: ["u_mei"], unread: 2, mention: true },
  { id: "d_omar", name: "Omar Idris", kind: "dm", memberIds: ["u_omar"] },
];

const SEED: Record<string, Message[]> = {
  c_eng: [
    {
      id: "m1",
      authorId: "u_priya",
      ts: "9:02 AM",
      text: "Rolling EU-WEST failover to canary at 9:15. Telephony team is staged. P0 oncall is @omar.",
      reactions: [{ emoji: "🚀", count: 4, me: true }, { emoji: "👀", count: 2 }],
      replies: [
        { id: "m1r1", authorId: "u_omar", ts: "9:03 AM", text: "Confirmed staged. Runbook v3 loaded." },
        { id: "m1r2", authorId: "u_priya", ts: "9:04 AM", text: "Ack — keep #incidents quiet unless SLO dips." },
      ],
    },
    {
      id: "m2",
      authorId: "u_omar",
      ts: "9:11 AM",
      text: "Velocity: 47 PRs merged this sprint, p95 review time 2h 14m — best quarter to date.",
      reactions: [{ emoji: "🔥", count: 6 }, { emoji: "💪", count: 3 }],
    },
    {
      id: "m3",
      authorId: "u_lina",
      ts: "9:18 AM",
      text: "Shipping CPQ approvals modal behind `cpq.approvals.v2`. Cutover Thursday after deal desk sync.",
      reactions: [{ emoji: "✅", count: 5, me: true }],
    },
    {
      id: "m4",
      authorId: "u_priya",
      ts: "9:24 AM",
      text: "Heads up @anees — deployment dashboard now shows MTTR per service. Open it from Grid → Sprints.",
    },
  ],
  c_sales: [
    {
      id: "s1",
      authorId: "u_jared",
      ts: "8:48 AM",
      text: "Acme just countered at 18% — pulling it into deal desk. Need a CFO override before EOD.",
      reactions: [{ emoji: "🫡", count: 2 }],
      replies: [
        { id: "s1r1", authorId: "u_anees", ts: "8:51 AM", text: "Approve if multi-year. Single-year is a hard no past 15%." },
      ],
    },
    {
      id: "s2",
      authorId: "u_mei",
      ts: "9:05 AM",
      text: "Q3 quota attainment crossed 92% — three reps already at 100%+. Pushing the leaderboard refresh.",
      reactions: [{ emoji: "📈", count: 7 }],
    },
  ],
  c_ann: [
    {
      id: "a1",
      authorId: "u_anees",
      ts: "8:30 AM",
      text: "All-hands Friday at 11:00 PT. Agenda: Q3 close, CPQ launch, and the new EU data residency tier.",
      reactions: [{ emoji: "🎉", count: 12 }, { emoji: "📌", count: 4 }],
    },
  ],
  c_cs: [
    {
      id: "cs1",
      authorId: "u_mei",
      ts: "9:00 AM",
      text: "Northwind health dropped to 62 — scheduling QBR pull-in. Expansion thesis still intact.",
    },
  ],
  c_inc: [
    {
      id: "i1",
      authorId: "u_omar",
      ts: "9:09 AM",
      text: "INC-4421 — carrier degradation, EU-WEST. Failover in progress. ETA recovery 8–12 min.",
      reactions: [{ emoji: "⚠️", count: 3 }],
    },
  ],
  d_priya: [
    { id: "dp1", authorId: "u_priya", ts: "8:58 AM", text: "Got 10 min before the failover? Want to align on the CPQ rollout sequencing." },
  ],
  d_jared: [{ id: "dj1", authorId: "u_jared", ts: "Yesterday", text: "Sent the Acme paper trail to deal-desk." }],
  d_mei: [
    { id: "dm1", authorId: "u_mei", ts: "9:12 AM", text: "Northwind exec wants you on the QBR. 30 min Thursday work?" },
    { id: "dm2", authorId: "u_mei", ts: "9:13 AM", text: "Also — advocacy program intake is up 40% MoM 🎯" },
  ],
  d_omar: [{ id: "do1", authorId: "u_omar", ts: "Yesterday", text: "Runbook v3 merged." }],
};

const QUICK_EMOJI = ["👍", "🎉", "🚀", "🔥", "🫡", "👀"];

export function LimnnThread({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [channelId, setChannelId] = useState("c_eng");
  const [threadOpen, setThreadOpen] = useState<Message | null>(null);
  const [draft, setDraft] = useState("");
  const [threadDraft, setThreadDraft] = useState("");
  const [data, setData] = useState<Record<string, Message[]>>(SEED);
  const [editing, setEditing] = useState<string | null>(null);
  const [banner, setBanner] = useState<{ author: string; text: string; channel: string } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const all = useMemo(() => [...CHANNELS, ...DMS], []);
  const active = all.find((c) => c.id === channelId)!;
  const messages = data[channelId] ?? [];

  // Auto-scroll on new messages
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length, channelId]);

  // Demo desktop-style banner — fires once shortly after mount
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => {
      setBanner({ author: "Mei Tanaka", text: "Northwind exec wants you on the QBR…", channel: "DM" });
      setTimeout(() => setBanner(null), 5200);
    }, 1800);
    return () => clearTimeout(t);
  }, [open]);

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
      const list = (d[channelId] ?? []).map((m) =>
        m.id === threadOpen.id ? { ...m, replies: [...(m.replies ?? []), reply] } : m,
      );
      return { ...d, [channelId]: list };
    });
    setThreadOpen((t) => (t ? { ...t, replies: [...(t.replies ?? []), reply] } : t));
    setThreadDraft("");
  }

  function react(messageId: string, emoji: string, inThread = false) {
    setData((d) => {
      const list = (d[channelId] ?? []).map((m) => {
        if (inThread && threadOpen && m.id === threadOpen.id) {
          return {
            ...m,
            replies: (m.replies ?? []).map((r) => (r.id === messageId ? bumpReaction(r, emoji) : r)),
          };
        }
        if (m.id === messageId) return bumpReaction(m, emoji);
        return m;
      });
      return { ...d, [channelId]: list };
    });
  }

  function saveEdit(messageId: string, text: string) {
    setData((d) => {
      const list = (d[channelId] ?? []).map((m) => (m.id === messageId ? { ...m, text, edited: true } : m));
      return { ...d, [channelId]: list };
    });
    setEditing(null);
  }

  if (!open) return null;

  return (
    <>
      <aside
        className="flex w-[380px] shrink-0 flex-col h-[calc(100vh-3.5rem)] sticky top-14 animate-slide-in-right z-30"
        style={{ background: BG, color: TEXT, borderLeft: `1px solid ${BORDER}` }}
      >
        {/* Header */}
        <div className="px-3.5 py-3 flex items-center justify-between" style={{ borderBottom: `1px solid ${BORDER}` }}>
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-6 w-6 rounded-md grid place-items-center" style={{ background: ACCENT }}>
              <Hash className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0">
              <div className="text-[13px] font-semibold leading-tight" style={{ fontFamily: "Poppins, sans-serif" }}>
                Limnn Thread
              </div>
              <div className="text-[10px] truncate" style={{ color: MUTED }}>
                Internal comms · 12 online
              </div>
            </div>
          </div>
          <button onClick={onClose} className="h-7 w-7 grid place-items-center rounded-md hover:bg-white/5" title="Close">
            <X className="h-4 w-4" style={{ color: MUTED }} />
          </button>
        </div>

        {/* Body: mini-sidebar + canvas */}
        <div className="flex-1 min-h-0 flex">
          {/* Mini sidebar */}
          <div className="w-[136px] shrink-0 overflow-y-auto py-2" style={{ borderRight: `1px solid ${BORDER}` }}>
            <SectionLabel>Channels</SectionLabel>
            {CHANNELS.map((c) => (
              <ChannelRow key={c.id} c={c} active={c.id === channelId} onClick={() => { setChannelId(c.id); setThreadOpen(null); }} />
            ))}
            <SectionLabel className="mt-3">Direct messages</SectionLabel>
            {DMS.map((c) => {
              const m = c.memberIds ? MEMBERS[c.memberIds[0]] : undefined;
              return (
                <DmRow key={c.id} c={c} m={m} active={c.id === channelId} onClick={() => { setChannelId(c.id); setThreadOpen(null); }} />
              );
            })}
            <button
              className="mx-2 mt-3 w-[calc(100%-1rem)] inline-flex items-center justify-center gap-1 rounded-md py-1.5 text-[11px]"
              style={{ background: "rgba(255,255,255,0.04)", color: MUTED, border: `1px dashed ${BORDER}` }}
            >
              <Plus className="h-3 w-3" /> New
            </button>
          </div>

          {/* Canvas */}
          <div className="flex-1 min-w-0 flex flex-col">
            {/* Channel header */}
            <div className="px-3 py-2 flex items-center gap-2" style={{ borderBottom: `1px solid ${BORDER}` }}>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 text-[12.5px] font-semibold" style={{ fontFamily: "Poppins, sans-serif" }}>
                  {active.kind === "channel" ? (active.private ? <Lock className="h-3 w-3" style={{ color: MUTED }} /> : <Hash className="h-3 w-3" style={{ color: MUTED }} />) : null}
                  <span className="truncate">{active.name}</span>
                </div>
                {active.topic && <div className="text-[10.5px] truncate" style={{ color: MUTED }}>{active.topic}</div>}
              </div>
              <button className="h-6 w-6 grid place-items-center rounded hover:bg-white/5" title="Pin"><Pin className="h-3.5 w-3.5" style={{ color: MUTED }} /></button>
              <button className="h-6 w-6 grid place-items-center rounded hover:bg-white/5" title="Search"><Search className="h-3.5 w-3.5" style={{ color: MUTED }} /></button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto px-2 py-2 space-y-1">
              {messages.map((m) => (
                <MessageRow
                  key={m.id}
                  m={m}
                  editing={editing === m.id}
                  onStartEdit={() => setEditing(m.id)}
                  onSaveEdit={(t) => saveEdit(m.id, t)}
                  onCancelEdit={() => setEditing(null)}
                  onReact={(e) => react(m.id, e)}
                  onOpenThread={() => setThreadOpen(m)}
                />
              ))}
            </div>

            {/* Composer */}
            <Composer value={draft} onChange={setDraft} onSend={send} placeholder={`Message ${active.kind === "channel" ? "#" + active.name : active.name}`} />
          </div>
        </div>

        {/* Thread slide-over within the column */}
        {threadOpen && (
          <div
            className="absolute inset-y-0 right-0 w-[300px] flex flex-col animate-slide-in-right"
            style={{ background: PANEL, borderLeft: `1px solid ${BORDER}`, top: 0 }}
          >
            <div className="px-3 py-2.5 flex items-center justify-between" style={{ borderBottom: `1px solid ${BORDER}` }}>
              <div className="text-[12px] font-semibold flex items-center gap-1.5" style={{ fontFamily: "Poppins, sans-serif" }}>
                <CornerDownRight className="h-3.5 w-3.5" style={{ color: ACCENT }} /> Thread
              </div>
              <button onClick={() => setThreadOpen(null)} className="h-6 w-6 grid place-items-center rounded hover:bg-white/5">
                <X className="h-3.5 w-3.5" style={{ color: MUTED }} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              <MessageRow m={threadOpen} compact onReact={(e) => react(threadOpen.id, e)} />
              <div className="text-[10px] uppercase tracking-wider px-2 py-1.5" style={{ color: MUTED }}>
                {(threadOpen.replies ?? []).length} replies
              </div>
              {(threadOpen.replies ?? []).map((r) => (
                <MessageRow key={r.id} m={r} compact onReact={(e) => react(r.id, e, true)} />
              ))}
            </div>
            <Composer value={threadDraft} onChange={setThreadDraft} onSend={sendThread} placeholder="Reply…" compact />
          </div>
        )}
      </aside>

      {/* Desktop-style ambient banner */}
      {banner && (
        <div
          className="fixed top-16 right-6 z-50 w-[320px] rounded-xl p-3 flex gap-3 animate-fade-in"
          style={{
            background: BG,
            color: TEXT,
            border: `1px solid ${BORDER}`,
            boxShadow: "0 12px 40px -12px rgba(0,0,0,0.5)",
          }}
        >
          <div className="h-9 w-9 rounded-full grid place-items-center text-xs font-semibold" style={{ background: ACCENT }}>
            MT
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-[11px]" style={{ color: MUTED }}>
              <Bell className="h-3 w-3" /> {banner.channel} · just now
            </div>
            <div className="text-[12.5px] font-semibold truncate" style={{ fontFamily: "Poppins, sans-serif" }}>{banner.author}</div>
            <div className="text-[12px] truncate" style={{ color: MUTED }}>{banner.text}</div>
          </div>
          <button onClick={() => setBanner(null)} className="h-6 w-6 grid place-items-center rounded hover:bg-white/5 shrink-0">
            <X className="h-3.5 w-3.5" style={{ color: MUTED }} />
          </button>
        </div>
      )}
    </>
  );
}

function SectionLabel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`px-3 pb-1 text-[9.5px] uppercase tracking-[0.14em] ${className}`} style={{ color: MUTED }}>
      {children}
    </div>
  );
}

function ChannelRow({ c, active, onClick }: { c: Channel; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-1.5 px-3 py-1.5 text-[12px] text-left transition-colors"
      style={{
        background: active ? "rgba(44,105,207,0.18)" : "transparent",
        color: active ? TEXT : c.unread ? TEXT : MUTED,
        fontWeight: c.unread || active ? 600 : 500,
      }}
    >
      {c.private ? <Lock className="h-3 w-3 opacity-70" /> : <Hash className="h-3 w-3 opacity-70" />}
      <span className="flex-1 truncate">{c.name}</span>
      {c.mention && <span className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-pulse" />}
      {c.unread ? (
        <span className="text-[9.5px] font-semibold rounded-full px-1.5 py-0.5" style={{ background: ACCENT, color: TEXT }}>
          {c.unread}
        </span>
      ) : null}
    </button>
  );
}

function DmRow({ c, m, active, onClick }: { c: Channel; m?: Member; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-1.5 px-3 py-1.5 text-[12px] text-left"
      style={{
        background: active ? "rgba(44,105,207,0.18)" : "transparent",
        color: active ? TEXT : c.unread ? TEXT : MUTED,
        fontWeight: c.unread || active ? 600 : 500,
      }}
    >
      <span className="relative">
        <span className="h-5 w-5 rounded grid place-items-center text-[9.5px] font-bold" style={{ background: "rgba(255,255,255,0.08)", color: TEXT }}>
          {m?.initials ?? "?"}
        </span>
        <PresenceDot p={m?.presence ?? "away"} />
      </span>
      <span className="flex-1 truncate">{c.name}</span>
      {c.mention && <span className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-pulse" />}
      {c.unread ? (
        <span className="text-[9.5px] font-semibold rounded-full px-1.5 py-0.5" style={{ background: ACCENT, color: TEXT }}>
          {c.unread}
        </span>
      ) : null}
    </button>
  );
}

function PresenceDot({ p }: { p: Presence }) {
  const color = p === "active" ? "#22C55E" : p === "dnd" ? "#EF4444" : "#94A3B8";
  return (
    <span
      className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full"
      style={{ background: color, boxShadow: `0 0 0 1.5px ${BG}` }}
    />
  );
}

function MessageRow({
  m,
  compact,
  editing,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onReact,
  onOpenThread,
}: {
  m: Message;
  compact?: boolean;
  editing?: boolean;
  onStartEdit?: () => void;
  onSaveEdit?: (t: string) => void;
  onCancelEdit?: () => void;
  onReact?: (emoji: string) => void;
  onOpenThread?: () => void;
}) {
  const author = MEMBERS[m.authorId] ?? { name: "Unknown", initials: "?", presence: "away" as Presence };
  const [editVal, setEditVal] = useState(m.text);
  useEffect(() => setEditVal(m.text), [m.text, editing]);
  const [hover, setHover] = useState(false);

  return (
    <div
      className="group relative rounded-md px-2 py-1.5 transition-colors"
      style={{ background: hover ? "rgba(255,255,255,0.03)" : "transparent" }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="flex gap-2">
        <span className="relative shrink-0">
          <span className="h-7 w-7 rounded-md grid place-items-center text-[10.5px] font-bold" style={{ background: "rgba(255,255,255,0.08)", color: TEXT }}>
            {author.initials}
          </span>
          <PresenceDot p={author.presence} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[12px] font-semibold" style={{ color: TEXT, fontFamily: "Poppins, sans-serif" }}>{author.name}</span>
            <span className="text-[10px]" style={{ color: MUTED }}>{m.ts}</span>
            {m.edited && <span className="text-[9.5px]" style={{ color: MUTED }}>(edited)</span>}
          </div>
          {editing ? (
            <div className="mt-1 rounded-md p-1.5" style={{ background: PANEL, border: `1px solid ${BORDER}` }}>
              <textarea
                value={editVal}
                onChange={(e) => setEditVal(e.target.value)}
                rows={2}
                className="w-full resize-none bg-transparent text-[12.5px] outline-none"
                style={{ color: TEXT }}
              />
              <div className="flex justify-end gap-1.5 mt-1">
                <button onClick={onCancelEdit} className="text-[10.5px] px-2 py-0.5 rounded" style={{ color: MUTED }}>Cancel</button>
                <button onClick={() => onSaveEdit?.(editVal)} className="text-[10.5px] px-2 py-0.5 rounded font-semibold" style={{ background: ACCENT, color: TEXT }}>Save</button>
              </div>
            </div>
          ) : (
            <div className="text-[12.5px] leading-snug mt-0.5" style={{ color: "#E2E8F0" }}>{m.text}</div>
          )}

          {/* Reactions */}
          {m.reactions && m.reactions.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {m.reactions.map((r) => (
                <button
                  key={r.emoji}
                  onClick={() => onReact?.(r.emoji)}
                  className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10.5px]"
                  style={{
                    background: r.me ? "rgba(44,105,207,0.22)" : "rgba(255,255,255,0.05)",
                    border: `1px solid ${r.me ? "rgba(44,105,207,0.5)" : BORDER}`,
                    color: TEXT,
                  }}
                >
                  <span>{r.emoji}</span>
                  <span className="font-semibold">{r.count}</span>
                </button>
              ))}
            </div>
          )}

          {/* Replies indicator */}
          {!compact && m.replies && m.replies.length > 0 && (
            <button
              onClick={onOpenThread}
              className="mt-1.5 inline-flex items-center gap-1.5 text-[10.5px] font-semibold rounded px-1.5 py-0.5"
              style={{ color: ACCENT }}
            >
              <CornerDownRight className="h-3 w-3" />
              {m.replies.length} {m.replies.length === 1 ? "reply" : "replies"}
            </button>
          )}
        </div>
      </div>

      {/* Floating quick actions */}
      {hover && !editing && (
        <div
          className="absolute -top-3 right-2 flex items-center gap-0.5 rounded-md px-1 py-0.5 animate-fade-in"
          style={{ background: PANEL, border: `1px solid ${BORDER}`, boxShadow: "0 6px 18px -6px rgba(0,0,0,0.5)" }}
        >
          {QUICK_EMOJI.map((e) => (
            <button key={e} onClick={() => onReact?.(e)} className="h-6 w-6 grid place-items-center text-[13px] hover:bg-white/10 rounded">
              {e}
            </button>
          ))}
          <span className="mx-0.5 h-4 w-px" style={{ background: BORDER }} />
          {!compact && onOpenThread && (
            <button onClick={onOpenThread} className="h-6 w-6 grid place-items-center hover:bg-white/10 rounded" title="Reply in thread">
              <CornerDownRight className="h-3.5 w-3.5" style={{ color: MUTED }} />
            </button>
          )}
          {onStartEdit && (
            <button onClick={onStartEdit} className="h-6 w-6 grid place-items-center hover:bg-white/10 rounded" title="Edit">
              <Pencil className="h-3.5 w-3.5" style={{ color: MUTED }} />
            </button>
          )}
          <button className="h-6 w-6 grid place-items-center hover:bg-white/10 rounded" title="More">
            <MoreHorizontal className="h-3.5 w-3.5" style={{ color: MUTED }} />
          </button>
        </div>
      )}
    </div>
  );
}

function Composer({
  value,
  onChange,
  onSend,
  placeholder,
  compact,
}: {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  placeholder: string;
  compact?: boolean;
}) {
  return (
    <div className="p-2" style={{ borderTop: `1px solid ${BORDER}` }}>
      <div className="rounded-lg p-2" style={{ background: PANEL, border: `1px solid ${BORDER}` }}>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
          placeholder={placeholder}
          rows={compact ? 1 : 2}
          className="w-full resize-none bg-transparent text-[12.5px] outline-none placeholder:opacity-60"
          style={{ color: TEXT }}
        />
        <div className="mt-1 flex items-center gap-0.5">
          <IconBtn title="Attach"><Paperclip className="h-3.5 w-3.5" /></IconBtn>
          <IconBtn title="Code block"><Code2 className="h-3.5 w-3.5" /></IconBtn>
          <IconBtn title="Mention"><AtSign className="h-3.5 w-3.5" /></IconBtn>
          <IconBtn title="Emoji"><Smile className="h-3.5 w-3.5" /></IconBtn>
          <div className="flex-1" />
          <button
            onClick={onSend}
            disabled={!value.trim()}
            className="h-7 px-2.5 rounded-md inline-flex items-center gap-1 text-[11px] font-semibold disabled:opacity-40"
            style={{ background: ACCENT, color: TEXT }}
          >
            <Send className="h-3 w-3" /> Send
          </button>
        </div>
      </div>
    </div>
  );
}

function IconBtn({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <button title={title} className="h-7 w-7 grid place-items-center rounded hover:bg-white/5" style={{ color: MUTED }}>
      {children}
    </button>
  );
}

function bumpReaction(m: Message, emoji: string): Message {
  const list = m.reactions ?? [];
  const idx = list.findIndex((r) => r.emoji === emoji);
  if (idx === -1) return { ...m, reactions: [...list, { emoji, count: 1, me: true }] };
  const next = [...list];
  const cur = next[idx];
  next[idx] = cur.me ? { ...cur, count: Math.max(0, cur.count - 1), me: false } : { ...cur, count: cur.count + 1, me: true };
  return { ...m, reactions: next.filter((r) => r.count > 0) };
}

function nowLabel() {
  const d = new Date();
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

// Aggregate unread for badge
export function useLimnnThreadUnread() {
  return [...CHANNELS, ...DMS].reduce((sum, c) => sum + (c.unread ?? 0), 0);
}

export function limnnThreadHasMention() {
  return [...CHANNELS, ...DMS].some((c) => c.mention);
}

// keep tree-shake happy
export const __members = MEMBERS;
export { ChevronDown };
