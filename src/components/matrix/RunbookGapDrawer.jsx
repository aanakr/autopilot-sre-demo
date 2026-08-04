import { useState } from 'react';
import { Copy, Check, AlertTriangle } from 'lucide-react';
import SlideOverDrawer from '../knowledge/SlideOverDrawer';
import { runbookGapDetail } from '../../utils/mockData';

const InfoRow = ({ label, value }) => (
  <div className="bg-obsidian-900 border border-obsidian-600 rounded px-2 py-1.5">
    <p className="text-muted">{label}</p>
    <p className="text-gray-200 font-mono">{value}</p>
  </div>
);

const RunbookGapDrawer = ({ open, onClose, dataType, service }) => {
  const [copied, setCopied] = useState(false);
  const detail = service ? runbookGapDetail[service] : null;

  const handleCopy = () => {
    if (!detail) return;
    navigator.clipboard?.writeText(detail.yaml);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <SlideOverDrawer
      open={open}
      onClose={onClose}
      title={service ? `Knowledge · Service — ${service} · ${dataType}` : ''}
      accentClass="border-warning/40"
    >
      {open && !detail && service && (
        <div className="p-3 bg-warning/5 border border-warning/40 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-300">
              {service} is missing {dataType.toLowerCase()} coverage. No reference implementation is authored for
              this cell yet in the current build.
            </p>
          </div>
        </div>
      )}

      {detail && (
        <div className="space-y-4">
          <p className="text-xs text-muted">team: {detail.team}</p>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <InfoRow label="Source" value={detail.source} />
            <InfoRow label="Retention" value={detail.retention} />
            <InfoRow label="Freshness" value={detail.freshness} />
            <InfoRow label="Completeness" value={detail.completeness} />
            <InfoRow label="Samples/24h" value={detail.samplesPerDay} />
            <InfoRow label="RTO" value={detail.rto} />
          </div>

          <div className="card border-warning/40 bg-warning/5">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[10px] text-warning uppercase tracking-wide font-semibold">
                {detail.reference.kicker}
              </p>
              <span className="text-[10px] bg-warning/20 text-warning px-1.5 py-0.5 rounded font-bold">
                {detail.reference.badge}
              </span>
            </div>
            <p className="text-sm font-semibold text-gray-100 mb-2">{detail.reference.title}</p>
            <p className="text-sm text-gray-300 mb-3">{detail.reference.body}</p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {detail.reference.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] bg-obsidian-900 border border-obsidian-600 text-gray-300 px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            <ul className="space-y-1">
              {detail.reference.checklist.map((item) => (
                <li key={item} className="text-xs text-gray-300 flex items-start gap-1.5">
                  <span className="text-warning">□</span> {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-muted uppercase tracking-wide">.newrelic/runbook.md</p>
              <button
                onClick={handleCopy}
                className="text-xs text-electric-cyan hover:text-electric-green flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="text-xs font-mono text-gray-300 bg-obsidian-900 border border-obsidian-600 rounded-lg p-3 overflow-x-auto whitespace-pre">
              {detail.yaml}
            </pre>
          </div>
        </div>
      )}
    </SlideOverDrawer>
  );
};

export default RunbookGapDrawer;
