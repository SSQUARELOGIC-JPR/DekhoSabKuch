import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import OtpScreen from '../screens/OtpScreen';
import RoleSelectionScreen from '../screens/RoleSelectionScreen';
import ProfileScreen from '../screens/ProfileSetupScreen';
import PaymentScreen from '../screens/PaymentScreen';
import { Routes } from '../constants/routes';
import HomeScreen from '../screens/HomeScreen';


const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={Routes.Login} component={LoginScreen} />
      <Stack.Screen name={Routes.Otp} component={OtpScreen} />
      <Stack.Screen name={Routes.RoleSelection} component={RoleSelectionScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;
