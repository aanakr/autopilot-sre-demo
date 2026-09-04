# New Relic Autopilot SRE Agent — February 2027 MVP

A React 18 + Vite + Tailwind single-page prototype demonstrating **Autopilot**, New Relic's
Substrate-powered SRE agent. The prototype is a **clean light-mode workspace** built around exactly
**2 screens** — an org-scoped Knowledge Gap Map and a per-incident Proof UI — plus a floating
**Presenter Control Bar** that instantly reconfigures all mock data across **5 MECE demo scenarios**.

Live demo: https://aanakr.github.io/autopilot-sre-demo/

---

## Product Context: "The Substrate" Moat

The strategic bet behind Autopilot is that AI incident response only earns operator trust if it is
grounded in **deterministic, auditable evidence** — not speculative LLM pattern-matching. Three value
props are made concretely visible in the UI, not just claimed in copy:

| Value prop | Where it's proven in the UI |
|---|---|
| **Eradicate AI Hallucinations** | The Data Dictionary chip on every incident (Pane C) shows the exact custom→canonical tag mapping the agent used, e.g. `txn_id → trace.id (100% match)`. |
| **Eliminate Agent Amnesia** | The Investigation Tree (Pane A) and Causal Proof Canvas (Pane B) show the agent's exact evidence trail per step — nothing is inferred silently. |
| **Pattern Curation over ML Hype** | Scenario 3 shows a *human-gated* Eligibility Rubric turning a 3x-repeated manual fix into a deterministic WIN Workflow — promotion is curated, not auto-learned. |

## The 2 Screens

| # | Screen | Route | Purpose |
|---|--------|-------|---------|
| 1 | **Org-Scoped Grid View** | `/autopilot/ground-truth` (default) | KPI tiles, the 11×12 Knowledge Gap Map with an animated agent-traversal overlay, Active Incidents sidebar, and (Scenario 3) the pattern-graduation flow. |
| 2 | **Proof UI / SRE Coach Workspace** | `/autopilot/workspace/:incidentId` | 3-pane investigation (Investigation Tree · Causal Proof Canvas · Remediation & Diff), sticky Approval Footer, and inline post-approval execution (terminal log → SLO validation ring → RLHF success banner). |

Both screens read from a single piece of state — `activeScenarioId` in `AutopilotContext` — set by
the floating **Presenter Control Bar** (bottom-right on every page). Switching scenarios there
instantly reconfigures the grid, the active incident, and every Workspace pane.

## The 5 MECE Demo Scenarios

| ID | Scenario | Entity | What it proves |
|---|---|---|---|
| **S1** | Known Issue & Existing Workflow (Happy Path) | `checkout-api` | A WIN Workflow already exists → high-confidence diff → Approve & Execute → terminal stream → SLO validation ring → RLHF mic-drop (`0.88 → 0.91`). |
| **S2** | Unknown Issue & Autopilot Diagnostics | `billing-service` | No matching workflow → Autopilot restricts itself to a branching decision tree of ruled-out hypotheses, **read-only**, no unsafe action offered. |
| **S3** | Pattern Curation & Promotion (Graduation) | `payment-service` | 3 recurring manual fixes → Screen 1 banner → Eligibility Rubric (High Toil / Easy to Automate / Low Downside, all YES) → Confirm Graduation → KPI tile + grid cell update live. |
| **S4** | Human-in-the-Loop Override (SRE Veto) | `auth-service` | The causal graph recommends a container restart that collides with an in-flight DB migration → SRE clicks **Reject Recommendation** → live score decay (`0.88 → 0.45`) → audit-log entry. |
| **S5** | Active Knowledge-Gap Ingestion | `gateway-ingress` | No runbook indexed → Pane B shows a pulsing Knowledge Gap node → SRE pastes runbook markdown into the Knowledge Injection panel → **Recalculate & Revise Analysis** → confidence resolves to `0.92` → remediation + Approve unlock. |

Scenario 3 is Screen-1-only by design (its own spec places the whole graduation flow on the grid
screen); the other four each deep-link to a fully realized Workspace state.

## Architecture

### Routing

`HashRouter` (React Router v6) — required for GitHub Pages, which has no server-side rewrite rules
for client-side routes. `vite.config.js`'s `base: '/autopilot-sre-demo/'` plus `HashRouter` is what
has kept the live URL stable across every rewrite of this prototype.

### Global State

`AutopilotContext` (`src/context/AutopilotContext.jsx`) holds only what must survive navigation: the
active account/user and `activeScenarioId`. All scenario content itself lives in
`src/utils/scenarios.js` (one object per scenario — investigation tree, causal graph, remediation,
execution/validation/RLHF payloads, and scenario-specific mechanics like `veto` or
`knowledgeInjection`); org-wide grid/KPI data lives in `src/utils/mockData.js`.

### The Causal Proof Canvas

Pane B is a real directional graph, not a static diagram: nodes are positioned by percentage
coordinates and edges are SVG `<path>` elements with a small `<circle>` animated via native SVG
`<animateMotion>`, flowing downstream on a loop — no charting/graph library, since a fixed ≤5-node
graph doesn't need one. The same component renders Scenario 2's branching decision tree (ruled-out
paths as gray dashed edges) and Scenario 5's pulsing Knowledge Gap node via a data-driven `kind` per
node/edge, not a separate component.

### State Machine Safety

Async operations (the terminal log reveal, the SLO validation countdown, the knowledge-injection
recalculation) use explicit local state with bounded intervals/timeouts — never a raw unhandled
promise chain — so nothing can spin forever.

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS (light mode) |
| Routing | React Router v6 (HashRouter) |
| State | React Context API |
| Icons | lucide-react |
| Deployment | GitHub Pages via `gh-pages` |

## Design System

```js
// Tailwind's default palette — used directly, not overridden:
slate-50 / slate-200 / slate-900   // canvas, borders, text
emerald-500  // #10B981 — active telemetry, stabilized SLOs, success
cyan-500     // #06B6D4 — Substrate AI signals, causal reasoning, data dictionary
red-500      // #EF4444 — active incidents, critical failures, knowledge gaps
amber-500    // #F59E0B — pending approvals, veto actions, unmapped entities
```

Headings/body: **Inter** · Metrics/IDs/SQL/logs: **JetBrains Mono**.

## Local Development

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build to dist/
npm run preview   # preview the production build
npm run lint
npm run deploy    # build + publish to the gh-pages branch
```

## E2E Tests

```bash
node tests/e2e/mvp.spec.js          # against a running npm run dev / npm run preview server
```

See `tests/e2e/mvp.spec.js` for coverage details — every screen, all 5 scenario switches, all grid
interactions, all 3 Workspace special modes, and the full S1 approve→execute→validate→RLHF path.

## Component Guidelines

Every component stays under ~150 lines and is split by screen/concern
(`components/{layout,knowledge,workspace,execution}/`) — this keeps individual files small enough to
hand to an AI coding assistant for a targeted edit without it needing to reason about the whole page.

---

## Verbatim 5-Minute Executive Demo Script

Use the Presenter Control Bar (bottom-right, on every screen) to jump scenarios — don't navigate by
hand. Say the bracketed lines out loud; do the bulleted clicks.

**[0:00 – 0:45] Open on the Knowledge Gap Map.**

> "This is Autopilot — New Relic's Substrate-powered SRE agent. Before we look at a single incident,
> here's the thing that makes it trustworthy: it knows exactly what it knows, and exactly what it
> doesn't."

- Point to the 4 KPI tiles. "87.4% telemetry coverage, 42 services, and — critically — it's honest
  about 4 knowledge gaps rather than papering over them."
- Point to the grid. "Eleven data dimensions across twelve core services. Green is complete, amber is
  thin, red is an active gap."
- Click a red cell (`Runbooks` × `gateway-ingress`). "Click a gap and it tells me exactly what's
  missing and how bad it is — impact 8.5 out of 10 — and lets me fix it right here." Don't submit yet.

**[0:45 – 1:45] Scenario 1 — the happy path.**

- Click **S1 · Happy Path** in the Presenter Control Bar.
> "checkout-api just had a P95 latency spike — 365 milliseconds to 1,240. Autopilot already
> correlated it to a deploy six minutes ago."
- Click **Investigate Incident**.
> "This is the Coach UI — not a chatbot transcript. Left pane: what it checked. Center: the causal
> chain, with live evidence on every node." Click the root-cause node, show the evidence drawer,
> close it.
> "Right pane: the exact fix, and — this is the point — the confidence score. Restarting pods scores
> 0.30, because that's failed before. Building this index scores 0.88, because it's a verified
> workflow."
- Click **Approve & Execute: Build Index**.
> "Watch it execute live." Let the terminal stream, then the SLO ring complete.
> "SLOs are back to baseline, and the system just rewarded itself for being right — the edge weight
> updated from 0.88 to 0.91. That's the learning loop."

**[1:45 – 2:30] Scenario 2 — the honest 'I don't know.'**

- Click **S2 · Novel Diagnosis**.
> "billing-service is OOMing and there's no existing workflow. Watch what it does *not* do."
- Point at Pane B's decision tree. "It ruled out cache eviction, ruled out CPU throttling — grayed
  out, dashed, gone — and isolated the real cause: payload spikes. But look at Pane C."
> "'No pre-approved remediation workflows found — restricting to read-only diagnostics.' It will not
> guess at a fix. It hands off to a human instead of hallucinating one."

**[2:30 – 3:15] Scenario 3 — pattern graduation.**

- Click **S3 · Graduation** (auto-returns to the Knowledge Gap Map).
> "Here's how Autopilot gets *better* over time without ML magic. payment-service has needed the same
> manual fix three times this week."
- Click **Graduate to Workflow**.
> "Before anything becomes automatic, it has to pass a human-readable rubric: high toil, easy to
> automate, low downside. All three, yes."
- Click **Confirm Graduation**.
> "Now it's a deterministic workflow — the toil-reclaimed number just moved, live."

**[3:15 – 4:00] Scenario 4 — the human still wins.**

- Click **S4 · SRE Veto**.
> "auth-service is slow, and Autopilot recommends restarting the container — 0.88 confidence. But I
> happen to know there's a database migration running right now, and a restart mid-migration is
> dangerous."
- Click **Reject Recommendation**, select *"Database under maintenance"*, click **Submit Veto**.
> "One click, and that score decays live to 0.45 — and it's written to an immutable audit log. Next
> time this pattern shows up during a migration, Autopilot won't propose this fix again."

**[4:00 – 5:00] Scenario 5 — teach it something new, then close.**

- Click **S5 · Knowledge Gap**.
> "Last one. gateway-ingress is throwing a critical alert and Autopilot has zero runbook context for
> it — see the pulsing gap right in the causal graph."
- Paste/confirm the seeded runbook text in the Knowledge Injection panel, click **Recalculate &
  Revise Analysis**.
> "I just taught it, in-line, in under thirty seconds. Watch the graph re-solve — 0.92 confidence, a
> real fix, and the Approve button unlocks."
> "Five failure modes. One agent. It executes when it's sure, defers when it's not, defers to *you*
> when you override it, and gets measurably smarter every time any of that happens. That's the
> Substrate."

---

**Last Updated**: 2026-09-02
**Version**: 3.0.0 (2-screen light-mode rewrite, 5 MECE scenarios)
