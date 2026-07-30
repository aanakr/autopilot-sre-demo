import { Shield, Brain, DollarSign, Clock } from 'lucide-react';

const formatUsd = (n) => `$${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;

const RoiWidget = ({ roi }) => (
  <div className="card space-y-3">
    <h3 className="font-semibold text-gray-100 mb-1">Substrate Moat & ROI Metrics</h3>
    <p className="text-sm text-gray-300 flex items-center gap-2">
      <Clock className="w-4 h-4 text-knowledge-emerald flex-shrink-0" />
      MTTR collapsed from <span className="text-knowledge-emerald font-mono">{roi.mttrBefore}</span> to a{' '}
      <span className="text-knowledge-emerald font-mono">{roi.mttrAfter}</span> causal triage | saves{' '}
      <span className="text-knowledge-emerald font-mono">{formatUsd(roi.downtimePreventedUsd)}/yr</span> in outage
      exposure
    </p>
    <p className="text-sm text-gray-300 flex items-center gap-2">
      <DollarSign className="w-4 h-4 text-knowledge-emerald flex-shrink-0" />
      Reclaims <span className="text-knowledge-emerald font-mono">{roi.sreCapacityReclaimedPercent}%</span> of SRE
      capacity from firefighting (
      <span className="text-knowledge-emerald font-mono">{formatUsd(roi.sreCapacityReclaimedUsd)}/yr</span>)
    </p>
    <p className="text-sm text-gray-300 flex items-center gap-2">
      <Shield className="w-4 h-4 text-knowledge-purple flex-shrink-0" />
      Substrate Intercepted <span className="text-knowledge-purple font-mono">{roi.nrqlErrorsIntercepted}</span>{' '}
      NRQL Syntax Errors via Data Dictionary
    </p>
    <p className="text-sm text-gray-300 flex items-center gap-2">
      <Brain className="w-4 h-4 text-knowledge-purple flex-shrink-0" />
      Causal Graph Prevented <span className="text-knowledge-purple font-mono">{roi.hallucinationsPrevented}</span>{' '}
      Hallucinations | RLHF Loop Strengthened{' '}
      <span className="text-knowledge-purple font-mono">{roi.resolutionPathsStrengthened}</span> Resolution Paths |{' '}
      <span className="text-knowledge-purple font-mono">{roi.incidentsResolvedAutonomously}</span> Incidents Resolved
      Autonomously
    </p>
  </div>
);

export default RoiWidget;
