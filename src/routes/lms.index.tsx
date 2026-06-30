import { createFileRoute, Link } from "@tanstack/react-router";
import { HubPage } from "@/components/hubs/page";
import { KpiCard, SectionCard, StatusPill } from "@/components/enterprise/primitives";
import { TRACKS, MODULES, TRAINEE_PROGRESS, isTrackUnlocked, modulesForTrack } from "@/lib/lms-data";
import { hubInsights } from "@/lib/hubs-data";
import {
  GraduationCap,
  Lock,
  PlayCircle,
  CheckCircle2,
  Flame,
  Trophy,
  Award,
  Clock,
} from "lucide-react";

export const Route = createFileRoute("/lms/")({
  head: () => ({ meta: [{ title: "My Learning — Limnn LMS" }] }),
  component: TraineeDashboard,
});

function TraineeDashboard() {
  const foundationDone = TRAINEE_PROGRESS.foundation >= 100;
  const totalModules = MODULES.length;
  const completedModules = Math.round(
    TRACKS.reduce((s, t) => s + (TRAINEE_PROGRESS[t.id] / 100) * modulesForTrack(t.id).length, 0),
  );
  return (
    <HubPage
      title="My Learning"
      description="Progress through your tracks. Complete Foundation to unlock specializations."
      insights={hubInsights("lms")}
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="Modules completed" value={`${completedModules}/${totalModules}`} delta={12} icon={CheckCircle2} />
        <KpiCard label="Active streak" value="14 days" delta={8} icon={Flame} />
        <KpiCard label="Certifications" value="3" icon={Award} />
        <KpiCard label="Leaderboard rank" value="#3" delta={2} icon={Trophy} />
      </div>

      <SectionCard
        title="Your tracks"
        subtitle={foundationDone ? "Foundation complete — all specializations unlocked." : "Finish Foundation to unlock role tracks."}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {TRACKS.map((track) => {
            const unlocked = isTrackUnlocked(track.id);
            const pct = TRAINEE_PROGRESS[track.id] ?? 0;
            const mods = modulesForTrack(track.id);
            const nextModule = mods.find((_, i) => i >= Math.floor((pct / 100) * mods.length)) ?? mods[0];
            return (
              <article
                key={track.id}
                className="rounded-xl border border-border bg-card p-4 relative overflow-hidden"
                style={{
                  borderColor: unlocked
                    ? `color-mix(in oklab, ${track.color} 28%, var(--border))`
                    : undefined,
                }}
              >
                {!unlocked && (
                  <div className="absolute inset-0 bg-card/70 backdrop-blur-[1px] z-10 grid place-items-center">
                    <div className="text-center px-4">
                      <Lock className="h-5 w-5 mx-auto mb-1.5 text-muted-foreground" />
                      <div className="text-sm font-medium">Complete Foundation to unlock</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {track.unlockAfter && TRAINEE_PROGRESS[track.unlockAfter]}% complete
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="h-7 w-7 rounded-md grid place-items-center"
                        style={{
                          background: `color-mix(in oklab, ${track.color} 14%, transparent)`,
                          color: track.color,
                        }}
                      >
                        <GraduationCap className="h-3.5 w-3.5" />
                      </span>
                      <h3 className="font-display font-semibold text-[15px] tracking-tight">{track.name}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground">{track.tagline}</p>
                  </div>
                  <StatusPill level={track.role === "Universal" ? "blue" : "neutral"}>
                    {track.role}
                  </StatusPill>
                </div>
                <div className="flex items-center gap-3 mt-3 text-[11px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {track.estHours}h</span>
                  <span>{mods.length} modules</span>
                  <span className="ml-auto font-mono">{pct}%</span>
                </div>
                <div className="mt-1.5 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: track.color }} />
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-xs">
                    <span className="text-muted-foreground">Up next: </span>
                    <span className="font-medium">{nextModule?.title}</span>
                  </div>
                  <Link
                    to="/lms/module/$id"
                    params={{ id: nextModule.id }}
                    className="h-8 px-3 rounded-md inline-flex items-center gap-1.5 text-xs font-medium text-white"
                    style={{ background: track.color }}
                  >
                    <PlayCircle className="h-3.5 w-3.5" /> Continue
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard title="Quick links">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 text-sm">
          <Link to="/lms/certifications" className="rounded-lg border border-border p-3 hover:bg-accent flex items-center gap-2">
            <Award className="h-4 w-4 text-primary" /> Certifications
          </Link>
          <Link to="/lms/leaderboard" className="rounded-lg border border-border p-3 hover:bg-accent flex items-center gap-2">
            <Trophy className="h-4 w-4 text-primary" /> Leaderboard
          </Link>
          <Link to="/lms/module/$id" params={{ id: "f1" }} className="rounded-lg border border-border p-3 hover:bg-accent flex items-center gap-2">
            <PlayCircle className="h-4 w-4 text-primary" /> Resume Foundation
          </Link>
          <Link to="/lms/module/$id" params={{ id: "a1" }} className="rounded-lg border border-border p-3 hover:bg-accent flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-primary" /> AIO Track
          </Link>
        </div>
      </SectionCard>
    </HubPage>
  );
}
