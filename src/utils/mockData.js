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

    // Linear causal chain rendered as a vertical proof canvas (Screen 3, Pane B)
    // `evidence` on each node = "data used per vertex" (traces, NRQL, log exemplars)
    causalChain: [
      {
        id: 'symptom',
        kind: 'Symptom Node',
        label: 'P95 Spiked 3.4x (365ms → 1,240ms)',
        evidence: ['Trace: 7f8a9b2c4e (1,240ms)', 'Metric: checkout-api p95_duration'],
      },
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
        id: 'mitigation',
        kind: 'Mitigation Node',
        label: 'Build composite DB index',
        confidence: 0.92,
        evidence: ['Living Runbook: RETRO-INC-4512 (92% match)'],
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

    rlhf: {
      reward: 0.03,
      updatedCausalEdgeWeight: 0.91,
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
        id: 'symptom',
        kind: 'Symptom Node',
        label: 'P95 Spiked 4.2x (210ms → 890ms)',
        evidence: ['Trace: 3d1e6b8f21 (890ms)', 'Metric: checkout-service p95_duration'],
      },
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
        id: 'mitigation',
        kind: 'Mitigation Node',
        label: 'Raise Redis max_connections + backoff',
        confidence: 0.88,
        evidence: ['Living Runbook: RETRO-INC-3891 (88% match)'],
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
      reward: 0.04,
      updatedCausalEdgeWeight: 0.93,
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
    mttrBefore: '2 hours',
    mttrAfter: '45 sec',
    sreCapacityReclaimedUsd: 17_200_000,
    sreCapacityReclaimedPercent: 23,
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
