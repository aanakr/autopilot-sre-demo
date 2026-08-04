import { AlertTriangle } from 'lucide-react';

const TILES = [
  { key: 'coverageGaps', label: 'Coverage Gaps', hint: 'across the full 11×12 coverage grid' },
  { key: 'servicesAtRisk', label: 'Services at Risk', hint: 'thin telemetry — the agent flies blind here' },
  { key: 'missingRunbooks', label: 'Missing Runbooks', hint: 'services without a runbook the agent can cite' },
  { key: 'runsHitGap', label: 'Runs Hit a Gap', hint: 'investigations slowed by missing data' },
];

const MatrixStatTiles = ({ stats }) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
    {TILES.map((tile) => (
      <div key={tile.key} className="card border-danger/30 bg-danger/5">
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle className="w-4 h-4 text-danger flex-shrink-0" />
          <span className="text-2xl font-bold text-gray-100">{stats[tile.key]}</span>
        </div>
        <p className="text-xs font-semibold text-gray-300">{tile.label}</p>
        <p className="text-xs text-muted mt-1">{tile.hint}</p>
      </div>
    ))}
  </div>
);

export default MatrixStatTiles;
