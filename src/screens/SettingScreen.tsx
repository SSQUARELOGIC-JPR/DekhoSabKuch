import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Vibration,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

import { Colors, Typography } from '../theme';
import ConfirmModal from '../components/ConfirmModal';
import SupportTicketModal from '../components/SupportTicketModal';
import DeleteConfirmModal from '../components/DeleteAccountModal';

import { ScreenProps } from '../types/interfaces';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import { persistor, RootState } from '../store';

import { useTranslation } from '../localization/useTranslation';
import { setLanguage } from '../store/languageSlice';

import {
  createSupportTicketApi,
  logoutApi,
  deleteAccountApi,
} from '../services/api';

const SettingsScreen: React.FC<ScreenProps> = () => {
  const navigation = useNavigation<any>();

  const [logoutModal, setLogoutModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [supportModal, setSupportModal] = useState(false);
  const [supportSuccessModal, setSupportSuccessModal] = useState(false);
  const [supportLoading, setSupportLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const dispatch = useDispatch();
  const t = useTranslation();

  const currentLang = useSelector(
    (state: RootState) => state.language.currentLang
  );

  const user = useSelector((state: RootState) => state.auth.user);

  // ===============================
  // 🔥 SUPPORT SUBMIT
  // ===============================
  const handleSupportSubmit = async (data: any) => {
    try {
      setSupportLoading(true);
      setErrorMsg('');

      const res = await createSupportTicketApi(data);

      if (res?.success) {
        setSupportModal(false);
        setSupportSuccessModal(true);
      } else {
        Vibration.vibrate([0, 200, 100, 200]);
        setErrorMsg(res?.message || t.errors.network);
      }
    } catch (error: any) {
      Vibration.vibrate([0, 200, 100, 200]);
      setErrorMsg(
        error?.response?.data?.message || t.errors.network
      );
    } finally {
      setSupportLoading(false);
    }
  };

  // ===============================
  // 🔥 LOGOUT
  // ===============================
  const handleLogout = async () => {
    try {
      setLogoutModal(false);
      setErrorMsg('');

      try {
        await logoutApi();
      } catch (e) { }

      dispatch(logout());
      await persistor.purge();
      navigation.replace('Login');
    } catch (error: any) {
      Vibration.vibrate([0, 200, 100, 200]);
      setErrorMsg(t.errors.network);
    }
  };

  // ===============================
  // 🔥 DELETE ACCOUNT
  // ===============================
  const handleDelete = async () => {
    try {
      setErrorMsg('');

      if (!user?.mobile) {
        Vibration.vibrate([0, 200, 100, 200]);
        setErrorMsg(t.errors.network);
        return;
      }

      const res = await deleteAccountApi(user.mobile);

      if (res?.success) {
        setDeleteModal(false);
        dispatch(logout());
        await persistor.purge();
        navigation.replace('Login');
      } else {
        Vibration.vibrate([0, 200, 100, 200]);
        setErrorMsg(res?.message || t.errors.network);
      }
    } catch (error: any) {
      Vibration.vibrate([0, 200, 100, 200]);
      setErrorMsg(
        error?.response?.data?.message || t.errors.network
      );
    }
  };

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

          <Text style={styles.heading}>{t.settings.title}</Text>

          {errorMsg ? (
            <Text style={styles.errorText}>{errorMsg}</Text>
          ) : null}

          <View style={styles.card}>
            <SettingItem
              title={t.settings.privacy_policy}
              icon="shield"
              onPress={() => { }}
            />
            <View style={styles.divider} />

            <SettingItem
              title={t.settings.terms_conditions}
              icon="file-text"
              onPress={() => { }}
            />
            <View style={styles.divider} />

            <SettingItem
              title={t.settings.support}
              icon="help-circle"
              onPress={() => setSupportModal(true)}
            />
            <View style={styles.divider} />

            <SettingItem
              title={
                currentLang === 'en'
                  ? `${t.common.change_language} "हिन्दी"`
                  : `${t.common.change_language} "English"`
              }
              icon="globe"
              onPress={() =>
                dispatch(setLanguage(currentLang === 'en' ? 'hi' : 'en'))
              }
            />
            <View style={styles.divider} />

            <SettingItem
              title={t.settings.logout}
              icon="log-out"
              onPress={() => setLogoutModal(true)}
            />
            <View style={styles.divider} />

            <SettingItem
              title={t.settings.delete_account}
              icon="trash-2"
              danger
              onPress={() => setDeleteModal(true)}
            />
          </View>
        </ScrollView>

        <ConfirmModal
          visible={logoutModal}
          title={t.settings.logout}
          subtitle={t.settings.confirm_logout}
          onClose={() => setLogoutModal(false)}
          onOk={handleLogout}
          okText={t.settings.logout}
          laterText={t.common.cancel}
        />

        <SupportTicketModal
          visible={supportModal}
          onClose={() => setSupportModal(false)}
          onSubmit={handleSupportSubmit}
          loading={supportLoading}
        />

        <ConfirmModal
          visible={supportSuccessModal}
          title={t.settings.support_success_title}
          subtitle={t.settings.support_success_subtitle}
          onClose={() => setSupportSuccessModal(false)}
          onOk={() => setSupportSuccessModal(false)}
          okText={t.settings.ok}
          showLater={false}
        />

        <DeleteConfirmModal
          visible={deleteModal}
          phone={user?.mobile || ''}
          onClose={() => setDeleteModal(false)}
          onConfirm={handleDelete}
        />
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.backgroundAlt },
  container: { flex: 1, backgroundColor: Colors.backgroundAlt },
  scrollContent: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 20 },
  heading: { ...Typography.title, color: Colors.textPrimary, marginBottom: 10 },
  errorText: {
    color: Colors.error,
    marginBottom: 12,
    fontSize: 14,
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
  left: { flexDirection: 'row', alignItems: 'center' },
  itemText: { ...Typography.label, marginLeft: 14 },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: 16,
  },
});