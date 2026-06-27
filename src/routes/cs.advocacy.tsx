import { createFileRoute } from "@tanstack/react-router";
import { HubPage } from "@/components/hubs/page";
import { SectionCard, KpiCard, StatusPill, Avatar } from "@/components/enterprise/primitives";
import { Star, Mic, FileText, Quote } from "lucide-react";

export const Route = createFileRoute("/cs/advocacy")({
  head: () => ({ meta: [{ title: "Customer Success — Advocacy" }] }),
  component: AdvocacyPage,
});

const ADVOCATES = [
  { name: "Priya Mehta",  title: "Director CX, Acme",       acct: "Acme Corporation", nps: 10, willing: ["Case study", "Webinar", "Press"], healthDays: 142 },
  { name: "Jordan Reyes", title: "VP Sales, Bluebird",      acct: "Bluebird Media",   nps: 9,  willing: ["Reference call", "Review"],       healthDays: 98 },
  { name: "Sam Chen",     title: "Ops Lead, Atlas",         acct: "Atlas Robotics",   nps: 9,  willing: ["G2 review"],                       healthDays: 121 },
];

function AdvocacyPage() {
  return (
    <HubPage
      title="Advocacy Center"
      description="Identify power users ready for case studies, joint marketing, and public reviews."
      insights={[
        { title: "Ready-to-ask: Acme",  body: "Health has held > 85 for 142 days. Suggest a G2 review request now while NPS is fresh.", confidence: 88, cta: "Send request" },
        { title: "Webinar candidate",   body: "Priya Mehta's quarterly KPI improvement aligns with our upcoming AI-coach webinar narrative.", confidence: 79 },
      ]}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Active advocates" value={`${ADVOCATES.length}`} delta={1} icon={Star} />
        <KpiCard label="Reviews YTD"      value="14" delta={40} icon={Quote} />
        <KpiCard label="Case studies"     value="6"  delta={2}  icon={FileText} />
        <KpiCard label="Reference calls"  value="22" delta={18} icon={Mic} />
      </div>

      <SectionCard title="Power users">
        <ul className="space-y-2">
          {ADVOCATES.map((a) => (
            <li key={a.name} className="rounded-md border border-border p-3 flex items-center gap-3">
              <Avatar name={a.name} size={36} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{a.name}</span>
                  <StatusPill level="green">NPS {a.nps}</StatusPill>
                  <span className="text-[11px] text-muted-foreground">health stable {a.healthDays}d</span>
                </div>
                <div className="text-[11px] text-muted-foreground">{a.title} · {a.acct}</div>
                <div className="mt-1.5 flex gap-1 flex-wrap">
                  {a.willing.map((w) => (
                    <span key={w} className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: "color-mix(in oklab, var(--primary) 10%, transparent)", color: "var(--primary)" }}>{w}</span>
                  ))}
                </div>
              </div>
              <button className="h-8 px-3 rounded-md text-xs font-medium text-primary-foreground" style={{ background: "var(--primary)" }}>
                Request
              </button>
            </li>
          ))}
        </ul>
      </SectionCard>
    </HubPage>
  );
}
