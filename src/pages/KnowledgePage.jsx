import { useState } from 'react';
import { Search, Layers } from 'lucide-react';
import RunbookCard from '../components/knowledge/RunbookCard';
import RoiWidget from '../components/knowledge/RoiWidget';
import ConnectorsManager from '../components/knowledge/ConnectorsManager';
import KnowledgeGapWidget from '../components/knowledge/KnowledgeGapWidget';
import EntityMemoryPreviewCard from '../components/knowledge/EntityMemoryPreviewCard';
import { knowledgeBase, entityMemory } from '../utils/mockData';

const KnowledgePage = () => {
  const [query, setQuery] = useState('');

  const filteredRunbooks = knowledgeBase.runbooks.filter((r) =>
    `${r.id} ${r.title} ${r.summary}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-3xl space-y-8 border-t-2 border-knowledge-purple/40 pt-6 -mt-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-100">Organizational Knowledge & Living Runbook Repository</h1>
          <p className="text-sm text-muted mt-1">
            Search across 1,240 indexed postmortems, Confluence runbooks, and ChatOps triage threads.
          </p>
        </div>
        <span className="flex items-center gap-1.5 text-xs font-mono bg-knowledge-purple/10 border border-knowledge-purple/40 text-knowledge-purple rounded-full px-3 py-1.5 flex-shrink-0">
          <Layers className="w-3.5 h-3.5" /> Knowledge Mode
        </span>
      </div>

      <div className="flex items-center gap-2 bg-obsidian-800 border border-obsidian-600 rounded-md px-3 py-2 focus-within:border-knowledge-purple transition-colors">
        <Search className="w-4 h-4 text-muted" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search knowledge base, runbooks, retros..."
          className="flex-1 bg-transparent text-sm text-gray-300 placeholder:text-muted focus:outline-none"
        />
      </div>

      <ConnectorsManager connectors={knowledgeBase.connectors} />

      <KnowledgeGapWidget gap={knowledgeBase.knowledgeGap} />

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-muted uppercase tracking-wide">Living Runbook Cards</h2>
          <span className="text-xs text-muted font-mono">Indexed via Pinecone RAG</span>
        </div>
        <div className="space-y-4">
          {filteredRunbooks.map((runbook) => (
            <RunbookCard key={runbook.id} runbook={runbook} />
          ))}
          {filteredRunbooks.length === 0 && (
            <p className="text-sm text-muted">No runbooks match &ldquo;{query}&rdquo;.</p>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">
          Entity Operational Memory (Shift Handoffs)
        </h2>
        <EntityMemoryPreviewCard memory={entityMemory['checkout-service']} />
      </div>

      <RoiWidget roi={knowledgeBase.roi} />
    </div>
  );
};

export default KnowledgePage;
