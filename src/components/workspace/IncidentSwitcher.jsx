import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { workspaceScenarios } from '../../utils/scenarios';

const IncidentSwitcher = ({ activeIncidentId }) => {
  const navigate = useNavigate();

  return (
    <div className="relative inline-flex items-center gap-1.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded px-2 py-1">
      <span className="text-slate-400">Incident:</span>
      <select
        value={activeIncidentId}
        onChange={(e) => navigate(`/autopilot/workspace/${e.target.value}`)}
        className="bg-transparent text-cyan-700 focus:outline-none appearance-none pr-4"
      >
        {workspaceScenarios.map((scenario) => (
          <option key={scenario.incidentId} value={scenario.incidentId} className="bg-white text-slate-700">
            {scenario.incidentId} — {scenario.entity}
          </option>
        ))}
      </select>
      <ChevronDown className="w-3 h-3 text-slate-400 pointer-events-none -ml-4" />
    </div>
  );
};

export default IncidentSwitcher;
