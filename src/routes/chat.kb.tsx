import { createFileRoute } from "@tanstack/react-router";
import { HubPage } from "@/components/hubs/page";
import { SectionCard, KpiCard, StatusPill, RiskBadge } from "@/components/enterprise/primitives";
import { Library, FileText, Edit, Sparkles, Eye } from "lucide-react";

export const Route = createFileRoute("/chat/kb")({
  head: () => ({ meta: [{ title: "Support — Knowledge Base" }] }),
  component: KbPage,
});

const FOLDERS = [
  { name: "Drafts",    count: 18, color: "var(--muted-foreground)" },
  { name: "Published", count: 142, color: "var(--success)" },
  { name: "Internal",  count: 64,  color: "var(--primary)" },
  { name: "Archived",  count: 27,  color: "var(--muted-foreground)" },
];

const ARTICLES = [
  { title: "Troubleshooting WebRTC dropped calls", folder: "Published", views: 4218, ai: false, conf: 0, updated: "2d" },
  { title: "Configuring SSO with Okta",            folder: "Published", views: 2841, ai: false, conf: 0, updated: "1w" },
  { title: "[AI-draft] EU recording compliance",   folder: "Drafts",    views: 0,    ai: true,  conf: 88, updated: "3h" },
  { title: "[AI-draft] Macro: refund handoff",     folder: "Drafts",    views: 0,    ai: true,  conf: 92, updated: "5h" },
  { title: "Field guide: voicemail drop rules",    folder: "Internal",  views: 612,  ai: false, conf: 0, updated: "4d" },
];

function KbPage() {
  return (
    <HubPage
      title="Knowledge Base"
      description="Author articles. Limnn AI watches resolution patterns and drafts new KB entries automatically."
      actions={
        <button className="h-9 px-3 rounded-md text-sm font-medium text-primary-foreground inline-flex items-center gap-1.5" style={{ background: "var(--primary)" }}>
          <Edit className="h-3.5 w-3.5" /> New article
        </button>
      }
      insights={[
        { title: "2 AI drafts ready to review",  body: "Both based on closure patterns ≥ 4 tickets in last 7 days. Publishing could deflect ~18 tickets/wk.", confidence: 90, cta: "Review drafts" },
        { title: "Stale: WebRTC guide",          body: "Top-viewed article last edited 92 days ago — refresh suggested before next major release.", confidence: 76 },
      ]}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {FOLDERS.map((f) => (
          <KpiCard key={f.name} label={f.name} value={String(f.count)} icon={f.name === "Published" ? FileText : Library} />
        ))}
      </div>

      <SectionCard title="All articles">
        <ul className="divide-y divide-border">
          {ARTICLES.map((a) => (
            <li key={a.title} className="py-3 grid grid-cols-[1fr_140px_100px_70px_80px] items-center gap-3">
              <div>
                <div className="text-sm font-medium flex items-center gap-2">
                  {a.title}
                  {a.ai && <RiskBadge confidence={a.conf} label="AI" />}
                </div>
                <div className="text-[11px] text-muted-foreground">Updated {a.updated} ago</div>
              </div>
              <StatusPill level={a.folder === "Published" ? "green" : a.folder === "Drafts" ? "yellow" : "blue"}>{a.folder}</StatusPill>
              <div className="text-xs text-muted-foreground inline-flex items-center gap-1"><Eye className="h-3 w-3" /> {a.views.toLocaleString()}</div>
              <button className="text-xs font-medium inline-flex items-center gap-1" style={{ color: "var(--primary)" }}>
                {a.ai ? <><Sparkles className="h-3 w-3" /> Review</> : <><Edit className="h-3 w-3" /> Edit</>}
              </button>
              <span></span>
            </li>
          ))}
        </ul>
      </SectionCard>
    </HubPage>
  );
}
