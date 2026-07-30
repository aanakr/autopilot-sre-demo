import { Search, FileText, BarChart3, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ICONS = { Search, FileText, BarChart3, RefreshCw };

const ACTION_ROUTES = {
  schema: '/autopilot/thread/INC-8472',
  runbooks: '/autopilot/knowledge',
  roi: '/autopilot/knowledge',
  handoff: '/autopilot/memory/checkout-service',
};

const SuggestedActionGrid = ({ actions }) => {
  const navigate = useNavigate();

  return (
    <div>
      <h3 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">Suggested Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {actions.map((action) => {
          const Icon = ICONS[action.icon] ?? FileText;
          return (
            <button
              key={action.id}
              onClick={() => navigate(ACTION_ROUTES[action.id] ?? '/autopilot/home')}
              className="card-hover text-left flex items-center gap-3 py-4"
            >
              <Icon className="w-5 h-5 text-electric-cyan flex-shrink-0" />
              <span className="text-sm text-gray-300">{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SuggestedActionGrid;
