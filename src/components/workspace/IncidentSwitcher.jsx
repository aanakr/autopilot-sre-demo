import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { incidents } from '../../utils/mockData';

const IncidentSwitcher = ({ activeIncidentId }) => {
  const navigate = useNavigate();
  const options = Object.values(incidents);

  return (
    <div className="relative inline-flex items-center gap-1.5 text-xs font-mono bg-obsidian-900 border border-obsidian-600 rounded px-2 py-1">
      <span className="text-muted">Incident:</span>
      <select
        value={activeIncidentId}
        onChange={(e) => navigate(`/autopilot/workspace/${e.target.value}`)}
        className="bg-transparent text-electric-cyan focus:outline-none appearance-none pr-4"
      >
        {options.map((incident) => (
          <option key={incident.id} value={incident.id} className="bg-obsidian-800 text-gray-200">
            {incident.id} — {incident.entity}
          </option>
        ))}
      </select>
      <ChevronDown className="w-3 h-3 text-muted pointer-events-none -ml-4" />
    </div>
  );
};

export default IncidentSwitcher;
