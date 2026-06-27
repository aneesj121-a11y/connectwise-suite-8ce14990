import { type ReactNode } from "react";
import { PageHeader, SectionCard, AiInsightCard, FilterBar } from "@/components/enterprise/primitives";
import { Sparkles, Plus, Download } from "lucide-react";

/** Shared hub page wrapper — consistent padding + AI insight rail. */
export function HubPage({
  title,
  description,
  actions,
  insights,
  children,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  insights?: { title: string; body: string; cta?: string; confidence?: number }[];
  children: ReactNode;
}) {
  return (
    <div className="container-page py-8">
      <PageHeader title={title} description={description} actions={actions} />
      <div className={insights?.length ? "grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5" : ""}>
        <div className="space-y-5 min-w-0">{children}</div>
        {insights?.length ? (
          <aside className="space-y-3">
            <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="h-3 w-3" /> AI insights
            </div>
            {insights.map((ins, i) => (
              <AiInsightCard key={i} {...ins} />
            ))}
          </aside>
        ) : null}
      </div>
    </div>
  );
}

/** Lightweight stub page used by sub-routes that aren't fully fleshed out yet. */
export function HubStub({
  title,
  description,
  bullets = [],
}: {
  title: string;
  description: string;
  bullets?: string[];
}) {
  return (
    <HubPage
      title={title}
      description={description}
      actions={
        <>
          <button className="h-9 px-3 rounded-md border border-border text-sm font-medium inline-flex items-center gap-1.5 hover:bg-accent">
            <Download className="h-3.5 w-3.5" /> Export
          </button>
          <button
            className="h-9 px-3 rounded-md text-sm font-medium text-primary-foreground inline-flex items-center gap-1.5"
            style={{ background: "var(--primary)" }}
          >
            <Plus className="h-3.5 w-3.5" /> New
          </button>
        </>
      }
    >
      <FilterBar chips={["All", "Mine", "Last 30d", "Saved view"]} active="All" />
      <SectionCard title="Overview">
        <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">{description}</p>
        {bullets.length > 0 && (
          <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0" style={{ background: "var(--primary)" }} />
                <span className="text-foreground/90">{b}</span>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </HubPage>
  );
}
