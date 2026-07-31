import { useEffect, useState } from 'react';

const VIRTUAL_SECONDS_PER_TICK = 15;
const TICK_INTERVAL_MS = 500;
const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

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

  const progress = elapsed / totalSeconds;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  return (
    <div className="card">
      <h3 className="font-semibold text-gray-100 mb-3">⏳ Post-Remediation SLO Validation Timer</h3>
      <div className="flex items-center gap-6">
        <div className="relative w-28 h-28 flex-shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle cx="50" cy="50" r={RADIUS} fill="none" stroke="#1F2430" strokeWidth="8" />
            <circle
              cx="50"
              cy="50"
              r={RADIUS}
              fill="none"
              stroke="#10B981"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
              className="transition-all"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-sm font-mono text-gray-100">{formatMinutes(elapsed)}</span>
            <span className="text-xs font-mono text-muted">/ {formatMinutes(totalSeconds)}</span>
          </div>
        </div>

        <div className="flex-1">
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
      </div>
    </div>
  );
};

export default ValidationCountdown;
