import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAgentState } from '../context/AgentStateContext';
import { AgentStates } from '../utils/stateEnums';
import BackButton from '../components/layout/BackButton';
import IncidentTimeline from '../components/investigation/IncidentTimeline';
import SummaryCard from '../components/investigation/SummaryCard';
import RecommendationsCard from '../components/investigation/RecommendationsCard';
import ProofChain from '../components/investigation/ProofChain';
import { AlertCircle } from 'lucide-react';

/**
 * InvestigationPage
 *
 * Main RCA (Root Cause Analysis) response page
 * Shows complete investigation results with interactive drill-downs
 */
const InvestigationPage = () => {
  const { incidentId } = useParams();
  const navigate = useNavigate();
  const { agentState, currentIncident, investigateIncident, approveRemediation } = useAgentState();

  useEffect(() => {
    // If no current incident, trigger investigation
    if (!currentIncident && agentState === AgentStates.IDLE) {
      investigateIncident(incidentId);
    }
  }, [incidentId, currentIncident, agentState, investigateIncident]);

  const handleApprove = async (actionId) => {
    await approveRemediation(actionId);
    alert(`Action ${actionId} approved and executing...`);
  };

  // Loading State
  if (agentState === AgentStates.LOADING) {
    return (
      <div className="max-w-6xl mx-auto">
        <BackButton onClick={() => navigate('/')} />
        <div className="card flex flex-col items-center justify-center py-12">
          <div className="spinner w-12 h-12 mb-4"></div>
          <h3 className="text-lg font-semibold mb-2">Analyzing Incident...</h3>
          <p className="text-sm text-muted">Substrate is correlating telemetry across 4 pillars</p>
        </div>
      </div>
    );
  }

  // Error State
  if (agentState === AgentStates.ERROR || !currentIncident) {
    return (
      <div className="max-w-6xl mx-auto">
        <BackButton onClick={() => navigate('/')} />
        <div className="card flex flex-col items-center justify-center py-12">
          <AlertCircle className="w-12 h-12 text-danger mb-4" />
          <h3 className="text-lg font-semibold mb-2">Investigation Failed</h3>
          <p className="text-sm text-muted mb-4">Could not analyze incident {incidentId}</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Return Home
          </button>
        </div>
      </div>
    );
  }

  // Success State - Show Investigation Results
  return (
    <div className="max-w-6xl mx-auto">
      <BackButton onClick={() => navigate('/')} />

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          <span className="text-gradient">Root Cause Analysis</span>
        </h1>
        <div className="flex items-center gap-3">
          <h2 className="text-xl text-gray-300">{currentIncident.title}</h2>
          <span className="text-muted">•</span>
          <span className="font-mono text-electric-cyan">{currentIncident.id}</span>
        </div>
      </div>

      {/* Timeline */}
      {currentIncident.timeline && (
        <IncidentTimeline timeline={currentIncident.timeline} />
      )}

      {/* Summary */}
      {currentIncident.summary && (
        <SummaryCard
          summary={currentIncident.summary}
          severity={currentIncident.severity}
          status={currentIncident.status}
        />
      )}

      {/* Recommendations */}
      {currentIncident.recommendations && (
        <RecommendationsCard
          recommendations={currentIncident.recommendations}
          onApprove={handleApprove}
        />
      )}

      {/* Proof Chain (4 Tiles) */}
      {currentIncident.proofChain && (
        <ProofChain proofChain={currentIncident.proofChain} />
      )}

      {/* Call to Action - Explore Substrate Pillars */}
      <div className="card bg-electric-cyan/5 border-electric-cyan/20">
        <h3 className="text-lg font-semibold mb-4">Explore the 4 Substrate Pillars</h3>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/topology/payment-service')}
            className="p-4 bg-obsidian-800 hover:bg-obsidian-700 rounded-lg text-left transition-colors"
          >
            <p className="font-semibold mb-1">Entity Topology Graph</p>
            <p className="text-xs text-muted">View blast radius & dependencies</p>
          </button>
          <button
            onClick={() => navigate('/causal/pool-exhaustion')}
            className="p-4 bg-obsidian-800 hover:bg-obsidian-700 rounded-lg text-left transition-colors"
          >
            <p className="font-semibold mb-1">Causal Graph</p>
            <p className="text-xs text-muted">Explore failure propagation</p>
          </button>
          <button
            onClick={() => navigate('/runbook/RETRO-INC-4512')}
            className="p-4 bg-obsidian-800 hover:bg-obsidian-700 rounded-lg text-left transition-colors"
          >
            <p className="font-semibold mb-1">Similar Incidents</p>
            <p className="text-xs text-muted">View Living Runbooks</p>
          </button>
          <button
            onClick={() => navigate('/corpus/pattern-db-pool')}
            className="p-4 bg-obsidian-800 hover:bg-obsidian-700 rounded-lg text-left transition-colors"
          >
            <p className="font-semibold mb-1">Global Pattern Match</p>
            <p className="text-xs text-muted">See cross-customer intelligence</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvestigationPage;
