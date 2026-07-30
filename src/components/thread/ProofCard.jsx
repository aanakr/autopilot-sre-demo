const ProofCard = ({ evidence }) => (
  <div className="space-y-2">
    {evidence.map((item) => (
      <div
        key={item.label}
        className="font-mono text-xs bg-obsidian-900 border border-obsidian-600 rounded px-3 py-2 text-gray-400 hover:border-electric-cyan transition-colors cursor-pointer"
      >
        <span className="text-electric-cyan">• {item.label}:</span>{' '}
        {item.traceId ? (
          <>
            trace.id=<span className="text-gray-200">{item.traceId}</span>
            {' '}(Duration: <span className="text-warning">{item.durationMs}ms</span>
            {' '}| Exception: <span className="text-danger">{item.exception}</span>)
          </>
        ) : (
          <span className="text-gray-300">{item.detail}</span>
        )}
      </div>
    ))}
  </div>
);

export default ProofCard;
