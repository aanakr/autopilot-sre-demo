import { ArrowDown } from 'lucide-react';

const NODE_STYLES = {
  'Symptom Node': 'border-danger/50 bg-danger/5',
  'Change Node': 'border-warning/50 bg-warning/5',
  'Root Cause Node': 'border-electric-cyan/50 bg-electric-cyan/5',
  'Mitigation Node': 'border-electric-green/50 bg-electric-green/5',
};

const CausalProofCanvas = ({ chain }) => (
  <div className="p-6 flex flex-col items-center">
    <h3 className="text-xs font-semibold text-muted uppercase tracking-wide mb-6 self-start">
      Causal Proof Canvas
    </h3>
    {chain.map((node) => (
      <div key={node.id} className="w-full max-w-sm flex flex-col items-center">
        <div className={`w-full card border ${NODE_STYLES[node.kind] ?? ''}`}>
          <p className="text-xs text-muted uppercase tracking-wide mb-1">{node.kind}</p>
          <p className="text-sm font-medium text-gray-100">{node.label}</p>
          {node.confidence != null && (
            <p className="text-xs font-mono text-electric-green font-bold mt-2">
              Confidence: {node.confidence}
            </p>
          )}
        </div>
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
  </div>
);

export default CausalProofCanvas;
