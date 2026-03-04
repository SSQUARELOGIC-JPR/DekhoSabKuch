import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { ConfirmModalProps } from '../types/interfaces';

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  title,
  subtitle,
  onClose,
  onOk,
  showLater = true,
  okText = 'Okay',
  laterText = 'Later',
}) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>

          <View style={styles.row}>
            {showLater && (
              <TouchableOpacity style={styles.laterBtn} onPress={onClose}>
                <Text style={styles.laterText}>{laterText}</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.okBtn} onPress={onOk}>
              <Text style={styles.okText}>{okText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000070',
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    width: '85%',
    backgroundColor: Colors.white,
    borderRadius: moderateScale(18),
    padding: moderateScale(20),
  },
  title: {
    ...Typography.subtitle,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  subtitle: {
    marginTop: moderateScale(8),
    ...Typography.small,
    color: Colors.textSecondary,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: moderateScale(18),
    gap: moderateScale(10),
  },
  laterBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: moderateScale(10),
    borderRadius: moderateScale(10),
    alignItems: 'center',
  },
  okBtn: {
    flex: 1,
    backgroundColor: Colors.accent,
    paddingVertical: moderateScale(10),
    borderRadius: moderateScale(10),
    alignItems: 'center',
  },
  laterText: {
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  okText: {
    color: Colors.white,
    fontWeight: '600',
  },
});