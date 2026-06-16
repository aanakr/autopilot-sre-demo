import { useParams, useNavigate } from 'react-router-dom';
import BackButton from '../components/layout/BackButton';
import { primaryIncident } from '../utils/mockData';
import { Globe, Shield, TrendingUp, Lock } from 'lucide-react';

/**
 * CorpusMatchPage - Cross-Customer Pattern Corpus
 *
 * Shows the "Global Moat" - anonymized failure signatures
 * matched across all opted-in New Relic customers
 */
const CorpusMatchPage = () => {
  const { patternId } = useParams();
  const navigate = useNavigate();
  const globalCorpus = primaryIncident.globalCorpus;

  const formatScore = (score) => {
    return (score * 100).toFixed(0) + '%';
  };

  return (
    <div className="max-w-5xl mx-auto">
      <BackButton onClick={() => navigate('/investigate/INC-8472')} label="Back to Investigation" />

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Globe className="w-8 h-8 text-success" />
          <span className="text-gradient">Global Pattern Match</span>
        </h1>
        <p className="text-muted">
          Cross-Customer Pattern Corpus - The "Encyclopedia of Outages"
        </p>
      </div>

      {/* What is the Global Corpus? */}
      <div className="card mb-6 bg-success/5 border-success/20">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Shield className="w-5 h-5 text-success" />
          Privacy-Preserving Global Intelligence
        </h3>
        <p className="text-sm text-gray-300 mb-3">
          The <span className="text-success font-semibold">Cross-Customer Pattern Corpus</span> is New Relic's
          "global moat" - a shared database of anonymized, mathematically abstracted failure signatures pooled
          across all opted-in enterprises.
        </p>
        <p className="text-sm text-muted mb-3">
          Think of it like a global vaccine registry: When Customer A suffers an outage, the failure pattern is
          anonymized and added to the corpus. Customer B is then automatically immunized against that exact
          architectural failure shape.
        </p>
        <div className="p-3 bg-obsidian-800 rounded-lg border border-success/30">
          <p className="text-xs text-muted mb-2 flex items-center gap-2">
            <Lock className="w-3 h-3 text-success" />
            <span className="font-semibold text-success">Privacy Guarantee:</span>
          </p>
          <p className="text-xs text-gray-400">
            Zero PII, zero proprietary code, no readable infrastructure names. Only abstract mathematical patterns:
            "DB_Stateful_Storage → Connection_Pool → Memory_Saturation"
          </p>
        </div>
      </div>

      {/* Match Summary */}
      <div className="card mb-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Pattern Match Found</h2>
            <p className="text-muted">This failure signature matches global historical data</p>
          </div>
          <div className="text-right">
            <div className="mb-2">
              <span className="text-4xl font-bold text-success">{formatScore(globalCorpus.matchScore)}</span>
            </div>
            <span className="text-xs text-muted">Global Confidence</span>
          </div>
        </div>

        {/* Global Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-success/10 rounded-lg border border-success/30">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-5 h-5 text-success" />
              <p className="text-2xl font-bold text-success">{globalCorpus.totalIncidents.toLocaleString()}</p>
            </div>
            <p className="text-xs text-muted">Similar incidents globally</p>
          </div>
          <div className="p-4 bg-electric-cyan/10 rounded-lg border border-electric-cyan/30">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-electric-cyan" />
              <p className="text-2xl font-bold text-electric-cyan">{globalCorpus.enterprisesAffected}</p>
            </div>
            <p className="text-xs text-muted">Enterprises affected</p>
          </div>
          <div className="p-4 bg-electric-green/10 rounded-lg border border-electric-green/30">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-electric-green" />
              <p className="text-2xl font-bold confidence-score">{formatScore(globalCorpus.remediationSuccessRate)}</p>
            </div>
            <p className="text-xs text-muted">Remediation success rate</p>
          </div>
        </div>
      </div>

      {/* Abstract Pattern */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold mb-4">Anonymized Failure Signature</h3>
        <div className="p-6 bg-obsidian-900 rounded-lg border border-success/30">
          <div className="flex items-center justify-center gap-4 font-mono text-sm">
            <div className="p-3 bg-success/20 rounded text-success font-semibold">
              DB_Stateful_Storage
            </div>
            <span className="text-electric-cyan">→</span>
            <div className="p-3 bg-electric-cyan/20 rounded text-electric-cyan font-semibold">
              Connection_Pool
            </div>
            <span className="text-electric-cyan">→</span>
            <div className="p-3 bg-danger/20 rounded text-danger font-semibold">
              Memory_Saturation
            </div>
          </div>
          <p className="text-center text-xs text-muted mt-4">
            This pattern represents <span className="text-success font-semibold">{globalCorpus.totalIncidents} real incidents</span> across
            different architectures, cloud providers, and database types
          </p>
        </div>
      </div>

      {/* Top Remediation */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold mb-4">Most Effective Remediation (Global Data)</h3>
        <div className="p-5 bg-electric-green/10 border-2 border-electric-green/30 rounded-lg">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h4 className="font-semibold text-lg text-electric-green mb-2">{globalCorpus.topRemediation}</h4>
              <p className="text-sm text-gray-300">
                Across all enterprises that experienced this pattern, scaling the connection pool
                was the most successful resolution strategy.
              </p>
            </div>
            <div className="ml-6 text-right">
              <p className="text-3xl font-bold confidence-score">{formatScore(globalCorpus.remediationSuccessRate)}</p>
              <p className="text-xs text-muted">Success Rate</p>
            </div>
          </div>

          {/* Success Distribution */}
          <div className="mt-4 pt-4 border-t border-electric-green/30">
            <p className="text-xs text-muted mb-2">SUCCESS DISTRIBUTION</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-obsidian-800 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-electric-green h-full"
                  style={{ width: `${globalCorpus.remediationSuccessRate * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-mono text-electric-green">
                {(globalCorpus.totalIncidents * globalCorpus.remediationSuccessRate).toFixed(0)} / {globalCorpus.totalIncidents} incidents
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Note */}
      <div className="card bg-obsidian-700 border-obsidian-500">
        <div className="flex items-start gap-3">
          <Lock className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold mb-2">Privacy & Data Protection</h3>
            <p className="text-sm text-muted mb-3">
              {globalCorpus.privacyNote}
            </p>
            <p className="text-xs text-muted">
              Only customers who explicitly opt-in contribute to the global corpus. All data is anonymized via
              cryptographic hashing and structural abstraction before aggregation. No customer can reverse-engineer
              another customer's infrastructure from these patterns.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorpusMatchPage;
