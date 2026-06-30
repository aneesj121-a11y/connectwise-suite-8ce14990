import { createFileRoute } from "@tanstack/react-router";
import { HubPage } from "@/components/hubs/page";
import { SectionCard, StatusPill } from "@/components/enterprise/primitives";
import { CERTIFICATIONS, trackById } from "@/lib/lms-data";
import { Award, Download, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/lms/certifications")({
  head: () => ({ meta: [{ title: "My Certifications — Limnn Learning" }] }),
  component: Page,
});

function Page() {
  return (
    <HubPage title="My Certifications" description="Active, expiring and historical certifications across your tracks.">
      <SectionCard title={`${CERTIFICATIONS.length} certifications`}>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {CERTIFICATIONS.map((c) => {
            const track = trackById(c.trackId);
            const level =
              c.status === "Active" ? "green" : c.status === "Pending Renewal" ? "yellow" : "red";
            return (
              <article key={c.id} className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-start justify-between mb-2">
                  <div
                    className="h-10 w-10 rounded-md grid place-items-center"
                    style={{
                      background: `color-mix(in oklab, ${track?.color ?? "#7C3AED"} 14%, transparent)`,
                      color: track?.color ?? "#7C3AED",
                    }}
                  >
                    <Award className="h-5 w-5" />
                  </div>
                  <StatusPill level={level}>{c.status}</StatusPill>
                </div>
                <h3 className="font-display font-semibold tracking-tight">{c.name}</h3>
                <p className="text-xs text-muted-foreground">{track?.tagline}</p>
                <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Score</div>
                    <div className="font-mono">{c.score}%</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Issued</div>
                    <div>{c.issued}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Expires</div>
                    <div>{c.expires}</div>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <button className="h-8 px-3 inline-flex items-center gap-1.5 rounded-md text-xs font-medium text-primary-foreground" style={{ background: "var(--primary)" }}>
                    <Download className="h-3.5 w-3.5" /> Download PDF
                  </button>
                  {c.status !== "Active" && (
                    <button className="h-8 px-3 inline-flex items-center gap-1.5 rounded-md text-xs font-medium border border-border hover:bg-accent">
                      <RefreshCw className="h-3.5 w-3.5" /> Renew
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </SectionCard>
    </HubPage>
  );
}
