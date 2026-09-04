import { useLayoutEffect, useRef, useState } from 'react';
import { CheckCircle2, AlertTriangle, AlertOctagon, Route } from 'lucide-react';

const RICHNESS = {
  gap: { cell: 'bg-rose-50 border border-rose-300 hover:bg-rose-100', icon: AlertOctagon, iconClass: 'text-rose-600' },
  thin: { cell: 'bg-amber-50 border border-amber-300 hover:bg-amber-100', icon: AlertTriangle, iconClass: 'text-amber-600' },
  complete: { cell: 'bg-emerald-50 border border-emerald-300 hover:bg-emerald-100', icon: CheckCircle2, iconClass: 'text-emerald-600' },
};

const cellKey = (dataType, service) => `${dataType}::${service}`;

const LegendSwatch = ({ richness, label }) => {
  const { cell, icon: Icon, iconClass } = RICHNESS[richness];
  return (
    <span className="flex items-center gap-1.5 text-xs text-slate-500">
      <span className={`w-4 h-4 rounded-sm flex items-center justify-center ${cell}`}>
        <Icon className={`w-2.5 h-2.5 ${iconClass}`} />
      </span>
      {label}
    </span>
  );
};

// Purely presentational — KnowledgeGapMap owns the refs and measurement, so
// this never has to guess whether the container/cell DOM nodes exist yet.
const TraversalOverlay = ({ points }) => {
  if (points.length < 2) return null;

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ');
  const last = points[points.length - 1];

  return (
    <svg id="traversal-path-svg" className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 10 }}>
      <polyline
        points={polylinePoints}
        fill="none"
        stroke="#06B6D4"
        strokeWidth="2.5"
        strokeDasharray="6 5"
        strokeLinecap="round"
        className="animate-[dash-flow_0.9s_linear_infinite]"
      />
      {points.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={p.stalled ? 7 : 4.5}
          fill={p.stalled ? '#EF4444' : '#06B6D4'}
          stroke="white"
          strokeWidth="1.5"
        />
      ))}
      {last.stalled && (
        <text x={last.x + 14} y={last.y + 3} textAnchor="start" className="fill-red-600 font-mono font-semibold" style={{ fontSize: 10 }}>
          🛑 {last.note ?? 'GAP'}
        </text>
      )}
    </svg>
  );
};

const TraversalCaption = ({ traversalPath, incidentId }) => {
  if (!traversalPath) return null;
  return (
    <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-200 bg-cyan-50/60 text-xs font-mono text-cyan-800 flex-wrap">
      <Route className="w-3.5 h-3.5 flex-shrink-0" />
      <span className="font-semibold">Agent Traversal Path ({incidentId}):</span>
      {traversalPath.map((step, i) => (
        <span key={i} className="flex items-center gap-2">
          <span className={step.stalled ? 'text-red-600 font-semibold' : ''}>
            {step.stalled ? `🛑 [${step.dataType}]` : `[${step.dataType}]`}
          </span>
          {i < traversalPath.length - 1 && <span className="text-cyan-400">➔</span>}
        </span>
      ))}
      {traversalPath.some((s) => s.stalled) && <span className="text-red-600 font-semibold">GAP ENCOUNTERED</span>}
    </div>
  );
};

const KnowledgeGapMap = ({ dataTypes, services, coverage, selectedEntity, onCellClick, traversalPath, incidentId }) => {
  const containerRef = useRef(null);
  const cellRefs = useRef({});
  const [traversalPoints, setTraversalPoints] = useState([]);

  useLayoutEffect(() => {
    if (!traversalPath || !containerRef.current) {
      setTraversalPoints([]);
      return undefined;
    }

    const measure = () => {
      const containerRect = containerRef.current.getBoundingClientRect();
      const next = traversalPath
        .map((step) => {
          const el = cellRefs.current[cellKey(step.dataType, step.service)];
          if (!el) return null;
          const rect = el.getBoundingClientRect();
          return {
            x: rect.left + rect.width / 2 - containerRect.left,
            y: rect.top + rect.height / 2 - containerRect.top,
            stalled: !!step.stalled,
            note: step.note,
          };
        })
        .filter(Boolean);
      setTraversalPoints(next);
    };

    measure();
    // Re-measure on any layout change (window resize, responsive column
    // widths settling) so the overlay never gets stuck mid-render.
    const observer = new ResizeObserver(measure);
    observer.observe(containerRef.current);
    window.addEventListener('resize', measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
    // coverage isn't a real dependency of the measurement itself, but a
    // richness change can reflow column widths (e.g. a resolved gap), so
    // re-measure defensively when it changes too.
  }, [traversalPath, coverage]);

  return (
    <div className="card-flush">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700">Ground Truth Matrix</h3>
        <div className="flex items-center gap-3 flex-wrap">
          <LegendSwatch richness="complete" label="Complete instrumentation" />
          <LegendSwatch richness="thin" label="Thin / un-indexed" />
          <LegendSwatch richness="gap" label="Active Knowledge Gap" />
        </div>
      </div>

      <TraversalCaption traversalPath={traversalPath} incidentId={incidentId} />

      <div className="overflow-x-auto p-4">
        <div className="relative" ref={containerRef}>
          <div
            className="grid gap-1 min-w-[760px]"
            style={{ gridTemplateColumns: `130px repeat(${services.length}, minmax(48px, 1fr))` }}
          >
            <div className="h-8" />
            {services.map((service) => (
              <div
                key={service}
                className={`h-8 flex items-center justify-center text-[10px] font-mono px-0.5 rounded-t transition-colors ${
                  selectedEntity === service ? 'bg-cyan-50 text-cyan-700 font-semibold' : 'text-slate-500'
                }`}
                title={service}
              >
                <span className="block w-full truncate text-center">{service}</span>
              </div>
            ))}

            {dataTypes.map((dataType) => (
              <div key={dataType} className="contents">
                <div className="text-xs text-slate-600 font-medium flex items-center pr-2">{dataType}</div>
                {services.map((service) => {
                  const richness = coverage[dataType][service];
                  const isSelectedColumn = selectedEntity === service;
                  const { cell, icon: Icon, iconClass } = RICHNESS[richness];
                  return (
                    <div key={service} className={`flex items-center justify-center py-0.5 ${isSelectedColumn ? 'bg-cyan-50/60' : ''}`}>
                      <button
                        ref={(el) => {
                          cellRefs.current[cellKey(dataType, service)] = el;
                        }}
                        onClick={() => onCellClick(dataType, service, richness)}
                        title={`${dataType} · ${service} · ${richness}`}
                        className={`w-full h-6 rounded-sm flex items-center justify-center transition-colors ${cell} ${
                          isSelectedColumn ? 'ring-2 ring-cyan-400 ring-offset-1' : ''
                        }`}
                      >
                        <Icon className={`w-3 h-3 ${iconClass}`} />
                      </button>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          <TraversalOverlay points={traversalPoints} />
        </div>
      </div>
    </div>
  );
};

export default KnowledgeGapMap;
