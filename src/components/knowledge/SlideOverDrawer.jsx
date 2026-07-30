import { X } from 'lucide-react';

const SlideOverDrawer = ({ open, title, onClose, children }) => (
  <div className={`fixed inset-0 z-[60] ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
    <div
      onClick={onClose}
      className={`absolute inset-0 bg-black/60 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
    />
    <div
      className={`absolute top-0 right-0 h-full w-full max-w-md bg-obsidian-800 border-l border-knowledge-purple/40 shadow-2xl transition-transform duration-300 ${
        open ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-obsidian-600">
        <h3 className="font-semibold text-gray-100">{title}</h3>
        <button onClick={onClose} className="text-muted hover:text-gray-200 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-5 overflow-y-auto h-[calc(100%-4rem)]">{children}</div>
    </div>
  </div>
);

export default SlideOverDrawer;
