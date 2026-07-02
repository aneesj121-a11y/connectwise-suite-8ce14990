import { createFileRoute } from "@tanstack/react-router";
import { HubPage } from "@/components/hubs/page";
import { SectionCard, RiskBadge, Avatar } from "@/components/enterprise/primitives";
import { SKILLS, SKILL_MATRIX, EMPLOYEES } from "@/lib/people-data";
import { Sparkles } from "lucide-react";

const ACCENT = "oklch(0.58 0.18 280)";

export const Route = createFileRoute("/people/skills")({
  head: () => ({ meta: [{ title: "Skills — Limnn People" }] }),
  component: Skills,
});

function Dot({ level }: { level: number }) {
  const configs = [
    { bg: "var(--muted)", border: "var(--border)" },
    { bg: `color-mix(in oklab, ${ACCENT} 25%, transparent)`, border: ACCENT },
    { bg: `color-mix(in oklab, ${ACCENT} 55%, transparent)`, border: ACCENT },
    { bg: ACCENT, border: ACCENT },
    { bg: ACCENT, border: ACCENT, star: true },
  ];
  const c = configs[level];
  return (
    <span className="inline-block h-4 w-4 rounded-full border grid place-items-center" style={{ background: c.bg, borderColor: c.border, color: "white", fontSize: 8 }}>
      {c.star && "★"}
    </span>
  );
}

function Skills() {
  const rows = Object.keys(SKILL_MATRIX);
  return (
    <HubPage title="Skills matrix" description="Proficiency across teams. Star = expert.">
      <SectionCard>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 pr-3 text-[10px] uppercase tracking-wider text-muted-foreground">Employee</th>
                {SKILLS.map((s) => <th key={s} className="text-center py-2 px-2 text-[10px] uppercase tracking-wider text-muted-foreground">{s}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((id) => {
                const emp = EMPLOYEES.find((e) => e.id === id);
                if (!emp) return null;
                return (
                  <tr key={id}>
                    <td className="py-2 pr-3"><div className="flex items-center gap-2"><Avatar name={emp.name} size={22} /><span className="text-xs font-medium">{emp.name}</span></div></td>
                    {SKILLS.map((s) => (<td key={s} className="text-center py-2"><Dot level={SKILL_MATRIX[id][s]} /></td>))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex items-center gap-3 text-[11px] text-muted-foreground">
          <span>Legend:</span>
          {[0, 1, 2, 3, 4].map((l) => <span key={l} className="inline-flex items-center gap-1"><Dot level={l} /> {["None", "Learning", "Working", "Advanced", "Expert"][l]}</span>)}
        </div>
      </SectionCard>

      <SectionCard
        title={<span className="inline-flex items-center gap-2"><span className="h-6 w-6 rounded-md grid place-items-center" style={{ background: `color-mix(in oklab, ${ACCENT} 14%, transparent)`, color: ACCENT }}><Sparkles className="h-3 w-3" /></span> AI Skills gap</span>}
      >
        <p className="text-sm mb-3">Kubernetes and AI/ML are shortage areas relative to your 12-month roadmap. Recommend cross-training + 2 targeted hires.</p>
        <div className="space-y-2">
          {[
            { s: "Kubernetes", have: 3, need: 8 },
            { s: "AI/ML", have: 2, need: 6 },
            { s: "SQL", have: 5, need: 6 },
            { s: "Design", have: 2, need: 4 },
          ].map((g) => (
            <div key={g.s} className="flex items-center gap-3">
              <span className="w-24 text-xs">{g.s}</span>
              <div className="flex-1 flex items-center gap-1 h-4">
                <div className="rounded" style={{ width: `${(g.have / 10) * 100}%`, background: ACCENT, height: "100%" }} />
                <div className="rounded" style={{ width: `${((g.need - g.have) / 10) * 100}%`, background: "color-mix(in oklab, var(--destructive) 30%, transparent)", height: "100%" }} />
              </div>
              <span className="text-[11px] font-mono text-muted-foreground w-16 text-right">{g.have} / {g.need}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-3">
          <RiskBadge confidence={81} />
          <a className="text-xs underline" style={{ color: ACCENT }}>Recommended: Limnn Learning · Kubernetes Foundations</a>
        </div>
      </SectionCard>
    </HubPage>
  );
}
