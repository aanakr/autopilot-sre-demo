import { PlayCircle, Pencil, XCircle, Lock } from 'lucide-react';

const ApprovalFooter = ({ optionLabel, onApprove, onAbort, autoMonitor, onAutoMonitorChange, disabled, approved }) => (
  <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
    <div className="flex flex-wrap items-center gap-3">
      <button onClick={onApprove} disabled={disabled || approved} className="btn-primary flex items-center gap-2">
        <PlayCircle className="w-4 h-4" />
        {optionLabel ? `Approve & Execute: ${optionLabel}` : 'Approve & Execute'}
      </button>
      <button className="btn-secondary flex items-center gap-2" disabled title="Not available in this MVP">
        <Pencil className="w-4 h-4" /> Modify Script
      </button>
      <button onClick={onAbort} disabled={approved} className="btn-danger flex items-center gap-2">
        <XCircle className="w-4 h-4" /> Abort Action
      </button>
      <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer ml-2">
        <input
          type="checkbox"
          checked={autoMonitor}
          onChange={(e) => onAutoMonitorChange(e.target.checked)}
          className="w-4 h-4 rounded accent-emerald-500"
        />
        Auto-Monitor Rollback
      </label>
    </div>
    <button
      className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-600 transition-colors"
      disabled
      title="Not available in this MVP"
    >
      <Lock className="w-3.5 h-3.5" /> Immutable Audit Ledger
    </button>
  </div>
);

export default ApprovalFooter;
