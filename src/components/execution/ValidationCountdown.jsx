import { useEffect, useState } from 'react';

const VIRTUAL_SECONDS_PER_TICK = 15;
const TICK_INTERVAL_MS = 500;

const formatMinutes = (totalSeconds) => {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
};

const ValidationCountdown = ({ validation, onComplete }) => {
  const { totalSeconds, seedElapsedSeconds, rollbackThresholdMs, baselineP95Ms, baselineErrorRate } = validation;
  const [elapsed, setElapsed] = useState(seedElapsedSeconds);

  useEffect(() => {
    if (elapsed >= totalSeconds) {
      onComplete?.();
      return;
    }
    const interval = setInterval(() => {
      setElapsed((prev) => Math.min(prev + VIRTUAL_SECONDS_PER_TICK, totalSeconds));
    }, TICK_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [elapsed, totalSeconds, onComplete]);

  const progressPercent = Math.round((elapsed / totalSeconds) * 100);

  return (
    <div className="card">
      <h3 className="font-semibold text-gray-100 mb-3">⏳ Post-Remediation SLO Validation Timer</h3>
      <div className="w-full h-2 bg-obsidian-900 border border-obsidian-600 rounded-full overflow-hidden mb-2">
        <div
          className="h-full bg-electric-green transition-all"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <p className="text-xs font-mono text-muted mb-4">
        {formatMinutes(elapsed)} / {formatMinutes(totalSeconds)} min
      </p>
      <p className="text-sm text-gray-300 mb-1">
        Golden Signal Status: P95 Latency returned to baseline (
        <span className="text-electric-green font-mono">{baselineP95Ms}ms</span>) | Error Rate:{' '}
        <span className="text-electric-green font-mono">{baselineErrorRate.toFixed(2)}%</span>
      </p>
      <p className="text-xs text-muted">
        Auto-Rollback Trigger: <span className="text-warning">ACTIVE</span> (Will trigger if P95 exceeds{' '}
        {rollbackThresholdMs}ms)
      </p>
    </div>
  );
};

export default ValidationCountdown;
