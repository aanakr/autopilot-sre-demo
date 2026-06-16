import { ArrowLeft } from 'lucide-react';

/**
 * BackButton Component
 *
 * Reusable back navigation button
 * Prevents "dead end" UI states by providing clear exit path
 *
 * Usage:
 *   <BackButton onClick={() => navigate(-1)} />
 *   <BackButton onClick={() => navigate('/')} label="Back to Home" />
 */
const BackButton = ({ onClick, label = 'Back' }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 text-electric-cyan hover:text-electric-green transition-colors mb-6 group"
    >
      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
      <span className="font-medium">{label}</span>
    </button>
  );
};

export default BackButton;
