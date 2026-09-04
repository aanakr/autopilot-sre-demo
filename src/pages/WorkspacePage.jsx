import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Crosshair } from 'lucide-react';
import ExecutionTree from '../components/workspace/ExecutionTree';
import CausalProofCanvas from '../components/workspace/CausalProofCanvas';
import RemediationDiffPanel from '../components/workspace/RemediationDiffPanel';
import KnowledgeInjectionPanel from '../components/workspace/KnowledgeInjectionPanel';
import VetoPanel from '../components/workspace/VetoPanel';
import ApprovalFooter from '../components/workspace/ApprovalFooter';
import IncidentSwitcher from '../components/workspace/IncidentSwitcher';
import MttrStopwatch from '../components/workspace/MttrStopwatch';
import ExecutionTerminal from '../components/execution/ExecutionTerminal';
import ValidationCountdown from '../components/execution/ValidationCountdown';
import RlhfBanner from '../components/execution/RlhfBanner';
import { getScenarioByIncidentId } from '../utils/scenarios';
import { useAutopilot } from '../context/AutopilotContext';

const WorkspacePage = () => {
  const { incidentId } = useParams();
  const navigate = useNavigate();
  const scenario = getScenarioByIncidentId(incidentId);
  const { setActiveScenarioId } = useAutopilot();

  const [autoMonitor, setAutoMonitor] = useState(true);
  const [recalculated, setRecalculated] = useState(false);
  const [vetoed, setVetoed] = useState(false);
  const [approved, setApproved] = useState(false);
  const [validationComplete, setValidationComplete] = useState(false);

  useEffect(() => {
    setActiveScenarioId(scenario.id);
    setRecalculated(false);
    setVetoed(false);
    setApproved(false);
    setValidationComplete(false);
  }, [scenario.id, setActiveScenarioId]);

  const usingRecalculated = recalculated && scenario.recalculated;
  const causalGraph = usingRecalculated ? scenario.recalculated.causalGraph : scenario.causalGraph;
  const remediation = usingRecalculated ? scenario.recalculated.remediation : scenario.remediation;
  const execution = usingRecalculated ? scenario.recalculated.execution : scenario.execution;
  const validation = usingRecalculated ? scenario.recalculated.validation : scenario.validation;
  const rlhf = usingRecalculated ? scenario.recalculated.rlhf : scenario.rlhf;

  const recommendedOption = remediation?.options?.find((o) => o.recommended) ?? remediation?.options?.[0];
  const canApprove = !remediation?.readOnly && !!recommendedOption && !vetoed;

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] -mx-4 -my-8">
      <div className="px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-white">
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wide">SRE Coach Workspace</p>
          <h1 className="text-lg font-bold text-slate-900">
            {scenario.incidentId}: {scenario.entity}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <IncidentSwitcher activeIncidentId={scenario.incidentId} />
          <div className="inline-flex items-center gap-1.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-700">
            <Crosshair className="w-3.5 h-3.5 text-red-500" />
            Blast Radius: <span className="text-slate-900">{scenario.blastRadius}</span>
          </div>
          <MttrStopwatch detectedMinutesAgo={scenario.detectedMinutesAgo} />
        </div>
      </div>

      {!approved ? (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] divide-y lg:divide-y-0 lg:divide-x divide-slate-200 bg-white">
          <div className="bg-slate-50/50">
            <ExecutionTree steps={scenario.investigationTree} />
          </div>
          <div className="bg-white">
            <CausalProofCanvas graph={causalGraph} />
          </div>
          <div className="bg-slate-50/50">
            {remediation?.readOnly ? (
              scenario.knowledgeInjection ? (
                <div className="p-4">
                  <KnowledgeInjectionPanel
                    message={remediation.message}
                    knowledgeInjection={scenario.knowledgeInjection}
                    onRecalculate={() => setRecalculated(true)}
                  />
                </div>
              ) : (
                <div className="p-4">
                  <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-slate-700">{remediation.message}</p>
                  </div>
                </div>
              )
            ) : (
              <>
                <RemediationDiffPanel
                  dataDictionary={scenario.dataDictionary}
                  diff={remediation.diff}
                  options={remediation.options}
                  selectedOptionId={recommendedOption?.id}
                />
                {scenario.veto && (
                  <div className="px-4 pb-4">
                    <VetoPanel veto={scenario.veto} onVeto={() => setVetoed(true)} />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 max-w-3xl mx-auto w-full space-y-6 p-6 bg-white">
          <ExecutionTerminal execution={execution} />
          <ValidationCountdown validation={validation} onComplete={() => setValidationComplete(true)} />
          {validationComplete && <RlhfBanner rlhf={rlhf} />}
        </div>
      )}

      <ApprovalFooter
        optionLabel={recommendedOption?.label}
        onApprove={() => setApproved(true)}
        onAbort={() => navigate('/autopilot/ground-truth')}
        autoMonitor={autoMonitor}
        onAutoMonitorChange={setAutoMonitor}
        disabled={!canApprove}
        approved={approved}
      />
    </div>
  );
};

export default WorkspacePage;
