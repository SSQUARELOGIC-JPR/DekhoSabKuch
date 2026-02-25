import React, { useState, useContext } from 'react';
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

import { Images } from '../constants/images';
import { Colors } from '../theme/colors';
import { AppButton } from '../components/AppButton';
import { Routes } from '../constants/routes';
import { Strings } from '../constants/strings';
import AppHeaderLogo from '../components/AppHeaderLogo';
import { AuthContext } from '../context/AuthContext';

import {
  RoleType,
  RoleCardProps,
  RoleSelectionScreenProps,
} from '../types/interfaces';

const RoleSelectionScreen = ({ navigation, route }: RoleSelectionScreenProps) => {
  const [role, setRole] = useState<RoleType>(null);
const { setUser } = useContext(AuthContext);

  const handleContinue = async () => {
    if (!role) return;

    // phone number tum Login/OTP se route params me pass kar sakte ho
    const mobile = route?.params?.mobile || '';

    const userData = {
      mobile,
      role,
      profileDone: false,
      paymentDone: false,
    };

    await setUser(userData);

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
            title={Strings.roleSelection.findServicesTitle}
            description={Strings.roleSelection.findServicesDesc}
            icon="search"
            value="customer"
          />

          <RoleCard
            title={Strings.roleSelection.provideServicesTitle}
            description={Strings.roleSelection.provideServicesDesc}
            icon="briefcase"
            value="provider"
          />

          <RoleCard
            title={Strings.roleSelection.bothTitle}
            description={Strings.roleSelection.bothDesc}
            icon="repeat"
            value="both"
          />
        </View>

        <View style={styles.bottom}>
          <AppButton
            title="Continue"
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
