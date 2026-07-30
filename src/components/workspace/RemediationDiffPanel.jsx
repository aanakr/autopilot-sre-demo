const RemediationDiffPanel = ({ diff, options, autoMonitor, onAutoMonitorChange, selectedOptionId }) => (
  <div className="p-4 space-y-6">
    <div>
      <h3 className="text-xs font-semibold text-muted uppercase tracking-wide mb-3">Proposed Fix</h3>
      <pre className="font-mono text-xs bg-obsidian-900 border border-obsidian-600 rounded p-3 overflow-x-auto">
        {diff.lines.map((line, i) => (
          <div key={i} className="text-electric-green">
            + {line.text}
          </div>
        ))}
      </pre>
    </div>

    <div>
      <h3 className="text-xs font-semibold text-muted uppercase tracking-wide mb-3">Substrate RLHF Scores</h3>
      <div className="space-y-2">
        {options.map((option) => (
          <div
            key={option.id}
            className={`flex items-center justify-between text-sm rounded px-3 py-2 border ${
              option.id === selectedOptionId
                ? 'border-electric-green bg-electric-green/5'
                : 'border-obsidian-600 bg-obsidian-900'
            }`}
          >
            <span className="text-gray-300">{option.label}</span>
            <span className={`font-mono font-bold ${option.id === selectedOptionId ? 'text-electric-green' : 'text-muted'}`}>
              {option.score.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>

    <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
      <input
        type="checkbox"
        checked={autoMonitor}
        onChange={(e) => onAutoMonitorChange(e.target.checked)}
        className="w-4 h-4 rounded accent-electric-green"
      />
      Auto-Monitor Rollback
    </label>
  </div>
);

export default RemediationDiffPanel;
