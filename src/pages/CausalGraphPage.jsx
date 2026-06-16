import { useParams, useNavigate } from 'react-router-dom';
import BackButton from '../components/layout/BackButton';
import { primaryIncident } from '../utils/mockData';
import { GitBranch, TrendingUp, ChevronRight } from 'lucide-react';

/**
 * CausalGraphPage - Causal Graph with RLHF Scores
 *
 * Shows the "physics of failure" - step-by-step failure
 * propagation with Reinforcement Learning confidence scores
 */
const CausalGraphPage = () => {
  const { linkId } = useParams();
  const navigate = useNavigate();
  const causalGraph = primaryIncident.causalGraph;

  const formatConfidence = (score) => {
    return (score * 100).toFixed(0) + '%';
  };

  return (
    <div className="max-w-5xl mx-auto">
      <BackButton onClick={() => navigate('/investigate/INC-8472')} label="Back to Investigation" />

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <GitBranch className="w-8 h-8 text-electric-cyan" />
          <span className="text-gradient">Causal Graph</span>
        </h1>
        <p className="text-muted">
          Directional failure propagation with RLHF-derived confidence scores
        </p>
      </div>

      {/* What is RLHF? */}
      <div className="card mb-6 bg-electric-cyan/5 border-electric-cyan/20">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-electric-cyan" />
          Understanding Confidence Scores
        </h3>
        <p className="text-sm text-gray-300 mb-3">
          These confidence scores are <span className="text-electric-green font-semibold">not guesses</span>.
          They're derived from Reinforcement Learning with Human Feedback (RLHF) based on:
        </p>
        <ul className="text-sm text-muted space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-electric-green">•</span>
            Historical success rate of this exact remediation path
          </li>
          <li className="flex items-start gap-2">
            <span className="text-electric-green">•</span>
            Temporal correlation between events (time lag analysis)
          </li>
          <li className="flex items-start gap-2">
            <span className="text-electric-green">•</span>
            Similarity to past resolved incidents in your knowledge base
          </li>
          <li className="flex items-start gap-2">
            <span className="text-electric-green">•</span>
            Cross-customer pattern matching (anonymized global data)
          </li>
        </ul>
      </div>

      {/* Causal Chain Visualization */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold mb-6">Failure Propagation Chain</h3>

        <div className="space-y-6">
          {causalGraph.nodes.map((node, index) => {
            const edge = causalGraph.edges.find(e => e.source === node.id);
            const isHighConfidence = node.score >= 0.85;

            return (
              <div key={node.id}>
                {/* Node Card */}
                <div
                  className={`p-5 rounded-lg border-2 transition-all ${
                    isHighConfidence
                      ? 'border-electric-green bg-electric-green/10'
                      : 'border-electric-cyan bg-electric-cyan/5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-mono text-muted">Step {index + 1}</span>
                        <h4 className="font-semibold text-lg">{node.label}</h4>
                      </div>

                      {/* Confidence Score */}
                      <div className="flex items-center gap-2 mt-3">
                        <TrendingUp className="w-4 h-4 text-electric-green" />
                        <span className="text-sm text-muted">Confidence Score:</span>
                        <span className="confidence-score text-lg">{formatConfidence(node.score)}</span>
                      </div>
                    </div>

                    {/* Score Gauge */}
                    <div className="ml-6">
                      <div className="relative w-20 h-20">
                        <svg className="transform -rotate-90" viewBox="0 0 36 36">
                          <circle
                            cx="18"
                            cy="18"
                            r="16"
                            fill="none"
                            className="stroke-obsidian-600"
                            strokeWidth="3"
                          />
                          <circle
                            cx="18"
                            cy="18"
                            r="16"
                            fill="none"
                            className={isHighConfidence ? 'stroke-electric-green' : 'stroke-electric-cyan'}
                            strokeWidth="3"
                            strokeDasharray={`${node.score * 100}, 100`}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-mono font-bold">
                            {formatConfidence(node.score)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Edge Info (if exists) */}
                  {edge && (
                    <div className="mt-4 pt-4 border-t border-obsidian-600">
                      <p className="text-xs text-muted">
                        Causation Strength: <span className="confidence-score">{formatConfidence(edge.confidence)}</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Arrow to Next Step */}
                {index < causalGraph.nodes.length - 1 && (
                  <div className="flex justify-center my-4">
                    <div className="flex flex-col items-center">
                      <ChevronRight className="w-6 h-6 text-electric-cyan rotate-90" />
                      {edge && (
                        <span className="text-xs text-muted mt-1">
                          {formatConfidence(edge.confidence)}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Impact Summary */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Confidence Analysis</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-electric-green/10 rounded-lg border border-electric-green/30">
            <p className="text-2xl font-bold confidence-score mb-1">
              {formatConfidence(causalGraph.nodes[0]?.score || 0)}
            </p>
            <p className="text-xs text-muted">Root Cause Confidence</p>
          </div>
          <div className="p-4 bg-electric-cyan/10 rounded-lg border border-electric-cyan/30">
            <p className="text-2xl font-bold text-electric-cyan mb-1">
              {causalGraph.nodes.length}
            </p>
            <p className="text-xs text-muted">Steps in Chain</p>
          </div>
          <div className="p-4 bg-warning/10 rounded-lg border border-warning/30">
            <p className="text-2xl font-bold text-warning mb-1">
              {formatConfidence(causalGraph.edges[causalGraph.edges.length - 1]?.confidence || 0)}
            </p>
            <p className="text-xs text-muted">Final Impact Correlation</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CausalGraphPage;
