import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Zap, PlayCircle } from 'lucide-react';

const IncidentHeroCard = ({ incident }) => {
  const navigate = useNavigate();
  const { metrics, deploy } = incident;

  return (
    <div className="card border-danger/40 bg-obsidian-800">
      <div className="flex items-start gap-3 mb-4">
        <AlertTriangle className="w-6 h-6 text-danger flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-danger font-semibold uppercase text-xs tracking-wide">
            Critical Alert Detected · {incident.detectedMinutesAgo} mins ago
          </p>
          <h2 className="text-lg font-bold text-gray-100 mt-1">
            Issue #{incident.id.replace('INC-', '')}: {incident.title}
          </h2>
        </div>
      </div>

      <p className="text-sm text-gray-300 mb-2 font-mono">
        P95 Latency Spiked {metrics.multiplier}x on {incident.entity} ({metrics.p95Before}ms → {metrics.p95After}ms)
      </p>

      <p className="text-sm text-muted mb-6">
        Substrate Pre-Triage: High confidence correlation to Deploy {deploy.id} ({deploy.author}, {deploy.minutesBeforeIncident} min prior)
      </p>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => navigate(`/autopilot/thread/${incident.id}`)}
          className="btn-primary flex items-center gap-2"
        >
          <Zap className="w-4 h-4" /> Investigate Incident
        </button>
        <button
          onClick={() => navigate(`/autopilot/thread/${incident.id}`)}
          className="btn-secondary flex items-center gap-2"
        >
          <PlayCircle className="w-4 h-4" /> Propose Mitigation Runbook
        </button>
      </div>
    </div>
  );
};

export default IncidentHeroCard;
