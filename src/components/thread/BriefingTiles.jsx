import { Zap, Target, BarChart3, CheckCircle2, XCircle, Globe } from 'lucide-react';
import ProofCard from './ProofCard';

const BriefingTiles = ({ incident }) => {
  const { triggeringEvent, mitigation, evidence, patternCorpus } = incident;

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-4 h-4 text-danger" />
          <h3 className="font-semibold text-gray-100">{triggeringEvent.title}</h3>
        </div>
        <p className="text-sm text-gray-300">{triggeringEvent.description}</p>
      </div>

      <div className="card">
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-4 h-4 text-electric-green" />
          <h3 className="font-semibold text-gray-100">{mitigation.title}</h3>
        </div>
        <p className="text-sm text-gray-300 font-mono mb-3">
          Recommended Action: <span className="text-electric-green">{mitigation.action}</span>
        </p>
        <p className="text-xs text-muted mb-2">
          Citation: <span className="text-electric-cyan">{mitigation.citationMatchPercent}% Match</span> to Living
          Runbook {mitigation.citationRunbookId} ({mitigation.citationAge}).
        </p>
        <div className="flex flex-wrap gap-4 text-xs">
          <span className="flex items-center gap-1 text-gray-400">
            {mitigation.safety.reversible ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-electric-green" />
            ) : (
              <XCircle className="w-3.5 h-3.5 text-danger" />
            )}
            Reversible
          </span>
          <span className="flex items-center gap-1 text-gray-400">
            {!mitigation.safety.tableLock ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-electric-green" />
            ) : (
              <XCircle className="w-3.5 h-3.5 text-danger" />
            )}
            No table lock
          </span>
          <span className="text-gray-400">
            Estimated execution time: ~{mitigation.safety.estimatedMinutes} minutes
          </span>
        </div>

        {patternCorpus && (
          <div className="mt-3 pt-3 border-t border-obsidian-600 flex items-start gap-2 text-xs">
            <Globe className="w-3.5 h-3.5 text-electric-cyan flex-shrink-0 mt-0.5" />
            <p className="text-gray-400">
              <span className="text-electric-cyan">Pattern Corpus:</span> this failure signature has occurred at{' '}
              <span className="text-gray-200 font-mono">{patternCorpus.matchedAccounts}</span> other companies.{' '}
              <span className="text-muted">{patternCorpus.privacyNote}</span>
            </p>
          </div>
        )}
      </div>

      <div className="card">
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="w-4 h-4 text-electric-cyan" />
          <h3 className="font-semibold text-gray-100">Evidence & Proof Chain</h3>
        </div>
        <ProofCard evidence={evidence} />
      </div>
    </div>
  );
};

export default BriefingTiles;
