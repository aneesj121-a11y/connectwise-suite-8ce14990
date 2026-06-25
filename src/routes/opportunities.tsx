import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Plus, LayoutList, LayoutGrid, ArrowUpRight, TrendingUp, Target, Filter, Download } from "lucide-react";
import { OPPORTUNITIES, STAGES, stageColor, type Stage } from "@/lib/opportunities";

export const Route = createFileRoute("/opportunities")({
  component: OpportunitiesPage,
});

const fmt = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function OpportunitiesPage() {
  const [q, setQ] = useState("");
  const [view, setView] = useState<"list" | "board">("list");
  const [stage, setStage] = useState<Stage | "All">("All");

  const filtered = useMemo(
    () =>
      OPPORTUNITIES.filter(
        (o) =>
          (stage === "All" || o.stage === stage) &&
          (q === "" || (o.name + o.company).toLowerCase().includes(q.toLowerCase())),
      ),
    [q, stage],
  );

  const totalPipeline = OPPORTUNITIES.reduce((s, o) => s + o.value, 0);
  const openAcv = OPPORTUNITIES.filter((o) => o.stage !== "Closed").reduce((s, o) => s + o.value, 0);
  const weighted = OPPORTUNITIES.filter((o) => o.stage !== "Closed").reduce(
    (s, o) => s + (o.value * o.probability) / 100,
    0,
  );
  const wonQtd = OPPORTUNITIES.filter((o) => o.stage === "Closed").reduce((s, o) => s + o.value, 0);

  return (
    <div className="px-6 lg:px-8 py-7 space-y-7 max-w-[1600px] mx-auto">
      {/* Header */}
      <header className="flex items-start justify-between gap-6 flex-wrap">
        <div>
          <div className="text-[11px] uppercase tracking-[0.22em] text-[color:var(--sales)] font-medium">
            Sales · Dashboard
          </div>
          <h1 className="font-serif text-4xl tracking-tight mt-1">Opportunities</h1>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-xl">
            Manage your pipeline, configure quotes and track contract values across every stage.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="h-9 px-3 inline-flex items-center gap-1.5 rounded-md border border-border bg-card text-sm hover:bg-accent">
            <Download className="h-3.5 w-3.5" /> Export
          </button>
          <button className="h-9 px-4 inline-flex items-center gap-1.5 rounded-md bg-foreground text-background text-sm font-medium hover:opacity-90">
            <Plus className="h-3.5 w-3.5" /> New opportunity
          </button>
        </div>
      </header>

      {/* KPI strip */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Kpi label="Total pipeline" value={fmt(totalPipeline)} sub="7 active deals" />
        <Kpi label="Open ACV" value={fmt(openAcv)} sub="Excludes closed" accent />
        <Kpi label="Weighted forecast" value={fmt(weighted)} sub="Probability-adjusted" />
        <Kpi label="Won QTD" value={fmt(wonQtd)} sub="2 deals · 100% attainment risk" />
      </section>

      {/* Quota tracker */}
      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Q3 2026 Quota</div>
            <h3 className="font-display font-semibold text-lg mt-0.5">Anees Naveed · Sales Quota</h3>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <div>
              <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Target</div>
              <div className="font-display font-semibold text-lg">{fmt(250000)}</div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Closed</div>
              <div className="font-display font-semibold text-lg text-[color:var(--success)]">{fmt(wonQtd)}</div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Attainment</div>
              <div className="font-display font-semibold text-lg">{Math.round((wonQtd / 250000) * 100)}%</div>
            </div>
          </div>
        </div>
        <div className="mt-4 h-3 rounded-full bg-muted overflow-hidden flex">
          <div className="bg-[color:var(--success)]" style={{ width: `${(wonQtd / 250000) * 100}%` }} />
          <div
            className="bg-[color:var(--primary)] opacity-70"
            style={{ width: `${(openAcv / 250000) * 100}%` }}
          />
        </div>
        <div className="mt-2 flex items-center gap-4 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <i className="h-2 w-2 rounded-sm bg-[color:var(--success)]" /> Closed
          </span>
          <span className="inline-flex items-center gap-1.5">
            <i className="h-2 w-2 rounded-sm bg-[color:var(--primary)] opacity-70" /> In pipeline
          </span>
          <span className="ml-auto">Gap to target: {fmt(Math.max(0, 250000 - wonQtd - openAcv))}</span>
        </div>
      </section>

      {/* Toolbar */}
      <section className="rounded-2xl border border-border bg-card">
        <div className="p-5 flex items-center justify-between gap-4 flex-wrap border-b border-border">
          <div>
            <h3 className="font-serif text-2xl tracking-tight">Opportunity board</h3>
            <p className="text-sm text-muted-foreground">View and manage your pipeline opportunities.</p>
          </div>
          <div className="flex items-center gap-2">
            <label className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search opportunities…"
                className="h-9 w-64 pl-9 pr-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
              />
            </label>
            <div className="inline-flex rounded-md border border-border bg-background p-0.5">
              <button
                onClick={() => setView("list")}
                className={`h-8 px-3 inline-flex items-center gap-1.5 rounded text-xs font-medium ${view === "list" ? "bg-foreground text-background" : "text-muted-foreground"}`}
              >
                <LayoutList className="h-3.5 w-3.5" /> List
              </button>
              <button
                onClick={() => setView("board")}
                className={`h-8 px-3 inline-flex items-center gap-1.5 rounded text-xs font-medium ${view === "board" ? "bg-foreground text-background" : "text-muted-foreground"}`}
              >
                <LayoutGrid className="h-3.5 w-3.5" /> Board
              </button>
            </div>
          </div>
        </div>

        {/* Stage filter chips */}
        <div className="px-5 pt-4 flex items-center gap-2 flex-wrap">
          <Filter className="h-3.5 w-3.5 text-muted-foreground" />
          <FilterChip active={stage === "All"} onClick={() => setStage("All")}>
            All · {OPPORTUNITIES.length}
          </FilterChip>
          {STAGES.map((s) => {
            const count = OPPORTUNITIES.filter((o) => o.stage === s).length;
            return (
              <FilterChip key={s} active={stage === s} onClick={() => setStage(s)}>
                {s} · {count}
              </FilterChip>
            );
          })}
        </div>

        {view === "list" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Opportunity</th>
                  <th className="px-5 py-3 font-medium">Stage</th>
                  <th className="px-5 py-3 font-medium text-right">Value</th>
                  <th className="px-5 py-3 font-medium text-right">Prob.</th>
                  <th className="px-5 py-3 font-medium">Close</th>
                  <th className="px-5 py-3 font-medium">Owner</th>
                  <th className="px-5 py-3 font-medium" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => (
                  <tr key={o.id} className="border-t border-border hover:bg-accent/40 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-medium">{o.name}</div>
                      <div className="text-xs text-muted-foreground">{o.company}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <StageBadge stage={o.stage} />
                    </td>
                    <td className="px-5 py-3.5 text-right font-display font-medium">{fmt(o.value)}</td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <div className="h-1.5 w-14 rounded-full bg-muted overflow-hidden">
                          <div className="h-full bg-[color:var(--primary)]" style={{ width: `${o.probability}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground tabular-nums">{o.probability}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground tabular-nums text-xs">{o.closeDate}</td>
                    <td className="px-5 py-3.5 text-xs">{o.owner}</td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        to="/opportunities/$id"
                        params={{ id: o.id }}
                        className="inline-flex items-center gap-1 text-xs font-medium text-[color:var(--primary)] hover:underline"
                      >
                        View <ArrowUpRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-sm text-muted-foreground">
                      No opportunities match.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-5 grid grid-cols-5 gap-3 overflow-x-auto">
            {STAGES.map((s) => {
              const cards = filtered.filter((o) => o.stage === s);
              const total = cards.reduce((sum, o) => sum + o.value, 0);
              return (
                <div key={s} className="rounded-xl bg-muted/40 p-3 min-h-[260px]">
                  <div className="flex items-center justify-between mb-3">
                    <StageBadge stage={s} />
                    <span className="text-[11px] text-muted-foreground tabular-nums">{fmt(total)}</span>
                  </div>
                  <div className="space-y-2">
                    {cards.map((o) => (
                      <Link
                        key={o.id}
                        to="/opportunities/$id"
                        params={{ id: o.id }}
                        className="block rounded-lg bg-card border border-border p-3 hover:border-[color:var(--primary)] transition-colors"
                      >
                        <div className="text-sm font-medium leading-snug">{o.name}</div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">{o.company}</div>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-xs font-display font-semibold">{fmt(o.value)}</span>
                          <span className="text-[11px] text-muted-foreground">{o.probability}%</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function Kpi({ label, value, sub, accent }: { label: string; value: string; sub: string; accent?: boolean }) {
  return (
    <div
      className="rounded-2xl border bg-card p-5"
      style={{ borderColor: accent ? "var(--primary)" : "var(--border)" }}
    >
      <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
      <div className="font-display font-semibold text-2xl mt-1.5 tabular-nums">{value}</div>
      <div className="text-xs text-muted-foreground mt-1 inline-flex items-center gap-1">
        {accent ? <Target className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
        {sub}
      </div>
    </div>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="h-7 px-3 rounded-full text-xs font-medium transition-colors"
      style={{
        background: active ? "var(--foreground)" : "transparent",
        color: active ? "var(--background)" : "var(--muted-foreground)",
        border: `1px solid ${active ? "var(--foreground)" : "var(--border)"}`,
      }}
    >
      {children}
    </button>
  );
}

function StageBadge({ stage }: { stage: Stage }) {
  const c = stageColor[stage];
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium"
      style={{ background: c.bg, color: c.fg }}
    >
      {stage}
    </span>
  );
}
