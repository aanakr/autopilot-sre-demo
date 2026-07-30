import { PlayCircle, Pencil, XCircle } from 'lucide-react';

const ApprovalFooter = ({ optionLabel, onApprove, onAbort }) => (
  <div className="sticky bottom-0 bg-obsidian-800 border-t border-obsidian-600 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
    <div className="flex flex-wrap gap-3">
      <button onClick={onApprove} className="btn-primary flex items-center gap-2">
        <PlayCircle className="w-4 h-4" /> Approve & Execute: {optionLabel}
      </button>
      <button className="btn-secondary flex items-center gap-2" disabled title="Not available in this MVP">
        <Pencil className="w-4 h-4" /> Modify Script
      </button>
      <button onClick={onAbort} className="btn-danger flex items-center gap-2">
        <XCircle className="w-4 h-4" /> Abort Action
      </button>
    </div>
  </div>
);

export default ApprovalFooter;
