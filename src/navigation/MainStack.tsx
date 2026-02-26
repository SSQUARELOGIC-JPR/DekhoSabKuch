import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabs from '../navigation/BottomTabs';
import { Routes } from '../constants/routes';
import ProfileScreen from '../screens/ProfileSetupScreen';
import PaymentScreen from '../screens/PaymentScreen';
import HomeScreen from '../screens/HomeScreen';
import ProviderDetailsScreen from '../screens/ProviderDetailsScreen';

const Stack = createNativeStackNavigator();

const MainStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={Routes.BottomTabs} component={BottomTabs} />
      <Stack.Screen name={Routes.Profile} component={ProfileScreen} />
      <Stack.Screen name={Routes.Payment} component={PaymentScreen} />
      <Stack.Screen name={Routes.ProviderDetails} component={ProviderDetailsScreen} />
    </Stack.Navigator>
  );
};

export default MainStack;