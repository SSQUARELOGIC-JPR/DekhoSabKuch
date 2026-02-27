import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '../screens/HomeScreen';
import NotificationScreen from '../screens/NotificationScreen';
import ProfileSetupScreen from '../screens/ProfileSetupScreen';
import SettingsScreen from '../screens/SettingScreen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { useTranslation } from '../localization/useTranslation';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  const insets = useSafeAreaInsets();
  const t = useTranslation();

  // 🔥 Centralized config (clean & scalable)
  const TAB_CONFIG: any = {
    Dashboard: {
      label: t.tabs.dashboard,
      icon: 'home',
      component: DashboardScreen,
    },
    Notifications: {
      label: t.tabs.notifications,
      icon: 'notifications',
      component: NotificationScreen,
    },
    Profile: {
      label: t.tabs.profile,
      icon: 'person',
      component: ProfileSetupScreen,
    },
    Settings: {
      label: t.tabs.settings,
      icon: 'settings',
      component: SettingsScreen,
    },
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const config = TAB_CONFIG[route.name];

        return {
          headerShown: false,
          tabBarStyle: {
            height: 65 + insets.bottom,
            paddingBottom: insets.bottom,
            backgroundColor: Colors.white,
          },
          tabBarLabelStyle: Typography.tabLabel,
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.black,
          tabBarIcon: ({ color }) => (
            <Icon name={config.icon} size={22} color={color} />
          ),
          tabBarLabel: config.label,
        };
      }}
    >
      {Object.keys(TAB_CONFIG).map((key) => {
        const config = TAB_CONFIG[key];
        return (
          <Tab.Screen
            key={key}
            name={key}
            component={config.component}
          />
        );
      })}
    </Tab.Navigator>
  );
};

export default BottomTabs;