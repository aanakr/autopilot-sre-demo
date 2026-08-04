/**
 * Mock Data for Autopilot SRE Agent Demo (September 2026 MVP)
 *
 * Two incident scenarios (INC-8472, INC-8391) walked through all 6 screens,
 * plus the organizational knowledge hub and entity memory data.
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

export const suggestedActions = [
  { id: 'schema', icon: 'Search', label: 'Check Recent Schema Normalizations' },
  { id: 'runbooks', icon: 'FileText', label: 'Surface Living Runbooks for Redis Latency' },
  { id: 'roi', icon: 'BarChart3', label: 'Render Substrate Moat ROI Dashboard' },
  { id: 'handoff', icon: 'RefreshCw', label: 'Review Shift Handoff for checkout-service' },
];

export const incidents = {
  'INC-8472': {
    id: 'INC-8472',
    title: 'checkout-api P95 Latency Spike',
    entity: 'checkout-api',
    entityMemoryId: 'checkout-service',
    severity: 'CRITICAL',
    status: 'ONGOING',
    detectedMinutesAgo: 2,
    triggerTimeUtc: '14:07 UTC',
    blastRadius: '4 microservices, 1 DB, 12.4k sessions',

    metrics: {
      p95Before: 365,
      p95After: 1240,
      multiplier: 3.4,
    },

    deploy: {
      id: '4a7f2b1',
      author: 'Jordan Kim',
      minutesBeforeIncident: 1,
    },

    dataDictionary: {
      customTag: 'txn_id',
      canonicalTag: 'trace.id',
      matchPercent: 100,
    },

    triggeringEvent: {
      title: 'Triggering Event',
      description: `P95 latency spiked 3.4x (365ms → 1,240ms) at 14:07 UTC following Deploy 4a7f2b1.`,
    },

    mitigation: {
      title: 'Immediate Mitigation Runbook',
      action: `Build index 'idx_sessions_user_sess' CONCURRENTLY on primary DB.`,
      citationRunbookId: 'RETRO-INC-4512',
      citationMatchPercent: 92,
      citationAge: 'Resolved 6 months ago',
      safety: {
        reversible: true,
        tableLock: false,
        estimatedMinutes: 4,
      },
    },

    evidence: [
      {
        label: 'Trace Exemplar',
        traceId: '7f8a9b2c4e',
        durationMs: 1240,
        exception: 'N+1 Query in ORM',
      },
      {
        label: 'DB Metrics',
        detail: '14 sequential fetches per checkout request on sessions-db',
      },
    ],

    // Cross-Customer Pattern Corpus match, shown as a chip on the mitigation tile
    patternCorpus: {
      matchedAccounts: 45,
      privacyNote: 'Shared via Local Differential Privacy — no raw logs or PII leave your account.',
    },

    // Material Versioning & History — analysis re-computed once a new deploy was correlated
    analysisVersions: [
      {
        version: 'v1.0',
        label: 'Initial Alert',
        rootCause: 'Under investigation — correlating recent deploys and dependency changes.',
        mitigation: 'Pending root-cause confirmation.',
      },
      {
        version: 'v2.0',
        label: 'New Deploy Detected',
        rootCause: 'N+1 Query on sessions-db, introduced by Deploy 4a7f2b1.',
        mitigation: `Build index 'idx_sessions_user_sess' CONCURRENTLY on primary DB.`,
      },
    ],

    // Linear causal chain rendered as a vertical proof canvas (Screen 3, Pane B).
    // Purely diagnostic — starts at the change, ends at the observed symptom.
    // The prescribed fix lives separately, in Pane C's Remediation Diff Panel.
    // `evidence` on each node = "data used per vertex" (traces, NRQL, log exemplars),
    // revealed via a click-to-open telemetry exemplar drawer.
    causalChain: [
      {
        id: 'change',
        kind: 'Change Node',
        label: 'Deploy 4a7f2b1 (Jordan Kim)',
        causalityToNext: 0.94,
        evidence: ['Deploy manifest: 4a7f2b1 @ 14:06 UTC', 'CDC link: PR #2291'],
      },
      {
        id: 'root-cause',
        kind: 'Root Cause Node',
        label: 'N+1 Query on sessions-db',
        causalityToNext: 0.89,
        evidence: [
          "NRQL: SELECT count(*) FROM Span WHERE db.statement LIKE 'SELECT * FROM sessions%'",
          'Log exemplar: 14 sequential fetches/request',
        ],
      },
      {
        id: 'cascade',
        kind: 'Cascade Node',
        label: 'DB Pool Exhaustion',
        causalityToNext: 0.95,
        evidence: ['Metric: sessions-db connections_active = 100/100', 'Log exemplar: connection acquire timeout'],
      },
      {
        id: 'symptom',
        kind: 'Symptom Node',
        label: 'P95 Latency Spike (365ms → 1,240ms)',
        evidence: ['Trace: 7f8a9b2c4e (1,240ms)', 'Metric: checkout-api p95_duration'],
      },
    ],

    executionTree: [
      { id: 'fetch-traces', label: 'Read APM Traces', status: 'done' },
      { id: 'query-dictionary', label: 'Query Data Dictionary', status: 'done' },
      { id: 'map-otel', label: 'Map OTel Schema', status: 'done' },
      { id: 'search-rag', label: 'Search Local RAG', status: 'done', detail: 'RETRO-INC-4512 · 92% match' },
      { id: 'await-approval', label: 'Await HIL Approval', status: 'pending' },
    ],

    remediationDiff: {
      language: 'sql',
      lines: [
        { type: 'add', text: 'CREATE INDEX CONCURRENTLY' },
        { type: 'add', text: '  idx_sessions_user_sess' },
        { type: 'add', text: '  ON sessions(user_id);' },
      ],
    },

    remediationOptions: [
      { id: 'restart-pod', label: 'Restart Pod', score: 0.30 },
      { id: 'build-index', label: 'Build Index', score: 0.88, recommended: true },
    ],

    execution: {
      commandLabel: 'Action Handoffs (Temporal State Machine)',
      command: `CREATE INDEX CONCURRENTLY idx_sessions_user_sess ON sessions(user_id);`,
      logLines: [
        'Acquiring advisory lock on sessions table metadata...',
        'Index build started (CONCURRENTLY, zero-downtime mode)...',
        'Scanning sessions table: 0% → 100%...',
        'Validating index integrity...',
        'Index build 100% complete. Zero dropped writes.',
        'Lock status: PASS',
      ],
    },

    validation: {
      totalSeconds: 900, // 15:00
      seedElapsedSeconds: 252, // 04:12, matches the PRD's mid-countdown mock
      rollbackThresholdMs: 300,
      baselineP95Ms: 142,
      baselineErrorRate: 0.0,
    },

    // Inputs to rlEngine.updateEdgeWeight — the edge this fix directly proves out.
    rlhf: {
      priorEdgeWeight: 0.89,
      edgeLabel: 'N+1 Query on sessions-db → DB Pool Exhaustion',
    },
  },

  'INC-8391': {
    id: 'INC-8391',
    title: 'checkout-service Redis Pool Exhaustion',
    entity: 'checkout-service',
    entityMemoryId: 'checkout-service',
    severity: 'HIGH',
    status: 'ONGOING',
    detectedMinutesAgo: 6,
    triggerTimeUtc: '09:52 UTC',
    blastRadius: '3 microservices, 1 cache cluster, 8.9k sessions',

    metrics: {
      p95Before: 210,
      p95After: 890,
      multiplier: 4.2,
    },

    deploy: {
      id: 'b91cf3a',
      author: 'Sam Patel',
      minutesBeforeIncident: 3,
    },

    dataDictionary: {
      customTag: 'sess_key',
      canonicalTag: 'cache.key',
      matchPercent: 100,
    },

    triggeringEvent: {
      title: 'Triggering Event',
      description: `P95 latency spiked 4.2x (210ms → 890ms) at 09:52 UTC as the Redis connection pool saturated during peak checkout traffic.`,
    },

    mitigation: {
      title: 'Immediate Mitigation Runbook',
      action: `Increase Redis max_connections from 100 to 500 and apply exponential backoff.`,
      citationRunbookId: 'RETRO-INC-3891',
      citationMatchPercent: 88,
      citationAge: 'Resolved 3 days ago',
      safety: {
        reversible: true,
        tableLock: false,
        estimatedMinutes: 2,
      },
    },

    evidence: [
      {
        label: 'Trace Exemplar',
        traceId: '3d1e6b8f21',
        durationMs: 890,
        exception: 'Redis ConnectionPoolExhausted',
      },
      {
        label: 'Cache Metrics',
        detail: '100/100 Redis connections active, 340 requests queued',
      },
    ],

    patternCorpus: {
      matchedAccounts: 31,
      privacyNote: 'Shared via Local Differential Privacy — no raw logs or PII leave your account.',
    },

    analysisVersions: [
      {
        version: 'v1.0',
        label: 'Initial Alert',
        rootCause: 'Under investigation — checking cache layer and downstream dependencies.',
        mitigation: 'Pending root-cause confirmation.',
      },
      {
        version: 'v2.0',
        label: 'Traffic Spike Correlated',
        rootCause: 'Redis connection pool exhausted under peak checkout traffic.',
        mitigation: 'Increase Redis max_connections to 500 and apply exponential backoff.',
      },
    ],

    causalChain: [
      {
        id: 'change',
        kind: 'Change Node',
        label: 'Peak Traffic Window (Deploy b91cf3a)',
        causalityToNext: 0.87,
        evidence: ['Traffic metric: +212% RPS vs. baseline', 'Deploy manifest: b91cf3a @ 09:49 UTC'],
      },
      {
        id: 'root-cause',
        kind: 'Root Cause Node',
        label: 'Redis Connection Pool Exhaustion',
        causalityToNext: 0.91,
        evidence: ['Cache metric: 100/100 connections active', 'Log exemplar: 340 requests queued'],
      },
      {
        id: 'cascade',
        kind: 'Cascade Node',
        label: 'Reconnect Storm',
        causalityToNext: 0.93,
        evidence: ['Metric: redis-proxy reconnect_rate spike', 'Log exemplar: repeated backoff retries'],
      },
      {
        id: 'symptom',
        kind: 'Symptom Node',
        label: 'P95 Latency Spike (210ms → 890ms)',
        evidence: ['Trace: 3d1e6b8f21 (890ms)', 'Metric: checkout-service p95_duration'],
      },
    ],

    executionTree: [
      { id: 'fetch-traces', label: 'Read APM Traces', status: 'done' },
      { id: 'query-dictionary', label: 'Query Data Dictionary', status: 'done' },
      { id: 'map-otel', label: 'Map OTel Schema', status: 'done' },
      { id: 'search-rag', label: 'Search Local RAG', status: 'done', detail: 'RETRO-INC-3891 · 88% match' },
      { id: 'await-approval', label: 'Await HIL Approval', status: 'pending' },
    ],

    remediationDiff: {
      language: 'yaml',
      lines: [
        { type: 'add', text: 'redis:' },
        { type: 'add', text: '  max_connections: 500' },
        { type: 'add', text: '  backoff: exponential' },
      ],
    },

    remediationOptions: [
      { id: 'restart-pod', label: 'Restart Pod', score: 0.34 },
      { id: 'raise-pool', label: 'Raise Connection Pool', score: 0.91, recommended: true },
    ],

    execution: {
      commandLabel: 'Action Handoffs (Temporal State Machine)',
      command: `kubectl apply -f redis-pool-config.yaml`,
      logLines: [
        'Applying updated Redis pool configuration...',
        'Rolling restart of redis-proxy pods: 0% → 100%...',
        'Draining queued connections gracefully...',
        'Validating new pool ceiling (500 connections)...',
        'Rollout 100% complete. Zero dropped requests.',
        'Lock status: PASS',
      ],
    },

    validation: {
      totalSeconds: 900,
      seedElapsedSeconds: 180,
      rollbackThresholdMs: 350,
      baselineP95Ms: 198,
      baselineErrorRate: 0.0,
    },

    rlhf: {
      priorEdgeWeight: 0.87,
      edgeLabel: 'Peak Traffic Window → Redis Connection Pool Exhaustion',
    },
  },
};

export const primaryIncident = incidents['INC-8472'];

export const knowledgeBase = {
  connectors: [
    { id: 'slack', name: 'Slack', status: 'connected' },
    { id: 'github', name: 'GitHub', status: 'connected' },
    { id: 'confluence', name: 'Confluence', status: 'connected' },
    { id: 'nr-entities', name: 'New Relic Entities', status: 'connected' },
    { id: 'servicenow', name: 'ServiceNow', status: 'needs-attention' },
    { id: 'manual', name: 'Manual / Raw Text', status: 'connected' },
  ],
  knowledgeGap: {
    source: 'ServiceNow CMDB',
    entity: 'checkout-service',
    description: 'ServiceNow CMDB missing topology links for checkout-service.',
    impactScore: 8.5,
  },
  runbooks: [
    {
      id: 'RETRO-INC-4512',
      title: 'N+1 Query Memory Leak on sessions-db',
      lastInvoked: '2 mins ago',
      lastInvokedFor: 'INC-8472',
      matchPercent: 92,
      summary: 'High P95 latency caused by un-indexed user_id lookups in cart enrichment service.',
      verifiedFix: 'Build composite index CONCURRENTLY.',
      successRate: 1.0,
      executionCount: 14,
      postmortem: {
        summary:
          'A schema change six months prior removed an implicit index on sessions.user_id, silently ' +
          'turning every session lookup into a full table scan. Traffic growth eventually pushed query ' +
          'time past the connection-pool timeout, cascading into checkout failures.',
        timeline: [
          { time: 'T-0m', event: 'P95 latency alert fires on checkout-api.' },
          { time: 'T+3m', event: 'Autopilot correlates the spike to Deploy 4a7f2b1 and drafts a mitigation.' },
          { time: 'T+7m', event: 'On-call approves CREATE INDEX CONCURRENTLY via the Coach UI.' },
          { time: 'T+11m', event: 'P95 returns to baseline (142ms); 15-min SLO validation window begins.' },
          { time: 'T+41m', event: 'Postmortem auto-drafted from ChatOps + execution timeline, filed to Confluence.' },
        ],
      },
      executionHistory: [
        { date: '2026-07-29', incidentId: 'INC-8472', outcome: 'Success', durationMs: 1240 },
        { date: '2026-05-02', incidentId: 'INC-6210', outcome: 'Success', durationMs: 980 },
        { date: '2026-02-14', incidentId: 'INC-5188', outcome: 'Success', durationMs: 1510 },
      ],
    },
    {
      id: 'RETRO-INC-3891',
      title: 'Redis Cache Connection Pool Exhaustion',
      lastInvoked: '3 days ago',
      lastInvokedFor: 'checkout-service',
      matchPercent: 88,
      summary: 'Connection pool limits too low for traffic volume during peak checkout hours.',
      verifiedFix: 'Increase max_connections to 500 and apply exponential backoff.',
      successRate: 0.93,
      executionCount: 6,
      postmortem: {
        summary:
          'A promotional traffic spike drove concurrent checkout sessions past the configured Redis ' +
          'connection ceiling (100). Requests queued instead of failing fast, compounding latency until ' +
          'the pool was raised and exponential backoff was added to smooth reconnect storms.',
        timeline: [
          { time: 'T-0m', event: 'P95 latency alert fires on checkout-service.' },
          { time: 'T+2m', event: 'Autopilot identifies Redis pool saturation via cache metrics.' },
          { time: 'T+5m', event: 'On-call approves raising max_connections to 500 with backoff.' },
          { time: 'T+9m', event: 'P95 returns to baseline; SLO validation window begins.' },
        ],
      },
      executionHistory: [
        { date: '2026-07-27', incidentId: 'INC-8210', outcome: 'Success', durationMs: 890 },
        { date: '2026-04-11', incidentId: 'INC-5904', outcome: 'Success', durationMs: 1120 },
        { date: '2026-01-30', incidentId: 'INC-4772', outcome: 'Partial — required manual pod restart', durationMs: 2340 },
      ],
    },
  ],
  roi: {
    downtimeSavedUsd: 142_500,
    nrqlErrorsIntercepted: 450,
    hallucinationsPrevented: 12,
    mttrReductionPercent: 82,
  },
};

export const entityMemory = {
  'checkout-service': {
    entityId: 'checkout-service',
    tier: 'Production',
    owner: 'Team Payment',
    lastUpdatedUtc: '14:10 UTC',
    lastUpdatedBy: 'SRE Alex',
    scope: 'Account (Financial-Prod-US)',
    activeThread: {
      incidentId: 'INC-8472',
      title: 'P95 Latency Spike',
      status: 'In Remediation',
      hoursElapsed: 2,
      stepsExecuted: 14,
    },
    eliminatedHypotheses: [
      {
        title: 'Redis Cache Eviction',
        testedAt: '18:42 UTC',
        result: 'Cache hit ratio normal (99.2%).',
      },
      {
        title: 'K8s Node CPU Throttling',
        testedAt: '18:45 UTC',
        result: 'CPU utilization <45%.',
      },
    ],
    standingNotes: [
      'Nightly GC pause occurs 00:00-00:30 UTC. Expected behavior; do NOT page on-call.',
    ],
    activeResolution: `Index build 'idx_sessions_user_sess' executed and holding SLO baseline.`,
  },
};

export const defaultMemoryFacts = [
  { id: 'fact-1', scope: 'User', text: `AP-stage refers to agentic-platform in staging, not infra entity.` },
  { id: 'fact-2', scope: 'Account', text: 'Route all critical payment timeouts to #oncall-payments.' },
];

/**
 * Ground Truth / Substrate Matrix (Screen 5 — /substrate/matrix)
 *
 * An 11 data-type x 12 microservice coverage grid: every piece of telemetry,
 * config, and knowledge the agent can reason over, and where it's thin.
 * `matrixStats` and `matrixCoverage`'s per-cell richness are derived below
 * from a hand-set list of overrides, not asserted separately, so the KPI
 * tiles always reflect what the grid actually shows.
 */

export const matrixDataTypes = [
  'Metrics', 'Events', 'Logs', 'Traces', 'Code', 'Config',
  'Runbooks', 'Retros', 'Root causes', 'Tickets', 'Ownership',
];

export const matrixServices = [
  'payments-api', 'ledger-svc', 'checkout-api', 'cart-service', 'session-mgr', 'inventory-s',
  'order-worker', 'shipping-sv', 'search-api', 'rank-ml', 'edu-svc', 'api-gateway',
];

export const matrixWorkloads = [
  { id: 'checkout-funnel', label: 'Checkout funnel', subtitle: 'customer purchase path', services: ['checkout-api', 'cart-service', 'session-mgr', 'payments-api'] },
  { id: 'order-fulfillment', label: 'Order fulfillment', subtitle: 'post-order operations', services: ['order-worker', 'shipping-sv', 'inventory-s', 'ledger-svc'] },
  { id: 'discovery', label: 'Discovery', subtitle: 'search + recommendations', services: ['search-api', 'rank-ml', 'edu-svc'] },
  { id: 'platform', label: 'Platform', subtitle: 'shared infra', services: ['api-gateway'] },
];

// [dataType, service] richness overrides — everything else defaults to 'ok'.
const RICH_CELLS = [
  ['Metrics', 'checkout-api'], ['Events', 'checkout-api'], ['Logs', 'checkout-api'],
  ['Traces', 'checkout-api'], ['Code', 'checkout-api'], ['Metrics', 'payments-api'],
  ['Retros', 'cart-service'],
];
const THIN_CELLS = [
  ['Events', 'rank-ml'], ['Traces', 'edu-svc'], ['Config', 'rank-ml'],
  ['Tickets', 'edu-svc'], ['Ownership', 'rank-ml'],
];
const MISSING_CELLS = [
  ['Runbooks', 'ledger-svc'], ['Runbooks', 'checkout-api'], ['Runbooks', 'session-mgr'],
  ['Runbooks', 'inventory-s'], ['Runbooks', 'order-worker'], ['Runbooks', 'shipping-sv'],
  ['Runbooks', 'search-api'], ['Runbooks', 'rank-ml'], ['Runbooks', 'edu-svc'],
  ['Retros', 'session-mgr'], ['Retros', 'inventory-s'], ['Retros', 'order-worker'],
  ['Retros', 'shipping-sv'], ['Retros', 'search-api'], ['Retros', 'rank-ml'],
  ['Retros', 'edu-svc'], ['Retros', 'api-gateway'], ['Retros', 'ledger-svc'],
  ['Code', 'rank-ml'], ['Code', 'edu-svc'],
];

const cellKey = (dataType, service) => `${dataType}::${service}`;
const richnessOverrides = new Map();
RICH_CELLS.forEach(([dt, svc]) => richnessOverrides.set(cellKey(dt, svc), 'rich'));
THIN_CELLS.forEach(([dt, svc]) => richnessOverrides.set(cellKey(dt, svc), 'thin'));
MISSING_CELLS.forEach(([dt, svc]) => richnessOverrides.set(cellKey(dt, svc), 'missing'));

export const matrixCoverage = {};
matrixDataTypes.forEach((dataType) => {
  matrixCoverage[dataType] = {};
  matrixServices.forEach((service) => {
    matrixCoverage[dataType][service] = richnessOverrides.get(cellKey(dataType, service)) ?? 'ok';
  });
});

export const matrixStats = (() => {
  let coverageGaps = 0;
  const atRiskServices = new Set();
  matrixDataTypes.forEach((dataType) => {
    matrixServices.forEach((service) => {
      const richness = matrixCoverage[dataType][service];
      if (richness === 'missing') {
        coverageGaps += 1;
        atRiskServices.add(service);
      } else if (richness === 'thin') {
        atRiskServices.add(service);
      }
    });
  });
  const missingRunbooks = matrixServices.filter((s) => matrixCoverage['Runbooks'][s] === 'missing').length;
  return {
    coverageGaps,
    servicesAtRisk: `${atRiskServices.size}/${matrixServices.length}`,
    missingRunbooks,
    // Historical dimension (runs, not current coverage) — not derivable from the snapshot above.
    runsHitGap: '5/12',
  };
})();

// Agent Runs — one fully-detailed run (linked to INC-8472's real investigation),
// four lightweight stubs for list-view flavor.
export const agentRuns = [
  {
    id: 'run-inc-8472',
    incidentId: 'INC-8472',
    title: 'Checkout p95 spiked 3.4x after deploy',
    relativeTime: '14 min ago',
    stepsCount: 7,
    servicesCount: 3,
    gapCount: 1,
    path: [
      { dataType: 'Metrics', service: 'checkout-api', action: 'p95 on checkout-api jumped at 14:08 UTC', detail: 'checkout · metrics · metric: checkout.latency.p95' },
      { dataType: 'Traces', service: 'checkout-api', action: 'opened traces for slow requests', detail: 'checkout · traces · trace: 4a7f2b1-23ff' },
      { dataType: 'Logs', service: 'checkout-api', action: 'correlated with N+1 pattern in ORM logs', detail: 'checkout · logs · log: query >140 per request' },
      { dataType: 'Code', service: 'checkout-api', action: 'located helper in recent PR', detail: 'checkout · code · commit: sessions.py' },
      { dataType: 'Metrics', service: 'payments-api', action: 'ruled out payments as source', detail: 'payments · metrics · metric: payments.latency.p95', ruledOut: true },
      { dataType: 'Runbooks', service: 'checkout-api', action: 'searched runbook for N+1 pattern', detail: 'checkout · runbooks (no runbook found)', gap: true },
      { dataType: 'Retros', service: 'cart-service', action: 'found prior retro with same root cause', detail: 'cart · retros · retro: INC-4512 cart', matched: true },
    ],
  },
  { id: 'run-2', title: 'Order worker queue backlog after deploy', relativeTime: '2 hours ago', stepsCount: 5, servicesCount: 2, gapCount: 0 },
  { id: 'run-3', title: 'Search-api latency drifted after index rebuild', relativeTime: '6 hours ago', stepsCount: 6, servicesCount: 1, gapCount: 1 },
  { id: 'run-4', title: 'TLS cert auto-renewed on api-gateway', relativeTime: '1 day ago', stepsCount: 3, servicesCount: 1, gapCount: 0 },
  { id: 'run-5', title: 'Ledger reconciliation retry storm', relativeTime: '2 days ago', stepsCount: 4, servicesCount: 2, gapCount: 1 },
];

// Runbooks-cell knowledge drawer content, keyed by service — checkout-api is the
// specifically-authored gap (matches the demo); other services fall back to a
// generic gap description in RunbookGapDrawer.
export const runbookGapDetail = {
  'checkout-api': {
    team: 'checkout',
    source: 'Wiki / Git-backed markdown',
    retention: 'versioned',
    freshness: '6 min ago',
    completeness: '45%',
    samplesPerDay: '4,800',
    rto: 'Knowledge',
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
    yaml: `title: N+1 Query Remediation — checkout-api
entity: checkout-api
owner: team-checkout
symptoms:
  - nrql: SELECT average(duration) FROM Transaction WHERE appName = 'checkout-api' SINCE 5 minutes ago
    threshold: "> 500ms"
steps:
  - id: bump-pool
    run: kubectl scale statefulset sessions-db --replicas=5
  - id: drain
    run: kubectl drain node --ignore-daemonsets
  - id: build-index
    run: CREATE INDEX CONCURRENTLY idx_sessions_user_sess ON sessions(user_id);`,
  },
};

export const groundTruthSdk = {
  quickstart: `import { GroundTruthClient } from '@newrelic/ground-truth-sdk';

const client = new GroundTruthClient({ apiKey: process.env.NEW_RELIC_API_KEY });
const coverage = await client.coverage.get({ service: 'checkout-api' });`,
  proofs: `const proof = await client.proofs.getCausalChain({ incidentId: 'INC-8472' });

console.log(proof.edges.map((e) => \`\${e.from} -> \${e.to} (\${e.weight})\`));`,
  eval: `const result = await client.eval.replay({ runId: 'run-inc-8472' });

console.log(\`Accuracy: \${result.accuracy}, Hallucination rate: \${result.hallucinationRate}\`);`,
};
