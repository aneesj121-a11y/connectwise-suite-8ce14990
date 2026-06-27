import { createFileRoute } from "@tanstack/react-router";
import { HubPage } from "@/components/hubs/page";
import { SectionCard, KpiCard, StatusPill, RiskBadge } from "@/components/enterprise/primitives";
import { hubInsights } from "@/lib/hubs-data";
import { Layers, Users, Sparkles, Plus } from "lucide-react";

export const Route = createFileRoute("/marketing/segments")({
  head: () => ({ meta: [{ title: "Marketing — Segments" }] }),
  component: SegmentsPage,
});

const SEGMENTS = [
  { name: "Enterprise FinServ — surging", size: 482, growth: 18, status: "Active", score: 92, owner: "Priya S." },
  { name: "Mid-market Healthcare", size: 1240, growth: 6, status: "Active", score: 78, owner: "Marcus L." },
  { name: "Lapsed pilots (90d)", size: 217, growth: -12, status: "Active", score: 64, owner: "Jordan K." },
  { name: "EU Logistics ICP", size: 348, growth: 11, status: "Draft", score: 71, owner: "Alex R." },
  { name: "Tier 1 — multi-product", size: 96, growth: 4, status: "Active", score: 88, owner: "Priya S." },
  { name: "Webinar attendees Q2", size: 612, growth: 22, status: "Paused", score: 58, owner: "Mia P." },
];

function SegmentsPage() {
  return (
    <HubPage
      title="Segments"
      description="Dynamic audience builder with AI lookalikes and ICP fit scoring."
      actions={
        <button className="h-9 px-3 rounded-md text-sm font-medium text-primary-foreground inline-flex items-center gap-1.5" style={{ background: "var(--primary)" }}>
          <Plus className="h-3.5 w-3.5" /> New segment
        </button>
      }
      insights={hubInsights("marketing")}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Active segments" value="24" icon={Layers} />
        <KpiCard label="Total reach" value="38.2k" delta={9} icon={Users} />
        <KpiCard label="Avg ICP fit" value="74" delta={6} icon={Sparkles} />
        <KpiCard label="Lookalike conversion" value="2.4x" delta={11} />
      </div>

      <SectionCard title="Segments library">
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-muted-foreground border-b border-border">
            <tr>
              <th className="py-2 pr-3 font-medium">Segment</th>
              <th className="py-2 pr-3 font-medium text-right">Size</th>
              <th className="py-2 pr-3 font-medium text-right">Growth 30d</th>
              <th className="py-2 pr-3 font-medium">Owner</th>
              <th className="py-2 pr-3 font-medium">ICP fit</th>
              <th className="py-2 pr-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {SEGMENTS.map((s) => (
              <tr key={s.name} className="hover:bg-muted/40">
                <td className="py-2.5 pr-3 font-medium">{s.name}</td>
                <td className="py-2.5 pr-3 text-right font-mono text-xs">{s.size.toLocaleString()}</td>
                <td className="py-2.5 pr-3 text-right font-mono text-xs" style={{ color: s.growth >= 0 ? "var(--success)" : "var(--destructive)" }}>
                  {s.growth >= 0 ? "+" : ""}{s.growth}%
                </td>
                <td className="py-2.5 pr-3 text-xs">{s.owner}</td>
                <td className="py-2.5 pr-3"><RiskBadge confidence={s.score} label="Fit" /></td>
                <td className="py-2.5 pr-3"><StatusPill level={s.status === "Active" ? "green" : s.status === "Draft" ? "blue" : "yellow"}>{s.status}</StatusPill></td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>
    </HubPage>
  );
}
