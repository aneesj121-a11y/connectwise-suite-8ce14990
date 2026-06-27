import { createFileRoute } from "@tanstack/react-router";
import { HubPage } from "@/components/hubs/page";
import { SectionCard, StatusPill, KpiCard, Avatar } from "@/components/enterprise/primitives";
import {
  Globe,
  BookOpen,
  Ticket,
  Users,
  MessageSquare,
  ExternalLink,
  Settings,
  Palette,
  Lock,
  Eye,
} from "lucide-react";

export const Route = createFileRoute("/support/portal")({
  head: () => ({ meta: [{ title: "Support Center — Customer Portal" }] }),
  component: CustomerPortal,
});

const PORTAL_KPIS = [
  { label: "Active portal users", value: "8,412", delta: 9, spark: [7100, 7400, 7600, 7800, 8000, 8200, 8412], icon: Users },
  { label: "Self-serve deflections", value: "62%", delta: 7, spark: [48, 52, 55, 57, 59, 61, 62], icon: BookOpen },
  { label: "Portal tickets (7d)", value: "1,284", delta: 12, spark: [900, 980, 1020, 1100, 1170, 1240, 1284], icon: Ticket },
  { label: "Avg article rating", value: "4.6", delta: 3, spark: [4.3, 4.4, 4.4, 4.5, 4.5, 4.5, 4.6], icon: MessageSquare },
];

const TOP_ARTICLES = [
  { title: "Resetting your SSO connection", views: 4821, helpful: 92 },
  { title: "Setting up call recording compliance", views: 3402, helpful: 88 },
  { title: "Adding a new dialer agent", views: 2914, helpful: 94 },
  { title: "Routing rules: round-robin vs. skills-based", views: 2207, helpful: 81 },
  { title: "Exporting CSAT reports", views: 1986, helpful: 86 },
];

const COMMUNITY = [
  { user: "Aarav S.", topic: "Best practice for warm transfers", replies: 14, status: "green" as const, tag: "Answered" },
  { user: "Mei L.", topic: "API rate limits on bulk imports", replies: 8, status: "yellow" as const, tag: "Open" },
  { user: "Jonas K.", topic: "Power dialer pacing settings", replies: 21, status: "green" as const, tag: "Answered" },
  { user: "Rhea N.", topic: "Custom disposition fields", replies: 5, status: "yellow" as const, tag: "Open" },
];

function CustomerPortal() {
  return (
    <HubPage
      title="Customer Portal"
      description="Self-serve knowledge base, ticket submission, and community for your customers."
      actions={
        <>
          <a
            href="#"
            className="h-9 px-3 rounded-md border border-border text-sm font-medium inline-flex items-center gap-1.5 hover:bg-accent"
          >
            <ExternalLink className="h-3.5 w-3.5" /> View live portal
          </a>
          <button
            className="h-9 px-3 rounded-md text-sm font-medium text-primary-foreground inline-flex items-center gap-1.5"
            style={{ background: "var(--primary)" }}
          >
            <Settings className="h-3.5 w-3.5" /> Configure
          </button>
        </>
      }
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {PORTAL_KPIS.map((k) => (
          <KpiCard key={k.label} {...k} />
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <SectionCard
          title="Portal configuration"
          subtitle="Branding, access & visibility"
          className="lg:col-span-1"
        >
          <ul className="space-y-3 text-sm">
            <ConfigRow icon={Globe} label="Custom domain" value="help.limnn.com" status="green" />
            <ConfigRow icon={Palette} label="Brand theme" value="Limnn light · synced" status="green" />
            <ConfigRow icon={Lock} label="Authentication" value="SSO + magic link" status="green" />
            <ConfigRow icon={Eye} label="Visibility" value="Public + gated" status="yellow" />
            <ConfigRow icon={BookOpen} label="Knowledge base" value="142 articles · 6 locales" status="green" />
            <ConfigRow icon={Ticket} label="Ticket form" value="3 forms active" status="green" />
          </ul>
        </SectionCard>

        <SectionCard
          title="Top knowledge articles"
          subtitle="Most-viewed self-serve content this week"
          className="lg:col-span-2"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[11px] uppercase tracking-wide text-muted-foreground border-b border-border">
                  <th className="text-left py-2 font-medium">Article</th>
                  <th className="text-right py-2 font-medium">Views</th>
                  <th className="text-right py-2 font-medium">Helpful</th>
                  <th className="text-right py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {TOP_ARTICLES.map((a) => (
                  <tr key={a.title} className="border-b border-border last:border-0">
                    <td className="py-3 font-medium">{a.title}</td>
                    <td className="py-3 text-right font-mono">{a.views.toLocaleString()}</td>
                    <td className="py-3 text-right font-mono">{a.helpful}%</td>
                    <td className="py-3 text-right">
                      <StatusPill level={a.helpful >= 90 ? "green" : a.helpful >= 85 ? "blue" : "yellow"}>
                        {a.helpful >= 90 ? "Excellent" : a.helpful >= 85 ? "Good" : "Review"}
                      </StatusPill>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>

      <SectionCard
        title="Community discussions"
        subtitle="Customer-led threads, answered and open"
      >
        <ul className="divide-y divide-border">
          {COMMUNITY.map((c) => (
            <li key={c.topic} className="py-3 flex items-center gap-3">
              <Avatar name={c.user} size={28} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{c.topic}</div>
                <div className="text-xs text-muted-foreground">{c.user} · {c.replies} replies</div>
              </div>
              <StatusPill level={c.status}>{c.tag}</StatusPill>
            </li>
          ))}
        </ul>
      </SectionCard>
    </HubPage>
  );
}

function ConfigRow({
  icon: Icon,
  label,
  value,
  status,
}: {
  icon: typeof Globe;
  label: string;
  value: string;
  status: "green" | "yellow" | "red";
}) {
  return (
    <li className="flex items-center gap-3">
      <span className="h-8 w-8 grid place-items-center rounded-md bg-muted text-muted-foreground shrink-0">
        <Icon className="h-3.5 w-3.5" />
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-sm font-medium truncate">{value}</div>
      </div>
      <span className="h-2 w-2 rounded-full shrink-0" style={{
        background: status === "green" ? "var(--success)" : status === "yellow" ? "var(--warning)" : "var(--destructive)",
      }} />
    </li>
  );
}
