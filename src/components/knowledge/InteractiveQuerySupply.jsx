import { useState } from 'react';
import { HelpCircle, Search } from 'lucide-react';

const InteractiveQuerySupply = () => {
  const [query, setQuery] = useState('');
  const [supplied, setSupplied] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const handleSubmit = () => {
    if (!supplied.trim()) return;
    setConfirmed(true);
  };

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-3">
        <HelpCircle className="w-4 h-4 text-knowledge-purple" />
        <h3 className="font-semibold text-gray-100">Interactive Query & Supply</h3>
      </div>

      <div className="flex items-center gap-2 bg-obsidian-900 border border-obsidian-600 rounded-md px-3 py-2 mb-3 focus-within:border-knowledge-purple transition-colors">
        <Search className="w-4 h-4 text-muted" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What info is missing for checkout-service?"
          className="flex-1 bg-transparent text-sm text-gray-300 placeholder:text-muted focus:outline-none"
        />
      </div>

      <textarea
        value={supplied}
        onChange={(e) => {
          setSupplied(e.target.value);
          setConfirmed(false);
        }}
        placeholder="Supply the missing runbook, topology link, or context in-place (Markdown supported)..."
        rows={4}
        className="w-full bg-obsidian-900 border border-obsidian-600 rounded-md text-sm font-mono text-gray-300 placeholder:text-muted px-3 py-2 focus:outline-none focus:border-knowledge-purple transition-colors resize-none"
      />

      <div className="flex items-center gap-3 mt-3">
        <button
          onClick={handleSubmit}
          className="bg-knowledge-purple text-obsidian-900 px-4 py-2 rounded-md font-semibold hover:bg-knowledge-emerald transition-colors text-sm"
        >
          Supply Data In-Place
        </button>
        {confirmed && <span className="text-sm text-knowledge-emerald">Saved to Knowledge Base ✓</span>}
      </div>
    </div>
  );
};

export default InteractiveQuerySupply;
