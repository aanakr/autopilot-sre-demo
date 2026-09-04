import { useState } from 'react';
import { ShieldAlert, Send, Lock } from 'lucide-react';

const VetoPanel = ({ veto, onVeto }) => {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [vetoed, setVetoed] = useState(false);
  const [auditLine, setAuditLine] = useState(null);

  const handleSubmit = () => {
    if (!reason) return;
    setVetoed(true);
    setAuditLine(veto.auditMessage(reason));
    onVeto?.(reason);
  };

  if (vetoed) {
    return (
      <div className="border-t border-slate-200 pt-4 mt-2 space-y-3">
        <div className="flex items-center justify-between text-sm rounded px-3 py-2 border border-red-200 bg-red-50">
          <span className="text-red-700 font-medium">Restart Container — VETOED</span>
          <span className="font-mono font-bold text-red-600">
            {veto.priorScore.toFixed(2)} ➔ {veto.decayedScore.toFixed(2)} <span className="text-xs">[DECAYED]</span>
          </span>
        </div>
        <div className="flex items-start gap-2 text-xs font-mono bg-slate-900 text-slate-100 rounded-md px-3 py-2">
          <Lock className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
          <span>{auditLine}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-slate-200 pt-4 mt-2">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="btn-danger w-full flex items-center justify-center gap-2 text-sm"
        >
          <ShieldAlert className="w-4 h-4" /> Reject Recommendation
        </button>
      ) : (
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Veto Reason</label>
          <select
            aria-label="Veto Reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full text-sm bg-white border border-slate-200 rounded-md px-3 py-2 text-slate-700 focus:outline-none focus:border-red-400"
          >
            <option value="">Select a reason...</option>
            {veto.reasons.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <button
            onClick={handleSubmit}
            disabled={!reason}
            className="btn-danger w-full flex items-center justify-center gap-2 text-sm"
          >
            <Send className="w-3.5 h-3.5" /> Submit Veto
          </button>
        </div>
      )}
    </div>
  );
};

export default VetoPanel;
