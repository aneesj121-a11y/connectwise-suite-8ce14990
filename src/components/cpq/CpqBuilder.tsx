import { useMemo, useState } from "react";
import { Plus, Trash2, Sparkles, AlertTriangle, CheckCircle2, FileText, Send, ClipboardCheck, Package } from "lucide-react";
import {
  type CpqQuote,
  type CpqLine,
  type QuoteStatus,
  QUOTE_STATUSES,
  CATALOG,
  findProduct,
  lineNet,
  quoteTotals,
  requiredApproval,
  statusColor,
  fmtMoney,
} from "@/lib/cpq/engine";
import { BUNDLES } from "@/lib/cpq/catalog";
import { SectionCard, RiskBadge } from "@/components/enterprise/primitives";

// ============================================================
// Reusable CPQ builder — drop into any hub
// ============================================================
export function CpqBuilder({ initial }: { initial: CpqQuote }) {
  const [quote, setQuote] = useState<CpqQuote>(initial);
  const [picker, setPicker] = useState(false);

  const totals = useMemo(() => quoteTotals(quote), [quote]);
  const approval = useMemo(() => requiredApproval(quote), [quote]);

  const update = (id: string, patch: Partial<CpqLine>) =>
    setQuote((q) => ({ ...q, lines: q.lines.map((l) => (l.id === id ? { ...l, ...patch } : l)) }));
  const remove = (id: string) => setQuote((q) => ({ ...q, lines: q.lines.filter((l) => l.id !== id) }));
  const addSku = (sku: string) => {
    const p = findProduct(sku);
    if (!p) return;
    setQuote((q) => ({
      ...q,
      lines: [
        ...q.lines,
        { id: `l${Date.now()}`, sku, qty: 1, termMonths: p.recurring ? 12 : 0, discountPct: 0 },
      ],
    }));
    setPicker(false);
  };
  const applyBundle = (bundleId: string) => {
    const b = BUNDLES.find((x) => x.id === bundleId);
    if (!b) return;
    setQuote((q) => ({
      ...q,
      lines: b.items.map((it, i) => ({
        id: `bl${Date.now()}${i}`,
        sku: it.sku,
        qty: it.qty,
        termMonths: it.termMonths,
        discountPct: it.discountPct ?? b.bundleDiscountPct,
      })),
    }));
  };
  const advance = () => {
    const i = QUOTE_STATUSES.indexOf(quote.status);
    if (i >= 0 && i < QUOTE_STATUSES.length - 1) setQuote((q) => ({ ...q, status: QUOTE_STATUSES[i + 1] }));
  };

  return (
    <div className="space-y-5">
      {/* Lifecycle bar */}
      <SectionCard
        title={
          <span className="flex items-center gap-2">
            Quote lifecycle <StatusBadge status={quote.status} />
          </span>
        }
        subtitle={`#${quote.id} · ${quote.account} · expires ${quote.expiresAt}`}
        action={
          <div className="flex items-center gap-1.5">
            <button className="h-8 px-2.5 rounded-md text-xs font-medium border border-border inline-flex items-center gap-1 hover:bg-accent">
              <FileText className="h-3 w-3" /> Preview PDF
            </button>
            <button onClick={advance} className="h-8 px-2.5 rounded-md text-xs font-medium text-primary-foreground inline-flex items-center gap-1" style={{ background: "var(--primary)" }}>
              {quote.status === "Draft" && (<><ClipboardCheck className="h-3 w-3" /> Request approval</>)}
              {quote.status === "Pending Internal Review" && (<><Send className="h-3 w-3" /> Send to client</>)}
              {quote.status === "Sent to Client" && (<><CheckCircle2 className="h-3 w-3" /> Mark signed</>)}
              {quote.status === "Signed/Executed" && (<>Provision</>)}
            </button>
          </div>
        }
      >
        <div className="grid grid-cols-4 gap-0 rounded-lg border border-border overflow-hidden">
          {QUOTE_STATUSES.map((s, i) => {
            const active = QUOTE_STATUSES.indexOf(quote.status) >= i;
            return (
              <div
                key={s}
                className="px-3 py-2.5 text-[11px] font-medium border-r border-border last:border-r-0"
                style={{
                  background: active ? "color-mix(in oklab, var(--primary) 10%, transparent)" : "var(--card)",
                  color: active ? "var(--primary)" : "var(--muted-foreground)",
                }}
              >
                <div className="text-[9px] uppercase tracking-[0.14em] opacity-70">Step {i + 1}</div>
                {s}
              </div>
            );
          })}
        </div>
      </SectionCard>

      {/* Bundles */}
      <SectionCard
        title="Pre-built bundles"
        subtitle="Tap to seed the quote — you can edit any line afterwards"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {BUNDLES.map((b) => (
            <button
              key={b.id}
              onClick={() => applyBundle(b.id)}
              className="text-left rounded-lg border border-border p-3 hover:border-primary transition"
            >
              <div className="flex items-center gap-2">
                <Package className="h-3.5 w-3.5" style={{ color: "var(--primary)" }} />
                <span className="font-display text-sm font-semibold">{b.name}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{b.description}</p>
              <div className="mt-2 inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-mono"
                   style={{ background: "color-mix(in oklab, var(--success) 14%, transparent)", color: "var(--success)" }}>
                +{b.bundleDiscountPct}% bundle discount
              </div>
            </button>
          ))}
        </div>
      </SectionCard>

      {/* Approval banner */}
      <div
        className="rounded-lg border p-3 flex items-start gap-3"
        style={{
          background: approval.level === "auto"
            ? "color-mix(in oklab, var(--success) 8%, transparent)"
            : approval.level === "blocked"
            ? "color-mix(in oklab, var(--destructive) 10%, transparent)"
            : "color-mix(in oklab, var(--warning) 10%, transparent)",
          borderColor: approval.level === "auto"
            ? "color-mix(in oklab, var(--success) 30%, transparent)"
            : approval.level === "blocked"
            ? "color-mix(in oklab, var(--destructive) 35%, transparent)"
            : "color-mix(in oklab, var(--warning) 35%, transparent)",
        }}
      >
        {approval.level === "auto" ? (
          <CheckCircle2 className="h-4 w-4 mt-0.5" style={{ color: "var(--success)" }} />
        ) : (
          <AlertTriangle className="h-4 w-4 mt-0.5" style={{ color: approval.level === "blocked" ? "var(--destructive)" : "oklch(0.55 0.14 60)" }} />
        )}
        <div className="flex-1 text-xs">
          <div className="font-semibold uppercase tracking-wide">
            {approval.level === "auto" ? "Auto-approved"
              : approval.level === "manager" ? "Manager approval required"
              : approval.level === "vp" ? "VP Sales approval required"
              : approval.level === "cfo" ? "CFO sign-off required"
              : "Blocked — exceeds floor"}
          </div>
          <div className="text-muted-foreground mt-0.5">{approval.reason}</div>
        </div>
        <RiskBadge confidence={94} label="Margin AI" />
      </div>

      {/* Line items */}
      <SectionCard
        title="Configuration"
        subtitle={`${quote.lines.length} line${quote.lines.length === 1 ? "" : "s"} · live pricing`}
        action={
          <button onClick={() => setPicker((v) => !v)} className="h-8 px-2.5 rounded-md text-xs font-medium border border-border inline-flex items-center gap-1 hover:bg-accent">
            <Plus className="h-3 w-3" /> Add product
          </button>
        }
      >
        {picker && (
          <div className="mb-3 rounded-lg border border-border p-2 max-h-64 overflow-y-auto">
            {CATALOG.map((p) => (
              <button key={p.sku} onClick={() => addSku(p.sku)} className="w-full text-left px-2 py-1.5 rounded hover:bg-muted text-xs flex items-center justify-between">
                <span>
                  <span className="font-medium">{p.name}</span>
                  <span className="text-muted-foreground ml-2">{p.family} · {p.unit}</span>
                </span>
                <span className="font-mono text-[11px]">{fmtMoney(p.listPrice)}/{p.unit.toLowerCase()}</span>
              </button>
            ))}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-muted-foreground border-b border-border">
              <tr>
                <th className="py-2 pr-3 font-medium">Product</th>
                <th className="py-2 pr-3 font-medium text-right">Qty</th>
                <th className="py-2 pr-3 font-medium text-right">Term (mo)</th>
                <th className="py-2 pr-3 font-medium text-right">List</th>
                <th className="py-2 pr-3 font-medium text-right">Disc %</th>
                <th className="py-2 pr-3 font-medium text-right">Net</th>
                <th className="py-2 pr-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {quote.lines.map((l) => {
                const p = findProduct(l.sku);
                if (!p) return null;
                const overFloor = l.discountPct > p.floorDiscountPct;
                const overAuto = l.discountPct > p.maxAutoDiscountPct;
                return (
                  <tr key={l.id}>
                    <td className="py-2.5 pr-3">
                      <div className="font-medium">{p.name}</div>
                      <div className="text-[11px] text-muted-foreground">{p.sku} · {p.family}</div>
                    </td>
                    <td className="py-2.5 pr-3 text-right">
                      <input type="number" value={l.qty} onChange={(e) => update(l.id, { qty: Math.max(0, Number(e.target.value)) })} className="w-20 rounded border border-border bg-background px-2 py-1 text-right font-mono text-xs" />
                    </td>
                    <td className="py-2.5 pr-3 text-right">
                      <input type="number" disabled={!p.recurring} value={l.termMonths} onChange={(e) => update(l.id, { termMonths: Math.max(0, Number(e.target.value)) })} className="w-16 rounded border border-border bg-background px-2 py-1 text-right font-mono text-xs disabled:opacity-40" />
                    </td>
                    <td className="py-2.5 pr-3 text-right font-mono text-xs">{fmtMoney(p.listPrice)}</td>
                    <td className="py-2.5 pr-3 text-right">
                      <input type="number" value={l.discountPct} onChange={(e) => update(l.id, { discountPct: Math.max(0, Number(e.target.value)) })} className="w-16 rounded border px-2 py-1 text-right font-mono text-xs bg-background"
                        style={{ borderColor: overFloor ? "var(--destructive)" : overAuto ? "var(--warning)" : "var(--border)" }} />
                      <div className="text-[10px] text-muted-foreground mt-0.5">cap {p.maxAutoDiscountPct}% · floor {p.floorDiscountPct}%</div>
                    </td>
                    <td className="py-2.5 pr-3 text-right font-mono text-sm">{fmtMoney(lineNet(l))}</td>
                    <td className="py-2.5 pr-3 text-right">
                      <button onClick={() => remove(l.id)} className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Totals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <SectionCard title="Totals" className="lg:col-span-2">
          <dl className="grid grid-cols-2 gap-y-2 text-sm">
            <dt className="text-muted-foreground">Gross</dt>
            <dd className="text-right font-mono">{fmtMoney(totals.gross)}</dd>
            <dt className="text-muted-foreground">Discount</dt>
            <dd className="text-right font-mono" style={{ color: "var(--destructive)" }}>−{fmtMoney(totals.discount)}</dd>
            <dt className="text-muted-foreground">Net</dt>
            <dd className="text-right font-mono">{fmtMoney(totals.net)}</dd>
            <dt className="text-muted-foreground">Tax (est. 8%)</dt>
            <dd className="text-right font-mono">{fmtMoney(totals.tax)}</dd>
            <dt className="font-display font-semibold pt-1.5 border-t border-border mt-1.5">Total</dt>
            <dd className="text-right font-mono font-display font-semibold text-base pt-1.5 border-t border-border mt-1.5">{fmtMoney(totals.total)}</dd>
          </dl>
        </SectionCard>
        <SectionCard title="Contract metrics">
          <dl className="space-y-2 text-sm">
            <div className="flex items-baseline justify-between">
              <dt className="text-muted-foreground text-xs">Annual Contract Value</dt>
              <dd className="font-display text-lg font-semibold">{fmtMoney(totals.acv)}</dd>
            </div>
            <div className="flex items-baseline justify-between">
              <dt className="text-muted-foreground text-xs">Monthly Recurring</dt>
              <dd className="font-mono">{fmtMoney(totals.mrr)}</dd>
            </div>
            <div className="flex items-baseline justify-between">
              <dt className="text-muted-foreground text-xs">Avg discount</dt>
              <dd className="font-mono">{((totals.discount / Math.max(1, totals.gross)) * 100).toFixed(1)}%</dd>
            </div>
          </dl>
          <div className="mt-3 rounded-md border border-dashed border-border p-2 text-[11px] flex gap-1.5">
            <Sparkles className="h-3 w-3 mt-0.5" style={{ color: "var(--primary)" }} />
            <span className="text-muted-foreground">
              <span className="text-foreground font-medium">Limnn AI:</span> margin healthy, win-prob lifts +9% if you add a 12-month auto-renewal clause.
            </span>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: QuoteStatus }) {
  const s = statusColor[status];
  return (
    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium" style={{ background: s.bg, color: s.fg }}>
      {status}
    </span>
  );
}
