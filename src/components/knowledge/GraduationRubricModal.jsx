import { CheckCircle2, X, GraduationCap } from 'lucide-react';

const GraduationRubricModal = ({ open, scenario, onClose, onConfirm }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />
      <div className="relative bg-white border border-slate-200 rounded-xl shadow-2xl w-full max-w-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-cyan-600" />
            <h3 className="text-lg font-bold text-slate-900">Substrate Eligibility Rubric</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-slate-600 mb-4">
          Promoting <span className="font-mono text-slate-800">{scenario.workflowName}</span> from a manual script to
          a deterministic WIN Workflow for <span className="font-semibold">{scenario.entity}</span>.
        </p>

        <div className="space-y-3 mb-6">
          {scenario.eligibility.map((item) => (
            <div key={item.id} className="flex items-start gap-3 border border-slate-200 rounded-lg p-3">
              <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${item.eligible ? 'text-emerald-500' : 'text-slate-300'}`} />
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  {item.label}: <span className={item.eligible ? 'text-emerald-600' : 'text-slate-400'}>{item.eligible ? 'YES' : 'NO'}</span>
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{item.criterion}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button onClick={onConfirm} className="btn-primary flex-1">
            Confirm Graduation
          </button>
          <button onClick={onClose} className="btn-secondary flex-1">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default GraduationRubricModal;
