import React from 'react';
import AppProviders from './AppProviders';
import AppNavigator from './AppNavigator';
import { AuthProvider } from '../context/AuthContext';

const App = () => {
  return (
    <AuthProvider>
    <AppProviders>
      <AppNavigator />
    </AppProviders>
    </AuthProvider>
  );
};

export default App;
