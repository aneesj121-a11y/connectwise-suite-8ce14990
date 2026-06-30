import type { Team } from "./team-context";

// ============================================================
// Marketing
// ============================================================
export type Campaign = {
  id: string;
  name: string;
  channel: "Email" | "LinkedIn" | "Paid Search" | "Webinar" | "Display";
  status: "Running" | "Paused" | "Draft" | "Scheduled";
  audience: string;
  spend: number;
  conv: number;
  aiLift: number;
};

export const CAMPAIGNS: Campaign[] = [
  { id: "c1", name: "Q3 Enterprise Renewal Push", channel: "Email", status: "Running", audience: "Tier-1 accounts · 1.2k", spend: 18400, conv: 12.4, aiLift: 38 },
  { id: "c2", name: "ABM — Surging FinServ", channel: "LinkedIn", status: "Running", audience: "FinServ ICP · 480", spend: 22100, conv: 8.7, aiLift: 52 },
  { id: "c3", name: "Dialer Demo Webinar", channel: "Webinar", status: "Scheduled", audience: "MQLs Q2 · 3.1k", spend: 6200, conv: 0, aiLift: 0 },
  { id: "c4", name: "Branded Search — Compete", channel: "Paid Search", status: "Running", audience: "Intent · global", spend: 34800, conv: 6.1, aiLift: 21 },
  { id: "c5", name: "Mid-market Retargeting", channel: "Display", status: "Paused", audience: "Site visitors 30d", spend: 4900, conv: 2.8, aiLift: 9 },
  { id: "c6", name: "Post-event Nurture — Dreamforce", channel: "Email", status: "Running", audience: "Booth scans · 612", spend: 1800, conv: 18.2, aiLift: 44 },
];

export const INTENT_SIGNALS = [
  { account: "Northwind Bank", topic: "AI dialer", score: 92, change: 24, employees: "5k–10k" },
  { account: "Helios Health", topic: "Call recording compliance", score: 88, change: 18, employees: "2k–5k" },
  { account: "Atlas Robotics", topic: "Outbound sales tooling", score: 81, change: 12, employees: "1k–2k" },
  { account: "Pioneer Mutual", topic: "Conversation intelligence", score: 77, change: 9, employees: "10k+" },
  { account: "Vanta Logistics", topic: "Contact center AI", score: 74, change: -3, employees: "5k–10k" },
];

// ============================================================
// Customer Success
// ============================================================
export type Account = {
  id: string;
  name: string;
  owner: string;
  health: number;
  risk: "green" | "yellow" | "red";
  mrr: number;
  arr: number;
  nrr: number;
  renewal: string;
  lastTouch: string;
};

export const ACCOUNTS: Account[] = [
  { id: "a1", name: "Acme Corporation", owner: "Priya Shah", health: 86, risk: "green", mrr: 18400, arr: 220800, nrr: 118, renewal: "2026-11-04", lastTouch: "2d" },
  { id: "a2", name: "Northwind Bank", owner: "Marcus Lee", health: 62, risk: "yellow", mrr: 42000, arr: 504000, nrr: 102, renewal: "2026-09-12", lastTouch: "11d" },
  { id: "a3", name: "Helios Health", owner: "Priya Shah", health: 41, risk: "red", mrr: 12800, arr: 153600, nrr: 88, renewal: "2026-08-30", lastTouch: "23d" },
  { id: "a4", name: "Atlas Robotics", owner: "Jordan Kim", health: 78, risk: "green", mrr: 9600, arr: 115200, nrr: 124, renewal: "2027-01-18", lastTouch: "4d" },
  { id: "a5", name: "Pioneer Mutual", owner: "Marcus Lee", health: 54, risk: "yellow", mrr: 31200, arr: 374400, nrr: 96, renewal: "2026-10-21", lastTouch: "9d" },
  { id: "a6", name: "Vanta Logistics", owner: "Jordan Kim", health: 33, risk: "red", mrr: 22000, arr: 264000, nrr: 72, renewal: "2026-08-05", lastTouch: "31d" },
  { id: "a7", name: "Bluebird Media", owner: "Priya Shah", health: 91, risk: "green", mrr: 6400, arr: 76800, nrr: 132, renewal: "2027-02-14", lastTouch: "1d" },
];

// ============================================================
// Chat / Support
// ============================================================
export type Ticket = {
  id: string;
  channel: "Email" | "Web" | "WhatsApp" | "Voice" | "SMS" | "Slack";
  customer: string;
  subject: string;
  preview: string;
  sentiment: "pos" | "neu" | "neg";
  priority: "P1" | "P2" | "P3";
  sla: string;
  assignee: string;
  unread: boolean;
};

export const TICKETS: Ticket[] = [
  { id: "t1", channel: "Email", customer: "Helios Health", subject: "Call recording retention", preview: "We need to extend retention to 7y for…", sentiment: "neu", priority: "P2", sla: "3h 12m", assignee: "Mia P.", unread: true },
  { id: "t2", channel: "WhatsApp", customer: "Acme Corp", subject: "Dialer dropping calls EU region", preview: "Started ~30 min ago, multiple reps…", sentiment: "neg", priority: "P1", sla: "22m", assignee: "Unassigned", unread: true },
  { id: "t3", channel: "Web", customer: "Bluebird Media", subject: "How do AI suggested replies work?", preview: "Quick question on the macro feature…", sentiment: "pos", priority: "P3", sla: "1d 4h", assignee: "Alex R.", unread: false },
  { id: "t4", channel: "Voice", customer: "Atlas Robotics", subject: "Voicemail transcription accuracy", preview: "Customer requested follow-up on…", sentiment: "neu", priority: "P2", sla: "6h 02m", assignee: "Jordan K.", unread: false },
  { id: "t5", channel: "Slack", customer: "Vanta Logistics", subject: "Webhook 502 errors", preview: "Seeing 502s from /events endpoint…", sentiment: "neg", priority: "P1", sla: "48m", assignee: "Sam D.", unread: true },
  { id: "t6", channel: "SMS", customer: "Pioneer Mutual", subject: "OTP delivery delays", preview: "Some users are not receiving codes…", sentiment: "neg", priority: "P2", sla: "2h 41m", assignee: "Mia P.", unread: false },
];

// ============================================================
// Grid (sprint board)
// ============================================================
export type SprintTask = {
  id: string;
  title: string;
  status: "todo" | "doing" | "review" | "done";
  priority: "low" | "med" | "high" | "urgent";
  points: number;
  due: string;
  assignees: string[];
  tag: string;
};

export const SPRINT_TASKS: SprintTask[] = [
  { id: "g1", title: "WebRTC fallback for restricted networks", status: "doing", priority: "urgent", points: 8, due: "Jun 30", assignees: ["Mia P.", "Sam D."], tag: "Platform" },
  { id: "g2", title: "AI live coach v2 — objection cards", status: "todo", priority: "high", points: 5, due: "Jul 04", assignees: ["Alex R."], tag: "AI" },
  { id: "g3", title: "Salesforce sync — bidirectional contacts", status: "review", priority: "high", points: 5, due: "Jun 28", assignees: ["Jordan K."], tag: "Integrations" },
  { id: "g4", title: "Quote PDF brand customization", status: "todo", priority: "med", points: 3, due: "Jul 09", assignees: ["Priya S."], tag: "CPQ" },
  { id: "g5", title: "Onboarding checklist module", status: "doing", priority: "med", points: 5, due: "Jul 02", assignees: ["Mia P."], tag: "CS" },
  { id: "g6", title: "Cron: nightly health-score rebuild", status: "done", priority: "low", points: 2, due: "Jun 24", assignees: ["Sam D."], tag: "Data" },
  { id: "g7", title: "Audit log export (SOC2)", status: "review", priority: "high", points: 3, due: "Jun 27", assignees: ["Alex R."], tag: "Security" },
  { id: "g8", title: "Local-number caller ID rotation", status: "todo", priority: "med", points: 5, due: "Jul 11", assignees: ["Jordan K."], tag: "Telephony" },
];

// ============================================================
// Billing
// ============================================================
export type Invoice = {
  id: string;
  number: string;
  account: string;
  amount: number;
  due: string;
  status: "Paid" | "Sent" | "Overdue" | "Draft";
  dpd: number;
  risk: number;
};

export const INVOICES: Invoice[] = [
  { id: "i1", number: "INV-10421", account: "Acme Corporation", amount: 18400, due: "2026-06-30", status: "Sent", dpd: 0, risk: 6 },
  { id: "i2", number: "INV-10418", account: "Helios Health", amount: 12800, due: "2026-06-12", status: "Overdue", dpd: 15, risk: 78 },
  { id: "i3", number: "INV-10415", account: "Vanta Logistics", amount: 22000, due: "2026-05-30", status: "Overdue", dpd: 28, risk: 91 },
  { id: "i4", number: "INV-10410", account: "Bluebird Media", amount: 6400, due: "2026-06-01", status: "Paid", dpd: 0, risk: 4 },
  { id: "i5", number: "INV-10408", account: "Northwind Bank", amount: 42000, due: "2026-07-02", status: "Sent", dpd: 0, risk: 12 },
  { id: "i6", number: "INV-10402", account: "Pioneer Mutual", amount: 31200, due: "2026-06-18", status: "Overdue", dpd: 9, risk: 54 },
  { id: "i7", number: "INV-10398", account: "Atlas Robotics", amount: 9600, due: "2026-07-15", status: "Draft", dpd: 0, risk: 8 },
];

// ============================================================
// Hub-aware Intelligence insights
// ============================================================
export type HubInsight = { title: string; body: string; confidence: number; cta?: string };

export function hubInsights(team: Team): HubInsight[] {
  switch (team) {
    case "sales":
      return [
        { title: "3 deals slipping this week", body: "Acme, Northwind, and Helios have no activity in 5+ days and are past expected close.", confidence: 88, cta: "Open at-risk deals" },
        { title: "Best time to call: 10–11am PT", body: "Connect rate is 38% higher for your accounts in this window vs. afternoon.", confidence: 76, cta: "Schedule batch" },
        { title: "Quota pacing: on track", body: "You're 64% to quota with 22 days left in quarter — projected attainment 108%.", confidence: 82 },
      ];
    case "marketing":
      return [
        { title: "Surge: AI dialer intent", body: "12 ICP accounts spiked on 'AI dialer' keywords in last 7d. Recommend ABM sequence.", confidence: 91, cta: "Build sequence" },
        { title: "Webinar audience overlap 38%", body: "Q3 Renewal Push and Dreamforce Nurture share 38% of recipients. Suppression suggested.", confidence: 84, cta: "Suppress overlap" },
        { title: "Channel ROI shift", body: "LinkedIn ABM ROI up 22% MoM, paid search down 8%. Rebalance $12k recommended.", confidence: 73 },
      ];
    case "cs":
      return [
        { title: "2 accounts crossed red", body: "Helios Health and Vanta Logistics dropped below 50 health this week. Combined ARR $417k.", confidence: 93, cta: "Open accounts" },
        { title: "Expansion signal: Acme", body: "Acme's usage jumped 41% on Outbound Pro features — strong upsell signal.", confidence: 87, cta: "Draft upsell" },
        { title: "QBR overdue: Pioneer Mutual", body: "Last QBR was 142 days ago. Auto-draft a QBR deck from the past quarter's data?", confidence: 80, cta: "Draft QBR" },
      ];
    case "support":
    case "chat":
      return [
        { title: "EU dial-out incident likely", body: "5 P1 tickets in 30 min mention EU dropped calls. Pattern suggests carrier issue.", confidence: 95, cta: "Open incident" },
        { title: "Deflectable: 12 in queue", body: "12 open tickets match KB articles with >90% confidence. Auto-reply candidates.", confidence: 89, cta: "Review drafts" },
        { title: "SLA risk: 3 tickets", body: "3 P2 tickets will breach SLA in <60 min. Reassign to on-call?", confidence: 91, cta: "Reassign" },
      ];
    case "grid":
      return [
        { title: "Sprint at risk", body: "Current sprint forecast: 78% completion. WebRTC fallback is blocking 2 downstream tasks.", confidence: 84, cta: "Open blocker" },
        { title: "Suggested automation", body: "Auto-create CS handoff task when a deal moves to Closed Won.", confidence: 78, cta: "Enable" },
        { title: "Capacity overload: Mia P.", body: "Mia is at 142% capacity this sprint. Reassign 5 points?", confidence: 86 },
      ];
    case "billing":
      return [
        { title: "Collections risk: $53k", body: "Vanta and Helios invoices show >75% default risk. Suggest dunning sequence + outbound call.", confidence: 92, cta: "Start dunning" },
        { title: "DSO trending up", body: "DSO increased from 38 to 44 days in last quarter. Top driver: mid-market segment.", confidence: 81 },
        { title: "Forecast: Q4 ARR $4.2M", body: "Model projects Q4 ARR within ±4% based on current pipeline + churn rates.", confidence: 86, cta: "View forecast" },
      ];
    case "lms":
      return [
        { title: "Foundation completion lag", body: "18% of new hires haven't finished Foundation in week 2. Send nudges?", confidence: 89, cta: "Nudge cohort" },
        { title: "Quiz outlier", body: "Module 'Discovery Calls' has a 41% first-attempt fail rate — likely a question quality issue.", confidence: 84, cta: "Review questions" },
        { title: "Top performer signal", body: "3 trainees ranked top 5% this week. Recommend fast-tracking to Growth Expert.", confidence: 81, cta: "View shortlist" },
      ];
  }
}
