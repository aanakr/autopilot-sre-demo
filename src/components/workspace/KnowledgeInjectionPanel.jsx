import { useState } from 'react';
import { AlertTriangle, Zap, Loader2 } from 'lucide-react';

const KnowledgeInjectionPanel = ({ message, knowledgeInjection, onRecalculate }) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRecalculate = () => {
    if (!text.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onRecalculate?.();
    }, 900);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-slate-700">{message}</p>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
          Interactive Knowledge Ingestion
        </h3>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={knowledgeInjection.placeholder}
          rows={6}
          className="w-full text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-cyan-400"
        />
        <button
          onClick={handleRecalculate}
          disabled={!text.trim() || loading}
          className="btn-primary mt-2 w-full flex items-center justify-center gap-2 text-sm"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Recalculating causal graph...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" /> Recalculate & Revise Analysis
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default KnowledgeInjectionPanel;
