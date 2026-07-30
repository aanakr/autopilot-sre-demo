import { Link, useLocation } from 'react-router-dom';
import { Activity, AlertTriangle, BookOpen, Settings, Search } from 'lucide-react';
import { useAutopilot } from '../../context/AutopilotContext';

const TABS = [
  { id: 'incidents', label: 'Active Incidents', icon: AlertTriangle, to: '/autopilot/home', badge: 1 },
  { id: 'knowledge', label: 'Organizational Knowledge', icon: BookOpen, to: '/autopilot/knowledge' },
  { id: 'configure', label: 'Configure Agent', icon: Settings, to: null },
];

const Header = () => {
  const location = useLocation();
  const { account, currentUser } = useAutopilot();
  const hash = location.hash.replace('#', '') || location.pathname;

  const isActive = (to) => to && (hash === to || hash.startsWith(to));

  return (
    <header className="bg-obsidian-800 border-b border-obsidian-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/autopilot/home" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Activity className="w-8 h-8 text-electric-green" />
            <div>
              <h1 className="text-xl font-bold text-gradient leading-tight">New Relic Autopilot</h1>
              <p className="text-xs text-muted leading-tight">Substrate-Powered SRE Agent</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-2 flex-1 max-w-md mx-8">
            <div className="flex items-center gap-2 w-full bg-obsidian-700 border border-obsidian-600 rounded-md px-3 py-1.5">
              <Search className="w-4 h-4 text-muted" />
              <span className="text-sm text-muted">Search...</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <span className="text-muted hidden sm:inline">Account:</span>
            <span className="font-medium text-gray-200 hidden sm:inline">{account.name}</span>
            <div className="flex items-center gap-2 pl-4 border-l border-obsidian-600">
              <div className="w-2 h-2 rounded-full bg-electric-green animate-pulse-slow" />
              <span className="text-gray-200 font-medium">
                {currentUser.name} <span className="text-muted">({currentUser.role})</span>
              </span>
            </div>
          </div>
        </div>

        <nav className="flex items-center gap-1 h-11 -mb-px">
          {TABS.map(({ id, label, icon: Icon, to, badge }) => {
            const active = isActive(to);
            const className = `flex items-center gap-2 px-4 h-full text-sm font-medium border-b-2 transition-colors ${
              active
                ? 'border-electric-green text-electric-green'
                : 'border-transparent text-muted hover:text-gray-200'
            } ${!to ? 'cursor-default opacity-60' : ''}`;

            const content = (
              <>
                <Icon className="w-4 h-4" />
                {label}
                {badge != null && (
                  <span className="text-xs bg-obsidian-700 text-gray-300 rounded-full px-1.5 py-0.5">
                    {badge}
                  </span>
                )}
              </>
            );

            return to ? (
              <Link key={id} to={to} className={className}>
                {content}
              </Link>
            ) : (
              <span key={id} className={className} title="Not available in this MVP">
                {content}
              </span>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default Header;
