import { FileText } from 'lucide-react';

const RunbookCard = ({ runbook }) => (
  <div className="card">
    <div className="flex items-center gap-2 mb-2">
      <FileText className="w-4 h-4 text-warning" />
      <h3 className="font-semibold text-gray-100">
        📜 {runbook.id}: {runbook.title}
      </h3>
    </div>
    <p className="text-xs text-muted mb-3">
      Last invoked {runbook.lastInvoked} for {runbook.lastInvokedFor} (Match Confidence: {runbook.matchPercent}%)
    </p>
    <p className="text-sm text-gray-300 mb-2">{runbook.summary}</p>
    <p className="text-sm text-gray-300 mb-4">
      Verified Fix: <span className="text-electric-green">{runbook.verifiedFix}</span>{' '}
      <span className="text-muted">
        (Success Rate: {Math.round(runbook.successRate * 100)}% across {runbook.executionCount} executions)
      </span>
    </p>
    <div className="flex flex-wrap gap-3 text-sm">
      <button className="link">View Full Retrospective</button>
      <button className="link" disabled title="Not available in this MVP">Edit Runbook Rules</button>
      <button className="link" disabled title="Not available in this MVP">Audit Execution History</button>
    </div>
  </div>
);

export default RunbookCard;
