import { createFileRoute } from "@tanstack/react-router";
import { HubPage } from "@/components/hubs/page";
import { SectionCard, KpiCard, TrendSpark, RiskBadge } from "@/components/enterprise/primitives";
import { Smile, Frown, Clock, TrendingDown } from "lucide-react";

export const Route = createFileRoute("/chat/csat")({
  head: () => ({ meta: [{ title: "Support — CSAT & Insights" }] }),
  component: CsatPage,
});

const AGENTS = [
  { name: "Mia P.",   csat: 4.8, asr: "2m 14s", volume: 184 },
  { name: "Alex R.",  csat: 4.7, asr: "2m 38s", volume: 162 },
  { name: "Jordan K.",csat: 4.5, asr: "3m 02s", volume: 148 },
  { name: "Sam D.",   csat: 4.3, asr: "3m 41s", volume: 132 },
];

const FRICTION = [
  { theme: "Refund eligibility unclear", mentions: 38, sentiment: -0.62 },
  { theme: "Status page link missing",   mentions: 22, sentiment: -0.41 },
  { theme: "Robotic opener line",        mentions: 18, sentiment: -0.34 },
];

function CsatPage() {
  return (
    <HubPage
      title="CSAT & Insights"
      description="Quality metrics with NLP-driven friction analysis on negative feedback."
      insights={[
        { title: "Top friction: refund flow", body: "38 negative mentions reference 'unclear refund eligibility'. Script update suggested.", confidence: 91, cta: "Update script" },
        { title: "ASR regression",            body: "Median Avg Speed of Response up 11s vs last month — concentrated in EU mornings.", confidence: 84 },
      ]}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="CSAT (30d)"    value="4.62"  delta={2} icon={Smile}        spark={[4.4,4.5,4.5,4.6,4.55,4.62,4.62]} />
        <KpiCard label="Median ASR"    value="2m 48s" delta={-6} icon={Clock} />
        <KpiCard label="Negative %"    value="6.4%"  delta={-1} icon={Frown} />
        <KpiCard label="First-touch resolve" value="71%" delta={3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Agent rankings">
          <ul className="space-y-3">
            {AGENTS.map((a) => (
              <li key={a.name} className="grid grid-cols-[1fr_80px_80px_60px] items-center gap-3 text-sm">
                <div className="font-medium">{a.name}</div>
                <div className="font-mono text-xs">CSAT {a.csat}</div>
                <div className="font-mono text-xs text-muted-foreground">{a.asr}</div>
                <div className="text-right text-xs text-muted-foreground">{a.volume}</div>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Top friction themes" subtitle="NLP analysis of negative feedback">
          <ul className="space-y-2">
            {FRICTION.map((f) => (
              <li key={f.theme} className="rounded-md border border-border p-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{f.theme}</span>
                  <RiskBadge confidence={Math.round(Math.abs(f.sentiment)*100)+30} />
                </div>
                <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                  <TrendingDown className="h-3 w-3 text-[color:var(--destructive)]" /> {f.mentions} mentions · sentiment {f.sentiment.toFixed(2)}
                </div>
                <div className="mt-1.5"><TrendSpark values={[3,4,5,7,9,12,f.mentions/4]} color="var(--destructive)" width={180} height={20} /></div>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </HubPage>
  );
}
