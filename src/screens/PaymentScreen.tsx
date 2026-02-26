import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';
import { useDispatch, useSelector } from 'react-redux';

import { Colors } from '../theme/colors';
import { RootState } from '../store';
import { updatePaymentDone } from '../store/authSlice';
import { Routes } from '../constants/routes';
import { Strings } from '../constants/strings';
import { ScreenProps, RoleType } from '../types/interfaces';

type PaymentMethod = 'upi' | 'card' | 'cod';

const PaymentScreen: React.FC<ScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  const user = useSelector((state: RootState) => state.auth.user);
  const role: RoleType = user?.role || 'customer';

  const [method, setMethod] = useState<PaymentMethod | null>(null);

  const amount = useMemo(() => {
    if (role === 'customer') return 15;
    return 50;
  }, [role]);

  const handlePayment = () => {
    if (!method) return;
    dispatch(updatePaymentDone());
    navigation.reset({
      index: 0,
      routes: [{ name: Routes.BottomTabs }],
    });
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
          size={20}
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
    <View style={styles.root}>
      {/* HEADER */}
      <View style={[styles.header, { paddingTop: insets.top + verticalScale(10) }]}>

        {/* Back Button */}
        <TouchableOpacity
          style={[styles.backBtn, { top: insets.top + 6 }]}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={22} color={Colors.white} />
        </TouchableOpacity>

        <Text style={styles.title}>{Strings.payment.title}</Text>

        <View style={styles.headerIcon}>
          <Icon name="credit-card" size={26} color={Colors.white} />
        </View>
      </View>

      {/* BODY */}
      <KeyboardAvoidingView
        style={styles.body}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

        {/* CONTENT */}
        <View style={styles.content}>
          <Text style={styles.subtitle}>
            {Strings.payment.subtitle}
          </Text>

          <View style={styles.card}>
            <Text style={styles.amountLabel}>Total Amount</Text>
            <Text style={styles.amount}>₹{amount}</Text>

            <View style={styles.optionsWrapper}>
              <PaymentOption type="upi" title="Pay via UPI" icon="smartphone" />
              <PaymentOption type="card" title="Credit / Debit Card" icon="credit-card" />
              <PaymentOption type="cod" title="Pay Later (Approval)" icon="clock" />
            </View>
          </View>
        </View>

        {/* BUTTON (Safe Area Fixed) */}
        <View style={[styles.bottomBtnWrap, { paddingBottom: insets.bottom + 8 }]}>
          <TouchableOpacity
            style={[
              styles.ctaButton,
              method ? styles.ctaActive : styles.ctaDisabled,
            ]}
            disabled={!method}
            onPress={handlePayment}>
            <Text style={styles.ctaText}>
              Pay ₹{amount}
            </Text>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </View>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.backgroundAlt,
  },

  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: moderateScale(16),
    paddingBottom: verticalScale(26),
    borderBottomLeftRadius: moderateScale(24),
    borderBottomRightRadius: moderateScale(24),
    alignItems: 'center',
  },

  title: {
    color: Colors.white,
    fontSize: moderateScale(20),
    fontWeight: '700',
  },

  headerIcon: {
    height: moderateScale(70),
    width: moderateScale(70),
    borderRadius: moderateScale(35),
    borderWidth: 3,
    borderColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(10),
    backgroundColor: Colors.primary,
  },

  body: {
    flex: 1,
    paddingHorizontal: moderateScale(16),
  },

  content: {
    flex: 1,
  },

  subtitle: {
    fontSize: moderateScale(14),
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: verticalScale(16),
    marginBottom: verticalScale(12),
  },

  card: {
    backgroundColor: Colors.white,
    borderRadius: moderateScale(18),
    padding: moderateScale(18),
    marginTop: verticalScale(8),
    elevation: 3,
  },

  amountLabel: {
    fontSize: moderateScale(14),
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  amount: {
    fontSize: moderateScale(30),
    fontWeight: '700',
    color: Colors.primary,
    textAlign: 'center',
    marginTop: verticalScale(4),
    marginBottom: verticalScale(20),
  },

  optionsWrapper: {
    gap: verticalScale(14),
  },

  optionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightWhite,
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(14),
    paddingHorizontal: moderateScale(16),
    gap: moderateScale(12),
  },

  optionSelected: {
    backgroundColor: Colors.primary,
  },

  optionText: {
    fontSize: moderateScale(15),
    color: Colors.textPrimary,
    fontWeight: '600',
  },

  bottomBtnWrap: {
    paddingTop: verticalScale(10),
  },

  ctaButton: {
    height: verticalScale(32),
    borderRadius: moderateScale(6),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: moderateScale(28),
  },

  ctaActive: {
    backgroundColor: Colors.accent,
  },

  ctaDisabled: {
    backgroundColor: Colors.lightGray,
  },

  ctaText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: Colors.white,
  },

  backBtn: {
    position: 'absolute',
    left: moderateScale(14),
    height: moderateScale(36),
    width: moderateScale(36),
    borderRadius: moderateScale(18),
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});