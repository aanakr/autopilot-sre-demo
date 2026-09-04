import { X } from 'lucide-react';

const SlideOverDrawer = ({ open, title, onClose, children, accentClass = 'border-cyan-200' }) => (
  <div className={`fixed inset-0 z-[60] ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
    <div
      onClick={onClose}
      className={`absolute inset-0 bg-slate-900/30 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
    />
    <div
      className={`absolute top-0 right-0 h-full w-full max-w-md bg-white border-l ${accentClass} shadow-2xl transition-transform duration-300 ${
        open ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
        <h3 className="font-semibold text-slate-800">{title}</h3>
        <button onClick={onClose} aria-label="Close" className="text-slate-400 hover:text-slate-700 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-5 overflow-y-auto h-[calc(100%-4rem)]">{children}</div>
    </div>
  </div>
);

export default SlideOverDrawer;
