# New Relic Autopilot SRE Agent - September 2026 MVP

A React 18 + Vite + Tailwind single-page application demonstrating New Relic's Substrate-powered
autonomous SRE agent, built around a **mitigation-first triage strategy** and a spatial **3-Pane
Coach UI**, rather than a linear chatbot transcript.

---

## Product Overview

During a live incident, expert SREs distrust a single "root cause" claim — outages stem from
compounding factors. Autopilot's triage sequence reflects that:

1. **Immediate Mitigation First** — identify the triggering event and propose a mitigation
   grounded in a verified runbook.
2. **Asynchronous Root Cause Later** — deep, multi-variable RCA is deferred until service
   availability is stabilized.

Every recommendation is transparent (evidence trail), auditable (click any node for underlying
data), safe (human-in-the-loop approval before writes), and informed by cross-customer pattern
matching.

## The 6 Screens

| # | Screen | Route | Purpose |
|---|--------|-------|---------|
| 1 | Context-Aware Chat Home | `/autopilot/home` | Surfaces active incidents before the user types a prompt. |
| 2 | Mitigation & Proof Chain Thread | `/autopilot/thread/:incidentId` | 3-tile briefing: Triggering Event, Mitigation, Evidence. |
| 3 | 3-Pane Coach UI Workspace | `/autopilot/workspace/:incidentId` | Execution Tree · Causal Proof Canvas · Remediation Diff, with a sticky approval footer. |
| 4 | SLO Validation & RLHF State | `/autopilot/workspace/:incidentId/execution` | Live execution log, 15-minute post-remediation validation countdown, RLHF reward banner. |
| 5 | Organizational Knowledge Hub | `/autopilot/knowledge` | Living Runbook cards and the Substrate Moat ROI widget. |
| 6 | Entity Operational Memory | `/autopilot/memory/:entityId` | Shift-handoff state: eliminated hypotheses, standing notes, CMS memory facts. |

### Entry/Exit flow

```
Home → Investigate Incident → Thread (mitigation-first briefing)
     → Open Substrate Coach UI → Workspace (3-pane) → Approve & Execute
     → Execution (validation countdown → RLHF banner) → Return to Thread / Knowledge Hub

Home → Organizational Knowledge → Runbook cards + ROI
     → Entity Memory (shift handoff) → Export to Slack
```

## Architecture

### State Machine Safety

Async operations that need it (the Screen 4 validation timer, the Screen 4 terminal log reveal)
use explicit local state with bounded intervals — no unhandled promise chains, no infinite
spinners. `useTimeoutFallback` (in `src/hooks/`) remains available for any future async action
that needs a hard timeout fallback.

### Routing

`HashRouter` (React Router v6) — required for GitHub Pages, which has no server-side rewrite
rules for client-side routes. All 6 screens above are real routes, not client-side state
switches, so back/forward and deep-linking work.

### Global State

`AutopilotContext` (`src/context/AutopilotContext.jsx`) holds only what must survive navigation
between screens: the active account/user, and the CMS memory-facts list (so "Add Memory Fact" on
Screen 6 persists for the session). Per-incident data is read directly from `src/utils/mockData.js`
by route param — no need to globalize it.

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS (obsidian dark theme) |
| Routing | React Router v6 (HashRouter) |
| State | React Context API |
| Icons | lucide-react |
| Deployment | GitHub Pages via `gh-pages` |

## Design System

```js
// tailwind.config.js
colors: {
  obsidian: { 900: '#0B0E14', 800: '#131722', 700: '#1F2430', 600: '#2A3042' },
  electric: { green: '#10B981', glow: '#00F0FF', cyan: '#06B6D4' },
  danger: '#EF4444',
  warning: '#F59E0B',
}
```

- **Verified telemetry / SLOs**: electric-green
- **AI signals / links**: electric-cyan
- **Critical alerts**: danger (red)
- **Pending approvals**: warning (amber)
- **Headings/body**: Inter · **Code/NRQL/trace IDs**: JetBrains Mono

## Local Development

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build to dist/
npm run preview   # preview the production build
npm run lint
npm run deploy    # build + publish to the gh-pages branch
```

## GitHub Pages Deployment

`vite.config.js` sets `base: '/autopilot-sre-demo/'` to match the repo name — this, combined with
`HashRouter`, is what keeps the live URL stable at
`https://aanakr.github.io/autopilot-sre-demo/` across rewrites. Internal navigation lives after
the `#`, e.g. `https://aanakr.github.io/autopilot-sre-demo/#/autopilot/home`.

```bash
npm run deploy
```

## Component Guidelines

Every component stays under ~150 lines and is split by screen/concern
(`components/{layout,home,thread,workspace,execution,knowledge,memory}/`) — this keeps individual
files small enough to hand to an AI coding assistant for a targeted edit without it needing to
reason about the whole page.

---

**Last Updated**: 2026-07-29
**Version**: 2.0.0 (6-screen mitigation-first rewrite)
