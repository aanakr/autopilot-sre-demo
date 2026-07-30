import { useEffect, useState } from 'react';
import { Terminal } from 'lucide-react';

const ExecutionTerminal = ({ execution }) => {
  const [visibleCount, setVisibleCount] = useState(1);

  useEffect(() => {
    if (visibleCount >= execution.logLines.length) return;
    const timeout = setTimeout(() => setVisibleCount((c) => c + 1), 700);
    return () => clearTimeout(timeout);
  }, [visibleCount, execution.logLines.length]);

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-3">
        <Terminal className="w-4 h-4 text-electric-cyan" />
        <h3 className="font-semibold text-gray-100">⚡ Action Executing via {execution.commandLabel}</h3>
      </div>
      <pre className="font-mono text-xs bg-obsidian-900 border border-obsidian-600 rounded p-3 text-gray-400 space-y-1 overflow-x-auto">
        <div className="text-electric-green">$ {execution.command}</div>
        {execution.logLines.slice(0, visibleCount).map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </pre>
      <p className="text-xs text-muted mt-2">
        Native NRDB telemetry — no third-party API calls, no rate-limit exposure.
      </p>
    </div>
  );
};

export default ExecutionTerminal;
