import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const AnalysisVersionSelector = ({ versions }) => {
  const [open, setOpen] = useState(false);
  const latest = versions[versions.length - 1];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 text-sm font-mono text-gray-300 hover:text-electric-cyan transition-colors"
      >
        Analysis {latest.version} ({latest.label})
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="mt-2 card space-y-3">
          <p className="text-xs font-semibold text-muted uppercase tracking-wide">
            Material Versioning & History
          </p>
          {versions.map((v, i) => {
            const isLatest = i === versions.length - 1;
            return (
              <div
                key={v.version}
                className={`text-sm rounded px-3 py-2 border ${
                  isLatest ? 'border-electric-green/40 bg-electric-green/5' : 'border-obsidian-600 bg-obsidian-900'
                }`}
              >
                <p className={`font-mono text-xs mb-1 ${isLatest ? 'text-electric-green' : 'text-muted'}`}>
                  {v.version} — {v.label}
                </p>
                <p className="text-xs text-gray-400">
                  Root Cause: <span className="text-gray-200">{v.rootCause}</span>
                </p>
                <p className="text-xs text-gray-400">
                  Mitigation: <span className="text-gray-200">{v.mitigation}</span>
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AnalysisVersionSelector;
