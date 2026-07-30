import { useState } from 'react';

const MemoryFactsList = ({ facts, onAddFact }) => {
  const [scope, setScope] = useState('User');
  const [text, setText] = useState('');

  const handleAdd = () => {
    onAddFact(scope, text);
    setText('');
  };

  return (
    <div className="card space-y-3">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-semibold text-gray-100">Managed Memory Facts (CMS Storage)</h3>
        <span className="text-xs text-muted font-mono">Backed by Valkey CMS</span>
      </div>
      {facts.map((fact) => (
        <p key={fact.id} className="text-sm text-gray-300 font-mono">
          [{fact.scope} Scope] &ldquo;{fact.text}&rdquo;
        </p>
      ))}

      <div className="flex flex-wrap gap-2 pt-2 border-t border-obsidian-600">
        <select
          value={scope}
          onChange={(e) => setScope(e.target.value)}
          className="bg-obsidian-900 border border-obsidian-600 rounded text-sm text-gray-300 px-2 py-1.5 focus:outline-none"
        >
          <option value="User">User</option>
          <option value="Account">Account</option>
          <option value="Organization">Organization</option>
        </select>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Add a memory fact..."
          className="flex-1 min-w-[12rem] bg-obsidian-900 border border-obsidian-600 rounded text-sm text-gray-300 placeholder:text-muted px-2 py-1.5 focus:outline-none focus:border-knowledge-purple"
        />
        <button onClick={handleAdd} className="btn-secondary text-sm">
          ✏️ Add Memory Fact
        </button>
      </div>
    </div>
  );
};

export default MemoryFactsList;
