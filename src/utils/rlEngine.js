/**
 * Substrate RL / Evaluation Engine
 *
 * Pure-function port of EVALUATION_AND_RL.md: the Causal Graph's edge weights
 * are not asserted, they're computed from post-remediation telemetry via a
 * Temporal Difference (Q-learning) update, gated by a confidence/impact score
 * pair that also decides whether a decision tree needs re-evaluation.
 */

const clamp01 = (n) => Math.min(1, Math.max(0, n));

const IMPACT_THRESHOLD = 0.65;
const LEARNING_RATE = 0.15;
const DISCOUNT_FACTOR = 0.9;
const MAX_TIME_WINDOW_MINUTES = 60;

// α, β, γ weights for the Confidence Score (C_k)
const CONFIDENCE_WEIGHTS = { granger: 0.5, ragSimilarity: 0.3, temporalProximity: 0.2 };

// λ₁, λ₂, λ₃ weights for the Impact Score (I_change)
const IMPACT_WEIGHTS = { sloDelta: 0.4, klDivergence: 0.4, implicitAction: 0.2 };

// Reward table (R_remediation) by validation checkpoint
const REWARD_TABLE = {
  '5m': { pass: 1.0, fail: -0.8 },
  '30m': { pass: 0.5, fail: -0.4 },
  '2d': { pass: 0.8, fail: -0.2 },
};

/**
 * Confidence score for a candidate root-cause hypothesis.
 * C_k = α·Granger + β·RAG_similarity + γ·(1 - |Δt_deploy| / T_max)
 */
export function calculateConfidenceScore({ grangerScore, ragSimilarity, timeDeltaMinutes }) {
  const temporalProximity = Math.max(0, 1 - Math.abs(timeDeltaMinutes) / MAX_TIME_WINDOW_MINUTES);
  const score =
    CONFIDENCE_WEIGHTS.granger * grangerScore +
    CONFIDENCE_WEIGHTS.ragSimilarity * ragSimilarity +
    CONFIDENCE_WEIGHTS.temporalProximity * temporalProximity;
  return clamp01(parseFloat(score.toFixed(2)));
}

/**
 * Impact score for freshly ingested telemetry/feedback — decides whether a
 * decision tree needs dynamic re-evaluation.
 * I_change = λ₁·|ΔSLO_p95| + λ₂·D_KL(prior‖posterior) + λ₃·U_implicit
 */
export function calculateImpactScore({ sloTargetMs, currentP95Ms, klDivergence, hasImplicitAction }) {
  const sloDelta = Math.abs(currentP95Ms - sloTargetMs) / sloTargetMs;
  const implicitVal = hasImplicitAction ? 1.0 : 0.0;
  const impactScore =
    IMPACT_WEIGHTS.sloDelta * sloDelta +
    IMPACT_WEIGHTS.klDivergence * klDivergence +
    IMPACT_WEIGHTS.implicitAction * implicitVal;
  return parseFloat(impactScore.toFixed(3));
}

/**
 * Updates a Causal Graph edge weight from post-remediation system health,
 * via a Temporal Difference Q-learning formulation.
 * w_ij(t+1) = w_ij(t) + η·[R_remediation + δ·max_a Q(s', a) − w_ij(t)]
 */
export function updateEdgeWeight({ currentWeight, validationWindow, sloStabilized, errorRate }) {
  const table = REWARD_TABLE[validationWindow];
  const reward =
    validationWindow === '5m'
      ? sloStabilized && errorRate < 0.0001 ? table.pass : table.fail
      : sloStabilized
        ? table.pass
        : table.fail;

  const maxFutureQ = sloStabilized ? 0.95 : 0.1;
  const newWeight = currentWeight + LEARNING_RATE * (reward + DISCOUNT_FACTOR * maxFutureQ - currentWeight);

  return {
    newWeight: Math.min(0.99, Math.max(0.01, parseFloat(newWeight.toFixed(2)))),
    reward,
  };
}

/**
 * Whether fresh signals warrant an immediate re-evaluation of the active
 * decision tree — either an explicit user request, or the impact score
 * crossing the sensitivity threshold τ.
 */
export function shouldTriggerReevaluation({ impactScore, isExplicitRequest }) {
  if (isExplicitRequest) return true;
  return impactScore >= IMPACT_THRESHOLD;
}

export const RL_ENGINE_CONSTANTS = {
  IMPACT_THRESHOLD,
  LEARNING_RATE,
  DISCOUNT_FACTOR,
};
