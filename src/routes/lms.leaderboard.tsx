import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { HubPage } from "@/components/hubs/page";
import { SectionCard, Avatar, FilterBar } from "@/components/enterprise/primitives";
import { LEADERBOARD, TRACKS, trackById } from "@/lib/lms-data";
import { Trophy, Flame, Award } from "lucide-react";

export const Route = createFileRoute("/lms/leaderboard")({
  head: () => ({ meta: [{ title: "Leaderboard — Limnn LMS" }] }),
  component: Page,
});

const COHORTS = ["All cohorts", "Q1-26", "Q4-25"];
const DEPTS = ["All", "Sales", "CS", "Support", "Product"];

function Page() {
  const [trackFilter, setTrackFilter] = useState<string>("All tracks");
  const [cohort, setCohort] = useState(COHORTS[0]);
  const [dept, setDept] = useState(DEPTS[0]);

  const rows = useMemo(
    () =>
      LEADERBOARD.filter((r) => {
        if (trackFilter !== "All tracks" && trackById(r.trackId)?.name !== trackFilter) return false;
        if (cohort !== "All cohorts" && r.cohort !== cohort) return false;
        if (dept !== "All" && r.department !== dept) return false;
        return true;
      }),
    [trackFilter, cohort, dept],
  );

  return (
    <HubPage title="Leaderboard" description="Composite score across modules, quizzes, practicals and streak.">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {rows.slice(0, 3).map((r, i) => {
          const podium = ["#F59E0B", "#94A3B8", "#B45309"][i];
          return (
            <div
              key={r.name}
              className="rounded-xl p-4 text-white relative overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${podium}, #1E293B)` }}
            >
              <Trophy className="absolute right-3 top-3 h-8 w-8 opacity-30" />
              <div className="text-[10px] uppercase tracking-[0.18em] opacity-80">Rank #{r.rank}</div>
              <div className="mt-2 flex items-center gap-2">
                <Avatar name={r.name} size={32} />
                <div>
                  <div className="font-display font-semibold text-base leading-tight">{r.name}</div>
                  <div className="text-[11px] opacity-80">{r.department} · {r.cohort}</div>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                <div><div className="opacity-70 text-[10px]">Score</div><div className="font-mono">{r.score}</div></div>
                <div><div className="opacity-70 text-[10px]">Certs</div><div>{r.certs}</div></div>
                <div className="inline-flex items-center gap-1"><Flame className="h-3 w-3" />{r.streak}d</div>
              </div>
            </div>
          );
        })}
      </div>

      <SectionCard title="Standings">
        <FilterBar
          chips={["All tracks", ...TRACKS.map((t) => t.name)]}
          active={trackFilter}
          onSelect={setTrackFilter}
          right={
            <div className="flex items-center gap-2">
              <select value={cohort} onChange={(e) => setCohort(e.target.value)} className="h-8 px-2 rounded-md border border-border bg-card text-xs">
                {COHORTS.map((c) => <option key={c}>{c}</option>)}
              </select>
              <select value={dept} onChange={(e) => setDept(e.target.value)} className="h-8 px-2 rounded-md border border-border bg-card text-xs">
                {DEPTS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              <tr>
                <th className="py-2 pr-3">#</th>
                <th className="py-2 pr-3">Name</th>
                <th className="py-2 pr-3">Track</th>
                <th className="py-2 pr-3">Cohort</th>
                <th className="py-2 pr-3">Dept</th>
                <th className="py-2 pr-3 text-right">Score</th>
                <th className="py-2 pr-3 text-right">Certs</th>
                <th className="py-2 pr-3 text-right">Streak</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.name} className="border-t border-border">
                  <td className="py-2.5 pr-3 font-mono text-xs text-muted-foreground">{r.rank}</td>
                  <td className="py-2.5 pr-3">
                    <div className="flex items-center gap-2">
                      <Avatar name={r.name} />
                      <span className="font-medium">{r.name}</span>
                    </div>
                  </td>
                  <td className="py-2.5 pr-3"><span style={{ color: trackById(r.trackId)?.color }}>{trackById(r.trackId)?.name}</span></td>
                  <td className="py-2.5 pr-3 text-muted-foreground">{r.cohort}</td>
                  <td className="py-2.5 pr-3 text-muted-foreground">{r.department}</td>
                  <td className="py-2.5 pr-3 text-right font-mono">{r.score}</td>
                  <td className="py-2.5 pr-3 text-right inline-flex items-center gap-1 justify-end"><Award className="h-3 w-3 text-muted-foreground" />{r.certs}</td>
                  <td className="py-2.5 pr-3 text-right inline-flex items-center gap-1 justify-end"><Flame className="h-3 w-3 text-amber-500" />{r.streak}d</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </HubPage>
  );
}
