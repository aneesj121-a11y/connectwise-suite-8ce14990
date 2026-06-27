
# Plan — Dropdown polish, global CPQ, and 6 full hub workspaces

This is a large delivery. To keep quality high and let you review as we go, I'll ship it in **4 phases**. Phase 1 is fast polish; phases 2–4 each build out a workspace cluster end-to-end with real interactive shells (not stubs). Everything stays inside the established system: Poppins, deep slate sidebar/pane (`#1E293B` / `#2A354A`), brand blue `#2C69CF`, cream canvas, existing card / pill / table primitives. No layout shell, top bar, dialer, or sidebar chrome will be touched.

---

## Phase 1 — Dropdown refinement + global copy (1 turn)

Edit `src/lib/team-context.tsx` only:
- Drop the colored status dot rendering in the team switcher.
- Per-hub icon + accent color (rendered as a 28px rounded tile with the icon in the hub color, slate background, no dot):
  - Sales — `BarChart3` · `#2C69CF` · "Outbound Pipeline & Revenue Execution"
  - Marketing — `Megaphone` · `#2C69CF` · "Intent Signals, Campaigns & Growth Automation"
  - Customer Success — `ShieldCheck` · `#EF4444` · "Retention, Client Health & Renewals Management"
  - Support Center — `MessagesSquare` (paired with a `Sparkles` accent) · `#10B981` · "Omnichannel Conversation Hub & Smart AI Deflection"
  - Limnn Grid — `LayoutGrid` · `#2C69CF` · "Project Operations & Agile Delivery Management"
  - Billing Ops — `Receipt` · `#F59E0B` · "Revenue Recognition, AR/AP & Financial Planning"
- Tighten the dropdown row: icon tile · label (Poppins 14/600) · subtext (12/400 muted), one row, no dot column.
- Re-verify dropdown text color fix is still in place.

---

## Phase 2 — Global CPQ engine (1–2 turns)

New shared module `src/lib/cpq/` reusable from Sales (Opportunities), CS (Expansion / Renewals), and Billing (Subscriptions / Invoices).

- `cpq-engine.ts` — catalog (core services, seat tiers, add-ons), pricing math, discount guardrails (warn > 15%, block > 30% unless approver), term + ramp, tax stub, MRR/ARR/TCV derivation, status state machine `Draft → Pending Internal Review → Sent to Client → Signed/Executed`.
- `CpqBuilder.tsx` — modular configuration grid: product picker (cards), seat stepper, add-on multi-select, term + start date, discount input with live margin meter, line-item table with auto-calc, totals rail.
- `QuoteDocumentPreview.tsx` — branded quote preview (cream canvas, Limnn wordmark, Poppins headers, line items, totals, terms, e-sign block).
- `QuoteStatusPill.tsx` + `QuoteLifecycleTimeline.tsx` — 4-stage tracker.
- Mount points:
  - Replace the existing Opportunity → CPQ tab body with `CpqBuilder` (keeps existing tab nav).
  - Add a "Generate quote" button on CS Expansion + Renewals rows that opens the same builder in a sheet.
  - Add a "View source quote" link on Billing invoices that opens the read-only `QuoteDocumentPreview`.

---

## Phase 3 — Customer Success + Sales + Support Center deep builds (2–3 turns)

Replace existing stubs with real interactive shells. Each view: header, filter bar, primary data surface, side rail with **Limnn AI** insight cards (accept / dismiss / open) using the existing `AiInsightCard` primitive.

**Customer Success**
- `cs.tsx` (Accounts) — health bar 0–100, ARR, NRR, renewal date, owner; AI alert row for >20% engagement drop in 7d with one-click outreach template sheet.
- `cs.health.tsx` — weight-tuner control panel (sliders per factor) + live recompute; anomaly feed.
- `cs.expansion.tsx` — upsell pipeline kanban, threshold meters, AI lookalike score column.
- `cs.renewals.tsx` — Kanban ↔ Calendar toggle, 30/60/90 lanes, AI "At Risk" badges + recommended discount corridor.
- `cs.qbr.tsx` — deck section list, auto-draft buttons per section, AI summary preview.
- `cs.onboarding.tsx` — milestone path with TTV countdown, blocker flags.
- `cs.advocacy.tsx` — power-user grid, 90-day health streak badge, review-request CTA.

**Sales**
- `forecast.tsx` — Commit / Best Case / Pipeline stack, attainment bar, AI confidence band card.
- `leaderboard.tsx` — rank table (Revenue / Activity / Pipeline tabs), manager review drawer, AI skill-gap notes.
- Power Dialer (existing widget) — add a "Live battlecard" inline panel + post-call AI summary card on the Call screen.

**Support Center** (rename has shipped; this fills it out)
- `support.helpdesk.tsx` — already exists; add SLA countdown chips, sentiment + intent badges, smart-reply tray with confidence %.
- `chat.sla.tsx` — breach-risk supervisor board.
- `chat.kb.tsx` — Drafts / Published / Internal folders, AI "draft from resolved tickets" queue.
- `chat.macros.tsx` — macro canvas with step chain; AI suggestion list.
- `chat.csat.tsx` — CSAT trend, agent speed, AI friction clusters.
- `chat.voice.tsx` — IVR tree visualizer with drop-off heat.
- New `support.settings.tsx` — queue caps, routing triggers, text-expander list.

---

## Phase 4 — Marketing + Limnn Grid + Billing Ops deep builds (2–3 turns)

**Marketing**
- `marketing.tsx` (Growth Analytics) — funnel, channel ROI, CAC payback, AI rebalance card.
- `marketing.intent.tsx` — surging accounts feed, keyword heat, recommended sequence CTA.
- `marketing.campaigns.tsx` — campaign canvas list + step builder, AI lift % per send.
- `marketing.analytics.tsx` — attribution model toggle (FT / LT / Linear / W-shaped), undervalued-touch card.
- `marketing.segments.tsx` — Boolean builder with chip groups, AI lookalike suggestions.
- `marketing.content.tsx` — asset library + A/B variant generator, brand-voice score.
- `marketing.ab-tests.tsx` — experiment list with significance meter, auto-deploy toggle.
- New `marketing.surging.tsx` + `marketing.active.tsx` (Tools).

**Limnn Grid**
- `grid.tsx` (Sprint Board) — keep current Kanban; add AI "Sprint at risk" banner + blocker callouts.
- `grid.sprints.tsx` — list + burndown chart, AI spillover prediction.
- `grid.automations.tsx` — IFTTT builder, AI suggested rules.
- `grid.roadmaps.tsx` — Gantt/timeline with dependency conflict flags.
- `grid.okrs.tsx` — objective tree, rollup progress, risk pings.
- `grid.capacity.tsx` — 48h work-week heatmap, overload alerts + rebalance suggestions.
- New `grid.intake.tsx` (form builder + AI assignee suggest), `grid.portfolios.tsx`, `grid.mytasks.tsx`. Enhance `grid.retros.tsx` with AI action extraction.

**Billing Ops**
- `billing.tsx` (Financials) — MRR / Net New MRR / Overdue / DSO KPI strip, AI risk feed.
- `billing.collections.tsx` — risk-ranked queue, AR aging buckets, dunning cadence trigger.
- `billing.arap.tsx` — dual ledger, DSO trend chart, AI driver callout.
- `billing.fpa.tsx` — scenario sliders, AI ARR projection with ±4% band.
- `billing.invoices.tsx` — invoice table with status + DPD, CPQ-source audit badge.
- `billing.subscriptions.tsx` — lifecycle table, AI upgrade-opportunity nudges.
- `billing.revrec.tsx` — ASC 606 schedule, AI MSA parser preview.
- `billing.tax.tsx` — jurisdiction grid, preset for Payoneer/US-handled flows, AI compliance alerts.

---

## Shared additions

- Extend `src/components/enterprise/primitives.tsx`: `WeightSlider`, `HeatCell`, `BurndownSpark`, `FunnelStrip`, `KanbanColumn` (generic), `CalendarLane`.
- Extend `src/lib/hubs-data.ts` with realistic mock data per new view.
- All AI surfaces use the existing `AiInsightCard` style and "Limnn AI" labeling — mock logic for now (no backend wiring).

## Out of scope this round
- Real model wiring for any AI surface (mock insights only).
- Backend persistence (no Lovable Cloud changes).
- Drag-and-drop physics for Kanban / Gantt (visual + click-to-move only).
- Real PDF export for quotes (visual preview + "Download" placeholder).

## Guardrails (untouched)
Top bar, sidebar bg/width/branding/footer, cream canvas, dialer widget, existing Opportunities list/board, existing Quotes versions table, root layout.

---

**Want me to start with Phase 1 (dropdown + copy) immediately, or batch Phase 1 + Phase 2 (CPQ) in one go?**
