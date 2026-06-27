import { createFileRoute } from "@tanstack/react-router";
import { HubPage } from "@/components/hubs/page";
import { SectionCard, KpiCard, StatusPill, RiskBadge } from "@/components/enterprise/primitives";
import { hubInsights } from "@/lib/hubs-data";
import { PenLine, Eye, ThumbsUp, Plus, Wand2 } from "lucide-react";

export const Route = createFileRoute("/marketing/content")({
  head: () => ({ meta: [{ title: "Marketing — Content Studio" }] }),
  component: ContentPage,
});

const ASSETS = [
  { title: "AI Dialer — Buyer's Guide (PDF)", type: "Ebook", status: "Live", views: 4820, eng: 38, ai: 84 },
  { title: "5 ways to cut handle time", type: "Blog", status: "Live", views: 2914, eng: 22, ai: 71 },
  { title: "Conversation intelligence demo", type: "Video", status: "Live", views: 1820, eng: 51, ai: 88 },
  { title: "Compliance playbook FY26", type: "Whitepaper", status: "Review", views: 0, eng: 0, ai: 78 },
  { title: "ROI calculator template", type: "Tool", status: "Live", views: 612, eng: 64, ai: 92 },
  { title: "Customer story — Acme Corp", type: "Case study", status: "Draft", views: 0, eng: 0, ai: 65 },
];

function ContentPage() {
  return (
    <HubPage
      title="Content Studio"
      description="Asset library with AI-drafted variants, performance, and engagement."
      actions={
        <>
          <button className="h-9 px-3 rounded-md border border-border text-sm font-medium inline-flex items-center gap-1.5 hover:bg-accent">
            <Wand2 className="h-3.5 w-3.5" /> AI draft
          </button>
          <button className="h-9 px-3 rounded-md text-sm font-medium text-primary-foreground inline-flex items-center gap-1.5" style={{ background: "var(--primary)" }}>
            <Plus className="h-3.5 w-3.5" /> New asset
          </button>
        </>
      }
      insights={hubInsights("marketing")}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Live assets" value="42" icon={PenLine} />
        <KpiCard label="Total views (30d)" value="14.8k" delta={22} icon={Eye} />
        <KpiCard label="Avg engagement" value="38%" delta={6} icon={ThumbsUp} />
        <KpiCard label="AI assist rate" value="71%" delta={14} />
      </div>

      <SectionCard title="Asset library">
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-muted-foreground border-b border-border">
            <tr>
              <th className="py-2 pr-3 font-medium">Title</th>
              <th className="py-2 pr-3 font-medium">Type</th>
              <th className="py-2 pr-3 font-medium">Status</th>
              <th className="py-2 pr-3 font-medium text-right">Views</th>
              <th className="py-2 pr-3 font-medium text-right">Engagement</th>
              <th className="py-2 pr-3 font-medium">AI score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {ASSETS.map((a) => (
              <tr key={a.title} className="hover:bg-muted/40">
                <td className="py-2.5 pr-3 font-medium">{a.title}</td>
                <td className="py-2.5 pr-3 text-xs text-muted-foreground">{a.type}</td>
                <td className="py-2.5 pr-3">
                  <StatusPill level={a.status === "Live" ? "green" : a.status === "Review" ? "yellow" : "neutral"}>{a.status}</StatusPill>
                </td>
                <td className="py-2.5 pr-3 text-right font-mono text-xs">{a.views.toLocaleString()}</td>
                <td className="py-2.5 pr-3 text-right font-mono text-xs">{a.eng}%</td>
                <td className="py-2.5 pr-3"><RiskBadge confidence={a.ai} label="Quality" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>
    </HubPage>
  );
}
