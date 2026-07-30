import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

const KnowledgeGapWidget = ({ gap }) => {
  const navigate = useNavigate();

  return (
    <div className="card border-warning/40 bg-warning/5">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-xs text-warning uppercase tracking-wide font-semibold mb-1">
            Proactive Knowledge Gap
          </p>
          <p className="text-sm text-gray-300 mb-2">{gap.description}</p>
          <p className="text-xs text-muted mb-3">
            Impact Score: <span className="text-warning font-mono font-bold">{gap.impactScore}/10</span>
          </p>
          <button
            onClick={() => navigate(`/autopilot/memory/checkout-service`)}
            className="btn-secondary text-sm"
          >
            Supply Missing Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeGapWidget;
