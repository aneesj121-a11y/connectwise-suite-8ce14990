# Plan: Hubs, Dynamic Routing, Limnn Intelligence + Enterprise Depth

## Guardrails (will not touch)
- `TopBar` (search, AI badge, New call)
- Sidebar bg `#1E293B`, width 252px, branding, footer/user block
- Cream main canvas
- Existing Sales routes/components: `dashboard.tsx`, `dialer-widget.tsx`, `opportunities*`, `call.tsx`

---

## 1. Hub model (global state)

Extend `src/lib/team-context.tsx`:
- `Team` → `"sales" | "marketing" | "cs" | "support" | "chat" | "grid" | "billing"` (keep current `support` for backward compat; `chat` is the new omnichannel hub).
- Each hub entry adds: `label`, `tagline`, `accentVar`, `nav: NavLink[]`, `tools: NavLink[]`, `defaultRoute: string`.

## 2. Dynamic sidebar + dropdown routing

`src/components/app-shell.tsx`:
- Drive Workspace links from `TEAMS[team].nav` instead of the static `NAV` constant.
- Drive "<Hub> tools" from `TEAMS[team].tools`.
- On dropdown select → `setTeam(hub)` AND `navigate({ to: hub.defaultRoute })`.
- Sales hub keeps current links (Dashboard, Opportunities, Queue, Contacts, Cadences, Analytics).

## 3. Limnn Intelligence right pane

New `src/components/limnn-intelligence.tsx`, mounted in `AppShell` to the right of `<main>`.
- 320px expanded / 44px collapsed rail, toggle persisted to `localStorage`.
- `#1E293B` bg, 1px `rgba(255,255,255,0.06)` left border, Poppins headers.
- Sections:
  1. Header "Limnn Intelligence" + Brain icon + collapse chevron.
  2. **Context insights** — hub-aware ML cards via `hubInsights(team)`: anomalies, forecasts, next-best-action, risk alerts.
  3. **Suggested actions** chips (one-click: "Draft follow-up", "Open at-risk accounts", "Generate forecast brief").
  4. **Upload Context** button → hidden `<input accept=".pdf,.csv,.xlsx,.docx">`, shows uploaded chips with size + remove (mock ingestion, no backend yet).
  5. **Chat composer** — textarea + send, shimmer "Thinking…" on submit, mock reply for now (real Lovable AI wiring is opt-in follow-up).
  6. Footer: model selector pill ("Limnn-Pro · Gemini"), token/credits hint.

---

## 4. Hubs — routes + enterprise feature depth

All views reuse existing card system (`rounded-xl border bg-card`, Poppins display, chip styles, tokens from `styles.css`). Lucide icons only. Mock data lives in `src/lib/hubs-data.ts`.

### A. SALES (existing — additive only, no rewrites)
Already shipped: Dashboard, Opportunities, Power Dialer, Pipeline, Recent Calls, Quotes/CPQ.
Add lightweight stubs (route + placeholder content reusing card patterns) for the items below so the sidebar feels complete:
- `/forecast` — Weighted vs Commit vs Best-case forecast, AI confidence band
- `/leaderboard` — Rep leaderboard, attainment, activity index
- `/playbooks` — Sales playbooks + AI battlecards

### B. MARKETING — `/marketing`
Center view: **Growth Analytics** dashboard (MQL → SQL → Won funnel, CAC, LTV, payback, channel ROI) + **Active AI Campaigns** table (status, audience, spend, conv rate, AI lift %).
Sub-routes:
- `/marketing/intent` — Intent Engine: 3rd-party intent signals, surging accounts, keyword heatmap
- `/marketing/campaigns` — AI campaign builder list + detail
- `/marketing/analytics` — Attribution (first/last/linear/AI-weighted), cohort retention
- `/marketing/segments` — AI audience segmentation + lookalike
- `/marketing/content` — AI content studio (email/landing copy generation queue)
- `/marketing/ab-tests` — Experiments + lift significance

### C. CUSTOMER SUCCESS — `/cs`
Center view: **Accounts table** with predictive churn (Green/Yellow/Red pills), Health Score (0–100), MRR, ARR, NRR, last touch, owner.
Sub-routes:
- `/cs/health` — Health scoring model breakdown (usage, sentiment, NPS, support load, exec engagement)
- `/cs/expansion` — Expansion ops: upsell/cross-sell signals, white-space map
- `/cs/renewals` — Renewals calendar, at-risk renewals, auto-renew vs manual
- `/cs/qbr` — QBR builder with AI deck draft
- `/cs/onboarding` — Onboarding milestones, time-to-value tracker
- `/cs/advocacy` — Reference/advocacy program, NPS promoters

### D. LIMNN CHAT & SUPPORT — `/chat`
Center view: **Omnichannel inbox** — left ticket list (channel icons: email, WhatsApp, web chat, voice, SMS, Slack), right active conversation with AI suggested reply, sentiment, intent.
Sub-routes:
- `/chat/sla` — SLA triage queue (breach risk, time-to-first-response)
- `/chat/routing` — Smart routing rules + skill-based assignment
- `/chat/kb` — AI knowledge base + deflection rate
- `/chat/macros` — AI macros / canned responses with auto-suggest
- `/chat/csat` — CSAT/CES dashboard + AI root-cause clustering
- `/chat/voice` — Voice/IVR flows + transcription summaries

### E. LIMNN GRID (Project Ops) — `/grid`
Center view: **Kanban sprint board** (To Do / In Progress / Review / Done), task cards with assignee avatars, priority flag, story points, due date, dependency dot.
Sub-routes:
- `/grid/sprints` — Active Sprints, burndown, velocity
- `/grid/automations` — Workflow automations (trigger/condition/action) + AI-suggested automations
- `/grid/roadmaps` — Quarterly roadmap timeline (now/next/later)
- `/grid/okrs` — OKR tree with progress
- `/grid/capacity` — Team capacity & workload heatmap
- `/grid/retros` — Retros with AI theme clustering

### F. BILLING OPS — `/billing`
Center view: Financial KPI cards (Total MRR, ARR, Net New MRR, Overdue Invoices, DSO, Churned MRR) + **Collections Risk** ML widget (accounts ranked by payment-default probability with recommended action).
Sub-routes:
- `/billing/collections` — Collections queue, dunning automations, promise-to-pay
- `/billing/arap` — AR aging buckets + AP schedule
- `/billing/fpa` — FP&A engine: rolling forecast, scenario planner, variance vs plan
- `/billing/invoices` — Invoice list (draft/sent/paid/overdue) + bulk actions
- `/billing/subscriptions` — Subscription lifecycle, MRR movements (new/expansion/contraction/churn)
- `/billing/revrec` — Revenue recognition schedule (ASC 606)
- `/billing/tax` — Tax & compliance summary

---

## 5. Cross-hub enterprise primitives (lightweight components, reused)

To make every hub feel enterprise-grade with consistent UX, add small shared components in `src/components/enterprise/`:
- `StatusPill.tsx` — Green/Yellow/Red + neutral variants
- `RiskBadge.tsx` — ML-confidence badge ("AI 92%")
- `TrendSpark.tsx` — Inline sparkline for KPI cards
- `DataTable.tsx` — Sortable, density-toggle, column chooser (used by Marketing campaigns, CS accounts, Billing invoices, Chat tickets)
- `FilterBar.tsx` — Search + chip filters + saved views
- `AiInsightCard.tsx` — Standard "AI recommends…" card with accept/dismiss
- `KpiCard.tsx` — Standard KPI tile (label, value, delta, spark)

These are styled with existing tokens — no new colors.

---

## 6. Mock data

`src/lib/hubs-data.ts` exports per-hub realistic mock arrays:
- marketing: campaigns, intent signals, attribution rows
- cs: accounts with health/risk/MRR, renewals
- chat: tickets across channels, sentiment, SLA timers
- grid: sprint tasks, sprints, automations
- billing: invoices, subscriptions, collections risk scores

---

## Files created

Routes (16):
- `src/routes/forecast.tsx`, `leaderboard.tsx`, `playbooks.tsx`
- `src/routes/marketing.tsx` + `.intent.tsx`, `.campaigns.tsx`, `.analytics.tsx`, `.segments.tsx`, `.content.tsx`, `.ab-tests.tsx`
- `src/routes/cs.tsx` + `.health.tsx`, `.expansion.tsx`, `.renewals.tsx`, `.qbr.tsx`, `.onboarding.tsx`, `.advocacy.tsx`
- `src/routes/chat.tsx` + `.sla.tsx`, `.routing.tsx`, `.kb.tsx`, `.macros.tsx`, `.csat.tsx`, `.voice.tsx`
- `src/routes/grid.tsx` + `.sprints.tsx`, `.automations.tsx`, `.roadmaps.tsx`, `.okrs.tsx`, `.capacity.tsx`, `.retros.tsx`
- `src/routes/billing.tsx` + `.collections.tsx`, `.arap.tsx`, `.fpa.tsx`, `.invoices.tsx`, `.subscriptions.tsx`, `.revrec.tsx`, `.tax.tsx`

Components:
- `src/components/limnn-intelligence.tsx`
- `src/components/enterprise/{StatusPill,RiskBadge,TrendSpark,DataTable,FilterBar,AiInsightCard,KpiCard}.tsx`

Data:
- `src/lib/hubs-data.ts`

## Files edited (minimal, additive)
- `src/lib/team-context.tsx` — extend `Team`, add nav/tools/defaultRoute per hub
- `src/components/app-shell.tsx` — hub-driven sidebar + dropdown navigates on select; mount right pane. Top bar / sidebar chrome / dialer untouched.

## Out of scope (confirm if wanted)
- Real Lovable AI wiring for Intelligence chat (mock for now)
- Real ingestion/parsing for Upload Context
- Backend persistence (Lovable Cloud) for any hub
- Each sub-route lands with high-fidelity primary view; deep editors (e.g. full QBR builder, full revrec engine) ship as visually complete shells, not fully interactive workflows
