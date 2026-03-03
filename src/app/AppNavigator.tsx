import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import AuthStack from '../navigation/AuthStack';
import MainStack from '../navigation/MainStack';
import SplashScreen from '../screens/SplashScreen';
import { RootState } from '../store';
import ErrorBanner from '../components/ErrorBanner';

const AppNavigator = () => {
  const isLogin = useSelector((state: RootState) => state.auth.isLogin);
  const error = useSelector((state: RootState) => state.error);

  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <>
      {isLogin ? <MainStack /> : <AuthStack />}

      {/* ✅ Global Error Banner */}
      <ErrorBanner
        message={error.message}
        type={error.type}
      />
    </>
  );
};

export default AppNavigator;