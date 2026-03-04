import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '../constants/routes';

import { Images } from '../constants/images';
import { Typography } from '../theme/typography';

import { AppInput } from '../components/AppInput';
import { AppButton } from '../components/AppButton';
import AppHeaderLogo from '../components/AppHeaderLogo';
import { useTranslation } from '../localization/useTranslation';

import { sendOtpApi } from '../services/api';
import { apiHandler } from '../utils/apiHandler';

const LoginScreen = () => {
  const navigation = useNavigation<any>();
  const t = useTranslation();

  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);

  // Only allow numbers
  const handleChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    setMobile(cleaned);
  };

  const validateAndProceed = async () => {
    if (!mobile) return;
    if (mobile.length !== 10) return;

    setLoading(true);

    const res = await apiHandler(() =>
      sendOtpApi(mobile)
    );

    if (res?.success) {
      navigation.navigate(Routes.Otp, { mobile });
    }

    setLoading(false);
  };

  const isValid = mobile.length === 10;

  return (
    <ImageBackground
      source={Images.splashBg}
      style={styles.bg}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safe}>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          enableOnAndroid
          extraScrollHeight={120}
        >
          <View style={styles.container}>
            {/* Top Logo */}
            <AppHeaderLogo />

            <View style={{ flex: 1 }} />

            {/* Bottom Form */}
            <View style={styles.bottom}>
              <AppInput
                icon="phone"
                placeholder={t.login.mobilePlaceholder}
                value={mobile}
                onChangeText={handleChange}
                keyboardType="phone-pad"
                maxLength={10}
                returnKeyType="done"
              />

              <AppButton
                title={t.login.sendOtp}
                onPress={validateAndProceed}
                disabled={!isValid}
                loading={loading}
              />
            </View>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  bg: { flex: 1 },
  safe: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: moderateScale(24),
    paddingVertical: verticalScale(10),
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  bottom: {
    gap: verticalScale(12),
    marginBottom: verticalScale(12),
    ...Typography.button,
  },
});