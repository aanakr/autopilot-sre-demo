import { useState } from 'react';

const RICHNESS_STYLES = {
  missing: 'bg-danger w-2 h-2',
  thin: 'bg-warning w-2.5 h-2.5',
  ok: 'bg-electric-green/60 w-3 h-3',
  rich: 'bg-electric-green w-3.5 h-3.5',
};

const RICHNESS_RANK = { missing: 0, thin: 1, ok: 2, rich: 3 };

const TABS = [
  { id: 'service', label: 'Service' },
  { id: 'workload', label: 'Workload' },
  { id: 'estate', label: 'Estate', disabled: true },
];

const LegendDot = ({ richness, label }) => (
  <span className="flex items-center gap-1">
    <span className={`rounded-full ${RICHNESS_STYLES[richness]}`} />
    {label}
  </span>
);

const aggregateRichness = (values) =>
  values.reduce((worst, val) => (RICHNESS_RANK[val] < RICHNESS_RANK[worst] ? val : worst), 'rich');

const CoverageGrid = ({ dataTypes, services, workloads, coverage, selectedRun, onCellClick }) => {
  const [tab, setTab] = useState('service');

  const columns =
    tab === 'workload'
      ? workloads.map((w) => ({ id: w.id, label: w.label, subtitle: w.subtitle, members: w.services }))
      : services.map((s) => ({ id: s, label: s, members: [s] }));

  const cellRichness = (dataType, column) =>
    aggregateRichness(column.members.map((svc) => coverage[dataType][svc]));

  const worstMember = (dataType, column) => {
    const richness = cellRichness(dataType, column);
    return column.members.find((svc) => coverage[dataType][svc] === richness) ?? column.members[0];
  };

  const columnIndexForService = (serviceId) => columns.findIndex((col) => col.members.includes(serviceId));

  const pathPoints = (selectedRun?.path ?? [])
    .map((step) => {
      const colIdx = columnIndexForService(step.service);
      const rowIdx = dataTypes.indexOf(step.dataType);
      if (colIdx === -1 || rowIdx === -1) return null;
      const x = ((colIdx + 0.5) / columns.length) * 100;
      const y = ((rowIdx + 0.5) / dataTypes.length) * 100;
      return `${x},${y}`;
    })
    .filter(Boolean);

  return (
    <div className="card !p-0 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-obsidian-600">
        <div className="flex items-center gap-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => !t.disabled && setTab(t.id)}
              disabled={t.disabled}
              title={t.disabled ? 'Not available in this MVP' : undefined}
              className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-colors ${
                tab === t.id
                  ? 'bg-electric-cyan/10 text-electric-cyan'
                  : t.disabled
                    ? 'text-muted/50 cursor-not-allowed'
                    : 'text-muted hover:text-gray-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 text-xs text-muted flex-wrap">
          <LegendDot richness="missing" label="missing" />
          <LegendDot richness="thin" label="thin" />
          <LegendDot richness="ok" label="ok" />
          <LegendDot richness="rich" label="rich" />
        </div>
      </div>

      <div className="overflow-x-auto p-4">
        <div className="relative min-w-[600px]">
          <div
            className="grid gap-y-1"
            style={{ gridTemplateColumns: `140px repeat(${columns.length}, minmax(32px, 1fr))` }}
          >
            <div className="h-6" />
            {columns.map((col) => (
              <div
                key={col.id}
                className="h-6 min-w-0 flex items-center justify-center text-[10px] text-muted font-mono px-0.5"
                title={col.subtitle ?? col.label}
              >
                <span className="block w-full truncate text-center">{col.label}</span>
              </div>
            ))}

            {dataTypes.map((dataType) => (
              <div key={dataType} className="contents">
                <div className="text-xs text-gray-300 font-medium flex items-center">{dataType}</div>
                {columns.map((col) => {
                  const richness = cellRichness(dataType, col);
                  const clickable = richness === 'missing' || richness === 'thin';
                  return (
                    <div key={col.id} className="flex items-center justify-center py-1.5">
                      <button
                        onClick={() => clickable && onCellClick(dataType, worstMember(dataType, col))}
                        disabled={!clickable}
                        title={`${dataType} · ${col.label} · ${richness}`}
                        className={`rounded-full transition-transform ${RICHNESS_STYLES[richness]} ${
                          clickable ? 'hover:scale-125 cursor-pointer' : 'cursor-default'
                        }`}
                      />
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {selectedRun && pathPoints.length > 1 && (
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="pointer-events-none absolute right-0 bottom-0"
              style={{ left: '140px', top: '24px' }}
            >
              <polyline
                points={pathPoints.join(' ')}
                fill="none"
                stroke="#06B6D4"
                strokeWidth="0.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoverageGrid;
