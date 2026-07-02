import { createFileRoute } from "@tanstack/react-router";
import { HubPage } from "@/components/hubs/page";
import { SectionCard, StatusPill, KpiCard, TrendSpark } from "@/components/enterprise/primitives";
import { PAYROLL_RUNS, PAYROLL_TREND } from "@/lib/people-data";
import { DollarSign, Users, Calendar, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/people/payroll")({
  head: () => ({ meta: [{ title: "Payroll — Limnn People" }] }),
  component: Payroll,
});

function Payroll() {
  return (
    <HubPage title="Payroll" description="Payroll runs, cost trends and next-run status.">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Monthly total" value="$1.2M" delta={1.5} icon={DollarSign} />
        <KpiCard label="Employees" value="247" icon={Users} />
        <KpiCard label="Next run" value="Jul 25" icon={Calendar} />
        <KpiCard label="Avg net pay" value="$4,858" delta={2.1} icon={TrendingUp} />
      </div>

      <SectionCard title="Recent runs">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border">
              <th className="py-2 pr-3">Period</th><th className="py-2 pr-3">Run date</th><th className="py-2 pr-3">Employees</th><th className="py-2 pr-3">Gross</th><th className="py-2 pr-3">Net</th><th className="py-2 pr-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {PAYROLL_RUNS.map((r) => (
              <tr key={r.period}>
                <td className="py-2 pr-3 font-medium">{r.period}</td>
                <td className="py-2 pr-3 text-muted-foreground">{r.date}</td>
                <td className="py-2 pr-3 font-mono">{r.employees}</td>
                <td className="py-2 pr-3 font-mono">${r.gross.toLocaleString()}</td>
                <td className="py-2 pr-3 font-mono">${r.net.toLocaleString()}</td>
                <td className="py-2 pr-3"><StatusPill level="green">{r.status}</StatusPill></td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>

      <SectionCard title="12-month cost trend">
        <div className="flex items-center gap-4">
          <TrendSpark values={PAYROLL_TREND} width={500} height={80} color="oklch(0.58 0.18 280)" />
          <div className="text-sm">
            <div className="text-2xl font-display font-semibold">+19%</div>
            <div className="text-xs text-muted-foreground">YoY payroll growth</div>
          </div>
        </div>
      </SectionCard>
    </HubPage>
  );
}
