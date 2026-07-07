import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Sparkles } from "lucide-react";
import { SITE_MODULES, type SiteModule } from "@/lib/site-modules";
import { ModuleDemo, DemoWindow } from "@/components/site/module-demos";

export const Route = createFileRoute("/site/$moduleId")({
  loader: ({ params }) => {
    const mod = SITE_MODULES.find((m) => m.id === params.moduleId);
    if (!mod) throw notFound();
    return { mod };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Module not found — Limnn" }, { name: "robots", content: "noindex" }] };
    const { mod } = loaderData;
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

const INK = "#0F1420";
const CREAM = "#F6F1E6";
const ACCENT = "#E85D3A";
const EASE = [0.22, 1, 0.36, 1] as const;

function ModuleNotFound() {
  return (
    <div style={{ background: CREAM, color: INK }} className="min-h-screen grid place-items-center px-6">
      <div className="text-center">
        <div className="font-display text-6xl">Module not found</div>
        <Link to="/site" className="mt-6 inline-flex items-center gap-1 underline"><ArrowLeft className="h-4 w-4"/> Back</Link>
      </div>
    </div>
  );
}

function ModulePage() {
  const { mod } = Route.useLoaderData();
  return (
    <div style={{ background: CREAM, color: INK }} className="min-h-screen antialiased overflow-x-hidden">
      <style>{`
        .font-display { font-family: "Fraunces","Cormorant Garamond",ui-serif,Georgia,serif; letter-spacing:-0.02em; }
        .font-mono { font-family: "JetBrains Mono", ui-monospace, monospace; }
        body, html { font-family: "Söhne","Inter Tight",ui-sans-serif,system-ui,sans-serif; }
        .grain::before { content:""; position:absolute; inset:0; pointer-events:none; opacity:.06; mix-blend-mode:multiply; background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.6' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>"); }
      `}</style>
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
    <header className="sticky top-0 z-50 backdrop-blur-md border-b border-black/10" style={{background:`${CREAM}CC`}}>
      <div className="max-w-[1400px] mx-auto px-6 h-14 flex items-center gap-4">
        <Link to="/site" className="flex items-center gap-2 text-sm opacity-70 hover:opacity-100">
          <ArrowLeft className="w-4 h-4"/> <span className="font-display text-lg">Limnn</span>
        </Link>
        <div className="flex-1 overflow-x-auto scrollbar-none">
          <div className="flex gap-1 min-w-max">
            {SITE_MODULES.map(m=>(
              <Link key={m.id} to="/site/$moduleId" params={{moduleId:m.id}}
                className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition ${current===m.id?"text-white":"opacity-60 hover:opacity-100"}`}
                style={current===m.id?{background:m.color}:{}}>
                {m.short}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

function Hero({ mod }: { mod: SiteModule }) {
  const reduce = useReducedMotion();
  return (
    <section className="relative overflow-hidden grain">
      {/* massive color wash */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-25"
          style={{background:`radial-gradient(circle, ${mod.color}, transparent 60%)`}}/>
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full opacity-15"
          style={{background:`radial-gradient(circle, ${mod.color}, transparent 60%)`}}/>
      </div>
      <div className="relative max-w-[1400px] mx-auto px-6 pt-20 pb-16">
        <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.7,ease:EASE}}
          className="flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] opacity-60">
          <span className="w-1.5 h-1.5 rounded-full" style={{background:mod.color}}/>
          Module · {SITE_MODULES.findIndex(m=>m.id===mod.id)+1} of {SITE_MODULES.length}
        </motion.div>
        <div className="mt-4 flex items-start gap-6">
          <motion.div initial={{opacity:0, scale:0.8, rotate:-8}} animate={{opacity:1, scale:1, rotate:0}} transition={{duration:0.7,ease:EASE}}
            className="w-20 h-20 rounded-3xl grid place-items-center shrink-0 shadow-[0_20px_50px_-20px_rgba(15,20,32,0.4)]"
            style={{background:"white", border:`1px solid ${mod.color}30`}}>
            <mod.Icon className="w-9 h-9" style={{color:mod.color}}/>
          </motion.div>
          <div>
            <motion.h1 initial={{opacity:0, y:16}} animate={{opacity:1, y:0}} transition={{duration:0.7, delay:0.1, ease:EASE}}
              className="font-display text-6xl md:text-8xl leading-[0.9]">{mod.name}</motion.h1>
            <motion.p initial={{opacity:0, y:16}} animate={{opacity:1, y:0}} transition={{duration:0.7, delay:0.2, ease:EASE}}
              className="mt-4 font-display italic text-2xl md:text-3xl max-w-3xl" style={{color:`${INK}90`}}>
              {mod.tagline}
            </motion.p>
          </div>
        </div>

        {/* KPI strip */}
        <div className="mt-12 grid grid-cols-3 gap-6 max-w-2xl">
          {mod.mockKpis.map((k,i)=>(
            <motion.div key={k.label} initial={{opacity:0, y:12}} animate={{opacity:1, y:0}} transition={{duration:0.6, delay:0.35+i*0.1, ease:EASE}}>
              <div className="font-display text-4xl" style={{color:mod.color}}>{k.value}</div>
              <div className="text-xs uppercase tracking-widest opacity-60 mt-1">{k.label}</div>
              {k.delta && <div className="text-xs mt-0.5" style={{color:mod.color}}>{k.delta}</div>}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DemoSection({ mod }: { mod: SiteModule }) {
  return (
    <section className="max-w-[1400px] mx-auto px-6 pb-24">
      <div className="flex items-end justify-between mb-6">
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] opacity-60 mb-2">§ Live demo</div>
          <h2 className="font-display text-4xl md:text-5xl">See it work.</h2>
        </div>
        <div className="text-xs opacity-50 hidden md:block">Real interactions · not a screenshot</div>
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
    <section className="border-t border-black/10 py-24">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="text-[11px] uppercase tracking-[0.2em] opacity-60 mb-2">§ What's inside</div>
        <h2 className="font-display text-5xl md:text-6xl max-w-3xl">Built for the way your team actually works.</h2>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
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
        <div className="text-[11px] uppercase tracking-[0.2em] opacity-60 mb-2">§ How it works</div>
        <h2 className="font-display text-5xl md:text-6xl max-w-3xl">Three moves. That's it.</h2>
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
          <div className="text-[11px] uppercase tracking-[0.2em] opacity-60 mb-2">§ Cancel these</div>
          <h2 className="font-display text-5xl md:text-6xl leading-[0.95]">
            Kill the line items.
            <br/><span className="italic" style={{color:mod.color}}>Keep the outcome.</span>
          </h2>
          <p className="mt-6 opacity-70 max-w-md">{mod.name} is included in your Limnn seat. There's no add-on, no premium tier for the AI, no consultant to install.</p>
          <Link to="/" className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full text-white text-sm" style={{background:mod.color}}>
            Try it in the app <ArrowUpRight className="w-4 h-4"/>
          </Link>
        </div>
        <div className="flex flex-wrap gap-3">
          {mod.replaces.map((r,i)=>(
            <motion.div key={r} initial={{opacity:0, scale:0.9}} whileInView={{opacity:1, scale:1}} viewport={{once:true}} transition={{delay:i*0.1}}
              className="px-5 py-3 rounded-2xl border border-black/10 bg-white font-display text-2xl">
              <span className="line-through decoration-[3px]" style={{textDecorationColor:mod.color}}>{r}</span>
            </motion.div>
          ))}
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
              <div className="font-display text-3xl mt-1">{m.name}</div>
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
