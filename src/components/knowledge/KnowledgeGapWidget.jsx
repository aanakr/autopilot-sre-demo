import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Plug } from 'lucide-react';

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
          <div className="flex flex-wrap gap-3">
            <button className="btn-secondary text-sm flex items-center gap-2" disabled title="Not available in this MVP">
              <Plug className="w-3.5 h-3.5" /> Connect ServiceNow MCP Tool
            </button>
            <button
              onClick={() => navigate(`/autopilot/memory/checkout-service`)}
              className="bg-knowledge-purple text-obsidian-900 px-4 py-2 rounded-md font-semibold hover:bg-knowledge-emerald transition-colors text-sm"
            >
              ✏️ Supply Data In-Place
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeGapWidget;
