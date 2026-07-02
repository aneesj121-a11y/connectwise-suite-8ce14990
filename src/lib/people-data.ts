// Mock data for Limnn People hub

export type RiskLevel = "green" | "yellow" | "red";

export type Employee = {
  id: string;
  name: string;
  title: string;
  dept: string;
  location: string;
  status: "Active" | "On Leave" | "Probation" | "Notice";
  manager?: string;
  managerId?: string;
  tenureYears: number;
  flightRisk: number; // 0-100
  riskFactors: string[];
  email: string;
  phone: string;
  startDate: string;
  compensation: number;
};

export const DEPT_COLORS: Record<string, string> = {
  Engineering: "#6366F1",
  Sales: "#2C69CF",
  Marketing: "#EC4899",
  Ops: "#F59E0B",
  Finance: "#10B981",
  HR: "#EF4444",
  Executive: "#7C3AED",
};

export const DEPT_HEADCOUNT: Record<string, number> = {
  Engineering: 82,
  Sales: 64,
  Marketing: 38,
  Ops: 28,
  Finance: 20,
  HR: 15,
};

export const LOCATIONS = ["Sydney", "Singapore", "London", "Remote"];

export const EMPLOYEES: Employee[] = [
  { id: "EMP-001", name: "Anees Jaffri", title: "Chief Executive Officer", dept: "Executive", location: "Sydney", status: "Active", tenureYears: 6.2, flightRisk: 8, riskFactors: [], email: "anees@limnn.com", phone: "+61 400 000 001", startDate: "2020-04-01", compensation: 385000 },
  { id: "EMP-002", name: "Sarah Khan", title: "VP Engineering", dept: "Engineering", location: "Sydney", status: "Active", manager: "Anees Jaffri", managerId: "EMP-001", tenureYears: 4.8, flightRisk: 22, riskFactors: ["Comp below market"], email: "sarah@limnn.com", phone: "+61 400 000 002", startDate: "2021-08-15", compensation: 245000 },
  { id: "EMP-003", name: "Tomoko Ishida", title: "VP Revenue", dept: "Sales", location: "Singapore", status: "Active", manager: "Anees Jaffri", managerId: "EMP-001", tenureYears: 3.4, flightRisk: 14, riskFactors: [], email: "tomoko@limnn.com", phone: "+65 8000 0003", startDate: "2022-11-02", compensation: 230000 },
  { id: "EMP-004", name: "Michael Okonjo", title: "VP Operations", dept: "Ops", location: "London", status: "Active", manager: "Anees Jaffri", managerId: "EMP-001", tenureYears: 5.1, flightRisk: 12, riskFactors: [], email: "michael@limnn.com", phone: "+44 7700 000004", startDate: "2021-01-20", compensation: 215000 },
  { id: "EMP-005", name: "Priya Sharma", title: "Staff Engineer", dept: "Engineering", location: "Remote", status: "Active", manager: "Sarah Khan", managerId: "EMP-002", tenureYears: 3.9, flightRisk: 78, riskFactors: ["Passed for promo", "Comp gap 18%", "Low engagement"], email: "priya@limnn.com", phone: "+91 98000 00005", startDate: "2022-03-14", compensation: 178000 },
  { id: "EMP-006", name: "Ahmed Hassan", title: "Engineering Manager", dept: "Engineering", location: "Sydney", status: "Active", manager: "Sarah Khan", managerId: "EMP-002", tenureYears: 2.6, flightRisk: 31, riskFactors: ["Recent scope change"], email: "ahmed@limnn.com", phone: "+61 400 000 006", startDate: "2023-06-01", compensation: 195000 },
  { id: "EMP-007", name: "Lisa Fernandez", title: "Senior AE", dept: "Sales", location: "Singapore", status: "Active", manager: "Tomoko Ishida", managerId: "EMP-003", tenureYears: 2.1, flightRisk: 24, riskFactors: [], email: "lisa@limnn.com", phone: "+65 8000 0007", startDate: "2024-01-08", compensation: 165000 },
  { id: "EMP-008", name: "Kenji Watanabe", title: "Product Marketing Lead", dept: "Marketing", location: "Sydney", status: "On Leave", manager: "Michael Okonjo", managerId: "EMP-004", tenureYears: 3.2, flightRisk: 18, riskFactors: [], email: "kenji@limnn.com", phone: "+61 400 000 008", startDate: "2023-02-27", compensation: 158000 },
  { id: "EMP-009", name: "Fatima Al-Rashid", title: "Finance Manager", dept: "Finance", location: "London", status: "Active", manager: "Michael Okonjo", managerId: "EMP-004", tenureYears: 4.5, flightRisk: 15, riskFactors: [], email: "fatima@limnn.com", phone: "+44 7700 000009", startDate: "2021-09-10", compensation: 168000 },
  { id: "EMP-010", name: "David Chen", title: "Backend Engineer", dept: "Engineering", location: "Remote", status: "Probation", manager: "Ahmed Hassan", managerId: "EMP-006", tenureYears: 0.3, flightRisk: 42, riskFactors: ["First 90 days"], email: "david@limnn.com", phone: "+1 415 000 0010", startDate: "2026-04-01", compensation: 148000 },
  { id: "EMP-011", name: "Amara Diallo", title: "People Business Partner", dept: "HR", location: "London", status: "Active", manager: "Anees Jaffri", managerId: "EMP-001", tenureYears: 3.7, flightRisk: 11, riskFactors: [], email: "amara@limnn.com", phone: "+44 7700 000011", startDate: "2022-10-04", compensation: 142000 },
  { id: "EMP-012", name: "Raj Patel", title: "Sales Development Rep", dept: "Sales", location: "Sydney", status: "Active", manager: "Lisa Fernandez", managerId: "EMP-007", tenureYears: 0.8, flightRisk: 58, riskFactors: ["Missed quota 2 mo"], email: "raj@limnn.com", phone: "+61 400 000 012", startDate: "2025-09-12", compensation: 92000 },
  { id: "EMP-013", name: "Sarah Khan", title: "Frontend Engineer", dept: "Engineering", location: "Sydney", status: "Active", manager: "Ahmed Hassan", managerId: "EMP-006", tenureYears: 1.4, flightRisk: 19, riskFactors: [], email: "s.khan@limnn.com", phone: "+61 400 000 013", startDate: "2025-01-22", compensation: 138000 },
  { id: "EMP-014", name: "Tomoko Ishida", title: "Content Designer", dept: "Marketing", location: "Remote", status: "Active", manager: "Kenji Watanabe", managerId: "EMP-008", tenureYears: 1.9, flightRisk: 27, riskFactors: [], email: "t.ishida@limnn.com", phone: "+81 90 0000 0014", startDate: "2024-07-15", compensation: 122000 },
  { id: "EMP-015", name: "Michael Okonjo", title: "Ops Analyst", dept: "Ops", location: "London", status: "Active", manager: "Michael Okonjo", managerId: "EMP-004", tenureYears: 2.3, flightRisk: 16, riskFactors: [], email: "m.okonjo@limnn.com", phone: "+44 7700 000015", startDate: "2024-02-08", compensation: 108000 },
];

// Recruiting funnel
export const FUNNEL = [
  { stage: "Applied", count: 342, color: "#94A3B8" },
  { stage: "Screening", count: 128, color: "#2C69CF" },
  { stage: "Interview", count: 46, color: "#F59E0B" },
  { stage: "Offer", count: 11, color: "#6366F1" },
  { stage: "Hired", count: 4, color: "#10B981" },
];

export type Requisition = {
  id: string;
  title: string;
  type: "new" | "backfill";
  dept: string;
  hiringManager: string;
  priority: "P0" | "P1" | "P2";
  status: "Open" | "Screening" | "Interviewing" | "Offer" | "Filled" | "On Hold";
  candidates: number;
  openedDays: number;
};

export const REQUISITIONS: Requisition[] = [
  { id: "REQ-2026-0042", title: "Senior Account Executive", type: "new", dept: "Sales", hiringManager: "Tomoko Ishida", priority: "P0", status: "Interviewing", candidates: 14, openedDays: 41 },
  { id: "REQ-2026-0041", title: "Staff Platform Engineer", type: "new", dept: "Engineering", hiringManager: "Sarah Khan", priority: "P0", status: "Offer", candidates: 22, openedDays: 32 },
  { id: "BF-2026-0018", title: "Backend Engineer (backfill)", type: "backfill", dept: "Engineering", hiringManager: "Ahmed Hassan", priority: "P1", status: "Screening", candidates: 38, openedDays: 12 },
  { id: "REQ-2026-0040", title: "Product Marketing Manager", type: "new", dept: "Marketing", hiringManager: "Kenji Watanabe", priority: "P1", status: "Interviewing", candidates: 9, openedDays: 24 },
  { id: "BF-2026-0017", title: "Finance Analyst (backfill)", type: "backfill", dept: "Finance", hiringManager: "Fatima Al-Rashid", priority: "P2", status: "Open", candidates: 6, openedDays: 8 },
  { id: "REQ-2026-0039", title: "Customer Success Lead — APAC", type: "new", dept: "Ops", hiringManager: "Michael Okonjo", priority: "P1", status: "Interviewing", candidates: 11, openedDays: 28 },
  { id: "REQ-2026-0038", title: "Head of Data", type: "new", dept: "Engineering", hiringManager: "Sarah Khan", priority: "P0", status: "Screening", candidates: 17, openedDays: 19 },
  { id: "REQ-2026-0037", title: "People Ops Coordinator", type: "new", dept: "HR", hiringManager: "Amara Diallo", priority: "P2", status: "Filled", candidates: 42, openedDays: 34 },
];

export type Candidate = {
  id: string;
  name: string;
  reqId: string;
  stage: "Applied" | "Screening" | "Interview" | "Offer" | "Hired" | "Rejected";
  source: "LinkedIn" | "Referral" | "Careers" | "Agency" | "Inbound";
  rating: number;
  matchPct: number;
  daysInStage: number;
  strong?: boolean;
};

export const CANDIDATES: Candidate[] = [
  { id: "CAN-1", name: "Isabella Rossi", reqId: "REQ-2026-0042", stage: "Applied", source: "LinkedIn", rating: 4, matchPct: 88, daysInStage: 2, strong: true },
  { id: "CAN-2", name: "Chen Wei", reqId: "REQ-2026-0042", stage: "Applied", source: "Careers", rating: 3, matchPct: 71, daysInStage: 5 },
  { id: "CAN-3", name: "Olusegun Bello", reqId: "REQ-2026-0042", stage: "Screening", source: "Referral", rating: 5, matchPct: 94, daysInStage: 3, strong: true },
  { id: "CAN-4", name: "Yuki Tanaka", reqId: "REQ-2026-0042", stage: "Screening", source: "LinkedIn", rating: 4, matchPct: 82, daysInStage: 6 },
  { id: "CAN-5", name: "Emma Nordqvist", reqId: "REQ-2026-0042", stage: "Interview", source: "Agency", rating: 4, matchPct: 79, daysInStage: 4 },
  { id: "CAN-6", name: "Diego Alvarez", reqId: "REQ-2026-0042", stage: "Interview", source: "Referral", rating: 5, matchPct: 91, daysInStage: 8, strong: true },
  { id: "CAN-7", name: "Aisha Malik", reqId: "REQ-2026-0042", stage: "Offer", source: "LinkedIn", rating: 5, matchPct: 92, daysInStage: 3 },
  { id: "CAN-8", name: "Henrik Larsen", reqId: "REQ-2026-0042", stage: "Hired", source: "Referral", rating: 5, matchPct: 95, daysInStage: 1 },
  { id: "CAN-9", name: "Jorge Martinez", reqId: "REQ-2026-0042", stage: "Rejected", source: "Careers", rating: 2, matchPct: 44, daysInStage: 12 },
];

export type LeaveRequest = {
  id: string;
  employee: string;
  employeeId: string;
  type: "Annual" | "Sick" | "Personal" | "WFH" | "Parental";
  start: string;
  end: string;
  days: number;
  status: "Pending" | "Approved" | "Rejected";
};

export const LEAVE_REQUESTS: LeaveRequest[] = [
  { id: "L1", employee: "Priya Sharma", employeeId: "EMP-005", type: "Annual", start: "Jul 08", end: "Jul 15", days: 6, status: "Pending" },
  { id: "L2", employee: "Ahmed Hassan", employeeId: "EMP-006", type: "Sick", start: "Jul 03", end: "Jul 04", days: 2, status: "Pending" },
  { id: "L3", employee: "Lisa Fernandez", employeeId: "EMP-007", type: "Personal", start: "Jul 10", end: "Jul 10", days: 1, status: "Pending" },
  { id: "L4", employee: "David Chen", employeeId: "EMP-010", type: "WFH", start: "Jul 07", end: "Jul 11", days: 5, status: "Pending" },
  { id: "L5", employee: "Raj Patel", employeeId: "EMP-012", type: "Annual", start: "Jul 22", end: "Jul 26", days: 5, status: "Pending" },
  { id: "L6", employee: "Amara Diallo", employeeId: "EMP-011", type: "Parental", start: "Aug 04", end: "Nov 04", days: 66, status: "Pending" },
  { id: "L7", employee: "Fatima Al-Rashid", employeeId: "EMP-009", type: "Annual", start: "Jul 15", end: "Jul 19", days: 5, status: "Pending" },
  { id: "L8", employee: "Kenji Watanabe", employeeId: "EMP-008", type: "Sick", start: "Jul 01", end: "Jul 05", days: 5, status: "Pending" },
];

export const PAYROLL_RUNS = [
  { period: "Jun 2026", date: "Jun 25", employees: 247, gross: 1_204_000, net: 987_280, status: "Completed" },
  { period: "May 2026", date: "May 25", employees: 244, gross: 1_186_500, net: 972_100, status: "Completed" },
  { period: "Apr 2026", date: "Apr 25", employees: 240, gross: 1_162_800, net: 953_040, status: "Completed" },
  { period: "Mar 2026", date: "Mar 25", employees: 238, gross: 1_148_200, net: 941_524, status: "Completed" },
  { period: "Feb 2026", date: "Feb 25", employees: 235, gross: 1_128_950, net: 925_699, status: "Completed" },
  { period: "Jan 2026", date: "Jan 25", employees: 232, gross: 1_112_400, net: 912_168, status: "Completed" },
];

export const PAYROLL_TREND = [
  1_012_000, 1_038_000, 1_057_000, 1_072_000, 1_088_000, 1_101_000,
  1_112_400, 1_128_950, 1_148_200, 1_162_800, 1_186_500, 1_204_000,
];

export const SKILLS = ["React", "TypeScript", "Kubernetes", "SQL", "Product", "AI/ML", "Design", "Sales Ops"];

// employee id -> skill -> 0..4
export const SKILL_MATRIX: Record<string, Record<string, number>> = {
  "EMP-005": { React: 4, TypeScript: 4, Kubernetes: 3, SQL: 3, Product: 2, "AI/ML": 3, Design: 1, "Sales Ops": 0 },
  "EMP-006": { React: 3, TypeScript: 4, Kubernetes: 4, SQL: 3, Product: 2, "AI/ML": 2, Design: 1, "Sales Ops": 0 },
  "EMP-010": { React: 2, TypeScript: 3, Kubernetes: 2, SQL: 4, Product: 1, "AI/ML": 2, Design: 0, "Sales Ops": 0 },
  "EMP-013": { React: 4, TypeScript: 3, Kubernetes: 1, SQL: 2, Product: 2, "AI/ML": 1, Design: 3, "Sales Ops": 0 },
  "EMP-007": { React: 0, TypeScript: 0, Kubernetes: 0, SQL: 2, Product: 3, "AI/ML": 1, Design: 1, "Sales Ops": 4 },
  "EMP-012": { React: 0, TypeScript: 0, Kubernetes: 0, SQL: 1, Product: 2, "AI/ML": 0, Design: 1, "Sales Ops": 3 },
  "EMP-008": { React: 1, TypeScript: 1, Kubernetes: 0, SQL: 2, Product: 4, "AI/ML": 2, Design: 3, "Sales Ops": 2 },
};

export const RECOGNITIONS = [
  { id: "R1", giver: "Sarah Khan", receiver: "Priya Sharma", badge: "⭐", badgeName: "Above & Beyond", message: "Priya rewrote the ingestion pipeline in a weekend to unblock the platform team. Legendary.", ts: "2h ago", likes: 24 },
  { id: "R2", giver: "Tomoko Ishida", receiver: "Lisa Fernandez", badge: "🎯", badgeName: "Quota Crusher", message: "Closed Helios Health 3 weeks early — biggest APAC deal of the quarter.", ts: "5h ago", likes: 41 },
  { id: "R3", giver: "Ahmed Hassan", receiver: "David Chen", badge: "🤝", badgeName: "Team Player", message: "David paired with 3 people in his first two weeks. Best onboarding energy I've seen.", ts: "Yesterday", likes: 18 },
  { id: "R4", giver: "Michael Okonjo", receiver: "Fatima Al-Rashid", badge: "💡", badgeName: "Bright Idea", message: "Fatima's new AR aging report cut close time by 40%.", ts: "Yesterday", likes: 12 },
  { id: "R5", giver: "Amara Diallo", receiver: "Raj Patel", badge: "🔥", badgeName: "On Fire", message: "Raj set a new SDR record: 84 qualified meetings in June.", ts: "2d ago", likes: 33 },
  { id: "R6", giver: "Kenji Watanabe", receiver: "Tomoko Ishida (Design)", badge: "⭐", badgeName: "Above & Beyond", message: "Tomoko designed the entire launch site solo in 8 days.", ts: "3d ago", likes: 27 },
];

export const EXPENSES = [
  { id: "EXP-1204", date: "Jun 28", employee: "Lisa Fernandez", category: "Travel", description: "Flight SIN→SYD — Helios QBR", amount: 1284, receipt: true, status: "Pending" },
  { id: "EXP-1203", date: "Jun 28", employee: "Priya Sharma", category: "Software", description: "GitHub Copilot annual", amount: 190, receipt: true, status: "Approved" },
  { id: "EXP-1202", date: "Jun 27", employee: "Raj Patel", category: "Meals", description: "Client dinner — 8 attendees", amount: 892, receipt: true, status: "Flagged", flagged: true, flagReason: "$112/head exceeds meal policy ($60)" },
  { id: "EXP-1201", date: "Jun 27", employee: "Ahmed Hassan", category: "Travel", description: "Hotel — 3 nights Melbourne", amount: 1120, receipt: true, status: "Approved" },
  { id: "EXP-1200", date: "Jun 26", employee: "Kenji Watanabe", category: "Marketing", description: "Booth graphics — SaaStr", amount: 3400, receipt: false, status: "Flagged", flagged: true, flagReason: "Missing receipt over $500 threshold" },
  { id: "EXP-1199", date: "Jun 25", employee: "David Chen", category: "Equipment", description: "Ergonomic chair", amount: 640, receipt: true, status: "Approved" },
  { id: "EXP-1198", date: "Jun 25", employee: "Fatima Al-Rashid", category: "Training", description: "CFA prep course", amount: 1850, receipt: true, status: "Approved" },
  { id: "EXP-1197", date: "Jun 24", employee: "Amara Diallo", category: "Software", description: "Culture Amp seat", amount: 320, receipt: true, status: "Approved" },
];

export const OPENINGS = [
  { id: "O1", title: "Senior Product Manager — AI", dept: "Engineering", location: "Sydney / Remote", posted: "3d ago", match: 91 },
  { id: "O2", title: "Sales Enablement Lead", dept: "Sales", location: "Singapore", posted: "6d ago", match: 78 },
  { id: "O3", title: "Design Systems Engineer", dept: "Engineering", location: "Remote", posted: "1d ago", match: 84 },
  { id: "O4", title: "Revenue Analyst", dept: "Finance", location: "London", posted: "9d ago", match: 62 },
];

export const KEY_ROLES = [
  { role: "VP Engineering", current: "Sarah Khan", risk: "yellow" as RiskLevel, ready1: "Ahmed Hassan", readiness1: "Ready in 1 yr", ready2: "Priya Sharma", readiness2: "Ready in 2 yr" },
  { role: "VP Revenue", current: "Tomoko Ishida", risk: "green" as RiskLevel, ready1: "Lisa Fernandez", readiness1: "Ready in 1 yr", ready2: "—", readiness2: "Gap" },
  { role: "VP Operations", current: "Michael Okonjo", risk: "green" as RiskLevel, ready1: "Fatima Al-Rashid", readiness1: "Ready now", ready2: "—", readiness2: "Gap" },
  { role: "Head of Data", current: "— Vacant —", risk: "red" as RiskLevel, ready1: "Priya Sharma", readiness1: "Ready in 6 mo", ready2: "External", readiness2: "Recruit" },
];
