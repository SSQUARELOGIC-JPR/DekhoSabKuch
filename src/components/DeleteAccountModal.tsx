import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';

import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { useTranslation } from '../localization/useTranslation';
import { DeleteAccountModalProps } from '../types/interfaces';
import FormField from '../components/FormField';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  visible,
  phone,
  onClose,
  onConfirm,
}) => {
  const t = useTranslation();
  const [enteredPhone, setEnteredPhone] = useState('');

  useEffect(() => {
    if (!visible) setEnteredPhone('');
  }, [visible]);

  const isValid = enteredPhone === phone;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <KeyboardAwareScrollView
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={80}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={styles.overlay}>
          <View style={styles.box}>
            <Text style={styles.title}>
              {t.settings.delete_title}
            </Text>

            <Text style={styles.subtitle}>
              {t.settings.delete_subtitle}
            </Text>

            {/* Common FormField */}
            <FormField
              icon="phone"
              placeholder={t.settings.enter_phone}
              value={enteredPhone}
              onChangeText={(val) =>
                setEnteredPhone(val.replace(/[^0-9]/g, ''))
              }
              keyboardType="number-pad"
              maxLength={10}
            />

            <View style={styles.row}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={onClose}>
                <Text style={styles.cancelText}>
                  {t.common.cancel}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.deleteBtn,
                  !isValid && styles.deleteDisabled,
                ]}
                disabled={!isValid}
                onPress={onConfirm}>
                <Text style={styles.deleteText}>
                  {t.settings.delete}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </Modal>
  );
};

export default DeleteAccountModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000070',
    justifyContent: 'center',
    alignItems: 'center',
  },

  box: {
    width: '88%',
    backgroundColor: Colors.white,
    borderRadius: moderateScale(18),
    padding: moderateScale(20),
  },

  title: {
    ...Typography.subtitle,
    fontWeight: '700',
    color: Colors.error,
  },

  subtitle: {
    marginTop: verticalScale(8),
    ...Typography.small,
    color: Colors.textSecondary,
  },

  row: {
    flexDirection: 'row',
    gap: moderateScale(10),
    marginTop: verticalScale(18),
  },

  cancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(10),
    alignItems: 'center',
  },

  deleteBtn: {
    flex: 1,
    backgroundColor: Colors.error,
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(10),
    alignItems: 'center',
  },

  deleteDisabled: {
    backgroundColor: Colors.lightGray,
  },

  cancelText: {
    ...Typography.label,
    color: Colors.textSecondary,
  },

  deleteText: {
    ...Typography.label,
    color: Colors.white,
    fontWeight: '700',
  },
});