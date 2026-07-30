import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import BackButton from '../components/layout/BackButton';
import ShiftHandoffCard from '../components/memory/ShiftHandoffCard';
import MemoryFactsList from '../components/memory/MemoryFactsList';
import { useAutopilot } from '../context/AutopilotContext';
import { entityMemory } from '../utils/mockData';

const MemoryPage = () => {
  const { entityId } = useParams();
  const navigate = useNavigate();
  const { memoryFacts, addMemoryFact } = useAutopilot();
  const [exported, setExported] = useState(false);
  const memory = entityMemory[entityId] ?? entityMemory['checkout-service'];

  return (
    <div className="max-w-3xl space-y-6 border-t-2 border-knowledge-purple/40 pt-6 -mt-6">
      <BackButton onClick={() => navigate('/autopilot/knowledge')} label="Back to Knowledge" />

      <div>
        <h1 className="text-xl font-bold text-gray-100">
          Entity Operational Memory: {memory.entityId}
        </h1>
        <p className="text-sm text-muted mt-1">
          Last Updated: {memory.lastUpdatedUtc} by {memory.lastUpdatedBy} | Scope: {memory.scope}
        </p>
      </div>

      <ShiftHandoffCard memory={memory} />

      <MemoryFactsList facts={memoryFacts} onAddFact={addMemoryFact} />

      <div className="flex items-center gap-3">
        <button
          onClick={() => setExported(true)}
          className="bg-knowledge-emerald text-obsidian-900 px-4 py-2 rounded-md font-semibold hover:bg-knowledge-purple transition-colors flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" /> Export Shift Handoff Summary to Slack
        </button>
        {exported && (
          <span className="text-sm text-knowledge-emerald">Posted to #inc-checkout ✓</span>
        )}
      </div>
    </div>
  );
};

export default MemoryPage;
