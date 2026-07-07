import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform, useReducedMotion, useMotionValue, useSpring } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowUpRight, ArrowRight, Check, Minus, X, Sparkles, PlayCircle } from "lucide-react";
import { SITE_MODULES } from "@/lib/site-modules";
import limnnLogo from "@/assets/limnn-logo.png";

export const Route = createFileRoute("/site/")({
  head: () => ({
    meta: [
      { title: "Limnn — Take control. One platform. Less software spend." },
      { name: "description", content: "Limnn replaces 12+ SaaS tools — CRM, dialer, support, billing, HRIS, LMS — under one AI-native operating system. Take control. Cut software spend by up to 89%." },
      { property: "og:title", content: "Limnn — One platform. Less spend." },
      { property: "og:description", content: "Replace the sprawl of point tools with a single AI-native platform for your revenue, service, finance and people teams." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SitePage,
});

const INK = "#0F1420";
const CREAM = "#F6F1E6";
const ACCENT = "#FF4D6D";       // hot pink-red
const ACCENT2 = "#7C3AED";      // vivid purple
const ACCENT3 = "#22D3EE";      // cyan
const ACCENT4 = "#FBBF24";      // amber
const GRAD = `linear-gradient(90deg, ${ACCENT} 0%, ${ACCENT2} 55%, ${ACCENT3} 100%)`;
const EASE = [0.22, 1, 0.36, 1] as const;

/* ---------------- shared ---------------- */
function Reveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >{children}</motion.div>
  );
}

function SitePage() {
  return (
    <div data-site style={{ background: CREAM, color: INK }} className="min-h-screen antialiased overflow-x-hidden">
      <style>{`
        [data-site], [data-site] * { font-family: "Poppins", ui-sans-serif, system-ui, sans-serif !important; letter-spacing:-0.01em; }
        [data-site] .font-display { font-family: "Poppins", ui-sans-serif, system-ui, sans-serif !important; font-weight: 800; letter-spacing:-0.035em; }
        [data-site] h1.font-display, [data-site] h2.font-display { font-weight: 900; letter-spacing:-0.045em; }
        [data-site] .font-mono, [data-site] .font-mono * { font-family: "JetBrains Mono Variable","JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace !important; letter-spacing:0; }
        [data-site] .grad-text {
          background: ${GRAD};
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent; color: transparent;
        }
        [data-site] .pzaz-btn {
          background: ${GRAD}; color: white; font-weight:600;
          box-shadow: 0 12px 30px -8px ${ACCENT}80, 0 4px 10px -2px ${ACCENT2}55;
          transition: transform .25s ease, box-shadow .25s ease;
        }
        [data-site] .pzaz-btn:hover { transform: translateY(-2px) scale(1.02); box-shadow: 0 20px 40px -10px ${ACCENT}aa, 0 8px 20px -4px ${ACCENT2}77; }
        [data-site] .grain::before {
          content:""; position:absolute; inset:0; pointer-events:none; opacity:.06; mix-blend-mode:multiply;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.6' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
        }
        @keyframes blobFloat { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(20px,-30px) scale(1.08)} }
        [data-site] .blob { animation: blobFloat 12s ease-in-out infinite; }
      `}</style>
      <Nav />
      <Hero />
      <TickerBar />
      <ModulesConstellation />
      <ModulesList />
      <SavingsSection />
      <ComparisonSection />
      <CtaSection />
      <Footer />
    </div>
  );
}

/* ---------------- NAV ---------------- */
function Nav() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md" style={{ background: `${CREAM}CC`, borderBottom: "1px solid rgba(15,20,32,0.08)" }}>
      <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/site" className="flex items-center gap-2">
          <LimnnMark />
          <span className="font-display text-xl">Limnn</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <a href="#modules" className="hover:opacity-60 transition">Modules</a>
          <a href="#savings" className="hover:opacity-60 transition">Savings</a>
          <a href="#compare" className="hover:opacity-60 transition">Compare</a>
        </nav>
        <a href="#modules" className="text-xs px-4 py-2 rounded-full text-white flex items-center gap-1.5" style={{ background: INK }}>
          <PlayCircle className="w-3.5 h-3.5"/> Try live demos
        </a>
      </div>
    </header>
  );
}

function LimnnMark() {
  return <img src={limnnLogo} alt="Limnn" className="h-7 w-auto" />;
}

/* ---------------- HERO — custom SVG constellation ---------------- */
function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start","end start"] });
  const y = useTransform(scrollYProgress, [0,1], [0, 120]);
  const reduce = useReducedMotion();

  // mouse parallax
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 60, damping: 15 });
  const smy = useSpring(my, { stiffness: 60, damping: 15 });

  return (
    <section ref={ref} className="relative overflow-hidden grain"
      onMouseMove={(e)=>{
        if(reduce) return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(((e.clientX - r.left)/r.width - 0.5)*30);
        my.set(((e.clientY - r.top)/r.height - 0.5)*30);
      }}>
      {/* Background editorial rules */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full opacity-[0.07]" viewBox="0 0 1400 900" preserveAspectRatio="none">
          {Array.from({length:14}).map((_,i)=><line key={i} x1={i*100} x2={i*100} y1={0} y2={900} stroke={INK} strokeWidth="0.5"/>)}
          {Array.from({length:9}).map((_,i)=><line key={"h"+i} x1={0} x2={1400} y1={i*100} y2={i*100} stroke={INK} strokeWidth="0.5"/>)}
        </svg>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 pt-16 pb-28 relative">
        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-12 items-center min-h-[720px]">
          {/* Left — copy */}
          <motion.div style={{ y }} className="relative z-10">
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border" style={{borderColor:`${INK}20`, background:`${INK}05`}}>
              <span className="w-1.5 h-1.5 rounded-full" style={{background:ACCENT}}/> One platform · Twelve modules · Zero seat-tax sprawl
            </div>

            <h1 className="mt-6 font-display text-[64px] md:text-[96px] leading-[0.92]">
              Take{" "}
              <span className="relative inline-block grad-text">
                control
                <svg className="absolute -bottom-3 left-0 w-full" viewBox="0 0 300 20" preserveAspectRatio="none">
                  <motion.path
                    d="M2 12 C 80 4, 180 20, 298 8"
                    stroke={ACCENT} strokeWidth="5" fill="none" strokeLinecap="round"
                    initial={{pathLength:0}} whileInView={{pathLength:1}} viewport={{once:true}} transition={{duration:1.4, delay:0.4, ease:EASE}}
                  />
                </svg>
              </span>.
              <br/>
              <span className="grad-text">Cut the software bill.</span>
            </h1>

            <p className="mt-8 text-lg max-w-[520px] font-medium" style={{color:`${INK}B0`}}>
              One AI-native operating system replaces Salesforce, Slack, Zendesk, Workday, Zuora, Jira and nine other line items — with one graph, one ledger, one login.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a href="#modules" className="pzaz-btn group inline-flex items-center gap-2 px-7 py-4 rounded-full text-sm">
                <PlayCircle className="w-4 h-4"/> Try a live demo
                <ArrowRight className="w-4 h-4 transition group-hover:translate-x-1"/>
              </a>
              <a href="#modules" className="text-sm font-semibold underline underline-offset-4 decoration-2" style={{textDecorationColor:ACCENT}}>See the 12 modules ↓</a>
            </div>

            <div className="mt-14 grid grid-cols-3 gap-6 max-w-[520px]">
              {[
                {k:"12", l:"Modules, one graph"},
                {k:"−89%", l:"Avg. tool spend cut"},
                {k:"1", l:"Login, one ledger"},
              ].map(s=>(
                <div key={s.l}>
                  <div className="font-display text-4xl" style={{color:ACCENT}}>{s.k}</div>
                  <div className="text-xs mt-1" style={{color:`${INK}80`}}>{s.l}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — Constellation art */}
          <motion.div style={{ x: smx, y: smy }} className="relative h-[600px]">
            <Constellation />
          </motion.div>
        </div>
      </div>

      {/* Bottom cut line */}
      <div className="border-t border-black/10"/>
    </section>
  );
}

/* Custom orbital constellation with all 12 modules */
function Constellation() {
  const reduce = useReducedMotion();
  const cx = 300, cy = 300;
  const orbits = [
    { r: 130, ids: ["threads","intelligence","dialer","sales"], speed: 40 },
    { r: 220, ids: ["marketing","cs","support","cpq"], speed: 60 },
    { r: 290, ids: ["billing","grid","learning","people"], speed: 80 },
  ];
  return (
    <div className="absolute inset-0">
      <svg viewBox="0 0 600 600" className="w-full h-full">
        <defs>
          <radialGradient id="core" cx="50%" cy="50%">
            <stop offset="0%" stopColor={ACCENT} stopOpacity="0.4"/>
            <stop offset="100%" stopColor={ACCENT} stopOpacity="0"/>
          </radialGradient>
          <filter id="glow"><feGaussianBlur stdDeviation="6"/></filter>
        </defs>
        {/* halo */}
        <circle cx={cx} cy={cy} r="280" fill="url(#core)"/>
        {/* orbit rings */}
        {orbits.map((o,i)=>(
          <circle key={i} cx={cx} cy={cy} r={o.r} fill="none" stroke={INK} strokeOpacity="0.12" strokeWidth="1" strokeDasharray="2 5"/>
        ))}
        {/* radial ticks */}
        {Array.from({length:60}).map((_,i)=>{
          const a=(i/60)*Math.PI*2;
          const r1=310, r2=320;
          return <line key={i} x1={cx+Math.cos(a)*r1} y1={cy+Math.sin(a)*r1} x2={cx+Math.cos(a)*r2} y2={cy+Math.sin(a)*r2} stroke={INK} strokeOpacity={i%5===0?0.4:0.15}/>;
        })}
        {/* center core — brand mark */}
        <circle cx={cx} cy={cy} r="64" fill={CREAM} stroke="#2C56D6" strokeWidth="2"/>
        <circle cx={cx} cy={cy} r="72" fill="none" stroke="#2C56D6" strokeWidth="1" strokeOpacity="0.35"/>
        <image href={limnnLogo} x={cx-28} y={cy-32} width="56" height="64" preserveAspectRatio="xMidYMid meet"/>
      </svg>

      {/* Orbits with real module icons — HTML so lucide renders crisp */}
      {orbits.map((orbit, oi)=>(
        <motion.div key={oi} className="absolute inset-0"
          animate={reduce?{}:{rotate: 360}}
          transition={{duration: orbit.speed, ease:"linear", repeat:Infinity}}
        >
          {orbit.ids.map((id, i)=>{
            const mod = SITE_MODULES.find(m=>m.id===id)!;
            const angle = (i/orbit.ids.length)*Math.PI*2 - Math.PI/2;
            const x = 50 + (Math.cos(angle)*orbit.r/6);
            const y = 50 + (Math.sin(angle)*orbit.r/6);
            return (
              <motion.div key={id}
                animate={reduce?{}:{rotate: -360}}
                transition={{duration: orbit.speed, ease:"linear", repeat:Infinity}}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{left:`${x}%`, top:`${y}%`}}
              >
                <Link to="/site/$moduleId" params={{moduleId: mod.id}}
                  className="group flex flex-col items-center">
                  <motion.div
                    whileHover={{scale:1.15, y:-2}}
                    className="w-12 h-12 rounded-2xl grid place-items-center shadow-[0_8px_20px_-8px_rgba(15,20,32,0.4)] border border-black/10"
                    style={{background:"white"}}
                  >
                    <mod.Icon className="w-5 h-5" style={{color:mod.color}}/>
                  </motion.div>
                  <div className="mt-1.5 text-[9px] uppercase tracking-widest opacity-70 whitespace-nowrap group-hover:opacity-100">
                    {mod.short}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      ))}
    </div>
  );
}

/* ---------------- Ticker ---------------- */
function TickerBar() {
  const replaced = ["Salesforce","Slack","Zendesk","Workday","Zuora","Jira","Gainsight","Marketo","Aircall","Gong","Greenhouse","PandaDoc","NetSuite","Rippling","Docebo","6sense","Intercom","BambooHR","Chargebee","DealHub"];
  const items = [...replaced, ...replaced];
  return (
    <section className="border-b border-black/10 overflow-hidden py-6" style={{background:INK, color:CREAM}}>
      <div className="flex items-center gap-8 text-[11px] uppercase tracking-[0.2em] mb-4 justify-center">
        <span className="opacity-50">Replaces</span>
        <span className="w-6 h-px bg-current opacity-30"/>
        <span>20+ line items on your SaaS ledger</span>
      </div>
      <div className="relative">
        <motion.div className="flex gap-10 whitespace-nowrap"
          animate={{x:[0,-2000]}} transition={{duration:60, repeat:Infinity, ease:"linear"}}>
          {items.map((n,i)=>(
            <span key={i} className="font-display text-3xl italic opacity-40 hover:opacity-100 transition">
              <span className="line-through decoration-[3px]" style={{textDecorationColor:ACCENT}}>{n}</span>
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- Modules constellation intro ---------------- */
function ModulesConstellation() {
  return (
    <section id="modules" className="max-w-[1400px] mx-auto px-6 py-32">
      <Reveal>
        <div className="grid md:grid-cols-[1fr_auto] items-end gap-8">
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] opacity-60 mb-4">§ 01 — The Twelve</div>
            <h2 className="font-display text-6xl md:text-7xl leading-[0.95] max-w-[900px]">
              Twelve modules.
              <br/>
              <span className="italic" style={{color:`${INK}70`}}>One graph beneath them all.</span>
            </h2>
          </div>
          <p className="text-sm max-w-sm opacity-70">Every module shares the same customers, people, records and ledger. No sync jobs. No zombie CSVs. No integration tax.</p>
        </div>
      </Reveal>
    </section>
  );
}

/* ---------------- Modules list — each row is dramatic ---------------- */
function ModulesList() {
  return (
    <section className="border-y border-black/10">
      {SITE_MODULES.map((m, i)=>(
        <ModuleRow key={m.id} m={m} index={i}/>
      ))}
    </section>
  );
}

function ModuleRow({ m, index }: { m: typeof SITE_MODULES[number]; index: number }) {
  const [hover, setHover] = useState(false);
  return (
    <Link to="/site/$moduleId" params={{moduleId:m.id}}
      onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
      className="group block relative overflow-hidden border-b border-black/10 last:border-0">
      <motion.div
        className="absolute inset-0 origin-left"
        initial={false}
        animate={{scaleX: hover?1:0}}
        transition={{duration:0.6, ease:EASE}}
        style={{background: m.color, opacity:0.08}}
      />
      <div className="relative max-w-[1400px] mx-auto px-6 py-10 grid grid-cols-[80px_1fr_auto_60px] gap-6 items-center">
        <div className="font-mono text-xs opacity-40">— {String(index+1).padStart(2,"0")}</div>
        <div className="flex items-center gap-6">
          <motion.div
            animate={{scale: hover?1.1:1, rotate: hover?-6:0}}
            transition={{duration:0.5, ease:EASE}}
            className="w-14 h-14 rounded-2xl grid place-items-center shrink-0 shadow-[0_10px_30px_-10px_rgba(15,20,32,0.3)]"
            style={{background:"white", border:`1px solid ${m.color}30`}}
          >
            <m.Icon className="w-6 h-6" style={{color:m.color}}/>
          </motion.div>
          <div className="min-w-0">
            <div className="font-display text-4xl md:text-5xl leading-none">{m.name}</div>
            <div className="mt-2 text-sm opacity-70 truncate">{m.tagline}</div>
          </div>
        </div>
        <div className="hidden lg:flex flex-wrap gap-1.5 justify-end max-w-md">
          <span className="text-[10px] uppercase tracking-widest opacity-40 w-full text-right mb-1">Replaces</span>
          {m.replaces.map(r=>(
            <span key={r} className="text-[11px] px-2 py-1 rounded-full border" style={{borderColor:`${INK}20`, background:CREAM}}>
              <span className="line-through opacity-60">{r}</span>
            </span>
          ))}
        </div>
        <motion.div animate={{x: hover?6:0}} transition={{duration:0.4, ease:EASE}}
          className="w-12 h-12 rounded-full grid place-items-center border border-black/20 justify-self-end">
          <ArrowUpRight className="w-5 h-5"/>
        </motion.div>
      </div>
    </Link>
  );
}

/* ---------------- Savings ---------------- */
function SavingsSection() {
  const tools = [
    {n:"Salesforce Sales Cloud", price:165},
    {n:"Slack Business+", price:15},
    {n:"Zendesk Suite", price:115},
    {n:"Workday HCM", price:100},
    {n:"Zuora Billing", price:70},
    {n:"Jira + Confluence", price:22},
    {n:"Gong", price:100},
    {n:"Marketo", price:80},
    {n:"Aircall", price:40},
    {n:"Greenhouse", price:60},
    {n:"Gainsight", price:90},
    {n:"PandaDoc", price:35},
  ];
  const total = tools.reduce((s,t)=>s+t.price,0);
  const limnn = 99;
  return (
    <section id="savings" className="max-w-[1400px] mx-auto px-6 py-32">
      <Reveal>
        <div className="text-[11px] uppercase tracking-[0.2em] opacity-60 mb-4">§ 02 — The Math</div>
        <h2 className="font-display text-6xl md:text-7xl leading-[0.95] max-w-3xl">
          Your CFO
          <br/>
          <span className="italic" style={{color:ACCENT}}>will send flowers.</span>
        </h2>
      </Reveal>

      <div className="mt-16 grid lg:grid-cols-2 gap-10">
        {/* Stack of tools */}
        <Reveal>
          <div className="rounded-2xl p-8" style={{background:"#EEE8DB"}}>
            <div className="flex items-center justify-between mb-6">
              <div className="text-xs uppercase tracking-widest opacity-60">Best-of-breed stack</div>
              <div className="font-display text-4xl">${total}<span className="text-sm opacity-60 font-sans">/seat/mo</span></div>
            </div>
            <div className="space-y-2">
              {tools.map((t,i)=>(
                <motion.div key={t.n} initial={{opacity:0, x:-10}} whileInView={{opacity:1, x:0}} viewport={{once:true}} transition={{delay:i*0.05}}
                  className="flex items-center justify-between text-sm py-2 border-b border-black/5">
                  <span className="line-through opacity-60">{t.n}</span>
                  <span className="font-mono opacity-60">${t.price}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="rounded-2xl p-8 text-white h-full flex flex-col relative overflow-hidden" style={{background:INK}}>
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-30" style={{background:`radial-gradient(circle, ${ACCENT}, transparent 70%)`}}/>
            <div className="text-xs uppercase tracking-widest opacity-60 mb-2">Limnn — everything</div>
            <div className="font-display text-[120px] leading-none">${limnn}<span className="text-2xl opacity-60 font-sans">/seat/mo</span></div>
            <div className="mt-6 h-2 rounded-full bg-white/10 overflow-hidden">
              <motion.div initial={{width:"100%"}} whileInView={{width:`${(limnn/total)*100}%`}} viewport={{once:true}} transition={{duration:1.4, ease:EASE}}
                className="h-full rounded-full" style={{background:ACCENT}}/>
            </div>
            <div className="mt-2 text-xs opacity-60 flex justify-between">
              <span>Limnn</span><span>Legacy stack</span>
            </div>
            <div className="mt-auto pt-10">
              <div className="text-sm opacity-70">You keep</div>
              <div className="font-display text-6xl" style={{color:ACCENT}}>${total-limnn}<span className="text-lg opacity-60 font-sans">/seat/mo</span></div>
              <div className="mt-2 text-xs opacity-60">On 500 seats, that's ${((total-limnn)*500*12/1000).toFixed(0)}k a year.</div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Compare table ---------------- */
function ComparisonSection() {
  const rows = [
    {c:"One graph across CRM, support, billing, HR", l:true, s:false, b:false},
    {c:"AI native — grounded on your data", l:true, s:false, b:false},
    {c:"No per-module seat tax", l:true, s:false, b:false},
    {c:"Consultants required to launch", l:false, s:true, b:true},
    {c:"Sync jobs between tools", l:false, s:true, b:true},
    {c:"6-month implementation", l:false, s:true, b:false},
    {c:"Kill 12+ SaaS contracts", l:true, s:false, b:false},
  ];
  return (
    <section id="compare" className="max-w-[1400px] mx-auto px-6 py-24">
      <Reveal>
        <div className="text-[11px] uppercase tracking-[0.2em] opacity-60 mb-4">§ 03 — Vs. the field</div>
        <h2 className="font-display text-5xl md:text-6xl leading-[0.95] max-w-3xl">
          One product. <span className="italic" style={{color:`${INK}70`}}>Not twelve tabs pretending.</span>
        </h2>
      </Reveal>
      <Reveal delay={0.15}>
        <div className="mt-12 rounded-2xl overflow-hidden border border-black/10">
          <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] text-xs uppercase tracking-widest px-6 py-4" style={{background:INK, color:CREAM}}>
            <div className="opacity-60">Capability</div>
            <div className="text-center font-medium" style={{color:ACCENT}}>Limnn</div>
            <div className="text-center opacity-60">Legacy suite</div>
            <div className="text-center opacity-60">Stitched stack</div>
          </div>
          {rows.map((r,i)=>(
            <div key={i} className={`grid grid-cols-[1.5fr_1fr_1fr_1fr] items-center px-6 py-5 text-sm ${i%2===0?"bg-white":"bg-[#FBF8F2]"}`}>
              <div>{r.c}</div>
              <div className="grid place-items-center">{r.l ? <Check className="w-5 h-5" style={{color:ACCENT}}/> : <X className="w-5 h-5 opacity-30"/>}</div>
              <div className="grid place-items-center opacity-60">{r.s ? <Check className="w-5 h-5"/> : <Minus className="w-5 h-5 opacity-30"/>}</div>
              <div className="grid place-items-center opacity-60">{r.b ? <Check className="w-5 h-5"/> : <Minus className="w-5 h-5 opacity-30"/>}</div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

/* ---------------- CTA ---------------- */
function CtaSection() {
  return (
    <section className="max-w-[1400px] mx-auto px-6 py-32">
      <div className="relative rounded-3xl overflow-hidden p-14 md:p-20 grain" style={{background:INK, color:CREAM}}>
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full" style={{background:`radial-gradient(circle, ${ACCENT}40, transparent 60%)`}}/>
        <div className="relative">
          <Sparkles className="w-6 h-6 mb-6" style={{color:ACCENT}}/>
          <h2 className="font-display text-6xl md:text-8xl leading-[0.95] max-w-4xl">
            One platform.
            <br/>
            <span className="italic opacity-70">One decision.</span>
          </h2>
          <p className="mt-8 max-w-lg opacity-70">Every module ships with a live in-browser demo. Click any of the 12 above to try it — no signup.</p>
          <a href="#modules" className="mt-10 inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-medium" style={{background:CREAM, color:INK}}>
            <PlayCircle className="w-4 h-4"/> Explore live demos <ArrowRight className="w-4 h-4"/>
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Footer ---------------- */
function Footer() {
  return (
    <footer className="border-t border-black/10 py-10 max-w-[1400px] mx-auto px-6 flex flex-wrap items-center gap-6 justify-between">
      <div className="flex items-center gap-2">
        <LimnnMark/>
        <span className="font-display text-lg">Limnn</span>
        <span className="text-xs opacity-50 ml-2">One platform. Less spend.</span>
      </div>
      <div className="text-xs opacity-50">© 2026 Limnn. Cut the SaaS bill.</div>
    </footer>
  );
}
