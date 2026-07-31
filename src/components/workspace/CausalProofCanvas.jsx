import { useState } from 'react';
import { ArrowDown } from 'lucide-react';
import SlideOverDrawer from '../knowledge/SlideOverDrawer';

const NODE_STYLES = {
  'Change Node': 'border-warning/50 bg-warning/5',
  'Root Cause Node': 'border-electric-cyan/50 bg-electric-cyan/5',
  'Cascade Node': 'border-electric-cyan/50 bg-electric-cyan/5',
  'Symptom Node': 'border-danger/50 bg-danger/5',
};

const CausalProofCanvas = ({ chain }) => {
  const [activeNodeId, setActiveNodeId] = useState(null);
  const activeNode = chain.find((n) => n.id === activeNodeId);

  return (
    <div className="p-6 flex flex-col items-center">
      <h3 className="text-xs font-semibold text-muted uppercase tracking-wide mb-6 self-start">
        Causal Proof Canvas
      </h3>
      {chain.map((node) => (
        <div key={node.id} className="w-full max-w-sm flex flex-col items-center">
          <button
            onClick={() => setActiveNodeId(node.id)}
            className={`w-full card border text-left hover:border-electric-cyan transition-colors ${NODE_STYLES[node.kind] ?? ''}`}
          >
            <p className="text-xs text-muted uppercase tracking-wide mb-1">{node.kind}</p>
            <p className="text-sm font-medium text-gray-100">{node.label}</p>
            {node.confidence != null && (
              <p className="text-xs font-mono text-electric-green font-bold mt-2">
                Confidence: {node.confidence}
              </p>
            )}
            <p className="text-xs text-electric-cyan mt-2">View telemetry exemplars →</p>
          </button>
          {node.causalityToNext != null && (
            <div className="flex flex-col items-center py-2">
              <ArrowDown className="w-4 h-4 text-muted" />
              <span className="text-xs font-mono text-electric-cyan">
                Causality: {node.causalityToNext}
              </span>
            </div>
          )}
        </div>
      ))}

      <SlideOverDrawer
        open={!!activeNode}
        title={activeNode ? `${activeNode.kind}: ${activeNode.label}` : ''}
        onClose={() => setActiveNodeId(null)}
        accentClass="border-electric-cyan/40"
      >
        {activeNode && (
          <div>
            <h4 className="text-xs font-semibold text-muted uppercase tracking-wide mb-3">
              Telemetry Exemplars
            </h4>
            <ul className="space-y-2">
              {activeNode.evidence.map((item) => (
                <li
                  key={item}
                  className="text-sm font-mono text-gray-300 bg-obsidian-900 border border-obsidian-600 rounded px-3 py-2"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </SlideOverDrawer>
    </div>
  );
};

export default CausalProofCanvas;
