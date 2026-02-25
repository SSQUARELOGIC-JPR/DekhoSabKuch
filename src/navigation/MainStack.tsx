import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabs from '../navigation/BottomTabs';
import { Routes } from '../constants/routes';

const Stack = createNativeStackNavigator();

const MainStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={Routes.BottomTabs} component={BottomTabs} />
    </Stack.Navigator>
  );
};

export default MainStack;