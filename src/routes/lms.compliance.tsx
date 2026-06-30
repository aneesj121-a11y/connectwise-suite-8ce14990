import { createFileRoute } from "@tanstack/react-router";
import { HubPage } from "@/components/hubs/page";
import { KpiCard, SectionCard, StatusPill, Avatar } from "@/components/enterprise/primitives";
import { COMPLIANCE, AUDIT_LOG } from "@/lib/lms-extra";
import { ShieldCheck, AlertTriangle, FileCheck, Download } from "lucide-react";

export const Route = createFileRoute("/lms/compliance")({
  head: () => ({ meta: [{ title: "Compliance & Audit — Limnn LMS" }] }),
  component: Compliance,
});

function Compliance() {
  const atRisk = COMPLIANCE.filter((c) => c.status !== "Compliant").length;
  const avgCov = Math.round(COMPLIANCE.reduce((s, c) => s + c.coverage, 0) / COMPLIANCE.length);

  return (
    <HubPage
      title="Compliance & Audit"
      description="Mandatory training coverage, certificate expiries and a tamper-evident audit trail for every grading or policy change."
      insights={[
        { title: "PCI-DSS coverage 71%", body: "4 Finance team members missing. Their certs expire in 9 days. Auto-enroll now?", confidence: 96, cta: "Auto-enroll" },
        { title: "Auditor-ready packet", body: "SOC2 evidence bundle (certs + audit log + policy snapshots) is fresh as of today.", confidence: 100, cta: "Download" },
      ]}
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="Frameworks tracked" value={String(COMPLIANCE.length)} icon={ShieldCheck} />
        <KpiCard label="Avg coverage" value={`${avgCov}%`} delta={3} icon={FileCheck} />
        <KpiCard label="At risk / action" value={String(atRisk)} delta={-25} icon={AlertTriangle} />
        <KpiCard label="Audit events (30d)" value="312" icon={FileCheck} />
      </div>

      <SectionCard
        title="Mandatory training coverage"
        action={
          <button className="h-8 px-3 rounded-md border border-border text-[12px] font-medium inline-flex items-center gap-1.5 hover:bg-accent">
            <Download className="h-3.5 w-3.5" /> Auditor packet
          </button>
        }
      >
        <div className="overflow-x-auto -m-5">
          <table className="w-full text-sm">
            <thead className="text-[11px] uppercase tracking-wide text-muted-foreground">
              <tr className="border-b border-border">
                <th className="text-left font-medium px-5 py-2.5">Framework</th>
                <th className="text-left font-medium px-3 py-2.5">Course</th>
                <th className="text-left font-medium px-3 py-2.5">Audience</th>
                <th className="text-left font-medium px-3 py-2.5 w-[200px]">Coverage</th>
                <th className="text-right font-medium px-3 py-2.5">Next expiry</th>
                <th className="text-left font-medium px-3 py-2.5">Last audit</th>
                <th className="text-left font-medium px-5 py-2.5">Status</th>
              </tr>
            </thead>
            <tbody>
              {COMPLIANCE.map((c) => {
                const level = c.status === "Compliant" ? "green" : c.status === "At Risk" ? "yellow" : "red";
                return (
                  <tr key={c.id} className="border-b border-border/60 hover:bg-accent/40">
                    <td className="px-5 py-3 font-mono text-[11px]">{c.framework}</td>
                    <td className="px-3 py-3 text-[13px] font-medium">{c.course}</td>
                    <td className="px-3 py-3 text-[12px] text-muted-foreground">{c.audience}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden min-w-[80px]">
                          <div className="h-full rounded-full" style={{ width: `${c.coverage}%`, background: level === "green" ? "var(--success)" : level === "yellow" ? "var(--warning)" : "var(--destructive)" }} />
                        </div>
                        <span className="font-mono text-[11px] w-9 text-right">{c.coverage}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-[12px]">{c.expiringIn}d</td>
                    <td className="px-3 py-3 text-[12px] text-muted-foreground">{c.lastAudit}</td>
                    <td className="px-5 py-3"><StatusPill level={level as "green" | "yellow" | "red"}>{c.status}</StatusPill></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard title="Audit log" subtitle="Tamper-evident · exportable · 7-year retention">
        <ul className="space-y-1.5">
          {AUDIT_LOG.map((e) => (
            <li key={e.id} className="flex items-center gap-3 rounded-lg border border-border px-3 py-2 text-[12px]">
              <Avatar name={e.actor} />
              <span className="font-mono text-[11px] text-muted-foreground w-[140px] shrink-0">{e.at}</span>
              <span className="font-medium w-[140px] shrink-0 truncate">{e.actor}</span>
              <span className="text-muted-foreground shrink-0">{e.action}</span>
              <span className="font-medium truncate">{e.target}</span>
            </li>
          ))}
        </ul>
      </SectionCard>
    </HubPage>
  );
}
