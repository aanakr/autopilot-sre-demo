/**
 * Mock Data for Autopilot SRE Agent Demo
 *
 * Realistic incident scenarios demonstrating the 4 Substrate Pillars
 */

export const mockIncidentData = {
  'INC-8472': {
    id: 'INC-8472',
    title: 'Payment Service Memory Exhaustion',
    severity: 'CRITICAL',
    status: 'ONGOING',
    startTime: '2026-09-15T14:23:00Z',
    affectedService: 'payment-service',

    // Timeline events
    timeline: [
      {
        time: '14:18:00',
        event: 'Deployment',
        description: 'payment-service v2.14.0 deployed',
        type: 'change',
      },
      {
        time: '14:23:00',
        event: 'Alert Triggered',
        description: 'Memory usage > 95%',
        type: 'alert',
      },
      {
        time: '14:24:30',
        event: 'Service Degradation',
        description: 'Response time increased 400%',
        type: 'symptom',
      },
      {
        time: '14:26:00',
        event: 'RCA Complete',
        description: 'Autopilot identified root cause',
        type: 'analysis',
      },
    ],

    // Summary (bullet points)
    summary: [
      'Database connection pool exhausted due to slow SQL query loop in v2.14.0',
      'Checkout service experiencing cascading failures (404 errors)',
      'Estimated 180 failed transactions/min (~$42k revenue at risk)',
      'Similar incident (RETRO-INC-4512) resolved by increasing connection limits',
    ],

    // Recommendations with confidence scores
    recommendations: [
      {
        id: 'rec-1',
        title: 'Roll back to payment-service v2.13.8',
        confidence: 0.88,
        priority: 'IMMEDIATE',
        impact: 'High',
        description: 'Previous version had stable connection pool usage',
        costOfInaction: '~$42k/min revenue loss',
        estimatedDuration: '2 minutes',
      },
      {
        id: 'rec-2',
        title: 'Increase PostgreSQL max_connections from 100 to 200',
        confidence: 0.72,
        priority: 'SECONDARY',
        impact: 'Medium',
        description: 'Temporary mitigation while investigating v2.14.0 code',
        costOfInaction: 'Continued degradation',
        estimatedDuration: '5 minutes',
      },
    ],

    // Proof Chain (4 tiles: Symptom → Change → Root Cause → Fix)
    proofChain: {
      symptom: {
        title: 'Symptom',
        description: 'Payment-service memory usage spiked to 98% at 14:23:00 UTC',
        evidence: [
          'Memory usage: 1.96 GB / 2.0 GB',
          'Response time P95: 4,200ms (baseline: 120ms)',
          'Error rate: 23% (baseline: 0.01%)',
        ],
        traceIds: ['trace-abc-123', 'trace-def-456'],
        nrql: 'SELECT average(memoryUsagePercent) FROM SystemSample WHERE entityName = \'payment-service\' SINCE 30 minutes ago TIMESERIES',
      },
      change: {
        title: 'Change Detected',
        description: 'Deployment of payment-service v2.14.0 occurred 5 minutes before incident',
        evidence: [
          'Deployment timestamp: 14:18:00 UTC',
          'Version: v2.13.8 → v2.14.0',
          'Deployment method: Rolling update (k8s)',
        ],
        changeId: 'DEPLOY-2026-09-15-001',
        nrql: 'SELECT * FROM Deployment WHERE appName = \'payment-service\' SINCE 1 hour ago',
      },
      rootCause: {
        title: 'Root Cause',
        description: 'Slow SQL query loop in new transaction validation logic',
        evidence: [
          'Query execution time: 3,400ms (baseline: 8ms)',
          'Connection pool saturation: 100/100 connections active',
          'Database CPU spike: 92% (baseline: 15%)',
        ],
        codeLocation: 'src/services/validateTransaction.js:47',
        traceIds: ['trace-abc-123', 'trace-def-456', 'trace-ghi-789'],
        nrql: 'SELECT average(databaseDuration) FROM Transaction WHERE appName = \'payment-service\' FACET name SINCE 30 minutes ago',
      },
      fix: {
        title: 'Recommended Fix',
        description: 'Immediate rollback to v2.13.8 + code review of v2.14.0 query logic',
        steps: [
          'Execute: kubectl set image deployment/payment-service payment-service=registry/payment-service:v2.13.8',
          'Monitor: Wait 2 minutes for rollout completion',
          'Validate: Check memory usage returns to baseline (~40%)',
          'Post-incident: Review src/services/validateTransaction.js query optimization',
        ],
        confidence: 0.88,
      },
    },

    // Entity Topology (Blast Radius)
    topology: {
      nodes: [
        { id: 'payment-service', name: 'Payment Service', type: 'APPLICATION', health: 'CRITICAL' },
        { id: 'postgres-primary', name: 'PostgreSQL Primary', type: 'DATABASE', health: 'DEGRADED' },
        { id: 'checkout-service', name: 'Checkout Service', type: 'APPLICATION', health: 'DEGRADED' },
        { id: 'api-gateway', name: 'API Gateway', type: 'SERVICE', health: 'HEALTHY' },
        { id: 'k8s-node-03', name: 'k8s-node-03', type: 'HOST', health: 'HEALTHY' },
      ],
      edges: [
        { source: 'api-gateway', target: 'payment-service', label: 'HTTPS' },
        { source: 'payment-service', target: 'postgres-primary', label: 'SQL' },
        { source: 'checkout-service', target: 'payment-service', label: 'gRPC' },
        { source: 'payment-service', target: 'k8s-node-03', label: 'runs-on' },
      ],
    },

    // Causal Graph (RLHF scores)
    causalGraph: {
      nodes: [
        { id: 'deployment', label: 'Deployment v2.14.0', score: 0.95 },
        { id: 'slow-query', label: 'Slow SQL Query', score: 0.92 },
        { id: 'pool-exhaustion', label: 'Connection Pool Full', score: 0.88 },
        { id: 'memory-spike', label: 'Memory Exhaustion', score: 0.88 },
        { id: 'cascade-failure', label: 'Checkout Failures', score: 0.75 },
      ],
      edges: [
        { source: 'deployment', target: 'slow-query', confidence: 0.95 },
        { source: 'slow-query', target: 'pool-exhaustion', confidence: 0.92 },
        { source: 'pool-exhaustion', target: 'memory-spike', confidence: 0.88 },
        { source: 'memory-spike', target: 'cascade-failure', confidence: 0.75 },
      ],
    },

    // Incident Knowledge Base (RAG match)
    similarIncidents: [
      {
        id: 'RETRO-INC-4512',
        title: 'Postgres connection pool exhaustion during peak traffic',
        date: '2026-07-14',
        matchScore: 0.92,
        matchType: 'Same root cause',
        summary: 'Connection pool limits too low for traffic volume',
        resolution: 'Increased max_connections from 100 → 200',
        timeToResolve: '12 minutes',
      },
      {
        id: 'RETRO-INC-3891',
        title: 'Payment service memory leak in v2.12.0',
        date: '2026-06-03',
        matchScore: 0.78,
        matchType: 'Similar pattern',
        summary: 'Memory leak in transaction validation code',
        resolution: 'Rolled back to v2.11.5, patched memory leak',
        timeToResolve: '18 minutes',
      },
    ],

    // Global Corpus Match
    globalCorpus: {
      matchScore: 0.94,
      totalIncidents: 1247,
      enterprisesAffected: 89,
      pattern: 'DB_Stateful_Storage → Connection_Pool → Memory_Saturation',
      topRemediation: 'Scale connection pool',
      remediationSuccessRate: 0.94,
      privacyNote: 'Pattern abstracted from anonymized multi-tenant data (no PII)',
    },

    // Hypotheses evaluated (for transparency)
    hypothesesEvaluated: [
      {
        hypothesis: 'Database server hardware failure',
        score: 0.12,
        evidence: { deployment: 0.0, trace: 0.1, metric: 0.2, temporal: 0.15 },
        reason: 'No infrastructure alerts or CPU/disk anomalies detected',
      },
      {
        hypothesis: 'DDoS attack or traffic spike',
        score: 0.28,
        evidence: { deployment: 0.0, trace: 0.3, metric: 0.4, temporal: 0.45 },
        reason: 'Traffic volume within normal range (no significant increase)',
      },
      {
        hypothesis: 'Recent deployment introduced performance regression',
        score: 0.88,
        evidence: { deployment: 0.95, trace: 0.92, metric: 0.85, temporal: 0.8 },
        reason: 'Timing correlation (5 min lag), query duration 400x baseline',
      },
    ],

    // Impact & Blast Radius
    impact: {
      failedTransactions: 2160,
      affectedUsers: 847,
      duration: '12 minutes (ongoing)',
      estimatedRevenueLoss: '$504k',
      servicesDegraded: ['payment-service', 'checkout-service'],
      servicesCritical: ['payment-service'],
      servicesHealthy: ['api-gateway', 'user-service', 'notification-service'],
    },
  },

  // Default fallback data
  default: {
    id: 'INC-0000',
    title: 'Sample Incident',
    severity: 'MEDIUM',
    status: 'RESOLVED',
    summary: ['This is a sample incident for demonstration purposes'],
    recommendations: [],
    proofChain: {},
    topology: { nodes: [], edges: [] },
    causalGraph: { nodes: [], edges: [] },
    similarIncidents: [],
    globalCorpus: {},
  },
};

// Export specific incident for quick access
export const primaryIncident = mockIncidentData['INC-8472'];
