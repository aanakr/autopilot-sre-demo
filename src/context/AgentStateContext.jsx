import { createContext, useContext, useState } from 'react';
import { AgentStates } from '../utils/stateEnums';
import { mockIncidentData } from '../utils/mockData';

const AgentStateContext = createContext();

export const useAgentState = () => {
  const context = useContext(AgentStateContext);
  if (!context) {
    throw new Error('useAgentState must be used within AgentStateProvider');
  }
  return context;
};

export const AgentStateProvider = ({ children }) => {
  const [agentState, setAgentState] = useState(AgentStates.IDLE);
  const [currentIncident, setCurrentIncident] = useState(null);
  const [error, setError] = useState(null);

  /**
   * Simulate agent investigation with 3-second timeout
   */
  const investigateIncident = async (incidentId) => {
    setAgentState(AgentStates.LOADING);
    setError(null);

    return new Promise((resolve, reject) => {
      // Hard 3-second timeout
      const timeout = setTimeout(() => {
        setAgentState(AgentStates.ERROR);
        setError('Agent investigation timed out');
        reject(new Error('Timeout'));
      }, 3000);

      // Simulate LLM thinking (1.5 seconds)
      setTimeout(() => {
        clearTimeout(timeout);

        try {
          // Fetch mock data for this incident
          const incidentData = mockIncidentData[incidentId] || mockIncidentData['default'];

          setCurrentIncident(incidentData);
          setAgentState(AgentStates.SUCCESS);
          resolve(incidentData);
        } catch (err) {
          setAgentState(AgentStates.ERROR);
          setError(err.message);
          reject(err);
        }
      }, 1500);
    });
  };

  /**
   * Reset agent to idle state
   */
  const resetAgent = () => {
    setAgentState(AgentStates.IDLE);
    setCurrentIncident(null);
    setError(null);
  };

  /**
   * Approve a remediation action
   */
  const approveRemediation = async (actionId) => {
    setAgentState(AgentStates.LOADING);

    return new Promise((resolve) => {
      setTimeout(() => {
        setAgentState(AgentStates.SUCCESS);
        resolve({ status: 'approved', actionId });
      }, 1000);
    });
  };

  /**
   * Deny a remediation action
   */
  const denyRemediation = (actionId) => {
    return { status: 'denied', actionId };
  };

  const value = {
    agentState,
    currentIncident,
    error,
    investigateIncident,
    resetAgent,
    approveRemediation,
    denyRemediation,
  };

  return (
    <AgentStateContext.Provider value={value}>
      {children}
    </AgentStateContext.Provider>
  );
};
