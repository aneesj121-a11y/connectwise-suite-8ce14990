import { createContext, useContext, useState, type ReactNode } from "react";

export type Team = "sales" | "support" | "cs";

export const TEAMS: Record<
  Team,
  { id: Team; label: string; tagline: string; accentVar: string; accentClass: string }
> = {
  sales: {
    id: "sales",
    label: "Sales",
    tagline: "Outbound cadences & pipeline",
    accentVar: "var(--sales)",
    accentClass: "text-[color:var(--sales)]",
  },
  support: {
    id: "support",
    label: "Support",
    tagline: "Inbound queue & tickets",
    accentVar: "var(--support)",
    accentClass: "text-[color:var(--support)]",
  },
  cs: {
    id: "cs",
    label: "Customer Success",
    tagline: "Renewals & account health",
    accentVar: "var(--cs)",
    accentClass: "text-[color:var(--cs)]",
  },
};

type Ctx = {
  team: Team;
  setTeam: (t: Team) => void;
  inCall: boolean;
  setInCall: (v: boolean) => void;
};

const TeamCtx = createContext<Ctx | null>(null);

export function TeamProvider({ children }: { children: ReactNode }) {
  const [team, setTeam] = useState<Team>("sales");
  const [inCall, setInCall] = useState(false);
  return (
    <TeamCtx.Provider value={{ team, setTeam, inCall, setInCall }}>{children}</TeamCtx.Provider>
  );
}

export function useTeam() {
  const ctx = useContext(TeamCtx);
  if (!ctx) throw new Error("useTeam must be inside TeamProvider");
  return ctx;
}
