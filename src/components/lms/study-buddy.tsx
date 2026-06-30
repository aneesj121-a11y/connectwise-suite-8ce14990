import { useState } from "react";
import { Sparkles, Send, ChevronRight, ChevronLeft, BookOpen } from "lucide-react";
import type { Module } from "@/lib/lms-data";

const PANEL_BG = "#1E293B";
const PANEL_TEXT = "#F8FAFC";
const PANEL_DIM = "#94A3B8";
const ACCENT = "#7C3AED";
const BORDER = "rgba(255,255,255,0.08)";

type Msg = { role: "user" | "ai"; text: string };

const SEED_SUGGESTIONS = [
  "Summarize this module in 5 bullets",
  "Quiz me on the last chapter",
  "Show the related SOP",
  "Where does this connect to my role?",
];

export function StudyBuddy({ module }: { module: Module }) {
  const [open, setOpen] = useState(true);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "ai",
      text: `Hi — I'm your Limnn AI Study Buddy. I'm grounded in "${module.title}" and its linked SOPs. Ask anything.`,
    },
  ]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t || busy) return;
    setMsgs((m) => [...m, { role: "user", text: t }]);
    setInput("");
    setBusy(true);
    setTimeout(() => {
      setMsgs((m) => [
        ...m,
        {
          role: "ai",
          text: `On "${module.title}": ${t.length > 60 ? "I've pulled together a grounded answer with citations from the linked SOPs." : "here's a short take — ask for citations or a deeper dive if you want."}`,
        },
      ]);
      setBusy(false);
    }, 700);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="h-9 px-3 inline-flex items-center gap-2 rounded-md text-sm font-medium text-white shadow"
        style={{ background: `linear-gradient(135deg, ${ACCENT}, #2C69CF)` }}
      >
        <Sparkles className="h-3.5 w-3.5" /> Open Study Buddy <ChevronLeft className="h-3.5 w-3.5" />
      </button>
    );
  }

  return (
    <aside
      className="w-[340px] shrink-0 flex flex-col rounded-xl overflow-hidden"
      style={{ background: PANEL_BG, color: PANEL_TEXT, border: `1px solid ${BORDER}` }}
    >
      <header className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: `1px solid ${BORDER}` }}>
        <span
          className="h-7 w-7 rounded-md grid place-items-center"
          style={{ background: `linear-gradient(135deg, ${ACCENT}, #2C69CF)` }}
        >
          <Sparkles className="h-3.5 w-3.5 text-white" />
        </span>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold leading-tight" style={{ fontFamily: "Poppins, sans-serif" }}>
            Study Buddy
          </div>
          <div className="text-[10px] uppercase tracking-[0.14em]" style={{ color: PANEL_DIM }}>
            Grounded in this module
          </div>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="h-7 w-7 grid place-items-center rounded-md hover:bg-white/5"
          style={{ color: PANEL_DIM }}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </header>

      <div
        className="px-3 py-2 flex items-center gap-1.5 text-[11px]"
        style={{ borderBottom: `1px solid ${BORDER}`, color: PANEL_DIM }}
      >
        <BookOpen className="h-3 w-3" /> Context: <span style={{ color: PANEL_TEXT }}>{module.title}</span>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2 max-h-[420px]">
        {msgs.map((m, i) => (
          <div
            key={i}
            className="rounded-lg px-3 py-2 text-[12.5px] leading-relaxed"
            style={{
              background:
                m.role === "user" ? "rgba(124,58,237,0.22)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${BORDER}`,
            }}
          >
            {m.text}
          </div>
        ))}
        {busy && (
          <div className="text-[11px] italic" style={{ color: PANEL_DIM }}>
            Thinking…
          </div>
        )}
        {msgs.length <= 2 && (
          <div className="pt-2">
            <div className="text-[10px] uppercase tracking-[0.14em] mb-1.5" style={{ color: PANEL_DIM }}>
              Try
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SEED_SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-[11px] px-2 py-1 rounded-full"
                  style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${BORDER}`, color: PANEL_TEXT }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-2.5" style={{ borderTop: `1px solid ${BORDER}` }}>
        <div
          className="flex items-end gap-1.5 rounded-lg p-1.5"
          style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${BORDER}` }}
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            rows={2}
            placeholder="Ask about this module…"
            className="flex-1 resize-none bg-transparent text-[12px] outline-none placeholder:opacity-60 px-1.5 py-1"
            style={{ color: PANEL_TEXT }}
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || busy}
            className="h-7 w-7 grid place-items-center rounded-md disabled:opacity-40"
            style={{ background: ACCENT, color: "#fff" }}
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
