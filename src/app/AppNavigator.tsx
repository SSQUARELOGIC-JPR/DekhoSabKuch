import React from 'react';
import AuthStack from '../navigation/AuthStack';

const AppNavigator = () => {
  const isLoggedIn = false; // abhi hardcoded

  return isLoggedIn ? <></> : <AuthStack />;
};

export default AppNavigator;
