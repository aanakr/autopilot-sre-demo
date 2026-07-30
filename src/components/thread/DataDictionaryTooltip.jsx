import { Terminal } from 'lucide-react';

const DataDictionaryTooltip = ({ dataDictionary }) => (
  <div className="inline-flex items-center gap-2 text-xs font-mono bg-obsidian-900 border border-obsidian-600 rounded px-3 py-2 text-gray-400">
    <Terminal className="w-3.5 h-3.5 text-electric-cyan flex-shrink-0" />
    <span>
      [Substrate Data Dictionary] Mapped custom tag &apos;<span className="text-warning">{dataDictionary.customTag}</span>&apos;
      {' '}→ canonical OTel &apos;<span className="text-electric-green">{dataDictionary.canonicalTag}</span>&apos;
      {' '}({dataDictionary.matchPercent}% match)
    </span>
  </div>
);

export default DataDictionaryTooltip;
