import { createFileRoute } from "@tanstack/react-router";
import { HubPage } from "@/components/hubs/page";
import { SectionCard, StatusPill } from "@/components/enterprise/primitives";
import { ShieldCheck, KeyRound, Globe, Webhook, Palette, Sliders } from "lucide-react";

export const Route = createFileRoute("/lms/owner")({
  head: () => ({ meta: [{ title: "LMS Configurator — Limnn LMS" }] }),
  component: Page,
});

function Page() {
  return (
    <HubPage
      title="LMS Configurator"
      description="Owner-level controls: governance, branding, integrations and policy defaults."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SectionCard title="Global policy defaults">
          <Row label="Default attempt limit" value="6 attempts" />
          <Row label="Default min watch %" value="90%" />
          <Row label="Allow skipping (default)" value="Off" />
          <Row label="Certificate validity" value="12 months" />
          <Row label="Cohort handoff to CS" value="On (auto)" />
        </SectionCard>
        <SectionCard title="Roles & permissions" action={<StatusPill level="blue">RBAC</StatusPill>}>
          <Row label="Enablement Lead" value="Full LMS admin" />
          <Row label="Evaluator" value="Scoped to assigned trainees" />
          <Row label="Trainee" value="Read + submit only" />
          <Row label="Owner" value="All + configurator" />
        </SectionCard>
        <SectionCard title="Branding" action={<Palette className="h-4 w-4 text-muted-foreground" />}>
          <Row label="Primary color" value="#7C3AED" />
          <Row label="Certificate template" value="Limnn-Classic-v3" />
          <Row label="Player chrome" value="Cream canvas · navy bar" />
        </SectionCard>
        <SectionCard title="Integrations" action={<Webhook className="h-4 w-4 text-muted-foreground" />}>
          <Row label="HRIS sync" value="BambooHR · Daily" />
          <Row label="Slack notifications" value="On (via Limnn Threads)" />
          <Row label="SSO" value="Okta · SAML 2.0" />
          <Row label="Webhook on completion" value="2 endpoints" />
        </SectionCard>
        <SectionCard title="Data residency" action={<Globe className="h-4 w-4 text-muted-foreground" />}>
          <Row label="Region" value="EU-West-1" />
          <Row label="PII redaction in AI logs" value="On" />
          <Row label="Retention" value="2 years rolling" />
        </SectionCard>
        <SectionCard title="API & keys" action={<KeyRound className="h-4 w-4 text-muted-foreground" />}>
          <Row label="LMS public key" value="lmnn_pk_•••3f" />
          <Row label="Webhook signing secret" value="rotated 14d ago" />
          <button className="h-8 px-3 rounded-md text-xs font-medium border border-border hover:bg-accent inline-flex items-center gap-1.5">
            <Sliders className="h-3 w-3" /> Manage
          </button>
        </SectionCard>
      </div>

      <SectionCard
        title="Governance log"
        action={<ShieldCheck className="h-4 w-4 text-muted-foreground" />}
      >
        <ul className="text-sm divide-y divide-border">
          {[
            ["2026-06-29 14:21", "Anees Naveed", "Updated attempt limit policy: 3 → 6"],
            ["2026-06-28 09:02", "Mia Patel", "Published Growth Expert · v4"],
            ["2026-06-25 16:44", "System", "Auto-flagged 4 trainees for retraining"],
          ].map(([t, who, what], i) => (
            <li key={i} className="py-2 flex items-center gap-3">
              <span className="text-[11px] font-mono text-muted-foreground w-40">{t}</span>
              <span className="text-sm font-medium w-32">{who}</span>
              <span className="text-sm flex-1">{what}</span>
            </li>
          ))}
        </ul>
      </SectionCard>
    </HubPage>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}
