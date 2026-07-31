import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Crosshair } from 'lucide-react';
import ExecutionTree from '../components/workspace/ExecutionTree';
import CausalProofCanvas from '../components/workspace/CausalProofCanvas';
import RemediationDiffPanel from '../components/workspace/RemediationDiffPanel';
import ApprovalFooter from '../components/workspace/ApprovalFooter';
import IncidentSwitcher from '../components/workspace/IncidentSwitcher';
import MttrStopwatch from '../components/workspace/MttrStopwatch';
import { incidents } from '../utils/mockData';
import { useAutopilot } from '../context/AutopilotContext';

const WorkspacePage = () => {
  const { incidentId } = useParams();
  const navigate = useNavigate();
  const incident = incidents[incidentId] ?? incidents['INC-8472'];
  const [autoMonitor, setAutoMonitor] = useState(true);
  const { setActiveIncidentId } = useAutopilot();

  useEffect(() => {
    setActiveIncidentId(incident.id);
  }, [incident.id, setActiveIncidentId]);

  const recommendedOption =
    incident.remediationOptions.find((o) => o.recommended) ?? incident.remediationOptions[0];

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] -mx-4 -my-8">
      <div className="px-6 py-4 border-b border-obsidian-600 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs text-muted uppercase tracking-wide">Autopilot Workspace</p>
          <h1 className="text-lg font-bold text-gray-100">
            {incident.id}: {incident.entity}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <IncidentSwitcher activeIncidentId={incident.id} />
          <div className="inline-flex items-center gap-1.5 text-xs font-mono bg-obsidian-900 border border-obsidian-600 rounded px-2 py-1 text-gray-300">
            <Crosshair className="w-3.5 h-3.5 text-danger" />
            Blast Radius: <span className="text-gray-100">{incident.blastRadius}</span>
          </div>
          <MttrStopwatch detectedMinutesAgo={incident.detectedMinutesAgo} />
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] divide-y lg:divide-y-0 lg:divide-x divide-obsidian-600">
        <div className="bg-obsidian-800/50">
          <ExecutionTree steps={incident.executionTree} />
        </div>
        <div className="bg-obsidian-900/50">
          <CausalProofCanvas chain={incident.causalChain} />
        </div>
        <div className="bg-obsidian-800/50">
          <RemediationDiffPanel
            diff={incident.remediationDiff}
            options={incident.remediationOptions}
            autoMonitor={autoMonitor}
            onAutoMonitorChange={setAutoMonitor}
            selectedOptionId={recommendedOption.id}
          />
        </div>
      </div>

      <ApprovalFooter
        optionLabel={recommendedOption.label}
        onApprove={() => navigate(`/autopilot/workspace/${incident.id}/execution`)}
        onAbort={() => navigate(`/autopilot/thread/${incident.id}`)}
      />
    </div>
  );
};

export default WorkspacePage;
