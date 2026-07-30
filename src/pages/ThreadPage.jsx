import { useParams, useNavigate } from 'react-router-dom';
import { Zap, PlayCircle, MessageCircle } from 'lucide-react';
import BackButton from '../components/layout/BackButton';
import SubstrateContextChip from '../components/layout/SubstrateContextChip';
import DataDictionaryTooltip from '../components/thread/DataDictionaryTooltip';
import BriefingTiles from '../components/thread/BriefingTiles';
import AnalysisVersionSelector from '../components/thread/AnalysisVersionSelector';
import { incidents } from '../utils/mockData';

const ThreadPage = () => {
  const { incidentId } = useParams();
  const navigate = useNavigate();
  const incident = incidents[incidentId] ?? incidents['INC-8472'];

  return (
    <div className="max-w-3xl space-y-6">
      <BackButton onClick={() => navigate('/autopilot/home')} label="Back to Home" />

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs text-muted uppercase tracking-wide mb-1">
            Incident #{incident.id}
          </p>
          <h1 className="text-xl font-bold text-gray-100">{incident.title}</h1>
        </div>
        <AnalysisVersionSelector versions={incident.analysisVersions} />
      </div>

      <SubstrateContextChip syncedWith="#inc-checkout Slack Channel (12s ago)" />

      <DataDictionaryTooltip dataDictionary={incident.dataDictionary} />

      <div className="card !p-0 overflow-hidden">
        <div className="px-6 py-3 border-b border-obsidian-600 text-sm font-semibold text-gray-200">
          🤖 Autopilot SRE Agent
        </div>
        <div className="p-6">
          <BriefingTiles incident={incident} />
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => navigate(`/autopilot/workspace/${incident.id}`)}
          className="btn-primary flex items-center gap-2"
        >
          <Zap className="w-4 h-4" /> Open Substrate Coach UI (3-Pane Workspace)
        </button>
        <button
          onClick={() => navigate(`/autopilot/workspace/${incident.id}/execution`)}
          className="btn-secondary flex items-center gap-2"
        >
          <PlayCircle className="w-4 h-4" /> Execute Mitigation Now
        </button>
        <button className="btn-secondary flex items-center gap-2" disabled title="Not available in this MVP">
          <MessageCircle className="w-4 h-4" /> Ask Follow-up
        </button>
      </div>
    </div>
  );
};

export default ThreadPage;
