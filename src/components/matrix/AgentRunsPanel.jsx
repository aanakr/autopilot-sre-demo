import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, ChevronLeft, ChevronRight, Zap, BookmarkPlus } from 'lucide-react';

const FILTERS = ['all', 'incidents', 'auto-fixed'];

const AgentRunsPanel = ({ runs, selectedRunId, onSelectRun, onClearSelection }) => {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [stepIndex, setStepIndex] = useState(0);
  const navigate = useNavigate();

  const selectedRun = runs.find((r) => r.id === selectedRunId);

  const filteredRuns = runs.filter((r) => {
    if (filter === 'incidents' && !r.incidentId) return false;
    if (filter === 'auto-fixed' && r.gapCount > 0) return false;
    return r.title.toLowerCase().includes(query.toLowerCase());
  });

  const handleSelect = (run) => {
    onSelectRun(run.id);
    setStepIndex(0);
  };

  if (selectedRun) {
    const hasDetail = Array.isArray(selectedRun.path);
    const step = hasDetail ? selectedRun.path[stepIndex] : null;

    return (
      <div className="card !p-0 overflow-hidden">
        <div className="px-4 py-3 border-b border-obsidian-600">
          <button
            onClick={() => {
              onClearSelection();
              setStepIndex(0);
            }}
            className="text-xs text-electric-cyan hover:text-electric-green flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to runs
          </button>
        </div>

        <div className="p-4 space-y-3">
          <div>
            <p className="text-sm font-semibold text-gray-100">{selectedRun.title}</p>
            <p className="text-xs text-muted mt-0.5">
              {selectedRun.stepsCount} steps · {selectedRun.servicesCount} services
              {selectedRun.gapCount > 0 && <span className="text-warning"> · {selectedRun.gapCount} gap hit</span>}
            </p>
          </div>

          {!hasDetail && (
            <p className="text-sm text-muted italic" title="Not available in this MVP">
              Step-by-step detail isn&apos;t recorded for this run in the current build.
            </p>
          )}

          {hasDetail && (
            <>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
                  disabled={stepIndex === 0}
                  className="text-muted hover:text-gray-200 disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono text-muted">
                  Step {stepIndex + 1}/{selectedRun.path.length}
                </span>
                <button
                  onClick={() => setStepIndex((i) => Math.min(selectedRun.path.length - 1, i + 1))}
                  disabled={stepIndex === selectedRun.path.length - 1}
                  className="text-muted hover:text-gray-200 disabled:opacity-30"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="w-full h-1 bg-obsidian-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-electric-cyan transition-all"
                  style={{ width: `${((stepIndex + 1) / selectedRun.path.length) * 100}%` }}
                />
              </div>

              <div
                className={`p-3 rounded-lg border text-xs font-mono ${
                  step.gap
                    ? 'border-danger/40 bg-danger/5'
                    : step.matched
                      ? 'border-electric-green/40 bg-electric-green/5'
                      : 'border-obsidian-600 bg-obsidian-900'
                }`}
              >
                <p className="text-gray-100 font-semibold mb-1">{step.action}</p>
                <p className="text-muted">{step.detail}</p>
              </div>

              <ol className="space-y-1 max-h-40 overflow-y-auto">
                {selectedRun.path.map((s, i) => (
                  <li key={s.action}>
                    <button
                      onClick={() => setStepIndex(i)}
                      className={`w-full text-left text-xs px-2 py-1 rounded transition-colors ${
                        i === stepIndex ? 'bg-electric-cyan/10 text-electric-cyan' : 'text-muted hover:text-gray-300'
                      }`}
                    >
                      {i + 1}. {s.action}
                    </button>
                  </li>
                ))}
              </ol>

              <div className="flex flex-col gap-2 pt-2 border-t border-obsidian-600">
                {selectedRun.incidentId && (
                  <button
                    onClick={() => navigate(`/autopilot/workspace/${selectedRun.incidentId}`)}
                    className="btn-primary text-sm flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4" /> Open in Coach UI
                  </button>
                )}
                <button
                  className="btn-secondary text-sm flex items-center justify-center gap-2"
                  disabled
                  title="Not available in this MVP"
                >
                  <BookmarkPlus className="w-4 h-4" /> Save as root cause
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="card !p-0 overflow-hidden">
      <div className="p-4 border-b border-obsidian-600 space-y-3">
        <h3 className="text-xs font-semibold text-muted uppercase tracking-wide">Agent Runs</h3>
        <div className="flex items-center gap-2 bg-obsidian-900 border border-obsidian-600 rounded-md px-3 py-1.5">
          <Search className="w-3.5 h-3.5 text-muted flex-shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search runs..."
            className="flex-1 bg-transparent text-sm text-gray-300 placeholder:text-muted focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                filter === f
                  ? 'border-electric-cyan text-electric-cyan bg-electric-cyan/10'
                  : 'border-obsidian-600 text-muted hover:text-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="divide-y divide-obsidian-600 overflow-y-auto max-h-[420px]">
        {filteredRuns.map((run) => (
          <button
            key={run.id}
            onClick={() => handleSelect(run)}
            className="w-full text-left px-4 py-3 hover:bg-obsidian-700/50 transition-colors"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-gray-100 font-medium">{run.title}</span>
              <span className="text-xs text-muted flex-shrink-0">{run.relativeTime}</span>
            </div>
            <p className="text-xs text-muted mt-1">
              {run.stepsCount} steps · {run.servicesCount} services
              {run.gapCount > 0 && <span className="text-warning"> · {run.gapCount} miss</span>}
            </p>
          </button>
        ))}
        {filteredRuns.length === 0 && <p className="text-sm text-muted p-4">No runs match &ldquo;{query}&rdquo;.</p>}
      </div>
    </div>
  );
};

export default AgentRunsPanel;
