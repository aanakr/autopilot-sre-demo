import { useRef, useState } from 'react';
import { Download, Sparkles } from 'lucide-react';
import MatrixStatTiles from '../components/matrix/MatrixStatTiles';
import CoverageGrid from '../components/matrix/CoverageGrid';
import AgentRunsPanel from '../components/matrix/AgentRunsPanel';
import RunbookGapDrawer from '../components/matrix/RunbookGapDrawer';
import GroundTruthSdkCard from '../components/matrix/GroundTruthSdkCard';
import {
  matrixDataTypes,
  matrixServices,
  matrixWorkloads,
  matrixCoverage,
  matrixStats,
  agentRuns,
  groundTruthSdk,
} from '../utils/mockData';

const HERO_RUN_ID = 'run-inc-8472';

const SubstrateMatrixPage = () => {
  const [selectedRunId, setSelectedRunId] = useState(null);
  const [gapCell, setGapCell] = useState(null); // { dataType, service }
  const runsPanelRef = useRef(null);

  const selectedRun = agentRuns.find((r) => r.id === selectedRunId);

  const handleAnalyzeAndFix = () => {
    setSelectedRunId(HERO_RUN_ID);
    runsPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Ground Truth</h1>
          <p className="text-sm text-muted mt-1 max-w-2xl">
            Every piece of data the agent can reason over — MELT telemetry, config, runbooks, retros, ownership.
            Pick a past run to see the path it took through the data, and where gaps slowed it down.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleAnalyzeAndFix}
            className="btn-primary flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" /> Analyze &amp; Fix
          </button>
          <button
            className="btn-secondary flex items-center gap-2"
            disabled
            title="Not available in this MVP"
          >
            <Download className="w-4 h-4" /> Export report
          </button>
        </div>
      </div>

      <MatrixStatTiles stats={matrixStats} />

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 items-start">
        <CoverageGrid
          dataTypes={matrixDataTypes}
          services={matrixServices}
          workloads={matrixWorkloads}
          coverage={matrixCoverage}
          selectedRun={selectedRun}
          onCellClick={(dataType, service) => setGapCell({ dataType, service })}
        />

        <div ref={runsPanelRef}>
          <AgentRunsPanel
            runs={agentRuns}
            selectedRunId={selectedRunId}
            onSelectRun={setSelectedRunId}
            onClearSelection={() => setSelectedRunId(null)}
          />
        </div>
      </div>

      <GroundTruthSdkCard sdk={groundTruthSdk} />

      <RunbookGapDrawer
        open={!!gapCell}
        onClose={() => setGapCell(null)}
        dataType={gapCell?.dataType}
        service={gapCell?.service}
      />
    </div>
  );
};

export default SubstrateMatrixPage;
