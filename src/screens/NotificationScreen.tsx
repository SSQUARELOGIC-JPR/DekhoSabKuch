import React, { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';

import { timeAgo } from '../utils/timeAgo';

import { Colors, Typography } from '../theme';

import {
  getNotificationsApi,
  markNotificationReadApi,
} from '../services/api';

import { apiHandler } from '../utils/apiHandler';
import { useTranslation } from '../localization/useTranslation';

const NotificationScreen = () => {

  const [notifications, setNotifications] = useState<any[]>([]);
  const t = useTranslation();

  // ===============================
  // 🔔 Notification Icon
  // ===============================
  const getIcon = (type: string) => {

    switch (type) {
      case 'login':
        return 'user';

      case 'payment':
        return 'credit-card';

      case 'support':
        return 'help-circle';

      case 'provider_live':
        return 'check-circle';

      default:
        return 'bell';
    }
  };

  // ===============================
  // 📝 Localized Message
  // ===============================
  const getMessage = (item: any) => {

    switch (item.type) {

      case 'login':
        return t.notifications.messages.welcome;

      case 'payment':
        return t.notifications.messages.payment_success;

      case 'support':
        return t.notifications.messages.support_created;

      case 'provider_live':
        return t.notifications.messages.profile_live;

      default:
        return item.message;
    }
  };

  // ===============================
  // 📥 Load Notifications
  // ===============================
  const loadNotifications = async () => {

    const res = await apiHandler(() => getNotificationsApi());

    if (res?.success) {
      setNotifications(res.data || []);
    }
  };

  // ===============================
  // 👁 Mark Read
  // ===============================
  const openNotification = async (item: any) => {

    if (!item.isRead) {
      await apiHandler(() =>
        markNotificationReadApi(item._id)
      );
    }

    loadNotifications();
  };

  useFocusEffect(
    useCallback(() => {
      loadNotifications();
    }, [])
  );

  // ===============================
  // 🔔 Notification Item
  // ===============================
  const NotificationItem = ({ item }: any) => {

    const isUnread = !item.isRead;

    const bgColor = isUnread
      ? Colors.primaryLight
      : Colors.white;
    const localizedTitle =
      t.notifications.types?.[
      item.type as keyof typeof t.notifications.types
      ] || item.title;

    return (

      <TouchableOpacity
        style={[
          styles.item,
          { backgroundColor: bgColor },
          !item.isRead && styles.unreadItem
        ]}
        onPress={() => openNotification(item)}
      >

        <View style={styles.left}>

          <Icon
            name={getIcon(item.type)}
            size={20}
            color={Colors.primary}
          />

          <View style={styles.textBox}>

            <Text
              style={[
                styles.itemTitle,
                !item.isRead && styles.unreadTitle
              ]}
            >
              {localizedTitle}
            </Text>

            <Text style={styles.itemMessage}>
              {getMessage(item)}
            </Text>

            {item.createdAt && (
              <Text style={styles.time}>
                {timeAgo(item.createdAt, t)}
              </Text>
            )}

          </View>

        </View>

        {!item.isRead && (
          <View style={styles.unreadDot} />
        )}

      </TouchableOpacity>

    );
  };

  return (

    <SafeAreaView style={styles.safeArea}>

      <View style={styles.container}>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >

          <Text style={styles.heading}>
            {t.notifications.title}
          </Text>

          <View style={styles.card}>

            {notifications.length === 0 ? (

              <Text style={styles.emptyText}>
                {t.notifications.empty}
              </Text>

            ) : (

              notifications.map((item, index) => (

                <View key={item._id}>

                  <NotificationItem item={item} />

                  {index !== notifications.length - 1 && (
                    <View style={styles.divider} />
                  )}

                </View>

              ))

            )}

          </View>

        </ScrollView>

      </View>

    </SafeAreaView>

  );
};

export default NotificationScreen;

const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: Colors.backgroundAlt,
  },

  container: {
    flex: 1,
    backgroundColor: Colors.backgroundAlt,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
  },

  heading: {
    ...Typography.title,
    color: Colors.textPrimary,
    marginBottom: 10,
  },

  card: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    gap:1
  },

  item: {
    paddingVertical: 16,
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
  },

  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  textBox: {
    marginLeft: 14,
    flex: 1,
  },

  itemTitle: {
    ...Typography.label,
    color: Colors.textPrimary,
  },

  unreadTitle: {
    fontWeight: '700',
  },

  itemMessage: {
    ...Typography.small,
    color: Colors.textSecondary,
    marginTop: 2,
  },

  time: {
    ...Typography.small,
    color: Colors.textLight,
    marginTop: 4,
  },

  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: 16,
  },

  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },

  emptyText: {
    textAlign: 'center',
    paddingVertical: 30,
    ...Typography.small,
    color: Colors.textSecondary,
  },

  unreadItem: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.accent,
  },

});