import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, RefreshCw } from 'lucide-react';

const EntityMemoryPreviewCard = ({ memory }) => {
  const navigate = useNavigate();
  const [exported, setExported] = useState(false);
  const topHypotheses = memory.eliminatedHypotheses.slice(0, 2);

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-3">
        <Brain className="w-4 h-4 text-knowledge-purple" />
        <h3 className="font-semibold text-gray-100">
          {memory.entityId}: Preserved State & Ruled-Out Hypotheses
        </h3>
      </div>
      <ul className="space-y-1.5 mb-4">
        {topHypotheses.map((h, i) => (
          <li key={h.title} className="text-sm text-gray-300">
            • Rule-Out {i + 1} ({h.title}) — Tested at {h.testedAt}. Result: {h.result} Hypothesis Eliminated.
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => navigate(`/autopilot/memory/${memory.entityId}`)}
          className="bg-knowledge-purple text-obsidian-900 px-4 py-2 rounded-md font-semibold hover:bg-knowledge-emerald transition-colors text-sm"
        >
          Inspect Entity Operational Memory
        </button>
        <button
          onClick={() => setExported(true)}
          className="btn-secondary text-sm flex items-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Export Shift Handoff Summary to Slack
        </button>
        {exported && <span className="text-sm text-knowledge-emerald">Posted to #inc-checkout ✓</span>}
      </div>
    </div>
  );
};

export default EntityMemoryPreviewCard;
