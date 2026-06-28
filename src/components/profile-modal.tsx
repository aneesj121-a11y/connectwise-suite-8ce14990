import { useEffect, useMemo, useState } from "react";
import { Camera, X, Clock, Phone, Briefcase, Globe, User, Sparkles } from "lucide-react";

const ACCENT = "#2C69CF";

type Availability = "active" | "away" | "dnd";

const TIMEZONES = [
  "America/Los_Angeles",
  "America/Denver",
  "America/Chicago",
  "America/New_York",
  "Europe/London",
  "Europe/Berlin",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney",
];

const DND_PRESETS: { label: string; minutes: number }[] = [
  { label: "30 min", minutes: 30 },
  { label: "1 hour", minutes: 60 },
  { label: "Until tomorrow", minutes: 60 * 16 },
];

type Profile = {
  fullName: string;
  title: string;
  timezone: string;
  workPhone: string;
  status: string;
  availability: Availability;
  dndUntil?: number | null;
  avatarDataUrl?: string | null;
};

const DEFAULTS: Profile = {
  fullName: "Anees Naveed",
  title: "Founder & CEO",
  timezone: "America/Los_Angeles",
  workPhone: "+1 (415) 555-0188",
  status: "In the garage swapping a 2JZ 🔧",
  availability: "active",
  dndUntil: null,
  avatarDataUrl: null,
};

export function ProfileModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [p, setP] = useState<Profile>(DEFAULTS);
  const [saved, setSaved] = useState<Profile>(DEFAULTS);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    if (!open) return;
    const v = localStorage.getItem("limnn:profile");
    if (v) {
      try {
        const parsed = JSON.parse(v) as Profile;
        setP(parsed);
        setSaved(parsed);
      } catch {
        // ignore
      }
    }
  }, [open]);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const localTime = useMemo(() => {
    try {
      return now.toLocaleTimeString([], { timeZone: p.timezone, hour: "numeric", minute: "2-digit" });
    } catch {
      return now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    }
  }, [now, p.timezone]);

  const dndRemaining = useMemo(() => {
    if (p.availability !== "dnd" || !p.dndUntil) return null;
    const ms = p.dndUntil - now.getTime();
    if (ms <= 0) return null;
    const m = Math.floor(ms / 60000);
    const h = Math.floor(m / 60);
    return h > 0 ? `${h}h ${m % 60}m` : `${m}m`;
  }, [p, now]);

  // Auto-expire DND
  useEffect(() => {
    if (p.availability === "dnd" && p.dndUntil && p.dndUntil <= now.getTime()) {
      setP((cur) => ({ ...cur, availability: "active", dndUntil: null }));
    }
  }, [now, p.availability, p.dndUntil]);

  function setAvailability(a: Availability, minutes?: number) {
    setP((cur) => ({ ...cur, availability: a, dndUntil: a === "dnd" && minutes ? Date.now() + minutes * 60000 : null }));
  }

  function onAvatar(file: File) {
    const reader = new FileReader();
    reader.onload = () => setP((cur) => ({ ...cur, avatarDataUrl: reader.result as string }));
    reader.readAsDataURL(file);
  }

  function save() {
    localStorage.setItem("limnn:profile", JSON.stringify(p));
    setSaved(p);
    onClose();
  }

  function cancel() {
    setP(saved);
    onClose();
  }

  if (!open) return null;

  const initials = p.fullName.split(" ").map((s) => s[0]).slice(0, 2).join("");

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center animate-fade-in" style={{ background: "rgba(15,23,42,0.55)", backdropFilter: "blur(6px)" }}>
      <div
        className="w-full max-w-[920px] mx-4 rounded-2xl overflow-hidden grid md:grid-cols-[1.1fr_0.9fr] animate-scale-in"
        style={{ background: "var(--card)", border: "1px solid var(--border)", boxShadow: "0 30px 80px -20px rgba(0,0,0,0.45)" }}
      >
        {/* Left: form */}
        <div className="p-7 min-w-0">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground" style={{ fontFamily: "Poppins, sans-serif" }}>Account</div>
              <h2 className="text-xl font-semibold mt-0.5" style={{ fontFamily: "Poppins, sans-serif" }}>Edit profile</h2>
            </div>
            <button onClick={cancel} className="h-8 w-8 grid place-items-center rounded-md hover:bg-muted text-muted-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-3.5">
            <Field icon={User} label="Full name">
              <input value={p.fullName} onChange={(e) => setP({ ...p, fullName: e.target.value })} className={inputCls} />
            </Field>
            <Field icon={Briefcase} label="Corporate title">
              <input value={p.title} onChange={(e) => setP({ ...p, title: e.target.value })} className={inputCls} placeholder="VP of Revenue" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field icon={Globe} label="Time zone">
                <select value={p.timezone} onChange={(e) => setP({ ...p, timezone: e.target.value })} className={inputCls}>
                  {TIMEZONES.map((tz) => (<option key={tz} value={tz}>{tz.replace("_", " ")}</option>))}
                </select>
              </Field>
              <Field icon={Phone} label="Work phone">
                <input value={p.workPhone} onChange={(e) => setP({ ...p, workPhone: e.target.value })} className={inputCls} />
              </Field>
            </div>
            <Field icon={Sparkles} label="Active status">
              <input
                value={p.status}
                onChange={(e) => setP({ ...p, status: e.target.value })}
                placeholder="In the garage swapping a 2JZ 🔧"
                className={inputCls}
                maxLength={140}
              />
              <div className="text-[10.5px] text-muted-foreground mt-1 flex justify-between">
                <span>Shown next to your name across Limnn.</span>
                <span>{p.status.length}/140</span>
              </div>
            </Field>
          </div>

          <div className="flex items-center justify-end gap-2 mt-7">
            <button onClick={cancel} className="h-9 px-4 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted">
              Cancel
            </button>
            <button
              onClick={save}
              className="h-9 px-4 rounded-md text-sm font-semibold text-white shadow-sm"
              style={{ background: ACCENT }}
            >
              Save profile changes
            </button>
          </div>
        </div>

        {/* Right: identity card */}
        <div className="p-7 flex flex-col gap-5" style={{ background: "linear-gradient(165deg, #1E293B 0%, #22304A 100%)", color: "#fff" }}>
          <div className="flex items-center justify-between">
            <div className="text-[11px] uppercase tracking-[0.16em]" style={{ color: "#94A3B8", fontFamily: "Poppins, sans-serif" }}>Identity</div>
            <div className="inline-flex items-center gap-1.5 text-[11px]" style={{ color: "#94A3B8" }}>
              <Clock className="h-3 w-3" /> Local · {localTime}
            </div>
          </div>

          {/* Avatar */}
          <div className="flex flex-col items-center">
            <label className="relative group cursor-pointer">
              <div
                className="h-32 w-32 rounded-full grid place-items-center text-3xl font-semibold overflow-hidden ring-4 ring-white/10"
                style={{ background: ACCENT, color: "#fff" }}
              >
                {p.avatarDataUrl ? (
                  <img src={p.avatarDataUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  initials
                )}
                <div className="absolute inset-0 rounded-full grid place-items-center opacity-0 group-hover:opacity-100 transition" style={{ background: "rgba(0,0,0,0.45)" }}>
                  <Camera className="h-5 w-5 text-white" />
                </div>
              </div>
              <PresenceRing a={p.availability} />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && onAvatar(e.target.files[0])}
              />
            </label>
            <div className="mt-3 text-center">
              <div className="text-base font-semibold" style={{ fontFamily: "Poppins, sans-serif" }}>{p.fullName || "—"}</div>
              <div className="text-[12px]" style={{ color: "#94A3B8" }}>{p.title || "—"}</div>
              <div className="text-[11.5px] mt-1 max-w-[240px] truncate" style={{ color: "#CBD5E1" }}>“{p.status}”</div>
            </div>
          </div>

          {/* Availability */}
          <div className="rounded-lg p-3" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="text-[10.5px] uppercase tracking-[0.14em] mb-2" style={{ color: "#94A3B8" }}>Availability</div>
            <div className="grid grid-cols-3 gap-1.5">
              <AvailPill label="Active" color="#22C55E" active={p.availability === "active"} onClick={() => setAvailability("active")} />
              <AvailPill label="Away" color="#94A3B8" active={p.availability === "away"} onClick={() => setAvailability("away")} />
              <AvailPill label="Do not disturb" color="#EF4444" active={p.availability === "dnd"} onClick={() => setAvailability("dnd", 60)} />
            </div>
            {p.availability === "dnd" && (
              <div className="mt-2.5">
                <div className="text-[10.5px] mb-1.5" style={{ color: "#94A3B8" }}>
                  Auto-expire {dndRemaining ? `· clears in ${dndRemaining}` : ""}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {DND_PRESETS.map((d) => (
                    <button
                      key={d.label}
                      onClick={() => setAvailability("dnd", d.minutes)}
                      className="text-[11px] px-2 py-1 rounded-md"
                      style={{ background: "rgba(239,68,68,0.18)", color: "#FCA5A5", border: "1px solid rgba(239,68,68,0.3)" }}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ icon: Icon, label, children }: { icon: any; label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground mb-1" style={{ fontFamily: "Poppins, sans-serif" }}>
        <Icon className="h-3 w-3" /> {label}
      </span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full h-9 px-3 rounded-md border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-ring/40";

function AvailPill({ label, color, active, onClick }: { label: string; color: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-md px-2 py-2 text-[11.5px] font-medium transition"
      style={{
        background: active ? `color-mix(in oklab, ${color} 22%, transparent)` : "rgba(255,255,255,0.04)",
        color: active ? "#fff" : "#CBD5E1",
        border: `1px solid ${active ? color : "rgba(255,255,255,0.08)"}`,
      }}
    >
      <span className="inline-flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full" style={{ background: color }} />
        {label}
      </span>
    </button>
  );
}

function PresenceRing({ a }: { a: Availability }) {
  const color = a === "active" ? "#22C55E" : a === "dnd" ? "#EF4444" : "#94A3B8";
  return (
    <span
      className="absolute bottom-1.5 right-1.5 h-5 w-5 rounded-full"
      style={{ background: color, boxShadow: "0 0 0 3px #1E293B" }}
    />
  );
}
