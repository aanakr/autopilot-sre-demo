import { Brain } from 'lucide-react';

const ShiftHandoffCard = ({ memory }) => (
  <div className="card">
    <div className="flex items-center gap-2 mb-3">
      <Brain className="w-4 h-4 text-knowledge-purple" />
      <h3 className="font-semibold text-gray-100">Preserved Investigation State & Eliminated Hypotheses</h3>
    </div>
    <ul className="space-y-2 text-sm text-gray-300">
      <li>
        • Active Incident: <span className="text-knowledge-purple">{memory.activeThread.incidentId}</span> (
        {memory.activeThread.status}) — {memory.activeThread.title},{' '}
        {memory.activeThread.hoursElapsed} hours elapsed, {memory.activeThread.stepsExecuted} steps executed.
      </li>
      {memory.eliminatedHypotheses.map((h, i) => (
        <li key={h.title}>
          • Rule-Out {i + 1} ({h.title}) — Tested at {h.testedAt}. Result: {h.result} Hypothesis Eliminated.
        </li>
      ))}
      {memory.standingNotes.map((note) => (
        <li key={note} className="text-warning">
          • Standing Note: {note}
        </li>
      ))}
      <li className="text-knowledge-emerald">• Active Resolution: {memory.activeResolution}</li>
    </ul>
  </div>
);

export default ShiftHandoffCard;
