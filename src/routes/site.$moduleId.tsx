import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Sparkles, Play } from "lucide-react";
import limnnLogo from "@/assets/limnn-logo.png";
import { SITE_MODULES, type SiteModule } from "@/lib/site-modules";

export const Route = createFileRoute("/site/$moduleId")({
  loader: ({ params }) => {
    const mod = SITE_MODULES.find((m) => m.id === params.moduleId);
    if (!mod) throw notFound();
    return { mod };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Module not found — Limnn" }, { name: "robots", content: "noindex" }] };
    }
    const { mod } = loaderData;
    return {
      meta: [
        { title: `${mod.name} — ${mod.tagline}` },
        { name: "description", content: `${mod.tagline} Included in Limnn. Replaces ${mod.replaces.join(", ")}.` },
        { property: "og:title", content: `${mod.name} — Limnn` },
        { property: "og:description", content: mod.tagline },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
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
        <div className="font-serif text-6xl">Module not found</div>
        <Link to="/site" className="mt-6 inline-flex items-center gap-1 underline">
          <ArrowLeft className="h-4 w-4" /> Back to overview
        </Link>
      </div>
    </div>
  );
}

function ModulePage() {
  const { mod } = Route.useLoaderData();
  return (
    <div style={{ background: CREAM, color: INK }} className="min-h-screen font-sans antialiased overflow-x-hidden">
      <SubNav current={mod.id} />
      <Hero mod={mod} />
      <Features mod={mod} />
      <MockPreview mod={mod} />
      <Workflow mod={mod} />
      <Replaces mod={mod} />
      <NextPrev current={mod.id} />
      <Footer />
    </div>
  );
}

/* ---------------- Sticky sub-nav with all modules ---------------- */
function SubNav({ current }: { current: string }) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md" style={{ background: `${CREAM}dd`, borderBottom: `1px solid ${INK}14` }}>
      <div className="mx-auto max-w-[1240px] px-6 h-14 flex items-center gap-4">
        <Link to="/site" className="flex items-center gap-2 shrink-0">
          <div className="h-7 w-7 rounded-md grid place-items-center" style={{ background: INK }}>
            <img src={limnnLogo} alt="Limnn" className="h-3.5 w-auto invert" />
          </div>
          <span className="font-display font-semibold tracking-tight">limnn</span>
        </Link>
        <span className="text-black/30">/</span>
        <div className="flex-1 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 min-w-max">
            {SITE_MODULES.map((m) => {
              const active = m.id === current;
              return (
                <Link
                  key={m.id}
                  to="/site/$moduleId"
                  params={{ moduleId: m.id }}
                  className="text-xs px-2.5 h-7 rounded-full inline-flex items-center gap-1.5 transition"
                  style={{
                    background: active ? m.color : "transparent",
                    color: active ? "white" : `${INK}99`,
                    border: `1px solid ${active ? m.color : INK + "14"}`,
                  }}
                >
                  <m.Icon className="h-3 w-3" />
                  {m.short}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none} .no-scrollbar{scrollbar-width:none}`}</style>
    </header>
  );
}

/* ---------------- Hero ---------------- */
function Hero({ mod }: { mod: SiteModule }) {
  const reduce = useReducedMotion();
  return (
    <section className="relative overflow-hidden">
      {/* animated color wash */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 800px 400px at 20% 0%, ${mod.color}22, transparent 60%), radial-gradient(ellipse 600px 400px at 90% 10%, ${mod.color}18, transparent 60%)`,
        }}
      />
      {!reduce && (
        <motion.div
          aria-hidden
          animate={{ y: [0, 20, 0], rotate: [0, 4, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-24 -right-24 h-96 w-96 rounded-full blur-3xl opacity-40"
          style={{ background: mod.color }}
        />
      )}

      <div className="relative mx-auto max-w-[1240px] px-6 pt-16 pb-20">
        <Link to="/site" className="inline-flex items-center gap-1 text-sm text-black/60 hover:text-black transition">
          <ArrowLeft className="h-4 w-4" /> All modules
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mt-8 inline-flex items-center gap-2 px-3 h-7 rounded-full text-[11px] font-mono uppercase tracking-[0.14em]"
          style={{ background: `${mod.color}18`, color: mod.color }}
        >
          <mod.Icon className="h-3.5 w-3.5" /> {mod.short} · included in Limnn
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
          className="mt-6 font-serif font-normal leading-[0.95] tracking-[-0.02em]"
          style={{ fontSize: "clamp(44px, 7vw, 108px)" }}
        >
          {mod.name.replace("Limnn ", "")}.
          <br />
          <span className="italic" style={{ color: mod.color }}>{mod.tagline.replace(/\.$/, "")}.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-8 max-w-2xl text-lg md:text-xl leading-relaxed text-black/70"
        >
          {mod.features[0].body}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-10 flex flex-wrap gap-3 items-center"
        >
          <Link
            to={mod.route}
            className="inline-flex h-12 items-center gap-2 px-6 rounded-md text-base font-medium text-white hover:scale-[1.02] transition-transform"
            style={{ background: INK }}
          >
            Open {mod.short} <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#preview"
            className="inline-flex h-12 items-center gap-2 px-6 rounded-md text-base font-medium border hover:bg-black/5 transition"
            style={{ borderColor: `${INK}22` }}
          >
            <Play className="h-4 w-4" style={{ color: mod.color }} /> Watch demo
          </a>
          <span className="text-sm text-black/50">
            Replaces{" "}
            <b className="text-black/80">{mod.replaces.slice(0, 3).join(", ")}</b>
          </span>
        </motion.div>

        {/* KPI strip */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.5 } } }}
          className="mt-14 grid grid-cols-3 gap-6 max-w-2xl"
        >
          {mod.mockKpis.map((k) => (
            <motion.div
              key={k.label}
              variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
              className="rounded-xl p-4 border"
              style={{ borderColor: `${INK}14`, background: "white" }}
            >
              <div className="text-[10px] uppercase tracking-[0.14em] text-black/50">{k.label}</div>
              <div className="mt-1 flex items-baseline gap-2">
                <div className="font-serif text-3xl" style={{ color: INK }}>{k.value}</div>
                {k.delta && <span className="text-xs font-mono" style={{ color: mod.color }}>{k.delta}</span>}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- Features ---------------- */
function Features({ mod }: { mod: SiteModule }) {
  return (
    <section className="py-24 border-t" style={{ borderColor: `${INK}12` }}>
      <div className="mx-auto max-w-[1240px] px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-black/50 mb-3">Why {mod.short}</div>
          <h2 className="font-serif text-5xl md:text-6xl leading-[0.95] tracking-tight max-w-3xl">
            Purpose-built.<br /><span className="italic opacity-60">Not bolted on.</span>
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
          className="mt-12 grid md:grid-cols-3 gap-6"
        >
          {mod.features.map((f, i) => (
            <motion.article
              key={f.title}
              variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } }}
              whileHover={{ y: -6 }}
              className="rounded-2xl p-6 border relative overflow-hidden"
              style={{ borderColor: `${INK}14`, background: "white" }}
            >
              <div
                className="absolute inset-x-0 top-0 h-1"
                style={{ background: mod.color, opacity: 0.9 }}
              />
              <div
                className="h-10 w-10 rounded-md grid place-items-center mb-4"
                style={{ background: `${mod.color}14`, color: mod.color }}
              >
                <span className="font-mono text-xs">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="font-display text-xl font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-black/70 leading-relaxed">{f.body}</p>
            </motion.article>
          ))}
        </motion.div>

        {/* Bullet checklist */}
        <motion.ul
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
          className="mt-10 grid sm:grid-cols-2 md:grid-cols-3 gap-3"
        >
          {mod.bullets.map((b) => (
            <motion.li
              key={b}
              variants={{ hidden: { opacity: 0, x: -8 }, show: { opacity: 1, x: 0 } }}
              className="flex items-start gap-2 text-sm"
            >
              <Check className="h-4 w-4 mt-0.5 shrink-0" style={{ color: mod.color }} /> {b}
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

/* ---------------- Animated mock product preview ---------------- */
function MockPreview({ mod }: { mod: SiteModule }) {
  return (
    <section id="preview" className="py-24" style={{ background: INK, color: CREAM }}>
      <div className="mx-auto max-w-[1240px] px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <div className="text-[11px] font-mono uppercase tracking-[0.18em] opacity-60 mb-3">Live in the product</div>
          <h2 className="font-serif text-5xl md:text-6xl leading-[0.95] tracking-tight max-w-3xl">
            A look inside <span className="italic" style={{ color: mod.color }}>{mod.short}</span>.
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40, rotateX: 6 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: EASE }}
          style={{ transformPerspective: 1200 }}
          className="mt-12 rounded-2xl border overflow-hidden"
        >
          <div style={{ background: "#ffffff05", borderColor: "#ffffff14" }} className="border rounded-2xl">
            {/* mock window chrome */}
            <div className="flex items-center gap-2 px-4 h-10 border-b" style={{ borderColor: "#ffffff14" }}>
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#ff5f56" }} />
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#ffbd2e" }} />
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#27c93f" }} />
              <div className="mx-auto text-[10px] font-mono opacity-50">limnn.app / {mod.id}</div>
            </div>

            <div className="grid md:grid-cols-[220px_1fr] min-h-[420px]">
              {/* fake sidebar */}
              <div className="p-4 border-r space-y-1" style={{ borderColor: "#ffffff10" }}>
                <div className="text-[10px] uppercase tracking-[0.14em] opacity-50 mb-2">Menu</div>
                {SITE_MODULES.slice(0, 6).map((m) => {
                  const active = m.id === mod.id;
                  return (
                    <div
                      key={m.id}
                      className="flex items-center gap-2 h-8 px-2 rounded-md text-xs"
                      style={{
                        background: active ? `${mod.color}22` : "transparent",
                        color: active ? mod.color : "#ffffff99",
                      }}
                    >
                      <m.Icon className="h-3.5 w-3.5" />
                      {m.short}
                    </div>
                  );
                })}
              </div>

              {/* fake body */}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <span className="h-8 w-8 rounded-md grid place-items-center" style={{ background: `${mod.color}22`, color: mod.color }}>
                    <mod.Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="font-display text-lg font-semibold">{mod.short}</div>
                    <div className="text-[11px] opacity-60">{mod.tagline}</div>
                  </div>
                </div>

                {/* kpi row */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {mod.mockKpis.map((k) => (
                    <div key={k.label} className="rounded-lg p-3 border" style={{ borderColor: "#ffffff14", background: "#ffffff05" }}>
                      <div className="text-[9px] uppercase tracking-[0.14em] opacity-60">{k.label}</div>
                      <div className="font-serif text-xl mt-0.5">{k.value}</div>
                      {k.delta && <div className="text-[10px] font-mono" style={{ color: mod.color }}>{k.delta}</div>}
                    </div>
                  ))}
                </div>

                {/* animated rows */}
                <motion.ul
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } } }}
                  className="rounded-lg border divide-y"
                  style={{ borderColor: "#ffffff14" }}
                >
                  {mod.mockRows.map((r) => (
                    <motion.li
                      key={r.primary}
                      variants={{ hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE } } }}
                      className="flex items-center gap-3 px-4 py-3 text-sm"
                      style={{ borderColor: "#ffffff10" }}
                    >
                      <span className="h-2 w-2 rounded-full" style={{ background: mod.color }} />
                      <div className="flex-1">
                        <div className="font-medium">{r.primary}</div>
                        <div className="text-[11px] opacity-60">{r.secondary}</div>
                      </div>
                      <span
                        className="text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded"
                        style={{ background: `${mod.color}22`, color: mod.color }}
                      >
                        {r.tag}
                      </span>
                    </motion.li>
                  ))}
                </motion.ul>

                {/* fake AI panel */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="mt-5 rounded-lg p-3 flex items-start gap-3 border"
                  style={{ borderColor: `${mod.color}44`, background: `${mod.color}10` }}
                >
                  <span className="h-6 w-6 rounded grid place-items-center shrink-0" style={{ background: mod.color, color: "white" }}>
                    <Sparkles className="h-3 w-3" />
                  </span>
                  <div className="text-[12px] opacity-90 leading-relaxed">
                    <b>Limnn AI:</b> {mod.features[1].body}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- Workflow ---------------- */
function Workflow({ mod }: { mod: SiteModule }) {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-[1240px] px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-black/50 mb-3">How it works</div>
          <h2 className="font-serif text-5xl md:text-6xl leading-[0.95] tracking-tight max-w-3xl">
            Three steps.<br /><span className="italic opacity-60">One system of record.</span>
          </h2>
        </motion.div>

        <div className="mt-14 grid md:grid-cols-3 gap-6 relative">
          {/* animated connector line on desktop */}
          <motion.div
            aria-hidden
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: EASE, delay: 0.2 }}
            className="hidden md:block absolute top-8 left-[8%] right-[8%] h-px origin-left"
            style={{ background: `linear-gradient(90deg, transparent, ${mod.color}55, transparent)` }}
          />
          {mod.workflow.map((w, i) => (
            <motion.div
              key={w.step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.15 + i * 0.12 }}
              className="relative"
            >
              <div
                className="h-16 w-16 rounded-full grid place-items-center font-serif text-2xl relative z-10 mx-auto"
                style={{
                  background: "white",
                  color: mod.color,
                  border: `2px solid ${mod.color}`,
                }}
              >
                {w.step}
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold text-center">{w.title}</h3>
              <p className="mt-2 text-sm text-black/70 leading-relaxed text-center">{w.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Replaces marquee ---------------- */
function Replaces({ mod }: { mod: SiteModule }) {
  const items = [...mod.replaces, ...mod.replaces, ...mod.replaces];
  return (
    <section className="py-14 border-y" style={{ background: INK, color: CREAM, borderColor: "#ffffff14" }}>
      <div className="text-center text-[11px] uppercase tracking-[0.2em] opacity-60 mb-4">
        {mod.short} replaces
      </div>
      <div className="overflow-hidden">
        <div className="flex gap-10 animate-[scroll_35s_linear_infinite] whitespace-nowrap font-serif text-3xl md:text-4xl">
          {items.map((t, i) => (
            <span key={i} className="flex items-center gap-10 opacity-80">
              <span className="line-through decoration-[3px]" style={{ textDecorationColor: mod.color }}>{t}</span>
              <span className="text-lg" style={{ color: mod.color }}>×</span>
            </span>
          ))}
        </div>
      </div>
      <style>{`@keyframes scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </section>
  );
}

/* ---------------- Next / prev ---------------- */
function NextPrev({ current }: { current: string }) {
  const idx = SITE_MODULES.findIndex((m) => m.id === current);
  const prev = SITE_MODULES[(idx - 1 + SITE_MODULES.length) % SITE_MODULES.length];
  const next = SITE_MODULES[(idx + 1) % SITE_MODULES.length];
  return (
    <section className="py-20">
      <div className="mx-auto max-w-[1240px] px-6 grid md:grid-cols-2 gap-4">
        {[
          { m: prev, label: "Previous module", align: "left" as const },
          { m: next, label: "Next module", align: "right" as const },
        ].map(({ m, label, align }) => (
          <Link
            key={m.id}
            to="/site/$moduleId"
            params={{ moduleId: m.id }}
            className="group rounded-2xl p-6 border transition hover:-translate-y-1"
            style={{ borderColor: `${INK}14`, background: "white" }}
          >
            <div className={`flex items-center gap-3 ${align === "right" ? "justify-end text-right" : ""}`}>
              {align === "left" && <ArrowLeft className="h-4 w-4 opacity-60 group-hover:-translate-x-1 transition" />}
              <div className="text-[10px] uppercase tracking-[0.14em] text-black/50">{label}</div>
              {align === "right" && <ArrowRight className="h-4 w-4 opacity-60 group-hover:translate-x-1 transition" />}
            </div>
            <div className={`mt-2 flex items-center gap-3 ${align === "right" ? "justify-end" : ""}`}>
              <span className="h-9 w-9 rounded-md grid place-items-center" style={{ background: `${m.color}18`, color: m.color }}>
                <m.Icon className="h-4 w-4" />
              </span>
              <span className="font-display text-2xl font-semibold">{m.name}</span>
            </div>
            <p className={`mt-2 text-sm text-black/60 ${align === "right" ? "text-right" : ""}`}>{m.tagline}</p>
          </Link>
        ))}
      </div>

      <div className="mx-auto max-w-[1240px] px-6 mt-10">
        <Link to="/site" className="inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4">
          <ArrowLeft className="h-4 w-4" /> All twelve modules
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="pt-16 pb-10 border-t" style={{ borderColor: `${INK}14` }}>
      <div className="mx-auto max-w-[1240px] px-6 flex flex-wrap items-center justify-between gap-4 text-xs text-black/50">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md grid place-items-center" style={{ background: INK }}>
            <img src={limnnLogo} alt="Limnn" className="h-3.5 w-auto invert" />
          </div>
          <span className="font-display font-semibold tracking-tight text-black">limnn</span>
          <span>· © {new Date().getFullYear()}</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/site" className="hover:opacity-70">Platform</Link>
          <a href="#" className="hover:opacity-70">Security</a>
          <a href="#" className="hover:opacity-70">Contact</a>
          <Link to="/" className="hover:opacity-70 inline-flex items-center gap-1">Open app <ArrowUpRight className="h-3 w-3" /></Link>
        </div>
      </div>
    </footer>
  );
}
