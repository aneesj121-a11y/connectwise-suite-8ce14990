import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, PlayCircle, Sparkles } from "lucide-react";
import { SITE_MODULES, type SiteModule } from "@/lib/site-modules";
import { ModuleDemo, DemoWindow } from "@/components/site/module-demos";
import limnnLogo from "@/assets/limnn-logo.png";

export const Route = createFileRoute("/site/$moduleId")({
  loader: ({ params }) => {
    const mod = SITE_MODULES.find((m) => m.id === params.moduleId);
    if (!mod) throw notFound();
    return { moduleId: mod.id };
  },
  head: ({ loaderData }) => {
    const mod = loaderData ? SITE_MODULES.find((m) => m.id === loaderData.moduleId) : undefined;
    if (!mod) return { meta: [{ title: "Module not found — Limnn" }, { name: "robots", content: "noindex" }] };
    return {
      meta: [
        { title: `${mod.name} — ${mod.tagline}` },
        { name: "description", content: `${mod.tagline} Included in Limnn. Replaces ${mod.replaces.join(", ")}.` },
        { property: "og:title", content: `${mod.name} — Limnn` },
        { property: "og:description", content: mod.tagline },
        { property: "og:type", content: "website" },
      ],
    };
  },
  notFoundComponent: ModuleNotFound,
  component: ModulePage,
});

/* Palette — mirrors src/routes/site.index.tsx exactly */
const INK = "#0F1420";
const CREAM = "#EFE8D8";
const ACCENT = "#C2564A";
const ACCENT2 = "#6B4E8A";
const ACCENT3 = "#3E6B7A";
const GRAD = `linear-gradient(90deg, ${ACCENT} 0%, ${ACCENT2} 60%, ${ACCENT3} 100%)`;
const EASE = [0.22, 1, 0.36, 1] as const;

function ModuleNotFound() {
  return (
    <div data-site style={{ background: CREAM, color: INK }} className="min-h-screen grid place-items-center px-6">
      <SiteStyles />
      <div className="text-center">
        <div className="font-display text-6xl">Module not found.</div>
        <Link to="/site" className="mt-6 inline-flex items-center gap-1 underline"><ArrowLeft className="h-4 w-4"/> Back</Link>
      </div>
    </div>
  );
}

/* Shared style block — identical typography + utilities to the landing page */
function SiteStyles() {
  return (
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
        box-shadow: 0 10px 24px -10px ${ACCENT}66, 0 3px 8px -2px ${ACCENT2}33;
        transition: transform .25s ease, box-shadow .25s ease;
      }
      [data-site] .pzaz-btn:hover { transform: translateY(-2px) scale(1.02); box-shadow: 0 16px 32px -10px ${ACCENT}88, 0 6px 14px -4px ${ACCENT2}55; }
      [data-site] .grain::before {
        content:""; position:absolute; inset:0; pointer-events:none; opacity:.06; mix-blend-mode:multiply;
        background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.6' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
      }
      @keyframes blobFloat { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(20px,-30px) scale(1.08)} }
      [data-site] .blob { animation: blobFloat 12s ease-in-out infinite; }
    `}</style>
  );
}

function ModulePage() {
  const { moduleId } = Route.useLoaderData();
  const mod = SITE_MODULES.find((m) => m.id === moduleId)!;
  return (
    <div data-site style={{ background: CREAM, color: INK }} className="min-h-screen antialiased overflow-x-hidden">
      <SiteStyles />
      <SubNav current={mod.id}/>
      <Hero mod={mod}/>
      <DemoSection mod={mod}/>
      <Features mod={mod}/>
      <Workflow mod={mod}/>
      <Replaces mod={mod}/>
      <ModulePager current={mod.id}/>
      <Footer/>
    </div>
  );
}

function SubNav({ current }: { current: string }) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md" style={{ background: `${CREAM}CC`, borderBottom: "1px solid rgba(15,20,32,0.08)" }}>
      <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center gap-4">
        <Link to="/site" className="flex items-center gap-2 shrink-0">
          <img src={limnnLogo} alt="Limnn" className="h-7 w-auto" />
          <span className="font-display text-xl">Limnn</span>
        </Link>
        <div className="hidden md:flex items-center text-xs opacity-50 mx-3">
          <span className="w-6 h-px bg-current opacity-40 mr-3"/> Module
        </div>
        <div className="flex-1 overflow-x-auto scrollbar-none">
          <div className="flex gap-1.5 min-w-max">
            {SITE_MODULES.map(m=>(
              <Link key={m.id} to="/site/$moduleId" params={{moduleId:m.id}}
                className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap font-medium transition ${current===m.id?"text-white shadow-sm":"opacity-60 hover:opacity-100"}`}
                style={current===m.id?{background:GRAD}:{}}>
                {m.short}
              </Link>
            ))}
          </div>
        </div>
        <a href="#demo" className="pzaz-btn text-xs px-5 py-2.5 rounded-full hidden md:inline-flex items-center gap-1.5 shrink-0">
          <PlayCircle className="w-3.5 h-3.5"/> Live demo
        </a>
      </div>
    </header>
  );
}

function Hero({ mod }: { mod: SiteModule }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start","end start"] });
  const y = useTransform(scrollYProgress, [0,1], [0, 100]);
  const idx = SITE_MODULES.findIndex(m=>m.id===mod.id)+1;

  return (
    <section ref={ref} className="relative overflow-hidden grain">
      {/* Editorial rules */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full opacity-[0.06]" viewBox="0 0 1400 900" preserveAspectRatio="none">
          {Array.from({length:14}).map((_,i)=><line key={i} x1={i*100} x2={i*100} y1={0} y2={900} stroke={INK} strokeWidth="0.5"/>)}
          {Array.from({length:9}).map((_,i)=><line key={"h"+i} x1={0} x2={1400} y1={i*100} y2={i*100} stroke={INK} strokeWidth="0.5"/>)}
        </svg>
      </div>
      {/* Floating blobs — same as landing but tinted with the module color */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="blob absolute -top-24 -left-16 w-[420px] h-[420px] rounded-full opacity-25" style={{background:`radial-gradient(circle, ${ACCENT}, transparent 70%)`, filter:"blur(60px)"}}/>
        <div className="blob absolute top-20 right-10 w-[380px] h-[380px] rounded-full opacity-20" style={{background:`radial-gradient(circle, ${mod.color}, transparent 70%)`, filter:"blur(70px)", animationDelay:"-4s"}}/>
        <div className="blob absolute bottom-0 left-1/3 w-[340px] h-[340px] rounded-full opacity-15" style={{background:`radial-gradient(circle, ${ACCENT3}, transparent 70%)`, filter:"blur(80px)", animationDelay:"-8s"}}/>
      </div>

      <motion.div style={{ y }} className="relative max-w-[1400px] mx-auto px-6 pt-20 pb-24">
        <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:0.6,ease:EASE}}
          className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border" style={{borderColor:`${INK}20`, background:`${INK}05`}}>
          <span className="w-1.5 h-1.5 rounded-full" style={{background:mod.color}}/>
          Module {String(idx).padStart(2,"0")} of {String(SITE_MODULES.length).padStart(2,"0")}
        </motion.div>

        <div className="mt-6 flex items-start gap-6">
          <motion.div initial={{opacity:0, scale:0.8, rotate:-8}} animate={{opacity:1, scale:1, rotate:0}} transition={{duration:0.7,ease:EASE}}
            className="w-20 h-20 rounded-3xl grid place-items-center shrink-0 shadow-[0_20px_50px_-20px_rgba(15,20,32,0.4)]"
            style={{background:"white", border:`1px solid ${mod.color}30`}}>
            <mod.Icon className="w-9 h-9" style={{color:mod.color}}/>
          </motion.div>
          <div className="min-w-0">
            <motion.h1 initial={{opacity:0, y:16}} animate={{opacity:1, y:0}} transition={{duration:0.7, delay:0.1, ease:EASE}}
              className="font-display text-[56px] md:text-[92px] leading-[0.92]">
              {mod.name.replace(/^Limnn\s+/, "")}
              <span className="grad-text">.</span>
            </motion.h1>
            <motion.p initial={{opacity:0, y:16}} animate={{opacity:1, y:0}} transition={{duration:0.7, delay:0.2, ease:EASE}}
              className="mt-5 text-xl md:text-2xl max-w-3xl font-medium" style={{color:`${INK}B0`}}>
              {mod.tagline}
            </motion.p>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-4">
          <a href="#demo" className="pzaz-btn group inline-flex items-center gap-2 px-7 py-4 rounded-full text-sm">
            <PlayCircle className="w-4 h-4"/> Try the live demo
            <ArrowRight className="w-4 h-4 transition group-hover:translate-x-1"/>
          </a>
          <a href="#features" className="text-sm font-semibold underline underline-offset-4 decoration-2" style={{textDecorationColor:mod.color}}>
            What's inside ↓
          </a>
        </div>

        {/* KPI strip */}
        <div className="mt-16 grid grid-cols-3 gap-6 max-w-2xl">
          {mod.mockKpis.map((k,i)=>(
            <motion.div key={k.label} initial={{opacity:0, y:12}} animate={{opacity:1, y:0}} transition={{duration:0.6, delay:0.35+i*0.1, ease:EASE}}>
              <div className="font-display text-5xl grad-text">{k.value}</div>
              <div className="text-xs uppercase tracking-widest opacity-60 mt-1">{k.label}</div>
              {k.delta && <div className="text-xs mt-0.5 font-medium" style={{color:mod.color}}>{k.delta}</div>}
            </motion.div>
          ))}
        </div>
      </motion.div>
      <div className="border-t border-black/10"/>
    </section>
  );
}

function DemoSection({ mod }: { mod: SiteModule }) {
  return (
    <section id="demo" className="max-w-[1400px] mx-auto px-6 py-24 scroll-mt-20">
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] opacity-60 mb-3">§ Live demo</div>
          <h2 className="font-display text-5xl md:text-6xl leading-[0.95]">
            See it <span className="grad-text">work</span>.
          </h2>
        </div>
        <div className="text-xs opacity-50 hidden md:block max-w-xs text-right">Real interactions. Not a screenshot, not a video — the module running in your browser.</div>
      </div>
      <motion.div initial={{opacity:0, y:24}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration:0.8, ease:EASE}}>
        <DemoWindow color={mod.color} label={`limnn · ${mod.short.toLowerCase()}`}>
          <ModuleDemo id={mod.id} color={mod.color}/>
        </DemoWindow>
      </motion.div>
    </section>
  );
}

function Features({ mod }: { mod: SiteModule }) {
  return (
    <section id="features" className="border-t border-black/10 py-24">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="text-[11px] uppercase tracking-[0.2em] opacity-60 mb-3">§ What's inside</div>
        <h2 className="font-display text-5xl md:text-6xl max-w-3xl leading-[0.95]">
          Built for the way your team <span className="grad-text">actually works</span>.
        </h2>
        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {mod.features.map((f,i)=>(
            <motion.div key={f.title} initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration:0.6, delay:i*0.1, ease:EASE}}
              className="p-8 rounded-2xl border border-black/10 bg-white relative overflow-hidden group">
              <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full opacity-0 group-hover:opacity-20 transition-opacity"
                style={{background:`radial-gradient(circle, ${mod.color}, transparent)`}}/>
              <div className="font-mono text-xs opacity-40">— 0{i+1}</div>
              <div className="font-display text-2xl mt-3">{f.title}</div>
              <div className="mt-3 text-sm opacity-70 leading-relaxed">{f.body}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Workflow({ mod }: { mod: SiteModule }) {
  return (
    <section className="py-24" style={{background:INK, color:CREAM}}>
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="text-[11px] uppercase tracking-[0.2em] opacity-60 mb-3">§ How it works</div>
        <h2 className="font-display text-5xl md:text-6xl max-w-3xl leading-[0.95]">Three moves. That's it.</h2>
        <div className="mt-16 grid md:grid-cols-3 gap-8 relative">
          {mod.workflow.map((w,i)=>(
            <motion.div key={w.step} initial={{opacity:0, y:24}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration:0.6, delay:i*0.15, ease:EASE}}
              className="relative">
              <div className="font-display text-8xl opacity-30" style={{color:mod.color}}>{w.step}</div>
              <div className="mt-2 font-display text-3xl">{w.title}</div>
              <div className="mt-3 text-sm opacity-70 leading-relaxed">{w.body}</div>
              {i<mod.workflow.length-1 && (
                <div className="hidden md:block absolute top-16 -right-4 opacity-30">
                  <ArrowRight className="w-6 h-6"/>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Replaces({ mod }: { mod: SiteModule }) {
  return (
    <section className="py-24 max-w-[1400px] mx-auto px-6">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] opacity-60 mb-3">§ Cancel these</div>
          <h2 className="font-display text-5xl md:text-6xl leading-[0.95]">
            Kill the line items.
            <br/><span className="grad-text">Keep the outcome.</span>
          </h2>
          <p className="mt-6 opacity-70 max-w-md">{mod.name} is included in your Limnn seat. No add-on, no premium AI tier, no consultant to install.</p>
          <a href="#demo" className="pzaz-btn mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm">
            See it live in the demo <ArrowUpRight className="w-4 h-4"/>
          </a>
        </div>
        <div className="flex flex-wrap gap-3">
          {mod.replaces.map((r,i)=>(
            <motion.div key={r} initial={{opacity:0, scale:0.9}} whileInView={{opacity:1, scale:1}} viewport={{once:true}} transition={{delay:i*0.1}}
              className="px-5 py-3 rounded-2xl border border-black/10 bg-white font-display text-2xl">
              <span className="line-through decoration-[3px]" style={{textDecorationColor:mod.color}}>{r}</span>
            </motion.div>
          ))}
          <div className="px-5 py-3 rounded-2xl font-display text-2xl pzaz-btn inline-flex items-center gap-2">
            <Sparkles className="w-5 h-5"/> Limnn
          </div>
        </div>
      </div>
    </section>
  );
}

function ModulePager({ current }: { current: string }) {
  const idx = SITE_MODULES.findIndex(m=>m.id===current);
  const prev = SITE_MODULES[(idx-1+SITE_MODULES.length)%SITE_MODULES.length];
  const next = SITE_MODULES[(idx+1)%SITE_MODULES.length];
  return (
    <section className="border-t border-black/10">
      <div className="max-w-[1400px] mx-auto grid grid-cols-2">
        {[{m:prev, dir:"prev"},{m:next, dir:"next"}].map(({m, dir})=>(
          <Link key={m.id} to="/site/$moduleId" params={{moduleId:m.id}}
            className={`group p-10 flex items-center gap-4 hover:bg-white/60 transition ${dir==="next"?"justify-end text-right border-l border-black/10":""}`}>
            {dir==="prev" && <ArrowLeft className="w-5 h-5 opacity-40 group-hover:opacity-100 group-hover:-translate-x-1 transition"/>}
            <div>
              <div className="text-xs uppercase tracking-widest opacity-50">{dir==="prev"?"Previous":"Next"}</div>
              <div className="font-display text-3xl mt-1">{m.name.replace(/^Limnn\s+/, "")}</div>
            </div>
            {dir==="next" && <ArrowRight className="w-5 h-5 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition"/>}
          </Link>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-black/10 py-8 text-center text-xs opacity-50">
      <Link to="/site" className="underline underline-offset-4">← Back to Limnn overview</Link>
    </footer>
  );
}
