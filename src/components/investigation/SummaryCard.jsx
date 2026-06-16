import { FileText } from 'lucide-react';

/**
 * SummaryCard Component
 *
 * Displays incident summary as bullet points
 * Clear, concise overview of the situation
 */
const SummaryCard = ({ summary, severity, status }) => {
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return 'text-danger bg-danger/10 border-danger/30';
      case 'HIGH':
        return 'text-warning bg-warning/10 border-warning/30';
      case 'MEDIUM':
        return 'text-electric-cyan bg-electric-cyan/10 border-electric-cyan/30';
      case 'LOW':
        return 'text-muted bg-obsidian-700 border-obsidian-600';
      default:
        return 'text-muted bg-obsidian-700 border-obsidian-600';
    }
  };

  return (
    <div className="card mb-6">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <FileText className="w-5 h-5 text-electric-green" />
          Incident Summary
        </h3>

        <div className="flex gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(severity)}`}>
            {severity}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
            status === 'ONGOING' ? 'text-warning bg-warning/10 border-warning/30' : 'text-success bg-success/10 border-success/30'
          }`}>
            {status}
          </span>
        </div>
      </div>

      <ul className="space-y-3">
        {summary.map((item, index) => (
          <li key={index} className="flex items-start gap-3">
            <span className="text-electric-green mt-1">●</span>
            <span className="text-gray-300 flex-1">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SummaryCard;
