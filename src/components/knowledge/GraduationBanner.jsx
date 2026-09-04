import { AlertTriangle, Sparkles } from 'lucide-react';

const GraduationBanner = ({ scenario, onGraduateClick, graduated }) => (
  <div className={`card ${graduated ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>
    <div className="flex items-start justify-between gap-4 flex-wrap">
      <div className="flex items-start gap-3">
        <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${graduated ? 'text-emerald-500' : 'text-amber-500'}`} />
        <div>
          <p className="text-sm font-semibold text-slate-800">
            {graduated ? 'Workflow Graduated' : scenario.banner.title}
          </p>
          <p className="text-sm text-slate-600 mt-0.5 max-w-xl">
            {graduated
              ? `${scenario.workflowName} is now a deterministic WIN Workflow for ${scenario.entity}. +${scenario.toilHoursReclaimed}h added to SRE Toil Reclaimed.`
              : scenario.banner.body}
          </p>
        </div>
      </div>
      {!graduated && (
        <button onClick={onGraduateClick} className="btn-primary flex items-center gap-2 text-sm flex-shrink-0">
          <Sparkles className="w-4 h-4" /> Graduate to Workflow
        </button>
      )}
    </div>
  </div>
);

export default GraduationBanner;
