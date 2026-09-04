/**
 * The 5 MECE Demo Scenarios (Feb 2027 MVP)
 *
 * Each scenario is a complete, self-contained snapshot of "what the Substrate
 * knows right now" — investigation tree, causal graph, remediation state,
 * and (where relevant) special mechanics: read-only diagnostics (S2),
 * graduation (S3, Screen-1-only), human veto (S4), knowledge injection (S5).
 * The floating Presenter Control Bar swaps `activeScenarioId` in
 * AutopilotContext; both screens read from whichever scenario is active here.
 */

export const scenarios = {
  S1: {
    id: 'S1',
    order: 1,
    key: 'known-issue',
    label: 'Known Issue & Existing Workflow',
    shortLabel: 'Happy Path',
    hasWorkspace: true,
    incidentId: 'INC-8472',
    entity: 'checkout-api',
    title: 'checkout-api P95 Latency Spike',
    severity: 'CRITICAL',
    detectedMinutesAgo: 2,
    triggerTimeUtc: '14:07 UTC',
    blastRadius: '4 microservices, 1 DB, 12.4k sessions',
    metrics: { p95Before: 365, p95After: 1240, multiplier: 3.4 },
    deploy: { id: '4a7f2b1', author: 'Jordan Kim', minutesBeforeIncident: 1 },
    dataDictionary: { customTag: 'txn_id', canonicalTag: 'trace.id', matchPercent: 100 },

    // The Ground Truth Matrix's animated agent-traversal overlay for this
    // incident — the exact sequence of telemetry dimensions Autopilot walked
    // across the org matrix before stalling on the checkout-api Runbooks gap.
    traversalPath: [
      { dataType: 'Metrics', service: 'checkout-api' },
      { dataType: 'Events', service: 'checkout-api' },
      { dataType: 'Traces', service: 'checkout-api' },
      { dataType: 'Logs', service: 'sessions-db' },
      { dataType: 'Runbooks', service: 'checkout-api', stalled: true, note: 'GAP ENCOUNTERED' },
    ],

    investigationTree: [
      { id: 'query-dictionary', label: 'Query Data Dictionary (Normalized schema tags)', status: 'done' },
      { id: 'analyze-apm', label: 'Analyze APM Telemetry (Traces extracted)', status: 'done' },
      {
        id: 'search-rag',
        label: 'Search Local Runbook Base',
        status: 'done',
        detail: 'RAG matches RETRO-INC-4512 · 92% match',
      },
      { id: 'await-approval', label: 'Awaiting SRE Approval', status: 'pending' },
    ],

    causalGraph: {
      mode: 'chain',
      nodes: [
        {
          id: 'deploy',
          kind: 'change',
          label: 'Deploy 4a7f2b1',
          x: 50,
          y: 8,
          evidence: ['Deploy manifest: 4a7f2b1 @ 14:06 UTC', 'CDC link: PR #2291 (Jordan Kim)'],
        },
        {
          id: 'n1-query',
          kind: 'cause',
          label: 'N+1 DB Query',
          x: 50,
          y: 36,
          evidence: [
            "NRQL: SELECT count(*) FROM Span WHERE db.statement LIKE 'SELECT * FROM sessions%'",
            'Log exemplar: 14 sequential fetches/request',
          ],
        },
        {
          id: 'pool-saturated',
          kind: 'cascade',
          label: 'DB Connection Pool Saturated',
          x: 50,
          y: 64,
          evidence: ['Metric: sessions-db connections_active = 100/100', 'Log exemplar: connection acquire timeout'],
        },
        {
          id: 'symptom',
          kind: 'symptom',
          label: 'checkout-api Latency Spike (365ms → 1,240ms)',
          x: 50,
          y: 92,
          evidence: ['Trace: trace.id=7f8a9b2c4e (1,240ms)', 'Metric: checkout-api p95_duration'],
        },
      ],
      edges: [
        { id: 'e1', from: 'deploy', to: 'n1-query', weight: 0.94 },
        { id: 'e2', from: 'n1-query', to: 'pool-saturated', weight: 0.89 },
        { id: 'e3', from: 'pool-saturated', to: 'symptom', weight: 0.95 },
      ],
    },

    remediation: {
      diff: {
        language: 'sql',
        currentLabel: 'Current — no index on sessions.user_id',
        proposedLabel: 'Proposed — WIN Workflow RETRO-INC-4512',
        currentLines: ['-- (no override; full table scan on every lookup)'],
        lines: [
          { type: 'add', text: 'CREATE INDEX CONCURRENTLY' },
          { type: 'add', text: '  idx_sessions_user_sess' },
          { type: 'add', text: '  ON sessions(user_id);' },
        ],
      },
      options: [
        { id: 'restart-pods', label: 'Restart Pods', score: 0.30, note: 'Decayed due to historical regressions' },
        { id: 'build-index', label: 'Build Index', score: 0.88, recommended: true },
      ],
    },

    execution: {
      commandLabel: 'Action Handoffs (Temporal State Machine)',
      command: 'kubectl apply -f migration.yaml',
      logLines: [
        '$ kubectl apply -f migration.yaml',
        'Acquiring advisory lock on sessions table metadata...',
        'Index build started (CONCURRENTLY, zero-downtime mode)...',
        'Scanning sessions table: 0% → 100%...',
        'Validating index integrity...',
        'Index build 100% complete. Zero dropped writes.',
        'Lock status: PASS',
      ],
    },

    validation: {
      totalSeconds: 900,
      seedElapsedSeconds: 0,
      rollbackThresholdMs: 300,
      baselineP95Ms: 142,
      baselineErrorRate: 0,
    },

    rlhf: {
      priorEdgeWeight: 0.88,
      newWeight: 0.91,
      reward: 0.03,
      edgeLabel: 'N+1 DB Query → DB Connection Pool Saturated',
      toastMessage: 'SLOs stabilized. Edge weight permanently updated from 0.88 to 0.91 (+0.03 reward).',
    },
  },

  S2: {
    id: 'S2',
    order: 2,
    key: 'unknown-issue',
    label: 'Unknown Issue & Autopilot Diagnostics',
    shortLabel: 'Novel Diagnosis',
    hasWorkspace: true,
    incidentId: 'INC-9103',
    entity: 'billing-service',
    title: 'billing-service Memory Exhaustion',
    severity: 'HIGH',
    detectedMinutesAgo: 9,
    triggerTimeUtc: '11:22 UTC',
    blastRadius: '2 microservices, 0 DB, 3.1k invoices queued',
    metrics: { p95Before: null, p95After: null, multiplier: null },
    deploy: null,
    dataDictionary: { customTag: 'mem_id', canonicalTag: 'container.id', matchPercent: 100 },

    investigationTree: [
      { id: 'redis-cache', label: 'Analyzed Redis cache', status: 'done', detail: 'Healthy · hit ratio 99.1%' },
      { id: 'heap-alloc', label: 'Inspected heap allocations', status: 'done', detail: 'No leak signature found' },
      {
        id: 'payload-corr',
        label: 'Correlated upstream payload sizes',
        status: 'done',
        detail: 'Spike confirmed: +340% avg payload/request',
      },
      { id: 'await-human', label: 'Awaiting Human Assistance', status: 'pending' },
    ],

    causalGraph: {
      mode: 'decision-tree',
      nodes: [
        { id: 'root', kind: 'change', label: 'billing-service OOMKilled ×4', x: 50, y: 8, evidence: ['Metric: container.memory.usage → limit at 11:22 UTC', 'K8s event: OOMKilled (exit 137)'] },
        { id: 'ruled-out-cache', kind: 'ruled-out', label: 'Redis Cache Eviction', x: 15, y: 42, evidence: ['Cache metric: hit ratio 99.1% (normal)'], ruledOut: true },
        { id: 'ruled-out-cpu', kind: 'ruled-out', label: 'CPU Throttling', x: 50, y: 42, evidence: ['Metric: cpu.throttled_periods = 0'], ruledOut: true },
        { id: 'culprit', kind: 'cause', label: 'Upstream Payload Spikes', x: 85, y: 42, evidence: ['Metric: avg request payload 340% above baseline', 'Trace: unbounded JSON deserialization in InvoiceParser'] },
        { id: 'awaiting', kind: 'symptom', label: 'Awaiting Human Assistance', x: 85, y: 76, evidence: ['No WIN Workflow matches this signature yet'] },
      ],
      edges: [
        { id: 'e1', from: 'root', to: 'ruled-out-cache', weight: null, ruledOut: true },
        { id: 'e2', from: 'root', to: 'ruled-out-cpu', weight: null, ruledOut: true },
        { id: 'e3', from: 'root', to: 'culprit', weight: 0.81 },
        { id: 'e4', from: 'culprit', to: 'awaiting', weight: null },
      ],
    },

    remediation: {
      readOnly: true,
      message: 'No pre-approved remediation workflows found in Substrate registry. Restricting operation to read-only diagnostics.',
    },
  },

  S3: {
    id: 'S3',
    order: 3,
    key: 'pattern-graduation',
    label: 'Pattern Curation & Promotion (Graduation)',
    shortLabel: 'Graduation',
    hasWorkspace: false,
    entity: 'payment-service',
    title: 'payment-service Recurring OOM',

    banner: {
      title: 'Recurring Pattern Detected',
      body: 'payment-service has suffered 3 identical OOM events resolved by scale-replica-set scripts this week.',
    },

    eligibility: [
      {
        id: 'toil',
        label: 'High Toil',
        criterion: 'Resolved manually 3+ times in the last 7 days',
        eligible: true,
      },
      {
        id: 'automatable',
        label: 'Easy to Automate',
        criterion: 'Fix is a deterministic script (scale-replica-set) — no judgment call required',
        eligible: true,
      },
      {
        id: 'downside',
        label: 'Low Downside',
        criterion: 'Fully reversible, no data-loss risk, sub-2-minute blast radius',
        eligible: true,
      },
    ],

    workflowName: 'auto-scale-replica-set-oom',
    toilHoursReclaimed: 6,
  },

  S4: {
    id: 'S4',
    order: 4,
    key: 'human-veto',
    label: 'Human-in-the-Loop Override (SRE Veto)',
    shortLabel: 'SRE Veto',
    hasWorkspace: true,
    incidentId: 'INC-7734',
    entity: 'auth-service',
    title: 'auth-service Latency Anomaly',
    severity: 'HIGH',
    detectedMinutesAgo: 4,
    triggerTimeUtc: '09:14 UTC',
    blastRadius: '3 microservices, 1 DB migration in-flight, 5.6k active sessions',
    metrics: { p95Before: 210, p95After: 980, multiplier: 4.7 },
    deploy: { id: 'migrate-users-0091', author: 'Data Platform Team', minutesBeforeIncident: 6 },
    dataDictionary: { customTag: 'conn_id', canonicalTag: 'db.connection.id', matchPercent: 100 },

    investigationTree: [
      { id: 'query-dictionary', label: 'Query Data Dictionary (Normalized schema tags)', status: 'done' },
      {
        id: 'correlate-change',
        label: 'Correlate Active Change Events',
        status: 'done',
        detail: 'DB Migration ALTER TABLE users (in progress)',
      },
      {
        id: 'search-rag',
        label: 'Search Local Runbook Base',
        status: 'done',
        detail: 'RETRO-INC-2290 · 81% match (container-restart)',
      },
      { id: 'await-approval', label: 'Awaiting SRE Approval', status: 'pending' },
    ],

    causalGraph: {
      mode: 'chain',
      nodes: [
        {
          id: 'migration',
          kind: 'change',
          label: 'DB Migration: ALTER TABLE users (in-flight)',
          x: 50,
          y: 8,
          evidence: ['Change event: migrate-users-0091 started 09:08 UTC', 'Owner: Data Platform Team'],
        },
        {
          id: 'lock-contention',
          kind: 'cause',
          label: 'Connection Lock Contention',
          x: 50,
          y: 36,
          evidence: ['Metric: db.lock_wait_time_ms p95 = 4,200ms', 'Log exemplar: "lock wait timeout exceeded"'],
        },
        {
          id: 'readiness-flap',
          kind: 'cascade',
          label: 'Pod Readiness Flapping',
          x: 50,
          y: 64,
          evidence: ['K8s event: readiness probe failed ×12', 'Metric: auth-service ready_replicas 2/5'],
        },
        {
          id: 'symptom',
          kind: 'symptom',
          label: 'auth-service Latency Spike (210ms → 980ms)',
          x: 50,
          y: 92,
          evidence: ['Trace: trace.id=9c3f1a7e2b (980ms)', 'Metric: auth-service p95_duration'],
        },
      ],
      edges: [
        { id: 'e1', from: 'migration', to: 'lock-contention', weight: 0.88 },
        { id: 'e2', from: 'lock-contention', to: 'readiness-flap', weight: 0.82 },
        { id: 'e3', from: 'readiness-flap', to: 'symptom', weight: 0.90 },
      ],
    },

    remediation: {
      diff: {
        language: 'yaml',
        currentLabel: 'Current — steady-state deployment',
        proposedLabel: 'Proposed — RETRO-INC-2290 (container-restart)',
        currentLines: ['# no rollout in progress'],
        lines: [
          { type: 'add', text: 'kind: RolloutRestart' },
          { type: 'add', text: 'target: deployment/auth-service' },
          { type: 'add', text: 'strategy: rolling' },
        ],
      },
      options: [
        { id: 'container-restart', label: 'Restart Container', score: 0.88, recommended: true },
      ],
    },

    execution: {
      commandLabel: 'Action Handoffs (Temporal State Machine)',
      command: 'kubectl rollout restart deployment/auth-service',
      logLines: [
        '$ kubectl rollout restart deployment/auth-service',
        'Rolling restart initiated (strategy: rolling)...',
        'Pod auth-service-7c9d 1/5 → 5/5 ready...',
        'Readiness probes stabilizing...',
        'Rollout 100% complete.',
        'Lock status: PASS',
      ],
    },

    validation: {
      totalSeconds: 900,
      seedElapsedSeconds: 0,
      rollbackThresholdMs: 350,
      baselineP95Ms: 224,
      baselineErrorRate: 0,
    },

    rlhf: {
      priorEdgeWeight: 0.82,
      newWeight: 0.86,
      reward: 0.04,
      edgeLabel: 'Connection Lock Contention → Pod Readiness Flapping',
      toastMessage: 'SLOs stabilized. Edge weight permanently updated from 0.82 to 0.86 (+0.04 reward).',
    },

    veto: {
      reasons: [
        'Database under maintenance',
        'Risk of data corruption',
        'Known false positive',
        'Insufficient rollback plan',
      ],
      priorScore: 0.88,
      decayedScore: 0.45,
      optionId: 'container-restart',
      auditMessage: (reason) =>
        `Veto recorded: "Restart Container" rejected for auth-service (reason: ${reason}). Substrate will not propose this workflow during active migrations on this entity.`,
    },
  },

  S5: {
    id: 'S5',
    order: 5,
    key: 'knowledge-gap',
    label: 'Active Knowledge-Gap Ingestion',
    shortLabel: 'Knowledge Gap',
    hasWorkspace: true,
    incidentId: 'INC-6650',
    entity: 'gateway-ingress',
    title: 'gateway-ingress Critical Gateway Alert',
    severity: 'CRITICAL',
    detectedMinutesAgo: 1,
    triggerTimeUtc: '16:44 UTC',
    blastRadius: 'Unknown — no topology map indexed for gateway-ingress',
    metrics: { p95Before: 90, p95After: 4100, multiplier: 45.6 },
    deploy: null,
    dataDictionary: { customTag: 'gw_req', canonicalTag: 'http.request.id', matchPercent: 100 },

    investigationTree: [
      { id: 'query-dictionary', label: 'Query Data Dictionary (Normalized schema tags)', status: 'done' },
      { id: 'analyze-apm', label: 'Analyze APM Telemetry (Connection resets extracted)', status: 'done' },
      {
        id: 'search-rag',
        label: 'Search Local Runbook Base',
        status: 'done',
        detail: '0 matches — no runbook indexed for gateway-ingress',
      },
      { id: 'await-knowledge', label: 'Awaiting Knowledge Injection', status: 'pending' },
    ],

    causalGraph: {
      mode: 'chain',
      nodes: [
        {
          id: 'alert',
          kind: 'change',
          label: 'Ingress Alert: Connection Reset Storm',
          x: 50,
          y: 15,
          evidence: ['Metric: gateway-ingress connection_reset_count spike at 16:44 UTC'],
        },
        {
          id: 'gap',
          kind: 'knowledge-gap',
          label: 'Knowledge Gap — root cause unresolved',
          x: 50,
          y: 55,
          evidence: ['No runbook indexed for gateway-ingress', 'No unmapped-tag resolution available'],
          knowledgeGap: true,
        },
        {
          id: 'symptom',
          kind: 'symptom',
          label: 'gateway-ingress Latency Spike (90ms → 4,100ms)',
          x: 50,
          y: 92,
          evidence: ['Metric: gateway-ingress p95_duration'],
        },
      ],
      edges: [
        { id: 'e1', from: 'alert', to: 'gap', weight: null, knowledgeGap: true },
        { id: 'e2', from: 'gap', to: 'symptom', weight: null, knowledgeGap: true },
      ],
    },

    remediation: {
      readOnly: true,
      message: 'Unable to match remediation. Missing runbook context for gateway-ingress.',
    },

    knowledgeInjection: {
      placeholder: `# Ingress Recovery
Symptoms: Connection Reset
Fix: scale ingress-controller deployment`,
      seedValue: `# Ingress Recovery
Symptoms: Connection Reset
Fix: scale ingress-controller deployment`,
    },

    recalculated: {
      causalGraph: {
        mode: 'chain',
        nodes: [
          {
            id: 'alert',
            kind: 'change',
            label: 'Ingress Alert: Connection Reset Storm',
            x: 50,
            y: 8,
            evidence: ['Metric: gateway-ingress connection_reset_count spike at 16:44 UTC'],
          },
          {
            id: 'undersized',
            kind: 'cause',
            label: 'ingress-controller Undersized for Load',
            x: 50,
            y: 36,
            evidence: ['Injected runbook: "Ingress Recovery" — matched symptom "Connection Reset"', 'Metric: ingress-controller replica count 2/2 (saturated)'],
          },
          {
            id: 'cascade',
            kind: 'cascade',
            label: 'Upstream Connection Resets',
            x: 50,
            y: 64,
            evidence: ['Metric: reset_count correlates with replica saturation (r=0.94)'],
          },
          {
            id: 'symptom',
            kind: 'symptom',
            label: 'gateway-ingress Latency Spike (90ms → 4,100ms)',
            x: 50,
            y: 92,
            evidence: ['Metric: gateway-ingress p95_duration'],
          },
        ],
        edges: [
          { id: 'e1', from: 'alert', to: 'undersized', weight: 0.92 },
          { id: 'e2', from: 'undersized', to: 'cascade', weight: 0.90 },
          { id: 'e3', from: 'cascade', to: 'symptom', weight: 0.95 },
        ],
      },
      remediation: {
        diff: {
          language: 'yaml',
          currentLabel: 'Current — 2 replicas',
          proposedLabel: 'Proposed — scale ingress-controller (injected runbook)',
          currentLines: ['replicas: 2'],
          lines: [
            { type: 'add', text: 'kind: Deployment' },
            { type: 'add', text: 'target: ingress-controller' },
            { type: 'add', text: 'replicas: 6' },
          ],
        },
        options: [
          { id: 'scale-ingress', label: 'Scale ingress-controller Deployment', score: 0.92, recommended: true },
        ],
      },
      execution: {
        commandLabel: 'Action Handoffs (Temporal State Machine)',
        command: 'kubectl scale deployment/ingress-controller --replicas=6',
        logLines: [
          '$ kubectl scale deployment/ingress-controller --replicas=6',
          'Scaling ingress-controller: 2 → 6 replicas...',
          'New pods entering Ready state: 2/6 → 6/6...',
          'Connection reset rate falling...',
          'Rollout 100% complete.',
          'Lock status: PASS',
        ],
      },
      validation: {
        totalSeconds: 900,
        seedElapsedSeconds: 0,
        rollbackThresholdMs: 500,
        baselineP95Ms: 95,
        baselineErrorRate: 0,
      },
      rlhf: {
        priorEdgeWeight: 0.92,
        newWeight: 0.95,
        reward: 0.03,
        edgeLabel: 'ingress-controller Undersized for Load → Upstream Connection Resets',
        toastMessage: 'SLOs stabilized. Edge weight permanently updated from 0.92 to 0.95 (+0.03 reward).',
      },
      confidence: 0.92,
    },
  },
};

export const scenarioList = Object.values(scenarios).sort((a, b) => a.order - b.order);

export const getScenario = (id) => scenarios[id] ?? scenarios.S1;

export const workspaceScenarios = scenarioList.filter((s) => s.hasWorkspace);

export const getScenarioByIncidentId = (incidentId) =>
  workspaceScenarios.find((s) => s.incidentId === incidentId) ?? scenarios.S1;
