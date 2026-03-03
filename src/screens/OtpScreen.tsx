import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Vibration,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { Images } from '../constants/images';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { AppButton } from '../components/AppButton';
import { Routes } from '../constants/routes';
import AppHeaderLogo from '../components/AppHeaderLogo';
import { useTranslation } from '../localization/useTranslation';
import ErrorBanner from '../components/ErrorBanner';
import { verifyOtpApi, sendOtpApi } from '../services/api';

const OtpScreen = ({ navigation, route }: any) => {
  const { mobile } = route.params || {};
  const t = useTranslation();

  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const inputs = useRef<Array<TextInput | null>>([]);

  // Countdown Timer
  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (text: string, index: number) => {
    const cleaned = text.replace(/[^0-9]/g, '');

    const newOtp = [...otp];
    newOtp[index] = cleaned;
    setOtp(newOtp);

    if (cleaned && index < otp.length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (index: number) => {
    const newOtp = [...otp];

    if (otp[index]) {
      // If current has value → clear it
      newOtp[index] = '';
      setOtp(newOtp);
    } else if (index > 0) {
      // If already empty → go back & clear previous
      inputs.current[index - 1]?.focus();
      newOtp[index - 1] = '';
      setOtp(newOtp);
    }
  };

  // 🔐 VERIFY OTP
  const handleVerify = async () => {
    const finalOtp = otp.join('');

    if (finalOtp.length !== 4) return;

    try {
      setLoading(true);
      setErrorMsg('');

      const res = await verifyOtpApi(mobile, finalOtp);

      console.log('🔐 VERIFY OTP RES:', res);

      if (res?.success) {
        Vibration.vibrate(100);

        // 👉 token + user params me pass
        navigation.navigate(Routes.RoleSelection, {
          mobile,
          token: res.token,
          user: res.user,
        });
      } else {
        Vibration.vibrate([0, 200, 100, 200]);
        setErrorMsg(res?.message || t.errors.invalidOtp);
      }
    } catch (error: any) {
      console.log('❌ VERIFY OTP ERROR:', error);
      Vibration.vibrate([0, 200, 100, 200]);
      setErrorMsg(
        error?.response?.data?.message || t.errors.network
      );
    } finally {
      setLoading(false);
    }
  };

  // 🔁 RESEND OTP
  const handleResend = async () => {
    try {
      setTimer(30);
      setOtp(['', '', '', '']);
      inputs.current[0]?.focus();

      await sendOtpApi(mobile);
      Vibration.vibrate(100);
    } catch (error) {
      Vibration.vibrate([0, 200, 100, 200]);
      setErrorMsg(t.errors.network);
    }
  };

  const isValid = otp.every(d => d !== '');

  return (
    <ImageBackground source={Images.splashBg} style={styles.bg} resizeMode="cover">
      <SafeAreaView style={styles.safe}>
        {/* 🔴 Top Error Banner */}
        <ErrorBanner message={errorMsg} />

        <KeyboardAwareScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          enableOnAndroid
          extraScrollHeight={30}
        >
          <View style={styles.container}>
            <AppHeaderLogo />

            <View style={{ flex: 1 }} />

            <View style={styles.bottom}>
              <Text style={styles.heading}>{t.otp.enterOtp}</Text>

              <View style={styles.otpRow}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => {
                      inputs.current[index] = ref;
                    }}
                    value={digit}
                    onChangeText={(text) => handleChange(text, index)}
                    onKeyPress={({ nativeEvent }) => {
                      if (nativeEvent.key === 'Backspace') {
                        handleBackspace(index);
                      }
                    }}
                    style={styles.otpBox}
                    keyboardType="number-pad"
                    maxLength={1}
                  />
                ))}
              </View>

              <AppButton
                title={t.otp.verifyOtp}
                onPress={handleVerify}
                loading={loading}
                disabled={!isValid || loading}
              />

              <View style={styles.resendContainer}>
                {timer > 0 ? (
                  <Text style={styles.timerText}>
                    {t.otp.resendOtp} {timer}s
                  </Text>
                ) : (
                  <TouchableOpacity onPress={handleResend}>
                    <Text style={styles.resendText}>
                      {t.otp.resendOtp}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default OtpScreen;
const styles = StyleSheet.create({
  bg: { flex: 1 },

  safe: { flex: 1 },

  scroll: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },

  container: {
    flex: 1,
    paddingHorizontal: moderateScale(24),
    paddingVertical: verticalScale(10),
  },

  bottom: {
    gap: verticalScale(16),
    marginBottom: verticalScale(12),
  },

  heading: {
    textAlign: 'center',
    color: Colors.white,
    ...Typography.subtitle,
  },

  otpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },

  otpBox: {
    height: moderateScale(55),
    width: moderateScale(55),
    borderRadius: moderateScale(12),
    borderColor: Colors.accent,
    borderWidth: moderateScale(0.4),
    backgroundColor: Colors.white,
    textAlign: 'center',
    fontSize: moderateScale(22),
    fontWeight: '600',
    color: Colors.textPrimary,
    elevation: 5,
    marginHorizontal: moderateScale(4),
  },

  resendContainer: {
    alignItems: 'center',
    marginTop: verticalScale(8),
  },

  timerText: {
    color: Colors.black,
    ...Typography.button,
  },

  resendText: {
    color: Colors.black,
    ...Typography.button,
  },
});