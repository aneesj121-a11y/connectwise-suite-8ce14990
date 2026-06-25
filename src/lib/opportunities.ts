export type Stage = "Lead" | "Qualified" | "Proposal" | "Negotiation" | "Closed";

export type LineItem = {
  id: string;
  sku: string;
  product: string;
  description: string;
  qty: number;
  termMonths: number;
  listPrice: number;
  discountPct: number;
};

export type Quote = {
  id: string;
  name: string;
  version: number;
  status: "Draft" | "Sent" | "Approved" | "Signed";
  createdAt: string;
  items: LineItem[];
};

export type Opportunity = {
  id: string;
  name: string;
  company: string;
  stage: Stage;
  value: number;
  probability: number;
  closeDate: string;
  owner: string;
  sdr: string;
  ae: string;
  manager: string;
  region: string;
  address: string;
  industry: string;
  source: string;
  nextStep: string;
  contact: { name: string; title: string; email: string; phone: string } | null;
  quotes: Quote[];
  activities: { id: string; type: string; who: string; when: string; note: string }[];
};

export const STAGES: Stage[] = ["Lead", "Qualified", "Proposal", "Negotiation", "Closed"];

const baseItems = (): LineItem[] => [
  {
    id: "li-1",
    sku: "LMN-PRO-SEAT",
    product: "Limnn Pro — Seat",
    description: "Per-seat license, includes AI coaching",
    qty: 25,
    termMonths: 12,
    listPrice: 1200,
    discountPct: 10,
  },
  {
    id: "li-2",
    sku: "LMN-AI-MIN",
    product: "AI Transcription Minutes",
    description: "Pooled minutes, overage at $0.02/min",
    qty: 50000,
    termMonths: 12,
    listPrice: 0.015,
    discountPct: 0,
  },
  {
    id: "li-3",
    sku: "LMN-PS-ONB",
    product: "Premium Onboarding",
    description: "One-time implementation, 6 weeks",
    qty: 1,
    termMonths: 0,
    listPrice: 9500,
    discountPct: 5,
  },
];

export const OPPORTUNITIES: Opportunity[] = [
  {
    id: "umbrella-pilot",
    name: "Umbrella — Pilot",
    company: "Umbrella (Demo)",
    stage: "Lead",
    value: 15000,
    probability: 20,
    closeDate: "2026-08-15",
    owner: "Anees Naveed",
    sdr: "Anees (Super Admin)",
    ae: "Anees (Super Admin)",
    manager: "—",
    region: "EMEA",
    address: "12 Downing St, London, UK",
    industry: "Pharma",
    source: "Outbound — Cadence",
    nextStep: "Send pilot scope & redlines",
    contact: { name: "Albert Wesker", title: "VP Operations", email: "a.wesker@umbrella.test", phone: "+44 20 7946 0011" },
    quotes: [
      { id: "q-1", name: "Pilot Q1", version: 1, status: "Draft", createdAt: "2026-06-22", items: baseItems() },
    ],
    activities: [
      { id: "a1", type: "Call", who: "Anees", when: "Today · 10:24", note: "Discovery call, scoped 25 seats." },
      { id: "a2", type: "Email", who: "Anees", when: "Yesterday", note: "Sent capability deck v3." },
    ],
  },
  {
    id: "initech-addon",
    name: "Initech — Add-on Seats",
    company: "Initech (Demo)",
    stage: "Qualified",
    value: 28000,
    probability: 45,
    closeDate: "2026-07-30",
    owner: "Anees Naveed",
    sdr: "Anees (Super Admin)",
    ae: "Anees (Super Admin)",
    manager: "Bill Lumbergh",
    region: "NA",
    address: "Initech HQ, Austin, TX",
    industry: "Software",
    source: "Expansion",
    nextStep: "Mutual action plan signoff",
    contact: { name: "Peter Gibbons", title: "Director, RevOps", email: "peter@initech.test", phone: "+1 512 555 0144" },
    quotes: [{ id: "q-2", name: "Add-on FY26", version: 2, status: "Sent", createdAt: "2026-06-18", items: baseItems() }],
    activities: [{ id: "a1", type: "Meeting", who: "Anees", when: "Mon", note: "Procurement intro." }],
  },
  {
    id: "acme-renewal",
    name: "Acme — Renewal FY26",
    company: "Acme Corp (Demo)",
    stage: "Proposal",
    value: 90000,
    probability: 70,
    closeDate: "2026-07-05",
    owner: "Anees Naveed",
    sdr: "—",
    ae: "Anees (Super Admin)",
    manager: "Bill Lumbergh",
    region: "NA",
    address: "Acme Corp, Phoenix, AZ",
    industry: "Manufacturing",
    source: "Renewal",
    nextStep: "Legal redlines",
    contact: { name: "Wile E. Coyote", title: "Head of Procurement", email: "wile@acme.test", phone: "+1 602 555 0177" },
    quotes: [{ id: "q-3", name: "Renewal FY26", version: 3, status: "Sent", createdAt: "2026-06-10", items: baseItems() }],
    activities: [],
  },
  {
    id: "globex-newlogo",
    name: "Globex — New Logo",
    company: "Globex (Demo)",
    stage: "Proposal",
    value: 64000,
    probability: 55,
    closeDate: "2026-08-22",
    owner: "Anees Naveed",
    sdr: "Anees (Super Admin)",
    ae: "Anees (Super Admin)",
    manager: "Bill Lumbergh",
    region: "APAC",
    address: "Globex Tower, Singapore",
    industry: "Logistics",
    source: "Inbound — Web",
    nextStep: "Security review",
    contact: { name: "Hank Scorpio", title: "COO", email: "hank@globex.test", phone: "+65 6555 0144" },
    quotes: [{ id: "q-4", name: "New Logo v1", version: 1, status: "Draft", createdAt: "2026-06-20", items: baseItems() }],
    activities: [],
  },
  {
    id: "acme-platform",
    name: "Acme — Platform Expansion",
    company: "Acme Corp (Demo)",
    stage: "Negotiation",
    value: 120000,
    probability: 80,
    closeDate: "2026-06-30",
    owner: "Anees Naveed",
    sdr: "—",
    ae: "Anees (Super Admin)",
    manager: "Bill Lumbergh",
    region: "NA",
    address: "Acme Corp, Phoenix, AZ",
    industry: "Manufacturing",
    source: "Expansion",
    nextStep: "CFO signoff",
    contact: { name: "Wile E. Coyote", title: "Head of Procurement", email: "wile@acme.test", phone: "+1 602 555 0177" },
    quotes: [{ id: "q-5", name: "Expansion FY26", version: 4, status: "Approved", createdAt: "2026-06-19", items: baseItems() }],
    activities: [],
  },
  {
    id: "acme-upsell",
    name: "Acme — Upsell (Won)",
    company: "Acme Corp (Demo)",
    stage: "Closed",
    value: 42000,
    probability: 100,
    closeDate: "2026-05-12",
    owner: "Anees Naveed",
    sdr: "—",
    ae: "Anees (Super Admin)",
    manager: "Bill Lumbergh",
    region: "NA",
    address: "Acme Corp, Phoenix, AZ",
    industry: "Manufacturing",
    source: "Expansion",
    nextStep: "—",
    contact: { name: "Wile E. Coyote", title: "Head of Procurement", email: "wile@acme.test", phone: "+1 602 555 0177" },
    quotes: [{ id: "q-6", name: "Upsell", version: 1, status: "Signed", createdAt: "2026-05-10", items: baseItems() }],
    activities: [],
  },
  {
    id: "initech-annual",
    name: "Initech — Annual (Won)",
    company: "Initech (Demo)",
    stage: "Closed",
    value: 75000,
    probability: 100,
    closeDate: "2026-04-28",
    owner: "Anees Naveed",
    sdr: "Anees (Super Admin)",
    ae: "Anees (Super Admin)",
    manager: "Bill Lumbergh",
    region: "NA",
    address: "Initech HQ, Austin, TX",
    industry: "Software",
    source: "Renewal",
    nextStep: "—",
    contact: { name: "Peter Gibbons", title: "Director, RevOps", email: "peter@initech.test", phone: "+1 512 555 0144" },
    quotes: [{ id: "q-7", name: "Annual", version: 1, status: "Signed", createdAt: "2026-04-25", items: baseItems() }],
    activities: [],
  },
];

export const lineNet = (li: LineItem) =>
  li.qty * li.listPrice * (1 - li.discountPct / 100) * (li.termMonths > 0 ? li.termMonths / 12 : 1);

export const quoteTotals = (q: Quote) => {
  const subtotal = q.items.reduce((s, li) => s + li.qty * li.listPrice * (li.termMonths > 0 ? li.termMonths / 12 : 1), 0);
  const net = q.items.reduce((s, li) => s + lineNet(li), 0);
  const discount = subtotal - net;
  const tax = net * 0.08;
  return { subtotal, discount, net, tax, total: net + tax };
};

export const stageColor: Record<Stage, { bg: string; fg: string }> = {
  Lead: { bg: "color-mix(in oklab, var(--primary) 12%, transparent)", fg: "var(--primary)" },
  Qualified: { bg: "color-mix(in oklab, var(--chart-2) 14%, transparent)", fg: "var(--chart-2)" },
  Proposal: { bg: "color-mix(in oklab, var(--chart-4) 16%, transparent)", fg: "var(--chart-4)" },
  Negotiation: { bg: "color-mix(in oklab, var(--warning) 18%, transparent)", fg: "var(--warning)" },
  Closed: { bg: "color-mix(in oklab, var(--success) 16%, transparent)", fg: "var(--success)" },
};

export const findOpportunity = (id: string) => OPPORTUNITIES.find((o) => o.id === id);
