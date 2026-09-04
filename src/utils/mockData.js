/**
 * Org-level mock data for the Autopilot / Substrate MVP (Feb 2027).
 *
 * Per-scenario incident/workspace data lives in `scenarios.js`. This file
 * holds data shared across both screens: account/user chrome, the Knowledge
 * Gap Map's 11×12 grid, and the KPI tiles.
 */

export const account = {
  name: 'Financial-Prod-US',
  guardrails: 'Enforced',
  monitoredServices: 42,
  monitoredClusters: 3,
};

export const currentUser = {
  name: 'Alex',
  role: 'SRE',
};

// 11 Telemetry & Context Dimensions the Substrate reasons over.
export const matrixDataTypes = [
  'Metrics', 'Events', 'Logs', 'Traces', 'Code', 'Config',
  'Runbooks', 'Retros', 'Root causes', 'Tickets', 'Ownership',
];

// 12 Core Microservices — includes every scenario's entity (checkout-api,
// billing-service, payment-service, auth-service, gateway-ingress, plus
// sessions-db as a data-tier dependency) plus 6 filler services for texture.
export const matrixServices = [
  'checkout-api', 'sessions-db', 'payment-service', 'billing-service', 'auth-service', 'gateway-ingress',
  'cart-service', 'session-mgr', 'inventory-service', 'order-worker', 'search-api', 'notification-svc',
];

// [dataType, service] richness overrides — everything else defaults to 'complete'.
// Exactly 4 GAP cells to match the "Knowledge Gaps: 4 Gaps Identified" KPI tile.
const GAP_CELLS = [
  ['Runbooks', 'checkout-api'],
  ['Runbooks', 'billing-service'],
  ['Runbooks', 'gateway-ingress'],
  ['Root causes', 'gateway-ingress'],
  ['Tickets', 'notification-svc'],
];

const THIN_CELLS = [
  ['Events', 'gateway-ingress'], ['Traces', 'notification-svc'], ['Config', 'search-api'],
  ['Tickets', 'auth-service'], ['Ownership', 'session-mgr'], ['Code', 'order-worker'],
  ['Logs', 'inventory-service'], ['Root causes', 'cart-service'], ['Metrics', 'notification-svc'],
  ['Retros', 'auth-service'], ['Config', 'billing-service'], ['Events', 'order-worker'],
  ['Traces', 'session-mgr'],
  // payment-service's fix is still a hand-run script, not a graduated Runbook —
  // this is the cell Scenario 3 flips to 'complete' on graduation confirm.
  ['Runbooks', 'payment-service'],
];

const cellKey = (dataType, service) => `${dataType}::${service}`;
const richnessOverrides = new Map();
GAP_CELLS.forEach(([dt, svc]) => richnessOverrides.set(cellKey(dt, svc), 'gap'));
THIN_CELLS.forEach(([dt, svc]) => richnessOverrides.set(cellKey(dt, svc), 'thin'));

export const baseMatrixCoverage = {};
matrixDataTypes.forEach((dataType) => {
  baseMatrixCoverage[dataType] = {};
  matrixServices.forEach((service) => {
    baseMatrixCoverage[dataType][service] = richnessOverrides.get(cellKey(dataType, service)) ?? 'complete';
  });
});

// Headline KPI tiles. These are curated org-wide figures (the grid above
// only models 12 of the ~36 real core microservices) — not mechanically
// derived from the 12x11 grid, same convention as activeServices previously.
export const kpiStats = {
  coverageGaps: { count: 20, coveragePercent: 55 },
  servicesAtRisk: { atRisk: 8, total: 12 },
  missingRunbooks: { missing: 9, total: 12 },
  runsHitGap: { hit: 5, total: 12 },
  selfHealing: { automatedPercent: 58.2, guidedPercent: 41.8 },
  sreToilReclaimedHours: 345,
  knowledgeCuration: { percent: 71.4, initialGaps: 14, cured: 10, active: 4 },
};

// Runbooks-cell knowledge drawer content, keyed by service — the two
// authored Runbooks×service GAP cells. Other gap cells fall back to a
// generic gap description in RunbookGapDrawer.
export const runbookGapDetail = {
  'billing-service': {
    team: 'billing',
    source: 'None — first occurrence',
    retention: 'n/a',
    freshness: 'n/a',
    completeness: '0%',
    samplesPerDay: '0',
    rto: 'Knowledge',
    impactScore: 7.2,
    reference: {
      badge: 'GAP',
      kicker: 'REFERENCE · OPTIMIZED PATTERN',
      title: 'No workflow exists yet for OOM-by-payload-spike',
      body: 'This is a novel failure mode — Autopilot correctly restricted itself to read-only diagnostics rather than guessing. Once a human resolves this and it recurs, it becomes a graduation candidate (see Scenario 3).',
      tags: ['Novel failure', 'Read-only diagnostics', 'Graduation candidate'],
      checklist: [
        'Confirm root cause with the on-call owner',
        'Author a runbook once the fix is proven',
        'Link the runbook to the billing-service entity tag',
      ],
    },
    yaml: `title: Payload-Spike OOM Remediation — billing-service
entity: billing-service
owner: team-billing
status: DRAFT — awaiting first verified resolution`,
  },
  'gateway-ingress': {
    team: 'platform',
    source: 'Wiki / Git-backed markdown',
    retention: 'versioned',
    freshness: 'never indexed',
    completeness: '0%',
    samplesPerDay: '0',
    rto: 'Knowledge',
    impactScore: 8.5,
    reference: {
      badge: 'GAP',
      kicker: 'REFERENCE · OPTIMIZED PATTERN',
      title: 'Runbooks linked to entities + versioned in-repo',
      body: 'Thin coverage today. The reference shows the upgrade path. The agent finds a runbook before falling back to first-principles reasoning. Keep them next to the code, and link them to the entity via a tag.',
      tags: ['Entity tags', 'Repo-backed markdown', 'Runbook automation'],
      checklist: [
        'Runbook tag on every entity',
        'Runbooks versioned with the code',
        'Symptoms expressed as NRQL predicates',
        'Each step links to another runbook or an automation action',
      ],
    },
    yaml: `title: Ingress Recovery
entity: gateway-ingress
owner: team-platform
symptoms:
  - description: Connection Reset
fix: scale ingress-controller deployment`,
  },
};
