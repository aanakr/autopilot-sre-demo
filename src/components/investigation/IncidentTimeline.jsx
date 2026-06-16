import { Clock, AlertTriangle, Activity, CheckCircle } from 'lucide-react';

/**
 * IncidentTimeline Component
 *
 * Horizontal timeline showing sequence of events
 * Color-coded by event type (change, alert, symptom, analysis)
 */
const IncidentTimeline = ({ timeline }) => {
  const getEventIcon = (type) => {
    switch (type) {
      case 'change':
        return <Activity className="w-4 h-4" />;
      case 'alert':
        return <AlertTriangle className="w-4 h-4" />;
      case 'symptom':
        return <AlertTriangle className="w-4 h-4" />;
      case 'analysis':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getEventColor = (type) => {
    switch (type) {
      case 'change':
        return 'text-electric-cyan bg-electric-cyan/10 border-electric-cyan/30';
      case 'alert':
        return 'text-danger bg-danger/10 border-danger/30';
      case 'symptom':
        return 'text-warning bg-warning/10 border-warning/30';
      case 'analysis':
        return 'text-electric-green bg-electric-green/10 border-electric-green/30';
      default:
        return 'text-muted bg-obsidian-700 border-obsidian-600';
    }
  };

  return (
    <div className="card mb-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-electric-cyan" />
        Incident Timeline
      </h3>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute top-8 left-0 right-0 h-0.5 bg-obsidian-600"></div>

        {/* Timeline Events */}
        <div className="flex justify-between relative">
          {timeline.map((event, index) => (
            <div key={index} className="flex flex-col items-center" style={{ width: `${100 / timeline.length}%` }}>
              {/* Event Icon */}
              <div className={`relative z-10 p-3 rounded-full border-2 ${getEventColor(event.type)}`}>
                {getEventIcon(event.type)}
              </div>

              {/* Event Details */}
              <div className="mt-4 text-center">
                <p className="text-xs text-muted mb-1">{event.time}</p>
                <p className="text-sm font-semibold mb-1">{event.event}</p>
                <p className="text-xs text-muted max-w-[120px]">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IncidentTimeline;
