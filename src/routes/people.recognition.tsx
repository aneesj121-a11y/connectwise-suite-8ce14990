import { createFileRoute } from "@tanstack/react-router";
import { HubPage } from "@/components/hubs/page";
import { SectionCard, Avatar } from "@/components/enterprise/primitives";
import { RECOGNITIONS } from "@/lib/people-data";
import { Heart, Plus, X } from "lucide-react";
import { useState } from "react";

const ACCENT = "oklch(0.58 0.18 280)";
const BADGES = ["⭐", "🎯", "🤝", "💡", "🔥"];

export const Route = createFileRoute("/people/recognition")({
  head: () => ({ meta: [{ title: "Recognition — Limnn People" }] }),
  component: Recognition,
});

function Recognition() {
  const [open, setOpen] = useState(false);
  return (
    <HubPage
      title="Wall of Fame"
      description="Public recognition across teams."
      actions={
        <button onClick={() => setOpen(true)} className="h-9 px-3 rounded-md text-white text-sm font-medium inline-flex items-center gap-1.5" style={{ background: ACCENT }}>
          <Plus className="h-3.5 w-3.5" /> Give Recognition
        </button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {RECOGNITIONS.map((r) => (
          <article key={r.id} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex -space-x-2">
                <Avatar name={r.giver} size={28} />
                <Avatar name={r.receiver} size={28} />
              </div>
              <span className="text-xs text-muted-foreground truncate"><b className="text-foreground">{r.giver}</b> → <b className="text-foreground">{r.receiver}</b></span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{r.badge}</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `color-mix(in oklab, ${ACCENT} 12%, transparent)`, color: ACCENT }}>{r.badgeName}</span>
            </div>
            <p className="text-sm leading-relaxed">{r.message}</p>
            <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>{r.ts}</span>
              <span className="inline-flex items-center gap-1"><Heart className="h-3 w-3" /> {r.likes}</span>
            </div>
          </article>
        ))}
      </div>

      <SectionCard title="Top 10 leaderboard" subtitle="Most-recognized teammates this quarter">
        <ol className="divide-y divide-border">
          {[
            "Priya Sharma", "Lisa Fernandez", "David Chen", "Fatima Al-Rashid", "Raj Patel",
            "Kenji Watanabe", "Ahmed Hassan", "Amara Diallo", "Tomoko Ishida", "Michael Okonjo",
          ].map((n, i) => (
            <li key={n} className="py-2 flex items-center gap-3">
              <span className="w-6 text-xs font-mono font-semibold text-muted-foreground">#{i + 1}</span>
              <Avatar name={n} size={24} />
              <span className="flex-1 font-medium text-sm">{n}</span>
              <span className="text-xs font-mono text-muted-foreground">{42 - i * 3} 🏆</span>
            </li>
          ))}
        </ol>
      </SectionCard>

      {open && (
        <div className="fixed inset-0 bg-black/40 z-50 grid place-items-center p-4" onClick={() => setOpen(false)}>
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold">Give recognition</h2>
              <button onClick={() => setOpen(false)} className="h-8 w-8 grid place-items-center rounded-md hover:bg-accent"><X className="h-4 w-4" /></button>
            </div>
            <div className="space-y-3">
              <label className="block">
                <span className="block text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Recipient</span>
                <select className="w-full h-9 px-3 rounded-md border border-border bg-background text-sm"><option>Priya Sharma</option><option>Lisa Fernandez</option><option>David Chen</option></select>
              </label>
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">Badge</span>
                <div className="flex gap-1.5">{BADGES.map((b) => (<button key={b} className="h-10 w-10 rounded-md border border-border text-xl hover:bg-accent">{b}</button>))}</div>
              </div>
              <label className="block">
                <span className="block text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Message</span>
                <textarea rows={4} placeholder="Say something specific and personal…" className="w-full p-2 rounded-md border border-border bg-background text-sm" />
              </label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> Post publicly to the Wall</label>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setOpen(false)} className="h-9 px-3 rounded-md border border-border text-sm">Cancel</button>
              <button className="h-9 px-3 rounded-md text-white text-sm font-medium" style={{ background: ACCENT }}>Send</button>
            </div>
          </div>
        </div>
      )}
    </HubPage>
  );
}
