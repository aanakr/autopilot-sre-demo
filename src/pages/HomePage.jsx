import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAgentState } from '../context/AgentStateContext';
import { AlertCircle, Network, GitBranch, BookOpen, Globe } from 'lucide-react';

/**
 * HomePage - Chat Interface
 *
 * Main entry point for Autopilot interaction
 * Showcases 4 Substrate Pillars through capability cards
 */
const HomePage = () => {
  const navigate = useNavigate();
  const { agentState, investigateIncident } = useAgentState();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInvestigate = async (incidentId = 'INC-8472') => {
    setLoading(true);
    try {
      await investigateIncident(incidentId);
      navigate(`/investigate/${incidentId}`);
    } catch (error) {
      console.error('Investigation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestedPrompt = (promptincidentId) => {
    handleInvestigate(incidentId);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">
          <span className="text-gradient">Substrate-Powered</span>
          <br />
          Autonomous SRE Agent
        </h2>
        <p className="text-lg text-muted max-w-2xl mx-auto">
          Proving that AI-driven incident response is <span className="text-electric-green font-semibold">not hallucination</span>,
          but grounded in four deterministic pillars of observability intelligence.
        </p>
      </div>

      {/* The 4 Substrate Pillars */}
      <div className="mb-12">
        <h3 className="text-xl font-semibold mb-6 text-center">The 4 Substrate Pillars</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pillar 1: Entity Topology */}
          <div className="card-hover cursor-pointer" onClick={() => navigate('/topology/payment-service')}>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-electric-green/10 rounded-lg">
                <Network className="w-6 h-6 text-electric-green" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-lg mb-2">Entity Topology Graph</h4>
                <p className="text-sm text-muted mb-3">
                  Live dependency mapping showing the "blast radius" of failures across physical, container, and logical layers.
                </p>
                <span className="text-xs text-electric-cyan">Click to explore →</span>
              </div>
            </div>
          </div>

          {/* Pillar 2: Causal Graph */}
          <div className="card-hover cursor-pointer" onClick={() => navigate('/causal/pool-exhaustion')}>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-electric-cyan/10 rounded-lg">
                <GitBranch className="w-6 h-6 text-electric-cyan" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-lg mb-2">Causal Graph</h4>
                <p className="text-sm text-muted mb-3">
                  Step-by-step "Proof Chain" showing directional failure propagation with RLHF confidence scores.
                </p>
                <span className="text-xs text-electric-cyan">Click to explore →</span>
              </div>
            </div>
          </div>

          {/* Pillar 3: Knowledge Base */}
          <div className="card-hover cursor-pointer" onClick={() => navigate('/runbook/RETRO-INC-4512')}>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-warning/10 rounded-lg">
                <BookOpen className="w-6 h-6 text-warning" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-lg mb-2">Incident Knowledge Base</h4>
                <p className="text-sm text-muted mb-3">
                  "Living Runbooks" via Local RAG, citing past incident matches and proven resolutions.
                </p>
                <span className="text-xs text-electric-cyan">Click to explore →</span>
              </div>
            </div>
          </div>

          {/* Pillar 4: Global Corpus */}
          <div className="card-hover cursor-pointer" onClick={() => navigate('/corpus/pattern-db-pool')}>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-success/10 rounded-lg">
                <Globe className="w-6 h-6 text-success" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-lg mb-2">Cross-Customer Pattern Corpus</h4>
                <p className="text-sm text-muted mb-3">
                  Global "Encyclopedia of Outages" - anonymized failure signatures across 89+ enterprises.
                </p>
                <span className="text-xs text-electric-cyan">Click to explore →</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="card max-w-3xl mx-auto">
        <h3 className="text-xl font-semibold mb-4">Start Investigation</h3>

        {/* Suggested Prompts */}
        <div className="mb-6">
          <p className="text-sm text-muted mb-3">Try these sample incidents:</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleSuggestedPrompt('INC-8472')}
              disabled={loading}
              className="px-4 py-2 bg-obsidian-700 hover:bg-obsidian-600 rounded-lg text-sm transition-colors border border-obsidian-500"
            >
              🚨 Payment Service Memory Crisis
            </button>
            <button
              onClick={() => handleSuggestedPrompt('INC-8472')}
              disabled={loading}
              className="px-4 py-2 bg-obsidian-700 hover:bg-obsidian-600 rounded-lg text-sm transition-colors border border-obsidian-500"
            >
              📊 Connection Pool Exhaustion
            </button>
          </div>
        </div>

        {/* Input Area */}
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !loading && handleInvestigate()}
            placeholder="Or type incident ID (e.g., INC-8472)..."
            disabled={loading}
            className="flex-1 px-4 py-3 bg-obsidian-700 border border-obsidian-600 rounded-lg focus:outline-none focus:border-electric-cyan transition-colors"
          />
          <button
            onClick={() => handleInvestigate(input || 'INC-8472')}
            disabled={loading}
            className="btn-primary flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="spinner w-4 h-4"></div>
                Investigating...
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4" />
                Investigate
              </>
            )}
          </button>
        </div>

        {/* Info Note */}
        <div className="mt-6 p-4 bg-electric-cyan/5 border border-electric-cyan/20 rounded-lg">
          <p className="text-sm text-muted">
            <span className="text-electric-cyan font-semibold">Demo Note:</span> This prototype uses realistic mock data
            to demonstrate the Substrate architecture. Every recommendation includes an auditable proof chain showing
            exactly how the agent reached its conclusions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
