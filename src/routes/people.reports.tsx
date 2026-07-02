import { createFileRoute } from "@tanstack/react-router";
import { HubPage } from "@/components/hubs/page";
import { SectionCard, KpiCard, RiskBadge, TrendSpark } from "@/components/enterprise/primitives";
import { DEPT_HEADCOUNT, DEPT_COLORS } from "@/lib/people-data";
import { Users, UserPlus, UserMinus, Sparkles } from "lucide-react";
import { useState } from "react";

const ACCENT = "oklch(0.58 0.18 280)";
const TABS = ["Overview", "Headcount", "Attrition", "Recruitment", "DEI", "Compensation"] as const;

export const Route = createFileRoute("/people/reports")({
  head: () => ({ meta: [{ title: "People Reports — Limnn People" }] }),
  component: Reports,
});

function Reports() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Overview");
  return (
    <HubPage title="People Reports" description="Workforce analytics, DEI, and AI forecast.">
      <div className="flex items-center gap-1 border-b border-border mb-2 overflow-x-auto">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} className="text-sm px-3 py-2 border-b-2 whitespace-nowrap" style={{ borderColor: tab === t ? ACCENT : "transparent", color: tab === t ? "var(--foreground)" : "var(--muted-foreground)", fontWeight: tab === t ? 600 : 400 }}>{t}</button>
        ))}
      </div>

      {tab === "Overview" && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <KpiCard label="Headcount" value="247" delta={3} icon={Users} spark={[220, 224, 228, 232, 235, 238, 240, 244, 247]} />
            <KpiCard label="Hires YTD" value="34" icon={UserPlus} />
            <KpiCard label="Exits YTD" value="14" icon={UserMinus} />
            <KpiCard label="Attrition (TTM)" value="4.2%" delta={-1.4} icon={UserMinus} />
          </div>
          <SectionCard title="Hires vs Exits (last 12 mo)">
            <div className="flex items-end justify-between h-40 gap-1">
              {Array.from({ length: 12 }).map((_, i) => {
                const h = 3 + Math.round(Math.sin(i / 2) * 2 + 3);
                const x = 1 + Math.round(Math.cos(i / 3) * 2 + 2);
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                    <div className="w-full rounded-t" style={{ height: h * 14, background: ACCENT }} />
                    <div className="w-full rounded-t" style={{ height: x * 14, background: "color-mix(in oklab, var(--destructive) 50%, transparent)" }} />
                    <span className="text-[9px] text-muted-foreground">{i + 1}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-2 flex gap-4 text-[11px]"><span className="inline-flex items-center gap-1"><span className="h-2 w-3 rounded" style={{ background: ACCENT }} /> Hires</span><span className="inline-flex items-center gap-1"><span className="h-2 w-3 rounded bg-rose-500/60" /> Exits</span></div>
          </SectionCard>

          <SectionCard
            title={<span className="inline-flex items-center gap-2"><span className="h-6 w-6 rounded-md grid place-items-center" style={{ background: `color-mix(in oklab, ${ACCENT} 14%, transparent)`, color: ACCENT }}><Sparkles className="h-3 w-3" /></span> AI Workforce Forecast</span>}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Current vs recommended trajectory (24 mo)</div>
                <div className="relative">
                  <TrendSpark values={[247, 252, 258, 265, 270, 276, 282, 289, 295, 300, 306, 312]} width={520} height={80} color={ACCENT} />
                  <div className="absolute inset-0"><TrendSpark values={[247, 254, 262, 270, 279, 288, 298, 308, 316, 324, 331, 338]} width={520} height={80} color="var(--muted-foreground)" /></div>
                </div>
                <div className="mt-2 text-[11px] text-muted-foreground">Model projects current plan reaches 312 by mid-2028. Recommended plan (+8% ramp in AI/ML hiring) reaches 338 with faster time-to-revenue.</div>
                <div className="mt-2"><RiskBadge confidence={83} /></div>
              </div>
              <div className="space-y-2">
                {[
                  { name: "Conservative", cost: "$1.32M/mo", delta: "+9%" },
                  { name: "Recommended", cost: "$1.41M/mo", delta: "+17%" },
                  { name: "Aggressive", cost: "$1.58M/mo", delta: "+31%" },
                ].map((s) => (
                  <div key={s.name} className="rounded-lg border border-border p-3">
                    <div className="text-xs font-semibold">{s.name}</div>
                    <div className="text-[11px] text-muted-foreground">Payroll {s.cost} · headcount {s.delta}</div>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>
        </>
      )}

      {tab === "Headcount" && (
        <SectionCard title="Headcount by department">
          <div className="space-y-2.5">
            {Object.entries(DEPT_HEADCOUNT).map(([d, n]) => (
              <div key={d} className="flex items-center gap-3">
                <span className="w-24 text-xs">{d}</span>
                <div className="flex-1 h-5 rounded bg-muted overflow-hidden"><div className="h-full rounded" style={{ width: `${(n / 82) * 100}%`, background: DEPT_COLORS[d] }} /></div>
                <span className="w-10 text-right text-xs font-mono">{n}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {tab === "Attrition" && <SectionCard><p className="text-sm text-muted-foreground">Attrition trend by dept, tenure and manager (mock).</p></SectionCard>}
      {tab === "Recruitment" && <SectionCard><p className="text-sm text-muted-foreground">Time-to-fill, source of hire, pass-through rates (mock).</p></SectionCard>}
      {tab === "Compensation" && <SectionCard><p className="text-sm text-muted-foreground">Comp ratio, band coverage, market benchmarks (mock).</p></SectionCard>}

      {tab === "DEI" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <SectionCard title="Gender"><Donut segments={[{ label: "Women", pct: 46, color: ACCENT }, { label: "Men", pct: 51, color: "#2C69CF" }, { label: "Non-binary", pct: 3, color: "#F59E0B" }]} /></SectionCard>
            <SectionCard title="Ethnicity"><Donut segments={[{ label: "Asian", pct: 34, color: "#6366F1" }, { label: "White", pct: 38, color: "#94A3B8" }, { label: "Black", pct: 12, color: "#F59E0B" }, { label: "Latino", pct: 10, color: "#EC4899" }, { label: "Other", pct: 6, color: "#10B981" }]} /></SectionCard>
            <SectionCard title="Age"><Donut segments={[{ label: "<25", pct: 8, color: "#10B981" }, { label: "25–34", pct: 42, color: ACCENT }, { label: "35–44", pct: 32, color: "#2C69CF" }, { label: "45+", pct: 18, color: "#F59E0B" }]} /></SectionCard>
          </div>
          <SectionCard title="Representation by level">
            <div className="space-y-2">
              {[{ l: "IC", w: 48 }, { l: "Manager", w: 42 }, { l: "Director", w: 36 }, { l: "VP+", p: 33 }].map((r) => (
                <div key={r.l} className="flex items-center gap-3">
                  <span className="w-24 text-xs">{r.l}</span>
                  <div className="flex-1 h-4 rounded bg-muted overflow-hidden"><div className="h-full rounded" style={{ width: `${r.w ?? r.p}%`, background: ACCENT }} /></div>
                  <span className="w-10 text-right text-xs font-mono">{r.w ?? r.p}%</span>
                </div>
              ))}
            </div>
          </SectionCard>
          <SectionCard title={<span className="inline-flex items-center gap-2"><span className="h-6 w-6 rounded-md grid place-items-center" style={{ background: `color-mix(in oklab, ${ACCENT} 14%, transparent)`, color: ACCENT }}><Sparkles className="h-3 w-3" /></span> Pay gap insight</span>}>
            <p className="text-sm">Adjusted pay gap: <b>−1.8%</b> (women earn 98.2¢ per $1). Unadjusted: <b>−7.4%</b>, driven by underrepresentation at Director+ level.</p>
            <div className="mt-2"><RiskBadge confidence={90} /></div>
          </SectionCard>
        </>
      )}
    </HubPage>
  );
}

function Donut({ segments }: { segments: { label: string; pct: number; color: string }[] }) {
  const r = 42;
  const c = 2 * Math.PI * r;
  let off = 0;
  return (
    <div className="flex items-center gap-4">
      <svg width="110" height="110" viewBox="0 0 110 110">
        <circle cx="55" cy="55" r={r} fill="none" stroke="var(--muted)" strokeWidth="14" />
        {segments.map((s) => {
          const len = (s.pct / 100) * c;
          const el = <circle key={s.label} cx="55" cy="55" r={r} fill="none" stroke={s.color} strokeWidth="14" strokeDasharray={`${len} ${c}`} strokeDashoffset={-off} transform="rotate(-90 55 55)" />;
          off += len;
          return el;
        })}
      </svg>
      <ul className="text-xs space-y-1">
        {segments.map((s) => (
          <li key={s.label} className="inline-flex items-center gap-2 mr-3"><span className="h-2.5 w-2.5 rounded" style={{ background: s.color }} />{s.label} <span className="font-mono text-muted-foreground">{s.pct}%</span></li>
        ))}
      </ul>
    </div>
  );
}
