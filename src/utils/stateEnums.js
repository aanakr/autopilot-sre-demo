/**
 * State Machine Enums
 *
 * These explicit states prevent infinite loading spinners
 * by forcing resolution to either SUCCESS or ERROR.
 */

export const AgentStates = {
  IDLE: 'IDLE',           // No operation in progress
  LOADING: 'LOADING',     // Agent is "thinking" (max 3s timeout)
  SUCCESS: 'SUCCESS',     // Operation completed successfully
  ERROR: 'ERROR',         // Operation failed or timed out
};

export const IncidentSeverity = {
  CRITICAL: 'CRITICAL',   // P1 - Production down
  HIGH: 'HIGH',           // P2 - Major degradation
  MEDIUM: 'MEDIUM',       // P3 - Minor issue
  LOW: 'LOW',             // P4 - Maintenance
};

export const EntityHealth = {
  HEALTHY: 'HEALTHY',     // All systems operational
  DEGRADED: 'DEGRADED',   // Partial functionality
  CRITICAL: 'CRITICAL',   // Service down
  UNKNOWN: 'UNKNOWN',     // No recent data
};

export const RemediationStatus = {
  PENDING: 'PENDING',     // Awaiting approval
  APPROVED: 'APPROVED',   // Human approved
  EXECUTING: 'EXECUTING', // In progress
  SUCCESS: 'SUCCESS',     // Completed successfully
  FAILED: 'FAILED',       // Execution failed
  DENIED: 'DENIED',       // Human denied
};
