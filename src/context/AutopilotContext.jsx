/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';
import { account, currentUser, defaultMemoryFacts } from '../utils/mockData';

const AutopilotContext = createContext();

export const useAutopilot = () => {
  const context = useContext(AutopilotContext);
  if (!context) {
    throw new Error('useAutopilot must be used within AutopilotProvider');
  }
  return context;
};

export const AutopilotProvider = ({ children }) => {
  const [memoryFacts, setMemoryFacts] = useState(defaultMemoryFacts);
  const [activeIncidentId, setActiveIncidentId] = useState('INC-8472');

  const addMemoryFact = (scope, text) => {
    if (!text.trim()) return;
    setMemoryFacts((prev) => [
      ...prev,
      { id: `fact-${prev.length + 1}-${Date.now()}`, scope, text: text.trim() },
    ]);
  };

  const value = {
    account,
    currentUser,
    memoryFacts,
    addMemoryFact,
    activeIncidentId,
    setActiveIncidentId,
  };

  return (
    <AutopilotContext.Provider value={value}>
      {children}
    </AutopilotContext.Provider>
  );
};
