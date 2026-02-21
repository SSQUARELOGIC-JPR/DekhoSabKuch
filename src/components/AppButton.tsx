import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import { Colors, Typography } from '../theme';
import { moderateScale } from 'react-native-size-matters';
import { AppButtonProps } from '../types/interfaces';

export const AppButton = ({
  title,
  onPress,
  loading = false,
  disabled = false,
}: AppButtonProps) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.btn,
        disabled || loading ? styles.disabledBtn : null,
      ]}
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={Colors.white} />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    height: moderateScale(48),
    borderRadius: moderateScale(8),
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },

  disabledBtn: {
    backgroundColor: Colors.lightGray, // Make sure this exists in Colors
    elevation: 0,
  },

  text: {
    color: Colors.white,
    ...Typography.button,
  },
});
