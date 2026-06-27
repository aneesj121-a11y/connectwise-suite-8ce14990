// ============================================================
// CPQ pricing + lifecycle engine
// ============================================================
import { CATALOG, findProduct, type Product } from "./catalog";

export type QuoteStatus = "Draft" | "Pending Internal Review" | "Sent to Client" | "Signed/Executed";

export const QUOTE_STATUSES: QuoteStatus[] = [
  "Draft",
  "Pending Internal Review",
  "Sent to Client",
  "Signed/Executed",
];

export type CpqLine = {
  id: string;
  sku: string;
  qty: number;
  termMonths: number;
  discountPct: number;
};

export type CpqQuote = {
  id: string;
  name: string;
  account: string;
  owner: string;
  status: QuoteStatus;
  createdAt: string;
  expiresAt: string;
  currency: "USD" | "EUR" | "GBP";
  lines: CpqLine[];
  notes?: string;
};

// Per-line gross (no discount, full term)
export const lineGross = (l: CpqLine) => {
  const p = findProduct(l.sku);
  if (!p) return 0;
  const factor = p.recurring && l.termMonths > 0 ? l.termMonths : 1;
  return l.qty * p.listPrice * factor;
};

// Per-line net after discount
export const lineNet = (l: CpqLine) => lineGross(l) * (1 - l.discountPct / 100);

// Annualized contract value contribution (recurring lines only)
export const lineACV = (l: CpqLine) => {
  const p = findProduct(l.sku);
  if (!p || !p.recurring) return 0;
  const monthly = l.qty * p.listPrice * (1 - l.discountPct / 100);
  return monthly * 12;
};

// Per-line MRR contribution
export const lineMRR = (l: CpqLine) => {
  const p = findProduct(l.sku);
  if (!p || !p.recurring) return 0;
  return l.qty * p.listPrice * (1 - l.discountPct / 100);
};

export type ApprovalLevel = "auto" | "manager" | "vp" | "cfo" | "blocked";

// Approval routing based on max discount across lines + total deal size
export const requiredApproval = (q: CpqQuote): { level: ApprovalLevel; reason: string } => {
  const maxDisc = Math.max(0, ...q.lines.map((l) => l.discountPct));
  const offendingFloor = q.lines.find((l) => {
    const p = findProduct(l.sku);
    return p && l.discountPct > p.floorDiscountPct;
  });
  if (offendingFloor) {
    const p = findProduct(offendingFloor.sku)!;
    return { level: "blocked", reason: `${p.name} discount ${offendingFloor.discountPct}% exceeds floor (${p.floorDiscountPct}%).` };
  }
  const totals = quoteTotals(q);
  if (maxDisc > 25 || totals.net > 250_000) return { level: "cfo", reason: `Discount ${maxDisc}% or ACV >$250k requires CFO sign-off.` };
  if (maxDisc > 20 || totals.net > 100_000) return { level: "vp", reason: `Discount ${maxDisc}% or ACV >$100k requires VP Sales approval.` };
  if (maxDisc > 15) return { level: "manager", reason: `Discount ${maxDisc}% exceeds auto-approve threshold (15%).` };
  return { level: "auto", reason: "Within margin guardrails — no approval required." };
};

export const quoteTotals = (q: CpqQuote) => {
  const gross = q.lines.reduce((s, l) => s + lineGross(l), 0);
  const net = q.lines.reduce((s, l) => s + lineNet(l), 0);
  const discount = gross - net;
  const acv = q.lines.reduce((s, l) => s + lineACV(l), 0);
  const mrr = q.lines.reduce((s, l) => s + lineMRR(l), 0);
  const tax = net * 0.08;
  return { gross, discount, net, tax, total: net + tax, acv, mrr };
};

export const advanceStatus = (s: QuoteStatus): QuoteStatus | null => {
  const i = QUOTE_STATUSES.indexOf(s);
  return i >= 0 && i < QUOTE_STATUSES.length - 1 ? QUOTE_STATUSES[i + 1] : null;
};

export const statusColor: Record<QuoteStatus, { bg: string; fg: string }> = {
  "Draft": { bg: "var(--muted)", fg: "var(--muted-foreground)" },
  "Pending Internal Review": { bg: "color-mix(in oklab, var(--warning) 18%, transparent)", fg: "oklch(0.45 0.12 60)" },
  "Sent to Client": { bg: "color-mix(in oklab, var(--primary) 14%, transparent)", fg: "var(--primary)" },
  "Signed/Executed": { bg: "color-mix(in oklab, var(--success) 16%, transparent)", fg: "var(--success)" },
};

// ===== Seed mock quote used by the standalone CPQ route =====
export const SAMPLE_QUOTE: CpqQuote = {
  id: "cpq-seed",
  name: "Acme — Platform Expansion FY26",
  account: "Acme Corporation",
  owner: "Anees Naveed",
  status: "Draft",
  createdAt: "2026-06-22",
  expiresAt: "2026-07-22",
  currency: "USD",
  lines: [
    { id: "l1", sku: "LMN-PRO-SEAT",  qty: 50,     termMonths: 12, discountPct: 12 },
    { id: "l2", sku: "LMN-AI-COACH",  qty: 50,     termMonths: 12, discountPct: 10 },
    { id: "l3", sku: "LMN-AI-MIN",    qty: 250000, termMonths: 12, discountPct: 0 },
    { id: "l4", sku: "LMN-DID-LOCAL", qty: 50,     termMonths: 12, discountPct: 0 },
    { id: "l5", sku: "LMN-PS-ONB",    qty: 1,      termMonths: 0,  discountPct: 5 },
  ],
  notes: "Co-terminated with parent MSA. Net-45 terms. EU data residency required for storage.",
};

export const fmtMoney = (n: number, currency: string = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(n);

export { CATALOG, findProduct };
export type { Product };
