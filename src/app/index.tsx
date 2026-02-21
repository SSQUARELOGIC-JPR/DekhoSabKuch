import React from 'react';
import AppProviders from './AppProviders';
import AppNavigator from './AppNavigator';

const App = () => {
  return (
    <AppProviders>
      <AppNavigator />
    </AppProviders>
  );
};

export default App;
