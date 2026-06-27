import { type ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight, Sparkles, X, Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ============================================================
// Status pill
// ============================================================
export type RiskLevel = "green" | "yellow" | "red" | "neutral" | "blue";

const PILL_STYLES: Record<RiskLevel, { bg: string; fg: string; dot: string }> = {
  green: { bg: "color-mix(in oklab, var(--success) 14%, transparent)", fg: "var(--success)", dot: "var(--success)" },
  yellow: { bg: "color-mix(in oklab, var(--warning) 18%, transparent)", fg: "oklch(0.45 0.12 60)", dot: "var(--warning)" },
  red: { bg: "color-mix(in oklab, var(--destructive) 14%, transparent)", fg: "var(--destructive)", dot: "var(--destructive)" },
  blue: { bg: "color-mix(in oklab, var(--primary) 14%, transparent)", fg: "var(--primary)", dot: "var(--primary)" },
  neutral: { bg: "var(--muted)", fg: "var(--muted-foreground)", dot: "var(--muted-foreground)" },
};

export function StatusPill({ level, children }: { level: RiskLevel; children: ReactNode }) {
  const s = PILL_STYLES[level];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium"
      style={{ background: s.bg, color: s.fg }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.dot }} />
      {children}
    </span>
  );
}

// ============================================================
// Risk / AI confidence badge
// ============================================================
export function RiskBadge({ confidence, label = "AI" }: { confidence: number; label?: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-mono"
      style={{
        background: "color-mix(in oklab, var(--primary) 10%, transparent)",
        color: "var(--primary)",
      }}
    >
      <Sparkles className="h-2.5 w-2.5" /> {label} {confidence}%
    </span>
  );
}

// ============================================================
// Inline sparkline
// ============================================================
export function TrendSpark({
  values,
  color = "var(--primary)",
  width = 80,
  height = 24,
}: {
  values: number[];
  color?: string;
  width?: number;
  height?: number;
}) {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const pts = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * width;
      const y = height - ((v - min) / range) * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline points={pts} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ============================================================
// KPI card
// ============================================================
export function KpiCard({
  label,
  value,
  delta,
  spark,
  icon: Icon,
}: {
  label: string;
  value: string;
  delta?: number;
  spark?: number[];
  icon?: LucideIcon;
}) {
  const positive = (delta ?? 0) >= 0;
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          {Icon && <Icon className="h-3.5 w-3.5" />}
          {label}
        </span>
        {spark && <TrendSpark values={spark} />}
      </div>
      <div className="mt-1.5 flex items-baseline gap-2">
        <div className="text-2xl font-display font-semibold tracking-tight">{value}</div>
        {delta !== undefined && (
          <span
            className="inline-flex items-center gap-0.5 text-[11px] font-medium"
            style={{ color: positive ? "var(--success)" : "var(--destructive)" }}
          >
            {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(delta)}%
          </span>
        )}
      </div>
    </div>
  );
}

// ============================================================
// Section card wrapper
// ============================================================
export function SectionCard({
  title,
  subtitle,
  action,
  children,
  className = "",
}: {
  title?: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-xl border border-border bg-card ${className}`}>
      {(title || action) && (
        <header className="flex items-center justify-between gap-3 px-5 pt-4 pb-3 border-b border-border">
          <div>
            {title && <h3 className="font-display text-[15px] font-semibold tracking-tight">{title}</h3>}
            {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

// ============================================================
// AI Insight Card
// ============================================================
export function AiInsightCard({
  title,
  body,
  cta,
  confidence,
}: {
  title: string;
  body: string;
  cta?: string;
  confidence?: number;
}) {
  return (
    <div
      className="rounded-lg border p-3 text-sm"
      style={{
        background: "color-mix(in oklab, var(--primary) 5%, var(--card))",
        borderColor: "color-mix(in oklab, var(--primary) 25%, var(--border))",
      }}
    >
      <div className="flex items-start gap-2">
        <Sparkles className="h-3.5 w-3.5 mt-0.5 shrink-0" style={{ color: "var(--primary)" }} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-foreground">{title}</span>
            {confidence !== undefined && <RiskBadge confidence={confidence} />}
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{body}</p>
          {cta && (
            <div className="mt-2 flex gap-1.5">
              <button
                className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-primary-foreground"
                style={{ background: "var(--primary)" }}
              >
                <Check className="h-3 w-3" /> {cta}
              </button>
              <button className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-muted-foreground hover:bg-muted">
                <X className="h-3 w-3" /> Dismiss
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Filter bar
// ============================================================
export function FilterBar({
  chips,
  active,
  onSelect,
  right,
}: {
  chips: string[];
  active?: string;
  onSelect?: (c: string) => void;
  right?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 mb-3">
      <div className="flex flex-wrap gap-1.5">
        {chips.map((c) => {
          const isActive = c === active;
          return (
            <button
              key={c}
              onClick={() => onSelect?.(c)}
              className="text-[11px] font-medium px-2.5 py-1 rounded-full border transition"
              style={{
                background: isActive ? "var(--primary)" : "var(--card)",
                color: isActive ? "var(--primary-foreground)" : "var(--muted-foreground)",
                borderColor: isActive ? "var(--primary)" : "var(--border)",
              }}
            >
              {c}
            </button>
          );
        })}
      </div>
      {right}
    </div>
  );
}

// ============================================================
// Page header
// ============================================================
export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 mb-5">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

// ============================================================
// Avatar
// ============================================================
export function Avatar({ name, size = 22 }: { name: string; size?: number }) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const hash = [...name].reduce((a, c) => a + c.charCodeAt(0), 0);
  const hue = hash % 360;
  return (
    <span
      className="inline-flex items-center justify-center rounded-full font-medium text-[10px] text-white shrink-0"
      style={{
        width: size,
        height: size,
        background: `oklch(0.55 0.12 ${hue})`,
      }}
    >
      {initials}
    </span>
  );
}
