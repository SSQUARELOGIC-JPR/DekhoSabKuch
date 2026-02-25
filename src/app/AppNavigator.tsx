import React, { useContext } from 'react';
import AuthStack from '../navigation/AuthStack';
import MainStack from '../navigation/MainStack';
import SplashScreen from '../screens/SplashScreen';
import { AuthContext } from '../context/AuthContext';

const AppNavigator = () => {
  const { user, loading } = useContext(AuthContext);

  // Cold start → show splash
  if (loading) {
    return <SplashScreen />;
  }

  // After loading decide
  return user ? <MainStack /> : <AuthStack />;
};

export default AppNavigator;