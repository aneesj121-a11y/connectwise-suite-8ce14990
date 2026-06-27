import { createFileRoute } from "@tanstack/react-router";
import { HubPage } from "@/components/hubs/page";
import { SectionCard, KpiCard, StatusPill, RiskBadge } from "@/components/enterprise/primitives";
import { Rocket, Clock, CheckCircle2, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/cs/onboarding")({
  head: () => ({ meta: [{ title: "Customer Success — Onboarding" }] }),
  component: OnboardingPage,
});

const COHORT = [
  { acct: "Globex",        day: 12, ttv: 21, blocker: "SSO config",     status: "yellow", pct: 60 },
  { acct: "Acme Co",       day: 7,  ttv: 30, blocker: null,             status: "green",  pct: 28 },
  { acct: "Atlas Robotics",day: 32, ttv: 28, blocker: "Data migration", status: "red",    pct: 65 },
  { acct: "Bluebird Media",day: 25, ttv: 21, blocker: null,             status: "green",  pct: 92 },
];

const MILESTONES = [
  "Kickoff scheduled",
  "Tenant provisioned",
  "SSO + SCIM",
  "Data migration",
  "First-call workflow",
  "Manager enablement",
  "Production go-live",
];

function OnboardingPage() {
  return (
    <HubPage
      title="Onboarding Trackers"
      description="Time-to-Value milestones for every newly activated customer."
      insights={[
        { title: "Atlas: TTV slipping",        body: "Day 32 vs 28-day target. Migration blocker unresolved 9 days — recommend escalation to PS lead.", confidence: 89, cta: "Escalate" },
        { title: "SSO blocker pattern",        body: "3 of last 6 onboardings stalled at SSO. Auto-suggest pre-kickoff IdP discovery call.", confidence: 82, cta: "Add to template" },
      ]}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Active onboardings" value="4"  icon={Rocket} />
        <KpiCard label="Avg TTV"            value="22d" delta={-3} icon={Clock} />
        <KpiCard label="On-track"           value="2"  icon={CheckCircle2} />
        <KpiCard label="Blocked"            value="2"  icon={AlertTriangle} />
      </div>

      <SectionCard title="Cohort" subtitle="In-flight customers and their milestone progress">
        <ul className="space-y-3">
          {COHORT.map((c) => (
            <li key={c.acct} className="rounded-md border border-border p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{c.acct}</span>
                  <StatusPill level={c.status as "green" | "yellow" | "red"}>{c.status === "red" ? "Blocked" : c.status === "yellow" ? "Watch" : "On track"}</StatusPill>
                  {c.blocker && <RiskBadge confidence={86} label="Risk" />}
                </div>
                <span className="text-xs text-muted-foreground">Day {c.day} / target {c.ttv}d</span>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {MILESTONES.map((m, i) => {
                  const reached = (i / MILESTONES.length) * 100 < c.pct;
                  return (
                    <div key={m} className="rounded text-[10px] p-1.5 text-center"
                      style={{
                        background: reached ? "color-mix(in oklab, var(--primary) 14%, transparent)" : "var(--muted)",
                        color: reached ? "var(--primary)" : "var(--muted-foreground)",
                      }}>
                      {m}
                    </div>
                  );
                })}
              </div>
              {c.blocker && (
                <div className="mt-2 text-[11px] text-[color:var(--destructive)] flex items-center gap-1.5">
                  <AlertTriangle className="h-3 w-3" /> Blocker: {c.blocker}
                </div>
              )}
            </li>
          ))}
        </ul>
      </SectionCard>
    </HubPage>
  );
}
