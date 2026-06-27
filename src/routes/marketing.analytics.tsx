import { createFileRoute } from "@tanstack/react-router";
import { HubPage } from "@/components/hubs/page";
import { SectionCard, KpiCard, FilterBar } from "@/components/enterprise/primitives";
import { hubInsights } from "@/lib/hubs-data";
import { PieChart, TrendingUp, DollarSign, Users } from "lucide-react";

export const Route = createFileRoute("/marketing/analytics")({
  head: () => ({ meta: [{ title: "Marketing — Attribution" }] }),
  component: AttributionPage,
});

const MIX = [
  { channel: "LinkedIn ABM", first: 18, last: 26, linear: 22, ai: 31, spend: 22100 },
  { channel: "Paid Search", first: 24, last: 21, linear: 22, ai: 19, spend: 34800 },
  { channel: "Email Nurture", first: 31, last: 28, linear: 30, ai: 24, spend: 18400 },
  { channel: "Webinars", first: 12, last: 14, linear: 13, ai: 16, spend: 6200 },
  { channel: "Display", first: 15, last: 11, linear: 13, ai: 10, spend: 4900 },
];

const COHORTS = [
  { cohort: "FY26 Q1", m1: 100, m2: 92, m3: 88, m6: 81, m12: 76 },
  { cohort: "FY25 Q4", m1: 100, m2: 94, m3: 89, m6: 82, m12: 74 },
  { cohort: "FY25 Q3", m1: 100, m2: 91, m3: 84, m6: 75, m12: 68 },
  { cohort: "FY25 Q2", m1: 100, m2: 89, m3: 82, m6: 71, m12: 64 },
];

function AttributionPage() {
  return (
    <HubPage
      title="Attribution & Analytics"
      description="Multi-touch attribution with cohort retention and channel ROI."
      insights={hubInsights("marketing")}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Pipeline sourced" value="$2.41M" delta={18} icon={DollarSign} />
        <KpiCard label="Influenced" value="$5.82M" delta={12} icon={TrendingUp} />
        <KpiCard label="Avg touches to close" value="9.4" delta={-3} icon={Users} />
        <KpiCard label="MTA confidence" value="87%" delta={5} icon={PieChart} />
      </div>

      <SectionCard title="Attribution model comparison" subtitle="Pipeline share by channel">
        <FilterBar chips={["First-touch", "Last-touch", "Linear", "AI-weighted"]} active="AI-weighted" />
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-muted-foreground border-b border-border">
            <tr>
              <th className="py-2 pr-3 font-medium">Channel</th>
              <th className="py-2 pr-3 font-medium text-right">First</th>
              <th className="py-2 pr-3 font-medium text-right">Last</th>
              <th className="py-2 pr-3 font-medium text-right">Linear</th>
              <th className="py-2 pr-3 font-medium text-right">AI</th>
              <th className="py-2 pr-3 font-medium text-right">Spend</th>
              <th className="py-2 pr-3 font-medium text-right">ROI (AI)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {MIX.map((r) => {
              const roi = ((r.ai * 24100) / r.spend).toFixed(1);
              return (
                <tr key={r.channel} className="hover:bg-muted/40">
                  <td className="py-2.5 pr-3 font-medium">{r.channel}</td>
                  <td className="py-2.5 pr-3 text-right font-mono text-xs">{r.first}%</td>
                  <td className="py-2.5 pr-3 text-right font-mono text-xs">{r.last}%</td>
                  <td className="py-2.5 pr-3 text-right font-mono text-xs">{r.linear}%</td>
                  <td className="py-2.5 pr-3 text-right font-mono text-xs font-semibold" style={{ color: "var(--primary)" }}>{r.ai}%</td>
                  <td className="py-2.5 pr-3 text-right font-mono text-xs">${r.spend.toLocaleString()}</td>
                  <td className="py-2.5 pr-3 text-right font-mono text-xs">{roi}x</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </SectionCard>

      <SectionCard title="Cohort retention" subtitle="Customer retention by acquisition quarter">
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-muted-foreground border-b border-border">
            <tr>
              <th className="py-2 pr-3 font-medium">Cohort</th>
              <th className="py-2 pr-3 font-medium text-right">M1</th>
              <th className="py-2 pr-3 font-medium text-right">M2</th>
              <th className="py-2 pr-3 font-medium text-right">M3</th>
              <th className="py-2 pr-3 font-medium text-right">M6</th>
              <th className="py-2 pr-3 font-medium text-right">M12</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {COHORTS.map((c) => (
              <tr key={c.cohort} className="hover:bg-muted/40">
                <td className="py-2.5 pr-3 font-medium">{c.cohort}</td>
                {[c.m1, c.m2, c.m3, c.m6, c.m12].map((v, i) => (
                  <td key={i} className="py-2.5 pr-3 text-right">
                    <span className="inline-block rounded px-2 py-0.5 font-mono text-xs"
                      style={{
                        background: `color-mix(in oklab, var(--primary) ${v / 2}%, transparent)`,
                        color: v >= 80 ? "var(--primary)" : "var(--foreground)",
                      }}>
                      {v}%
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>
    </HubPage>
  );
}
