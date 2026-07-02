import { createFileRoute } from "@tanstack/react-router";
import { HubPage } from "@/components/hubs/page";
import { SectionCard, StatusPill, RiskBadge } from "@/components/enterprise/primitives";
import { OPENINGS } from "@/lib/people-data";
import { Sparkles, ArrowRightLeft, MapPin, Calendar } from "lucide-react";

const ACCENT = "oklch(0.58 0.18 280)";

export const Route = createFileRoute("/people/mobility")({
  head: () => ({ meta: [{ title: "Internal Mobility — Limnn People" }] }),
  component: Mobility,
});

function Mobility() {
  return (
    <HubPage title="Internal Mobility" description="Move sideways, up, or into a new craft.">
      <SectionCard
        title={<span className="inline-flex items-center gap-2"><span className="h-6 w-6 rounded-md grid place-items-center" style={{ background: `color-mix(in oklab, ${ACCENT} 14%, transparent)`, color: ACCENT }}><Sparkles className="h-3 w-3" /></span> AI recommended for you</span>}
        subtitle="Based on your skills, career history and stated interests"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { title: "Senior PM — AI", why: "Strong overlap on product + AI/ML + shipped 3 major features this year.", match: 91 },
            { title: "Design Systems Engineer", why: "Frontend expertise + your React and Design ratings match the top of the band.", match: 84 },
            { title: "Sales Enablement Lead", why: "Cross-functional stretch — closes a documented interest gap you noted in Q1.", match: 72 },
          ].map((r) => (
            <div key={r.title} className="rounded-lg border p-3" style={{ borderColor: `color-mix(in oklab, ${ACCENT} 25%, var(--border))`, background: `color-mix(in oklab, ${ACCENT} 4%, transparent)` }}>
              <div className="flex items-center justify-between mb-1"><h4 className="font-medium text-sm">{r.title}</h4><RiskBadge confidence={r.match} label="Match" /></div>
              <p className="text-xs text-muted-foreground leading-relaxed">{r.why}</p>
              <button className="mt-2 h-7 px-2.5 rounded-md text-white text-xs" style={{ background: ACCENT }}>Explore</button>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Internal openings">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {OPENINGS.map((o) => (
            <article key={o.id} className="rounded-lg border border-border bg-card p-3">
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div>
                  <h4 className="font-medium text-sm">{o.title}</h4>
                  <div className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-3">
                    <span>{o.dept}</span>
                    <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{o.location}</span>
                    <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" />{o.posted}</span>
                  </div>
                </div>
                <RiskBadge confidence={o.match} label="Match" />
              </div>
              <div className="mt-2 flex items-center justify-between">
                <StatusPill level="blue">Internal only · 14d</StatusPill>
                <button className="h-8 px-3 rounded-md text-white text-xs font-medium inline-flex items-center gap-1" style={{ background: ACCENT }}>
                  <ArrowRightLeft className="h-3 w-3" /> Apply
                </button>
              </div>
            </article>
          ))}
        </div>
      </SectionCard>
    </HubPage>
  );
}
