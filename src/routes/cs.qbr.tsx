import { createFileRoute } from "@tanstack/react-router";
import { HubPage } from "@/components/hubs/page";
import { SectionCard, KpiCard, RiskBadge } from "@/components/enterprise/primitives";
import { Presentation, FileDown, Sparkles, Wand2, Check } from "lucide-react";

export const Route = createFileRoute("/cs/qbr")({
  head: () => ({ meta: [{ title: "Customer Success — QBR Builder" }] }),
  component: QbrPage,
});

const SLIDES = [
  { id: "exec",   title: "Executive summary",     ai: true,  filled: true,  detail: "Auto-summarized from quarter activities, NPS, support." },
  { id: "usage",  title: "Usage & adoption",      ai: true,  filled: true,  detail: "12 charts · seat utilization, feature breadth, AI minutes consumed." },
  { id: "roi",    title: "Realized ROI",          ai: true,  filled: true,  detail: "Cost-per-call savings + revenue lift from AI coaching." },
  { id: "sup",    title: "Support & reliability", ai: true,  filled: false, detail: "P1/P2 resolved, MTTR, status incidents." },
  { id: "rdmp",   title: "Roadmap commitments",   ai: false, filled: false, detail: "Manually curated commitments for next 90 days." },
  { id: "asks",   title: "Asks & references",     ai: false, filled: false, detail: "Renewal, expansion, case study, peer intro requests." },
];

function QbrPage() {
  return (
    <HubPage
      title="QBR Builder"
      description="Auto-compile a quarter's data into a polished review deck — one click."
      actions={
        <>
          <button className="h-9 px-3 rounded-md border border-border text-sm font-medium inline-flex items-center gap-1.5 hover:bg-accent">
            <FileDown className="h-3.5 w-3.5" /> Export PPTX
          </button>
          <button className="h-9 px-3 rounded-md text-sm font-medium text-primary-foreground inline-flex items-center gap-1.5" style={{ background: "var(--primary)" }}>
            <Wand2 className="h-3.5 w-3.5" /> Auto-draft full deck
          </button>
        </>
      }
      insights={[
        { title: "Strongest narrative: ROI",  body: "Cost-per-call dropped 27% vs baseline; AI coaching attached to +9pp win rate.", confidence: 86, cta: "Pin to deck" },
        { title: "Watch-out: support load",   body: "P2 ticket volume up 18% YoY — soften framing in the support slide.", confidence: 74 },
      ]}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Decks drafted (Q)" value="14"  delta={40} icon={Presentation} />
        <KpiCard label="Avg build time"    value="6m"  delta={-72} />
        <KpiCard label="ROI captured"      value="$1.2M" delta={22} />
        <KpiCard label="NPS"               value="58"  delta={6} />
      </div>

      <SectionCard title="Acme Corp — Q3 FY26 deck" subtitle="6 slides · 4 auto-filled by Limnn AI">
        <ul className="space-y-2">
          {SLIDES.map((s, i) => (
            <li key={s.id} className="grid grid-cols-[24px_1fr_auto] items-center gap-3 rounded-md border border-border p-3">
              <span className="font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{s.title}</span>
                  {s.ai && <RiskBadge confidence={91} label="AI" />}
                  {s.filled ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium" style={{ color: "var(--success)" }}>
                      <Check className="h-2.5 w-2.5" /> Auto-filled
                    </span>
                  ) : (
                    <span className="text-[10px] text-muted-foreground">Pending</span>
                  )}
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{s.detail}</div>
              </div>
              <button className="text-xs font-medium inline-flex items-center gap-1" style={{ color: "var(--primary)" }}>
                <Sparkles className="h-3 w-3" /> {s.filled ? "Refine" : "Draft"}
              </button>
            </li>
          ))}
        </ul>
      </SectionCard>
    </HubPage>
  );
}
