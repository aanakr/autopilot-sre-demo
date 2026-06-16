import { Zap, Clock, TrendingUp } from 'lucide-react';

/**
 * RecommendationsCard Component
 *
 * Displays prioritized recommendations with:
 * - Confidence scores (RLHF-derived)
 * - Cost of inaction
 * - Estimated duration
 */
const RecommendationsCard = ({ recommendations, onApprove }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'IMMEDIATE':
        return 'border-danger text-danger';
      case 'SECONDARY':
        return 'border-warning text-warning';
      case 'OPTIONAL':
        return 'border-electric-cyan text-electric-cyan';
      default:
        return 'border-muted text-muted';
    }
  };

  const formatConfidence = (score) => {
    return (score * 100).toFixed(0) + '%';
  };

  return (
    <div className="card mb-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Zap className="w-5 h-5 text-warning" />
        Recommended Actions
      </h3>

      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <div
            key={rec.id}
            className={`p-4 rounded-lg border-2 bg-obsidian-700/50 ${getPriorityColor(rec.priority)}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-semibold text-muted">#{index + 1}</span>
                  <h4 className="font-semibold text-lg">{rec.title}</h4>
                </div>
                <p className="text-sm text-gray-400 mb-3">{rec.description}</p>

                {/* Metrics Row */}
                <div className="flex flex-wrap gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span className="text-muted">Confidence:</span>
                    <span className="confidence-score">{formatConfidence(rec.confidence)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-muted" />
                    <span className="text-muted">Duration:</span>
                    <span className="text-gray-300">{rec.estimatedDuration}</span>
                  </div>
                  {rec.costOfInaction && (
                    <div className="flex items-center gap-1">
                      <span className="text-danger font-semibold">⚠️ Cost of inaction:</span>
                      <span className="text-gray-300">{rec.costOfInaction}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              {onApprove && (
                <button
                  onClick={() => onApprove(rec.id)}
                  className="btn-primary ml-4 whitespace-nowrap"
                >
                  Approve
                </button>
              )}
            </div>

            {/* Priority Badge */}
            <div className="flex items-center gap-2 mt-2">
              <span className={`px-2 py-1 rounded text-xs font-semibold border ${getPriorityColor(rec.priority)}`}>
                {rec.priority}
              </span>
              <span className="text-xs text-muted">Impact: {rec.impact}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationsCard;
