import { useParams, useNavigate } from 'react-router-dom';
import BackButton from '../components/layout/BackButton';
import { primaryIncident } from '../utils/mockData';
import { BookOpen, Clock, CheckCircle, TrendingUp } from 'lucide-react';

/**
 * RunbookPage - Incident Knowledge Base
 *
 * Shows "Living Runbooks" via Local RAG
 * Displays past incident matches with similarity scores
 */
const RunbookPage = () => {
  const { runbookId } = useParams();
  const navigate = useNavigate();
  const similarIncidents = primaryIncident.similarIncidents;

  const currentRunbook = similarIncidents.find(inc => inc.id === runbookId) || similarIncidents[0];

  const getMatchTypeColor = (matchType) => {
    switch (matchType) {
      case 'Same root cause':
        return 'text-electric-green bg-electric-green/10 border-electric-green/30';
      case 'Similar pattern':
        return 'text-electric-cyan bg-electric-cyan/10 border-electric-cyan/30';
      case 'Related blast radius':
        return 'text-warning bg-warning/10 border-warning/30';
      default:
        return 'text-muted bg-obsidian-700 border-obsidian-600';
    }
  };

  const formatScore = (score) => {
    return (score * 100).toFixed(0) + '%';
  };

  return (
    <div className="max-w-5xl mx-auto">
      <BackButton onClick={() => navigate('/investigate/INC-8472')} label="Back to Investigation" />

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-warning" />
          <span className="text-gradient">Living Runbook</span>
        </h1>
        <p className="text-muted">
          Knowledge Base match from past incidents (Local RAG)
        </p>
      </div>

      {/* What is Local RAG? */}
      <div className="card mb-6 bg-warning/5 border-warning/20">
        <h3 className="text-lg font-semibold mb-3">What is Local RAG?</h3>
        <p className="text-sm text-gray-300 mb-3">
          <span className="text-warning font-semibold">Retrieval-Augmented Generation (RAG)</span> means the agent
          doesn't hallucinate solutions—it searches your organization's private incident history and retrospectives
          to find proven resolutions.
        </p>
        <p className="text-sm text-muted">
          This "Living Runbook" is automatically curated from past incidents that share similar failure signatures.
          The match score is based on vector similarity across symptoms, root causes, and topology patterns.
        </p>
      </div>

      {/* Current Runbook Details */}
      <div className="card mb-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">{currentRunbook.title}</h2>
            <div className="flex items-center gap-4 text-sm text-muted">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {currentRunbook.date}
              </span>
              <span>•</span>
              <span className="font-mono">{currentRunbook.id}</span>
            </div>
          </div>

          {/* Match Score Badge */}
          <div className="text-right">
            <div className="mb-2">
              <span className="text-3xl font-bold confidence-score">{formatScore(currentRunbook.matchScore)}</span>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getMatchTypeColor(currentRunbook.matchType)}`}>
              {currentRunbook.matchType}
            </span>
          </div>
        </div>

        {/* Incident Summary */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-muted mb-2">INCIDENT SUMMARY</h3>
          <p className="text-gray-300">{currentRunbook.summary}</p>
        </div>

        {/* Resolution */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-muted mb-2">RESOLUTION</h3>
          <div className="p-4 bg-electric-green/10 border border-electric-green/30 rounded-lg">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-electric-green flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-gray-300">{currentRunbook.resolution}</p>
                <div className="mt-3 flex items-center gap-4 text-sm">
                  <span className="text-muted">Time to Resolve:</span>
                  <span className="font-semibold text-electric-green">{currentRunbook.timeToResolve}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similarity Analysis */}
        <div>
          <h3 className="text-sm font-semibold text-muted mb-3">WHY THIS MATCH?</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-obsidian-700 rounded-lg">
              <p className="text-xs text-muted mb-1">Symptom Similarity</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-obsidian-600 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-electric-cyan h-full"
                    style={{ width: `${currentRunbook.matchScore * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs font-mono">{formatScore(currentRunbook.matchScore)}</span>
              </div>
            </div>
            <div className="p-3 bg-obsidian-700 rounded-lg">
              <p className="text-xs text-muted mb-1">Root Cause Alignment</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-obsidian-600 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-electric-green h-full"
                    style={{ width: `${currentRunbook.matchScore * 95}%` }}
                  ></div>
                </div>
                <span className="text-xs font-mono">{formatScore(currentRunbook.matchScore * 0.95)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* All Similar Incidents */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-electric-cyan" />
          Other Similar Incidents
        </h3>

        <div className="space-y-4">
          {similarIncidents.map(incident => (
            <div
              key={incident.id}
              className={`p-4 rounded-lg border-2 transition-all cursor-pointer hover:border-electric-cyan ${
                incident.id === currentRunbook.id
                  ? 'border-electric-cyan bg-electric-cyan/5'
                  : 'border-obsidian-600 bg-obsidian-800'
              }`}
              onClick={() => navigate(`/runbook/${incident.id}`)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-xs text-muted">{incident.id}</span>
                    <span className={`px-2 py-1 rounded text-xs font-semibold border ${getMatchTypeColor(incident.matchType)}`}>
                      {incident.matchType}
                    </span>
                  </div>
                  <h4 className="font-semibold mb-2">{incident.title}</h4>
                  <p className="text-sm text-muted mb-2">{incident.summary}</p>
                  <div className="flex items-center gap-4 text-xs text-muted">
                    <span>{incident.date}</span>
                    <span>•</span>
                    <span>Resolved in {incident.timeToResolve}</span>
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <p className="text-2xl font-bold confidence-score">{formatScore(incident.matchScore)}</p>
                  <p className="text-xs text-muted">Match</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RunbookPage;
