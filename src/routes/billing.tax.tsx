import { createFileRoute } from "@tanstack/react-router";
import { HubPage } from "@/components/hubs/page";
import { SectionCard, KpiCard, StatusPill, RiskBadge } from "@/components/enterprise/primitives";
import { hubInsights } from "@/lib/hubs-data";
import { Calculator, Globe, ShieldCheck, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/billing/tax")({
  head: () => ({ meta: [{ title: "Billing — Tax & Compliance" }] }),
  component: TaxPage,
});

const JURISDICTIONS = [
  { region: "US — California", base: 284100, rate: 7.25, owed: 20597, status: "Filed" },
  { region: "US — New York", base: 142400, rate: 8.875, owed: 12638, status: "Filed" },
  { region: "EU — Germany", base: 96200, rate: 19, owed: 18278, status: "Pending" },
  { region: "UK", base: 84800, rate: 20, owed: 16960, status: "Pending" },
  { region: "Canada — Ontario", base: 38400, rate: 13, owed: 4992, status: "Filed" },
];

const CONTROLS = [
  { name: "SOC 2 Type II", status: "Active", expires: "2027-04-30", risk: 8 },
  { name: "ISO 27001", status: "Active", expires: "2026-12-14", risk: 14 },
  { name: "PCI DSS L1", status: "In audit", expires: "2026-09-01", risk: 32 },
  { name: "HIPAA BAA template", status: "Active", expires: "n/a", risk: 6 },
];

function TaxPage() {
  const owed = JURISDICTIONS.reduce((s, j) => s + j.owed, 0);
  return (
    <HubPage
      title="Tax & Compliance"
      description="Sales tax, VAT, and compliance controls across jurisdictions."
      insights={hubInsights("billing")}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Tax owed (qtr)" value={`$${(owed/1000).toFixed(0)}k`} icon={Calculator} />
        <KpiCard label="Jurisdictions" value={`${JURISDICTIONS.length}`} icon={Globe} />
        <KpiCard label="Open controls" value={`${CONTROLS.length}`} icon={ShieldCheck} />
        <KpiCard label="Compliance alerts" value="1" icon={AlertTriangle} />
      </div>

      <SectionCard title="Tax by jurisdiction">
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-muted-foreground border-b border-border">
            <tr>
              <th className="py-2 pr-3 font-medium">Region</th>
              <th className="py-2 pr-3 font-medium text-right">Taxable base</th>
              <th className="py-2 pr-3 font-medium text-right">Rate</th>
              <th className="py-2 pr-3 font-medium text-right">Owed</th>
              <th className="py-2 pr-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {JURISDICTIONS.map((j) => (
              <tr key={j.region} className="hover:bg-muted/40">
                <td className="py-2.5 pr-3 font-medium">{j.region}</td>
                <td className="py-2.5 pr-3 text-right font-mono text-xs">${j.base.toLocaleString()}</td>
                <td className="py-2.5 pr-3 text-right font-mono text-xs">{j.rate}%</td>
                <td className="py-2.5 pr-3 text-right font-mono text-xs">${j.owed.toLocaleString()}</td>
                <td className="py-2.5 pr-3"><StatusPill level={j.status === "Filed" ? "green" : "yellow"}>{j.status}</StatusPill></td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>

      <SectionCard title="Compliance controls">
        <ul className="divide-y divide-border">
          {CONTROLS.map((c) => (
            <li key={c.name} className="py-2.5 flex items-center gap-3">
              <ShieldCheck className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <div className="text-sm font-medium">{c.name}</div>
                <div className="text-[11px] text-muted-foreground">Expires {c.expires}</div>
              </div>
              <RiskBadge confidence={c.risk} label="Risk" />
              <StatusPill level={c.status === "Active" ? "green" : "yellow"}>{c.status}</StatusPill>
            </li>
          ))}
        </ul>
      </SectionCard>
    </HubPage>
  );
}
