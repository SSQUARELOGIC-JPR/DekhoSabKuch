import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Colors, Typography } from '../theme';
import { ConfirmModalProps } from '../types/interfaces';
import { moderateScale } from 'react-native-size-matters';

const { width } = Dimensions.get('window');

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  title,
  subtitle,
  onCancel,
  onConfirm,
  danger = false,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>

          <View style={styles.row}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.confirmBtn,
                {
                  backgroundColor: danger
                    ? Colors.error
                    : Colors.accent, // 👈 accent color
                },
              ]}
              onPress={onConfirm}>
              <Text style={styles.confirmText}>Confirm</Text>
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
    backgroundColor: '#00000066',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: moderateScale(16),
  },
  box: {
    width: '100%',
    maxWidth: moderateScale(360), // 👈 responsive max width
    backgroundColor: Colors.white,
    borderRadius: moderateScale(18),
    padding: moderateScale(20),
  },
  title: {
    ...Typography.title,
    color: Colors.textPrimary,
    marginBottom: moderateScale(8),
    textAlign: 'left',
  },
  subtitle: {
    ...Typography.subtitle,
    color: Colors.textSecondary,
    marginBottom: moderateScale(20),
    lineHeight: moderateScale(20),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  cancelBtn: {
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(18),
    marginRight: moderateScale(8),
  },
  cancelText: {
    color: Colors.textSecondary,
    fontWeight: '600',
    fontSize: moderateScale(14),
  },
  confirmBtn: {
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(20),
    borderRadius: moderateScale(10),
  },
  confirmText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: moderateScale(14),
  },
});