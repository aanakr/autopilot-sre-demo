import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ExecutionTree from '../components/workspace/ExecutionTree';
import CausalProofCanvas from '../components/workspace/CausalProofCanvas';
import RemediationDiffPanel from '../components/workspace/RemediationDiffPanel';
import ApprovalFooter from '../components/workspace/ApprovalFooter';
import { incidents } from '../utils/mockData';

const WorkspacePage = () => {
  const { incidentId } = useParams();
  const navigate = useNavigate();
  const incident = incidents[incidentId] ?? incidents['INC-8472'];
  const [autoMonitor, setAutoMonitor] = useState(true);

  const recommendedOption =
    incident.remediationOptions.find((o) => o.recommended) ?? incident.remediationOptions[0];

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] -mx-4 -my-8">
      <div className="px-6 py-4 border-b border-obsidian-600">
        <p className="text-xs text-muted uppercase tracking-wide">Autopilot Workspace</p>
        <h1 className="text-lg font-bold text-gray-100">
          {incident.id}: {incident.entity}
        </h1>
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
