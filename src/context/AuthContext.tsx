import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthContextType = {
  user: any;
  setUser: (user: any) => void;
  logout: () => void;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  logout: () => {},
  loading: true,
});

export const AuthProvider = ({ children }: any) => {
  const [user, setUserState] = useState<any>(null);
  const [loading, setLoading] = useState(true);

 
  useEffect(() => {
  const loadUser = async () => {
    try {
      const data = await AsyncStorage.getItem('userData');
      if (data) setUserState(JSON.parse(data));
    } catch (e) {}

    // 🔥 ensure splash visible for min duration
    setTimeout(() => {
      setLoading(false);
    }, 2200); // match splash animation time
  };

  loadUser();
}, []);

  const setUser = async (userData: any) => {
    setUserState(userData);
    await AsyncStorage.setItem('userData', JSON.stringify(userData));
  };

  const logout = async () => {
    await AsyncStorage.removeItem('userData');
    setUserState(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};