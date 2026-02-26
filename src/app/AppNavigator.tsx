import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import AuthStack from '../navigation/AuthStack';
import MainStack from '../navigation/MainStack';
import SplashScreen from '../screens/SplashScreen';
import { RootState } from '../store';

const AppNavigator = () => {
  const isLogin = useSelector((state: RootState) => state.auth.isLogin);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000); // splash duration

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return isLogin ? <MainStack /> : <AuthStack />;
};

export default AppNavigator;