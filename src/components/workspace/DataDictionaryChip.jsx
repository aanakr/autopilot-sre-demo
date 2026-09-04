import { Terminal } from 'lucide-react';

const DataDictionaryChip = ({ dataDictionary }) => (
  <div className="flex items-start gap-2 text-xs font-mono bg-slate-900 text-slate-100 rounded-md px-3 py-2">
    <Terminal className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
    <span>
      <span className="text-cyan-400">[Substrate Data Dictionary]</span> Mapped custom tag{' '}
      <span className="text-amber-300">&apos;{dataDictionary.customTag}&apos;</span> ➔ canonical OTel{' '}
      <span className="text-emerald-400">&apos;{dataDictionary.canonicalTag}&apos;</span> ({dataDictionary.matchPercent}% match)
    </span>
  </div>
);

export default DataDictionaryChip;
