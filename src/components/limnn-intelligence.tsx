import { useEffect, useRef, useState } from "react";
import {
  Brain,
  ChevronRight,
  ChevronLeft,
  Send,
  Paperclip,
  X,
  FileText,
  Sparkles,
} from "lucide-react";
import { useTeam, TEAMS } from "@/lib/team-context";
import { hubInsights } from "@/lib/hubs-data";
import { AiInsightCard } from "./enterprise/primitives";

const PANE_BG = "#1E293B";
const PANE_MUTED = "#94A3B8";
const PANE_TEXT = "#FFFFFF";
const BORDER = "rgba(255,255,255,0.08)";

type Msg = { role: "user" | "ai"; text: string };
type Upload = { name: string; size: string };

export function LimnnIntelligence() {
  const { team } = useTeam();
  const t = TEAMS[team];
  const [open, setOpen] = useState(true);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploads, setUploads] = useState<Upload[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const v = localStorage.getItem("limnn:intel:open");
    if (v !== null) setOpen(v === "1");
  }, []);
  useEffect(() => {
    localStorage.setItem("limnn:intel:open", open ? "1" : "0");
  }, [open]);

  const insights = hubInsights(team);

  const send = () => {
    const text = input.trim();
    if (!text || busy) return;
    setMsgs((m) => [...m, { role: "user", text }]);
    setInput("");
    setBusy(true);
    setTimeout(() => {
      setMsgs((m) => [
        ...m,
        {
          role: "ai",
          text: `Based on the ${t.label} context: ${text.length > 60 ? "I've drafted a recommendation in the right pane." : "here's a quick take — I'll surface deeper analysis as more signals load."}`,
        },
      ]);
      setBusy(false);
    }, 800);
  };

  if (!open) {
    return (
      <aside
        className="hidden xl:flex w-11 shrink-0 flex-col items-center pt-4 gap-3"
        style={{ background: PANE_BG, color: PANE_TEXT, borderLeft: `1px solid ${BORDER}` }}
      >
        <button
          onClick={() => setOpen(true)}
          className="h-8 w-8 grid place-items-center rounded-md hover:bg-white/5"
          style={{ color: PANE_MUTED }}
          title="Open Limnn Intelligence"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="h-8 w-8 rounded-md grid place-items-center" style={{ background: "rgba(44,105,207,0.18)", color: "#2C69CF" }}>
          <Brain className="h-4 w-4" />
        </div>
      </aside>
    );
  }

  return (
    <aside
      className="hidden xl:flex w-[320px] shrink-0 flex-col"
      style={{ background: PANE_BG, color: PANE_TEXT, borderLeft: `1px solid ${BORDER}` }}
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-3 flex items-center gap-2" style={{ borderBottom: `1px solid ${BORDER}` }}>
        <div className="h-7 w-7 rounded-md grid place-items-center" style={{ background: "rgba(44,105,207,0.22)", color: "#2C69CF" }}>
          <Brain className="h-3.5 w-3.5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-display font-semibold leading-tight">Limnn Intelligence</div>
          <div className="text-[10px] uppercase tracking-[0.14em]" style={{ color: PANE_MUTED }}>{t.label} context</div>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="h-7 w-7 grid place-items-center rounded-md hover:bg-white/5"
          style={{ color: PANE_MUTED }}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <section>
          <div className="text-[10px] uppercase tracking-[0.14em] mb-2" style={{ color: PANE_MUTED }}>
            ML insights
          </div>
          <div className="space-y-2">
            {insights.map((ins, i) => (
              <div
                key={i}
                className="rounded-lg p-3"
                style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${BORDER}` }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="h-3 w-3" style={{ color: "#2C69CF" }} />
                  <div className="text-[12px] font-medium" style={{ color: PANE_TEXT }}>{ins.title}</div>
                </div>
                <div className="text-[11px] leading-relaxed" style={{ color: PANE_MUTED }}>{ins.body}</div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[10px] font-mono" style={{ color: "#2C69CF" }}>AI · {ins.confidence}%</span>
                  {ins.cta && (
                    <button className="text-[11px] font-medium" style={{ color: "#2C69CF" }}>{ins.cta} →</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="text-[10px] uppercase tracking-[0.14em] mb-2" style={{ color: PANE_MUTED }}>
            Context library
          </div>
          <button
            onClick={() => fileRef.current?.click()}
            className="w-full inline-flex items-center justify-center gap-2 h-9 rounded-md text-xs font-medium"
            style={{ background: "rgba(255,255,255,0.05)", color: PANE_TEXT, border: `1px dashed ${BORDER}` }}
          >
            <Paperclip className="h-3.5 w-3.5" /> Upload context (PDF, CSV, XLSX)
          </button>
          <input
            ref={fileRef}
            type="file"
            multiple
            accept=".pdf,.csv,.xlsx,.docx,.txt"
            className="hidden"
            onChange={(e) => {
              const files = Array.from(e.target.files ?? []).map((f) => ({
                name: f.name,
                size: `${(f.size / 1024).toFixed(0)} KB`,
              }));
              setUploads((u) => [...u, ...files]);
              e.target.value = "";
            }}
          />
          {uploads.length > 0 && (
            <ul className="mt-2 space-y-1">
              {uploads.map((u, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 rounded-md px-2 py-1.5 text-[11px]"
                  style={{ background: "rgba(255,255,255,0.04)", color: PANE_TEXT }}
                >
                  <FileText className="h-3 w-3" style={{ color: PANE_MUTED }} />
                  <span className="flex-1 truncate">{u.name}</span>
                  <span style={{ color: PANE_MUTED }}>{u.size}</span>
                  <button
                    onClick={() => setUploads((us) => us.filter((_, j) => j !== i))}
                    style={{ color: PANE_MUTED }}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {msgs.length > 0 && (
          <section>
            <div className="text-[10px] uppercase tracking-[0.14em] mb-2" style={{ color: PANE_MUTED }}>
              Conversation
            </div>
            <div className="space-y-2">
              {msgs.map((m, i) => (
                <div
                  key={i}
                  className="rounded-lg px-3 py-2 text-[12px] leading-relaxed"
                  style={{
                    background: m.role === "user" ? "rgba(44,105,207,0.18)" : "rgba(255,255,255,0.04)",
                    color: PANE_TEXT,
                    border: `1px solid ${BORDER}`,
                  }}
                >
                  {m.text}
                </div>
              ))}
              {busy && (
                <div className="text-[11px] italic" style={{ color: PANE_MUTED }}>Thinking…</div>
              )}
            </div>
          </section>
        )}
      </div>

      {/* Composer */}
      <div className="px-3 pt-3 pb-3" style={{ borderTop: `1px solid ${BORDER}` }}>
        <div
          className="flex items-end gap-2 rounded-lg p-2"
          style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${BORDER}` }}
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder={`Ask Limnn about ${t.label.toLowerCase()}…`}
            rows={2}
            className="flex-1 resize-none bg-transparent text-[12px] outline-none placeholder:opacity-60"
            style={{ color: PANE_TEXT }}
          />
          <button
            onClick={send}
            disabled={!input.trim() || busy}
            className="h-8 w-8 grid place-items-center rounded-md disabled:opacity-40"
            style={{ background: "#2C69CF", color: "#FFFFFF" }}
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="mt-2 flex items-center justify-between text-[10px]" style={{ color: PANE_MUTED }}>
          <span>Limnn-Pro · Gemini</span>
          <span>Shift + Enter for newline</span>
        </div>
      </div>
    </aside>
  );
}
