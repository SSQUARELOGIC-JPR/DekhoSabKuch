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
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';

import { AppInput } from '../components/AppInput';
import { AppButton } from '../components/AppButton';
import AppHeaderLogo from '../components/AppHeaderLogo';
import { useTranslation } from '../localization/useTranslation';

const LoginScreen = () => {
  const navigation = useNavigation<any>();
  const t = useTranslation();

  const [mobile, setMobile] = useState('');

  // Only allow numbers
  const handleChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    setMobile(cleaned);
  };

  const validateAndProceed = () => {
    if (!mobile) return;
    if (mobile.length !== 10) return;

    navigation.navigate(Routes.Otp, { mobile });
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
          extraScrollHeight={30}
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
                keyboardType="number-pad"
                maxLength={10}
              />

              <AppButton
                title={t.login.sendOtp}
                onPress={validateAndProceed}
                disabled={!isValid}
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