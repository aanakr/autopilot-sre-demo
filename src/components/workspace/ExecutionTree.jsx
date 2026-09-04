import { CheckCircle2, PauseCircle, Archive } from 'lucide-react';

const ExecutionTree = ({ steps }) => (
  <div className="p-4">
    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">Investigation Tree</h3>
    <ul className="space-y-3">
      {steps.map((step) => (
        <li key={step.id} className="flex items-start gap-2 text-sm">
          {step.status === 'done' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
          ) : (
            <PauseCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5 animate-pulse-slow" />
          )}
          <div>
            <span className={step.status === 'done' ? 'text-slate-700' : 'text-amber-700 font-medium'}>
              {step.label}
            </span>
            {step.detail && (
              <div className="text-xs text-cyan-700 font-mono pl-0 mt-0.5">↳ {step.detail}</div>
            )}
          </div>
        </li>
      ))}
    </ul>

    <div className="mt-5 pt-4 border-t border-slate-200 flex items-start gap-2 text-xs text-slate-400">
      <Archive className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
      <span>
        Context Compaction: 12 prior Slack threads + 3 runbooks paged out of the active context window —
        summarized, not dropped. Zero overflow.
      </span>
    </div>
  </div>
);

export default ExecutionTree;
