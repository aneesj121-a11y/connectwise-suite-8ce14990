import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  FileText,
  Pencil,
  Mail,
  Phone,
  Building2,
  MapPin,
  Calendar,
  User,
  Plus,
  Trash2,
  Send,
  ShieldCheck,
  Sparkles,
  AlertTriangle,
  PenLine,
  Percent,
  Clock,
  Copy,
  Eye,
  History,
  Download,
  ChevronRight,
  CircleDot,
  GitBranch,
  Lock,
} from "lucide-react";
import {
  findOpportunity,
  lineNet,
  quoteTotals,
  STAGES,
  stageColor,
  type LineItem,
  type Quote,
  type Stage,
} from "@/lib/opportunities";


export const Route = createFileRoute("/opportunities/$id")({
  loader: ({ params }) => {
    const opp = findOpportunity(params.id);
    if (!opp) throw notFound();
    return { opp };
  },
  component: OpportunityDetailPage,
  notFoundComponent: () => (
    <div className="px-8 py-20 text-center">
      <h1 className="font-serif text-3xl">Opportunity not found</h1>
      <Link to="/opportunities" className="mt-4 inline-block text-[color:var(--primary)] hover:underline">
        Back to pipeline
      </Link>
    </div>
  ),
});

const fmt = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const fmt2 = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });

function OpportunityDetailPage() {
  const { opp } = Route.useLoaderData();
  const [stage, setStage] = useState<Stage>(opp.stage);
  const allQuotes = useMemo(() => buildQuotes(opp.quotes[0]), [opp]);
  const [selectedQuoteId, setSelectedQuoteId] = useState<string>(allQuotes[0].id);
  const selectedQuote = allQuotes.find((q) => q.id === selectedQuoteId) ?? allQuotes[0];
  const [items, setItems] = useState<LineItem[]>(selectedQuote.items);
  const [tab, setTab] = useState<"quotes" | "cpq" | "activity" | "email">("quotes");

  const openQuote = (id: string) => {
    const q = allQuotes.find((x) => x.id === id);
    if (!q) return;
    setSelectedQuoteId(id);
    setItems(q.items);
    setTab("cpq");
  };

  const totals = useMemo(() => {
    const q = { ...selectedQuote, items };
    return quoteTotals(q);
  }, [items, selectedQuote]);

  const approvalNeeded = useMemo(() => {
    const maxDisc = Math.max(0, ...items.map((i) => i.discountPct));
    return maxDisc > 15;
  }, [items]);


  const updateItem = (id: string, patch: Partial<LineItem>) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  const removeItem = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));
  const addItem = () =>
    setItems((prev) => [
      ...prev,
      {
        id: `li-${Date.now()}`,
        sku: "LMN-NEW",
        product: "New product",
        description: "Add description",
        qty: 1,
        termMonths: 12,
        listPrice: 0,
        discountPct: 0,
      },
    ]);

  return (
    <div className="px-6 lg:px-8 py-7 space-y-6 max-w-[1600px] mx-auto">
      {/* Breadcrumb back */}
      <div>
        <Link
          to="/opportunities"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to pipeline
        </Link>
      </div>

      {/* Header */}
      <header className="flex items-start justify-between gap-6 flex-wrap">
        <div className="min-w-0">
          <div className="text-[11px] uppercase tracking-[0.22em] text-[color:var(--sales)] font-medium">
            Opportunity
          </div>
          <h1 className="font-serif text-4xl tracking-tight mt-1">{opp.name}</h1>
          <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
            <span className="inline-flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5" /> {opp.company}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" /> {opp.region}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" /> Close {opp.closeDate}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" /> {opp.owner}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="h-9 px-3 inline-flex items-center gap-1.5 rounded-md border border-border bg-card text-sm hover:bg-accent">
            <Pencil className="h-3.5 w-3.5" /> Edit details
          </button>
          <button className="h-9 px-3 inline-flex items-center gap-1.5 rounded-md bg-[color:var(--success)] text-white text-sm font-medium hover:opacity-90">
            <CheckCircle2 className="h-3.5 w-3.5" /> Mark as Won
          </button>
          <button className="h-9 px-3 inline-flex items-center gap-1.5 rounded-md border border-[color:var(--destructive)]/40 text-[color:var(--destructive)] text-sm font-medium hover:bg-[color:var(--destructive)]/5">
            <XCircle className="h-3.5 w-3.5" /> Mark as Lost
          </button>
        </div>
      </header>

      {/* Stage stepper */}
      <section className="rounded-2xl border border-border bg-card p-2 flex gap-1 overflow-x-auto">
        {STAGES.map((s, i) => {
          const active = s === stage;
          const idx = STAGES.indexOf(stage);
          const passed = i < idx;
          const c = stageColor[s];
          return (
            <button
              key={s}
              onClick={() => setStage(s)}
              className="relative flex-1 min-w-[140px] h-12 rounded-lg text-xs font-semibold uppercase tracking-[0.18em] transition-colors"
              style={{
                background: active ? c.fg : passed ? c.bg : "transparent",
                color: active ? "#fff" : passed ? c.fg : "var(--muted-foreground)",
              }}
            >
              <span className="inline-flex items-center gap-2">
                <span
                  className="h-5 w-5 grid place-items-center rounded-full text-[10px]"
                  style={{
                    background: active ? "rgba(255,255,255,0.2)" : passed ? c.fg : "var(--muted)",
                    color: active ? "#fff" : passed ? "#fff" : "var(--muted-foreground)",
                  }}
                >
                  {i + 1}
                </span>
                {s}
              </span>
            </button>
          );
        })}
      </section>

      {/* Body grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left rail: Details + Contact */}
        <aside className="col-span-12 lg:col-span-3 space-y-5">
          <Panel title="Deal summary">
            <Row label="Value" value={<span className="font-display font-semibold">{fmt(opp.value)}</span>} />
            <Row
              label="Probability"
              value={
                <div className="inline-flex items-center gap-2">
                  <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-[color:var(--primary)]" style={{ width: `${opp.probability}%` }} />
                  </div>
                  <span className="text-xs tabular-nums">{opp.probability}%</span>
                </div>
              }
            />
            <Row label="Weighted" value={fmt((opp.value * opp.probability) / 100)} />
            <Row label="Source" value={opp.source} />
            <Row label="Industry" value={opp.industry} />
          </Panel>

          <Panel title="Details">
            <Row label="SDR" value={opp.sdr} />
            <Row label="AE" value={opp.ae} />
            <Row label="Manager" value={opp.manager} />
            <Row label="Region" value={opp.region} />
            <Row label="Address" value={opp.address} />
          </Panel>

          {opp.contact && (
            <Panel title="Primary contact">
              <div className="px-4 pt-3 pb-1">
                <div className="font-medium text-sm">{opp.contact.name}</div>
                <div className="text-xs text-muted-foreground">{opp.contact.title}</div>
              </div>
              <Row
                label={<Mail className="h-3.5 w-3.5" />}
                value={<span className="text-xs">{opp.contact.email}</span>}
              />
              <Row
                label={<Phone className="h-3.5 w-3.5" />}
                value={<span className="text-xs tabular-nums">{opp.contact.phone}</span>}
              />
              <div className="p-3">
                <button className="w-full h-9 inline-flex items-center justify-center gap-1.5 rounded-md bg-[color:var(--primary)] text-white text-sm font-medium hover:opacity-90">
                  <Phone className="h-3.5 w-3.5" /> Call now
                </button>
              </div>
            </Panel>
          )}

          <Panel title="AI insights" accent>
            <div className="px-4 py-3 space-y-2 text-xs">
              <div className="inline-flex items-center gap-1.5 text-[color:var(--primary)] font-medium">
                <Sparkles className="h-3.5 w-3.5" /> Limnn AI suggestion
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Champion engagement dropped 32% this week. Suggest sending the ROI calculator + scheduling
                a multi-threading meeting with Finance.
              </p>
              <button className="mt-1 text-[color:var(--primary)] font-medium hover:underline">
                Apply playbook →
              </button>
            </div>
          </Panel>
        </aside>

        {/* Main: CPQ */}
        <section className="col-span-12 lg:col-span-9 space-y-5">
          {/* Tabs */}
          <div className="rounded-2xl border border-border bg-card">
            <div className="border-b border-border px-2 flex items-center gap-1">
              {[
                { id: "quotes", label: "Quotes", icon: FileText },
                { id: "cpq", label: "Configure · Price · Quote", icon: PenLine },
                { id: "activity", label: "Activity feed", icon: History },
                { id: "email", label: "Email", icon: Mail },
              ].map((t) => {

                const active = tab === t.id;
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id as typeof tab)}
                    className="relative h-12 px-4 inline-flex items-center gap-2 text-sm font-medium transition-colors"
                    style={{ color: active ? "var(--foreground)" : "var(--muted-foreground)" }}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {t.label}
                    {active && (
                      <span
                        className="absolute left-3 right-3 bottom-0 h-[2px] rounded-full"
                        style={{ background: "var(--primary)" }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {tab === "quotes" && (
              <QuotesTab
                quotes={allQuotes}
                onOpen={openQuote}
                onNewVersion={() => {
                  const next = cloneAsNewVersion(allQuotes[0]);
                  allQuotes.unshift(next);
                  openQuote(next.id);
                }}
              />
            )}

            {tab === "cpq" && (
              <div className="p-5 space-y-5">
                {/* Quote header */}
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground inline-flex items-center gap-2">
                      <button
                        onClick={() => setTab("quotes")}
                        className="inline-flex items-center gap-1 hover:text-foreground"
                      >
                        <ArrowLeft className="h-3 w-3" /> All quotes
                      </button>
                      <span>·</span>
                      <span>Quote · v{selectedQuote.version}</span>
                    </div>
                    <h3 className="font-serif text-2xl tracking-tight mt-0.5">{selectedQuote.name}</h3>
                    <div className="text-xs text-muted-foreground mt-1">
                      Created {selectedQuote.createdAt} ·{" "}
                      <StatusPill status={selectedQuote.status} />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="h-9 px-3 inline-flex items-center gap-1.5 rounded-md border border-border bg-card text-sm hover:bg-accent">
                      <FileText className="h-3.5 w-3.5" /> Preview PDF
                    </button>
                    <button className="h-9 px-3 inline-flex items-center gap-1.5 rounded-md border border-border bg-card text-sm hover:bg-accent">
                      <ShieldCheck className="h-3.5 w-3.5" /> Request approval
                    </button>
                    <button className="h-9 px-3 inline-flex items-center gap-1.5 rounded-md bg-foreground text-background text-sm font-medium hover:opacity-90">
                      <Send className="h-3.5 w-3.5" /> Send for e-sign
                    </button>
                  </div>
                </div>

                {/* Approval banner */}
                {approvalNeeded && (
                  <div
                    className="rounded-xl border px-4 py-3 flex items-center gap-3 text-sm"
                    style={{
                      borderColor: "color-mix(in oklab, var(--warning) 50%, transparent)",
                      background: "color-mix(in oklab, var(--warning) 12%, transparent)",
                      color: "var(--warning)",
                    }}
                  >
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <div className="flex-1">
                      <div className="font-medium">Deal-desk approval required</div>
                      <div className="text-xs opacity-80">Discount exceeds 15% threshold. Routes to RevOps.</div>
                    </div>
                    <button className="h-8 px-3 rounded-md bg-[color:var(--warning)] text-white text-xs font-medium">
                      Submit
                    </button>
                  </div>
                )}

                {/* Line items */}
                <div className="rounded-xl border border-border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/40">
                        <tr className="text-left text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                          <th className="px-4 py-3 font-medium">Product / SKU</th>
                          <th className="px-3 py-3 font-medium text-right w-20">Qty</th>
                          <th className="px-3 py-3 font-medium text-right w-24">Term (m)</th>
                          <th className="px-3 py-3 font-medium text-right w-28">List price</th>
                          <th className="px-3 py-3 font-medium text-right w-24">Disc %</th>
                          <th className="px-3 py-3 font-medium text-right w-32">Net</th>
                          <th className="px-2 py-3 w-10" />
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((li) => (
                          <tr key={li.id} className="border-t border-border align-top">
                            <td className="px-4 py-3">
                              <div className="font-medium">{li.product}</div>
                              <div className="text-[11px] text-muted-foreground font-mono mt-0.5">{li.sku}</div>
                              <div className="text-xs text-muted-foreground mt-1">{li.description}</div>
                            </td>
                            <td className="px-3 py-3 text-right">
                              <NumInput
                                value={li.qty}
                                onChange={(v) => updateItem(li.id, { qty: v })}
                              />
                            </td>
                            <td className="px-3 py-3 text-right">
                              <NumInput
                                value={li.termMonths}
                                onChange={(v) => updateItem(li.id, { termMonths: v })}
                              />
                            </td>
                            <td className="px-3 py-3 text-right tabular-nums">{fmt2(li.listPrice)}</td>
                            <td className="px-3 py-3 text-right">
                              <div className="inline-flex items-center gap-1">
                                <NumInput
                                  value={li.discountPct}
                                  onChange={(v) => updateItem(li.id, { discountPct: Math.min(100, Math.max(0, v)) })}
                                />
                                <Percent className="h-3 w-3 text-muted-foreground" />
                              </div>
                            </td>
                            <td className="px-3 py-3 text-right font-display font-medium tabular-nums">
                              {fmt(lineNet(li))}
                            </td>
                            <td className="px-2 py-3 text-right">
                              <button
                                onClick={() => removeItem(li.id)}
                                className="h-7 w-7 grid place-items-center rounded-md text-muted-foreground hover:bg-accent hover:text-[color:var(--destructive)]"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="border-t border-border px-4 py-2 bg-muted/20">
                    <button
                      onClick={addItem}
                      className="h-8 px-3 inline-flex items-center gap-1.5 rounded-md text-xs font-medium text-[color:var(--primary)] hover:bg-[color:var(--primary)]/10"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add line item
                    </button>
                  </div>
                </div>

                {/* Totals */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2 rounded-xl border border-border bg-muted/20 p-4 text-xs text-muted-foreground space-y-1">
                    <div className="font-medium text-foreground text-sm mb-1">Quote terms</div>
                    <div>• Net 30 payment terms · Billed annually in advance</div>
                    <div>• Auto-renews unless cancelled 60 days prior to term end</div>
                    <div>• Pricing locked for term · Overage at $0.02 / AI min</div>
                    <div>• MSA + DPA governs · Order form supersedes prior quotes</div>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-4 space-y-2 text-sm">
                    <Total label="Subtotal" value={fmt(totals.subtotal)} />
                    <Total label="Discount" value={`− ${fmt(totals.discount)}`} accent="destructive" />
                    <Total label="Net" value={fmt(totals.net)} />
                    <Total label="Tax (8%)" value={fmt(totals.tax)} />
                    <div className="pt-2 mt-2 border-t border-border flex items-center justify-between">
                      <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Total ACV</span>
                      <span className="font-display font-semibold text-xl tabular-nums">{fmt(totals.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {tab === "activity" && (
              <div className="p-5">
                <ol className="space-y-4">
                  {opp.activities.length === 0 && (
                    <li className="text-sm text-muted-foreground italic">No activity yet.</li>
                  )}
                  {opp.activities.map((a: any) => (
                    <li key={a.id} className="flex gap-3">
                      <div
                        className="h-8 w-8 grid place-items-center rounded-full text-[10px] font-semibold shrink-0"
                        style={{
                          background: "color-mix(in oklab, var(--primary) 12%, transparent)",
                          color: "var(--primary)",
                        }}
                      >
                        {a.type[0]}
                      </div>
                      <div className="flex-1 border-b border-border pb-3">
                        <div className="text-xs text-muted-foreground">
                          {a.type} · {a.who} · {a.when}
                        </div>
                        <div className="text-sm mt-0.5">{a.note}</div>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {tab === "email" && (
              <div className="p-5">
                <div className="rounded-xl border border-border p-4 space-y-3">
                  <Field label="To" placeholder={opp.contact?.email ?? "name@company.com"} />
                  <Field label="Subject" placeholder="Following up on our conversation" />
                  <div>
                    <label className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                      Body
                    </label>
                    <textarea
                      rows={8}
                      placeholder="Write your message…"
                      className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="h-9 px-4 inline-flex items-center gap-1.5 rounded-md bg-foreground text-background text-sm font-medium">
                      <Send className="h-3.5 w-3.5" /> Send email
                    </button>
                    <button className="h-9 px-3 inline-flex items-center gap-1.5 rounded-md border border-border text-sm">
                      <Sparkles className="h-3.5 w-3.5 text-[color:var(--primary)]" /> Draft with AI
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function Panel({
  title,
  accent,
  children,
}: {
  title: string;
  accent?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl border bg-card overflow-hidden"
      style={{ borderColor: accent ? "color-mix(in oklab, var(--primary) 40%, transparent)" : "var(--border)" }}
    >
      <div
        className="px-4 py-2.5 text-[10px] uppercase tracking-[0.18em] border-b"
        style={{
          color: accent ? "var(--primary)" : "var(--muted-foreground)",
          borderColor: "var(--border)",
          background: accent ? "color-mix(in oklab, var(--primary) 6%, transparent)" : "transparent",
        }}
      >
        {title}
      </div>
      <div className="divide-y divide-border">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: React.ReactNode; value: React.ReactNode }) {
  return (
    <div className="px-4 py-2.5 flex items-center justify-between gap-3">
      <span className="text-xs text-muted-foreground inline-flex items-center gap-1.5">{label}</span>
      <span className="text-sm text-foreground text-right truncate max-w-[60%]">{value}</span>
    </div>
  );
}

function Total({ label, value, accent }: { label: string; value: string; accent?: "destructive" }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span
        className="text-sm tabular-nums"
        style={{ color: accent === "destructive" ? "var(--destructive)" : undefined }}
      >
        {value}
      </span>
    </div>
  );
}

function NumInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value) || 0)}
      className="h-8 w-20 rounded-md border border-border bg-background px-2 text-right text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-ring/40"
    />
  );
}

function Field({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div>
      <label className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{label}</label>
      <input
        placeholder={placeholder}
        className="mt-1 w-full h-9 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
      />
    </div>
  );
}

// ============================================================
// Enterprise Quotes module
// ============================================================

type EnterpriseQuote = Quote & {
  expiresAt: string;
  approver: string;
  approverStatus: "Not requested" | "Pending" | "Approved" | "Rejected";
  sentTo?: string;
  signedAt?: string;
  signerIp?: string;
  currency: string;
  paymentTerms: string;
  validity: string;
  notes?: string;
  audit: { at: string; who: string; action: string }[];
};

function buildQuotes(seed: Quote | undefined): EnterpriseQuote[] {
  const base: Quote = seed ?? {
    id: "q-new",
    name: "Draft quote",
    version: 1,
    status: "Draft",
    createdAt: "2026-06-22",
    items: [],
  };

  // Lower-priced previous version (mock history)
  const v1Items = base.items.map((i) => ({ ...i, id: `${i.id}-v1`, discountPct: Math.max(0, i.discountPct - 5) }));
  const v0Items = base.items.map((i) => ({ ...i, id: `${i.id}-v0`, qty: Math.max(1, Math.round(i.qty * 0.7)) }));

  const list: EnterpriseQuote[] = [
    {
      ...base,
      id: base.id,
      version: base.version,
      currency: "USD",
      paymentTerms: "Net 30",
      validity: "30 days",
      expiresAt: "2026-07-22",
      approver: "Bill Lumbergh (RevOps)",
      approverStatus: base.status === "Approved" || base.status === "Signed" ? "Approved" : "Pending",
      sentTo: base.status !== "Draft" ? "champion@customer.test" : undefined,
      signedAt: base.status === "Signed" ? "2026-05-10 14:22 UTC" : undefined,
      signerIp: base.status === "Signed" ? "73.21.44.18" : undefined,
      notes: "Includes pooled AI minutes and premium onboarding.",
      audit: [
        { at: "2026-06-22 09:14", who: "Anees Naveed", action: "Created quote" },
        { at: "2026-06-22 09:31", who: "Anees Naveed", action: "Added 3 line items" },
        ...(base.status !== "Draft"
          ? [{ at: "2026-06-23 11:02", who: "System", action: "Sent to champion@customer.test" }]
          : []),
      ],
    },
    {
      id: `${base.id}-v${base.version - 1 > 0 ? base.version - 1 : 1}b`,
      name: base.name,
      version: Math.max(1, base.version - 1),
      status: "Sent",
      createdAt: "2026-06-15",
      items: v1Items,
      currency: "USD",
      paymentTerms: "Net 30",
      validity: "30 days",
      expiresAt: "2026-07-15",
      approver: "Bill Lumbergh (RevOps)",
      approverStatus: "Approved",
      sentTo: "champion@customer.test",
      notes: "Earlier proposal — superseded by current version.",
      audit: [
        { at: "2026-06-15 10:00", who: "Anees Naveed", action: "Created quote" },
        { at: "2026-06-16 14:21", who: "Bill Lumbergh", action: "Approved" },
        { at: "2026-06-16 14:40", who: "System", action: "Sent to champion@customer.test" },
        { at: "2026-06-20 09:00", who: "Anees Naveed", action: "Superseded by v" + base.version },
      ],
    },
    {
      id: `${base.id}-v0`,
      name: base.name,
      version: 1,
      status: "Draft",
      createdAt: "2026-06-08",
      items: v0Items,
      currency: "USD",
      paymentTerms: "Net 30",
      validity: "14 days",
      expiresAt: "2026-06-22",
      approver: "—",
      approverStatus: "Not requested",
      notes: "Initial scoping draft.",
      audit: [{ at: "2026-06-08 16:11", who: "Anees Naveed", action: "Created scoping draft" }],
    },
  ];
  return list;
}

function cloneAsNewVersion(q: EnterpriseQuote): EnterpriseQuote {
  return {
    ...q,
    id: `${q.id}-v${q.version + 1}`,
    version: q.version + 1,
    status: "Draft",
    createdAt: new Date().toISOString().slice(0, 10),
    approverStatus: "Not requested",
    sentTo: undefined,
    signedAt: undefined,
    signerIp: undefined,
    audit: [{ at: new Date().toISOString().slice(0, 16).replace("T", " "), who: "Anees Naveed", action: `Cloned from v${q.version}` }],
  };
}

const statusStyle: Record<EnterpriseQuote["status"], { bg: string; fg: string; dot: string }> = {
  Draft: { bg: "color-mix(in oklab, var(--muted-foreground) 14%, transparent)", fg: "var(--muted-foreground)", dot: "var(--muted-foreground)" },
  Sent: { bg: "color-mix(in oklab, var(--primary) 14%, transparent)", fg: "var(--primary)", dot: "var(--primary)" },
  Approved: { bg: "color-mix(in oklab, var(--chart-2) 16%, transparent)", fg: "var(--chart-2)", dot: "var(--chart-2)" },
  Signed: { bg: "color-mix(in oklab, var(--success) 16%, transparent)", fg: "var(--success)", dot: "var(--success)" },
};

function StatusPill({ status }: { status: EnterpriseQuote["status"] }) {
  const s = statusStyle[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium"
      style={{ background: s.bg, color: s.fg }}
    >
      <CircleDot className="h-2.5 w-2.5" style={{ color: s.dot }} />
      {status}
    </span>
  );
}

const fmtUSD = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function QuotesTab({
  quotes,
  onOpen,
  onNewVersion,
}: {
  quotes: EnterpriseQuote[];
  onOpen: (id: string) => void;
  onNewVersion: () => void;
}) {
  const [expanded, setExpanded] = useState<string | null>(quotes[0]?.id ?? null);

  const totalACV = quotes.reduce((s, q) => s + quoteTotals(q).total, 0);
  const latest = quotes[0];
  const latestTotal = latest ? quoteTotals(latest).total : 0;
  const pendingApproval = quotes.filter((q) => q.approverStatus === "Pending").length;
  const signed = quotes.filter((q) => q.status === "Signed").length;

  return (
    <div className="p-5 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Quote management</div>
          <h3 className="font-serif text-2xl tracking-tight mt-0.5">Quotes &amp; versions</h3>
          <div className="text-xs text-muted-foreground mt-1">
            {quotes.length} version{quotes.length === 1 ? "" : "s"} · Latest v{latest?.version} · Currency USD
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="h-9 px-3 inline-flex items-center gap-1.5 rounded-md border border-border bg-card text-sm hover:bg-accent">
            <Download className="h-3.5 w-3.5" /> Export CSV
          </button>
          <button
            onClick={onNewVersion}
            className="h-9 px-3 inline-flex items-center gap-1.5 rounded-md bg-[color:var(--primary)] text-white text-sm font-medium hover:opacity-90"
          >
            <Plus className="h-3.5 w-3.5" /> New version
          </button>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiTile label="Total quoted ACV" value={fmtUSD(totalACV)} />
        <KpiTile label="Latest version ACV" value={fmtUSD(latestTotal)} accent />
        <KpiTile label="Awaiting approval" value={String(pendingApproval)} icon={<ShieldCheck className="h-3.5 w-3.5" />} />
        <KpiTile label="Signed" value={String(signed)} icon={<Lock className="h-3.5 w-3.5" />} />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr className="text-left text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                <th className="px-4 py-3 font-medium w-8" />
                <th className="px-3 py-3 font-medium">Version</th>
                <th className="px-3 py-3 font-medium">Status</th>
                <th className="px-3 py-3 font-medium">Approval</th>
                <th className="px-3 py-3 font-medium">Created</th>
                <th className="px-3 py-3 font-medium">Expires</th>
                <th className="px-3 py-3 font-medium text-right">Net ACV</th>
                <th className="px-3 py-3 font-medium text-right w-44">Actions</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((q, idx) => {
                const t = quoteTotals(q);
                const isOpen = expanded === q.id;
                const expired = new Date(q.expiresAt) < new Date("2026-06-26");
                return (
                  <Fragment key={q.id}>
                    <tr
                      className="border-t border-border align-top hover:bg-muted/20 cursor-pointer"
                      onClick={() => setExpanded(isOpen ? null : q.id)}
                    >
                      <td className="px-4 py-3">
                        <ChevronRight
                          className="h-4 w-4 text-muted-foreground transition-transform"
                          style={{ transform: isOpen ? "rotate(90deg)" : "none" }}
                        />
                      </td>
                      <td className="px-3 py-3">
                        <div className="font-medium inline-flex items-center gap-2">
                          <GitBranch className="h-3.5 w-3.5 text-muted-foreground" />
                          {q.name} <span className="text-muted-foreground">· v{q.version}</span>
                          {idx === 0 && (
                            <span
                              className="text-[10px] uppercase tracking-[0.14em] px-1.5 py-0.5 rounded"
                              style={{
                                background: "color-mix(in oklab, var(--primary) 14%, transparent)",
                                color: "var(--primary)",
                              }}
                            >
                              Current
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-muted-foreground font-mono mt-0.5">{q.id}</div>
                      </td>
                      <td className="px-3 py-3">
                        <StatusPill status={q.status} />
                      </td>
                      <td className="px-3 py-3 text-xs">
                        <div className="font-medium text-foreground">{q.approverStatus}</div>
                        <div className="text-muted-foreground">{q.approver}</div>
                      </td>
                      <td className="px-3 py-3 text-xs text-muted-foreground tabular-nums">{q.createdAt}</td>
                      <td className="px-3 py-3 text-xs tabular-nums">
                        <span style={{ color: expired ? "var(--destructive)" : undefined }}>
                          {q.expiresAt}
                        </span>
                        {expired && (
                          <div className="text-[10px] uppercase tracking-[0.14em] text-[color:var(--destructive)]">
                            Expired
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-3 text-right font-display font-semibold tabular-nums">
                        {fmtUSD(t.total)}
                      </td>
                      <td className="px-3 py-3 text-right">
                        <div className="inline-flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          <IconBtn title="Preview PDF">
                            <Eye className="h-3.5 w-3.5" />
                          </IconBtn>
                          <IconBtn title="Duplicate as new version">
                            <Copy className="h-3.5 w-3.5" />
                          </IconBtn>
                          <button
                            onClick={() => onOpen(q.id)}
                            className="h-8 px-2.5 inline-flex items-center gap-1 rounded-md bg-foreground text-background text-xs font-medium hover:opacity-90"
                          >
                            Open <ChevronRight className="h-3 w-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {isOpen && (
                      <tr className="bg-muted/10 border-t border-border">
                        <td />
                        <td colSpan={7} className="px-4 py-4">
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            {/* Summary */}
                            <div className="rounded-lg border border-border bg-card p-3 space-y-2">
                              <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                                Quote summary
                              </div>
                              <MiniRow label="Subtotal" value={fmtUSD(t.subtotal)} />
                              <MiniRow label="Discount" value={`− ${fmtUSD(t.discount)}`} accent="destructive" />
                              <MiniRow label="Tax (8%)" value={fmtUSD(t.tax)} />
                              <div className="pt-2 mt-1 border-t border-border flex items-center justify-between">
                                <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                                  Total
                                </span>
                                <span className="font-display font-semibold tabular-nums">{fmtUSD(t.total)}</span>
                              </div>
                            </div>

                            {/* Terms */}
                            <div className="rounded-lg border border-border bg-card p-3 space-y-2">
                              <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                                Commercial terms
                              </div>
                              <MiniRow label="Currency" value={q.currency} />
                              <MiniRow label="Payment" value={q.paymentTerms} />
                              <MiniRow label="Validity" value={q.validity} />
                              <MiniRow label="Sent to" value={q.sentTo ?? "—"} />
                              {q.signedAt && <MiniRow label="Signed" value={q.signedAt} />}
                              {q.signerIp && <MiniRow label="Signer IP" value={q.signerIp} />}
                            </div>

                            {/* Audit */}
                            <div className="rounded-lg border border-border bg-card p-3">
                              <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground mb-2 inline-flex items-center gap-1.5">
                                <History className="h-3 w-3" /> Audit trail
                              </div>
                              <ol className="space-y-2 text-xs">
                                {q.audit.map((a, i) => (
                                  <li key={i} className="flex gap-2">
                                    <Clock className="h-3 w-3 mt-0.5 text-muted-foreground shrink-0" />
                                    <div className="flex-1">
                                      <div className="text-foreground">{a.action}</div>
                                      <div className="text-muted-foreground tabular-nums">
                                        {a.at} · {a.who}
                                      </div>
                                    </div>
                                  </li>
                                ))}
                              </ol>
                            </div>
                          </div>

                          {/* Action bar */}
                          <div className="mt-4 flex items-center gap-2 flex-wrap">
                            <button
                              onClick={() => onOpen(q.id)}
                              className="h-9 px-3 inline-flex items-center gap-1.5 rounded-md bg-[color:var(--primary)] text-white text-sm font-medium hover:opacity-90"
                            >
                              <Pencil className="h-3.5 w-3.5" /> Edit in CPQ
                            </button>
                            <button className="h-9 px-3 inline-flex items-center gap-1.5 rounded-md border border-border bg-card text-sm hover:bg-accent">
                              <FileText className="h-3.5 w-3.5" /> Preview PDF
                            </button>
                            <button className="h-9 px-3 inline-flex items-center gap-1.5 rounded-md border border-border bg-card text-sm hover:bg-accent">
                              <ShieldCheck className="h-3.5 w-3.5" /> Request approval
                            </button>
                            <button className="h-9 px-3 inline-flex items-center gap-1.5 rounded-md border border-border bg-card text-sm hover:bg-accent">
                              <Send className="h-3.5 w-3.5" /> Send for e-sign
                            </button>
                            <button className="h-9 px-3 inline-flex items-center gap-1.5 rounded-md border border-border bg-card text-sm hover:bg-accent">
                              <Copy className="h-3.5 w-3.5" /> Clone as new version
                            </button>
                            <button className="h-9 px-3 inline-flex items-center gap-1.5 rounded-md border border-border bg-card text-sm text-[color:var(--destructive)] hover:bg-[color:var(--destructive)]/5 ml-auto">
                              <Trash2 className="h-3.5 w-3.5" /> Void
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer note */}
      <div className="rounded-xl border border-dashed border-border bg-muted/10 px-4 py-3 text-xs text-muted-foreground inline-flex items-center gap-2">
        <ShieldCheck className="h-3.5 w-3.5 text-[color:var(--primary)]" />
        All quotes are governed by the MSA + DPA on file. Discounts above 15% auto-route to Deal Desk.
      </div>
    </div>
  );
}

function KpiTile({
  label,
  value,
  accent,
  icon,
}: {
  label: string;
  value: string;
  accent?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div
      className="rounded-xl border bg-card p-3"
      style={{
        borderColor: accent ? "color-mix(in oklab, var(--primary) 40%, transparent)" : "var(--border)",
        background: accent ? "color-mix(in oklab, var(--primary) 6%, transparent)" : undefined,
      }}
    >
      <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground inline-flex items-center gap-1.5">
        {icon} {label}
      </div>
      <div className="font-display text-xl font-semibold mt-1 tabular-nums">{value}</div>
    </div>
  );
}

function MiniRow({ label, value, accent }: { label: string; value: string; accent?: "destructive" }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span
        className="tabular-nums"
        style={{ color: accent === "destructive" ? "var(--destructive)" : "var(--foreground)" }}
      >
        {value}
      </span>
    </div>
  );
}

function IconBtn({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <button
      title={title}
      className="h-8 w-8 grid place-items-center rounded-md border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-accent"
    >
      {children}
    </button>
  );
}

