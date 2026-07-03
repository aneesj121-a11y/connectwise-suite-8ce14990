import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { HubPage } from "@/components/hubs/page";
import { SectionCard, Avatar, StatusPill, KpiCard } from "@/components/enterprise/primitives";
import { EMPLOYEES, DEPT_COLORS, type Employee } from "@/lib/people-data";
import {
  ChevronRight, Search, Users, MapPin, Mail, Phone, Calendar,
  ArrowUp, Maximize2, Download, Filter, ZoomIn, ZoomOut, Building2,
} from "lucide-react";

export const Route = createFileRoute("/people/org-chart")({
  head: () => ({ meta: [{ title: "Org Chart — Limnn People" }] }),
  component: OrgChart,
});

function OrgChart() {
  const ceo = EMPLOYEES.find((e) => e.title.includes("Chief Executive"))!;
  const [focusId, setFocusId] = useState<string>(ceo.id);
  const [query, setQuery] = useState("");

  const focus = EMPLOYEES.find((e) => e.id === focusId) ?? ceo;
  const reports = useMemo(() => EMPLOYEES.filter((e) => e.managerId === focus.id), [focus.id]);
  const peers = useMemo(
    () => (focus.managerId ? EMPLOYEES.filter((e) => e.managerId === focus.managerId && e.id !== focus.id) : []),
    [focus.id, focus.managerId],
  );

  // Build manager chain up to CEO
  const chain: Employee[] = useMemo(() => {
    const out: Employee[] = [];
    let cur: Employee | undefined = focus;
    const seen = new Set<string>();
    while (cur?.managerId && !seen.has(cur.id)) {
      seen.add(cur.id);
      const mgr = EMPLOYEES.find((e) => e.id === cur!.managerId);
      if (!mgr) break;
      out.unshift(mgr);
      cur = mgr;
    }
    return out;
  }, [focus.id]);

  const searchResults = query
    ? EMPLOYEES.filter(
        (e) =>
          e.name.toLowerCase().includes(query.toLowerCase()) ||
          e.title.toLowerCase().includes(query.toLowerCase()) ||
          e.dept.toLowerCase().includes(query.toLowerCase()),
      ).slice(0, 6)
    : [];

  // Team stats for right rail
  const teamSize = descendantsOf(focus.id).length;
  const teamAvgTenure = teamSize
    ? (descendantsOf(focus.id).reduce((a, e) => a + e.tenureYears, 0) / teamSize).toFixed(1)
    : "0";
  const teamAtRisk = descendantsOf(focus.id).filter((e) => e.flightRisk >= 60).length;

  return (
    <HubPage
      title="Org Chart"
      description="Explore reporting structure. Click any card to re-center — the chain above, direct reports below."
      actions={
        <>
          <button className="h-9 px-3 rounded-md border border-border text-sm font-medium inline-flex items-center gap-1.5 hover:bg-accent">
            <Filter className="h-3.5 w-3.5" /> Filter
          </button>
          <button className="h-9 px-3 rounded-md border border-border text-sm font-medium inline-flex items-center gap-1.5 hover:bg-accent">
            <Download className="h-3.5 w-3.5" /> Export
          </button>
          <button className="h-9 px-3 rounded-md border border-border text-sm font-medium inline-flex items-center gap-1.5 hover:bg-accent">
            <Maximize2 className="h-3.5 w-3.5" /> Full-screen
          </button>
        </>
      }
    >
      {/* Search + breadcrumb bar */}
      <SectionCard>
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search people, titles or departments…"
              className="w-full h-9 pl-8 pr-2 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring/30"
            />
            {searchResults.length > 0 && (
              <div className="absolute z-10 mt-1 w-full rounded-md border border-border bg-popover shadow-lg overflow-hidden">
                {searchResults.map((e) => (
                  <button
                    key={e.id}
                    onClick={() => {
                      setFocusId(e.id);
                      setQuery("");
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-accent"
                  >
                    <Avatar name={e.name} size={22} />
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-medium truncate">{e.name}</div>
                      <div className="text-[11px] text-muted-foreground truncate">{e.title}</div>
                    </div>
                    <span
                      className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0"
                      style={{ background: `color-mix(in oklab, ${DEPT_COLORS[e.dept] ?? "#6366F1"} 14%, transparent)`, color: DEPT_COLORS[e.dept] ?? "#6366F1" }}
                    >
                      {e.dept}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground overflow-x-auto flex-1 min-w-0">
            <Building2 className="h-3.5 w-3.5 shrink-0" />
            <button onClick={() => setFocusId(ceo.id)} className="hover:text-foreground shrink-0">Limnn</button>
            {chain.map((m) => (
              <span key={m.id} className="flex items-center gap-1.5 shrink-0">
                <ChevronRight className="h-3 w-3" />
                <button onClick={() => setFocusId(m.id)} className="hover:text-foreground truncate max-w-[140px]">
                  {m.name}
                </button>
              </span>
            ))}
            <ChevronRight className="h-3 w-3 shrink-0" />
            <span className="font-medium text-foreground truncate max-w-[180px]">{focus.name}</span>
          </div>

          <div className="flex items-center gap-1">
            <button className="h-8 w-8 grid place-items-center rounded-md border border-border hover:bg-accent"><ZoomOut className="h-3.5 w-3.5"/></button>
            <button className="h-8 w-8 grid place-items-center rounded-md border border-border hover:bg-accent"><ZoomIn className="h-3.5 w-3.5"/></button>
          </div>
        </div>
      </SectionCard>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5">
        {/* Chart canvas */}
        <SectionCard className="overflow-hidden">
          <div
            className="relative overflow-auto rounded-lg"
            style={{
              background:
                "radial-gradient(circle, color-mix(in oklab, var(--foreground) 6%, transparent) 1px, transparent 1px) 0 0 / 22px 22px, var(--card)",
              minHeight: 600,
            }}
          >
            <div className="min-w-[900px] px-6 py-8 flex flex-col items-center gap-2">
              {/* Manager (parent) */}
              {focus.managerId ? (
                <>
                  <button onClick={() => setFocusId(focus.managerId!)} className="group">
                    <ManagerChip emp={EMPLOYEES.find((e) => e.id === focus.managerId)!} />
                  </button>
                  <Connector />
                </>
              ) : (
                <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground mb-1">Top of org</div>
              )}

              {/* Focus node (large, Workday style) */}
              <FocusCard emp={focus} directs={reports.length} team={teamSize} />

              {/* Peers row */}
              {peers.length > 0 && (
                <div className="mt-4 w-full">
                  <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground text-center mb-2">
                    Peers · {peers.length}
                  </div>
                  <div className="flex flex-wrap items-start gap-2 justify-center opacity-80">
                    {peers.map((p) => (
                      <button key={p.id} onClick={() => setFocusId(p.id)}>
                        <PeerChip emp={p} />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Direct reports */}
              {reports.length > 0 && (
                <>
                  <div className="h-6 w-px bg-border mt-6" />
                  <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground mb-3">
                    Direct reports · {reports.length}
                  </div>
                  <div className="relative w-full">
                    {/* horizontal connector line */}
                    {reports.length > 1 && (
                      <div
                        className="absolute top-0 left-1/2 -translate-x-1/2 h-px bg-border"
                        style={{ width: `${Math.min(reports.length * 240, 1080)}px` }}
                      />
                    )}
                    <div className="flex flex-wrap items-start gap-4 justify-center pt-6">
                      {reports.map((r) => {
                        const sub = EMPLOYEES.filter((e) => e.managerId === r.id).length;
                        return (
                          <button key={r.id} onClick={() => setFocusId(r.id)} className="group">
                            <ReportCard emp={r} subCount={sub} />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              {reports.length === 0 && (
                <div className="mt-8 text-[11px] text-muted-foreground italic">Individual contributor · no direct reports</div>
              )}
            </div>
          </div>
        </SectionCard>

        {/* Right rail: team stats + profile */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <KpiCard label="Team size" value={String(teamSize)} icon={Users} />
            <KpiCard label="Avg tenure" value={`${teamAvgTenure}y`} icon={Calendar} />
            <KpiCard label="Direct reports" value={String(reports.length)} icon={Users} />
            <KpiCard label="At-risk" value={String(teamAtRisk)} icon={ArrowUp} />
          </div>

          <SectionCard title="Selected profile">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Avatar name={focus.name} size={44} />
                <div className="min-w-0 flex-1">
                  <div className="font-display font-semibold text-[15px] tracking-tight truncate">{focus.name}</div>
                  <div className="text-[11.5px] text-muted-foreground truncate">{focus.title}</div>
                  <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                    <DeptTag dept={focus.dept} />
                    <StatusPill level={focus.status === "Active" ? "green" : focus.status === "On Leave" ? "yellow" : "neutral"}>{focus.status}</StatusPill>
                  </div>
                </div>
              </div>
              <div className="space-y-1.5 text-[12px] pt-1 border-t border-border/60">
                <Row icon={Mail}>{focus.email}</Row>
                <Row icon={Phone}>{focus.phone}</Row>
                <Row icon={MapPin}>{focus.location}</Row>
                <Row icon={Calendar}>Since {focus.startDate} · {focus.tenureYears}y tenure</Row>
              </div>
              {focus.riskFactors.length > 0 && (
                <div className="rounded-md p-2.5 text-[11.5px]" style={{ background: "color-mix(in oklab, var(--warning) 10%, transparent)" }}>
                  <div className="font-medium mb-1">Flight risk: {focus.flightRisk}%</div>
                  <ul className="space-y-0.5 text-muted-foreground">
                    {focus.riskFactors.map((r) => <li key={r}>• {r}</li>)}
                  </ul>
                </div>
              )}
            </div>
          </SectionCard>
        </div>
      </div>
    </HubPage>
  );
}

function descendantsOf(id: string): Employee[] {
  const out: Employee[] = [];
  const walk = (mid: string) => {
    for (const e of EMPLOYEES) {
      if (e.managerId === mid) {
        out.push(e);
        walk(e.id);
      }
    }
  };
  walk(id);
  return out;
}

function Connector() {
  return <div className="h-5 w-px bg-border" />;
}

function DeptTag({ dept }: { dept: string }) {
  const color = DEPT_COLORS[dept] ?? "#6366F1";
  return (
    <span
      className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded"
      style={{ background: `color-mix(in oklab, ${color} 14%, transparent)`, color }}
    >
      {dept}
    </span>
  );
}

function Row({ icon: Icon, children }: { icon: any; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <Icon className="h-3 w-3 shrink-0" />
      <span className="truncate">{children}</span>
    </div>
  );
}

function ManagerChip({ emp }: { emp: Employee }) {
  const color = DEPT_COLORS[emp.dept] ?? "#6366F1";
  return (
    <div
      className="flex items-center gap-2 rounded-lg bg-card px-3 py-2 shadow-sm hover:shadow-md transition"
      style={{ border: "1px solid var(--border)", borderLeft: `3px solid ${color}` }}
    >
      <ArrowUp className="h-3 w-3 text-muted-foreground" />
      <Avatar name={emp.name} size={24} />
      <div className="text-left">
        <div className="text-[12px] font-medium leading-tight">{emp.name}</div>
        <div className="text-[10px] text-muted-foreground leading-tight">{emp.title}</div>
      </div>
    </div>
  );
}

function PeerChip({ emp }: { emp: Employee }) {
  const color = DEPT_COLORS[emp.dept] ?? "#6366F1";
  return (
    <div
      className="flex items-center gap-2 rounded-md bg-card px-2 py-1.5 shadow-sm hover:shadow-md hover:opacity-100 transition"
      style={{ border: "1px solid var(--border)", borderLeft: `2px solid ${color}` }}
    >
      <Avatar name={emp.name} size={20} />
      <div className="text-left">
        <div className="text-[11px] font-medium leading-tight">{emp.name}</div>
        <div className="text-[9.5px] text-muted-foreground leading-tight">{emp.title}</div>
      </div>
    </div>
  );
}

function FocusCard({ emp, directs, team }: { emp: Employee; directs: number; team: number }) {
  const color = DEPT_COLORS[emp.dept] ?? "#6366F1";
  return (
    <div
      className="rounded-xl bg-card shadow-xl overflow-hidden w-[340px]"
      style={{
        border: "1px solid var(--border)",
        boxShadow: `0 12px 32px -8px color-mix(in oklab, ${color} 30%, transparent), 0 1px 0 rgba(0,0,0,0.02)`,
      }}
    >
      <div className="h-1.5 w-full" style={{ background: color }} />
      <div className="p-4 flex items-start gap-3">
        <div
          className="h-14 w-14 rounded-full grid place-items-center text-white font-semibold text-lg shrink-0"
          style={{ background: `linear-gradient(135deg, ${color}, color-mix(in oklab, ${color} 60%, black))` }}
        >
          {emp.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-display font-semibold text-[16px] tracking-tight truncate">{emp.name}</div>
          <div className="text-[12px] text-muted-foreground truncate">{emp.title}</div>
          <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
            <DeptTag dept={emp.dept} />
            <span className="text-[10px] text-muted-foreground inline-flex items-center gap-1"><MapPin className="h-2.5 w-2.5"/>{emp.location}</span>
            <StatusPill level={emp.status === "Active" ? "green" : emp.status === "On Leave" ? "yellow" : "neutral"}>{emp.status}</StatusPill>
          </div>
        </div>
      </div>
      <div className="px-4 pb-3 pt-1 grid grid-cols-3 gap-2 border-t border-border/60">
        <Stat label="Directs" value={String(directs)} />
        <Stat label="Team" value={String(team)} />
        <Stat label="Tenure" value={`${emp.tenureYears}y`} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="font-display font-semibold text-[15px] leading-tight">{value}</div>
      <div className="text-[9.5px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}

function ReportCard({ emp, subCount }: { emp: Employee; subCount: number }) {
  const color = DEPT_COLORS[emp.dept] ?? "#6366F1";
  return (
    <div
      className="rounded-lg bg-card shadow-sm hover:shadow-md transition w-[220px] overflow-hidden"
      style={{ border: "1px solid var(--border)" }}
    >
      <div className="h-1 w-full" style={{ background: color }} />
      <div className="p-2.5 flex items-start gap-2">
        <Avatar name={emp.name} size={30} />
        <div className="flex-1 min-w-0 text-left">
          <div className="text-[12.5px] font-medium truncate leading-tight">{emp.name}</div>
          <div className="text-[10.5px] text-muted-foreground truncate leading-tight">{emp.title}</div>
        </div>
      </div>
      <div className="px-2.5 pb-2 flex items-center justify-between">
        <DeptTag dept={emp.dept} />
        {subCount > 0 ? (
          <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-full inline-flex items-center gap-1"
            style={{ background: `color-mix(in oklab, ${color} 12%, transparent)`, color }}>
            <Users className="h-2.5 w-2.5" /> {subCount}
          </span>
        ) : (
          <span className="text-[10px] text-muted-foreground">IC</span>
        )}
      </div>
    </div>
  );
}
