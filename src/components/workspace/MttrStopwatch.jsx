import { useEffect, useState } from 'react';
import { Timer } from 'lucide-react';

const format = (totalSeconds) => {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
};

const MttrStopwatch = ({ detectedMinutesAgo }) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(detectedMinutesAgo * 60);

  useEffect(() => {
    setElapsedSeconds(detectedMinutesAgo * 60);
    const interval = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [detectedMinutesAgo]);

  return (
    <div className="inline-flex items-center gap-1.5 text-xs font-mono bg-obsidian-900 border border-obsidian-600 rounded px-2 py-1 text-gray-300">
      <Timer className="w-3.5 h-3.5 text-warning" />
      MTTR: <span className="text-warning">{format(elapsedSeconds)}</span>
    </div>
  );
};

export default MttrStopwatch;
