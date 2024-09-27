import React from 'react';
import { AlertsContext } from '../src/contexts/alerts-context';

const withAlertsContext = (Story, context) => {
  const showAlert = (message, type) => {
    console.log(`Alert: ${message} - Type: ${type}`);
  };

  return (
    <AlertsContext.Provider value={{ showAlert }}>
      <Story {...context} />
    </AlertsContext.Provider>
  );
};

export default withAlertsContext;