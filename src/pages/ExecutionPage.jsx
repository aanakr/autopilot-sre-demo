import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CornerDownLeft, BookOpen } from 'lucide-react';
import ExecutionTerminal from '../components/execution/ExecutionTerminal';
import ValidationCountdown from '../components/execution/ValidationCountdown';
import RlhfBanner from '../components/execution/RlhfBanner';
import { incidents } from '../utils/mockData';

const ExecutionPage = () => {
  const { incidentId } = useParams();
  const navigate = useNavigate();
  const incident = incidents[incidentId] ?? incidents['INC-8472'];
  const [validationComplete, setValidationComplete] = useState(false);

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <p className="text-xs text-muted uppercase tracking-wide">Autopilot Workspace</p>
        <h1 className="text-xl font-bold text-gray-100">Remediation In Progress</h1>
      </div>

      <ExecutionTerminal execution={incident.execution} />

      <ValidationCountdown validation={incident.validation} onComplete={() => setValidationComplete(true)} />

      {validationComplete && <RlhfBanner rlhf={incident.rlhf} />}

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => navigate(`/autopilot/thread/${incident.id}`)}
          className="btn-secondary flex items-center gap-2"
        >
          <CornerDownLeft className="w-4 h-4" /> Return to Incident Thread
        </button>
        <button
          onClick={() => navigate('/autopilot/knowledge')}
          className="btn-secondary flex items-center gap-2"
        >
          <BookOpen className="w-4 h-4" /> View in Organizational Knowledge Hub
        </button>
      </div>
    </div>
  );
};

export default ExecutionPage;
