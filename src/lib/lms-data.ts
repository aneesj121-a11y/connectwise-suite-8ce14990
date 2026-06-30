// ============================================================
// Limnn LMS — mock data layer
// ============================================================

export type TrackId = "foundation" | "aio" | "growth" | "support-ops";

export type Track = {
  id: TrackId;
  name: string;
  tagline: string;
  role: "Universal" | "Specialization";
  unlockAfter?: TrackId;
  modules: string[]; // module ids
  color: string;
  estHours: number;
};

export type Module = {
  id: string;
  trackId: TrackId;
  order: number;
  title: string;
  type: "video" | "youtube" | "vimeo" | "loom" | "scorm" | "doc";
  src: string;
  durationMin: number;
  allowSkipping: boolean;
  minWatchPct: number;
  hasChapterMenu: boolean;
  hasQuiz: boolean;
  hasPractical: boolean;
  description: string;
  chapters?: { t: number; label: string }[];
  resources?: { name: string; type: "PDF" | "SOP" | "Scorecard" }[];
};

export type Question = {
  id: string;
  prompt: string;
  type: "mcq" | "scenario";
  options: string[];
  correct: number;
  tags: string[];
  explanation: string;
};

export type Quiz = {
  moduleId: string;
  passPct: number;
  attemptLimit: 3 | 6 | 10 | "unlimited";
  questions: string[]; // question ids
};

export type Certification = {
  id: string;
  trackId: TrackId;
  name: string;
  status: "Active" | "Expired" | "Pending Renewal";
  issued: string;
  expires: string;
  score: number;
};

export type LeaderboardRow = {
  rank: number;
  name: string;
  cohort: string;
  department: string;
  trackId: TrackId;
  score: number;
  certs: number;
  streak: number;
};

export type Submission = {
  id: string;
  trainee: string;
  moduleId: string;
  trackId: TrackId;
  submittedAt: string;
  type: "file" | "text";
  preview: string;
  status: "Pending" | "Graded" | "Returned";
  rubric?: { criterion: string; max: number; score?: number }[];
};

export type Enrollment = {
  trainee: string;
  cohort: string;
  trackId: TrackId;
  enrolledAt: string;
  timeSpentMin: number;
  sessions: number;
  completionPct: number;
  lastQuizAttempts: number;
  retrainingFlag: boolean;
};

// ------------------------------------------------------------

export const TRACKS: Track[] = [
  {
    id: "foundation",
    name: "Foundation",
    tagline: "Limnn core, product mastery & company DNA",
    role: "Universal",
    modules: ["f1", "f2", "f3", "f4"],
    color: "#7C3AED",
    estHours: 6,
  },
  {
    id: "aio",
    name: "Expert AIO Buddy",
    tagline: "AI-assisted outreach & co-piloted dialer mastery",
    role: "Specialization",
    unlockAfter: "foundation",
    modules: ["a1", "a2", "a3"],
    color: "#2C69CF",
    estHours: 8,
  },
  {
    id: "growth",
    name: "Growth Expert",
    tagline: "Outbound velocity, pipeline architecture & expansion plays",
    role: "Specialization",
    unlockAfter: "foundation",
    modules: ["g1", "g2", "g3"],
    color: "#10B981",
    estHours: 9,
  },
  {
    id: "support-ops",
    name: "Support Operations",
    tagline: "Triage, SLA discipline & escalation playbooks",
    role: "Specialization",
    unlockAfter: "foundation",
    modules: ["s1", "s2", "s3"],
    color: "#F59E0B",
    estHours: 7,
  },
];

export const MODULES: Module[] = [
  {
    id: "f1",
    trackId: "foundation",
    order: 1,
    title: "Welcome to Limnn",
    type: "video",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    durationMin: 8,
    allowSkipping: false,
    minWatchPct: 95,
    hasChapterMenu: false,
    hasQuiz: false,
    hasPractical: false,
    description: "Founders' note, mission and the operating principles every Limnn-er lives by.",
    chapters: [
      { t: 0, label: "Origin story" },
      { t: 120, label: "Operating principles" },
      { t: 320, label: "What we expect" },
    ],
  },
  {
    id: "f2",
    trackId: "foundation",
    order: 2,
    title: "Product Mastery — The Limnn Suite",
    type: "youtube",
    src: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    durationMin: 22,
    allowSkipping: false,
    minWatchPct: 90,
    hasChapterMenu: true,
    hasQuiz: true,
    hasPractical: false,
    description: "Tour every hub: Sales, CS, Support, Grid, Billing, LMS, and the Admin Center.",
    resources: [
      { name: "Limnn Product Overview.pdf", type: "PDF" },
      { name: "Hub-by-hub SOP.pdf", type: "SOP" },
    ],
  },
  {
    id: "f3",
    trackId: "foundation",
    order: 3,
    title: "Security, Compliance & Data Handling",
    type: "loom",
    src: "https://www.loom.com/embed/2e2c2b0a5c1e4f3d8c1a9d4e6f2b3a5c",
    durationMin: 14,
    allowSkipping: false,
    minWatchPct: 100,
    hasChapterMenu: false,
    hasQuiz: true,
    hasPractical: false,
    description: "PII, SOC2 expectations, customer data boundaries and incident reporting.",
  },
  {
    id: "f4",
    trackId: "foundation",
    order: 4,
    title: "Foundation Capstone — Practical",
    type: "doc",
    src: "",
    durationMin: 30,
    allowSkipping: true,
    minWatchPct: 0,
    hasChapterMenu: false,
    hasQuiz: false,
    hasPractical: true,
    description: "Submit a written reflection + a 3-minute demo of any Limnn workflow.",
  },
  {
    id: "a1",
    trackId: "aio",
    order: 1,
    title: "Co-pilot Fundamentals",
    type: "video",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    durationMin: 18,
    allowSkipping: true,
    minWatchPct: 80,
    hasChapterMenu: true,
    hasQuiz: true,
    hasPractical: false,
    description: "How Limnn AI augments calls, threads and CPQ.",
  },
  {
    id: "a2",
    trackId: "aio",
    order: 2,
    title: "Live Transcript & Coaching",
    type: "vimeo",
    src: "https://player.vimeo.com/video/76979871",
    durationMin: 24,
    allowSkipping: false,
    minWatchPct: 85,
    hasChapterMenu: true,
    hasQuiz: true,
    hasPractical: true,
    description: "Use the AI rail during live calls for objection handling and next-best-action.",
  },
  {
    id: "a3",
    trackId: "aio",
    order: 3,
    title: "AIO Capstone",
    type: "doc",
    src: "",
    durationMin: 45,
    allowSkipping: true,
    minWatchPct: 0,
    hasChapterMenu: false,
    hasQuiz: false,
    hasPractical: true,
    description: "Run a recorded discovery call using AI co-pilot; submit the recording + summary.",
  },
  {
    id: "g1",
    trackId: "growth",
    order: 1,
    title: "Pipeline Architecture",
    type: "video",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    durationMin: 19,
    allowSkipping: false,
    minWatchPct: 90,
    hasChapterMenu: true,
    hasQuiz: true,
    hasPractical: false,
    description: "Stage definitions, exit criteria and forecast discipline.",
  },
  {
    id: "g2",
    trackId: "growth",
    order: 2,
    title: "Outbound Velocity",
    type: "youtube",
    src: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    durationMin: 28,
    allowSkipping: false,
    minWatchPct: 90,
    hasChapterMenu: true,
    hasQuiz: true,
    hasPractical: true,
    description: "Cadence design, dialer discipline and meeting-set ratios.",
  },
  {
    id: "g3",
    trackId: "growth",
    order: 3,
    title: "Expansion Plays",
    type: "video",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    durationMin: 22,
    allowSkipping: true,
    minWatchPct: 75,
    hasChapterMenu: true,
    hasQuiz: true,
    hasPractical: false,
    description: "Identify and run multi-thread expansion in existing accounts.",
  },
  {
    id: "s1",
    trackId: "support-ops",
    order: 1,
    title: "Triage & First Response",
    type: "loom",
    src: "https://www.loom.com/embed/2e2c2b0a5c1e4f3d8c1a9d4e6f2b3a5c",
    durationMin: 15,
    allowSkipping: false,
    minWatchPct: 95,
    hasChapterMenu: false,
    hasQuiz: true,
    hasPractical: false,
    description: "Reading the queue, severity assignment and first-touch quality.",
  },
  {
    id: "s2",
    trackId: "support-ops",
    order: 2,
    title: "SLA Discipline",
    type: "video",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    durationMin: 17,
    allowSkipping: false,
    minWatchPct: 90,
    hasChapterMenu: true,
    hasQuiz: true,
    hasPractical: false,
    description: "Owning timers, escalations and customer comms cadence.",
  },
  {
    id: "s3",
    trackId: "support-ops",
    order: 3,
    title: "Escalation Capstone",
    type: "doc",
    src: "",
    durationMin: 40,
    allowSkipping: true,
    minWatchPct: 0,
    hasChapterMenu: false,
    hasQuiz: false,
    hasPractical: true,
    description: "Walk through a P1 from inbound to resolution; submit a written postmortem.",
  },
];

export const QUESTIONS: Question[] = [
  {
    id: "q1",
    prompt: "When a customer asks about their data residency, what's your first move?",
    type: "scenario",
    options: [
      "Quote SOC2 in chat and close the ticket",
      "Confirm the region, link the data-residency SOP and tag Security",
      "Tell them legal will reply within 5 business days",
      "Escalate to the founder",
    ],
    correct: 1,
    tags: ["compliance", "support"],
    explanation: "Always confirm region first, attach the SOP, and route to Security for sign-off.",
  },
  {
    id: "q2",
    prompt: "Which hub owns the renewals timeline?",
    type: "mcq",
    options: ["Sales", "Customer Success", "Billing Ops", "Grid"],
    correct: 1,
    tags: ["product"],
    explanation: "CS owns renewals; Billing fulfills, Sales gets expansion credit.",
  },
  {
    id: "q3",
    prompt: "A discovery call goes silent for 6 seconds — best practice?",
    type: "scenario",
    options: [
      "Fill the silence with a feature pitch",
      "Wait, then ask a clarifying open-ended question",
      "End the call politely",
      "Pivot to pricing",
    ],
    correct: 1,
    tags: ["sales", "discovery"],
    explanation: "Silence after a hard question is a thinking signal — never break it with a pitch.",
  },
  {
    id: "q4",
    prompt: "Default attempt limit on a Limnn certification quiz is…",
    type: "mcq",
    options: ["3", "6", "10", "Unlimited"],
    correct: 1,
    tags: ["policy", "lms"],
    explanation: "6 is the recommended default; admins can override.",
  },
  {
    id: "q5",
    prompt: "Minimum watch % to unlock the Foundation quiz?",
    type: "mcq",
    options: ["50%", "75%", "90%", "100%"],
    correct: 2,
    tags: ["lms"],
    explanation: "90% prevents scrubbing while allowing brief skips.",
  },
];

export const QUIZZES: Quiz[] = [
  { moduleId: "f2", passPct: 80, attemptLimit: 6, questions: ["q2", "q4", "q5"] },
  { moduleId: "f3", passPct: 90, attemptLimit: 3, questions: ["q1"] },
  { moduleId: "a1", passPct: 80, attemptLimit: 6, questions: ["q2", "q3"] },
  { moduleId: "a2", passPct: 85, attemptLimit: 6, questions: ["q3"] },
  { moduleId: "g1", passPct: 80, attemptLimit: 6, questions: ["q2"] },
  { moduleId: "g2", passPct: 85, attemptLimit: 10, questions: ["q3"] },
  { moduleId: "g3", passPct: 75, attemptLimit: "unlimited", questions: ["q3"] },
  { moduleId: "s1", passPct: 85, attemptLimit: 6, questions: ["q1"] },
  { moduleId: "s2", passPct: 90, attemptLimit: 3, questions: ["q1"] },
];

export const CERTIFICATIONS: Certification[] = [
  { id: "c1", trackId: "foundation", name: "Limnn Foundation", status: "Active", issued: "2025-11-04", expires: "2026-11-04", score: 92 },
  { id: "c2", trackId: "aio", name: "Expert AIO Buddy — Level 1", status: "Pending Renewal", issued: "2024-12-12", expires: "2025-12-12", score: 88 },
  { id: "c3", trackId: "growth", name: "Growth Expert", status: "Expired", issued: "2023-09-01", expires: "2024-09-01", score: 81 },
];

export const LEADERBOARD: LeaderboardRow[] = [
  { rank: 1, name: "Mia Patel", cohort: "Q1-26", department: "Sales", trackId: "growth", score: 984, certs: 4, streak: 28 },
  { rank: 2, name: "Diego Ramos", cohort: "Q1-26", department: "Sales", trackId: "aio", score: 962, certs: 3, streak: 21 },
  { rank: 3, name: "Anees Naveed", cohort: "Q4-25", department: "Product", trackId: "foundation", score: 921, certs: 3, streak: 14 },
  { rank: 4, name: "Sara Lin", cohort: "Q1-26", department: "Support", trackId: "support-ops", score: 905, certs: 2, streak: 19 },
  { rank: 5, name: "Tomás Vega", cohort: "Q4-25", department: "CS", trackId: "growth", score: 887, certs: 2, streak: 9 },
  { rank: 6, name: "Priya Nair", cohort: "Q1-26", department: "Sales", trackId: "growth", score: 870, certs: 2, streak: 12 },
  { rank: 7, name: "Jonas Weber", cohort: "Q4-25", department: "Support", trackId: "support-ops", score: 852, certs: 1, streak: 7 },
];

export const SUBMISSIONS: Submission[] = [
  {
    id: "sub1",
    trainee: "Mia Patel",
    moduleId: "a3",
    trackId: "aio",
    submittedAt: "2026-06-28",
    type: "file",
    preview: "discovery-call-mia.mp4 · 12.4 MB",
    status: "Pending",
    rubric: [
      { criterion: "Opening & framing", max: 20 },
      { criterion: "Discovery quality", max: 30 },
      { criterion: "Objection handling", max: 25 },
      { criterion: "Next-step clarity", max: 25 },
    ],
  },
  {
    id: "sub2",
    trainee: "Diego Ramos",
    moduleId: "f4",
    trackId: "foundation",
    submittedAt: "2026-06-27",
    type: "text",
    preview: "My reflection on Limnn's operating principles is that velocity without...",
    status: "Pending",
    rubric: [
      { criterion: "Principle understanding", max: 40 },
      { criterion: "Specific examples", max: 30 },
      { criterion: "Actionable commitments", max: 30 },
    ],
  },
  {
    id: "sub3",
    trainee: "Sara Lin",
    moduleId: "s3",
    trackId: "support-ops",
    submittedAt: "2026-06-25",
    type: "text",
    preview: "P1 postmortem: EU dial-out incident — root cause was carrier-side...",
    status: "Graded",
    rubric: [
      { criterion: "Root cause clarity", max: 35, score: 32 },
      { criterion: "Timeline accuracy", max: 30, score: 28 },
      { criterion: "Preventive actions", max: 35, score: 30 },
    ],
  },
];

export const ENROLLMENTS: Enrollment[] = [
  { trainee: "Mia Patel", cohort: "Q1-26", trackId: "foundation", enrolledAt: "2026-01-12", timeSpentMin: 412, sessions: 9, completionPct: 100, lastQuizAttempts: 2, retrainingFlag: false },
  { trainee: "Mia Patel", cohort: "Q1-26", trackId: "growth", enrolledAt: "2026-02-04", timeSpentMin: 388, sessions: 12, completionPct: 78, lastQuizAttempts: 1, retrainingFlag: false },
  { trainee: "Diego Ramos", cohort: "Q1-26", trackId: "foundation", enrolledAt: "2026-01-12", timeSpentMin: 360, sessions: 7, completionPct: 92, lastQuizAttempts: 3, retrainingFlag: false },
  { trainee: "Sara Lin", cohort: "Q1-26", trackId: "support-ops", enrolledAt: "2026-01-22", timeSpentMin: 290, sessions: 8, completionPct: 64, lastQuizAttempts: 4, retrainingFlag: true },
  { trainee: "Tomás Vega", cohort: "Q4-25", trackId: "growth", enrolledAt: "2025-10-09", timeSpentMin: 510, sessions: 14, completionPct: 88, lastQuizAttempts: 2, retrainingFlag: false },
  { trainee: "Priya Nair", cohort: "Q1-26", trackId: "foundation", enrolledAt: "2026-01-12", timeSpentMin: 198, sessions: 5, completionPct: 48, lastQuizAttempts: 1, retrainingFlag: true },
  { trainee: "Jonas Weber", cohort: "Q4-25", trackId: "support-ops", enrolledAt: "2025-11-02", timeSpentMin: 612, sessions: 16, completionPct: 100, lastQuizAttempts: 1, retrainingFlag: false },
];

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------

export const TRAINEE_PROGRESS: Record<TrackId, number> = {
  foundation: 100,
  aio: 42,
  growth: 0,
  "support-ops": 0,
};

export function isTrackUnlocked(trackId: TrackId): boolean {
  const track = TRACKS.find((t) => t.id === trackId);
  if (!track?.unlockAfter) return true;
  return (TRAINEE_PROGRESS[track.unlockAfter] ?? 0) >= 100;
}

export function moduleById(id: string) {
  return MODULES.find((m) => m.id === id);
}

export function quizFor(moduleId: string) {
  return QUIZZES.find((q) => q.moduleId === moduleId);
}

export function trackById(id: TrackId) {
  return TRACKS.find((t) => t.id === id);
}

export function modulesForTrack(id: TrackId) {
  return MODULES.filter((m) => m.trackId === id).sort((a, b) => a.order - b.order);
}
