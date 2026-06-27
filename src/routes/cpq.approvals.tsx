import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { HubPage } from "@/components/hubs/page";
import { SectionCard, KpiCard, StatusPill, RiskBadge, FilterBar } from "@/components/enterprise/primitives";
import { ShieldCheck, ShieldAlert, Check, X, Clock, DollarSign, FileText, Crown } from "lucide-react";
import { useTeam } from "@/lib/team-context";
import { fmtMoney } from "@/lib/cpq/engine";

export const Route = createFileRoute("/cpq/approvals")({
  head: () => ({ meta: [{ title: "Deal Desk — CPQ Approvals" }] }),
  component: ApprovalsPage,
});

type Tier = "manager" | "vp" | "cfo";
type Stage = "Pending" | "Approved" | "Rejected";

type Item = {
  id: string;
  quote: string;
  account: string;
  rep: string;
  acv: number;
  net: number;
  discount: number;
  tier: Tier;
  stage: Stage;
  submitted: string;
  reason: string;
  risk: number;
};

const QUEUE: Item[] = [
  { id: "Q-2041", quote: "Acme — Platform Expansion FY26", account: "Acme Corporation", rep: "Anees Naveed", acv: 312000, net: 268400, discount: 18, tier: "vp", stage: "Pending", submitted: "2h ago", reason: "Discount 18% + ACV >$250k", risk: 62 },
  { id: "Q-2039", quote: "Northwind Bank — AI Coach Pack", account: "Northwind Bank", rep: "Marcus Lee", acv: 184000, net: 162000, discount: 21, tier: "vp", stage: "Pending", submitted: "5h ago", reason: "Discount 21% exceeds VP threshold", risk: 41 },
  { id: "Q-2037", quote: "Helios Health — Pilot Renewal", account: "Helios Health", rep: "Priya Shah", acv: 48000, net: 42000, discount: 16, tier: "manager", stage: "Pending", submitted: "Yesterday", reason: "Discount 16% above auto-approve", risk: 73 },
  { id: "Q-2034", quote: "Pioneer Mutual — Multi-year Lock", account: "Pioneer Mutual", rep: "Jordan Kim", acv: 412000, net: 318000, discount: 27, tier: "cfo", stage: "Pending", submitted: "Yesterday", reason: "Discount 27% + 3yr term — CFO sign-off", risk: 38 },
  { id: "Q-2030", quote: "Bluebird Media — Add-on Seats", account: "Bluebird Media", rep: "Alex R.", acv: 22000, net: 19800, discount: 17, tier: "manager", stage: "Approved", submitted: "2d ago", reason: "Approved by Sales Manager", risk: 22 },
  { id: "Q-2028", quote: "Vanta — Discount Stretch", account: "Vanta Logistics", rep: "Sam D.", acv: 96000, net: 64000, discount: 33, tier: "cfo", stage: "Rejected", submitted: "3d ago", reason: "Below margin floor — declined", risk: 91 },
];

const TIER_META: Record<Tier, { label: string; color: string }> = {
  manager: { label: "Manager", color: "var(--primary)" },
  vp: { label: "VP Sales", color: "oklch(0.55 0.15 280)" },
  cfo: { label: "CFO", color: "var(--destructive)" },
};

function ApprovalsPage() {
  const { role } = useTeam();
  const [stage, setStage] = useState<Stage | "All">("Pending");
  const [items, setItems] = useState(QUEUE);
  const filtered = items.filter((i) => stage === "All" || i.stage === stage);
  const pending = items.filter((i) => i.stage === "Pending");
  const pendingAcv = pending.reduce((s, i) => s + i.acv, 0);

  const act = (id: string, next: Stage) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, stage: next } : i)));

  return (
    <HubPage
      title="Deal Desk Approvals"
      description="Manager-only queue for CPQ quotes that exceed discount or ACV guardrails."
      actions={
        <Link to="/cpq" className="h-9 px-3 rounded-md border border-border text-sm font-medium inline-flex items-center gap-1.5 hover:bg-accent">
          <FileText className="h-3.5 w-3.5" /> CPQ Workspace
        </Link>
      }
      insights={[
        { title: "2 quotes aging > 24h", body: "Helios + Pioneer have been pending more than a day — rep pacing at risk.", confidence: 89, cta: "Nudge approvers" },
        { title: "Avg discount creep", body: "Manager-tier requests trended from 14% to 17% over the last 30 days.", confidence: 76 },
      ]}
    >
      {role !== "manager" && (
        <div
          className="rounded-xl border p-4 flex items-start gap-3 text-sm"
          style={{
            background: "color-mix(in oklab, var(--warning) 10%, transparent)",
            borderColor: "color-mix(in oklab, var(--warning) 35%, var(--border))",
          }}
        >
          <ShieldAlert className="h-4 w-4 mt-0.5" style={{ color: "var(--warning)" }} />
          <div>
            <div className="font-medium">Read-only view — agent role</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              Switch to Manager view from the sidebar profile to action approvals.
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Pending approvals" value={`${pending.length}`} icon={Clock} />
        <KpiCard label="Pending ACV" value={fmtMoney(pendingAcv)} delta={12} icon={DollarSign} />
        <KpiCard label="Avg cycle" value="14h" delta={-9} icon={ShieldCheck} />
        <KpiCard label="Auto-approved" value="68%" delta={4} icon={Crown} />
      </div>

      <SectionCard title="Approval queue" subtitle="Routed by discount % and deal size">
        <FilterBar
          chips={["Pending", "Approved", "Rejected", "All"]}
          active={stage}
          onSelect={(c) => setStage(c as Stage | "All")}
        />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-muted-foreground border-b border-border">
              <tr>
                <th className="py-2 pr-3 font-medium">Quote</th>
                <th className="py-2 pr-3 font-medium">Rep</th>
                <th className="py-2 pr-3 font-medium text-right">ACV</th>
                <th className="py-2 pr-3 font-medium text-right">Disc</th>
                <th className="py-2 pr-3 font-medium">Tier</th>
                <th className="py-2 pr-3 font-medium">Reason</th>
                <th className="py-2 pr-3 font-medium">Stage</th>
                <th className="py-2 pr-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((i) => {
                const tier = TIER_META[i.tier];
                return (
                  <tr key={i.id} className="hover:bg-muted/40 align-top">
                    <td className="py-3 pr-3">
                      <div className="font-medium">{i.quote}</div>
                      <div className="text-[11px] text-muted-foreground font-mono">{i.id} · {i.submitted}</div>
                      <div className="mt-1"><RiskBadge confidence={i.risk} label="Win risk" /></div>
                    </td>
                    <td className="py-3 pr-3 text-xs">{i.rep}</td>
                    <td className="py-3 pr-3 text-right font-mono text-xs">{fmtMoney(i.acv)}</td>
                    <td className="py-3 pr-3 text-right font-mono text-xs">{i.discount}%</td>
                    <td className="py-3 pr-3">
                      <span className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium"
                        style={{ background: `color-mix(in oklab, ${tier.color} 14%, transparent)`, color: tier.color }}>
                        <Crown className="h-2.5 w-2.5" /> {tier.label}
                      </span>
                    </td>
                    <td className="py-3 pr-3 text-xs text-muted-foreground max-w-[260px]">{i.reason}</td>
                    <td className="py-3 pr-3">
                      <StatusPill
                        level={i.stage === "Pending" ? "yellow" : i.stage === "Approved" ? "green" : "red"}
                      >
                        {i.stage}
                      </StatusPill>
                    </td>
                    <td className="py-3 pr-3 text-right">
                      {i.stage === "Pending" && role === "manager" ? (
                        <div className="inline-flex gap-1.5">
                          <button
                            onClick={() => act(i.id, "Approved")}
                            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-primary-foreground"
                            style={{ background: "var(--success)" }}
                          >
                            <Check className="h-3 w-3" /> Approve
                          </button>
                          <button
                            onClick={() => act(i.id, "Rejected")}
                            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium"
                            style={{ background: "color-mix(in oklab, var(--destructive) 14%, transparent)", color: "var(--destructive)" }}
                          >
                            <X className="h-3 w-3" /> Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <SectionCard title="Approval policy">
          <ul className="text-sm space-y-2.5">
            <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0" style={{ background: "var(--success)" }} />Auto-approve up to 15% discount and $100k ACV.</li>
            <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0" style={{ background: "var(--primary)" }} />Manager sign-off: 15–20% discount.</li>
            <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0" style={{ background: "oklch(0.55 0.15 280)" }} />VP Sales: 20–25% or ACV > $100k.</li>
            <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0" style={{ background: "var(--destructive)" }} />CFO: > 25% discount or ACV > $250k.</li>
          </ul>
        </SectionCard>
        <SectionCard title="Recent audit trail">
          <ul className="divide-y divide-border text-sm">
            {[
              { who: "VP Sales", what: "Approved Q-2041", when: "2h ago" },
              { who: "Sales Manager", what: "Approved Q-2030", when: "2d ago" },
              { who: "CFO", what: "Rejected Q-2028 (below floor)", when: "3d ago" },
              { who: "System", what: "Auto-approved 12 quotes < 15% disc", when: "Last 7d" },
            ].map((r) => (
              <li key={r.what} className="py-2 flex items-center gap-3">
                <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground" />
                <div className="flex-1">
                  <div className="text-sm">{r.what}</div>
                  <div className="text-[11px] text-muted-foreground">{r.who}</div>
                </div>
                <span className="text-[11px] text-muted-foreground">{r.when}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </HubPage>
  );
}
