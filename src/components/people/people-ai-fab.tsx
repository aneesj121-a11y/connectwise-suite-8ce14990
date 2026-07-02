import { useState } from "react";
import { Sparkles, X, Send } from "lucide-react";

const ACCENT = "oklch(0.58 0.18 280)";

const CHIPS = [
  "Who's on leave?",
  "Draft a JD",
  "Attrition trends",
  "Overtime by team",
];

const MOCK_QA = {
  q: "Who's on leave next week?",
  a: "3 people are scheduled off Jul 8–12: Priya Sharma (Annual, 6d), David Chen (WFH, 5d), Fatima Al-Rashid (Annual, 5d). Engineering will be at 92% capacity — Ahmed Hassan's team most affected.",
};

export function PeopleAiFab() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-40 h-13 w-13 rounded-full grid place-items-center shadow-lg hover:scale-105 transition"
        style={{
          background: `linear-gradient(135deg, ${ACCENT}, oklch(0.5 0.22 290))`,
          boxShadow: `0 12px 32px -8px color-mix(in oklab, ${ACCENT} 55%, transparent)`,
          height: 52,
          width: 52,
        }}
        title="Ask Limnn People AI"
      >
        {open ? <X className="h-5 w-5 text-white" /> : <Sparkles className="h-5 w-5 text-white" />}
      </button>

      {open && (
        <aside
          className="fixed bottom-24 right-6 z-40 w-[380px] max-h-[560px] rounded-xl border bg-card shadow-2xl flex flex-col overflow-hidden"
          style={{ borderColor: `color-mix(in oklab, ${ACCENT} 25%, var(--border))` }}
        >
          <header
            className="px-4 py-3 flex items-center gap-2 border-b"
            style={{
              background: `linear-gradient(135deg, color-mix(in oklab, ${ACCENT} 14%, transparent), transparent)`,
              borderColor: `color-mix(in oklab, ${ACCENT} 20%, var(--border))`,
            }}
          >
            <span
              className="h-7 w-7 rounded-md grid place-items-center"
              style={{ background: ACCENT }}
            >
              <Sparkles className="h-3.5 w-3.5 text-white" />
            </span>
            <div className="flex-1">
              <div className="font-display font-semibold text-[14px] tracking-tight">Ask Limnn People AI</div>
              <div className="text-[10.5px] text-muted-foreground">Grounded on your HRIS, ATS & payroll</div>
            </div>
          </header>

          <div className="flex-1 overflow-auto p-4 space-y-3 text-sm">
            <div className="flex flex-wrap gap-1.5">
              {CHIPS.map((c) => (
                <button
                  key={c}
                  onClick={() => setInput(c)}
                  className="text-[11px] px-2.5 py-1 rounded-full border transition hover:bg-accent"
                  style={{
                    borderColor: `color-mix(in oklab, ${ACCENT} 25%, var(--border))`,
                    color: ACCENT,
                    background: `color-mix(in oklab, ${ACCENT} 6%, transparent)`,
                  }}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="flex justify-end">
              <div
                className="max-w-[85%] rounded-2xl rounded-tr-sm px-3 py-2 text-[13px]"
                style={{ background: ACCENT, color: "white" }}
              >
                {MOCK_QA.q}
              </div>
            </div>

            <div className="flex items-start gap-2">
              <span
                className="h-6 w-6 rounded-md grid place-items-center shrink-0 mt-0.5"
                style={{ background: `color-mix(in oklab, ${ACCENT} 14%, transparent)`, color: ACCENT }}
              >
                <Sparkles className="h-3 w-3" />
              </span>
              <div className="flex-1 rounded-2xl rounded-tl-sm border border-border bg-muted/40 px-3 py-2 text-[13px] leading-relaxed">
                {MOCK_QA.a}
              </div>
            </div>
          </div>

          <div className="p-3 border-t border-border flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your people…"
              className="flex-1 h-9 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2"
              style={{ boxShadow: `0 0 0 0 ${ACCENT}` }}
            />
            <button
              className="h-9 w-9 grid place-items-center rounded-md text-white"
              style={{ background: ACCENT }}
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </aside>
      )}
    </>
  );
}
