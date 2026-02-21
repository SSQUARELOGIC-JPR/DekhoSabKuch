import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';

import { Images } from '../constants/images';
import { Colors } from '../theme/colors';
import { AppButton } from '../components/AppButton';
import { Routes } from '../constants/routes';

type RoleType = 'customer' | 'provider' | 'both';
type PaymentMethod = 'upi' | 'card' | 'cod';

const PaymentScreen = ({ navigation, route }: any) => {
  const role: RoleType = route?.params?.role || 'customer';
  const [method, setMethod] = useState<PaymentMethod | null>(null);

  // Dynamic Amount
  const amount = useMemo(() => {
    if (role === 'customer') return 10;
    if (role === 'provider') return 50;
    return 50;
  }, [role]);

  const handlePayment = () => {
    if (!method) return;
    navigation.replace(Routes.Home);
  };

  const PaymentOption = ({
    type,
    title,
    icon,
  }: {
    type: PaymentMethod;
    title: string;
    icon: string;
  }) => {
    const selected = method === type;
    return (
      <TouchableOpacity
        style={[styles.optionBox, selected && styles.optionSelected]}
        onPress={() => setMethod(type)}>
        <Icon
          name={icon}
          size={22}
          color={selected ? Colors.white : Colors.primary}
        />
        <Text
          style={[
            styles.optionText,
            selected && { color: Colors.white },
          ]}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground source={Images.splashBg} style={styles.bg}>
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1 }}>
          {/* Center Content */}
          <View style={styles.centerContent}>
            <Text style={styles.title}>Complete Your Payment</Text>
            <Text style={styles.subtitle}>
              Pay registration fee to continue
            </Text>

            {/* Amount Card */}
            <View style={styles.amountBox}>
              <Text style={styles.amountLabel}>Total Amount</Text>
              <Text style={styles.amount}>₹{amount}</Text>
            </View>

            {/* Payment Options */}
            <View style={styles.optionsWrapper}>
              <PaymentOption type="upi" title="Pay via UPI" icon="smartphone" />
              <PaymentOption type="card" title="Credit / Debit Card" icon="credit-card" />
              <PaymentOption type="cod" title="Pay Later (Approval)" icon="clock" />
            </View>
          </View>

          {/* Bottom Button */}
          <AppButton
            title={`Pay ₹${amount}`}
            onPress={handlePayment}
            disabled={!method}
          />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  bg: { flex: 1 },

  container: {
    flex: 1,
    paddingHorizontal: moderateScale(24),
    paddingVertical: verticalScale(20),
  },

  centerContent: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    fontSize: moderateScale(22),
    fontWeight: '700',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: verticalScale(6),
  },

  subtitle: {
    fontSize: moderateScale(14),
    color: Colors.white,
    textAlign: 'center',
    marginBottom: verticalScale(30),
  },

  amountBox: {
    backgroundColor: Colors.white,
    borderRadius: moderateScale(14),
    paddingVertical: verticalScale(20),
    alignItems: 'center',
    marginBottom: verticalScale(30),
  },

  amountLabel: {
    fontSize: moderateScale(14),
    color: Colors.textSecondary,
  },

  amount: {
    fontSize: moderateScale(28),
    fontWeight: '700',
    color: Colors.primary,
    marginTop: verticalScale(6),
  },

  optionsWrapper: {
    gap: verticalScale(16),
  },

  optionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(16),
    paddingHorizontal: moderateScale(16),
    gap: moderateScale(12),
    elevation: 4,
  },

  optionSelected: {
    backgroundColor: Colors.primary,
  },

  optionText: {
    fontSize: moderateScale(15),
    color: Colors.textPrimary,
    fontWeight: '600',
  },
});
