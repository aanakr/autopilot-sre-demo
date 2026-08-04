import { useState } from 'react';
import { Package } from 'lucide-react';

const TABS = ['quickstart', 'proofs', 'eval'];

const GroundTruthSdkCard = ({ sdk }) => {
  const [tab, setTab] = useState('quickstart');

  return (
    <div className="card">
      <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
        <div>
          <h3 className="font-semibold text-gray-100 flex items-center gap-2">
            <Package className="w-4 h-4 text-electric-cyan" /> Ground Truth SDK (draft)
          </h3>
          <p className="text-xs text-muted mt-1">
            Agent-grade APIs for proofs, coverage ranking, and replay evaluation.
          </p>
        </div>
        <span className="text-[10px] font-mono bg-obsidian-900 border border-obsidian-600 text-gray-300 px-2 py-1 rounded flex-shrink-0">
          @newrelic/ground-truth-sdk
        </span>
      </div>

      <div className="flex items-center gap-1 mb-2">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`text-xs font-semibold px-3 py-1 rounded-md transition-colors ${
              tab === t ? 'bg-electric-cyan/10 text-electric-cyan' : 'text-muted hover:text-gray-200'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <pre className="text-xs font-mono text-gray-300 bg-obsidian-900 border border-obsidian-600 rounded-lg p-3 overflow-x-auto whitespace-pre">
        {sdk[tab]}
      </pre>
    </div>
  );
};

export default GroundTruthSdkCard;
