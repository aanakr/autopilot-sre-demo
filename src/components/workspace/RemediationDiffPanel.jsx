import DataDictionaryChip from './DataDictionaryChip';

const RemediationDiffPanel = ({ dataDictionary, diff, options, selectedOptionId }) => (
  <div className="p-4 space-y-6">
    {dataDictionary && <DataDictionaryChip dataDictionary={dataDictionary} />}

    <div>
      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
        {diff.currentLabel ?? 'Current'} vs. {diff.proposedLabel ?? 'Proposed Fix'}
      </h3>
      <div className="grid grid-cols-2 gap-2">
        <pre className="font-mono text-[11px] bg-slate-50 border border-slate-200 rounded p-2.5 overflow-x-auto text-slate-400 leading-relaxed">
          {diff.currentLines?.map((line, i) => <div key={i}>{line}</div>)}
        </pre>
        <pre className="font-mono text-[11px] bg-emerald-50 border border-emerald-200 rounded p-2.5 overflow-x-auto leading-relaxed">
          {diff.lines.map((line, i) => (
            <div key={i} className="text-emerald-700">
              + {line.text}
            </div>
          ))}
        </pre>
      </div>
    </div>

    <div>
      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Substrate Confidence Scores</h3>
      <div className="space-y-2">
        {options.map((option) => (
          <div
            key={option.id}
            className={`flex items-center justify-between text-sm rounded px-3 py-2 border ${
              option.id === selectedOptionId
                ? 'border-emerald-300 bg-emerald-50'
                : 'border-slate-200 bg-slate-50'
            }`}
          >
            <span className="text-slate-700">
              {option.label}
              {option.note && <span className="text-xs text-slate-400 ml-2">({option.note})</span>}
            </span>
            <span className={`font-mono font-bold ${option.id === selectedOptionId ? 'text-emerald-600' : 'text-slate-400'}`}>
              {option.score.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default RemediationDiffPanel;
