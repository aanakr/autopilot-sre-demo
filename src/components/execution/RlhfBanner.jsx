import { PartyPopper, CheckCircle2, Clock } from 'lucide-react';
import { updateEdgeWeight } from '../../utils/rlEngine';

const CHECKPOINTS = [
  { id: '5m', label: 'T+5 min', window: '5m' },
  { id: '30m', label: 'T+30 min', window: '30m' },
  { id: '2d', label: 'T+2 days', window: '2d' },
];

const RlhfBanner = ({ rlhf, validation }) => {
  const { newWeight, reward } = updateEdgeWeight({
    currentWeight: rlhf.priorEdgeWeight,
    validationWindow: '5m',
    sloStabilized: true,
    errorRate: validation.baselineErrorRate,
  });

  return (
    <div className="card border-electric-green/40 bg-electric-green/5">
      <div className="flex items-center gap-2 mb-2">
        <PartyPopper className="w-5 h-5 text-electric-green" />
        <h3 className="font-semibold text-gray-100">Recursive Learning Success</h3>
      </div>
      <p className="text-sm text-gray-300">
        Action Complete. SLOs stabilized. Verified outcome logged to Substrate.
      </p>
      <p className="text-sm font-mono text-electric-green mt-2">
        Substrate RLHF Engine issued +{reward.toFixed(2)} reward. Causal Graph edge (
        {rlhf.edgeLabel}) weight updated from {rlhf.priorEdgeWeight.toFixed(2)} to {newWeight.toFixed(2)}.
      </p>
      <p className="text-xs text-muted mt-2">
        Logged as a Candidate Hypothesis — graduates to the global Pattern Corpus after a full 30-day SLO re-grade.
      </p>

      <div className="mt-4 pt-4 border-t border-electric-green/20 flex flex-wrap items-center gap-4">
        {CHECKPOINTS.map((checkpoint) => (
          <div key={checkpoint.id} className="flex items-center gap-1.5 text-xs font-mono">
            {checkpoint.window === '5m' ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-electric-green" />
            ) : (
              <Clock className="w-3.5 h-3.5 text-muted" />
            )}
            <span className="text-gray-300">{checkpoint.label}:</span>
            <span className={checkpoint.window === '5m' ? 'text-electric-green' : 'text-muted'}>
              {checkpoint.window === '5m' ? 'Verified ✓' : 'Scheduled'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RlhfBanner;
