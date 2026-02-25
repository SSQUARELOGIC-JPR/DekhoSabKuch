import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const AccessBlockModal: React.FC<Props> = ({ visible, onClose }) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.title}>Complete Your Profile</Text>
          <Text style={styles.subtitle}>
            Please complete your profile and payment to access all features.
          </Text>

          <TouchableOpacity style={styles.btn} onPress={onClose}>
            <Text style={styles.btnText}>Okay</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default AccessBlockModal;

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
  btn: {
    marginTop: moderateScale(18),
    backgroundColor: Colors.accent,
    paddingVertical: moderateScale(10),
    borderRadius: moderateScale(10),
    alignItems: 'center',
  },
  btnText: {
    color: Colors.white,
    fontWeight: '600',
  },
});