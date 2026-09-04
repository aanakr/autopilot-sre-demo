import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAutopilot } from '../../context/AutopilotContext';
import { scenarioList } from '../../utils/scenarios';

const PresenterControlBar = () => {
  const [collapsed, setCollapsed] = useState(true);
  const { activeScenarioId, setActiveScenarioId } = useAutopilot();
  const location = useLocation();
  const navigate = useNavigate();
  const hash = location.hash.replace('#', '') || location.pathname;
  const onWorkspace = hash.startsWith('/autopilot/workspace');

  const handleSelect = (scenario) => {
    setActiveScenarioId(scenario.id);
    if (onWorkspace) {
      navigate(scenario.hasWorkspace ? `/autopilot/workspace/${scenario.incidentId}` : '/autopilot/ground-truth');
    }
  };

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 flex items-start gap-0">
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="bg-white border border-slate-200 rounded-l-lg shadow-panel p-2 text-slate-400 hover:text-slate-700 -mr-px"
        title={collapsed ? 'Expand presenter controls' : 'Collapse presenter controls'}
      >
        {collapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>
      {!collapsed && (
        <div className="bg-white border border-slate-200 rounded-lg shadow-panel p-3 w-64">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 px-1">
            <Sparkles className="w-3.5 h-3.5 text-cyan-500" /> Presenter Controls
          </div>
          <div className="space-y-1.5">
            {scenarioList.map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => handleSelect(scenario)}
                className={`w-full text-left px-3 py-2 rounded-md border text-xs transition-colors ${
                  activeScenarioId === scenario.id
                    ? 'border-cyan-400 bg-cyan-50 text-cyan-800'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span className="font-mono text-slate-400 mr-1.5">{scenario.id}</span>
                <span className="font-semibold">{scenario.shortLabel}</span>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{scenario.entity}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PresenterControlBar;
