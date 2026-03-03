import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import AuthStack from '../navigation/AuthStack';
import MainStack from '../navigation/MainStack';
import SplashScreen from '../screens/SplashScreen';
import ErrorBanner from '../components/ErrorBanner';
import ConfirmModal from '../components/ConfirmModal';

import { RootState, persistor } from '../store';
import { logout } from '../store/authSlice';
import {
  closeSessionExpired,
} from '../store/sessionSlice';

import { useTranslation } from '../localization/useTranslation';

const AppNavigator = () => {
  const dispatch = useDispatch();
  const t = useTranslation();

  const isLogin = useSelector(
    (state: RootState) => state.auth.isLogin
  );

  const error = useSelector(
    (state: RootState) => state.error
  );

  const sessionExpired = useSelector(
    (state: RootState) => state.session.sessionExpired
  );

  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleSessionLogout = async () => {
    dispatch(closeSessionExpired());
    dispatch(logout());
    await persistor.purge();
  };

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <>
      {isLogin ? <MainStack /> : <AuthStack />}

      {/* 🔴 Global Error Banner */}
      <ErrorBanner
        message={error.message}
        type={error.type}
      />

      {/* 🔐 Session Expired Modal */}
      <ConfirmModal
        visible={sessionExpired}
        title={t.errors.sessionExpired}
        subtitle={t.errors.sessionExpired}
        onClose={handleSessionLogout}
        onOk={handleSessionLogout}
        okText="OK"
        showLater={false}
      />
    </>
  );
};

export default AppNavigator;