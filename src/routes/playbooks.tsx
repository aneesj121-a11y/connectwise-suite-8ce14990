import { createFileRoute } from "@tanstack/react-router";
import { HubPage } from "@/components/hubs/page";
import { SectionCard, KpiCard, RiskBadge, StatusPill, Avatar } from "@/components/enterprise/primitives";
import { Phone, Voicemail, Mic, PhoneOutgoing, SkipForward, Sparkles, BookOpen } from "lucide-react";

export const Route = createFileRoute("/playbooks")({
  head: () => ({ meta: [{ title: "Sales — Power Dialer" }] }),
  component: DialerPage,
});

const QUEUE = [
  { name: "Albert Wesker",  acct: "Umbrella",       num: "+44 20 7946 0011", tz: "London 4:12pm",  attempts: 2, hotness: 92 },
  { name: "Peter Gibbons",  acct: "Initech",        num: "+1 512 555 0144",  tz: "Austin 10:12am", attempts: 1, hotness: 84 },
  { name: "Hank Scorpio",   acct: "Globex",         num: "+65 6555 0144",    tz: "SG 11:12pm",     attempts: 4, hotness: 71 },
  { name: "Wile E. Coyote", acct: "Acme Corp",      num: "+1 602 555 0177",  tz: "Phoenix 8:12am", attempts: 0, hotness: 88 },
  { name: "Lana Kane",      acct: "ISIS Holdings",  num: "+1 212 555 0166",  tz: "NYC 11:12am",    attempts: 1, hotness: 66 },
];

const BATTLECARDS = [
  { trigger: "Price objection",  prompt: "Acknowledge — then anchor to ROI ($/seat saved across 12 mo)." },
  { trigger: "Competitor mention", prompt: "Differentiate: AI Coach + native CPQ in one platform, no Zapier glue." },
  { trigger: "Procurement delay",  prompt: "Offer mutual action plan with named stakeholders + milestone dates." },
];

function DialerPage() {
  return (
    <HubPage
      title="Power Dialer"
      description="High-velocity dialing deck with scripts, local-presence routing, and AI battlecards."
      actions={
        <>
          <button className="h-9 px-3 rounded-md border border-border text-sm font-medium inline-flex items-center gap-1.5 hover:bg-accent">
            <BookOpen className="h-3.5 w-3.5" /> Open playbook
          </button>
          <button className="h-9 px-3 rounded-md text-sm font-medium text-primary-foreground inline-flex items-center gap-1.5" style={{ background: "var(--primary)" }}>
            <PhoneOutgoing className="h-3.5 w-3.5" /> Start session
          </button>
        </>
      }
      insights={[
        { title: "Best window: 10–11am local", body: "Connect rate +38% in this window for your ICP. Queue is auto-sorted by recipient local time.", confidence: 84 },
        { title: "Auto voicemail-drop ready",  body: "12 attempts likely to hit voicemail — pre-recorded drop saves ~7 min/seat.", confidence: 91, cta: "Enable" },
      ]}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Dials today"      value="148" delta={22} icon={Phone} />
        <KpiCard label="Connect rate"     value="18%" delta={3}  icon={PhoneOutgoing} />
        <KpiCard label="Voicemails dropped" value="42" delta={8} icon={Voicemail} />
        <KpiCard label="Avg talk time"    value="4:21" delta={-12} icon={Mic} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
        <SectionCard title="Queue" subtitle={`${QUEUE.length} contacts · sequential dial`}>
          <ul className="divide-y divide-border">
            {QUEUE.map((q, i) => (
              <li key={q.num} className="py-3 grid grid-cols-[28px_28px_1fr_140px_70px_auto] items-center gap-3">
                <span className="font-mono text-xs text-muted-foreground">{String(i+1).padStart(2,"0")}</span>
                <Avatar name={q.name} size={28} />
                <div>
                  <div className="text-sm font-medium">{q.name}</div>
                  <div className="text-[11px] text-muted-foreground">{q.acct} · {q.num}</div>
                </div>
                <div className="text-[11px] text-muted-foreground">{q.tz}</div>
                <StatusPill level={q.attempts >= 3 ? "yellow" : "blue"}>Att {q.attempts}</StatusPill>
                <div className="flex items-center gap-2">
                  <RiskBadge confidence={q.hotness} label="Hot" />
                  <button className="h-7 w-7 grid place-items-center rounded-md text-primary-foreground" style={{ background: "var(--primary)" }}><Phone className="h-3 w-3" /></button>
                  <button className="h-7 w-7 grid place-items-center rounded-md border border-border"><SkipForward className="h-3 w-3" /></button>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>

        <div className="space-y-3">
          <SectionCard title="Live script">
            <ol className="text-xs space-y-2 list-decimal pl-4 text-muted-foreground">
              <li><span className="text-foreground">Pattern-interrupt</span> — "Hi {`{first_name}`}, this is {`{me}`} from Limnn — I caught you between meetings…"</li>
              <li><span className="text-foreground">Permission</span> — "Got 27 seconds for why I called?"</li>
              <li><span className="text-foreground">Reason</span> — pick relevant trigger from CRM.</li>
              <li><span className="text-foreground">Ask</span> — propose a 15-min next step.</li>
            </ol>
          </SectionCard>

          <SectionCard title="AI battlecards" subtitle="Triggered live by conversation">
            <ul className="space-y-2">
              {BATTLECARDS.map((b) => (
                <li key={b.trigger} className="rounded-md border border-border p-2.5">
                  <div className="flex items-center gap-1.5 text-[11px] mb-1" style={{ color: "var(--primary)" }}>
                    <Sparkles className="h-3 w-3" /> {b.trigger}
                  </div>
                  <p className="text-xs">{b.prompt}</p>
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>
      </div>
    </HubPage>
  );
}
