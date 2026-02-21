import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';

import HomeScreen from '../screens/HomeScreen';
import NotificationScreen from '../screens/NotificationScreen';
import ProfileScreen from '../screens/ProfileSetupScreen';
import SettingScreen from '../screens/SettingScreen';
import { Colors } from '../theme/colors';

const Tab = createBottomTabNavigator();

const BottomTabs = ({ route }: any) => {
  const role = route?.params?.role; // pass role from auth/profile flow

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: '#9e9e9e',
        tabBarStyle: {
          height: 65,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarIcon: ({ color, size }) => {
          let iconName: string = 'home';

          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Notification') iconName = 'bell';
          else if (route.name === 'Profile') iconName = 'user';
          else if (route.name === 'Setting') iconName = 'settings';

          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      {/* Home */}
      <Tab.Screen name="Home">
        {props => <HomeScreen {...props} role={role} />}
      </Tab.Screen>

      {/* Notification */}
      <Tab.Screen
        name="Notification"
        component={NotificationScreen}
      />

      {/* Profile */}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
      />

      {/* Setting */}
      <Tab.Screen
        name="Setting"
        component={SettingScreen}
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;
