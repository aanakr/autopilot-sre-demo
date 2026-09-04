/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';
import { account, currentUser } from '../utils/mockData';

const AutopilotContext = createContext();

export const useAutopilot = () => {
  const context = useContext(AutopilotContext);
  if (!context) {
    throw new Error('useAutopilot must be used within AutopilotProvider');
  }
  return context;
};

export const AutopilotProvider = ({ children }) => {
  const [activeScenarioId, setActiveScenarioId] = useState('S1');

  const value = {
    account,
    currentUser,
    activeScenarioId,
    setActiveScenarioId,
  };

  return (
    <AutopilotContext.Provider value={value}>
      {children}
    </AutopilotContext.Provider>
  );
};
