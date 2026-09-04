import { useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useAutopilot } from '../../context/AutopilotContext';
import { getScenario } from '../../utils/scenarios';

const BreadcrumbRibbon = () => {
  const location = useLocation();
  const { account, activeScenarioId } = useAutopilot();
  const hash = location.hash.replace('#', '') || location.pathname;
  const scenario = getScenario(activeScenarioId);

  const onWorkspace = hash.startsWith('/autopilot/workspace');
  const trail = ['Accounts', account.name, 'Autopilot'];
  if (onWorkspace && scenario.hasWorkspace) {
    trail.push(scenario.incidentId);
  } else {
    trail.push('Knowledge Gap Map');
  }

  return (
    <div className="bg-slate-50 border-b border-slate-200 px-4 py-1.5">
      <div className="container mx-auto flex items-center gap-1.5 text-xs text-slate-500">
        {trail.map((crumb, i) => (
          <span key={crumb} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="w-3 h-3 text-slate-300" />}
            <span className={i === trail.length - 1 ? 'text-slate-700 font-medium' : ''}>{crumb}</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default BreadcrumbRibbon;
