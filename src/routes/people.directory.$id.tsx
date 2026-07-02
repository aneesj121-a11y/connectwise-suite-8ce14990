import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { HubPage } from "@/components/hubs/page";
import { SectionCard, StatusPill, Avatar, RiskBadge } from "@/components/enterprise/primitives";
import { EMPLOYEES } from "@/lib/people-data";
import { ArrowLeft, Edit, MessageSquare, MoreHorizontal, Sparkles, Mail, Phone, MapPin, Calendar } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/people/directory/$id")({
  head: () => ({ meta: [{ title: "Employee Profile — Limnn People" }] }),
  component: Profile,
  notFoundComponent: () => (
    <div className="container-page py-16 text-center text-muted-foreground">Employee not found.</div>
  ),
});

const ACCENT = "oklch(0.58 0.18 280)";
const TABS = ["Overview", "Employment", "Compensation", "Leave", "Documents", "Performance", "Benefits", "Assets"] as const;

function Profile() {
  const { id } = Route.useParams();
  const emp = EMPLOYEES.find((e) => e.id === id);
  if (!emp) throw notFound();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Overview");

  return (
    <div className="container-page py-8">
      <Link to="/people/directory" className="text-xs text-muted-foreground inline-flex items-center gap-1 hover:text-foreground mb-3">
        <ArrowLeft className="h-3 w-3" /> Directory
      </Link>

      <header className="flex items-center gap-4 mb-6">
        <span className="h-16 w-16 rounded-full grid place-items-center text-white text-lg font-semibold" style={{ background: ACCENT }}>
          {emp.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
        </span>
        <div className="flex-1 min-w-0">
          <h1 className="font-display text-2xl font-semibold tracking-tight">{emp.name}</h1>
          <p className="text-sm text-muted-foreground">{emp.title} · {emp.dept} · {emp.location}</p>
        </div>
        <StatusPill level={emp.status === "Active" ? "green" : emp.status === "On Leave" ? "blue" : "yellow"}>{emp.status}</StatusPill>
        <button className="h-9 px-3 rounded-md border border-border text-sm inline-flex items-center gap-1.5 hover:bg-accent"><Edit className="h-3.5 w-3.5" /> Edit</button>
        <button className="h-9 px-3 rounded-md border border-border text-sm inline-flex items-center gap-1.5 hover:bg-accent"><MessageSquare className="h-3.5 w-3.5" /> Message</button>
        <button className="h-9 w-9 grid place-items-center rounded-md border border-border hover:bg-accent"><MoreHorizontal className="h-4 w-4" /></button>
      </header>

      <div className="flex items-center gap-1 border-b border-border mb-5 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="text-sm px-3 py-2 border-b-2 whitespace-nowrap transition"
            style={{
              borderColor: tab === t ? ACCENT : "transparent",
              color: tab === t ? "var(--foreground)" : "var(--muted-foreground)",
              fontWeight: tab === t ? 600 : 400,
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Overview" && <Overview emp={emp} />}
      {tab === "Employment" && <EmploymentTab emp={emp} />}
      {tab === "Compensation" && <CompTab emp={emp} />}
      {tab === "Leave" && <LeaveTab />}
      {tab === "Documents" && <Simple message="Contract, IP assignment, tax forms, ID scans (mock)." />}
      {tab === "Performance" && <Simple message="Reviews, ratings, goals — see /people/performance." />}
      {tab === "Benefits" && <BenefitsTab />}
      {tab === "Assets" && <AssetsTab />}
    </div>
  );
}

function Overview({ emp }: { emp: typeof EMPLOYEES[number] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-4">
        <SectionCard title="Personal information">
          <dl className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm">
            <Row label="Employee ID" value={<span className="font-mono">{emp.id}</span>} />
            <Row label="Start date" value={emp.startDate} />
            <Row label="Email" value={<span className="inline-flex items-center gap-1"><Mail className="h-3 w-3" /> {emp.email}</span>} />
            <Row label="Phone" value={<span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" /> {emp.phone}</span>} />
            <Row label="Location" value={<span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {emp.location}</span>} />
            <Row label="Manager" value={emp.manager ?? "—"} />
          </dl>
        </SectionCard>
        <SectionCard title="Emergency contact">
          <dl className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm">
            <Row label="Name" value="Reza Jaffri" />
            <Row label="Relationship" value="Spouse" />
            <Row label="Phone" value="+61 400 111 222" />
            <Row label="Email" value="reza@example.com" />
          </dl>
        </SectionCard>
      </div>

      <div className="space-y-4">
        <SectionCard title="Quick stats">
          <div className="grid grid-cols-2 gap-3 text-center">
            <Stat label="Leave balance" value="14d" />
            <Stat label="Tenure" value={`${emp.tenureYears.toFixed(1)}y`} />
            <Stat label="Next review" value="Sep 12" />
            <Stat label="Reports to" value={emp.manager?.split(" ")[0] ?? "—"} />
          </div>
        </SectionCard>
        <SectionCard
          title={
            <span className="inline-flex items-center gap-2">
              <span className="h-6 w-6 rounded-md grid place-items-center" style={{ background: `color-mix(in oklab, ${ACCENT} 14%, transparent)`, color: ACCENT }}>
                <Sparkles className="h-3 w-3" />
              </span>
              AI insights
            </span>
          }
        >
          <div className="flex items-center gap-4 mb-3">
            <RiskRing value={emp.flightRisk} />
            <div className="flex-1">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Flight risk</div>
              <div className="text-2xl font-display font-semibold">{emp.flightRisk}%</div>
              <RiskBadge confidence={84} />
            </div>
          </div>
          {emp.riskFactors.length > 0 && (
            <>
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1.5">Risk factors</div>
              <ul className="space-y-1.5 mb-3">
                {emp.riskFactors.map((f) => (
                  <li key={f} className="text-xs flex items-start gap-1.5">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 bg-rose-500" />
                    {f}
                  </li>
                ))}
              </ul>
            </>
          )}
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1.5">Suggested actions</div>
          <ul className="text-xs space-y-1.5 text-muted-foreground">
            <li>· Schedule career conversation this week</li>
            <li>· Review comp against P75 market band</li>
            <li>· Offer stretch project (data platform)</li>
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}

function EmploymentTab({ emp }: { emp: typeof EMPLOYEES[number] }) {
  return (
    <SectionCard title="Employment history">
      <ul className="space-y-3 text-sm">
        <li className="flex items-start gap-3">
          <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
          <div>
            <div className="font-medium">{emp.title} · {emp.dept}</div>
            <div className="text-xs text-muted-foreground">{emp.startDate} — Present</div>
          </div>
        </li>
      </ul>
    </SectionCard>
  );
}
function CompTab({ emp }: { emp: typeof EMPLOYEES[number] }) {
  return (
    <SectionCard title="Compensation">
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Base salary" value={`$${emp.compensation.toLocaleString()}`} />
        <Stat label="Bonus target" value="15%" />
        <Stat label="Equity" value="0.08%" />
      </div>
    </SectionCard>
  );
}
function LeaveTab() {
  return (
    <SectionCard title="Leave balances">
      <div className="grid grid-cols-4 gap-3">
        <Stat label="Annual" value="14d" />
        <Stat label="Sick" value="8d" />
        <Stat label="Personal" value="2d" />
        <Stat label="Carryover" value="4d" />
      </div>
    </SectionCard>
  );
}
function BenefitsTab() {
  const items = [
    { name: "Health insurance", plan: "Bupa Gold Family", status: "Enrolled", level: "green" as const },
    { name: "Dental", plan: "HCF Extras", status: "Enrolled", level: "green" as const },
    { name: "Vision", plan: "Specsavers Care", status: "Enrolled", level: "green" as const },
    { name: "401(k) / Super", plan: "AustralianSuper Balanced", status: "Enrolled — 11.5%", level: "green" as const },
    { name: "Life insurance", plan: "2x annual salary", status: "Enrolled", level: "green" as const },
    { name: "Wellness credit", plan: "$100/mo", status: "Active", level: "blue" as const },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {items.map((b) => (
        <SectionCard key={b.name} title={b.name}>
          <div className="text-sm">{b.plan}</div>
          <div className="mt-2"><StatusPill level={b.level}>{b.status}</StatusPill></div>
        </SectionCard>
      ))}
    </div>
  );
}
function AssetsTab() {
  const assets = [
    { tag: "LMN-0421", type: "Laptop", model: "MacBook Pro 16 M4 Max", serial: "C02XG3JHMD6M", date: "2025-01-20", condition: "Good" },
    { tag: "LMN-0422", type: "Monitor", model: 'Dell U3225QE 32"', serial: "CN0F5R2R", date: "2025-01-20", condition: "Good" },
    { tag: "LMN-0423", type: "Headset", model: "Jabra Evolve2 85", serial: "JE85-9982", date: "2025-01-20", condition: "Fair" },
    { tag: "LMN-0501", type: "Phone", model: "iPhone 16 Pro", serial: "F2LZ8V72QN", date: "2025-11-01", condition: "New" },
  ];
  return (
    <SectionCard title="Assigned equipment">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border">
            <th className="py-2 pr-3">Tag</th><th className="py-2 pr-3">Type</th><th className="py-2 pr-3">Model</th><th className="py-2 pr-3">Serial</th><th className="py-2 pr-3">Assigned</th><th className="py-2 pr-3">Condition</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {assets.map((a) => (
            <tr key={a.tag}>
              <td className="py-2 pr-3 font-mono text-[11px]">{a.tag}</td>
              <td className="py-2 pr-3">{a.type}</td>
              <td className="py-2 pr-3">{a.model}</td>
              <td className="py-2 pr-3 font-mono text-[11px] text-muted-foreground">{a.serial}</td>
              <td className="py-2 pr-3 text-muted-foreground">{a.date}</td>
              <td className="py-2 pr-3"><StatusPill level={a.condition === "New" ? "blue" : a.condition === "Good" ? "green" : "yellow"}>{a.condition}</StatusPill></td>
            </tr>
          ))}
        </tbody>
      </table>
    </SectionCard>
  );
}

function Simple({ message }: { message: string }) {
  return <SectionCard><p className="text-sm text-muted-foreground">{message}</p></SectionCard>;
}
function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="text-sm mt-0.5">{value}</dd>
    </div>
  );
}
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border p-2.5">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-lg font-display font-semibold mt-0.5">{value}</div>
    </div>
  );
}
function RiskRing({ value }: { value: number }) {
  const r = 26, c = 2 * Math.PI * r, off = c - (value / 100) * c;
  const color = value >= 60 ? "#EF4444" : value >= 30 ? "#F59E0B" : "#10B981";
  return (
    <svg width="72" height="72" className="shrink-0">
      <circle cx="36" cy="36" r={r} fill="none" stroke="var(--muted)" strokeWidth="6" />
      <circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="6" strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round" transform="rotate(-90 36 36)" />
      <text x="36" y="41" textAnchor="middle" fontSize="14" fontWeight="600" fill="currentColor">{value}%</text>
    </svg>
  );
}
// Silence unused Avatar import in future-proof way
export const _u = Avatar;
