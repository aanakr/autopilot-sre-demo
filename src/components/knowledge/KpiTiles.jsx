import { Activity, ShieldAlert, BookX, RouteOff, Clock, GraduationCap } from 'lucide-react';

const RADIUS = 26;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const StatRing = ({ percent, color }) => {
  const dashOffset = CIRCUMFERENCE * (1 - percent / 100);
  return (
    <div className="relative w-16 h-16 flex-shrink-0">
      <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
        <circle cx="32" cy="32" r={RADIUS} fill="none" stroke="#E2E8F0" strokeWidth="6" />
        <circle
          cx="32"
          cy="32"
          r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-mono font-semibold text-slate-700">{percent.toFixed(1)}%</span>
      </div>
    </div>
  );
};

const Tile = ({ icon: Icon, iconClass, label, headline, sub, borderClass = '' }) => (
  <div className={`card flex items-center gap-3 ${borderClass}`}>
    <Icon className={`w-8 h-8 flex-shrink-0 ${iconClass}`} />
    <div>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</p>
      <p className="text-lg font-bold text-slate-900">{headline}</p>
      <p className="text-xs text-slate-400">{sub}</p>
    </div>
  </div>
);

const SelfHealingBar = ({ selfHealing }) => (
  <div className="card">
    <div className="flex items-center justify-between mb-2">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
        ROI Moat: AI Self-Healing Success Rate
      </p>
      <p className="text-xs text-slate-400 font-mono">Last 30 days</p>
    </div>
    <div className="flex h-6 rounded-md overflow-hidden border border-slate-200">
      <div
        className="bg-emerald-500 flex items-center justify-center text-[11px] font-mono font-semibold text-white"
        style={{ width: `${selfHealing.automatedPercent}%` }}
      >
        {selfHealing.automatedPercent}%
      </div>
      <div
        className="bg-amber-400 flex items-center justify-center text-[11px] font-mono font-semibold text-white"
        style={{ width: `${selfHealing.guidedPercent}%` }}
      >
        {selfHealing.guidedPercent}%
      </div>
    </div>
    <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
      <span className="flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> Automated (Single-Click HITL)
      </span>
      <span className="flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-sm bg-amber-400" /> SRE-Guided Triage
      </span>
    </div>
  </div>
);

const KpiTiles = ({ stats }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Tile
        icon={ShieldAlert}
        iconClass="text-rose-500"
        label="Coverage Gaps"
        headline={`${stats.coverageGaps.count} Gaps`}
        sub={`${stats.coverageGaps.coveragePercent}% Coverage across core services`}
        borderClass="border-rose-200"
      />
      <Tile
        icon={RouteOff}
        iconClass="text-amber-500"
        label="Services at Risk"
        headline={`${stats.servicesAtRisk.atRisk} / ${stats.servicesAtRisk.total} Microservices`}
        sub="Thin telemetry — reduced agent confidence"
        borderClass="border-amber-200"
      />
      <Tile
        icon={BookX}
        iconClass="text-amber-500"
        label="Missing Runbooks"
        headline={`${stats.missingRunbooks.missing} / ${stats.missingRunbooks.total} Services`}
        sub="Lacking indexed operational runbooks"
        borderClass="border-amber-200"
      />
      <Tile
        icon={RouteOff}
        iconClass="text-rose-500"
        label="Runs Hit a Gap"
        headline={`${stats.runsHitGap.hit} / ${stats.runsHitGap.total} Runs`}
        sub="Recent investigations stalled by a gap"
        borderClass="border-rose-200"
      />
    </div>

    <SelfHealingBar selfHealing={stats.selfHealing} />

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Tile
        icon={Clock}
        iconClass="text-emerald-500"
        label="SRE Toil Reclaimed"
        headline={`${stats.sreToilReclaimedHours} Hours`}
        sub={
          <span className="flex items-center gap-1">
            <Activity className="w-3 h-3" /> Calculated savings this month
          </span>
        }
      />
      <div className="card flex items-center gap-4">
        <StatRing percent={stats.knowledgeCuration.percent} color="#8B5CF6" />
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-purple-500" /> Knowledge Curation Score
          </p>
          <p className="text-lg font-bold text-slate-900">{stats.knowledgeCuration.percent}%</p>
          <p className="text-xs text-slate-400">
            {stats.knowledgeCuration.initialGaps} initial gaps → {stats.knowledgeCuration.cured} cured →{' '}
            {stats.knowledgeCuration.active} active
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default KpiTiles;
