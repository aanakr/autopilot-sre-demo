import { DollarSign, Shield, Brain, Clock } from 'lucide-react';

const RoiWidget = ({ roi }) => (
  <div className="card space-y-3">
    <h3 className="font-semibold text-gray-100 mb-1">Substrate Moat & ROI Metrics</h3>
    <p className="text-sm text-gray-300 flex items-center gap-2">
      <DollarSign className="w-4 h-4 text-knowledge-emerald flex-shrink-0" />
      <span className="text-knowledge-emerald font-mono">${roi.downtimeSavedUsd.toLocaleString()}</span> Downtime
      Saved
    </p>
    <p className="text-sm text-gray-300 flex items-center gap-2">
      <Shield className="w-4 h-4 text-knowledge-purple flex-shrink-0" />
      <span className="text-knowledge-purple font-mono">{roi.nrqlErrorsIntercepted}</span> NRQL Syntax Errors
      Intercepted
    </p>
    <p className="text-sm text-gray-300 flex items-center gap-2">
      <Brain className="w-4 h-4 text-knowledge-purple flex-shrink-0" />
      <span className="text-knowledge-purple font-mono">{roi.hallucinationsPrevented}</span> Hallucinations
      Prevented
    </p>
    <p className="text-sm text-gray-300 flex items-center gap-2">
      <Clock className="w-4 h-4 text-knowledge-emerald flex-shrink-0" />
      MTTR Reduced <span className="text-knowledge-emerald font-mono">{roi.mttrReductionPercent}%</span>
    </p>
  </div>
);

export default RoiWidget;
