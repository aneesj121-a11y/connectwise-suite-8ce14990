import { createFileRoute } from "@tanstack/react-router";
import { HubPage } from "@/components/hubs/page";
import { SectionCard, KpiCard, StatusPill, RiskBadge } from "@/components/enterprise/primitives";
import { hubInsights } from "@/lib/hubs-data";
import { FlaskConical, Trophy, Plus, Sparkles } from "lucide-react";

export const Route = createFileRoute("/marketing/ab-tests")({
  head: () => ({ meta: [{ title: "Marketing — Experiments" }] }),
  component: ExperimentsPage,
});

const TESTS = [
  { name: "Homepage hero — outcome-led copy", status: "Running", sample: 14820, lift: 12.4, conf: 94, winner: "Variant B" },
  { name: "Pricing page CTA color", status: "Running", sample: 9220, lift: 3.1, conf: 71, winner: "—" },
  { name: "Demo form — 3 fields vs 6", status: "Concluded", sample: 21400, lift: 38.0, conf: 99, winner: "Variant A (3 fields)" },
  { name: "Email subject — urgency vs curiosity", status: "Concluded", sample: 18200, lift: -4.2, conf: 88, winner: "Control" },
  { name: "Webinar CTA — date vs topic first", status: "Draft", sample: 0, lift: 0, conf: 0, winner: "—" },
];

function ExperimentsPage() {
  return (
    <HubPage
      title="Experiments"
      description="A/B and multi-armed bandit tests with AI-monitored statistical significance."
      actions={
        <button className="h-9 px-3 rounded-md text-sm font-medium text-primary-foreground inline-flex items-center gap-1.5" style={{ background: "var(--primary)" }}>
          <Plus className="h-3.5 w-3.5" /> New experiment
        </button>
      }
      insights={hubInsights("marketing")}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Active tests" value="7" icon={FlaskConical} />
        <KpiCard label="Avg uplift" value="+11.4%" delta={8} icon={Trophy} />
        <KpiCard label="Confidence median" value="91%" delta={3} icon={Sparkles} />
        <KpiCard label="Concluded (qtr)" value="14" />
      </div>

      <SectionCard title="Experiment registry">
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-muted-foreground border-b border-border">
            <tr>
              <th className="py-2 pr-3 font-medium">Experiment</th>
              <th className="py-2 pr-3 font-medium">Status</th>
              <th className="py-2 pr-3 font-medium text-right">Sample</th>
              <th className="py-2 pr-3 font-medium text-right">Lift</th>
              <th className="py-2 pr-3 font-medium">Confidence</th>
              <th className="py-2 pr-3 font-medium">Winner</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {TESTS.map((t) => (
              <tr key={t.name} className="hover:bg-muted/40">
                <td className="py-2.5 pr-3 font-medium">{t.name}</td>
                <td className="py-2.5 pr-3"><StatusPill level={t.status === "Running" ? "blue" : t.status === "Concluded" ? "green" : "neutral"}>{t.status}</StatusPill></td>
                <td className="py-2.5 pr-3 text-right font-mono text-xs">{t.sample.toLocaleString()}</td>
                <td className="py-2.5 pr-3 text-right font-mono text-xs" style={{ color: t.lift > 0 ? "var(--success)" : t.lift < 0 ? "var(--destructive)" : "var(--muted-foreground)" }}>
                  {t.lift > 0 ? "+" : ""}{t.lift}%
                </td>
                <td className="py-2.5 pr-3">{t.conf > 0 ? <RiskBadge confidence={t.conf} label="p" /> : <span className="text-xs text-muted-foreground">—</span>}</td>
                <td className="py-2.5 pr-3 text-xs">{t.winner}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>
    </HubPage>
  );
}
