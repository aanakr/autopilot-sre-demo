/**
 * Mock Data for Autopilot SRE Agent Demo (September 2026 MVP)
 *
 * Single incident scenario (INC-8472) walked through all 6 screens,
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

    // Linear causal chain rendered as a vertical proof canvas (Screen 3, Pane B)
    causalChain: [
      {
        id: 'symptom',
        kind: 'Symptom Node',
        label: 'P95 Spiked 3.4x (365ms → 1,240ms)',
      },
      {
        id: 'change',
        kind: 'Change Node',
        label: 'Deploy 4a7f2b1 (Jordan Kim)',
        causalityToNext: 0.94,
      },
      {
        id: 'root-cause',
        kind: 'Root Cause Node',
        label: 'N+1 Query on sessions-db',
        causalityToNext: 0.89,
      },
      {
        id: 'mitigation',
        kind: 'Mitigation Node',
        label: 'Build composite DB index',
        confidence: 0.92,
      },
    ],

    executionTree: [
      { id: 'fetch-traces', label: 'Read APM Traces', status: 'done' },
      { id: 'query-dictionary', label: 'Query Data Dictionary', status: 'done' },
      { id: 'map-otel', label: 'Map OTel Schema', status: 'done' },
      { id: 'search-rag', label: 'Search Local RAG', status: 'done', detail: 'RETRO-INC-4512' },
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

    rlhf: {
      reward: 0.03,
      updatedCausalEdgeWeight: 0.91,
    },
  },
};

export const primaryIncident = incidents['INC-8472'];

export const knowledgeBase = {
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
    },
  ],
  roi: {
    nrqlErrorsIntercepted: 450,
    hallucinationsPrevented: 12,
    resolutionPathsStrengthened: 8,
    incidentsResolvedAutonomously: 15,
    downtimePreventedUsd: 15_000_000,
    mttrReductionPercent: 64,
  },
};

export const entityMemory = {
  'checkout-service': {
    entityId: 'checkout-service',
    lastUpdatedUtc: '14:10 UTC',
    lastUpdatedBy: 'SRE Alex',
    scope: 'Account (Financial-Prod-US)',
    activeThread: {
      incidentId: 'INC-8472',
      title: 'P95 Latency Spike',
      hoursElapsed: 2,
      stepsExecuted: 14,
    },
    eliminatedHypotheses: [
      { title: 'Redis Cache', detail: 'Verified healthy at 14:02 UTC. Do not re-query cache layer.' },
      { title: 'K8s Host Node', detail: 'No CPU throttling observed on host k8s-node-12.' },
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
