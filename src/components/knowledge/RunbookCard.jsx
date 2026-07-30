import { useState } from 'react';
import { FileText } from 'lucide-react';
import SlideOverDrawer from './SlideOverDrawer';

const RunbookCard = ({ runbook }) => {
  const [drawer, setDrawer] = useState(null); // 'retro' | 'history' | null

  return (
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
        Verified Fix: <span className="text-knowledge-emerald">{runbook.verifiedFix}</span>{' '}
        <span className="text-muted">
          (Success Rate: {Math.round(runbook.successRate * 100)}% across {runbook.executionCount} executions)
        </span>
      </p>
      <div className="flex flex-wrap gap-3 text-sm">
        <button
          onClick={() => setDrawer('retro')}
          className="text-knowledge-purple hover:text-knowledge-emerald transition-colors underline-offset-4 hover:underline"
        >
          View Full Retrospective
        </button>
        <button className="link" disabled title="Not available in this MVP">
          Edit Runbook Rules
        </button>
        <button
          onClick={() => setDrawer('history')}
          className="text-knowledge-purple hover:text-knowledge-emerald transition-colors underline-offset-4 hover:underline"
        >
          Audit Execution History
        </button>
      </div>

      <SlideOverDrawer open={drawer === 'retro'} title={`${runbook.id} — Full Retrospective`} onClose={() => setDrawer(null)}>
        <p className="text-sm text-gray-300 mb-5">{runbook.postmortem.summary}</p>
        <h4 className="text-xs font-semibold text-muted uppercase tracking-wide mb-3">Incident Timeline</h4>
        <ul className="space-y-3">
          {runbook.postmortem.timeline.map((step) => (
            <li key={step.time} className="text-sm">
              <span className="font-mono text-knowledge-purple">{step.time}</span>{' '}
              <span className="text-gray-300">{step.event}</span>
            </li>
          ))}
        </ul>
      </SlideOverDrawer>

      <SlideOverDrawer open={drawer === 'history'} title={`${runbook.id} — Execution History`} onClose={() => setDrawer(null)}>
        <div className="space-y-2">
          {runbook.executionHistory.map((entry) => (
            <div
              key={`${entry.incidentId}-${entry.date}`}
              className="text-sm bg-obsidian-900 border border-obsidian-600 rounded px-3 py-2"
            >
              <div className="flex items-center justify-between font-mono text-xs text-muted mb-1">
                <span>{entry.date}</span>
                <span>{entry.incidentId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span
                  className={entry.outcome === 'Success' ? 'text-knowledge-emerald' : 'text-warning'}
                >
                  {entry.outcome}
                </span>
                <span className="text-gray-400 font-mono text-xs">{entry.durationMs}ms</span>
              </div>
            </div>
          ))}
        </div>
      </SlideOverDrawer>
    </div>
  );
};

export default RunbookCard;
