import React, { useEffect, useCallback, useState } from 'react';
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

import { getUnreadCountApi } from '../services/api';
import { apiHandler } from '../utils/apiHandler';

import { StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {

  const insets = useSafeAreaInsets();
  const t = useTranslation();

  const [unreadCount, setUnreadCount] = useState(0);

  // ===============================
  // 🔔 Load unread notification count
  // ===============================
  const loadUnreadCount = async () => {

    const res = await apiHandler(() => getUnreadCountApi());

    if (res?.success) {
      setUnreadCount(res.count || 0);
    }
  };

  // ===============================
  // 🔁 Polling (every 15 sec)
  // ===============================
  useEffect(() => {

    loadUnreadCount();

    const interval = setInterval(() => {
      loadUnreadCount();
    }, 15000);

    return () => clearInterval(interval);

  }, []);

  // ===============================
  // 🔁 Reload when tab focused
  // ===============================
  useFocusEffect(
    useCallback(() => {
      loadUnreadCount();
    }, [])
  );

  // ===============================
  // 🔥 Tab Config
  // ===============================
  const TAB_CONFIG: any = {
    Dashboard: {
      label: t.tabs.dashboard,
      icon: 'home-outline',
      component: DashboardScreen,
    },
    Notifications: {
      label: t.tabs.notifications,
      icon: 'notifications-outline',
      component: NotificationScreen,
    },
    Profile: {
      label: t.tabs.profile,
      icon: 'person-outline',
      component: ProfileSetupScreen,
    },
    Settings: {
      label: t.tabs.settings,
      icon: 'settings-outline',
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

          tabBarIcon: ({ color }) => {

            if (route.name === 'Notifications') {
              return (
                <View style={{ position: 'relative' }}>

                  <Icon
                    name={config.icon}
                    size={22}
                    color={color}
                  />

                  {unreadCount > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </Text>
                    </View>
                  )}

                </View>
              );
            }

            return (
              <Icon
                name={config.icon}
                size={22}
                color={color}
              />
            );
          },

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

const styles = StyleSheet.create({

  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
    backgroundColor: Colors.error,
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },

  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },

});