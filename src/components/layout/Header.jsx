import { Link, useLocation } from 'react-router-dom';
import { Activity } from 'lucide-react';

/**
 * Header Component
 *
 * Persistent navigation header with New Relic branding
 * Shows breadcrumb navigation based on current route
 */
const Header = () => {
  const location = useLocation();

  // Generate breadcrumb from current path
  const generateBreadcrumb = () => {
    const path = location.pathname;
    const hash = location.hash.replace('#', '');

    if (hash === '/' || hash === '') {
      return 'Autopilot Home';
    }

    if (hash.startsWith('/investigate/')) {
      return 'Investigation';
    }

    if (hash.startsWith('/topology/')) {
      return 'Entity Topology';
    }

    if (hash.startsWith('/causal/')) {
      return 'Causal Graph';
    }

    if (hash.startsWith('/runbook/')) {
      return 'Runbook';
    }

    if (hash.startsWith('/corpus/')) {
      return 'Global Patterns';
    }

    return 'Autopilot';
  };

  return (
    <header className="bg-obsidian-800 border-b border-obsidian-600 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Activity className="w-8 h-8 text-electric-green" />
            <div>
              <h1 className="text-xl font-bold text-gradient">
                New Relic Autopilot
              </h1>
              <p className="text-xs text-muted">Substrate-Powered SRE Agent</p>
            </div>
          </Link>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-electric-cyan hover:text-electric-green transition-colors">
              Home
            </Link>
            {location.hash !== '#/' && location.hash !== '' && (
              <>
                <span className="text-muted">/</span>
                <span className="text-gray-300 font-medium">{generateBreadcrumb()}</span>
              </>
            )}
          </div>

          {/* Status Indicator */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-electric-green animate-pulse-slow"></div>
            <span className="text-xs text-muted">Agent Active</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
