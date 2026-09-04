import { useState } from 'react';
import { AlertTriangle, Send, CheckCircle2 } from 'lucide-react';
import SlideOverDrawer from './SlideOverDrawer';
import { runbookGapDetail } from '../../utils/mockData';

const DEFAULT_IMPACT_SCORE = 6.4;

const InfoRow = ({ label, value }) => (
  <div className="bg-slate-50 border border-slate-200 rounded px-2 py-1.5">
    <p className="text-slate-400">{label}</p>
    <p className="text-slate-800 font-mono">{value}</p>
  </div>
);

const GapDrawer = ({ open, onClose, dataType, service, onSupplyContext }) => {
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const detail = service ? runbookGapDetail[service] : null;
  const impactScore = detail?.impactScore ?? DEFAULT_IMPACT_SCORE;

  const handleSubmit = () => {
    if (!text.trim()) return;
    onSupplyContext?.(dataType, service, text.trim());
    setSubmitted(true);
  };

  const handleClose = () => {
    setText('');
    setSubmitted(false);
    onClose();
  };

  return (
    <SlideOverDrawer
      open={open}
      onClose={handleClose}
      title={service ? `Knowledge Gap — ${service} · ${dataType}` : ''}
      accentClass="border-red-200"
    >
      {open && service && (
        <div className="space-y-4">
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-slate-700">
                  {service} is missing {dataType.toLowerCase()} coverage.
                </p>
                <p className="text-sm font-mono font-semibold text-red-600 mt-1">
                  Impact: {impactScore.toFixed(1)}/10
                </p>
              </div>
            </div>
          </div>

          {detail && (
            <>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <InfoRow label="Source" value={detail.source} />
                <InfoRow label="Retention" value={detail.retention} />
                <InfoRow label="Freshness" value={detail.freshness} />
                <InfoRow label="Completeness" value={detail.completeness} />
              </div>

              <div className="card border-amber-200 bg-amber-50">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[10px] text-amber-700 uppercase tracking-wide font-semibold">
                    {detail.reference.kicker}
                  </p>
                  <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold">
                    {detail.reference.badge}
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-800 mb-2">{detail.reference.title}</p>
                <p className="text-sm text-slate-600 mb-3">{detail.reference.body}</p>
                <ul className="space-y-1">
                  {detail.reference.checklist.map((item) => (
                    <li key={item} className="text-xs text-slate-600 flex items-start gap-1.5">
                      <span className="text-amber-500">□</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Supply Context In-Place
            </p>
            {submitted ? (
              <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                Context received — coverage upgraded to Thin. Full richness requires a versioned runbook.
              </div>
            ) : (
              <>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={`Paste a runbook, symptom → fix mapping, or metric override for ${service}...`}
                  rows={5}
                  className="w-full text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-cyan-400"
                />
                <button
                  onClick={handleSubmit}
                  disabled={!text.trim()}
                  className="btn-primary mt-2 flex items-center gap-2 text-sm"
                >
                  <Send className="w-3.5 h-3.5" /> Supply Context
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </SlideOverDrawer>
  );
};

export default GapDrawer;
