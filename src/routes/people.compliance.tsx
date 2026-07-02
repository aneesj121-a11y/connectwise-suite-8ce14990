import { createFileRoute } from "@tanstack/react-router";
import { HubPage } from "@/components/hubs/page";
import { SectionCard, StatusPill, KpiCard } from "@/components/enterprise/primitives";
import { Shield, ShieldCheck, AlertTriangle, FileText } from "lucide-react";

export const Route = createFileRoute("/people/compliance")({
  head: () => ({ meta: [{ title: "Compliance — Limnn People" }] }),
  component: Compliance,
});

function Compliance() {
  return (
    <HubPage title="Compliance" description="Right-to-work, visa, certifications and mandatory training.">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Compliant" value="238 / 247" icon={ShieldCheck} />
        <KpiCard label="Expiring 30d" value="6" icon={AlertTriangle} />
        <KpiCard label="Overdue" value="3" icon={Shield} />
        <KpiCard label="Policies" value="24" icon={FileText} />
      </div>

      <SectionCard title="Frameworks">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border"><th className="py-2 pr-3">Framework</th><th className="py-2 pr-3">Coverage</th><th className="py-2 pr-3">Last audit</th><th className="py-2 pr-3">Status</th></tr></thead>
          <tbody className="divide-y divide-border">
            {[
              { f: "SOC2 Type II", c: "100%", d: "Apr 2026", l: "green" as const, s: "Passed" },
              { f: "GDPR", c: "98%", d: "May 2026", l: "green" as const, s: "In compliance" },
              { f: "HIPAA (US)", c: "94%", d: "Feb 2026", l: "yellow" as const, s: "Action required" },
              { f: "ISO 27001", c: "91%", d: "Jan 2026", l: "yellow" as const, s: "Renewal due Q4" },
              { f: "Right-to-work checks", c: "99%", d: "—", l: "green" as const, s: "Current" },
            ].map((r) => (
              <tr key={r.f}><td className="py-2 pr-3 font-medium">{r.f}</td><td className="py-2 pr-3 font-mono">{r.c}</td><td className="py-2 pr-3 text-muted-foreground">{r.d}</td><td className="py-2 pr-3"><StatusPill level={r.l}>{r.s}</StatusPill></td></tr>
            ))}
          </tbody>
        </table>
      </SectionCard>

      <SectionCard title="Individual actions">
        <ul className="text-sm divide-y divide-border">
          <li className="py-2 flex items-center justify-between"><span>Kenji Watanabe — Visa expires <b>Aug 12</b></span><StatusPill level="yellow">Action needed</StatusPill></li>
          <li className="py-2 flex items-center justify-between"><span>Raj Patel — Right-to-work re-verification overdue</span><StatusPill level="red">Overdue 3d</StatusPill></li>
          <li className="py-2 flex items-center justify-between"><span>David Chen — Code of conduct training pending</span><StatusPill level="yellow">Due Jul 8</StatusPill></li>
        </ul>
      </SectionCard>
    </HubPage>
  );
}
