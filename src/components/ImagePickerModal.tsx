import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { Colors } from '../theme/colors';
import { Strings } from '../constants/strings';
import { ImagePickerModalProps } from 'src/types/interfaces';

export const ImagePickerModal: React.FC<ImagePickerModalProps> = ({
  visible,
  onClose,
  onCamera,
  onGallery,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <View style={styles.box}>
            <Text style={styles.title}>{Strings.cameraModal.title}</Text>

            <TouchableOpacity style={styles.btn} onPress={onCamera}>
              <Text style={styles.btnText}>{Strings.cameraModal.camera}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btn} onPress={onGallery}>
              <Text style={styles.btnText}>{Strings.cameraModal.gallery}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, styles.cancelBtn]}
              onPress={onClose}>
              <Text style={[styles.btnText, { color: 'red' }]}>{Strings.cameraModal.cancel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    width: '80%',
    backgroundColor: Colors.white,
    borderRadius: moderateScale(14),
    paddingVertical: verticalScale(10),
  },
  title: {
    textAlign: 'center',
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: verticalScale(10),
  },
  btn: {
    paddingVertical: verticalScale(14),
    alignItems: 'center',
  },
  cancelBtn: {
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  btnText: {
    fontSize: moderateScale(15),
    color: Colors.primary,
    fontWeight: '600',
  },
});
