import { useAutopilot } from '../context/AutopilotContext';
import SubstrateContextChip from '../components/layout/SubstrateContextChip';
import IncidentHeroCard from '../components/home/IncidentHeroCard';
import SuggestedActionGrid from '../components/home/SuggestedActionGrid';
import { primaryIncident, suggestedActions, account } from '../utils/mockData';

const HomePage = () => {
  const { currentUser } = useAutopilot();

  return (
    <div className="space-y-8 max-w-3xl">
      <SubstrateContextChip />

      <div>
        <h1 className="text-2xl font-bold text-gray-100">Welcome back, {currentUser.name}.</h1>
        <p className="text-muted mt-1">
          Autopilot is actively monitoring {account.monitoredServices} microservices across{' '}
          {account.monitoredClusters} Kubernetes clusters.
        </p>
      </div>

      <IncidentHeroCard incident={primaryIncident} />

      <SuggestedActionGrid actions={suggestedActions} />

      <div className="sticky bottom-4">
        <div className="card flex items-center gap-3">
          <input
            type="text"
            placeholder="Ask Autopilot anything or type '/' for knowledge tools..."
            className="flex-1 bg-transparent text-sm text-gray-300 placeholder:text-muted focus:outline-none"
          />
          <button className="btn-primary text-sm">Send</button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
