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
  } = props;

  return (
    <View style={styles.container}>
      <Icon name={icon} size={22} color={Colors.primary} />

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textSecondary}
        style={styles.input}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        maxLength={maxLength}
        editable={editable}
        autoFocus={autoFocus}
        autoCapitalize={autoCapitalize}
        returnKeyType={returnKeyType}
        blurOnSubmit={false}   // 🔥 keyboard hide bug fix
        autoCorrect={false}
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
    height: moderateScale(48),
    elevation: 6,
  },
  input: {
    flex: 1,
    marginLeft: Spacing.m,
    color: Colors.textPrimary,
    fontSize: moderateScale(16),
  },
});
