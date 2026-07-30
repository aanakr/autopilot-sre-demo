import { Link, useLocation } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { useAutopilot } from '../../context/AutopilotContext';
import { incidents } from '../../utils/mockData';

const BreadcrumbRibbon = () => {
  const location = useLocation();
  const { activeIncidentId } = useAutopilot();
  const hash = location.hash.replace('#', '') || location.pathname;
  const incident = incidents[activeIncidentId];

  const onHome = hash === '/autopilot/home' || hash === '/';
  const onActiveThread = hash === `/autopilot/thread/${activeIncidentId}`;

  if (!incident || onHome || onActiveThread) return null;

  return (
    <div className="bg-obsidian-800/80 border-b border-obsidian-700 px-4 py-1.5">
      <div className="container mx-auto flex items-center gap-2 text-xs">
        <MapPin className="w-3.5 h-3.5 text-electric-cyan flex-shrink-0" />
        <span className="text-muted">Active Incident:</span>
        <Link
          to={`/autopilot/thread/${incident.id}`}
          className="text-electric-cyan hover:text-electric-green transition-colors font-medium"
        >
          {incident.id} — {incident.title}
        </Link>
      </div>
    </div>
  );
};

export default BreadcrumbRibbon;
