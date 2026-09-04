import { useMemo, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import KpiTiles from '../components/knowledge/KpiTiles';
import KnowledgeGapMap from '../components/knowledge/KnowledgeGapMap';
import GapDrawer from '../components/knowledge/GapDrawer';
import IncidentCard from '../components/knowledge/IncidentCard';
import GraduationBanner from '../components/knowledge/GraduationBanner';
import GraduationRubricModal from '../components/knowledge/GraduationRubricModal';
import { matrixDataTypes, matrixServices, baseMatrixCoverage, kpiStats } from '../utils/mockData';
import { getScenario } from '../utils/scenarios';
import { useAutopilot } from '../context/AutopilotContext';

const KnowledgePage = () => {
  const { activeScenarioId } = useAutopilot();
  const scenario = getScenario(activeScenarioId);

  const [coverageOverrides, setCoverageOverrides] = useState({});
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [gapCell, setGapCell] = useState(null);
  const [graduated, setGraduated] = useState(false);
  const [rubricOpen, setRubricOpen] = useState(false);
  const [toilReclaimed, setToilReclaimed] = useState(kpiStats.sreToilReclaimedHours);
  const [toast, setToast] = useState(null);

  const coverage = useMemo(() => {
    const merged = {};
    matrixDataTypes.forEach((dt) => {
      merged[dt] = { ...baseMatrixCoverage[dt] };
    });
    Object.entries(coverageOverrides).forEach(([key, richness]) => {
      const [dt, svc] = key.split('::');
      merged[dt][svc] = richness;
    });
    if (graduated) {
      merged['Runbooks']['payment-service'] = 'complete';
    }
    return merged;
  }, [coverageOverrides, graduated]);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3500);
  };

  const handleCellClick = (dataType, service, richness) => {
    setSelectedEntity(service);
    if (richness === 'gap') {
      setGapCell({ dataType, service });
    }
  };

  const handleSupplyContext = (dataType, service) => {
    setCoverageOverrides((prev) => ({ ...prev, [`${dataType}::${service}`]: 'thin' }));
  };

  const handleConfirmGraduation = () => {
    setGraduated(true);
    setRubricOpen(false);
    setToilReclaimed((prev) => prev + scenario.toilHoursReclaimed);
    showToast(`⚡ ${scenario.workflowName} graduated to a deterministic WIN Workflow.`);
  };

  const stats = { ...kpiStats, sreToilReclaimedHours: toilReclaimed };

  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Ground Truth Estate Readiness & Coverage Hub</h1>
        <p className="text-sm text-slate-500 mt-1 max-w-2xl">
          Enterprise-wide view of what the Substrate can reason over — telemetry, config, runbooks, retros, and
          ownership — across every core microservice.
        </p>
      </div>

      <KpiTiles stats={stats} />

      {scenario.id === 'S3' && (
        <GraduationBanner scenario={scenario} onGraduateClick={() => setRubricOpen(true)} graduated={graduated} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 items-start">
        <KnowledgeGapMap
          dataTypes={matrixDataTypes}
          services={matrixServices}
          coverage={coverage}
          selectedEntity={selectedEntity}
          onCellClick={handleCellClick}
          traversalPath={scenario.traversalPath}
          incidentId={scenario.incidentId}
        />

        <div className="space-y-4">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Active Incidents</h2>
          {scenario.hasWorkspace ? (
            <IncidentCard scenario={scenario} />
          ) : (
            <div className="card border-slate-200 text-sm text-slate-500">
              No active P1 — reviewing a recurring toil pattern on {scenario.entity} (see banner above).
            </div>
          )}
        </div>
      </div>

      <GapDrawer
        open={!!gapCell}
        onClose={() => setGapCell(null)}
        dataType={gapCell?.dataType}
        service={gapCell?.service}
        onSupplyContext={handleSupplyContext}
      />

      <GraduationRubricModal
        open={rubricOpen}
        scenario={scenario}
        onClose={() => setRubricOpen(false)}
        onConfirm={handleConfirmGraduation}
      />

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] bg-emerald-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> {toast}
        </div>
      )}
    </div>
  );
};

export default KnowledgePage;
