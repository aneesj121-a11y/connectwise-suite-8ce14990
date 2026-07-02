import { createFileRoute, Link } from "@tanstack/react-router";
import { HubPage } from "@/components/hubs/page";
import { SectionCard, StatusPill, Avatar, FilterBar } from "@/components/enterprise/primitives";
import { EMPLOYEES } from "@/lib/people-data";
import { Sparkles, Search } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/people/directory")({
  head: () => ({ meta: [{ title: "Directory — Limnn People" }] }),
  component: Directory,
});

function riskColor(r: number) {
  if (r >= 60) return "#EF4444";
  if (r >= 30) return "#F59E0B";
  return "#10B981";
}

function Directory() {
  const [q, setQ] = useState("");
  const filtered = EMPLOYEES.filter((e) =>
    !q || `${e.name} ${e.title} ${e.dept} ${e.location} ${e.id}`.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <HubPage
      title="Directory"
      description="247 employees across 6 departments and 4 locations."
    >
      <SectionCard>
        <FilterBar
          chips={["All", "Engineering", "Sales", "Marketing", "Ops", "Finance", "HR"]}
          active="All"
          right={
            <label className="relative block w-64">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search people…"
                className="w-full h-8 pl-8 pr-3 rounded-md border border-border bg-background text-xs focus:outline-none"
              />
            </label>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border">
                <th className="py-2 pr-3">Employee</th>
                <th className="py-2 pr-3">ID</th>
                <th className="py-2 pr-3">Title</th>
                <th className="py-2 pr-3">Dept</th>
                <th className="py-2 pr-3">Location</th>
                <th className="py-2 pr-3">Status</th>
                <th className="py-2 pr-3">Flight risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((e) => (
                <tr key={e.id} className="hover:bg-accent/40">
                  <td className="py-2 pr-3">
                    <Link to="/people/directory/$id" params={{ id: e.id }} className="flex items-center gap-2.5">
                      <Avatar name={e.name} size={26} />
                      <span className="font-medium hover:underline">{e.name}</span>
                    </Link>
                  </td>
                  <td className="py-2 pr-3 font-mono text-[11px] text-muted-foreground">{e.id}</td>
                  <td className="py-2 pr-3">{e.title}</td>
                  <td className="py-2 pr-3">{e.dept}</td>
                  <td className="py-2 pr-3 text-muted-foreground">{e.location}</td>
                  <td className="py-2 pr-3">
                    <StatusPill level={e.status === "Active" ? "green" : e.status === "On Leave" ? "blue" : e.status === "Probation" ? "yellow" : "red"}>
                      {e.status}
                    </StatusPill>
                  </td>
                  <td className="py-2 pr-3">
                    <span
                      title={`${e.flightRisk}% risk — ${e.riskFactors.join(", ") || "no active signals"}`}
                      className="inline-flex items-center gap-1.5"
                    >
                      <span className="h-2 w-2 rounded-full" style={{ background: riskColor(e.flightRisk) }} />
                      <Sparkles className="h-3 w-3 text-muted-foreground" />
                      <span className="font-mono text-[11px] text-muted-foreground">{e.flightRisk}%</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between mt-3 text-[11px] text-muted-foreground">
          <span>Showing {filtered.length} of 247</span>
          <div className="flex items-center gap-1">
            <button className="h-7 px-2 rounded border border-border hover:bg-accent">Prev</button>
            <span className="px-2">Page 1 of 17</span>
            <button className="h-7 px-2 rounded border border-border hover:bg-accent">Next</button>
          </div>
        </div>
      </SectionCard>
    </HubPage>
  );
}
