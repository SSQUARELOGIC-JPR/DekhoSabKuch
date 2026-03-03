import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { moderateScale } from 'react-native-size-matters';

import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { useTranslation } from '../localization/useTranslation';
import { DeleteAccountModalProps } from '../types/interfaces';

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
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.title}>
            {t.settings.delete_title}
          </Text>

          <Text style={styles.subtitle}>
            {t.settings.delete_subtitle}
          </Text>

          <TextInput
            placeholder={t.settings.enter_phone}
            placeholderTextColor={Colors.textSecondary}
            value={enteredPhone}
            onChangeText={setEnteredPhone}
            keyboardType="number-pad"
            maxLength={10}
            style={styles.input}
          />

          <View style={styles.row}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>
                {t.common.cancel}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.deleteBtn,
                !isValid && { backgroundColor: Colors.lightGray },
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
    marginTop: moderateScale(8),
    ...Typography.small,
    color: Colors.textSecondary,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: moderateScale(10),
    marginTop: moderateScale(16),
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(10),
    color: Colors.textPrimary,
  },
  row: {
    flexDirection: 'row',
    gap: moderateScale(10),
    marginTop: moderateScale(18),
  },
  cancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: moderateScale(12),
    borderRadius: moderateScale(10),
    alignItems: 'center',
  },
  deleteBtn: {
    flex: 1,
    backgroundColor: Colors.error,
    paddingVertical: moderateScale(12),
    borderRadius: moderateScale(10),
    alignItems: 'center',
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