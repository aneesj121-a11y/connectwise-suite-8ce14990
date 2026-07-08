import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Phone, PhoneOff, Sparkles, Send, Mic, Radio, TrendingUp, AlertTriangle,
  CheckCircle2, DollarSign, Users, GitBranch, Award, Target,
  MessageSquare, FileText, Wallet, LifeBuoy, LayoutGrid, GraduationCap,
  HeartHandshake, Megaphone, Play, Pause,
} from "lucide-react";

/* ============================================================
   Shared demo chrome — a "product window" every demo lives in
   ============================================================ */
export function DemoWindow({
  color, label, children,
}: { color: string; label: string; children: React.ReactNode }) {
  const workspace = label.replace(/^limnn\s*·\s*/i, "");
  return (
    <div className="relative rounded-2xl overflow-hidden border border-black/10 bg-white shadow-[0_40px_100px_-40px_rgba(15,20,32,0.35)]">
      {/* Title bar */}
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-black/[0.06] bg-gradient-to-b from-[#F1EADB] to-[#EFE8D8]">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#FF5F57] shadow-inner" />
          <div className="w-3 h-3 rounded-full bg-[#FEBC2E] shadow-inner" />
          <div className="w-3 h-3 rounded-full bg-[#28C840] shadow-inner" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-black/[0.04] border border-black/5 text-[11px] text-black/60 font-mono max-w-xl w-full justify-center">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
            <span className="opacity-40">app.limnn.com/</span>
            <span className="font-semibold text-black/70">{workspace}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-black/40">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live
        </div>
      </div>
      {/* Tab strip */}
      <div className="flex items-center gap-1 px-3 pt-1.5 border-b border-black/[0.06] bg-[#FBF8F2] text-[11px]">
        <div className="px-3 py-1.5 rounded-t-md border border-b-0 border-black/[0.08] bg-white font-medium flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
          {workspace}
        </div>
        <div className="px-3 py-1.5 text-black/40">Inbox</div>
        <div className="px-3 py-1.5 text-black/40">Reports</div>
        <div className="ml-auto text-black/40 pr-1">⌘K</div>
      </div>
      <div className="relative">{children}</div>
      {/* Status footer */}
      <div className="flex items-center gap-4 px-4 py-2 border-t border-black/[0.06] bg-[#FBF8F2] text-[10px] uppercase tracking-widest text-black/40">
        <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} /> Limnn OS · v4.2</span>
        <span>· One graph · One ledger · One login</span>
        <span className="ml-auto">Synced 2s ago</span>
      </div>
    </div>
  );
}

const easeOut = [0.22, 1, 0.36, 1] as const;

/* ============================================================
   THREADS — live channel with messages streaming in + AI recap
   ============================================================ */
function ThreadsDemo({ color }: { color: string }) {
  const reduce = useReducedMotion();
  const messages = [
    { who: "Priya", role: "AE", msg: "Acme just confirmed — moving to 3-year on the renewal.", t: "9:42" },
    { who: "David", role: "SE", msg: "Nice. Should I loop in security review for the DPA?", t: "9:43" },
    { who: "Fatima", role: "CSM", msg: "Health score jumped to 84 this morning 🎉", t: "9:44" },
    { who: "Limnn AI", role: "AI", msg: "Recap: Acme renewing 3yr @ $220k. Blockers: DPA review. Next: David loops security by EOD.", t: "9:45", ai: true },
  ];
  const [count, setCount] = useState(reduce ? messages.length : 1);
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setCount(c => (c >= messages.length ? 1 : c + 1)), 1800);
    return () => clearInterval(id);
  }, [reduce, messages.length]);

  return (
    <div className="grid grid-cols-[180px_1fr] h-[440px]">
      <div className="border-r border-black/[0.06] bg-[#FBF8F2] p-3 text-sm">
        <div className="text-[10px] uppercase tracking-widest text-black/40 mb-2">Channels</div>
        {["#deal-acme-renewal","#eng-platform","#cs-onboarding","#gtm-launch"].map((c,i)=>(
          <div key={c} className={`px-2 py-1.5 rounded-md flex items-center justify-between ${i===0?"bg-black/5 font-medium":""}`}>
            <span className="truncate">{c}</span>
            {i===0 && <span className="text-[10px] px-1.5 py-0.5 rounded-full text-white" style={{background:color}}>{count}</span>}
          </div>
        ))}
      </div>
      <div className="flex flex-col">
        <div className="px-5 py-3 border-b border-black/[0.06] flex items-center justify-between">
          <div>
            <div className="font-semibold">#deal-acme-renewal</div>
            <div className="text-xs text-black/50">12 members · thread on Opportunity #4421</div>
          </div>
          <div className="flex items-center gap-1 text-xs text-black/50"><Radio className="w-3 h-3" style={{color}}/> Live</div>
        </div>
        <div className="flex-1 p-5 space-y-4 overflow-hidden">
          <AnimatePresence>
            {messages.slice(0,count).map((m,i)=>(
              <motion.div key={m.who+i}
                initial={{opacity:0, y:12}} animate={{opacity:1,y:0}}
                transition={{duration:0.4, ease:easeOut}}
                className={`flex gap-3 ${m.ai?"bg-gradient-to-r from-transparent p-3 rounded-lg -mx-3":""}`}
                style={m.ai?{background:`linear-gradient(90deg, ${color}12, transparent)`}:{}}
              >
                <div className="w-8 h-8 rounded-full grid place-items-center text-white text-xs font-semibold shrink-0"
                     style={{background: m.ai?color:"#0F1420"}}>
                  {m.ai ? <Sparkles className="w-4 h-4"/> : m.who[0]}
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-black/50"><span className="font-semibold text-black/80">{m.who}</span> · {m.role} · {m.t}</div>
                  <div className="text-sm mt-0.5">{m.msg}</div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div className="px-5 py-3 border-t border-black/[0.06] flex items-center gap-2">
          <div className="flex-1 h-9 rounded-full bg-black/[0.04] px-4 flex items-center text-sm text-black/40">Message #deal-acme-renewal…</div>
          <button className="w-9 h-9 rounded-full grid place-items-center text-white" style={{background:color}}><Send className="w-4 h-4"/></button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   INTELLIGENCE — prompt bar → streaming answer with sources
   ============================================================ */
function IntelligenceDemo({ color }: { color: string }) {
  const reduce = useReducedMotion();
  const full = "Acme's usage grew 42% QoQ, CSAT is 4.8, and Priya logged 3 exec calls this month. Recommend: 3-yr renewal at 8% uplift with SSO add-on. Confidence 94%.";
  const [text, setText] = useState(reduce ? full : "");
  useEffect(() => {
    if (reduce) return;
    let i = 0;
    const id = setInterval(() => {
      i += 3;
      setText(full.slice(0, i));
      if (i >= full.length) { setTimeout(()=>{ i=0; setText("");}, 2400); }
    }, 35);
    return () => clearInterval(id);
  }, [reduce]);

  const sources = [
    {name:"Deal #4421 — Acme", type:"CRM", conf:96},
    {name:"3 Gong calls this month", type:"CALL", conf:92},
    {name:"Usage dashboard — Q3", type:"PROD", conf:94},
  ];
  return (
    <div className="p-6 h-[440px] flex flex-col">
      <div className="rounded-xl border border-black/10 bg-white p-4 flex items-center gap-3">
        <Sparkles className="w-5 h-5" style={{color}}/>
        <div className="text-sm font-medium">Should we push Acme to a 3-year renewal?</div>
      </div>
      <div className="mt-4 flex-1 rounded-xl p-5 border relative overflow-hidden"
           style={{background:`linear-gradient(180deg, ${color}08, transparent)`, borderColor:`${color}30`}}>
        <div className="text-[10px] uppercase tracking-widest mb-2" style={{color}}>Limnn Intelligence · answer</div>
        <div className="text-lg leading-relaxed min-h-[100px]">
          {text}
          {!reduce && text.length < full.length && <motion.span animate={{opacity:[1,0]}} transition={{duration:0.6, repeat:Infinity}} className="inline-block w-1.5 h-5 ml-0.5 align-middle" style={{background:color}}/>}
        </div>
        <div className="mt-5">
          <div className="text-[10px] uppercase tracking-widest text-black/40 mb-2">Sources</div>
          <div className="space-y-2">
            {sources.map((s,i)=>(
              <motion.div key={s.name}
                initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}}
                transition={{delay:0.3+i*0.15, duration:0.4}}
                className="flex items-center justify-between p-2 rounded-lg bg-white border border-black/5 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-mono" style={{background:`${color}18`, color}}>{s.type}</span>
                  <span>{s.name}</span>
                </div>
                <span className="text-xs text-black/50">{s.conf}%</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   DIALER — ringing → connected, live waveform + transcript + coach card
   ============================================================ */
function DialerDemo({ color }: { color: string }) {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<"ring"|"live">(reduce?"live":"ring");
  useEffect(()=>{
    if (reduce) return;
    const t = setTimeout(()=> setPhase("live"), 1500);
    return ()=> clearTimeout(t);
  },[reduce]);
  const lines = [
    {who:"You", text:"Hi Jamie — thanks for making time. Where should we start?"},
    {who:"Jamie", text:"Honestly, we're worried about pricing after the renewal."},
    {who:"You", text:"Totally fair. Let me walk through the 3-yr ramp options…"},
  ];
  const [n, setN] = useState(reduce?lines.length:0);
  useEffect(()=>{
    if (reduce || phase!=="live") return;
    const id = setInterval(()=> setN(v=> v>=lines.length? lines.length : v+1), 1400);
    return ()=> clearInterval(id);
  },[reduce, phase, lines.length]);

  return (
    <div className="grid grid-cols-[1fr_240px] h-[440px]">
      <div className="p-6 flex flex-col">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full grid place-items-center text-white font-semibold text-lg" style={{background:color}}>JM</div>
          <div>
            <div className="font-semibold">Jamie Ortiz</div>
            <div className="text-sm text-black/50">VP RevOps · Acme Corp</div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="text-xs font-mono text-black/60">{phase==="ring"?"00:00":"04:12"}</div>
            {phase==="ring"
              ? <motion.div animate={{scale:[1,1.15,1]}} transition={{duration:1, repeat:Infinity}}><Phone className="w-5 h-5" style={{color}}/></motion.div>
              : <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"/>}
          </div>
        </div>
        {/* waveform */}
        <div className="mt-5 flex items-end gap-1 h-16">
          {Array.from({length:64}).map((_,i)=>(
            <motion.div key={i}
              animate={phase==="live"&&!reduce?{height:[`${20+Math.random()*30}%`,`${30+Math.random()*70}%`,`${20+Math.random()*30}%`]}:{height:"20%"}}
              transition={{duration:0.6+Math.random()*0.6, repeat:Infinity, delay:i*0.02}}
              className="flex-1 rounded-full" style={{background:`${color}90`}}/>
          ))}
        </div>
        {/* transcript */}
        <div className="mt-5 flex-1 space-y-2 overflow-hidden">
          <div className="text-[10px] uppercase tracking-widest text-black/40">Live transcript</div>
          <AnimatePresence>
            {lines.slice(0,n).map((l,i)=>(
              <motion.div key={i} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="text-sm">
                <span className="text-black/50 mr-2">{l.who}:</span>{l.text}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
      <div className="border-l border-black/[0.06] bg-[#FBF8F2] p-4 space-y-3">
        <div className="text-[10px] uppercase tracking-widest text-black/40">Live coach</div>
        <motion.div initial={{opacity:0,y:8}} animate={{opacity:phase==="live"?1:0, y:phase==="live"?0:8}} transition={{delay:1.2}}
          className="rounded-lg border p-3 bg-white" style={{borderColor:`${color}40`}}>
          <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest" style={{color}}><AlertTriangle className="w-3 h-3"/> Pricing objection</div>
          <div className="text-xs mt-1.5 leading-relaxed">Anchor on ramp discount + 3-yr rate lock. Reference expansion in call #82.</div>
        </motion.div>
        <motion.div initial={{opacity:0,y:8}} animate={{opacity:n>=2?1:0, y:n>=2?0:8}}
          className="rounded-lg border p-3 bg-white border-black/10">
          <div className="text-[10px] uppercase tracking-widest text-black/50">Next question</div>
          <div className="text-xs mt-1.5">"What would need to be true for a 3-yr to feel safe?"</div>
        </motion.div>
      </div>
    </div>
  );
}

/* ============================================================
   SALES — pipeline board, deals animating across stages
   ============================================================ */
function SalesDemo({ color }: { color: string }) {
  const reduce = useReducedMotion();
  const stages = ["Discovery","Demo","Proposal","Won"];
  const initial = [
    {n:"Acme Corp", v:"$220k", stage:0},
    {n:"Globex", v:"$145k", stage:1},
    {n:"Initech", v:"$410k", stage:2},
    {n:"Umbrella", v:"$80k", stage:0},
    {n:"Hooli", v:"$66k", stage:1},
  ];
  const [deals, setDeals] = useState(initial);
  useEffect(()=>{
    if (reduce) return;
    const id = setInterval(()=>{
      setDeals(d => d.map((x,i)=> i===Math.floor(Date.now()/2000)%d.length ? {...x, stage: Math.min(3, x.stage+1)} : x));
    }, 2000);
    return ()=> clearInterval(id);
  },[reduce]);
  const total = deals.reduce((s,d)=> s + parseInt(d.v.replace(/\D/g,"")), 0);
  return (
    <div className="p-5 h-[440px] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-black/40">Q3 Pipeline</div>
          <motion.div key={total} initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}} className="text-2xl font-serif">${total}k</motion.div>
        </div>
        <div className="flex items-center gap-1 text-xs px-2 py-1 rounded-full" style={{background:`${color}18`, color}}><TrendingUp className="w-3 h-3"/> +14%</div>
      </div>
      <div className="grid grid-cols-4 gap-2 flex-1">
        {stages.map((s, si)=>(
          <div key={s} className="rounded-lg bg-[#FBF8F2] border border-black/5 p-2 flex flex-col">
            <div className="text-[10px] uppercase tracking-widest text-black/40 px-1 pb-2">{s}</div>
            <div className="space-y-2 flex-1">
              <AnimatePresence>
                {deals.filter(d=> d.stage===si).map(d=>(
                  <motion.div key={d.n} layout
                    initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} exit={{opacity:0}}
                    transition={{layout:{duration:0.6, ease:easeOut}}}
                    className="rounded-md bg-white border border-black/10 p-2 shadow-sm">
                    <div className="text-xs font-medium truncate">{d.n}</div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[11px] text-black/50">{d.v}</span>
                      {si===3 && <CheckCircle2 className="w-3 h-3" style={{color}}/>}
                    </div>
                    <div className="mt-1.5 h-1 rounded-full bg-black/5 overflow-hidden">
                      <div className="h-full rounded-full" style={{width:`${(si+1)*25}%`, background:color}}/>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   MARKETING — journey builder graph with pulses down the path
   ============================================================ */
function MarketingDemo({ color }: { color: string }) {
  const reduce = useReducedMotion();
  const nodes = [
    {x:60, y:80, label:"Segment: F500", icon:Target},
    {x:220, y:80, label:"Email #1", icon:MessageSquare},
    {x:220, y:200, label:"A/B split", icon:GitBranch},
    {x:400, y:140, label:"Ad retarget", icon:Megaphone},
    {x:580, y:200, label:"SDR handoff", icon:Users},
  ];
  const edges = [[0,1],[1,2],[2,3],[3,4]];
  return (
    <div className="p-4 h-[440px]">
      <svg viewBox="0 0 660 320" className="w-full h-full">
        <defs>
          <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill={color}/>
          </marker>
        </defs>
        {edges.map(([a,b],i)=>{
          const p1=nodes[a], p2=nodes[b];
          const d=`M ${p1.x+60} ${p1.y} C ${(p1.x+p2.x)/2+60} ${p1.y}, ${(p1.x+p2.x)/2} ${p2.y}, ${p2.x} ${p2.y}`;
          return (
            <g key={i}>
              <path d={d} fill="none" stroke={`${color}40`} strokeWidth="2" markerEnd="url(#arr)"/>
              {!reduce && (
                <motion.circle r="4" fill={color}
                  animate={{offsetDistance:["0%","100%"]}}
                  transition={{duration:2, repeat:Infinity, delay:i*0.5, ease:"linear"}}
                  style={{offsetPath:`path("${d}")` as any}}/>
              )}
            </g>
          );
        })}
        {nodes.map((n,i)=>{
          const Icon = n.icon;
          return (
            <g key={i} transform={`translate(${n.x-50}, ${n.y-22})`}>
              <rect width="110" height="44" rx="10" fill="white" stroke={`${color}30`}/>
              <foreignObject x="8" y="8" width="30" height="30">
                <div className="w-7 h-7 rounded-md grid place-items-center" style={{background:`${color}18`, color}}>
                  <Icon className="w-4 h-4"/>
                </div>
              </foreignObject>
              <text x="46" y="26" fontSize="11" fill="#0F1420" fontFamily="ui-sans-serif">{n.label}</text>
            </g>
          );
        })}
      </svg>
      <div className="grid grid-cols-3 gap-3 mt-2">
        {[{l:"Reached",v:"18,420"},{l:"Engaged",v:"41%"},{l:"Sourced pipe",v:"$820k"}].map(k=>(
          <div key={k.l} className="rounded-lg border border-black/10 p-3">
            <div className="text-[10px] uppercase tracking-widest text-black/40">{k.l}</div>
            <div className="font-serif text-xl">{k.v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   CS — health dial + risk cards
   ============================================================ */
function CsDemo({ color }: { color: string }) {
  const reduce = useReducedMotion();
  const [v, setV] = useState(reduce?82:20);
  useEffect(()=>{
    if (reduce) return;
    const id = setInterval(()=> setV(x=> x>=82? 20 : x+2), 60);
    return ()=> clearInterval(id);
  },[reduce]);
  const C=2*Math.PI*70;
  return (
    <div className="p-6 h-[440px] grid grid-cols-[240px_1fr] gap-6">
      <div className="flex flex-col items-center justify-center">
        <div className="relative">
          <svg width="180" height="180" viewBox="0 0 180 180">
            <circle cx="90" cy="90" r="70" fill="none" stroke="#0F142010" strokeWidth="14"/>
            <motion.circle cx="90" cy="90" r="70" fill="none" stroke={color} strokeWidth="14" strokeLinecap="round"
              strokeDasharray={C} strokeDashoffset={C-(C*v)/100} transform="rotate(-90 90 90)"/>
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <div className="text-center">
              <div className="font-serif text-4xl">{v}</div>
              <div className="text-[10px] uppercase tracking-widest text-black/50">Health</div>
            </div>
          </div>
        </div>
        <div className="mt-4 text-xs text-black/60 text-center">Acme Corp · $220k ARR</div>
      </div>
      <div className="space-y-3">
        <div className="text-[10px] uppercase tracking-widest text-black/40">AI risk signals</div>
        {[
          {icon:TrendingUp, t:"Usage +42% QoQ", tag:"POSITIVE", good:true},
          {icon:AlertTriangle, t:"Champion left 2 weeks ago", tag:"RISK", good:false},
          {icon:CheckCircle2, t:"CSAT 4.8 across support", tag:"POSITIVE", good:true},
          {icon:Sparkles, t:"AI: run save play — offer SSO add-on", tag:"PLAY", good:true},
        ].map((r,i)=>(
          <motion.div key={i} initial={{opacity:0,x:12}} animate={{opacity:1,x:0}} transition={{delay:i*0.15}}
            className="rounded-lg border border-black/10 p-3 flex items-center gap-3 bg-white">
            <div className="w-8 h-8 rounded-md grid place-items-center" style={{background:r.good?`${color}18`:"#FEE2E2", color:r.good?color:"#DC2626"}}>
              <r.icon className="w-4 h-4"/>
            </div>
            <div className="text-sm flex-1">{r.t}</div>
            <div className="text-[10px] px-1.5 py-0.5 rounded font-mono" style={{background:r.good?`${color}18`:"#FEE2E2", color:r.good?color:"#DC2626"}}>{r.tag}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   SUPPORT — ticket queue with AI resolving one live
   ============================================================ */
function SupportDemo({ color }: { color: string }) {
  const reduce = useReducedMotion();
  const [resolved, setResolved] = useState<number[]>(reduce?[0,2]:[]);
  useEffect(()=>{
    if (reduce) return;
    const id = setInterval(()=>{
      setResolved(r=> r.length>=3 ? [] : [...r, r.length]);
    }, 1600);
    return ()=> clearInterval(id);
  },[reduce]);
  const tickets = [
    {id:"#8421", subj:"Password reset loop", ch:"Chat", ai:true},
    {id:"#8422", subj:"Billing dispute — invoice INV-812", ch:"Email", ai:false},
    {id:"#8423", subj:"API returning 429", ch:"Chat", ai:true},
    {id:"#8424", subj:"Feature request: SSO", ch:"Email", ai:true},
  ];
  return (
    <div className="p-5 h-[440px] grid grid-cols-2 gap-5">
      <div>
        <div className="text-[10px] uppercase tracking-widest text-black/40 mb-3">Inbox · 142 open</div>
        <div className="space-y-2">
          {tickets.map((t,i)=>(
            <motion.div key={t.id} animate={{opacity: resolved.includes(i)?0.5:1}} className="rounded-lg border border-black/10 p-3 bg-white">
              <div className="flex items-center justify-between">
                <div className="text-xs font-mono text-black/50">{t.id}</div>
                <div className="flex items-center gap-1">
                  {resolved.includes(i) ? <CheckCircle2 className="w-3.5 h-3.5" style={{color}}/> : <div className="w-2 h-2 rounded-full bg-amber-400"/>}
                  <span className="text-[10px] uppercase tracking-widest text-black/50">{resolved.includes(i)?"Resolved":t.ch}</span>
                </div>
              </div>
              <div className="text-sm mt-1">{t.subj}</div>
              {t.ai && !resolved.includes(i) && (
                <div className="mt-2 flex items-center gap-1 text-[10px] uppercase tracking-widest" style={{color}}>
                  <Sparkles className="w-3 h-3"/> AI drafting reply
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
      <div className="rounded-xl p-4 border" style={{background:`linear-gradient(180deg, ${color}08, transparent)`, borderColor:`${color}30`}}>
        <div className="text-[10px] uppercase tracking-widest mb-2" style={{color}}>AI · reply preview</div>
        <div className="text-sm leading-relaxed">
          Hi Sam, I've reset your session and sent a fresh login link. If the loop persists, it's usually the "remember me" cookie — clear it and try once more. Anything else I can do?
        </div>
        <div className="mt-4 flex items-center gap-2">
          <button className="text-xs px-3 py-1.5 rounded-md text-white" style={{background:color}}>Send</button>
          <button className="text-xs px-3 py-1.5 rounded-md bg-black/5">Edit</button>
          <div className="ml-auto text-[10px] uppercase tracking-widest text-black/40">CSAT est. 4.9</div>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-2">
          {[{l:"Deflected",v:"38%"},{l:"FCR",v:"81%"},{l:"CSAT",v:"4.7"}].map(k=>(
            <div key={k.l} className="rounded-md border border-black/10 p-2 text-center">
              <div className="text-[10px] uppercase tracking-widest text-black/40">{k.l}</div>
              <div className="font-serif text-lg">{k.v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   CPQ — quote builder, line items adding, total ticking up
   ============================================================ */
function CpqDemo({ color }: { color: string }) {
  const reduce = useReducedMotion();
  const items = [
    {n:"Platform — 250 seats", p:96000},
    {n:"AI Copilot add-on",   p:42000},
    {n:"SSO / SCIM",          p:12000},
    {n:"Premium support",     p:18000},
  ];
  const [n, setN] = useState(reduce?items.length:0);
  useEffect(()=>{
    if (reduce) return;
    const id = setInterval(()=> setN(v=> v>=items.length? 0 : v+1), 900);
    return ()=> clearInterval(id);
  },[reduce, items.length]);
  const subtotal = items.slice(0,n).reduce((s,x)=> s+x.p, 0);
  const disc = Math.round(subtotal*0.12);
  const total = subtotal - disc;
  return (
    <div className="p-5 h-[440px] grid grid-cols-[1fr_260px] gap-5">
      <div>
        <div className="text-[10px] uppercase tracking-widest text-black/40">Quote Q-8221 · Acme Corp · 3yr</div>
        <div className="mt-3 rounded-xl border border-black/10 overflow-hidden">
          <div className="grid grid-cols-[1fr_auto] gap-4 px-4 py-2 text-[10px] uppercase tracking-widest text-black/40 bg-[#FBF8F2] border-b border-black/5">
            <div>Line item</div><div>Amount</div>
          </div>
          <AnimatePresence>
            {items.slice(0,n).map((it,i)=>(
              <motion.div key={it.n} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
                className="grid grid-cols-[1fr_auto] gap-4 px-4 py-3 border-b border-black/5 last:border-0 text-sm">
                <div>{it.n}</div>
                <div className="font-mono">${it.p.toLocaleString()}</div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
      <div className="rounded-xl border p-4 space-y-3 h-fit" style={{borderColor:`${color}30`, background:`${color}08`}}>
        <div className="flex justify-between text-sm"><span className="text-black/60">Subtotal</span><span className="font-mono">${subtotal.toLocaleString()}</span></div>
        <div className="flex justify-between text-sm"><span className="text-black/60">Volume discount 12%</span><span className="font-mono">-${disc.toLocaleString()}</span></div>
        <div className="border-t border-black/10 pt-3 flex justify-between items-end">
          <div className="text-[10px] uppercase tracking-widest text-black/50">Total</div>
          <motion.div key={total} initial={{scale:0.95, opacity:0}} animate={{scale:1,opacity:1}} className="font-serif text-3xl" style={{color}}>${total.toLocaleString()}</motion.div>
        </div>
        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2 text-xs"><CheckCircle2 className="w-3.5 h-3.5" style={{color}}/> Auto-approved (within policy)</div>
          <div className="flex items-center gap-2 text-xs"><CheckCircle2 className="w-3.5 h-3.5" style={{color}}/> DocuSign envelope ready</div>
          <div className="flex items-center gap-2 text-xs text-black/50"><CheckCircle2 className="w-3.5 h-3.5 text-black/30"/> Awaiting counter-sign</div>
        </div>
        <button className="w-full mt-2 text-xs py-2 rounded-md text-white" style={{background:color}}>Send for signature</button>
      </div>
    </div>
  );
}

/* ============================================================
   BILLING — MRR chart animating + invoice line
   ============================================================ */
function BillingDemo({ color }: { color: string }) {
  const reduce = useReducedMotion();
  const data = [12,15,14,18,22,26,25,30,34,38,41,46];
  const max = 50;
  const [drawn, setDrawn] = useState(reduce?1:0);
  useEffect(()=>{
    if (reduce) return;
    const t = setTimeout(()=> setDrawn(1), 200);
    return ()=> clearTimeout(t);
  },[reduce]);
  return (
    <div className="p-5 h-[440px] grid grid-cols-[1fr_260px] gap-5">
      <div className="flex flex-col">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-black/40">MRR — trailing 12m</div>
          <div className="flex items-end gap-3">
            <div className="font-serif text-3xl">$412k</div>
            <div className="text-xs px-2 py-1 rounded-full mb-1" style={{background:`${color}18`, color}}>+8.4%</div>
          </div>
        </div>
        <div className="flex-1 relative mt-4">
          <svg viewBox="0 0 400 180" className="w-full h-full">
            <defs>
              <linearGradient id="mrrg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity="0.35"/>
                <stop offset="100%" stopColor={color} stopOpacity="0"/>
              </linearGradient>
            </defs>
            {[0,1,2,3].map(i=>(
              <line key={i} x1="0" x2="400" y1={i*45} y2={i*45} stroke="#0F142010"/>
            ))}
            <motion.path
              d={`M ${data.map((v,i)=>`${(i*400)/(data.length-1)} ${180-(v/max)*160}`).join(" L ")} L 400 180 L 0 180 Z`}
              fill="url(#mrrg)"
              initial={{opacity:0}} animate={{opacity:drawn}} transition={{duration:0.8}}/>
            <motion.path
              d={`M ${data.map((v,i)=>`${(i*400)/(data.length-1)} ${180-(v/max)*160}`).join(" L ")}`}
              fill="none" stroke={color} strokeWidth="2.5"
              initial={{pathLength:0}} animate={{pathLength:drawn}} transition={{duration:1.6, ease:easeOut}}/>
            {data.map((v,i)=>(
              <motion.circle key={i} cx={(i*400)/(data.length-1)} cy={180-(v/max)*160} r="3" fill={color}
                initial={{opacity:0}} animate={{opacity:drawn}} transition={{delay:0.6+i*0.06}}/>
            ))}
          </svg>
        </div>
      </div>
      <div className="space-y-2">
        <div className="text-[10px] uppercase tracking-widest text-black/40">Recent invoices</div>
        {[
          {n:"INV-8821 Acme", a:"$18,400", s:"PAID"},
          {n:"INV-8822 Globex", a:"$22,100", s:"DUE"},
          {n:"INV-8823 Initech", a:"$41,000", s:"SCHED"},
          {n:"USG-4432 Umbrella", a:"$2,340", s:"USG"},
        ].map((iv,i)=>(
          <motion.div key={iv.n} initial={{opacity:0,x:8}} animate={{opacity:1,x:0}} transition={{delay:i*0.15}}
            className="rounded-md border border-black/10 p-2.5 bg-white flex items-center justify-between">
            <div>
              <div className="text-xs font-mono">{iv.n}</div>
              <div className="text-[10px] uppercase tracking-widest text-black/40 mt-0.5">{iv.s}</div>
            </div>
            <div className="font-mono text-sm">{iv.a}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   GRID — sprint board with task moving in flight
   ============================================================ */
function GridDemo({ color }: { color: string }) {
  const reduce = useReducedMotion();
  const cols = ["Backlog","In progress","Review","Done"];
  const initial = [
    {n:"Webhook v2", c:0},{n:"Billing tax", c:1},{n:"Auth ADR", c:1},
    {n:"Sprint retro", c:2},{n:"Onboarding rev", c:0},{n:"Q3 OKR draft", c:3},
  ];
  const [tasks, setTasks] = useState(initial);
  useEffect(()=>{
    if (reduce) return;
    const id = setInterval(()=>{
      setTasks(t => t.map((x,i)=> i===Math.floor(Date.now()/2000)%t.length ? {...x, c: (x.c+1)%4} : x));
    }, 2000);
    return ()=> clearInterval(id);
  },[reduce]);
  return (
    <div className="p-5 h-[440px] grid grid-cols-4 gap-2">
      {cols.map((c, ci)=>(
        <div key={c} className="rounded-lg bg-[#FBF8F2] border border-black/5 p-2 flex flex-col">
          <div className="text-[10px] uppercase tracking-widest text-black/40 px-1 pb-2 flex items-center justify-between">
            <span>{c}</span>
            <span>{tasks.filter(t=>t.c===ci).length}</span>
          </div>
          <div className="space-y-2 flex-1">
            <AnimatePresence>
              {tasks.filter(t=>t.c===ci).map((t)=>(
                <motion.div key={t.n} layout
                  initial={{opacity:0, y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  transition={{layout:{duration:0.55, ease:easeOut}}}
                  className="rounded-md bg-white border border-black/10 p-2 text-xs">
                  <div className="font-medium">{t.n}</div>
                  <div className="mt-1 flex items-center gap-1">
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-mono" style={{background:`${color}18`, color}}>LMN-{800+ci*10}</span>
                    <div className="ml-auto w-4 h-4 rounded-full" style={{background:color, opacity:0.6}}/>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   LEARNING — AI roleplay bubble with rubric bars filling
   ============================================================ */
function LearningDemo({ color }: { color: string }) {
  const reduce = useReducedMotion();
  const bars = [
    {l:"Discovery depth", v:88},
    {l:"Objection handling", v:76},
    {l:"Value framing", v:92},
    {l:"Next-step clarity", v:81},
  ];
  const [play, setPlay] = useState(reduce);
  useEffect(()=>{
    if (reduce) return;
    const t = setTimeout(()=> setPlay(true), 300);
    return ()=> clearTimeout(t);
  },[reduce]);
  return (
    <div className="p-6 h-[440px] grid grid-cols-[240px_1fr] gap-6">
      <div className="flex flex-col items-center justify-center gap-4">
        <motion.div animate={play?{scale:[1,1.06,1]}:{scale:1}} transition={{duration:1.6, repeat:Infinity}}
          className="w-32 h-32 rounded-full grid place-items-center" style={{background:`${color}18`}}>
          <div className="w-24 h-24 rounded-full grid place-items-center" style={{background:color}}>
            <Mic className="w-10 h-10 text-white"/>
          </div>
        </motion.div>
        <div className="text-center">
          <div className="text-xs text-black/50">AI buyer · "Jamie"</div>
          <div className="text-sm mt-1">Discovery roleplay · v3</div>
        </div>
        <button onClick={()=>setPlay(!play)} className="mt-2 text-xs px-3 py-1.5 rounded-full border border-black/10 flex items-center gap-1">
          {play? <><Pause className="w-3 h-3"/> Pause</> : <><Play className="w-3 h-3"/> Play</>}
        </button>
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-widest text-black/40 mb-3">Rubric — auto-scored</div>
        <div className="space-y-3">
          {bars.map((b,i)=>(
            <div key={b.l}>
              <div className="flex justify-between text-sm mb-1"><span>{b.l}</span><span className="font-mono">{b.v}</span></div>
              <div className="h-2 rounded-full bg-black/5 overflow-hidden">
                <motion.div initial={{width:0}} animate={{width: play? `${b.v}%`:"0%"}} transition={{duration:1.2, delay:i*0.15, ease:easeOut}}
                  className="h-full rounded-full" style={{background:color}}/>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-lg p-3 border" style={{background:`${color}08`, borderColor:`${color}30`}}>
          <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest mb-1" style={{color}}><Award className="w-3 h-3"/> Certification</div>
          <div className="text-sm">Passed — SDR Level 2 issued to 24 reps this week.</div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   PEOPLE — mini org chart, then payroll run status
   ============================================================ */
function PeopleDemo({ color }: { color: string }) {
  const reduce = useReducedMotion();
  const [progress, setProgress] = useState(reduce?100:0);
  useEffect(()=>{
    if (reduce) return;
    const id = setInterval(()=> setProgress(p=> p>=100? 0 : p+2), 60);
    return ()=> clearInterval(id);
  },[reduce]);
  const node = (x:number,y:number,name:string,role:string,i:number)=>(
    <motion.g key={name} initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} transition={{delay:i*0.1}}>
      <rect x={x-58} y={y-22} width="116" height="44" rx="10" fill="white" stroke={`${color}30`}/>
      <circle cx={x-42} cy={y} r="12" fill={color}/>
      <text x={x-42} y={y+4} textAnchor="middle" fontSize="10" fill="white" fontWeight="600">{name[0]}</text>
      <text x={x-24} y={y-2} fontSize="10" fill="#0F1420" fontWeight="600">{name}</text>
      <text x={x-24} y={y+10} fontSize="9" fill="#0F142099">{role}</text>
    </motion.g>
  );
  return (
    <div className="p-5 h-[440px] grid grid-cols-[1.3fr_1fr] gap-5">
      <div>
        <div className="text-[10px] uppercase tracking-widest text-black/40 mb-2">Org chart · Engineering</div>
        <svg viewBox="0 0 400 300" className="w-full">
          <line x1="200" y1="42" x2="90" y2="130" stroke={`${color}40`}/>
          <line x1="200" y1="42" x2="200" y2="130" stroke={`${color}40`}/>
          <line x1="200" y1="42" x2="310" y2="130" stroke={`${color}40`}/>
          <line x1="90" y1="152" x2="90" y2="230" stroke={`${color}40`}/>
          <line x1="200" y1="152" x2="200" y2="230" stroke={`${color}40`}/>
          <line x1="310" y1="152" x2="310" y2="230" stroke={`${color}40`}/>
          {node(200,20,"Priya S.","VP Eng",0)}
          {node(90,130,"David L.","EM",1)}
          {node(200,130,"Fatima K.","EM",2)}
          {node(310,130,"Michael R.","EM",3)}
          {node(90,230,"5 ICs","Platform",4)}
          {node(200,230,"7 ICs","Product",5)}
          {node(310,230,"4 ICs","Infra",6)}
        </svg>
      </div>
      <div className="rounded-xl p-4 border space-y-4" style={{borderColor:`${color}30`, background:`${color}08`}}>
        <div>
          <div className="text-[10px] uppercase tracking-widest" style={{color}}>Payroll run · Jun 2026</div>
          <div className="font-serif text-2xl mt-1">$2.14M</div>
          <div className="text-xs text-black/60">612 employees · 14 countries</div>
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1"><span>Processing</span><span className="font-mono">{progress}%</span></div>
          <div className="h-2 rounded-full bg-white/60 overflow-hidden">
            <div className="h-full rounded-full transition-[width]" style={{width:`${progress}%`, background:color}}/>
          </div>
        </div>
        <div className="space-y-2">
          {[
            {c:"🇺🇸 US · 214 people", ok:progress>20},
            {c:"🇮🇳 India · 186 people", ok:progress>50},
            {c:"🇬🇧 UK · 92 people", ok:progress>75},
            {c:"🇩🇪 Germany · 41 people", ok:progress>90},
          ].map(r=>(
            <div key={r.c} className="flex items-center gap-2 text-xs">
              {r.ok ? <CheckCircle2 className="w-3.5 h-3.5" style={{color}}/> : <div className="w-3.5 h-3.5 rounded-full border border-black/20"/>}
              <span>{r.c}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Registry
   ============================================================ */
export function ModuleDemo({ id, color }: { id: string; color: string }) {
  const map: Record<string, React.ReactElement> = {
    threads: <ThreadsDemo color={color}/>,
    intelligence: <IntelligenceDemo color={color}/>,
    dialer: <DialerDemo color={color}/>,
    sales: <SalesDemo color={color}/>,
    marketing: <MarketingDemo color={color}/>,
    cs: <CsDemo color={color}/>,
    support: <SupportDemo color={color}/>,
    cpq: <CpqDemo color={color}/>,
    billing: <BillingDemo color={color}/>,
    grid: <GridDemo color={color}/>,
    learning: <LearningDemo color={color}/>,
    people: <PeopleDemo color={color}/>,
  };
  return map[id] ?? <div className="p-8 text-sm text-black/50">Demo coming soon.</div>;
}
