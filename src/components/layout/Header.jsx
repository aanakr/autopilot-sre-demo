import { Link, useLocation } from 'react-router-dom';
import { Activity, LayoutGrid, Crosshair, ChevronDown, Settings } from 'lucide-react';
import { useAutopilot } from '../../context/AutopilotContext';
import { getScenario } from '../../utils/scenarios';

const Header = () => {
  const location = useLocation();
  const { account, currentUser, activeScenarioId } = useAutopilot();
  const hash = location.hash.replace('#', '') || location.pathname;
  const scenario = getScenario(activeScenarioId);

  const tabs = [
    {
      id: 'ground-truth',
      label: 'Substrate Ground Truth Matrix',
      icon: LayoutGrid,
      to: '/autopilot/ground-truth',
      isActive: hash.startsWith('/autopilot/ground-truth'),
    },
    scenario.hasWorkspace && {
      id: 'workspace',
      label: `Coach UI — ${scenario.incidentId}`,
      icon: Crosshair,
      to: `/autopilot/workspace/${scenario.incidentId}`,
      isActive: hash.startsWith('/autopilot/workspace'),
    },
  ].filter(Boolean);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/autopilot/ground-truth" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Activity className="w-8 h-8 text-emerald-500" />
            <div>
              <h1 className="text-xl font-bold text-gradient leading-tight">New Relic Autopilot</h1>
              <p className="text-xs text-slate-500 leading-tight">Substrate-Powered SRE Agent</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1.5 text-xs font-mono bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full px-3 py-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-slow" />
            Substrate Context: Active | Guardrails: {account.guardrails}
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="hidden sm:flex items-center gap-1 text-slate-600 border border-slate-200 rounded-md px-2.5 py-1.5 cursor-default" title="Account selector (single account in this MVP)">
              <span className="text-slate-400">Account:</span>
              <span className="font-medium text-slate-800">{account.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="flex items-center gap-2 pl-4 border-l border-slate-200">
              <div className="w-7 h-7 rounded-full bg-cyan-500 text-white text-xs font-semibold flex items-center justify-center">
                {currentUser.name[0]}
              </div>
              <span className="text-slate-800 font-medium">
                {currentUser.name} <span className="text-slate-400">({currentUser.role})</span>
              </span>
            </div>
          </div>
        </div>

        <nav className="flex items-center justify-between h-11 -mb-px border-t border-slate-100">
          <div className="flex items-center gap-1">
            {tabs.map(({ id, label, icon: Icon, to, isActive }) => (
              <Link
                key={id}
                to={to}
                className={`flex items-center gap-2 px-4 h-11 text-sm font-medium border-b-2 transition-colors ${
                  isActive
                    ? 'border-cyan-500 text-cyan-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </div>
          <span
            className="flex items-center gap-2 px-4 h-11 text-sm font-medium text-slate-400 cursor-default"
            title="Not available in this MVP"
          >
            <Settings className="w-4 h-4" /> Configure Agent
          </span>
        </nav>
      </div>
    </header>
  );
};

export default Header;
