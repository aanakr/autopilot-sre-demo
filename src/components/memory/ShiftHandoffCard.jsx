import { Brain } from 'lucide-react';

const ShiftHandoffCard = ({ memory }) => (
  <div className="card">
    <div className="flex items-center gap-2 mb-3">
      <Brain className="w-4 h-4 text-electric-cyan" />
      <h3 className="font-semibold text-gray-100">Preserved Investigation State & Eliminated Hypotheses</h3>
    </div>
    <ul className="space-y-2 text-sm text-gray-300">
      <li>
        • Active Outage Thread: <span className="text-electric-cyan">{memory.activeThread.incidentId}</span> (
        {memory.activeThread.title}) - {memory.activeThread.hoursElapsed} hours elapsed,{' '}
        {memory.activeThread.stepsExecuted} steps executed.
      </li>
      {memory.eliminatedHypotheses.map((h, i) => (
        <li key={h.title}>
          • Rule-Out {i + 1} ({h.title}): {h.detail}
        </li>
      ))}
      {memory.standingNotes.map((note) => (
        <li key={note} className="text-warning">
          • Standing Note: {note}
        </li>
      ))}
      <li className="text-electric-green">• Active Resolution: {memory.activeResolution}</li>
    </ul>
  </div>
);

export default ShiftHandoffCard;
