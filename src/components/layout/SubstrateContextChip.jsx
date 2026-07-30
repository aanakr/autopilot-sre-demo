import { useAutopilot } from '../../context/AutopilotContext';

/**
 * Ambient badge showing the active account and guardrail status.
 * Reused on the Home and Thread screens.
 */
const SubstrateContextChip = ({ syncedWith }) => {
  const { account } = useAutopilot();

  return (
    <div className="inline-flex items-center gap-2 text-xs font-mono bg-obsidian-800 border border-obsidian-600 rounded-full px-3 py-1.5">
      <span className="w-1.5 h-1.5 rounded-full bg-electric-green animate-pulse-slow" />
      {syncedWith ? (
        <span className="text-gray-300">
          Substrate Context: Synchronized with <span className="text-electric-cyan">{syncedWith}</span>
        </span>
      ) : (
        <span className="text-gray-300">
          Substrate Context: Active Account: <span className="text-gray-100">{account.name}</span>
          <span className="text-muted"> | </span>
          Guardrail Gateway: <span className="text-electric-green">{account.guardrails}</span>
        </span>
      )}
    </div>
  );
};

export default SubstrateContextChip;
