import { useNavigate } from 'react-router-dom';
import { AlertOctagon, GitCommit, Zap } from 'lucide-react';

const SEVERITY_STYLES = {
  CRITICAL: 'bg-red-50 text-red-700 border-red-200',
  HIGH: 'bg-amber-50 text-amber-700 border-amber-200',
};

const IncidentCard = ({ scenario }) => {
  const navigate = useNavigate();
  const { p95Before, p95After } = scenario.metrics ?? {};

  return (
    <div className="card border-red-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <AlertOctagon className="w-4 h-4 text-red-500" />
          <span className="text-xs font-mono text-slate-400">{scenario.incidentId}</span>
        </div>
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${SEVERITY_STYLES[scenario.severity] ?? SEVERITY_STYLES.HIGH}`}>
          {scenario.severity}
        </span>
      </div>

      <h3 className="text-sm font-semibold text-slate-800 mb-1">{scenario.title}</h3>
      {p95Before != null && (
        <p className="text-xs text-slate-500 mb-3">
          P95 latency: <span className="font-mono text-slate-700">{p95Before}ms</span> →{' '}
          <span className="font-mono text-red-600 font-semibold">{p95After}ms</span>
        </p>
      )}

      {scenario.deploy ? (
        <div className="flex items-start gap-2 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-md px-2.5 py-2 mb-4">
          <GitCommit className="w-3.5 h-3.5 text-cyan-500 flex-shrink-0 mt-0.5" />
          <span>
            Correlated to Deploy <span className="font-mono text-slate-800">{scenario.deploy.id}</span> by{' '}
            <span className="font-medium">{scenario.deploy.author}</span>
          </span>
        </div>
      ) : (
        <div className="flex items-start gap-2 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-md px-2.5 py-2 mb-4">
          <GitCommit className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
          <span>No recent deploy correlated — Autopilot is diagnosing from telemetry alone.</span>
        </div>
      )}

      <button
        onClick={() => navigate(`/autopilot/workspace/${scenario.incidentId}`)}
        className="btn-primary w-full flex items-center justify-center gap-2 text-sm"
      >
        <Zap className="w-4 h-4" /> Investigate Incident (SRE Coach UI)
      </button>
    </div>
  );
};

export default IncidentCard;
