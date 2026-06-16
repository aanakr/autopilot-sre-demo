import { useState } from 'react';
import { ChevronRight, ChevronDown, AlertCircle, GitCommit, Target, Wrench, Code } from 'lucide-react';

/**
 * ProofChain Component
 *
 * 4-tile interactive Evidence section showing causal flow:
 * Symptom → Change → Root Cause → Fix
 *
 * Each tile is expandable to show detailed evidence,
 * traces, and NRQL queries
 */
const ProofChain = ({ proofChain }) => {
  const [expandedTile, setExpandedTile] = useState(null);

  const tiles = [
    {
      id: 'symptom',
      title: proofChain.symptom?.title || 'Symptom',
      icon: <AlertCircle className="w-5 h-5" />,
      color: 'text-danger border-danger/30 bg-danger/5',
      data: proofChain.symptom,
    },
    {
      id: 'change',
      title: proofChain.change?.title || 'Change Detected',
      icon: <GitCommit className="w-5 h-5" />,
      color: 'text-electric-cyan border-electric-cyan/30 bg-electric-cyan/5',
      data: proofChain.change,
    },
    {
      id: 'rootCause',
      title: proofChain.rootCause?.title || 'Root Cause',
      icon: <Target className="w-5 h-5" />,
      color: 'text-warning border-warning/30 bg-warning/5',
      data: proofChain.rootCause,
    },
    {
      id: 'fix',
      title: proofChain.fix?.title || 'Recommended Fix',
      icon: <Wrench className="w-5 h-5" />,
      color: 'text-electric-green border-electric-green/30 bg-electric-green/5',
      data: proofChain.fix,
    },
  ];

  const toggleTile = (id) => {
    setExpandedTile(expandedTile === id ? null : id);
  };

  return (
    <div className="card mb-6">
      <h3 className="text-lg font-semibold mb-4">Evidence & Proof Chain</h3>

      {/* Tiles with Arrows */}
      <div className="space-y-4">
        {tiles.map((tile, index) => (
          <div key={tile.id}>
            <div
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${tile.color} ${
                expandedTile === tile.id ? 'ring-2 ring-electric-cyan' : ''
              }`}
              onClick={() => toggleTile(tile.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {tile.icon}
                  <div>
                    <h4 className="font-semibold">{tile.title}</h4>
                    {tile.data && (
                      <p className="text-sm text-muted mt-1">{tile.data.description}</p>
                    )}
                  </div>
                </div>
                {expandedTile === tile.id ? (
                  <ChevronDown className="w-5 h-5 text-muted" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-muted" />
                )}
              </div>

              {/* Expanded Content */}
              {expandedTile === tile.id && tile.data && (
                <div className="mt-4 pt-4 border-t border-obsidian-600">
                  {/* Evidence List */}
                  {tile.data.evidence && (
                    <div className="mb-4">
                      <p className="text-xs text-muted font-semibold mb-2">EVIDENCE:</p>
                      <ul className="space-y-1">
                        {tile.data.evidence.map((item, idx) => (
                          <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                            <span className="text-electric-green">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Trace IDs */}
                  {tile.data.traceIds && (
                    <div className="mb-4">
                      <p className="text-xs text-muted font-semibold mb-2">TRACE IDs:</p>
                      <div className="flex flex-wrap gap-2">
                        {tile.data.traceIds.map((traceId) => (
                          <code key={traceId} className="px-2 py-1 bg-obsidian-900 text-electric-cyan text-xs rounded font-mono">
                            {traceId}
                          </code>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Fix Steps */}
                  {tile.data.steps && (
                    <div className="mb-4">
                      <p className="text-xs text-muted font-semibold mb-2">REMEDIATION STEPS:</p>
                      <ol className="space-y-2">
                        {tile.data.steps.map((step, idx) => (
                          <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                            <span className="text-electric-green font-semibold">{idx + 1}.</span>
                            {step}
                          </li>
                        ))}
                      </ol>
                      {tile.data.confidence && (
                        <div className="mt-3 p-2 bg-electric-green/10 rounded">
                          <span className="text-xs text-muted">Confidence: </span>
                          <span className="confidence-score text-sm">{(tile.data.confidence * 100).toFixed(0)}%</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* NRQL Query */}
                  {tile.data.nrql && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs text-muted font-semibold flex items-center gap-1">
                          <Code className="w-3 h-3" /> NRQL QUERY:
                        </p>
                        <button className="text-xs text-electric-cyan hover:text-electric-green">
                          Copy
                        </button>
                      </div>
                      <pre className="bg-obsidian-900 p-3 rounded text-xs text-electric-cyan overflow-x-auto font-mono">
                        {tile.data.nrql}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Arrow between tiles */}
            {index < tiles.length - 1 && (
              <div className="flex justify-center my-2">
                <ChevronRight className="w-5 h-5 text-electric-cyan rotate-90" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProofChain;
