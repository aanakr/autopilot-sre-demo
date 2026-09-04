import { PartyPopper, CheckCircle2, Clock } from 'lucide-react';

const CHECKPOINTS = [
  { id: '5m', label: 'T+5 min' },
  { id: '30m', label: 'T+30 min' },
  { id: '2d', label: 'T+2 days' },
];

const RlhfBanner = ({ rlhf }) => (
  <div className="card border-emerald-200 bg-emerald-50">
    <div className="flex items-center gap-2 mb-2">
      <PartyPopper className="w-5 h-5 text-emerald-600" />
      <h3 className="font-semibold text-slate-800">Recursive Learning Success</h3>
    </div>
    <p className="text-sm text-slate-600">{rlhf.toastMessage}</p>
    <p className="text-sm font-mono text-emerald-700 mt-2">
      Causal Graph edge ({rlhf.edgeLabel}) weight updated from {rlhf.priorEdgeWeight.toFixed(2)} to{' '}
      {rlhf.newWeight.toFixed(2)}.
    </p>
    <p className="text-xs text-slate-400 mt-2">
      Logged as a Candidate Hypothesis — graduates to the global Pattern Corpus after a full 30-day SLO re-grade.
    </p>

    <div className="mt-4 pt-4 border-t border-emerald-200 flex flex-wrap items-center gap-4">
      {CHECKPOINTS.map((checkpoint, i) => (
        <div key={checkpoint.id} className="flex items-center gap-1.5 text-xs font-mono">
          {i === 0 ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          ) : (
            <Clock className="w-3.5 h-3.5 text-slate-400" />
          )}
          <span className="text-slate-600">{checkpoint.label}:</span>
          <span className={i === 0 ? 'text-emerald-600' : 'text-slate-400'}>
            {i === 0 ? 'Verified ✓' : 'Scheduled'}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default RlhfBanner;
