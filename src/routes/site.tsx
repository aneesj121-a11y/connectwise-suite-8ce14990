import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
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
  ArrowUpRight,
  ArrowRight,
  Check,
  Minus,
  X,
} from "lucide-react";
import limnnLogo from "@/assets/limnn-logo.png";

export const Route = createFileRoute("/site")({
  head: () => ({
    meta: [
      { title: "Limnn — Take control. One platform. Less software spend." },
      {
        name: "description",
        content:
          "Limnn replaces the sprawl of point tools — CRM, dialer, support, billing, HRIS, LMS — under one AI-native platform. Take control. Reduce your software spending.",
      },
      { property: "og:title", content: "Limnn — One platform. Less spend." },
      {
        property: "og:description",
        content:
          "Replace 12+ SaaS subscriptions with a single AI-native operating system for your revenue, service, finance and people teams.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SitePage,
});

const INK = "#0F1420";
const CREAM = "#F6F1E6";
const BLUE = "#2C69CF";
const ACCENT = "#E85D3A";

type Mod = {
  id: string;
  name: string;
  tagline: string;
  Icon: typeof Phone;
  replaces: string[];
  color: string;
  bullets: string[];
};

const MODULES: Mod[] = [
  {
    id: "threads",
    name: "Limnn Threads",
    tagline: "Team messaging where work actually gets done.",
    Icon: MessageSquareText,
    replaces: ["Slack", "Teams"],
    color: "#7C3AED",
    bullets: ["Channels, DMs, huddles", "Deal & ticket threads inline", "AI recap for every channel"],
  },
  {
    id: "intelligence",
    name: "Limnn Intelligence",
    tagline: "The AI copilot that lives across every workflow.",
    Icon: Sparkles,
    replaces: ["Gong", "ChatGPT Enterprise", "Clari Copilot"],
    color: "#2C69CF",
    bullets: ["Grounded on your data", "Auto-notes, drafts, forecasts", "Per-role guardrails"],
  },
  {
    id: "dialer",
    name: "Limnn Dialer",
    tagline: "AI-native voice for sales and support.",
    Icon: Phone,
    replaces: ["Aircall", "Dialpad", "Five9"],
    color: "#0EA5E9",
    bullets: ["Global carrier network", "Live coach & objection cards", "Recording, transcription, QA"],
  },
  {
    id: "sales",
    name: "Limnn Sales",
    tagline: "CRM without the seat tax and consultants.",
    Icon: Target,
    replaces: ["Salesforce Sales Cloud", "HubSpot Sales"],
    color: "#DC2626",
    bullets: ["Opportunities, pipeline, forecast", "Playbooks & sequences", "Attribution end-to-end"],
  },
  {
    id: "marketing",
    name: "Limnn Marketing",
    tagline: "Campaigns, intent and ABM in one canvas.",
    Icon: Megaphone,
    replaces: ["Marketo", "HubSpot Marketing", "6sense"],
    color: "#DB2777",
    bullets: ["Segments, A/B, journeys", "Intent signals + ABM lists", "Attribution shared with Sales"],
  },
  {
    id: "cs",
    name: "Limnn Customer Success",
    tagline: "Health scores that predict renewals.",
    Icon: HeartHandshake,
    replaces: ["Gainsight", "Catalyst", "Vitally"],
    color: "#059669",
    bullets: ["Health, risk, expansion", "QBRs auto-drafted", "Onboarding & advocacy"],
  },
  {
    id: "support",
    name: "Limnn Support & Chat",
    tagline: "Omnichannel help desk with AI deflection.",
    Icon: LifeBuoy,
    replaces: ["Zendesk", "Intercom", "Freshdesk"],
    color: "#F59E0B",
    bullets: ["Email, chat, WhatsApp, voice", "AI macros & KB", "SLA, CSAT, routing"],
  },
  {
    id: "cpq",
    name: "Limnn CPQ",
    tagline: "Quotes that price themselves — and approve themselves.",
    Icon: FileText,
    replaces: ["Salesforce CPQ", "DealHub", "PandaDoc"],
    color: "#7C3AED",
    bullets: ["Product & pricing rules", "Discount governance", "e-Sign built in"],
  },
  {
    id: "billing",
    name: "Limnn Billing",
    tagline: "Subscriptions, RevRec, AR/AP and FP&A — one ledger.",
    Icon: Wallet,
    replaces: ["Zuora", "Chargebee", "NetSuite", "Stripe Billing"],
    color: "#0891B2",
    bullets: ["Recurring + usage billing", "ASC-606 RevRec", "Collections & tax"],
  },
  {
    id: "grid",
    name: "Limnn Grid",
    tagline: "Sprints, OKRs and roadmaps for the whole company.",
    Icon: LayoutGrid,
    replaces: ["Jira", "Linear", "Asana", "Notion Projects"],
    color: "#4F46E5",
    bullets: ["Sprints & retros", "OKRs & capacity", "Automations everywhere"],
  },
  {
    id: "learning",
    name: "Limnn Learning",
    tagline: "Enablement, certifications and AI roleplay.",
    Icon: GraduationCap,
    replaces: ["Lessonly", "Docebo", "Second Nature"],
    color: "#16A34A",
    bullets: ["Modules, quizzes, certs", "AI roleplay & evaluator", "Skill matrix & compliance"],
  },
  {
    id: "people",
    name: "Limnn People",
    tagline: "HRIS, ATS, payroll and performance.",
    Icon: Users,
    replaces: ["Workday", "BambooHR", "Rippling", "Greenhouse"],
    color: "#8B5CF6",
    bullets: ["Directory & org chart", "Recruiting & onboarding", "Payroll, leave, performance"],
  },
];

function SitePage() {
  return (
    <div style={{ background: CREAM, color: INK }} className="min-h-screen font-sans antialiased">
      <Nav />
      <Hero />
      <Marquee />
      <ModulesSection />
      <SavingsSection />
      <ComparisonSection />
      <CtaSection />
      <Footer />
    </div>
  );
}

/* ---------------- Nav ---------------- */
function Nav() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md" style={{ background: `${CREAM}cc`, borderBottom: `1px solid ${INK}14` }}>
      <div className="mx-auto max-w-[1240px] px-6 h-16 flex items-center justify-between">
        <Link to="/site" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md grid place-items-center" style={{ background: INK }}>
            <img src={limnnLogo} alt="Limnn" className="h-4 w-auto invert" />
          </div>
          <span className="font-display font-semibold tracking-tight text-lg">limnn</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <a href="#modules" className="hover:opacity-70">Platform</a>
          <a href="#savings" className="hover:opacity-70">Savings</a>
          <a href="#compare" className="hover:opacity-70">Compare</a>
          <a href="#cta" className="hover:opacity-70">Pricing</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="hidden md:inline-flex h-9 items-center px-3 rounded-md text-sm font-medium hover:bg-black/5"
          >
            Sign in
          </Link>
          <a
            href="#cta"
            className="inline-flex h-9 items-center gap-1.5 px-4 rounded-md text-sm font-medium text-white"
            style={{ background: INK }}
          >
            Book a demo <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </header>
  );
}

/* ---------------- Hero ---------------- */
function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-[1240px] px-6 pt-20 pb-24">
        <div className="inline-flex items-center gap-2 px-3 h-7 rounded-full text-[11px] font-mono uppercase tracking-[0.14em]"
          style={{ background: `${INK}0d`, color: INK }}>
          <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: ACCENT }} />
          One platform · 12 modules · zero seat sprawl
        </div>

        <h1 className="mt-8 font-serif font-normal leading-[0.95] tracking-[-0.02em]" style={{ fontSize: "clamp(48px, 8vw, 128px)" }}>
          Take control.<br />
          <span style={{ color: ACCENT }}>Reduce</span> your software spending.<br />
          <span className="italic opacity-70">All under one platform.</span>
        </h1>

        <p className="mt-8 max-w-2xl text-lg md:text-xl leading-relaxed text-black/70">
          Limnn is the operating system for modern companies. Replace the spaghetti of CRM,
          dialer, support, billing, HRIS, LMS and project tools with a single AI-native platform
          that your teams actually enjoy using.
        </p>

        <div className="mt-10 flex flex-wrap gap-3 items-center">
          <a href="#cta" className="inline-flex h-12 items-center gap-2 px-6 rounded-md text-base font-medium text-white"
            style={{ background: INK }}>
            Start free trial <ArrowRight className="h-4 w-4" />
          </a>
          <Link to="/" className="inline-flex h-12 items-center gap-2 px-6 rounded-md text-base font-medium border"
            style={{ borderColor: `${INK}22` }}>
            Explore the workspace <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl">
          {[
            { k: "12", v: "Modules included" },
            { k: "~62%", v: "Avg. tooling saved" },
            { k: "1", v: "Contract, 1 login" },
            { k: "14 days", v: "To migrate" },
          ].map((s) => (
            <div key={s.v}>
              <div className="font-serif text-4xl md:text-5xl" style={{ color: INK }}>{s.k}</div>
              <div className="mt-1 text-xs uppercase tracking-[0.14em] text-black/50">{s.v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Marquee of tools being replaced ---------------- */
function Marquee() {
  const tools = [
    "Salesforce", "Zendesk", "Gong", "HubSpot", "Zuora", "Marketo", "Aircall", "Gainsight",
    "Jira", "Workday", "BambooHR", "Docebo", "Chargebee", "Intercom", "6sense", "Linear",
    "PandaDoc", "Rippling", "Freshdesk", "DealHub",
  ];
  return (
    <section className="py-10 border-y" style={{ borderColor: `${INK}14`, background: INK, color: CREAM }}>
      <div className="text-center text-[11px] uppercase tracking-[0.2em] opacity-60 mb-4">
        Cancel the sprawl · replace them all
      </div>
      <div className="overflow-hidden">
        <div className="flex gap-10 animate-[scroll_50s_linear_infinite] whitespace-nowrap font-serif text-3xl md:text-4xl">
          {[...tools, ...tools].map((t, i) => (
            <span key={i} className="flex items-center gap-10 opacity-80">
              {t}
              <span className="text-lg" style={{ color: ACCENT }}>×</span>
            </span>
          ))}
        </div>
      </div>
      <style>{`@keyframes scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </section>
  );
}

/* ---------------- Modules — one line each ---------------- */
function ModulesSection() {
  const [open, setOpen] = useState<string | null>("intelligence");
  return (
    <section id="modules" className="py-24">
      <div className="mx-auto max-w-[1240px] px-6">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-black/50 mb-3">
              The platform
            </div>
            <h2 className="font-serif text-5xl md:text-6xl leading-[0.95] tracking-tight max-w-2xl">
              Twelve modules.<br />One line each.<br /><span className="italic opacity-60">One bill.</span>
            </h2>
          </div>
          <p className="max-w-md text-black/60 leading-relaxed">
            Every module below is a first-class product on its own — and part of one connected
            system. Turn on what you need. Cancel the rest of your stack.
          </p>
        </div>

        <ol className="divide-y" style={{ borderTop: `1px solid ${INK}22`, borderBottom: `1px solid ${INK}22`, borderColor: `${INK}14` }}>
          {MODULES.map((m, i) => {
            const isOpen = open === m.id;
            return (
              <li key={m.id} style={{ borderColor: `${INK}14` }}>
                <button
                  onClick={() => setOpen(isOpen ? null : m.id)}
                  className="group w-full flex items-center gap-6 py-6 md:py-7 text-left transition-colors hover:bg-black/[0.03]"
                >
                  <span className="font-mono text-xs text-black/40 w-10 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="h-10 w-10 shrink-0 rounded-md grid place-items-center transition-transform group-hover:rotate-3"
                    style={{ background: `${m.color}18`, color: m.color }}
                  >
                    <m.Icon className="h-5 w-5" />
                  </span>
                  <span className="font-display text-2xl md:text-3xl font-medium tracking-tight shrink-0">
                    {m.name}
                  </span>
                  <span className="hidden md:block flex-1 text-black/50 truncate">— {m.tagline}</span>
                  <span className="hidden md:flex items-center gap-1.5 shrink-0">
                    {m.replaces.slice(0, 2).map((r) => (
                      <span
                        key={r}
                        className="text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded"
                        style={{ background: `${INK}0a`, color: `${INK}99` }}
                      >
                        replaces {r}
                      </span>
                    ))}
                  </span>
                  <ArrowUpRight
                    className="h-5 w-5 shrink-0 transition-transform"
                    style={{
                      color: isOpen ? m.color : `${INK}55`,
                      transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                    }}
                  />
                </button>
                {isOpen && (
                  <div className="pb-8 pl-16 md:pl-24 pr-4 grid md:grid-cols-[1fr_320px] gap-8">
                    <div>
                      <p className="md:hidden text-black/60 mb-4">{m.tagline}</p>
                      <ul className="space-y-2">
                        {m.bullets.map((b) => (
                          <li key={b} className="flex items-start gap-2 text-[15px]">
                            <Check className="h-4 w-4 mt-0.5 shrink-0" style={{ color: m.color }} />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-5 flex flex-wrap gap-2">
                        {m.replaces.map((r) => (
                          <span key={r} className="text-[11px] font-mono px-2 py-1 rounded"
                            style={{ background: `${m.color}12`, color: m.color }}>
                            replaces {r}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-xl p-5 relative overflow-hidden"
                      style={{ background: `linear-gradient(135deg, ${m.color}18, ${m.color}03)`, border: `1px solid ${m.color}22` }}>
                      <div className="text-[10px] uppercase tracking-[0.14em]" style={{ color: m.color }}>
                        Included in Limnn
                      </div>
                      <div className="mt-2 font-serif text-2xl leading-tight">{m.name}</div>
                      <div className="mt-1 text-xs text-black/60">{m.tagline}</div>
                      <Link to="/"
                        className="mt-4 inline-flex items-center gap-1 text-sm font-medium"
                        style={{ color: m.color }}>
                        Open module <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/* ---------------- Savings ---------------- */
function SavingsSection() {
  const items = [
    { tool: "Salesforce Sales Cloud", seat: 165 },
    { tool: "Zendesk Suite", seat: 115 },
    { tool: "Gong", seat: 145 },
    { tool: "Aircall", seat: 70 },
    { tool: "Gainsight", seat: 90 },
    { tool: "Marketo", seat: 120 },
    { tool: "Jira + Confluence", seat: 22 },
    { tool: "Workday HCM", seat: 100 },
    { tool: "Chargebee", seat: 55 },
    { tool: "Lessonly", seat: 30 },
  ];
  const stackTotal = items.reduce((s, i) => s + i.seat, 0);
  const limnn = 89;
  return (
    <section id="savings" className="py-24" style={{ background: INK, color: CREAM }}>
      <div className="mx-auto max-w-[1240px] px-6 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-[0.18em] opacity-60 mb-3">
            Reduce spend
          </div>
          <h2 className="font-serif text-5xl md:text-6xl leading-[0.95] tracking-tight">
            You're paying <span style={{ color: ACCENT }}>${stackTotal.toLocaleString()}</span><br />
            per seat, per month.
          </h2>
          <p className="mt-6 text-lg opacity-70 max-w-lg">
            Ten typical SaaS subscriptions add up fast — before you count the integrations,
            admins and consultants keeping them stitched together. Limnn is one product,
            one price.
          </p>
          <div className="mt-8 flex items-baseline gap-4">
            <div className="font-serif text-7xl" style={{ color: CREAM }}>${limnn}</div>
            <div className="opacity-70">/ user / month · everything included</div>
          </div>
          <div className="mt-4 inline-flex items-center gap-2 px-3 h-8 rounded-full text-sm font-medium"
            style={{ background: `${ACCENT}22`, color: ACCENT }}>
            Save {Math.round((1 - limnn / stackTotal) * 100)}% vs. today's stack
          </div>
        </div>

        <div className="rounded-2xl p-6" style={{ background: "#ffffff08", border: "1px solid #ffffff14" }}>
          <div className="text-[10px] uppercase tracking-[0.18em] opacity-60 mb-4">Your current stack</div>
          <ul className="space-y-2">
            {items.map((i) => (
              <li key={i.tool} className="flex items-center gap-3">
                <span className="flex-1 text-sm">{i.tool}</span>
                <div className="w-40 h-1.5 rounded-full" style={{ background: "#ffffff10" }}>
                  <div className="h-full rounded-full" style={{ width: `${(i.seat / 170) * 100}%`, background: CREAM }} />
                </div>
                <span className="font-mono text-xs w-14 text-right opacity-80">${i.seat}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 pt-4 border-t flex items-center" style={{ borderColor: "#ffffff14" }}>
            <span className="flex-1 font-medium">Total / seat / month</span>
            <span className="font-serif text-2xl" style={{ color: ACCENT }}>${stackTotal}</span>
          </div>
          <div className="mt-2 flex items-center">
            <span className="flex-1 font-medium">Limnn (all 12 modules)</span>
            <span className="font-serif text-2xl">${limnn}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Comparison ---------------- */
function ComparisonSection() {
  const rows = [
    { f: "One login for the whole company", l: true, s: false, p: "partial" as const },
    { f: "AI copilot grounded on your data", l: true, s: "partial" as const, p: false },
    { f: "CRM + Dialer + Support + Billing", l: true, s: false, p: false },
    { f: "HRIS + LMS in the same product", l: true, s: false, p: false },
    { f: "Per-seat pricing that stops growing", l: true, s: false, p: false },
    { f: "No integration tax between modules", l: true, s: false, p: false },
    { f: "Native mobile + web + voice", l: true, s: "partial" as const, p: "partial" as const },
  ];
  const Cell = ({ v }: { v: true | false | "partial" }) =>
    v === true ? <Check className="h-4 w-4" style={{ color: "#059669" }} />
      : v === "partial" ? <Minus className="h-4 w-4 text-black/40" />
      : <X className="h-4 w-4 text-black/30" />;

  return (
    <section id="compare" className="py-24">
      <div className="mx-auto max-w-[1240px] px-6">
        <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-black/50 mb-3">
          Why not just stitch tools?
        </div>
        <h2 className="font-serif text-5xl md:text-6xl leading-[0.95] tracking-tight max-w-2xl">
          Integrations aren't a strategy.<br /><span className="italic opacity-60">One system is.</span>
        </h2>

        <div className="mt-12 rounded-2xl overflow-hidden" style={{ border: `1px solid ${INK}18` }}>
          <div className="grid grid-cols-[1.6fr_1fr_1fr_1fr] text-sm">
            <div className="px-5 py-4 font-medium" style={{ background: `${INK}05` }}>Capability</div>
            <div className="px-5 py-4 text-center font-display font-semibold" style={{ background: INK, color: CREAM }}>Limnn</div>
            <div className="px-5 py-4 text-center text-black/60" style={{ background: `${INK}05` }}>Best-of-breed stack</div>
            <div className="px-5 py-4 text-center text-black/60" style={{ background: `${INK}05` }}>Legacy suite</div>
            {rows.map((r) => (
              <div key={r.f} className="contents">
                <div className="px-5 py-4 border-t" style={{ borderColor: `${INK}10` }}>{r.f}</div>
                <div className="px-5 py-4 border-t flex items-center justify-center" style={{ borderColor: `${INK}10`, background: `${BLUE}08` }}><Cell v={r.l} /></div>
                <div className="px-5 py-4 border-t flex items-center justify-center" style={{ borderColor: `${INK}10` }}><Cell v={r.s} /></div>
                <div className="px-5 py-4 border-t flex items-center justify-center" style={{ borderColor: `${INK}10` }}><Cell v={r.p} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- CTA ---------------- */
function CtaSection() {
  return (
    <section id="cta" className="py-24">
      <div className="mx-auto max-w-[1240px] px-6">
        <div className="rounded-3xl p-10 md:p-16 relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${INK}, #1a2540)`, color: CREAM }}>
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full opacity-40"
            style={{ background: `radial-gradient(closest-side, ${ACCENT}, transparent)` }} />
          <div className="absolute -left-10 -bottom-10 h-72 w-72 rounded-full opacity-30"
            style={{ background: `radial-gradient(closest-side, ${BLUE}, transparent)` }} />

          <div className="relative grid md:grid-cols-[1.4fr_1fr] gap-10 items-center">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-[0.18em] opacity-60 mb-3">
                Take control
              </div>
              <h2 className="font-serif text-5xl md:text-6xl leading-[0.95] tracking-tight">
                Cancel a dozen contracts.<br />
                <span style={{ color: ACCENT }}>Keep the work.</span>
              </h2>
              <p className="mt-5 opacity-70 max-w-lg">
                Free 30-day trial, all modules on. White-glove migration from your current stack.
                Named implementation lead. No credit card required to start.
              </p>
            </div>
            <div className="rounded-xl p-6" style={{ background: "#ffffff0d", border: "1px solid #ffffff1c" }}>
              <div className="flex flex-col gap-3">
                <a href="#" className="inline-flex h-12 items-center justify-center gap-2 rounded-md text-base font-medium"
                  style={{ background: CREAM, color: INK }}>
                  Start free trial <ArrowRight className="h-4 w-4" />
                </a>
                <a href="#" className="inline-flex h-12 items-center justify-center gap-2 rounded-md text-base font-medium border"
                  style={{ borderColor: "#ffffff33", color: CREAM }}>
                  Book a demo
                </a>
                <div className="text-[11px] font-mono uppercase tracking-[0.14em] opacity-50 text-center mt-2">
                  SOC 2 · GDPR · HIPAA · ISO 27001
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Footer ---------------- */
function Footer() {
  return (
    <footer className="pt-16 pb-10 border-t" style={{ borderColor: `${INK}14` }}>
      <div className="mx-auto max-w-[1240px] px-6 grid md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md grid place-items-center" style={{ background: INK }}>
              <img src={limnnLogo} alt="Limnn" className="h-4 w-auto invert" />
            </div>
            <span className="font-display font-semibold tracking-tight text-lg">limnn</span>
          </div>
          <p className="mt-4 text-sm text-black/60 max-w-xs">
            One platform for every team. Take control. Reduce spend. Ship faster.
          </p>
        </div>
        <FooterCol title="Platform" items={["Threads", "Intelligence", "Dialer", "Sales", "Marketing", "Support"]} />
        <FooterCol title="Back office" items={["CPQ", "Billing", "People", "Learning", "Grid"]} />
        <FooterCol title="Company" items={["About", "Customers", "Security", "Careers", "Contact"]} />
      </div>
      <div className="mx-auto max-w-[1240px] px-6 mt-10 pt-6 border-t flex flex-wrap justify-between gap-4 text-xs text-black/50"
        style={{ borderColor: `${INK}14` }}>
        <span>© {new Date().getFullYear()} Limnn, Inc. All rights reserved.</span>
        <span className="font-mono uppercase tracking-[0.14em]">Made for teams that want their afternoons back.</span>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-black/50 mb-3">{title}</div>
      <ul className="space-y-2 text-sm">
        {items.map((i) => (
          <li key={i}><a href="#" className="hover:opacity-70">{i}</a></li>
        ))}
      </ul>
    </div>
  );
}
