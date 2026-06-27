import { createFileRoute } from "@tanstack/react-router";
import { HubPage } from "@/components/hubs/page";
import { SectionCard, KpiCard, RiskBadge } from "@/components/enterprise/primitives";
import { hubInsights } from "@/lib/hubs-data";
import { LineChart, TrendingUp, Wallet, Activity } from "lucide-react";

export const Route = createFileRoute("/billing/fpa")({
  head: () => ({ meta: [{ title: "Billing — FP&A Engine" }] }),
  component: FpaPage,
});

const MONTHS = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const FORECAST = [
  { metric: "MRR",      v: [142, 152, 164, 178, 192, 208], unit: "k" },
  { metric: "Net new",  v: [12, 14, 16, 18, 20, 22], unit: "k" },
  { metric: "Burn",     v: [86, 88, 90, 92, 94, 96], unit: "k" },
  { metric: "Runway (mo)", v: [22, 22, 21, 21, 21, 20], unit: "" },
];

const SCENARIOS = [
  { name: "Base", arr: "$4.2M", growth: "+38%", risk: 56 },
  { name: "Bull", arr: "$5.0M", growth: "+64%", risk: 28 },
  { name: "Bear", arr: "$3.4M", growth: "+12%", risk: 84 },
];

function FpaPage() {
  return (
    <HubPage
      title="FP&A Engine"
      description="Manager-only forecast modelling with scenario rollups."
      insights={hubInsights("billing")}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Forecast Q4 ARR" value="$4.2M" delta={9} icon={Wallet} spark={[3.4, 3.6, 3.8, 3.9, 4.0, 4.1, 4.2]} />
        <KpiCard label="Net new MRR (Dec)" value="$22k" delta={14} icon={TrendingUp} />
        <KpiCard label="Burn (Dec)" value="$96k" delta={4} icon={Activity} />
        <KpiCard label="Runway" value="20 mo" icon={LineChart} />
      </div>

      <SectionCard title="6-month forecast">
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-muted-foreground border-b border-border">
            <tr>
              <th className="py-2 pr-3 font-medium">Metric</th>
              {MONTHS.map((m) => (
                <th key={m} className="py-2 pr-3 font-medium text-right">{m}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {FORECAST.map((row) => (
              <tr key={row.metric}>
                <td className="py-2.5 pr-3 font-medium">{row.metric}</td>
                {row.v.map((x, i) => (
                  <td key={i} className="py-2.5 pr-3 text-right font-mono text-xs">{row.unit === "k" ? "$" : ""}{x}{row.unit}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>

      <SectionCard title="Scenario planning">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {SCENARIOS.map((s) => (
            <div key={s.name} className="rounded-lg border border-border p-4">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{s.name}</div>
              <div className="mt-1 text-2xl font-display font-semibold tracking-tight">{s.arr}</div>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-xs" style={{ color: "var(--success)" }}>{s.growth} YoY</span>
                <RiskBadge confidence={s.risk} label="Risk" />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </HubPage>
  );
}
