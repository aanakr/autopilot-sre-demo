import { PartyPopper } from 'lucide-react';

const RlhfBanner = ({ rlhf }) => (
  <div className="card border-electric-green/40 bg-electric-green/5">
    <div className="flex items-center gap-2 mb-2">
      <PartyPopper className="w-5 h-5 text-electric-green" />
      <h3 className="font-semibold text-gray-100">Recursive Learning Success</h3>
    </div>
    <p className="text-sm text-gray-300">
      Action Complete. SLOs stabilized. Verified outcome logged to Substrate.
    </p>
    <p className="text-sm font-mono text-electric-green mt-2">
      Substrate RLHF Engine issued +{rlhf.reward.toFixed(2)} reward. Causal Graph edge weight updated to{' '}
      {rlhf.updatedCausalEdgeWeight}.
    </p>
    <p className="text-xs text-muted mt-2">
      Logged as a Candidate Hypothesis — graduates to the global Pattern Corpus after a full 30-day SLO re-grade.
    </p>
  </div>
);

export default RlhfBanner;
