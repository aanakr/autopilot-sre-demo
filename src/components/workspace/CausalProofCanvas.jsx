import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import SlideOverDrawer from '../knowledge/SlideOverDrawer';

const KIND_LABELS = {
  change: 'Change Node',
  cause: 'Root Cause Node',
  cascade: 'Cascade Node',
  symptom: 'Symptom Node',
  'ruled-out': 'Ruled Out',
  'knowledge-gap': 'Knowledge Gap',
};

const KIND_STYLES = {
  change: 'border-amber-300 bg-amber-50',
  cause: 'border-cyan-300 bg-cyan-50',
  cascade: 'border-cyan-300 bg-cyan-50',
  symptom: 'border-red-300 bg-red-50',
  'ruled-out': 'border-slate-300 bg-slate-50 text-slate-400 opacity-70',
  'knowledge-gap': 'border-amber-400 bg-amber-50 animate-pulse-slow',
};

const EDGE_COLOR = { normal: '#06B6D4', ruledOut: '#94A3B8', knowledgeGap: '#F59E0B' };

const edgeColor = (edge) => {
  if (edge.ruledOut) return EDGE_COLOR.ruledOut;
  if (edge.knowledgeGap) return EDGE_COLOR.knowledgeGap;
  return EDGE_COLOR.normal;
};

const CausalProofCanvas = ({ graph }) => {
  const [activeNodeId, setActiveNodeId] = useState(null);
  const { nodes, edges } = graph;
  const nodesById = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const activeNode = nodes.find((n) => n.id === activeNodeId);

  return (
    <div className="p-4">
      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">
        Causal Proof Canvas
      </h3>

      <div className="relative w-full" style={{ height: 400 }}>
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {edges.map((edge) => {
            const from = nodesById[edge.from];
            const to = nodesById[edge.to];
            if (!from || !to) return null;
            const color = edgeColor(edge);
            const pathD = `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
            return (
              <g key={edge.id}>
                <path
                  d={pathD}
                  fill="none"
                  stroke={color}
                  strokeWidth="0.5"
                  strokeDasharray={edge.ruledOut ? '2,2' : undefined}
                  vectorEffect="non-scaling-stroke"
                />
                {!edge.ruledOut && edge.weight != null && (
                  <circle r="1" fill={color}>
                    <animateMotion dur="2.4s" repeatCount="indefinite" path={pathD} />
                  </circle>
                )}
              </g>
            );
          })}
        </svg>

        {edges.map((edge) => {
          const from = nodesById[edge.from];
          const to = nodesById[edge.to];
          if (!from || !to || edge.weight == null) return null;
          return (
            <span
              key={`label-${edge.id}`}
              style={{
                position: 'absolute',
                left: `${(from.x + to.x) / 2}%`,
                top: `${(from.y + to.y) / 2}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className="text-[10px] font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 text-cyan-700 whitespace-nowrap"
            >
              Causality: {edge.weight.toFixed(2)}
            </span>
          );
        })}

        {nodes.map((node) => (
          <button
            key={node.id}
            onClick={() => setActiveNodeId(node.id)}
            style={{
              position: 'absolute',
              left: `${node.x}%`,
              top: `${node.y}%`,
              transform: 'translate(-50%, -50%)',
              width: node.x === 50 ? '70%' : '30%',
              maxWidth: 260,
              minWidth: 140,
            }}
            className={`text-left border rounded-lg px-3 py-2 shadow-panel hover:border-cyan-400 transition-colors ${KIND_STYLES[node.kind] ?? 'border-slate-200 bg-white'}`}
          >
            <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-0.5 flex items-center gap-1">
              {node.kind === 'knowledge-gap' && <AlertTriangle className="w-3 h-3 text-amber-500" />}
              {KIND_LABELS[node.kind] ?? node.kind}
            </p>
            <p className="text-xs font-medium text-slate-800 leading-snug">{node.label}</p>
            <p className="text-[11px] text-cyan-600 mt-1">View telemetry exemplars →</p>
          </button>
        ))}
      </div>

      <SlideOverDrawer
        open={!!activeNode}
        title={activeNode ? `${KIND_LABELS[activeNode.kind] ?? activeNode.kind}: ${activeNode.label}` : ''}
        onClose={() => setActiveNodeId(null)}
        accentClass="border-cyan-200"
      >
        {activeNode && (
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
              Telemetry Exemplars
            </h4>
            <ul className="space-y-2">
              {activeNode.evidence.map((item) => (
                <li
                  key={item}
                  className="text-sm font-mono text-slate-700 bg-slate-50 border border-slate-200 rounded px-3 py-2"
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
