import { createFileRoute } from "@tanstack/react-router";
import { HubPage } from "@/components/hubs/page";
import { SectionCard, Avatar } from "@/components/enterprise/primitives";
import { EMPLOYEES } from "@/lib/people-data";
import { Check } from "lucide-react";

const ACCENT = "oklch(0.58 0.18 280)";

export const Route = createFileRoute("/people/onboarding")({
  head: () => ({ meta: [{ title: "Onboarding — Limnn People" }] }),
  component: Onboarding,
});

const CHECKLIST = {
  IT: [
    { task: "Provision laptop + peripherals", done: true, owner: "Sam D.", due: "Day 0" },
    { task: "Create Google, Slack, Github accounts", done: true, owner: "Sam D.", due: "Day 0" },
    { task: "Enroll in SSO & 2FA", done: true, owner: "Sam D.", due: "Day 1" },
    { task: "VPN + prod DB read access", done: false, owner: "Sam D.", due: "Day 5" },
  ],
  HR: [
    { task: "Sign employment contract & IP", done: true, owner: "Amara D.", due: "Day 0" },
    { task: "Tax + super forms", done: true, owner: "Amara D.", due: "Day 1" },
    { task: "Enroll in benefits", done: false, owner: "Amara D.", due: "Day 14" },
    { task: "Book new-hire orientation", done: false, owner: "Amara D.", due: "Day 7" },
  ],
  Team: [
    { task: "Meet manager 1:1", done: true, owner: "Ahmed H.", due: "Day 1" },
    { task: "Read team charter & rituals doc", done: true, owner: "Self", due: "Day 3" },
    { task: "Pair with 3 teammates", done: false, owner: "Ahmed H.", due: "Day 10" },
    { task: "Ship first PR", done: false, owner: "Self", due: "Day 14" },
  ],
};

function Onboarding() {
  const newHires = EMPLOYEES.filter((e) => e.status === "Probation").concat(EMPLOYEES.slice(-3));

  return (
    <HubPage title="Onboarding" description="New hires in their first 90 days.">
      <SectionCard title="Active onboarding">
        <ul className="divide-y divide-border">
          {newHires.map((e, i) => (
            <li key={e.id + i} className="py-3 flex items-center gap-3">
              <Avatar name={e.name} size={32} />
              <div className="flex-1 min-w-0">
                <div className="font-medium">{e.name}</div>
                <div className="text-[11px] text-muted-foreground">Started {e.startDate} · {e.dept}</div>
              </div>
              <div className="w-40">
                <div className="text-[10px] text-muted-foreground mb-1">{45 + i * 10}% · {90 - i * 15}d remaining</div>
                <div className="h-1.5 bg-muted rounded"><div className="h-full rounded" style={{ width: `${45 + i * 10}%`, background: ACCENT }} /></div>
              </div>
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard title="David Chen — checklist" subtitle="Started Apr 1 · 60 days remaining">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {Object.entries(CHECKLIST).map(([cat, items]) => (
            <div key={cat}>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">{cat}</div>
              <ul className="space-y-2">
                {items.map((it) => (
                  <li key={it.task} className="flex items-start gap-2.5 text-sm">
                    <span className={`h-4 w-4 mt-0.5 rounded border grid place-items-center shrink-0 ${it.done ? "border-transparent" : "border-border"}`} style={{ background: it.done ? ACCENT : "transparent" }}>
                      {it.done && <Check className="h-3 w-3 text-white" />}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className={`${it.done ? "line-through text-muted-foreground" : ""}`}>{it.task}</div>
                      <div className="text-[10.5px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                        <Avatar name={it.owner} size={14} /> {it.owner} · {it.due}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </SectionCard>
    </HubPage>
  );
}
