import { CheckCircle2, AlertTriangle } from 'lucide-react';

const ConnectorsManager = ({ connectors }) => (
  <div className="card">
    <h3 className="font-semibold text-gray-100 mb-3">Connectors Manager</h3>
    <p className="text-xs text-muted mb-4">
      Ingests from Slack, raw text, New Relic entities, and third-party integrations via connectors, MCP tools,
      or manual copy-paste.
    </p>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {connectors.map((connector) => (
        <div
          key={connector.id}
          className="flex items-center gap-2 text-sm bg-obsidian-900 border border-obsidian-600 rounded px-3 py-2"
        >
          {connector.status === 'connected' ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-electric-green flex-shrink-0" />
          ) : (
            <AlertTriangle className="w-3.5 h-3.5 text-warning flex-shrink-0" />
          )}
          <span className="text-gray-300 truncate">{connector.name}</span>
        </div>
      ))}
    </div>
  </div>
);

export default ConnectorsManager;
