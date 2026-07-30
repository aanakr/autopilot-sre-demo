import { useState } from 'react';
import { Search } from 'lucide-react';
import RunbookCard from '../components/knowledge/RunbookCard';
import RoiWidget from '../components/knowledge/RoiWidget';
import { knowledgeBase } from '../utils/mockData';

const KnowledgePage = () => {
  const [query, setQuery] = useState('');

  const filteredRunbooks = knowledgeBase.runbooks.filter((r) =>
    `${r.id} ${r.title} ${r.summary}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-xl font-bold text-gray-100">Organizational Knowledge & Living Runbook Repository</h1>
        <p className="text-sm text-muted mt-1">
          Search across 1,240 indexed postmortems, Confluence runbooks, and ChatOps triage threads.
        </p>
      </div>

      <div className="flex items-center gap-2 bg-obsidian-800 border border-obsidian-600 rounded-md px-3 py-2">
        <Search className="w-4 h-4 text-muted" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search knowledge base, runbooks, retros..."
          className="flex-1 bg-transparent text-sm text-gray-300 placeholder:text-muted focus:outline-none"
        />
      </div>

      <div>
        <h2 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">Living Runbook Cards</h2>
        <div className="space-y-4">
          {filteredRunbooks.map((runbook) => (
            <RunbookCard key={runbook.id} runbook={runbook} />
          ))}
          {filteredRunbooks.length === 0 && (
            <p className="text-sm text-muted">No runbooks match &ldquo;{query}&rdquo;.</p>
          )}
        </div>
      </div>

      <RoiWidget roi={knowledgeBase.roi} />
    </div>
  );
};

export default KnowledgePage;
