import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import AppProviders from './AppProviders';
import AppNavigator from './AppNavigator';
import { store, persistor } from '../store';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <AppProviders>
          <AppNavigator />
        </AppProviders>
      </PersistGate>
    </Provider>
  );
};

export default App;