import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import { Images } from '../constants/images';
import { Colors } from '../theme/colors';
import { AppButton } from '../components/AppButton';
import AppHeaderLogo from '../components/AppHeaderLogo';
import { loginSuccess } from '../store/authSlice';
import { Routes } from '../constants/routes';

import {
  RoleType,
  RoleCardProps,
  RoleSelectionScreenProps,
  AuthUser,
} from '../types/interfaces';
import { useTranslation } from '../localization/useTranslation';

const RoleSelectionScreen = ({ route }: RoleSelectionScreenProps) => {
  const [role, setRole] = useState<RoleType>(null);
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const t = useTranslation();

  const mobile = route?.params?.mobile ?? '';
  const token = route?.params?.token ?? '';
  const userFromApi = route?.params?.user;

  const handleContinue = () => {
    if (!role || !mobile || !token || !userFromApi) return;

    const userData: AuthUser = {
      ...userFromApi,
      mobile,
      role,
      profileDone: false,
      paymentDone: false,
    };

    dispatch(
      loginSuccess({
        user: userData,
        token,
      })
    );
  };

  const RoleCard = ({
    title,
    description,
    icon,
    value,
  }: RoleCardProps) => (
    <TouchableOpacity
      style={[styles.card, role === value && styles.activeCard]}
      onPress={() => setRole(value)}
      activeOpacity={0.8}
    >
      <View style={styles.iconBox}>
        <Icon name={icon} size={22} color={Colors.white} />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDesc}>{description}</Text>
      </View>

      {role === value && (
        <Icon name="check-circle" size={22} color={Colors.accent} />
      )}
    </TouchableOpacity>
  );

  return (
    <ImageBackground source={Images.splashBg} style={styles.bg}>
      <SafeAreaView style={styles.container}>
        <AppHeaderLogo />

        <View style={styles.middle}>
          <RoleCard
            title={t.roleSelection.findServicesTitle}
            description={t.roleSelection.findServicesDesc}
            icon="search"
            value="customer"
          />

          <RoleCard
            title={t.roleSelection.provideServicesTitle}
            description={t.roleSelection.provideServicesDesc}
            icon="briefcase"
            value="provider"
          />

          <RoleCard
            title={t.roleSelection.bothTitle}
            description={t.roleSelection.bothDesc}
            icon="repeat"
            value="both"
          />
        </View>

        <View style={styles.bottom}>
          <AppButton
            title={t.common.continue}
            onPress={handleContinue}
            disabled={!role}
          />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default RoleSelectionScreen;

const styles = StyleSheet.create({
  bg: { flex: 1 },

  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(24),
    paddingVertical: verticalScale(20),
  },

  middle: {
    gap: verticalScale(14),
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: moderateScale(14),
    padding: moderateScale(16),
    elevation: 5,
    gap: moderateScale(12),
  },

  activeCard: {
    borderWidth: 2,
    borderColor: Colors.accent,
  },

  iconBox: {
    height: moderateScale(42),
    width: moderateScale(42),
    borderRadius: moderateScale(12),
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cardTitle: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: Colors.textPrimary,
  },

  cardDesc: {
    marginTop: verticalScale(2),
    fontSize: moderateScale(12),
    color: Colors.textSecondary,
  },

  bottom: {
    marginBottom: verticalScale(6),
  },
});