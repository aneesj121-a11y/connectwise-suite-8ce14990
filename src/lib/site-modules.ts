import {
  MessageSquareText,
  Sparkles,
  Phone,
  Target,
  Megaphone,
  HeartHandshake,
  LifeBuoy,
  FileText,
  Wallet,
  LayoutGrid,
  GraduationCap,
  Users,
  type LucideIcon,
} from "lucide-react";

export type SiteModule = {
  id: string;
  name: string;
  short: string;
  tagline: string;
  Icon: LucideIcon;
  replaces: string[];
  color: string;
  bullets: string[];
  /** Big headline features rendered as animated cards on the module page */
  features: { title: string; body: string }[];
  /** 3-step "how it works" mini workflow */
  workflow: { step: string; title: string; body: string }[];
  /** Fake KPIs shown in the animated hero mock UI */
  mockKpis: { label: string; value: string; delta?: string }[];
  /** Rows shown in the animated "list" preview */
  mockRows: { primary: string; secondary: string; tag: string }[];
  route: string;
};

export const SITE_MODULES: SiteModule[] = [
  {
    id: "threads",
    name: "Limnn Threads",
    short: "Threads",
    tagline: "Team messaging where work actually gets done.",
    Icon: MessageSquareText,
    replaces: ["Slack", "Microsoft Teams", "Discord"],
    color: "#7C3AED",
    bullets: ["Channels, DMs, huddles", "Deal & ticket threads inline", "AI recap for every channel"],
    features: [
      { title: "Threads inside every record", body: "Every deal, ticket and doc has its own live thread — no more cross-linking Slack." },
      { title: "AI recaps on demand", body: "Miss a day? Ask Threads for a 5-bullet recap of any channel or DM." },
      { title: "Huddles that transcribe themselves", body: "One-click voice rooms that auto-summarize and file action items." },
    ],
    workflow: [
      { step: "01", title: "Discuss in context", body: "Open a thread from a deal, ticket or task — never lose the reference." },
      { step: "02", title: "Decide with AI recap", body: "Summarize 200 messages into 5 bullets and the 3 decisions made." },
      { step: "03", title: "Turn talk into action", body: "Convert any message into a task, ticket or CRM note in one click." },
    ],
    mockKpis: [
      { label: "Active channels", value: "128", delta: "+12" },
      { label: "Unread threads", value: "6" },
      { label: "AI recaps today", value: "24" },
    ],
    mockRows: [
      { primary: "#deal-acme-renewal", secondary: "Priya · replied 2m ago", tag: "12 new" },
      { primary: "#eng-platform", secondary: "David · voice huddle live", tag: "LIVE" },
      { primary: "#cs-onboarding", secondary: "Fatima · AI recap ready", tag: "AI" },
      { primary: "#gtm-launch-q3", secondary: "Michael · pinned decision", tag: "PIN" },
    ],
    route: "/",
  },
  {
    id: "intelligence",
    name: "Limnn Intelligence",
    short: "Intelligence",
    tagline: "The AI copilot that lives across every workflow.",
    Icon: Sparkles,
    replaces: ["Gong", "ChatGPT Enterprise", "Clari Copilot"],
    color: "#2C69CF",
    bullets: ["Grounded on your data", "Auto-notes, drafts, forecasts", "Per-role guardrails"],
    features: [
      { title: "Grounded on your data", body: "Every answer cites the record, message or doc it came from — no hallucinations." },
      { title: "Runs across every module", body: "Ask about a deal, a ticket, a payroll run or a course — one copilot, all context." },
      { title: "Governance built in", body: "PII redaction, role-scoped memory, and full audit trail on every prompt." },
    ],
    workflow: [
      { step: "01", title: "Ask anything", body: "Natural language across CRM, support, finance, HR — one bar, one brain." },
      { step: "02", title: "See the reasoning", body: "Every answer expands to show sources, confidence and next-best action." },
      { step: "03", title: "Act in-place", body: "Draft the email, update the forecast, book the meeting — from the same panel." },
    ],
    mockKpis: [
      { label: "Prompts today", value: "1,284", delta: "+38%" },
      { label: "Time saved", value: "42h" },
      { label: "Confidence avg.", value: "94%" },
    ],
    mockRows: [
      { primary: "Summarize Acme's last 3 calls", secondary: "3 sources · 92% conf.", tag: "CALL" },
      { primary: "Forecast Q3 for EMEA", secondary: "12 sources · 89% conf.", tag: "FCAST" },
      { primary: "Draft renewal email — Globex", secondary: "5 sources · 96% conf.", tag: "DRAFT" },
      { primary: "Why is CSAT down in APAC?", secondary: "27 sources · 88% conf.", tag: "ASK" },
    ],
    route: "/",
  },
  {
    id: "dialer",
    name: "Limnn Dialer",
    short: "Dialer",
    tagline: "AI-native voice for sales and support.",
    Icon: Phone,
    replaces: ["Aircall", "Dialpad", "Five9", "RingCentral"],
    color: "#0EA5E9",
    bullets: ["Global carrier network", "Live coach & objection cards", "Recording, transcription, QA"],
    features: [
      { title: "Global carrier, local numbers", body: "Buy numbers in 90+ countries. SIP, PSTN and WebRTC on one stack." },
      { title: "Live coach on every call", body: "Real-time transcription with objection cards, next-question hints and battlecards." },
      { title: "Automatic QA", body: "AI scores every call against your rubric — no more sampling 2%." },
    ],
    workflow: [
      { step: "01", title: "Dial from the record", body: "One-click call from any CRM, ticket or task. Screen-pop context in 300ms." },
      { step: "02", title: "Coach in real time", body: "Live transcript, objection prompts and competitor mentions surface as they happen." },
      { step: "03", title: "Wrap in seconds", body: "AI-drafted call notes, next steps and CRM updates ready before you hang up." },
    ],
    mockKpis: [
      { label: "Calls today", value: "412", delta: "+6%" },
      { label: "Connect rate", value: "34%" },
      { label: "Avg. talk", value: "6:12" },
    ],
    mockRows: [
      { primary: "Acme — Renewal check-in", secondary: "12:04 · positive · 3 next steps", tag: "★" },
      { primary: "Globex — Discovery", secondary: "18:22 · pricing objection", tag: "!" },
      { primary: "Initech — Support", secondary: "04:41 · resolved · CSAT 5", tag: "✓" },
      { primary: "Umbrella — Demo booked", secondary: "22:03 · warm handoff", tag: "→" },
    ],
    route: "/call",
  },
  {
    id: "sales",
    name: "Limnn Sales",
    short: "Sales",
    tagline: "CRM without the seat tax and consultants.",
    Icon: Target,
    replaces: ["Salesforce Sales Cloud", "HubSpot Sales", "Pipedrive"],
    color: "#DC2626",
    bullets: ["Opportunities, pipeline, forecast", "Playbooks & sequences", "Attribution end-to-end"],
    features: [
      { title: "Pipeline that stays clean", body: "AI keeps stages, next steps and close dates honest — reps don't have to." },
      { title: "Playbooks that actually run", body: "Ship a MEDDPICC or Command-of-the-Message playbook in an afternoon, not a quarter." },
      { title: "Forecast you can defend", body: "Deal-level, roll-up and AI forecast side-by-side, with variance and commentary." },
    ],
    workflow: [
      { step: "01", title: "Capture without typing", body: "Emails, calls and meetings become deal activity automatically." },
      { step: "02", title: "Coach the deal", body: "Playbook checks and MEDDPICC gaps appear inline on the opportunity." },
      { step: "03", title: "Forecast with confidence", body: "AI + committed + best-case, reconciled in one board every Monday." },
    ],
    mockKpis: [
      { label: "Pipeline", value: "$4.2M", delta: "+14%" },
      { label: "Close this qtr.", value: "$1.1M" },
      { label: "AI forecast", value: "$1.24M" },
    ],
    mockRows: [
      { primary: "Acme Corp — Renewal expansion", secondary: "Stage 4 · $220k · 82%", tag: "HOT" },
      { primary: "Globex — New logo", secondary: "Stage 3 · $145k · 55%", tag: "MID" },
      { primary: "Initech — Multi-year", secondary: "Stage 5 · $410k · 90%", tag: "★" },
      { primary: "Umbrella — POC", secondary: "Stage 2 · $80k · 30%", tag: "NEW" },
    ],
    route: "/opportunities",
  },
  {
    id: "marketing",
    name: "Limnn Marketing",
    short: "Marketing",
    tagline: "Campaigns, intent and ABM in one canvas.",
    Icon: Megaphone,
    replaces: ["Marketo", "HubSpot Marketing", "6sense", "Demandbase"],
    color: "#DB2777",
    bullets: ["Segments, A/B, journeys", "Intent signals + ABM lists", "Attribution shared with Sales"],
    features: [
      { title: "Journeys on the same graph as CRM", body: "No sync jobs, no lead-to-contact mess — one contact, one timeline." },
      { title: "Intent that reaches sales", body: "3rd-party intent + web + product signals delivered as talking points, not lists." },
      { title: "Attribution both teams trust", body: "Multi-touch, single-source-of-truth revenue attribution — shared with Sales." },
    ],
    workflow: [
      { step: "01", title: "Build the segment", body: "Filter on any CRM, product or intent field — live, no lists to refresh." },
      { step: "02", title: "Ship the journey", body: "Multi-channel journeys with A/B, holdouts and frequency capping built in." },
      { step: "03", title: "Prove the revenue", body: "See influenced and sourced revenue by touch, campaign and channel." },
    ],
    mockKpis: [
      { label: "In-flight campaigns", value: "18" },
      { label: "MQL → SQL", value: "31%", delta: "+4pt" },
      { label: "Sourced pipeline", value: "$820k" },
    ],
    mockRows: [
      { primary: "Q3 ABM — Fortune 500", secondary: "820 accounts · 41% engaged", tag: "ABM" },
      { primary: "Product-led trial nurture", secondary: "12k users · 22% activated", tag: "PLG" },
      { primary: "Webinar: Cutting SaaS spend", secondary: "1,240 reg · 62% attended", tag: "EVT" },
      { primary: "Renewal reminder — 60d", secondary: "412 sent · 38% opened", tag: "LIFE" },
    ],
    route: "/",
  },
  {
    id: "cs",
    name: "Limnn Customer Success",
    short: "Customer Success",
    tagline: "Health scores that predict renewals.",
    Icon: HeartHandshake,
    replaces: ["Gainsight", "Catalyst", "Vitally"],
    color: "#059669",
    bullets: ["Health, risk, expansion", "QBRs auto-drafted", "Onboarding & advocacy"],
    features: [
      { title: "Health that means something", body: "Blend product usage, support, sentiment and NPS into a score you can defend." },
      { title: "QBRs in 5 minutes", body: "Auto-drafted QBR decks with usage, wins, risks and joint plan." },
      { title: "Playbooks that fire on signals", body: "Champion left? Usage dropped 40%? Trigger the right motion automatically." },
    ],
    workflow: [
      { step: "01", title: "Score every account", body: "Health, risk and expansion scores update daily with explanations." },
      { step: "02", title: "Run the play", body: "Onboarding, adoption, expansion or save plays kick off with owners and tasks." },
      { step: "03", title: "Renew with proof", body: "QBRs, ROI decks and success plans generated from real product usage." },
    ],
    mockKpis: [
      { label: "GRR", value: "94%", delta: "+2pt" },
      { label: "NRR", value: "118%" },
      { label: "At-risk ARR", value: "$310k" },
    ],
    mockRows: [
      { primary: "Acme Corp", secondary: "Health 82 · Renewal 45d", tag: "GOOD" },
      { primary: "Globex Ltd", secondary: "Health 41 · Champion left", tag: "RISK" },
      { primary: "Initech", secondary: "Expansion opp · +$120k", tag: "GROW" },
      { primary: "Umbrella", secondary: "Onboarding day 22/45", tag: "ONB" },
    ],
    route: "/",
  },
  {
    id: "support",
    name: "Limnn Support & Chat",
    short: "Support",
    tagline: "Omnichannel help desk with AI deflection.",
    Icon: LifeBuoy,
    replaces: ["Zendesk", "Intercom", "Freshdesk"],
    color: "#F59E0B",
    bullets: ["Email, chat, WhatsApp, voice", "AI macros & KB", "SLA, CSAT, routing"],
    features: [
      { title: "One inbox, every channel", body: "Email, live chat, WhatsApp, voice and social threaded to the same customer." },
      { title: "AI that resolves, not deflects", body: "Grounded on your KB, product data and past tickets — with human handoff." },
      { title: "SLA and CSAT that hold up", body: "Skills-based routing, business-hours SLA, and post-resolution CSAT built in." },
    ],
    workflow: [
      { step: "01", title: "Land in the right queue", body: "Skills-based routing on channel, product, tier and language." },
      { step: "02", title: "Resolve with AI + human", body: "AI drafts, agents approve. AI deflects the routine, humans own the hard." },
      { step: "03", title: "Learn every week", body: "CSAT, first-contact resolution and QA scores feed macros and coaching." },
    ],
    mockKpis: [
      { label: "Open tickets", value: "142" },
      { label: "AI resolved", value: "38%", delta: "+9pt" },
      { label: "CSAT", value: "4.7" },
    ],
    mockRows: [
      { primary: "#8421 — Password reset loop", secondary: "AI · resolved · CSAT 5", tag: "AI" },
      { primary: "#8422 — Billing dispute", secondary: "Priya · high priority", tag: "SLA" },
      { primary: "#8423 — API 429 rate limit", secondary: "David · engineering", tag: "ENG" },
      { primary: "#8424 — Feature request", secondary: "Filed to roadmap", tag: "PDT" },
    ],
    route: "/support",
  },
  {
    id: "cpq",
    name: "Limnn CPQ",
    short: "CPQ",
    tagline: "Quotes that price themselves — and approve themselves.",
    Icon: FileText,
    replaces: ["Salesforce CPQ", "DealHub", "PandaDoc"],
    color: "#7C3AED",
    bullets: ["Product & pricing rules", "Discount governance", "e-Sign built in"],
    features: [
      { title: "Guided selling", body: "Bundles, ramps, add-ons and dependencies — reps can't build an invalid quote." },
      { title: "Discount policy that runs itself", body: "Approvals routed by threshold, deal desk workflows, and margin protection." },
      { title: "e-Sign in the same product", body: "Redlines, versioning, order form and signature — no separate PandaDoc bill." },
    ],
    workflow: [
      { step: "01", title: "Configure", body: "Guided selling picks the right SKUs, quantities and terms for the deal." },
      { step: "02", title: "Approve", body: "Discount, term and margin rules route to the right approvers automatically." },
      { step: "03", title: "Sign & book", body: "Quote → order form → e-sign → billing, without leaving the record." },
    ],
    mockKpis: [
      { label: "Quotes this qtr.", value: "312", delta: "+18%" },
      { label: "Avg. approval time", value: "2.4h" },
      { label: "Discount avg.", value: "12%" },
    ],
    mockRows: [
      { primary: "Q-8221 — Acme 3-yr ramp", secondary: "$220k · 15% disc.", tag: "APRV" },
      { primary: "Q-8222 — Globex expansion", secondary: "$145k · 8% disc.", tag: "AUTO" },
      { primary: "Q-8223 — Initech multi-year", secondary: "$410k · 22% disc.", tag: "DESK" },
      { primary: "Q-8224 — Umbrella pilot", secondary: "$80k · 0% disc.", tag: "AUTO" },
    ],
    route: "/cpq",
  },
  {
    id: "billing",
    name: "Limnn Billing",
    short: "Billing",
    tagline: "Subscriptions, RevRec, AR/AP and FP&A — one ledger.",
    Icon: Wallet,
    replaces: ["Zuora", "Chargebee", "NetSuite", "Stripe Billing"],
    color: "#0891B2",
    bullets: ["Recurring + usage billing", "ASC-606 RevRec", "Collections & tax"],
    features: [
      { title: "Any pricing model", body: "Flat, tiered, volume, per-seat, usage, hybrid — mid-cycle changes just work." },
      { title: "RevRec on autopilot", body: "ASC-606 & IFRS-15 recognition with waterfall reports finance can trust." },
      { title: "AR that gets paid", body: "Automated dunning, collections workflows, and tax handled in-country." },
    ],
    workflow: [
      { step: "01", title: "Bill anything", body: "Recurring, usage, ramps, credits — from the same ledger CPQ writes into." },
      { step: "02", title: "Recognize correctly", body: "Rev schedules generated from the order, reviewable and audit-ready." },
      { step: "03", title: "Close the month faster", body: "AR, AP and FP&A pull from the same source. No CSV reconciliation." },
    ],
    mockKpis: [
      { label: "MRR", value: "$412k", delta: "+8%" },
      { label: "AR overdue", value: "$28k" },
      { label: "Days to close", value: "3.2" },
    ],
    mockRows: [
      { primary: "INV-8821 — Acme Corp", secondary: "$18,400 · paid", tag: "PAID" },
      { primary: "INV-8822 — Globex Ltd", secondary: "$22,100 · 12d overdue", tag: "DUN" },
      { primary: "INV-8823 — Initech", secondary: "$41,000 · scheduled", tag: "QUE" },
      { primary: "USG-4432 — Umbrella API", secondary: "$2,340 · usage run", tag: "USG" },
    ],
    route: "/billing",
  },
  {
    id: "grid",
    name: "Limnn Grid",
    short: "Grid",
    tagline: "Sprints, OKRs and roadmaps for the whole company.",
    Icon: LayoutGrid,
    replaces: ["Jira", "Linear", "Asana", "Notion Projects"],
    color: "#4F46E5",
    bullets: ["Sprints & retros", "OKRs & capacity", "Automations everywhere"],
    features: [
      { title: "One backlog, every team", body: "Engineering, marketing, ops and CS run in the same graph — not five tools." },
      { title: "OKRs that ladder up", body: "Company → team → individual OKRs, connected to the work that moves them." },
      { title: "Automations without an admin", body: "No-code rules on any object — routing, reminders, approvals, escalations." },
    ],
    workflow: [
      { step: "01", title: "Plan the sprint", body: "Capacity-aware planning with velocity, risk and dependencies visible." },
      { step: "02", title: "Ship the work", body: "Boards, lists, timelines and docs — pick the view, keep the source of truth." },
      { step: "03", title: "Retro and roll forward", body: "Auto-generated retros, actioned learnings, and OKR progress in one place." },
    ],
    mockKpis: [
      { label: "Active sprints", value: "24" },
      { label: "OKR progress", value: "62%", delta: "on track" },
      { label: "Blocked items", value: "8" },
    ],
    mockRows: [
      { primary: "LMN-8421 — Ship webhook v2", secondary: "In review · 3 SP", tag: "REV" },
      { primary: "LMN-8422 — Migrate billing tax", secondary: "In progress · 8 SP", tag: "DEV" },
      { primary: "LMN-8423 — Q3 OKR: NRR 120%", secondary: "62% · on track", tag: "OKR" },
      { primary: "LMN-8424 — Retro: Sprint 42", secondary: "3 actions filed", tag: "RETRO" },
    ],
    route: "/grid",
  },
  {
    id: "learning",
    name: "Limnn Learning",
    short: "Learning",
    tagline: "Enablement, certifications and AI roleplay.",
    Icon: GraduationCap,
    replaces: ["Lessonly", "Docebo", "Second Nature"],
    color: "#16A34A",
    bullets: ["Modules, quizzes, certs", "AI roleplay & evaluator", "Skill matrix & compliance"],
    features: [
      { title: "Roleplay with an AI buyer", body: "Reps practice discovery, objection handling and demo — with rubric-based scoring." },
      { title: "Skill matrix everyone trusts", body: "Track proficiency by team, role and skill — surface the gaps before they hurt." },
      { title: "Compliance that isn't a spreadsheet", body: "Assign, track and certify — SOC 2, HIPAA, region-specific, all in one." },
    ],
    workflow: [
      { step: "01", title: "Build the path", body: "Modules, quizzes, roleplays and certifications sequenced per role." },
      { step: "02", title: "Practice with AI", body: "Voice roleplay with rubric scoring — reps hit reps before customers." },
      { step: "03", title: "Prove readiness", body: "Certification, skill matrix and audit trail — no more 'they've been trained'." },
    ],
    mockKpis: [
      { label: "Active learners", value: "612" },
      { label: "Cert. completion", value: "84%" },
      { label: "AI roleplays / wk", value: "1,204" },
    ],
    mockRows: [
      { primary: "New Hire — Sales bootcamp", secondary: "Day 12 / 30 · 82%", tag: "PATH" },
      { primary: "Discovery roleplay v3", secondary: "Priya scored 91 / 100", tag: "AI" },
      { primary: "SOC 2 refresher — 2026", secondary: "412 / 480 completed", tag: "CMP" },
      { primary: "Kubernetes foundations", secondary: "Cert. issued to 24", tag: "CERT" },
    ],
    route: "/lms",
  },
  {
    id: "people",
    name: "Limnn People",
    short: "People",
    tagline: "HRIS, ATS, payroll and performance.",
    Icon: Users,
    replaces: ["Workday", "BambooHR", "Rippling", "Greenhouse"],
    color: "#8B5CF6",
    bullets: ["Directory & org chart", "Recruiting & onboarding", "Payroll, leave, performance"],
    features: [
      { title: "One record per person", body: "HRIS, ATS, payroll, performance, learning — one profile across the lifecycle." },
      { title: "Global-ready payroll", body: "Multi-country payroll, contractors, EOR and tax filings — with country-local partners." },
      { title: "Performance that isn't a form", body: "Continuous feedback, calibration, comp cycles and 9-box — connected to Learning." },
    ],
    workflow: [
      { step: "01", title: "Hire", body: "ATS with AI screening, structured interviews and offer approvals." },
      { step: "02", title: "Onboard & pay", body: "Provisioning, learning path, payroll and benefits from day one." },
      { step: "03", title: "Grow & retain", body: "Performance, comp, promotions and mobility — with People AI." },
    ],
    mockKpis: [
      { label: "Headcount", value: "612", delta: "+18" },
      { label: "Attrition (12m)", value: "8.4%" },
      { label: "Open roles", value: "24" },
    ],
    mockRows: [
      { primary: "Priya Sharma — Sr. Engineer", secondary: "Bangalore · 4y tenure", tag: "IC4" },
      { primary: "Req-812 — Product Designer", secondary: "12 candidates · 3 onsite", tag: "REQ" },
      { primary: "Payroll — Jun 2026", secondary: "Run scheduled · $2.1M", tag: "PAY" },
      { primary: "Perf cycle — Q3", secondary: "Calibration in 12d", tag: "PERF" },
    ],
    route: "/people",
  },
];
