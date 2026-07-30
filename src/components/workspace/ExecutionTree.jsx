import { CheckCircle2, PauseCircle } from 'lucide-react';

const ExecutionTree = ({ steps }) => (
  <div className="p-4">
    <h3 className="text-xs font-semibold text-muted uppercase tracking-wide mb-4">Triage Sequence</h3>
    <ul className="space-y-3">
      {steps.map((step) => (
        <li key={step.id} className="flex items-start gap-2 text-sm">
          {step.status === 'done' ? (
            <CheckCircle2 className="w-4 h-4 text-electric-green flex-shrink-0 mt-0.5" />
          ) : (
            <PauseCircle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5 animate-pulse-slow" />
          )}
          <div>
            <span className={step.status === 'done' ? 'text-gray-300' : 'text-warning'}>{step.label}</span>
            {step.detail && (
              <div className="text-xs text-electric-cyan font-mono pl-0 mt-0.5">↳ {step.detail}</div>
            )}
          </div>
        </li>
      ))}
    </ul>
  </div>
);

export default ExecutionTree;
