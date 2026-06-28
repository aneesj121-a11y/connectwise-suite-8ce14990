import { useEffect, useState } from "react";
import { MessageSquare, X, AtSign, Reply } from "lucide-react";
import limnnLogo from "@/assets/limnn-logo.png";

const ACCENT = "#2C69CF";
const BG_DEEP = "#1E293B";
const PANEL = "#2A354A";
const BORDER = "rgba(148,163,184,0.18)";
const TEXT_LIGHT = "#F8FAFC";
const TEXT_DIM = "#94A3B8";
const MENTION = "#F59E0B";

type Incoming = {
  id: number;
  author: string;
  initials: string;
  avatarColor: string;
  channel: string;
  text: string;
  mention?: boolean;
  thread?: boolean;
};

const QUEUE: Omit<Incoming, "id">[] = [
  {
    author: "Priya Raman",
    initials: "PR",
    avatarColor: "#7C3AED",
    channel: "#sales-velocity",
    text: "Just closed the Northwind renewal — $148K ACV. Logging it in CPQ now 🎉",
    mention: false,
  },
  {
    author: "Marcus Chen",
    initials: "MC",
    avatarColor: "#10B981",
    channel: "#engineering",
    text: "@you can you review the dialer latency PR before EOD? Blocking the release.",
    mention: true,
  },
  {
    author: "Sofia Alvarez",
    initials: "SA",
    avatarColor: "#EF4444",
    channel: "Direct message",
    text: "Heads up — Acme just escalated. Hopping on a call in 5, want you in?",
    mention: false,
  },
  {
    author: "Devon Park",
    initials: "DP",
    avatarColor: "#F59E0B",
    channel: "#announcements",
    text: "Replied in thread: 'Q3 forecast looks solid, +12% on plan.'",
    thread: true,
  },
];

export function LimnnThreadNotifier({
  threadsOpen,
  onOpenThreads,
}: {
  threadsOpen: boolean;
  onOpenThreads: () => void;
}) {
  const [stack, setStack] = useState<Incoming[]>([]);

  // Simulate incoming messages while threads pane is closed
  useEffect(() => {
    if (threadsOpen) {
      setStack([]);
      return;
    }
    let i = 0;
    const tick = () => {
      const sample = QUEUE[i % QUEUE.length];
      i += 1;
      setStack((prev) => [{ ...sample, id: Date.now() + Math.random() }, ...prev].slice(0, 3));
    };
    const first = setTimeout(tick, 1800);
    const loop = setInterval(tick, 7000);
    return () => {
      clearTimeout(first);
      clearInterval(loop);
    };
  }, [threadsOpen]);

  // Auto-dismiss each toast after 6s
  useEffect(() => {
    if (!stack.length) return;
    const timers = stack.map((n) =>
      setTimeout(() => setStack((p) => p.filter((x) => x.id !== n.id)), 6000),
    );
    return () => timers.forEach(clearTimeout);
  }, [stack]);

  if (threadsOpen || !stack.length) return null;

  return (
    <div className="fixed top-20 right-5 z-[55] flex flex-col gap-2.5 pointer-events-none">
      {stack.map((n, idx) => (
        <button
          key={n.id}
          onClick={() => {
            onOpenThreads();
            setStack([]);
          }}
          className="pointer-events-auto text-left w-[360px] rounded-xl overflow-hidden shadow-2xl animate-in slide-in-from-right-5 fade-in duration-300 hover:translate-x-[-2px] transition"
          style={{
            background: BG_DEEP,
            border: `1px solid ${n.mention ? "rgba(245,158,11,0.45)" : BORDER}`,
            fontFamily: "'Inter', sans-serif",
            transform: `translateY(${idx * 0}px)`,
          }}
        >
          {/* Top strip — branding */}
          <div
            className="flex items-center gap-2 px-3 py-1.5"
            style={{ background: PANEL, borderBottom: `1px solid ${BORDER}` }}
          >
            <img src={limnnLogo} alt="" className="h-3 w-auto opacity-80" />
            <span className="text-[10px] font-semibold tracking-wider uppercase" style={{ color: TEXT_DIM }}>
              Limnn Threads
            </span>
            <span className="text-[10px]" style={{ color: TEXT_DIM }}>· now</span>
            {n.mention && (
              <span
                className="ml-auto flex items-center gap-1 text-[9.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                style={{ background: "rgba(245,158,11,0.18)", color: MENTION }}
              >
                <AtSign className="h-2.5 w-2.5" /> Mention
              </span>
            )}
            {n.thread && !n.mention && (
              <span
                className="ml-auto flex items-center gap-1 text-[9.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                style={{ background: "rgba(44,105,207,0.18)", color: ACCENT }}
              >
                <Reply className="h-2.5 w-2.5" /> Thread
              </span>
            )}
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                setStack((p) => p.filter((x) => x.id !== n.id));
              }}
              className={`${n.mention || n.thread ? "" : "ml-auto"} h-5 w-5 grid place-items-center rounded hover:bg-white/10`}
            >
              <X className="h-3 w-3" style={{ color: TEXT_DIM }} />
            </span>
          </div>

          {/* Body */}
          <div className="flex items-start gap-2.5 p-3" style={{ color: TEXT_LIGHT }}>
            <div
              className="h-9 w-9 rounded-md grid place-items-center text-[12px] font-semibold shrink-0"
              style={{ background: n.avatarColor }}
            >
              {n.initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[13px] font-semibold truncate">{n.author}</span>
                <span className="text-[11px]" style={{ color: TEXT_DIM }}>
                  in <span style={{ color: ACCENT }}>{n.channel}</span>
                </span>
              </div>
              <div className="text-[12.5px] leading-snug mt-0.5 line-clamp-2" style={{ color: "#CBD5E1" }}>
                {n.text}
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                <span
                  className="inline-flex items-center gap-1 text-[10.5px] font-medium px-2 py-1 rounded-md"
                  style={{ background: ACCENT, color: "#fff" }}
                >
                  <MessageSquare className="h-3 w-3" /> Reply in Threads
                </span>
                <span className="text-[10.5px]" style={{ color: TEXT_DIM }}>
                  Click to open
                </span>
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
