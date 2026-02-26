import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { Colors, Typography } from '../theme';
import ConfirmModal from '../components/ConfirmModal';
import { ScreenProps } from '../types/interfaces';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice'; // 👈 redux action
import { persistor } from '../store';

const SettingsScreen: React.FC<ScreenProps> = () => {
  const [logoutModal, setLogoutModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const dispatch = useDispatch();

  const SettingItem = ({
    title,
    icon,
    onPress,
    danger = false,
  }: any) => (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <View style={styles.left}>
        <Icon
          name={icon}
          size={20}
          color={danger ? Colors.error : Colors.primary}
        />
        <Text
          style={[
            styles.itemText,
            { color: danger ? Colors.error : Colors.textPrimary },
          ]}>
          {title}
        </Text>
      </View>

      {!danger && (
        <Icon name="chevron-right" size={20} color={Colors.textLight} />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>

          <Text style={styles.heading}>Settings</Text>

          <View style={styles.card}>
            <SettingItem title="Privacy Policy" icon="shield" onPress={() => { }} />
            <View style={styles.divider} />

            <SettingItem
              title="Terms & Conditions"
              icon="file-text"
              onPress={() => { }}
            />
            <View style={styles.divider} />

            <SettingItem title="Support" icon="help-circle" onPress={() => { }} />
            <View style={styles.divider} />

            <SettingItem
              title="Logout"
              icon="log-out"
              onPress={() => setLogoutModal(true)}
            />
            <View style={styles.divider} />

            <SettingItem
              title="Delete Account"
              icon="trash-2"
              danger
              onPress={() => setDeleteModal(true)}
            />
          </View>
        </ScrollView>

        {/* Logout Modal */}
        <ConfirmModal
          visible={logoutModal}
          title="Logout"
          subtitle="Are you sure you want to logout?"
          onCancel={() => setLogoutModal(false)}
          onConfirm={async () => {
            setLogoutModal(false);
            dispatch(logout());          // clear redux state
            await persistor.purge();     // clear persisted storage
          }}
        />

        {/* Delete Modal */}
        <ConfirmModal
          visible={deleteModal}
          title="Delete Account"
          subtitle="This action cannot be undone!"
          danger
          onCancel={() => setDeleteModal(false)}
          onConfirm={async () => {
            setDeleteModal(false);
            dispatch(logout()); // 🔥 same flow
            await persistor.purge();
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen;

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
    marginBottom: 20,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  item: {
    paddingVertical: 18,
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    ...Typography.label,
    marginLeft: 14,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: 16,
  },
});