// ============================================================
// Limnn LMS — extra mock data (Teams, Assignments, Compliance,
// Roleplay scenarios, Skill-gap matrix)
// ============================================================
import type { TrackId } from "./lms-data";

export type TeamId = "sales" | "cs" | "support" | "marketing" | "product";

export type TeamStat = {
  id: TeamId;
  name: string;
  manager: string;
  members: number;
  avgCompletion: number;     // %
  certifiedPct: number;      // % of team with active cert in primary track
  avgQuizScore: number;      // 0-100
  hoursThisMonth: number;
  atRisk: number;            // members flagged for retraining
  trendingTrack: TrackId;
  color: string;
  spark: number[];
};

export const TEAM_STATS: TeamStat[] = [
  { id: "sales",     name: "Sales — Outbound", manager: "Naveed Khan",  members: 24, avgCompletion: 82, certifiedPct: 71, avgQuizScore: 87, hoursThisMonth: 612, atRisk: 3, trendingTrack: "growth",       color: "#2C69CF", spark: [40,55,52,68,70,74,82] },
  { id: "cs",        name: "Customer Success", manager: "Priya Nair",   members: 14, avgCompletion: 91, certifiedPct: 86, avgQuizScore: 90, hoursThisMonth: 388, atRisk: 1, trendingTrack: "foundation",   color: "#EF4444", spark: [60,62,70,74,80,86,91] },
  { id: "support",   name: "Support Ops",      manager: "Sara Lin",     members: 19, avgCompletion: 76, certifiedPct: 63, avgQuizScore: 82, hoursThisMonth: 504, atRisk: 5, trendingTrack: "support-ops",  color: "#F59E0B", spark: [55,58,60,62,66,72,76] },
  { id: "marketing", name: "Marketing",        manager: "Tomás Vega",   members: 9,  avgCompletion: 68, certifiedPct: 55, avgQuizScore: 79, hoursThisMonth: 188, atRisk: 2, trendingTrack: "foundation",   color: "#10B981", spark: [42,45,48,52,58,62,68] },
  { id: "product",   name: "Product & Eng",    manager: "Anees Naveed", members: 22, avgCompletion: 88, certifiedPct: 80, avgQuizScore: 91, hoursThisMonth: 410, atRisk: 1, trendingTrack: "aio",          color: "#7C3AED", spark: [70,72,75,78,82,86,88] },
];

// ------------------------------------------------------------
// Assignments / Learning Paths
// ------------------------------------------------------------
export type Assignment = {
  id: string;
  title: string;
  trackId: TrackId;
  audience: "All hires" | "Sales" | "Support" | "CS" | "Marketing";
  required: boolean;
  dueIn: string;          // human label
  dueDate: string;        // ISO
  status: "Not started" | "In progress" | "Complete" | "Overdue";
  completionPct: number;
  reason: string;         // why it was assigned
};

export const ASSIGNMENTS: Assignment[] = [
  { id: "as1", title: "SOC2 Annual Refresher",          trackId: "foundation",  audience: "All hires", required: true,  dueIn: "in 4 days",  dueDate: "2026-07-04", status: "In progress", completionPct: 62, reason: "Annual compliance — mandatory" },
  { id: "as2", title: "Q3 Discovery Mastery",           trackId: "aio",         audience: "Sales",     required: true,  dueIn: "in 11 days", dueDate: "2026-07-11", status: "In progress", completionPct: 28, reason: "Manager-assigned: Q3 sales kickoff" },
  { id: "as3", title: "P1 Incident Response Drill",     trackId: "support-ops", audience: "Support",   required: true,  dueIn: "overdue",    dueDate: "2026-06-25", status: "Overdue",     completionPct: 0,  reason: "Triggered by missed SLA in May" },
  { id: "as4", title: "New AIO Module — Live Coaching", trackId: "aio",         audience: "Sales",     required: false, dueIn: "in 21 days", dueDate: "2026-07-21", status: "Not started", completionPct: 0,  reason: "Recommended by Limnn AI based on call QA" },
  { id: "as5", title: "Renewals Playbook",              trackId: "growth",      audience: "CS",        required: true,  dueIn: "complete",   dueDate: "2026-06-18", status: "Complete",    completionPct: 100, reason: "Quarterly CS enablement" },
];

// ------------------------------------------------------------
// Compliance & Audit
// ------------------------------------------------------------
export type ComplianceItem = {
  id: string;
  framework: "SOC2" | "GDPR" | "HIPAA" | "PCI-DSS" | "Internal";
  course: string;
  audience: string;
  coverage: number;     // % of required population certified
  expiringIn: number;   // days until next certificates expire (min)
  lastAudit: string;
  status: "Compliant" | "At Risk" | "Action Required";
};

export const COMPLIANCE: ComplianceItem[] = [
  { id: "co1", framework: "SOC2",     course: "Security, Compliance & Data Handling", audience: "All employees",           coverage: 96, expiringIn: 42, lastAudit: "2026-05-12", status: "Compliant" },
  { id: "co2", framework: "GDPR",     course: "Data Subject Rights & Residency",      audience: "EU-facing roles (84)",    coverage: 88, expiringIn: 18, lastAudit: "2026-04-20", status: "At Risk" },
  { id: "co3", framework: "HIPAA",    course: "PHI Handling Basics",                  audience: "Support tier-2 (12)",     coverage: 100, expiringIn: 120, lastAudit: "2026-06-01", status: "Compliant" },
  { id: "co4", framework: "PCI-DSS",  course: "Cardholder Data Awareness",            audience: "Billing & Finance (14)",  coverage: 71, expiringIn: 9,  lastAudit: "2026-03-30", status: "Action Required" },
  { id: "co5", framework: "Internal", course: "Limnn Code of Conduct",                audience: "All employees",           coverage: 99, expiringIn: 200, lastAudit: "2026-06-10", status: "Compliant" },
];

export type AuditEvent = {
  id: string;
  at: string;
  actor: string;
  action: string;
  target: string;
};

export const AUDIT_LOG: AuditEvent[] = [
  { id: "au1", at: "2026-06-29 14:22", actor: "Naveed Khan",    action: "Issued certificate",         target: "Diego Ramos · Foundation" },
  { id: "au2", at: "2026-06-29 11:08", actor: "System",          action: "Reset quiz attempts",        target: "Sara Lin · Module s2 (policy)" },
  { id: "au3", at: "2026-06-28 17:45", actor: "Priya Nair",     action: "Approved practical",         target: "Tomás Vega · Growth Capstone" },
  { id: "au4", at: "2026-06-28 09:30", actor: "Limnn AI",       action: "Flagged retraining",         target: "Cohort Q1-26 · Discovery Calls" },
  { id: "au5", at: "2026-06-27 16:11", actor: "Anees Naveed",   action: "Updated passing threshold",  target: "Module f3 · 90% → 95%" },
  { id: "au6", at: "2026-06-27 10:02", actor: "System",          action: "Auto-expired certificate",   target: "3 trainees · Growth Expert" },
];

// ------------------------------------------------------------
// AI Roleplay scenarios
// ------------------------------------------------------------
export type Roleplay = {
  id: string;
  title: string;
  persona: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  durationMin: number;
  skills: string[];
  scenario: string;
  bestScore?: number;
  attempts: number;
};

export const ROLEPLAYS: Roleplay[] = [
  { id: "rp1", title: "Cold discovery with skeptical CIO", persona: "CIO at 800-person SaaS, burned by 3 vendors", difficulty: "Advanced",     durationMin: 12, skills: ["Discovery", "Objection handling"], scenario: "First call. They've blocked 12 minutes. Surface pain and earn the next meeting.", bestScore: 84, attempts: 3 },
  { id: "rp2", title: "Pricing pushback — mid-market",     persona: "VP Ops, evaluating 2 vendors",              difficulty: "Intermediate", durationMin: 10, skills: ["Pricing", "Value framing"],         scenario: "Prospect says you're 30% above competitor. Hold price, anchor value, advance.",   bestScore: 76, attempts: 5 },
  { id: "rp3", title: "P1 escalation de-escalation",       persona: "Angry enterprise customer in outage",        difficulty: "Advanced",     durationMin: 8,  skills: ["Empathy", "SLA discipline"],         scenario: "Acknowledge, take ownership, give realistic timeline. Avoid commitments you can't keep.", attempts: 1 },
  { id: "rp4", title: "Renewal — no exec sponsor",         persona: "Mid-mgr champion lost their VP",             difficulty: "Intermediate", durationMin: 12, skills: ["Renewals", "Multi-thread"],          scenario: "Rebuild executive sponsorship before renewal in 45 days.", attempts: 2 },
  { id: "rp5", title: "Demo a CPQ workflow live",          persona: "Trainer evaluating product fluency",         difficulty: "Beginner",     durationMin: 6,  skills: ["Product", "Storytelling"],           scenario: "3-minute live demo of approval flow without slides.", bestScore: 91, attempts: 4 },
];

// ------------------------------------------------------------
// Skill-gap matrix (team × competency)
// ------------------------------------------------------------
export const SKILLS = ["Product", "Discovery", "Objection Handling", "Pricing", "Compliance", "AI Co-pilot", "Escalation"] as const;
export type Skill = typeof SKILLS[number];

export const SKILL_MATRIX: Record<TeamId, Record<Skill, number>> = {
  sales:     { Product: 86, Discovery: 78, "Objection Handling": 72, Pricing: 81, Compliance: 90, "AI Co-pilot": 88, Escalation: 64 },
  cs:        { Product: 92, Discovery: 70, "Objection Handling": 65, Pricing: 60, Compliance: 94, "AI Co-pilot": 76, Escalation: 88 },
  support:   { Product: 88, Discovery: 55, "Objection Handling": 58, Pricing: 40, Compliance: 96, "AI Co-pilot": 70, Escalation: 92 },
  marketing: { Product: 78, Discovery: 50, "Objection Handling": 42, Pricing: 55, Compliance: 82, "AI Co-pilot": 80, Escalation: 38 },
  product:   { Product: 96, Discovery: 60, "Objection Handling": 50, Pricing: 50, Compliance: 88, "AI Co-pilot": 92, Escalation: 70 },
};

export function heatColor(v: number) {
  if (v >= 85) return "color-mix(in oklab, var(--success) 28%, transparent)";
  if (v >= 70) return "color-mix(in oklab, var(--success) 14%, transparent)";
  if (v >= 55) return "color-mix(in oklab, var(--warning) 22%, transparent)";
  return "color-mix(in oklab, var(--destructive) 22%, transparent)";
}
