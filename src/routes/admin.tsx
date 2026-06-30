import { createFileRoute } from "@tanstack/react-router";
import { useState, type ReactNode, type ComponentType } from "react";
import {
  Shield, Users, KeyRound, Database, Workflow, Sparkles, Plug, Palette,
  CreditCard, FileSearch, Lock, Bell, Globe, Activity, Box, Building2,
  Send, Wand2, ChevronRight, Plus, Search, Check, AlertTriangle, Crown,
  Settings2, GitBranch, Cpu, ShieldAlert, Eye, EyeOff, Code2, Mail,
  Smartphone, Layers, Filter, Upload, Download, Trash2, Edit3, Lock as LockIcon,
  Sliders, BookOpen, Webhook, Key, ScrollText, Server, Zap, Brain,
  GraduationCap, Award, ClipboardCheck, Mic, BarChart3,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTeam, roleAtLeast, type Role } from "@/lib/team-context";
import { PageHeader, SectionCard, StatusPill, KpiCard, RiskBadge } from "@/components/enterprise/primitives";

export const Route = createFileRoute("/admin")({ component: AdminCenter });

// ---------------------------------------------------------------------------
// Section definitions
// ---------------------------------------------------------------------------
type SectionId =
  | "overview" | "users" | "roles" | "objects" | "modules" | "workflows" | "ai"
  | "integrations" | "branding" | "comms" | "billing" | "data" | "security" | "audit" | "developer"
  | "learning";

type SectionDef = {
  id: SectionId;
  label: string;
  icon: LucideIcon;
  minRole: Role;
  group: "Govern" | "Build" | "Intelligence" | "Operate";
  blurb: string;
};

const SECTIONS: SectionDef[] = [
  { id: "overview", label: "Overview", icon: Activity, minRole: "manager", group: "Govern", blurb: "Tenant health, license usage & critical alerts" },
  { id: "users", label: "Users & Teams", icon: Users, minRole: "manager", group: "Govern", blurb: "Provisioning, SCIM, groups, hierarchies" },
  { id: "roles", label: "Roles & Permissions", icon: KeyRound, minRole: "admin", group: "Govern", blurb: "RBAC matrix, field-level & record-level access" },
  { id: "security", label: "Security & Compliance", icon: Lock, minRole: "admin", group: "Govern", blurb: "SSO, MFA, IP allow lists, SOC2/GDPR posture" },
  { id: "modules", label: "Modules & Hubs", icon: Layers, minRole: "admin", group: "Build", blurb: "Spin up entirely new hubs like Sales or Support — your own apps inside Limnn" },
  { id: "objects", label: "Objects & Fields", icon: Database, minRole: "admin", group: "Build", blurb: "Custom objects, fields, layouts & validation" },
  { id: "workflows", label: "Workflows & Automation", icon: Workflow, minRole: "admin", group: "Build", blurb: "Triggers, approvals, SLAs & macros" },
  { id: "branding", label: "Branding & Themes", icon: Palette, minRole: "admin", group: "Build", blurb: "Logo, colors, typography & email templates" },
  { id: "comms", label: "Notifications & Channels", icon: Bell, minRole: "manager", group: "Build", blurb: "Email, SMS, push, Slack & in-app routing" },
  { id: "ai", label: "Limnn AI & Copilots", icon: Brain, minRole: "admin", group: "Intelligence", blurb: "Models, prompts, agents & guardrails" },
  { id: "learning", label: "Limnn Learning", icon: GraduationCap, minRole: "admin", group: "Intelligence", blurb: "Tracks, certifications, evaluators, compliance & AI roleplay" },
  { id: "integrations", label: "Integrations & API", icon: Plug, minRole: "admin", group: "Operate", blurb: "Connected apps, webhooks & marketplace" },
  { id: "data", label: "Data & Storage", icon: Server, minRole: "admin", group: "Operate", blurb: "Imports, exports, retention & residency" },
  { id: "billing", label: "Billing & Licenses", icon: CreditCard, minRole: "superadmin", group: "Operate", blurb: "Seats, plan, invoices & usage caps" },
  { id: "audit", label: "Audit & Activity", icon: FileSearch, minRole: "admin", group: "Operate", blurb: "Immutable event log, exports & investigations" },
  { id: "developer", label: "Developer Platform", icon: Code2, minRole: "superadmin", group: "Operate", blurb: "API keys, OAuth apps, sandboxes & CLI" },
];


// ---------------------------------------------------------------------------
// Shell
// ---------------------------------------------------------------------------
function AdminCenter() {
  const { role } = useTeam();
  const [active, setActive] = useState<SectionId>("overview");
  const [aiOpen, setAiOpen] = useState(true);

  const groups = ["Govern", "Build", "Intelligence", "Operate"] as const;
  const current = SECTIONS.find((s) => s.id === active)!;
  const canAccess = roleAtLeast(role, current.minRole);

  return (
    <div className="min-h-[calc(100vh-56px)] flex">
      {/* Admin sub-sidebar */}
      <aside className="w-[248px] shrink-0 border-r border-border bg-card/40 flex flex-col">
        <div className="px-4 pt-5 pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="h-8 w-8 rounded-lg grid place-items-center text-white shadow-sm"
              style={{ background: "linear-gradient(135deg, #2C69CF, #1E293B)" }}>
              <Shield className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <div className="font-display text-[14px] font-semibold leading-tight">Admin Center</div>
              <div className="text-[10.5px] text-muted-foreground flex items-center gap-1">
                <Crown className="h-2.5 w-2.5" /> {role === "superadmin" ? "Super Admin" : role === "admin" ? "Admin" : role === "manager" ? "Manager" : "Read-only"}
              </div>
            </div>
          </div>
          <div className="relative mt-3">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input placeholder="Search settings…" className="w-full h-8 pl-8 pr-2 text-[12px] rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring/30" />
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-2">
          {groups.map((g) => (
            <div key={g} className="px-2 pb-1">
              <div className="px-2 pt-2 pb-1 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{g}</div>
              {SECTIONS.filter((s) => s.group === g).map((s) => {
                const allowed = roleAtLeast(role, s.minRole);
                const isActive = active === s.id;
                const Icon = s.icon;
                return (
                  <button
                    key={s.id}
                    onClick={() => setActive(s.id)}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-[12.5px] text-left transition group"
                    style={{
                      background: isActive ? "color-mix(in oklab, var(--primary) 12%, transparent)" : "transparent",
                      color: isActive ? "var(--primary)" : allowed ? "var(--foreground)" : "var(--muted-foreground)",
                      fontWeight: isActive ? 600 : 500,
                      opacity: allowed ? 1 : 0.55,
                    }}
                    onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "var(--accent)"; }}
                    onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    <span className="flex-1 truncate">{s.label}</span>
                    {!allowed && <LockIcon className="h-3 w-3" />}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
        <div className="p-3 border-t border-border">
          <div className="rounded-md border border-border bg-background/60 p-2.5">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Build anything</div>
            <div className="text-[11px] text-foreground leading-snug">If it doesn't exist, you can build it — custom objects, workflows, even entire modules.</div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 overflow-y-auto">
        <div className="px-5 py-6 max-w-[1200px] mx-auto">
          <Breadcrumb section={current} />
          {!canAccess ? (
            <NoAccess section={current} role={role} />
          ) : (
            <SectionRouter id={active} />
          )}
        </div>
      </div>

      {/* AI Copilot drawer — collapsible */}
      {aiOpen ? (
        <AdminAiCopilot section={current} onCollapse={() => setAiOpen(false)} />
      ) : (
        <button
          onClick={() => setAiOpen(true)}
          className="w-11 shrink-0 border-l border-border flex flex-col items-center justify-start pt-4 gap-3 hover:bg-accent/40 transition group"
          title="Open Limnn Admin Copilot"
        >
          <span className="h-8 w-8 rounded-lg grid place-items-center text-white shadow-sm shrink-0"
            style={{ background: "linear-gradient(135deg, #2C69CF, #7C3AED)" }}>
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground group-hover:text-foreground"
            style={{ writingMode: "vertical-rl" }}>
            Limnn Copilot
          </span>
        </button>
      )}
    </div>
  );
}


function Breadcrumb({ section }: { section: SectionDef }) {
  const Icon = section.icon;
  return (
    <div className="mb-5">
      <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 mb-1.5">
        <Shield className="h-3 w-3" /> Admin Center <ChevronRight className="h-3 w-3" /> {section.group} <ChevronRight className="h-3 w-3" /> <span className="text-foreground font-medium">{section.label}</span>
      </div>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="h-10 w-10 rounded-xl grid place-items-center"
            style={{ background: "color-mix(in oklab, var(--primary) 12%, transparent)", color: "var(--primary)" }}>
            <Icon className="h-5 w-5" />
          </span>
          <div>
            <h1 className="font-display text-[22px] font-semibold tracking-tight leading-tight">{section.label}</h1>
            <p className="text-[13px] text-muted-foreground mt-0.5">{section.blurb}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusPill level="green">All systems healthy</StatusPill>
        </div>
      </div>
    </div>
  );
}

function NoAccess({ section, role }: { section: SectionDef; role: Role }) {
  return (
    <SectionCard>
      <div className="text-center py-10">
        <div className="mx-auto h-12 w-12 rounded-xl grid place-items-center mb-3"
          style={{ background: "color-mix(in oklab, var(--destructive) 12%, transparent)", color: "var(--destructive)" }}>
          <ShieldAlert className="h-5 w-5" />
        </div>
        <h3 className="font-display text-base font-semibold">Restricted area</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
          {section.label} requires <strong className="text-foreground capitalize">{section.minRole}</strong> access.
          You are signed in as <strong className="text-foreground capitalize">{role}</strong>. Ask a Super Admin to elevate your role or request access.
        </p>
        <button className="mt-4 inline-flex items-center gap-1.5 h-9 px-3 rounded-md text-sm font-medium text-primary-foreground" style={{ background: "var(--primary)" }}>
          <Send className="h-3.5 w-3.5" /> Request access
        </button>
      </div>
    </SectionCard>
  );
}

// ---------------------------------------------------------------------------
// Section router
// ---------------------------------------------------------------------------
function SectionRouter({ id }: { id: SectionId }) {
  switch (id) {
    case "overview": return <OverviewSection />;
    case "users": return <UsersSection />;
    case "roles": return <RolesSection />;
    case "security": return <SecuritySection />;
    case "modules": return <ModulesSection />;
    case "objects": return <ObjectsSection />;
    case "workflows": return <WorkflowsSection />;
    case "branding": return <BrandingSection />;
    case "comms": return <CommsSection />;
    case "ai": return <AiSection />;
    case "learning": return <LearningSection />;
    case "integrations": return <IntegrationsSection />;
    case "data": return <DataSection />;
    case "billing": return <BillingSection />;
    case "audit": return <AuditSection />;
    case "developer": return <DeveloperSection />;
  }
}

// ---------------------------------------------------------------------------
// OVERVIEW
// ---------------------------------------------------------------------------
function OverviewSection() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Active users" value="248 / 300" delta={4.2} icon={Users} spark={[12,18,16,22,28,32,36]} />
        <KpiCard label="License usage" value="82%" delta={6.1} icon={CreditCard} spark={[60,62,64,68,72,78,82]} />
        <KpiCard label="API calls (24h)" value="1.2M" delta={-2.4} icon={Zap} spark={[40,44,52,48,46,42,40]} />
        <KpiCard label="Open incidents" value="0" delta={0} icon={Activity} spark={[1,0,0,1,0,0,0]} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5">
        <SectionCard title="Tenant configuration" subtitle="High-level rollup of what Admins have configured"
          action={<button className="text-[11px] text-primary font-medium inline-flex items-center gap-1">View all <ChevronRight className="h-3 w-3" /></button>}>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Custom objects", value: "14", icon: Database },
              { label: "Active workflows", value: "62", icon: Workflow },
              { label: "Integrations", value: "23", icon: Plug },
              { label: "AI agents", value: "9", icon: Brain },
              { label: "Roles defined", value: "11", icon: KeyRound },
              { label: "Audit events (30d)", value: "184k", icon: FileSearch },
            ].map((c) => (
              <div key={c.label} className="rounded-lg border border-border p-3 flex items-center gap-3 hover:bg-accent/40 transition">
                <c.icon className="h-4 w-4 text-primary" />
                <div className="min-w-0">
                  <div className="text-[11px] text-muted-foreground">{c.label}</div>
                  <div className="text-base font-display font-semibold">{c.value}</div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Critical alerts" subtitle="Action-required items from across the tenant">
          <ul className="space-y-2">
            {[
              { lvl: "yellow" as const, t: "12 dormant licenses", b: "Reclaim seats unused for 60+ days to save $2,160/mo." },
              { lvl: "red" as const, t: "2 webhooks failing", b: "Stripe → Billing Ops returning 401 since 09:42." },
              { lvl: "blue" as const, t: "New AI guardrail update", b: "Recommended PII redaction policy ready to enable." },
            ].map((a, i) => (
              <li key={i} className="rounded-lg border border-border p-3 flex items-start gap-3">
                <StatusPill level={a.lvl}>{a.t}</StatusPill>
                <div className="text-xs text-muted-foreground flex-1">{a.b}</div>
                <button className="text-[11px] font-medium text-primary">Resolve</button>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// USERS & TEAMS
// ---------------------------------------------------------------------------
function UsersSection() {
  const users = [
    { name: "Anees Naveed", email: "anees@limnn.io", role: "Super Admin", team: "Sales", status: "Active", last: "Just now" },
    { name: "Priya Mehta", email: "priya@limnn.io", role: "Admin", team: "Customer Success", status: "Active", last: "2m ago" },
    { name: "Diego Alvarez", email: "diego@limnn.io", role: "Manager", team: "Sales", status: "Active", last: "12m ago" },
    { name: "Mei Tanaka", email: "mei@limnn.io", role: "Agent", team: "Support", status: "Active", last: "1h ago" },
    { name: "Jordan Pierce", email: "jordan@limnn.io", role: "Agent", team: "Marketing", status: "Invited", last: "Pending" },
    { name: "Olu Adebayo", email: "olu@limnn.io", role: "Manager", team: "Billing Ops", status: "Suspended", last: "5d ago" },
  ];
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Total users" value="312" delta={8.1} icon={Users} />
        <KpiCard label="Active (30d)" value="248" delta={4.2} icon={Activity} />
        <KpiCard label="Pending invites" value="14" icon={Mail} />
        <KpiCard label="Suspended" value="3" icon={ShieldAlert} />
      </div>
      <SectionCard
        title="Directory"
        subtitle="SCIM-synced from Okta · last sync 2 minutes ago"
        action={
          <div className="flex items-center gap-2">
            <button className="h-8 px-2.5 rounded-md text-xs font-medium border border-border inline-flex items-center gap-1"><Upload className="h-3 w-3"/>Import CSV</button>
            <button className="h-8 px-2.5 rounded-md text-xs font-medium text-primary-foreground inline-flex items-center gap-1" style={{ background: "var(--primary)" }}><Plus className="h-3 w-3"/>Invite user</button>
          </div>
        }
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] uppercase tracking-wide text-muted-foreground border-b border-border">
              <th className="text-left py-2 font-medium">User</th>
              <th className="text-left font-medium">Role</th>
              <th className="text-left font-medium">Team</th>
              <th className="text-left font-medium">Status</th>
              <th className="text-left font-medium">Last active</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.email} className="border-b border-border/60 hover:bg-accent/30">
                <td className="py-2.5">
                  <div className="font-medium">{u.name}</div>
                  <div className="text-[11px] text-muted-foreground">{u.email}</div>
                </td>
                <td><span className="text-[11px] font-medium">{u.role}</span></td>
                <td className="text-[12.5px] text-muted-foreground">{u.team}</td>
                <td>
                  <StatusPill level={u.status === "Active" ? "green" : u.status === "Invited" ? "blue" : "red"}>{u.status}</StatusPill>
                </td>
                <td className="text-[12px] text-muted-foreground">{u.last}</td>
                <td className="text-right pr-1">
                  <button className="h-7 w-7 rounded-md hover:bg-accent grid place-items-center"><Edit3 className="h-3.5 w-3.5 text-muted-foreground"/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <SectionCard title="Teams & hierarchy">
          {["Revenue (CRO)","↳ Sales · 42 members","↳ Customer Success · 28","↳ Marketing · 18","Support · 36 members","Billing Ops · 11"].map((t,i)=>(
            <div key={i} className="flex items-center justify-between py-1.5 border-b border-border/60 last:border-0">
              <span className="text-[13px]" style={{ paddingLeft: t.startsWith("↳") ? 14 : 0 }}>{t}</span>
              <button className="text-[11px] text-primary">Edit</button>
            </div>
          ))}
        </SectionCard>
        <SectionCard title="Provisioning" subtitle="Identity providers & SCIM">
          <Row label="Okta SSO (SAML 2.0)" status="green" right="Connected"/>
          <Row label="SCIM auto-provisioning" status="green" right="Active · 312 users"/>
          <Row label="Just-in-time provisioning" status="neutral" right="Disabled"/>
          <Row label="Default role for new users" status="blue" right="Agent (Sales)"/>
        </SectionCard>
      </div>
    </div>
  );
}

function Row({ label, status, right }: { label: string; status: "green"|"yellow"|"red"|"blue"|"neutral"; right: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/60 last:border-0">
      <span className="text-[13px]">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-[12px] text-muted-foreground">{right}</span>
        <StatusPill level={status}>{status === "green" ? "OK" : status === "blue" ? "Info" : status === "yellow" ? "Warn" : status === "red" ? "Error" : "Off"}</StatusPill>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ROLES & PERMISSIONS
// ---------------------------------------------------------------------------
function RolesSection() {
  const roles = ["Super Admin","Admin","Sales Manager","Sales Agent","CS Manager","CS Agent","Support Agent","Billing Ops","Marketing","Read-only"];
  const perms = [
    { cat: "Records", items: ["Create","Read","Update","Delete","Export","Mass edit"] },
    { cat: "Configuration", items: ["Objects & fields","Workflows","Branding","Integrations"] },
    { cat: "Platform", items: ["Billing","Users & roles","API & keys","Audit log"] },
  ];
  return (
    <div className="space-y-5">
      <SectionCard
        title="Role matrix"
        subtitle="Click any cell to toggle. Super Admin permissions are immutable."
        action={<button className="h-8 px-2.5 rounded-md text-xs font-medium text-primary-foreground inline-flex items-center gap-1" style={{ background: "var(--primary)" }}><Plus className="h-3 w-3"/>New role</button>}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr>
                <th className="text-left py-2 font-medium text-muted-foreground sticky left-0 bg-card">Permission</th>
                {roles.map((r) => (
                  <th key={r} className="text-center font-medium text-muted-foreground px-2 min-w-[88px]">{r}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {perms.map((g) => (
                <>
                  <tr key={g.cat}><td colSpan={roles.length+1} className="pt-3 pb-1 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{g.cat}</td></tr>
                  {g.items.map((p) => (
                    <tr key={p} className="border-t border-border/60">
                      <td className="py-1.5 sticky left-0 bg-card">{p}</td>
                      {roles.map((r, i) => {
                        const granted = r === "Super Admin" || (r === "Admin" && g.cat !== "Platform") || (i % 3 === 0 && g.cat === "Records");
                        return (
                          <td key={r} className="text-center">
                            <span className="inline-flex h-5 w-5 rounded items-center justify-center"
                              style={{ background: granted ? "color-mix(in oklab, var(--success) 18%, transparent)" : "var(--muted)", color: granted ? "var(--success)" : "var(--muted-foreground)" }}>
                              {granted ? <Check className="h-3 w-3"/> : <span className="text-[10px]">—</span>}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <SectionCard title="Field-level security" subtitle="Hide or mask sensitive fields per role">
          {["Contact.ssn — masked for all but Admin","Opportunity.discount — read-only for Agent","Account.churn_score — hidden from Marketing","Invoice.bank_details — Billing Ops only"].map((r) => (
            <div key={r} className="text-[12.5px] py-1.5 border-b border-border/60 last:border-0 flex items-center gap-2">
              <Eye className="h-3.5 w-3.5 text-muted-foreground"/> {r}
            </div>
          ))}
        </SectionCard>
        <SectionCard title="Record-level sharing rules">
          {["Sales reps see only their owned accounts","Managers see their direct reports' pipeline","CS sees accounts where ARR > $50k","Support agents see tickets assigned or in queue"].map((r) => (
            <div key={r} className="text-[12.5px] py-1.5 border-b border-border/60 last:border-0 flex items-center gap-2">
              <Filter className="h-3.5 w-3.5 text-muted-foreground"/> {r}
            </div>
          ))}
        </SectionCard>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SECURITY
// ---------------------------------------------------------------------------
function SecuritySection() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="SOC2 posture" value="98%" delta={1.2} icon={Shield} />
        <KpiCard label="MFA coverage" value="96%" delta={3.8} icon={LockIcon} />
        <KpiCard label="Failed logins (24h)" value="14" delta={-22} icon={ShieldAlert} />
        <KpiCard label="Active sessions" value="284" icon={Activity} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <SectionCard title="Authentication">
          <Toggle label="Require MFA for all users" on />
          <Toggle label="Enforce SSO (block password login)" on />
          <Toggle label="Passwordless / WebAuthn" />
          <Toggle label="Session idle timeout (30 min)" on />
          <Toggle label="Re-authenticate for sensitive actions" on />
        </SectionCard>
        <SectionCard title="Network & access">
          <Toggle label="IP allow list enforced" on />
          <Toggle label="Block exports outside business hours" />
          <Toggle label="VPN required for Admin Center" />
          <Toggle label="Device trust (managed devices only)" on />
        </SectionCard>
        <SectionCard title="Data protection">
          <Toggle label="At-rest encryption (AES-256)" on disabled />
          <Toggle label="Customer-managed keys (BYOK)" />
          <Toggle label="PII auto-redaction in logs" on />
          <Toggle label="Block AI training on tenant data" on disabled />
        </SectionCard>
        <SectionCard title="Compliance" subtitle="Frameworks & residency">
          <Row label="SOC 2 Type II" status="green" right="Renewed Mar 2026"/>
          <Row label="GDPR" status="green" right="Enabled · DPA signed"/>
          <Row label="HIPAA" status="neutral" right="Not configured"/>
          <Row label="Data residency" status="blue" right="EU (Frankfurt)"/>
        </SectionCard>
      </div>
    </div>
  );
}

function Toggle({ label, on, disabled }: { label: string; on?: boolean; disabled?: boolean }) {
  const [v, setV] = useState(!!on);
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/60 last:border-0">
      <span className="text-[13px]" style={{ color: disabled ? "var(--muted-foreground)" : undefined }}>{label}</span>
      <button
        onClick={() => !disabled && setV(!v)}
        disabled={disabled}
        className="h-5 w-9 rounded-full transition relative"
        style={{ background: v ? "var(--primary)" : "var(--muted)", opacity: disabled ? 0.6 : 1 }}
      >
        <span className="absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all shadow" style={{ left: v ? 18 : 2 }} />
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// OBJECTS & FIELDS
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// MODULES & HUBS — build entirely new apps inside Limnn
// ---------------------------------------------------------------------------
function ModulesSection() {
  const installed = [
    { name: "Sales", icon: "📈", objects: 6, workflows: 18, users: 84, status: "green" as const, custom: false },
    { name: "Customer Success", icon: "❤️", objects: 5, workflows: 14, users: 22, status: "green" as const, custom: false },
    { name: "Support Center", icon: "💬", objects: 4, workflows: 21, users: 36, status: "green" as const, custom: false },
    { name: "Marketing", icon: "📣", objects: 7, workflows: 12, users: 14, status: "green" as const, custom: false },
    { name: "Limnn Grid", icon: "🧩", objects: 4, workflows: 9, users: 48, status: "green" as const, custom: false },
    { name: "Billing Ops", icon: "🧾", objects: 6, workflows: 16, users: 11, status: "green" as const, custom: false },
    { name: "Partner Portal", icon: "🤝", objects: 3, workflows: 5, users: 9, status: "yellow" as const, custom: true },
    { name: "Field Service", icon: "🛠️", objects: 4, workflows: 7, users: 18, status: "green" as const, custom: true },
  ];
  const templates = [
    { name: "Recruiting & ATS", blurb: "Candidates, requisitions, interview loops & offers" },
    { name: "Asset Management", blurb: "Track equipment, licenses, depreciation & owners" },
    { name: "Vendor & Procurement", blurb: "RFPs, contracts, POs and 3-way match" },
    { name: "Blank module", blurb: "Start from scratch — name it, theme it, build it" },
  ];
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Installed modules" value="8" icon={Layers} />
        <KpiCard label="Custom modules" value="2" delta={100} icon={Box} />
        <KpiCard label="Objects across tenant" value="39" icon={Database} />
        <KpiCard label="Cross-module workflows" value="62" icon={Workflow} />
      </div>

      <SectionCard
        title="Build a new module"
        subtitle="A module is a full hub like Sales or Support — its own sidebar entry, objects, workflows, dashboards, and permissions"
        action={
          <div className="flex items-center gap-2">
            <button className="h-8 px-2.5 rounded-md text-xs font-medium border border-border inline-flex items-center gap-1"><Sparkles className="h-3 w-3"/>Describe to Limnn</button>
            <button className="h-8 px-2.5 rounded-md text-xs font-medium text-primary-foreground inline-flex items-center gap-1" style={{ background: "var(--primary)" }}><Plus className="h-3 w-3"/>New module</button>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {templates.map((t) => (
            <div key={t.name} className="rounded-lg border border-dashed border-border p-3 hover:border-primary/50 hover:bg-accent/30 transition cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="font-medium text-[13px] flex items-center gap-2"><Wand2 className="h-3.5 w-3.5 text-primary"/>{t.name}</div>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground"/>
              </div>
              <div className="text-[11.5px] text-muted-foreground mt-1">{t.blurb}</div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Installed modules" subtitle="Each module owns its sidebar entry, objects, automations & role gates">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {installed.map((m) => (
            <div key={m.name} className="rounded-lg border border-border p-3 hover:border-primary/40 transition">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="h-9 w-9 rounded-lg grid place-items-center text-base" style={{ background: "color-mix(in oklab, var(--primary) 10%, transparent)" }}>{m.icon}</span>
                  <div className="min-w-0">
                    <div className="font-medium text-[13px] flex items-center gap-1.5">
                      {m.name}
                      {m.custom && <span className="text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded" style={{ background: "color-mix(in oklab, var(--primary) 12%, transparent)", color: "var(--primary)" }}>Custom</span>}
                    </div>
                    <div className="text-[11px] text-muted-foreground">{m.objects} objects · {m.workflows} flows · {m.users} users</div>
                  </div>
                </div>
                <StatusPill level={m.status}>{m.status === "green" ? "Live" : "Draft"}</StatusPill>
              </div>
              <div className="mt-2.5 flex items-center gap-1.5">
                <button className="text-[11px] px-2 py-1 rounded-md border border-border hover:bg-accent">Open</button>
                <button className="text-[11px] px-2 py-1 rounded-md border border-border hover:bg-accent">Configure</button>
                <button className="text-[11px] px-2 py-1 rounded-md border border-border hover:bg-accent">Permissions</button>
                {m.custom && <button className="text-[11px] px-2 py-1 rounded-md text-destructive hover:bg-destructive/10 ml-auto">Archive</button>}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function ObjectsSection() {
  const objects = [
    { name: "Account", fields: 42, records: "12,840", custom: false },
    { name: "Opportunity", fields: 58, records: "3,210", custom: false },
    { name: "Contact", fields: 36, records: "48,920", custom: false },
    { name: "Ticket", fields: 31, records: "9,140", custom: false },
    { name: "Renewal Risk", fields: 14, records: "284", custom: true },
    { name: "Sandbox Project", fields: 22, records: "62", custom: true },
  ];
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
        <SectionCard
          title="Schema explorer"
          subtitle="Build custom objects, fields, picklists, validation rules & layouts"
          action={<button className="h-8 px-2.5 rounded-md text-xs font-medium text-primary-foreground inline-flex items-center gap-1" style={{ background: "var(--primary)" }}><Plus className="h-3 w-3"/>New object</button>}
        >
          <div className="grid grid-cols-2 gap-2">
            {objects.map((o) => (
              <div key={o.name} className="rounded-lg border border-border p-3 hover:border-primary/40 transition cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Box className="h-3.5 w-3.5 text-primary" />
                    <span className="font-medium text-[13px]">{o.name}</span>
                  </div>
                  {o.custom && <span className="text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded" style={{ background: "color-mix(in oklab, var(--primary) 12%, transparent)", color: "var(--primary)" }}>Custom</span>}
                </div>
                <div className="text-[11px] text-muted-foreground mt-2 flex gap-3">
                  <span>{o.fields} fields</span>
                  <span>{o.records} records</span>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="Field types available">
          {[
            { i: "T", l: "Text · Long text · Rich text" },
            { i: "#", l: "Number · Currency · Percent" },
            { i: "📅", l: "Date · DateTime · Duration" },
            { i: "▾", l: "Picklist · Multi-select · Dependent" },
            { i: "🔗", l: "Lookup · Master-detail · Hierarchy" },
            { i: "✏", l: "Formula · Rollup · AI-generated" },
            { i: "📎", l: "File · Image · Signature" },
          ].map((f) => (
            <div key={f.l} className="flex items-center gap-2 py-1.5 text-[12.5px] border-b border-border/60 last:border-0">
              <span className="h-6 w-6 rounded grid place-items-center text-[11px] font-mono" style={{ background: "var(--muted)" }}>{f.i}</span>
              {f.l}
            </div>
          ))}
        </SectionCard>
      </div>
      <SectionCard title="Page layouts & record pages" subtitle="Drag-and-drop layout assignments per role and record type">
        <div className="grid grid-cols-3 gap-3">
          {["Sales — Opportunity (compact)","CS — Account (renewal focus)","Support — Ticket (SLA priority)"].map((l) => (
            <div key={l} className="rounded-lg border border-border p-3 text-[12.5px]">
              <div className="font-medium mb-2">{l}</div>
              <div className="space-y-1">
                <div className="h-2 rounded bg-muted w-3/4"/>
                <div className="h-2 rounded bg-muted w-1/2"/>
                <div className="h-2 rounded bg-muted w-2/3"/>
              </div>
              <button className="mt-3 text-[11px] text-primary font-medium">Open layout editor →</button>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

// ---------------------------------------------------------------------------
// WORKFLOWS
// ---------------------------------------------------------------------------
function WorkflowsSection() {
  const flows = [
    { name: "Auto-route inbound leads", trigger: "Lead created", runs: "1,284", status: "green" as const },
    { name: "CPQ >15% discount approval", trigger: "Quote.discount > 15%", runs: "62", status: "green" as const },
    { name: "Renewal 90-day alert", trigger: "Account.renewal_date − 90d", runs: "184", status: "green" as const },
    { name: "Churn-risk escalation", trigger: "Health < 40", runs: "23", status: "yellow" as const },
    { name: "SLA breach → manager", trigger: "Ticket idle > 4h", runs: "9", status: "red" as const },
    { name: "Invoice past-due dunning", trigger: "Invoice.overdue ≥ 7d", runs: "412", status: "green" as const },
  ];
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Active workflows" value="62" icon={Workflow} />
        <KpiCard label="Runs (24h)" value="14.2k" delta={3.2} icon={Zap} />
        <KpiCard label="Avg latency" value="220ms" delta={-8} icon={Activity} />
        <KpiCard label="Failures (24h)" value="11" delta={-40} icon={AlertTriangle} />
      </div>
      <SectionCard
        title="Automation library"
        action={
          <div className="flex items-center gap-2">
            <button className="h-8 px-2.5 rounded-md text-xs font-medium border border-border inline-flex items-center gap-1"><Sparkles className="h-3 w-3"/>Build with AI</button>
            <button className="h-8 px-2.5 rounded-md text-xs font-medium text-primary-foreground inline-flex items-center gap-1" style={{ background: "var(--primary)" }}><Plus className="h-3 w-3"/>New workflow</button>
          </div>
        }
      >
          {flows.map((f) => (
            <div key={f.name} className="flex items-center gap-3 py-2.5 border-b border-border/60 last:border-0">
              <GitBranch className="h-4 w-4 text-primary shrink-0"/>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-[13px]">{f.name}</div>
                <div className="text-[11px] text-muted-foreground font-mono">{f.trigger}</div>
              </div>
              <span className="text-[11px] text-muted-foreground">{f.runs} runs / 30d</span>
              <StatusPill level={f.status}>{f.status === "green" ? "Healthy" : f.status === "yellow" ? "Degraded" : "Failing"}</StatusPill>
              <button className="text-[11px] text-primary font-medium">Edit</button>
            </div>
          ))}
      </SectionCard>

      <SectionCard title="Builder canvas" subtitle="Visual no-code editor — When / If / Do">
        <div className="rounded-lg border border-dashed border-border bg-muted/30 p-6">
          <div className="flex items-center gap-2 flex-wrap text-[12.5px]">
            <Pill color="blue">WHEN  Lead created</Pill> →
            <Pill color="amber">{`IF  source = "Outbound" AND score > 70`}</Pill> →
            <Pill color="green">DO  Assign to round-robin Sales pod</Pill> →
            <Pill color="green">THEN  Send Slack ping + enroll in 5-step cadence</Pill>
          </div>
          <div className="mt-4 text-[11px] text-muted-foreground">Drag steps from the right panel · branch with conditions · add approval gates · invoke AI agents inline.</div>
        </div>
      </SectionCard>
    </div>
  );
}

function Pill({ color, children }: { color: "blue"|"amber"|"green"; children: ReactNode }) {
  const map = { blue: "var(--primary)", amber: "#F59E0B", green: "var(--success)" };
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-md font-mono text-[11.5px] font-medium" style={{ background: `color-mix(in oklab, ${map[color]} 12%, transparent)`, color: map[color], border: `1px solid color-mix(in oklab, ${map[color]} 28%, transparent)` }}>{children}</span>
  );
}

// ---------------------------------------------------------------------------
// BRANDING
// ---------------------------------------------------------------------------
function BrandingSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <SectionCard title="Identity">
        <div className="space-y-3">
          <Field label="Workspace name" value="Limnn" />
          <Field label="Subdomain" value="limnn.crm.app" />
          <div>
            <div className="text-[11px] text-muted-foreground mb-1.5">Logo</div>
            <div className="h-20 rounded-lg border border-dashed border-border grid place-items-center text-[12px] text-muted-foreground">Drop SVG/PNG · max 2MB</div>
          </div>
        </div>
      </SectionCard>
      <SectionCard title="Theme">
        <div className="text-[11px] text-muted-foreground mb-2">Primary palette</div>
        <div className="flex gap-2 mb-4">
          {["#2C69CF","#1E293B","#F6F1E6","#EF4444","#10B981","#F59E0B"].map((c)=>(
            <button key={c} className="h-9 w-9 rounded-md border border-border shadow-sm" style={{ background: c }} title={c}/>
          ))}
        </div>
        <Field label="Display font" value="Poppins" />
        <Field label="Body font" value="Inter" />
        <div className="mt-3 flex items-center gap-2">
          <button className="h-8 px-2.5 rounded-md text-xs font-medium border border-border">Light</button>
          <button className="h-8 px-2.5 rounded-md text-xs font-medium text-primary-foreground" style={{ background: "var(--primary)" }}>Auto</button>
          <button className="h-8 px-2.5 rounded-md text-xs font-medium border border-border">Dark</button>
        </div>
      </SectionCard>
      <SectionCard title="Email templates" className="lg:col-span-2">
        {["Welcome email","Password reset","Quote sent (CPQ)","Invoice ready","Renewal reminder","CSAT survey"].map((t)=>(
          <div key={t} className="flex items-center justify-between py-2 border-b border-border/60 last:border-0">
            <div className="flex items-center gap-2 text-[13px]"><Mail className="h-3.5 w-3.5 text-muted-foreground"/>{t}</div>
            <div className="flex items-center gap-2">
              <StatusPill level="green">Branded</StatusPill>
              <button className="text-[11px] text-primary">Edit</button>
            </div>
          </div>
        ))}
      </SectionCard>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] text-muted-foreground mb-1">{label}</div>
      <input defaultValue={value} className="w-full h-9 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// COMMS
// ---------------------------------------------------------------------------
function CommsSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <SectionCard title="Channels">
        {[
          { i: Mail, l: "Email (SendGrid)", s: "green" as const, r: "Connected" },
          { i: Smartphone, l: "SMS (Twilio)", s: "green" as const, r: "Connected" },
          { i: Bell, l: "Push (Firebase)", s: "green" as const, r: "Connected" },
          { i: Globe, l: "In-app (Limnn Threads)", s: "green" as const, r: "Native" },
          { i: Webhook, l: "Slack workspace", s: "yellow" as const, r: "Token refresh needed" },
        ].map((c) => (
          <div key={c.l} className="flex items-center justify-between py-2 border-b border-border/60 last:border-0">
            <div className="flex items-center gap-2 text-[13px]"><c.i className="h-3.5 w-3.5 text-muted-foreground"/>{c.l}</div>
            <div className="flex items-center gap-2"><span className="text-[11px] text-muted-foreground">{c.r}</span><StatusPill level={c.s}>{c.s === "green" ? "OK" : "Action"}</StatusPill></div>
          </div>
        ))}
      </SectionCard>
      <SectionCard title="Notification routing">
        {[
          "High-priority ticket → Support manager (SMS + Slack)",
          "Closed-won > $50k → #sales-velocity",
          "Failed payment → Billing Ops (Email)",
          "Churn risk red → CSM owner + VP CS",
          "AI guardrail violation → Security team (Slack + Email)",
        ].map((r) => (
          <div key={r} className="text-[12.5px] py-1.5 border-b border-border/60 last:border-0 flex items-center gap-2">
            <ChevronRight className="h-3 w-3 text-muted-foreground"/>{r}
          </div>
        ))}
      </SectionCard>
    </div>
  );
}

// ---------------------------------------------------------------------------
// AI & COPILOTS
// ---------------------------------------------------------------------------
function AiSection() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="AI agents" value="9" icon={Brain} />
        <KpiCard label="Calls (30d)" value="84k" delta={22} icon={Sparkles} />
        <KpiCard label="Avg confidence" value="86%" delta={2.4} icon={Activity} />
        <KpiCard label="Guardrail blocks" value="42" delta={-12} icon={ShieldAlert} />
      </div>
      <SectionCard title="Agents" subtitle="Configure copilots embedded across hubs"
        action={<button className="h-8 px-2.5 rounded-md text-xs font-medium text-primary-foreground inline-flex items-center gap-1" style={{ background: "var(--primary)" }}><Plus className="h-3 w-3"/>New agent</button>}
      >
        {[
          { n: "Sales Coach", m: "gemini-3-flash", scope: "Sales Hub", calls: "12.4k" },
          { n: "CS Renewal Strategist", m: "gemini-3-pro", scope: "Customer Success", calls: "3.1k" },
          { n: "Support Deflection Bot", m: "gemini-3-flash", scope: "Limnn Chat", calls: "48.2k" },
          { n: "FP&A Forecaster", m: "gemini-3-pro", scope: "Billing Ops", calls: "1.8k" },
          { n: "Admin Copilot (this view)", m: "gemini-3-pro", scope: "Admin Center", calls: "612" },
        ].map((a) => (
          <div key={a.n} className="flex items-center gap-3 py-2.5 border-b border-border/60 last:border-0">
            <span className="h-7 w-7 rounded-md grid place-items-center" style={{ background: "color-mix(in oklab, var(--primary) 12%, transparent)", color: "var(--primary)" }}><Brain className="h-3.5 w-3.5"/></span>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-[13px]">{a.n}</div>
              <div className="text-[11px] text-muted-foreground">{a.scope} · {a.calls} calls / 30d</div>
            </div>
            <span className="font-mono text-[11px] text-muted-foreground">{a.m}</span>
            <RiskBadge confidence={86} label="conf"/>
            <button className="text-[11px] text-primary font-medium">Tune</button>
          </div>
        ))}
      </SectionCard>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <SectionCard title="Guardrails">
          <Toggle label="PII redaction in prompts" on />
          <Toggle label="Block prompt injection patterns" on />
          <Toggle label="Require citation for factual claims" on />
          <Toggle label="Human-in-loop for write actions > $10k" on />
          <Toggle label="Allow model fine-tuning on tenant data" />
        </SectionCard>
        <SectionCard title="Prompt library" subtitle="Versioned, reviewable, A/B testable">
          {["Discovery call summary v4 · live","Objection handler v2 · staging","Renewal QBR outline v7 · live","Ticket triage v3 · live"].map((p) => (
            <div key={p} className="text-[12.5px] py-1.5 border-b border-border/60 last:border-0 flex items-center gap-2">
              <BookOpen className="h-3.5 w-3.5 text-muted-foreground"/>{p}
            </div>
          ))}
        </SectionCard>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// INTEGRATIONS
// ---------------------------------------------------------------------------
function IntegrationsSection() {
  const apps = [
    { n: "Salesforce", c: "CRM sync", s: "green" as const },
    { n: "Stripe", c: "Billing", s: "yellow" as const },
    { n: "HubSpot", c: "Marketing", s: "green" as const },
    { n: "Zendesk", c: "Support import", s: "green" as const },
    { n: "Slack", c: "Notifications", s: "green" as const },
    { n: "Google Workspace", c: "Calendar + Mail", s: "green" as const },
    { n: "Microsoft 365", c: "Calendar + Mail", s: "green" as const },
    { n: "Twilio", c: "Voice / SMS", s: "green" as const },
    { n: "Snowflake", c: "Warehouse sync", s: "green" as const },
    { n: "DocuSign", c: "e-Signature", s: "green" as const },
    { n: "Gong", c: "Conversation intel", s: "green" as const },
    { n: "Intercom", c: "Live chat", s: "neutral" as const },
  ];
  return (
    <div className="space-y-5">
      <SectionCard title="Connected apps" subtitle="23 active · 140+ available in marketplace"
        action={<button className="h-8 px-2.5 rounded-md text-xs font-medium text-primary-foreground inline-flex items-center gap-1" style={{ background: "var(--primary)" }}><Plug className="h-3 w-3"/>Browse marketplace</button>}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {apps.map((a) => (
            <div key={a.n} className="rounded-lg border border-border p-3 flex items-center gap-3">
              <span className="h-9 w-9 rounded-md grid place-items-center font-display font-semibold text-[13px]" style={{ background: "var(--muted)" }}>{a.n[0]}</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-[13px]">{a.n}</div>
                <div className="text-[11px] text-muted-foreground">{a.c}</div>
              </div>
              <StatusPill level={a.s}>{a.s === "green" ? "Live" : a.s === "yellow" ? "Action" : "Off"}</StatusPill>
            </div>
          ))}
        </div>
      </SectionCard>
      <SectionCard title="Webhooks">
        {["POST → /stripe/events · 200 OK · 412/h","POST → /jira/tickets · 200 OK · 84/h","POST → /custom/erp · 401 Unauthorized · failing"].map((w) => (
          <div key={w} className="font-mono text-[11.5px] py-1.5 border-b border-border/60 last:border-0">{w}</div>
        ))}
      </SectionCard>
    </div>
  );
}

// ---------------------------------------------------------------------------
// DATA
// ---------------------------------------------------------------------------
function DataSection() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Storage used" value="412 GB" delta={3.2} icon={Database}/>
        <KpiCard label="Records" value="2.4M" icon={Layers}/>
        <KpiCard label="Backups (7d)" value="7/7" icon={Check as any}/>
        <KpiCard label="Residency" value="EU" icon={Globe}/>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <SectionCard title="Import / Export"
          action={<button className="h-8 px-2.5 rounded-md text-xs font-medium text-primary-foreground inline-flex items-center gap-1" style={{ background: "var(--primary)" }}><Upload className="h-3 w-3"/>New import</button>}
        >
          {["CSV import — Accounts (12,840 rows · ✓ complete)","CSV import — Contacts (48,920 rows · ✓ complete)","Export — All tickets (scheduled weekly)","Export — Audit log (encrypted nightly)"].map((r)=>(
            <div key={r} className="text-[12.5px] py-1.5 border-b border-border/60 last:border-0">{r}</div>
          ))}
        </SectionCard>
        <SectionCard title="Retention & deletion">
          <Field label="Tickets retention" value="730 days then auto-archive" />
          <Field label="Call recordings" value="365 days then delete" />
          <Field label="Audit log" value="7 years (compliance hold)" />
          <Toggle label="Honor GDPR erasure requests automatically" on />
        </SectionCard>
        <SectionCard title="Sandboxes" subtitle="Spin up isolated test environments">
          {["Production · live","Staging · refreshed daily","UAT — Q3 rollout · refreshed weekly","Demo · ephemeral · expires in 4d"].map((s)=>(
            <div key={s} className="text-[12.5px] py-1.5 border-b border-border/60 last:border-0 flex items-center gap-2"><Server className="h-3.5 w-3.5 text-muted-foreground"/>{s}</div>
          ))}
        </SectionCard>
        <SectionCard title="Backup & recovery">
          <Row label="Point-in-time recovery" status="green" right="35 days"/>
          <Row label="Cross-region replication" status="green" right="EU ↔ EU-West"/>
          <Row label="Last restore test" status="blue" right="Apr 12 · pass"/>
        </SectionCard>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// BILLING
// ---------------------------------------------------------------------------
function BillingSection() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Plan" value="Enterprise" icon={Crown}/>
        <KpiCard label="Seats" value="300" icon={Users}/>
        <KpiCard label="MRR" value="$48,200" delta={4.2} icon={CreditCard}/>
        <KpiCard label="Next invoice" value="Jul 28" icon={ScrollText}/>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5">
        <SectionCard title="License allocation by hub">
          {[
            { h: "Sales", used: 92, max: 100 },
            { h: "Customer Success", used: 38, max: 50 },
            { h: "Support", used: 64, max: 80 },
            { h: "Marketing", used: 22, max: 30 },
            { h: "Billing Ops", used: 11, max: 15 },
            { h: "Admin / Other", used: 21, max: 25 },
          ].map((l) => (
            <div key={l.h} className="py-2.5 border-b border-border/60 last:border-0">
              <div className="flex items-center justify-between text-[12.5px] mb-1">
                <span className="font-medium">{l.h}</span>
                <span className="text-muted-foreground">{l.used} / {l.max}</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full" style={{ width: `${(l.used/l.max)*100}%`, background: l.used/l.max > 0.9 ? "var(--destructive)" : "var(--primary)" }} />
              </div>
            </div>
          ))}
        </SectionCard>
        <SectionCard title="Invoices & receipts">
          {["INV-2026-07 · $48,200 · Pending","INV-2026-06 · $46,300 · Paid","INV-2026-05 · $46,300 · Paid","INV-2026-04 · $44,100 · Paid"].map((i) => (
            <div key={i} className="text-[12.5px] py-1.5 border-b border-border/60 last:border-0 flex items-center justify-between">
              <span>{i}</span>
              <button className="text-[11px] text-primary inline-flex items-center gap-1"><Download className="h-3 w-3"/>PDF</button>
            </div>
          ))}
        </SectionCard>
      </div>
      <SectionCard title="Usage caps & alerts">
        <Toggle label="Alert at 90% seat utilization" on />
        <Toggle label="Auto-reclaim seats inactive 60+ days" />
        <Toggle label="Block over-cap AI calls (vs. burst)" />
        <Toggle label="Notify Super Admin of any plan-impacting change" on />
      </SectionCard>
    </div>
  );
}

// ---------------------------------------------------------------------------
// AUDIT
// ---------------------------------------------------------------------------
function AuditSection() {
  const events = [
    { t: "14:42", a: "Anees Naveed", e: "Updated role permissions (Sales Manager)", ip: "10.0.4.18", sev: "blue" as const },
    { t: "14:38", a: "System", e: "Workflow 'CPQ approval' executed 18×", ip: "—", sev: "neutral" as const },
    { t: "14:21", a: "Priya Mehta", e: "Exported 1,284 contacts to CSV", ip: "10.0.5.22", sev: "yellow" as const },
    { t: "13:55", a: "API key (Zapier)", e: "Created 14 leads via POST /v1/leads", ip: "54.221.x.x", sev: "neutral" as const },
    { t: "13:02", a: "Diego Alvarez", e: "Sign-in failed (incorrect MFA)", ip: "73.41.x.x", sev: "red" as const },
    { t: "12:48", a: "Anees Naveed", e: "Enabled IP allow list", ip: "10.0.4.18", sev: "green" as const },
  ];
  return (
    <div className="space-y-5">
      <SectionCard title="Immutable activity log" subtitle="Streamed to your SIEM · 7-year retention"
        action={
          <div className="flex items-center gap-2">
            <button className="h-8 px-2.5 rounded-md text-xs font-medium border border-border inline-flex items-center gap-1"><Filter className="h-3 w-3"/>Filter</button>
            <button className="h-8 px-2.5 rounded-md text-xs font-medium border border-border inline-flex items-center gap-1"><Download className="h-3 w-3"/>Export</button>
          </div>
        }
      >
        <table className="w-full text-[12.5px]">
          <thead>
            <tr className="text-[10.5px] uppercase tracking-wider text-muted-foreground border-b border-border">
              <th className="text-left py-2 font-medium">Time</th><th className="text-left font-medium">Actor</th><th className="text-left font-medium">Event</th><th className="text-left font-medium">IP</th><th className="text-left font-medium">Severity</th>
            </tr>
          </thead>
          <tbody>
            {events.map((e, i)=>(
              <tr key={i} className="border-b border-border/60">
                <td className="py-2 font-mono text-[11.5px]">{e.t}</td>
                <td>{e.a}</td>
                <td>{e.e}</td>
                <td className="font-mono text-[11.5px] text-muted-foreground">{e.ip}</td>
                <td><StatusPill level={e.sev}>{e.sev === "red" ? "High" : e.sev === "yellow" ? "Notable" : e.sev === "green" ? "Hardening" : e.sev === "blue" ? "Change" : "Info"}</StatusPill></td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>
    </div>
  );
}

// ---------------------------------------------------------------------------
// DEVELOPER
// ---------------------------------------------------------------------------
function DeveloperSection() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <SectionCard title="API keys"
          action={<button className="h-8 px-2.5 rounded-md text-xs font-medium text-primary-foreground inline-flex items-center gap-1" style={{ background: "var(--primary)" }}><Key className="h-3 w-3"/>Generate</button>}
        >
          {[
            { n: "Zapier (prod)", k: "sk_live_••••••••E8a2", last: "12m ago" },
            { n: "Snowflake sync", k: "sk_live_••••••••2c91", last: "1h ago" },
            { n: "Custom ERP", k: "sk_live_••••••••f04d", last: "Yesterday" },
          ].map((k) => (
            <div key={k.n} className="flex items-center justify-between py-2 border-b border-border/60 last:border-0">
              <div><div className="font-medium text-[13px]">{k.n}</div><div className="font-mono text-[11px] text-muted-foreground">{k.k}</div></div>
              <div className="flex items-center gap-2"><span className="text-[11px] text-muted-foreground">Last used {k.last}</span><button className="h-7 w-7 rounded-md hover:bg-accent grid place-items-center"><Trash2 className="h-3.5 w-3.5 text-muted-foreground"/></button></div>
            </div>
          ))}
        </SectionCard>
        <SectionCard title="OAuth applications">
          {["Limnn Mobile · iOS + Android","Limnn for Slack","Partner: Acme Embed"].map((a)=>(
            <div key={a} className="flex items-center justify-between py-2 border-b border-border/60 last:border-0 text-[13px]">
              <span>{a}</span><button className="text-[11px] text-primary">Manage</button>
            </div>
          ))}
        </SectionCard>
        <SectionCard title="CLI & SDKs">
          <pre className="rounded-md bg-[#15233F] text-white text-[11.5px] font-mono p-3 overflow-x-auto">npm i -g @limnn/cli{"\n"}limnn login{"\n"}limnn deploy --env staging</pre>
          <div className="mt-3 text-[12px] text-muted-foreground">SDKs available for TypeScript · Python · Go · Ruby</div>
        </SectionCard>
        <SectionCard title="Rate limits">
          <Row label="Standard REST" status="green" right="1,000 req/min"/>
          <Row label="Bulk API" status="green" right="50 jobs/h"/>
          <Row label="Streaming events" status="blue" right="Unlimited"/>
          <Row label="AI Gateway" status="green" right="200 req/min"/>
        </SectionCard>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// AI Copilot drawer
// ---------------------------------------------------------------------------
function AdminAiCopilot({ section, onCollapse }: { section: SectionDef; onCollapse: () => void }) {

  const [messages, setMessages] = useState<{ from: "ai"|"me"; text: string; pending?: { cmd: string; risk: "low"|"high" } }[]>([
    { from: "ai", text: `Hey Anees — I'm your Admin Copilot. I can run config commands across the entire tenant. Right now you're in **${section.label}**. Try: "Create a Sales role that can edit opportunities but not delete them" or "Show me users who haven't logged in for 30 days."` },
  ]);
  const [input, setInput] = useState("");

  const suggestions = [
    "Reclaim all dormant licenses",
    "Build a workflow: when a deal closes, post in #sales-velocity",
    "Add MFA enforcement for all Admins",
    "Show last 10 permission changes",
  ];

  function send(text: string) {
    const q = text.trim(); if (!q) return;
    setMessages((m) => [...m, { from: "me", text: q }]);
    setInput("");
    setTimeout(() => {
      const isWrite = /create|build|add|remove|delete|enable|disable|reclaim|enforce/i.test(q);
      setMessages((m) => [...m, {
        from: "ai",
        text: isWrite
          ? `I drafted the change below. It will affect tenant configuration — review and approve to execute.`
          : `Here's what I found across your tenant — top of the list is shown in the main panel; I can refine the query if you want.`,
        pending: isWrite ? { cmd: q, risk: /delete|remove|reclaim|disable/i.test(q) ? "high" : "low" } : undefined,
      }]);
    }, 400);
  }

  return (
    <aside className="w-[320px] shrink-0 border-l border-border flex flex-col"
      style={{ background: "linear-gradient(180deg, #15233F 0%, #1B2A47 100%)", color: "#fff" }}>
      <div className="px-4 pt-4 pb-3 border-b border-white/10 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="h-8 w-8 rounded-lg grid place-items-center shrink-0" style={{ background: "linear-gradient(135deg, #2C69CF, #7C3AED)" }}>
            <Sparkles className="h-4 w-4"/>
          </span>
          <div className="min-w-0">
            <div className="font-display text-[14px] font-semibold leading-tight">Limnn Admin Copilot</div>
            <div className="text-[10.5px] text-white/60 truncate">Context: {section.label}</div>
          </div>
        </div>
        <button
          onClick={onCollapse}
          title="Minimize copilot"
          className="h-7 w-7 rounded-md grid place-items-center text-white/70 hover:text-white hover:bg-white/10 shrink-0"
        >
          <ChevronRight className="h-4 w-4"/>
        </button>
      </div>


      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2.5">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[280px] rounded-2xl px-3 py-2 text-[12.5px] leading-relaxed ${m.from === "me" ? "bg-[#2C69CF] text-white rounded-br-sm" : "bg-white/8 text-white/95 rounded-bl-sm"}`}>
              {m.text}
              {m.pending && (
                <div className="mt-2.5 rounded-lg p-2.5" style={{ background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="text-[10px] uppercase tracking-wider text-white/60 mb-1 flex items-center gap-1">
                    {m.pending.risk === "high" ? <AlertTriangle className="h-3 w-3 text-amber-300"/> : <Wand2 className="h-3 w-3"/>} Pending command · {m.pending.risk === "high" ? "destructive" : "safe"}
                  </div>
                  <div className="font-mono text-[11px] text-white/90">{m.pending.cmd}</div>
                  <div className="mt-2 flex gap-1.5">
                    <button className="h-7 px-2 rounded text-[11px] font-medium" style={{ background: m.pending.risk === "high" ? "#EF4444" : "#10B981" }}>
                      <Check className="inline h-3 w-3 mr-1"/>Approve & run
                    </button>
                    <button className="h-7 px-2 rounded text-[11px] font-medium bg-white/10 hover:bg-white/15">Edit</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="px-3 pt-2 pb-1 flex flex-wrap gap-1.5 border-t border-white/10">
        {suggestions.map((s) => (
          <button key={s} onClick={() => send(s)} className="text-[10.5px] px-2 py-1 rounded-full bg-white/8 hover:bg-white/12 text-white/85 border border-white/10">{s}</button>
        ))}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="p-3 border-t border-white/10">
        <div className="relative">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Limnn or issue a command…"
            className="w-full h-10 pl-3 pr-10 rounded-lg text-[12.5px] bg-white/8 text-white placeholder:text-white/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#2C69CF]/60"
          />
          <button type="submit" className="absolute right-1.5 top-1.5 h-7 w-7 rounded-md grid place-items-center" style={{ background: "#2C69CF" }}>
            <Send className="h-3.5 w-3.5"/>
          </button>
        </div>
        <div className="mt-1.5 text-[10px] text-white/45 flex items-center gap-1.5">
          <Cpu className="h-2.5 w-2.5"/> All destructive commands require approval · audit-logged
        </div>
      </form>
    </aside>
  );
}
