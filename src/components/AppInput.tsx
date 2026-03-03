import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Colors, Spacing } from '../theme';
import { moderateScale } from 'react-native-size-matters';
import { AppInputProps } from '../types/interfaces';

export const AppInput = (props: AppInputProps) => {
  const {
    placeholder,
    icon,
    value,
    onChangeText,
    keyboardType = 'default',
    secureTextEntry = false,
    maxLength,
    editable = true,
    autoFocus = false,
    autoCapitalize = 'none',
    returnKeyType = 'next',

    // 🔥 ADD THESE (missing)
    multiline = false,
    numberOfLines = 1,
    inputStyle,
  } = props;

  return (
    <View style={[
      styles.container,
      multiline && styles.multilineContainer, // 🔥 only for textarea
    ]}>
      <Icon name={icon} size={22} color={Colors.primary} />

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textSecondary}
        style={[styles.input, inputStyle]}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        maxLength={maxLength}
        editable={editable}
        autoFocus={autoFocus}
        autoCapitalize={autoCapitalize}
        returnKeyType={returnKeyType}
        blurOnSubmit={false}
        autoCorrect={false}
        multiline={multiline}
        numberOfLines={numberOfLines}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: moderateScale(8),
    paddingHorizontal: Spacing.l,
    minHeight: moderateScale(48), // 🔥 change: height → minHeight
    elevation: 6,
  },

  multilineContainer: {
    alignItems: 'flex-start', // 🔥 icon top aligned only for textarea
    paddingVertical: moderateScale(10),
    minHeight: moderateScale(100),
  },
  input: {
    flex: 1,
    marginLeft: Spacing.m,
    color: Colors.textPrimary,
    fontSize: moderateScale(16),
  },
});