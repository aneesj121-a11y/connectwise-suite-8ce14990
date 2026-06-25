import { useState } from "react";
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Pause,
  Play,
  Grid3x3,
  X,
  Delete,
  PhoneForwarded,
  Users,
  Volume2,
} from "lucide-react";
import { useTeam, TEAMS } from "@/lib/team-context";
import { Link } from "@tanstack/react-router";

export function DialerWidget() {
  const { team, inCall, setInCall } = useTeam();
  const t = TEAMS[team];
  const [open, setOpen] = useState(false);
  const [number, setNumber] = useState("");
  const [muted, setMuted] = useState(false);
  const [held, setHeld] = useState(false);

  const press = (d: string) => setNumber((n) => (n + d).slice(0, 18));
  const back = () => setNumber((n) => n.slice(0, -1));

  return (
    <>
      {/* FAB */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-40 h-14 pl-4 pr-5 rounded-full shadow-xl text-primary-foreground inline-flex items-center gap-2.5 hover:scale-[1.02] transition"
          style={{ background: "var(--ink)" }}
        >
          <span
            className="h-8 w-8 rounded-full grid place-items-center"
            style={{ background: t.accentVar }}
          >
            <Phone className="h-4 w-4" />
          </span>
          <span className="text-sm font-medium">Dialer</span>
          {inCall && (
            <span className="ml-1 text-[10px] uppercase tracking-wider opacity-80">· in call</span>
          )}
        </button>
      )}

      {/* Panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-40 w-[340px] rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
          <div
            className="px-4 py-3 flex items-center justify-between text-primary-foreground"
            style={{ background: "var(--ink)" }}
          >
            <div className="flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: inCall ? "var(--success)" : t.accentVar }}
              />
              <div className="text-sm font-medium">
                {inCall ? "On call · 02:14" : t.label + " dialer"}
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="opacity-70 hover:opacity-100">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="p-4">
            <input
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full text-2xl font-mono tracking-wide text-center bg-transparent focus:outline-none placeholder:text-muted-foreground/50 py-2"
            />
            <div className="text-center text-xs text-muted-foreground -mt-1">
              {number ? "Unknown · will create contact" : "Type or paste a number"}
            </div>

            <div className="grid grid-cols-3 gap-1.5 mt-4">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map((d) => (
                <button
                  key={d}
                  onClick={() => press(d)}
                  className="h-12 rounded-lg border border-border hover:bg-accent text-lg font-medium font-mono transition"
                >
                  {d}
                </button>
              ))}
            </div>

            {!inCall ? (
              <div className="flex items-center gap-2 mt-4">
                <button
                  onClick={back}
                  className="h-11 w-11 rounded-lg border border-border grid place-items-center hover:bg-accent"
                >
                  <Delete className="h-4 w-4" />
                </button>
                <Link
                  to="/call"
                  onClick={() => setInCall(true)}
                  className="flex-1 h-11 rounded-lg text-primary-foreground inline-flex items-center justify-center gap-2 font-medium"
                  style={{ background: "var(--success)" }}
                >
                  <Phone className="h-4 w-4" /> Call
                </Link>
                <button className="h-11 w-11 rounded-lg border border-border grid place-items-center hover:bg-accent">
                  <Grid3x3 className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="mt-4 space-y-2">
                <div className="grid grid-cols-4 gap-2">
                  <ToggleBtn active={muted} onClick={() => setMuted(!muted)} icon={muted ? MicOff : Mic} label="Mute" />
                  <ToggleBtn active={held} onClick={() => setHeld(!held)} icon={held ? Play : Pause} label="Hold" />
                  <ToggleBtn icon={PhoneForwarded} label="Xfer" />
                  <ToggleBtn icon={Users} label="Conf" />
                </div>
                <button
                  onClick={() => {
                    setInCall(false);
                    setNumber("");
                  }}
                  className="w-full h-11 rounded-lg text-primary-foreground inline-flex items-center justify-center gap-2 font-medium"
                  style={{ background: "var(--destructive)" }}
                >
                  <PhoneOff className="h-4 w-4" /> End call
                </button>
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Volume2 className="h-3 w-3" /> MacBook Pro Mic
              </span>
              <span>Caller ID: +1 (415) 555-0114</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ToggleBtn({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: typeof Mic;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "h-14 rounded-lg border flex flex-col items-center justify-center gap-1 text-[10px] uppercase tracking-wider transition",
        active
          ? "bg-foreground text-background border-foreground"
          : "border-border text-muted-foreground hover:text-foreground hover:bg-accent",
      ].join(" ")}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}
