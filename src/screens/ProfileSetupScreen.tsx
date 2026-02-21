import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import { Images } from '../constants/images';
import { Colors } from '../theme/colors';
import { AppButton } from '../components/AppButton';
import { AppInput } from '../components/AppInput';
import { ImagePickerModal } from '../components/ImagePickerModal';
import { requestCameraPermission } from '../utils/permissions';
import { Routes } from '../constants/routes';

type RoleType = 'customer' | 'provider' | 'both';
type DocType = 'profile' | 'aadharFront' | 'aadharBack';

const ProfileScreen = ({ route, navigation }: any) => {
  const role: RoleType = route?.params?.role || 'customer';

  const [profileImg, setProfileImg] = useState<string | null>(null);
  const [aadharFront, setAadharFront] = useState<string | null>(null);
  const [aadharBack, setAadharBack] = useState<string | null>(null);

  const [activeDoc, setActiveDoc] = useState<DocType>('profile');
  const [showPicker, setShowPicker] = useState(false);

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateVal, setStateVal] = useState('');
  const [pincode, setPincode] = useState('');

  // ================= IMAGE HANDLER =================
  const handleImageSelect = (uri: string | null) => {
    if (!uri) return;

    if (activeDoc === 'profile') setProfileImg(uri);
    if (activeDoc === 'aadharFront') setAadharFront(uri);
    if (activeDoc === 'aadharBack') setAadharBack(uri);
  };

  const openCamera = async () => {
    const granted = await requestCameraPermission();
    if (!granted) return;

    const res = await launchCamera({
      mediaType: 'photo',
      quality: 0.7,
    });

    if (res.assets?.length) {
      handleImageSelect(res.assets[0].uri || null);
    }
  };

  const openGallery = async () => {
    const res = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.7,
      selectionLimit: 1,
    });

    if (res.assets?.length) {
      handleImageSelect(res.assets[0].uri || null);
    }
  };

  // ================= VALIDATION =================
  const isValid =
    name.trim().length > 0 &&
    address.trim().length > 0 &&
    city.trim().length > 0 &&
    stateVal.trim().length > 0 &&
    pincode.length === 6 &&
    (role === 'customer' || (aadharFront && aadharBack));

  const handleSubmit = () => {
    if (!isValid) return;
    navigation.navigate(Routes.Payment, { role });
  };

  // ================= UPLOAD BOX =================
  const UploadBox = ({
    label,
    image,
    docType,
  }: {
    label: string;
    image: string | null;
    docType: DocType;
  }) => (
    <TouchableOpacity
      style={styles.uploadBox}
      onPress={() => {
        setActiveDoc(docType);
        setShowPicker(true);
      }}>
      {image ? (
        <Image source={{ uri: image }} style={styles.docImg} />
      ) : (
        <>
          <Icon name="upload" size={22} color={Colors.primary} />
          <Text style={styles.uploadText}>{label}</Text>
        </>
      )}
    </TouchableOpacity>
  );

  return (
    <ImageBackground source={Images.splashBg} style={styles.bg}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={{ flex: 1 }}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: verticalScale(20) }}>

              {/* Profile Image */}
              <TouchableOpacity
                style={styles.avatarBox}
                onPress={() => {
                  setActiveDoc('profile');
                  setShowPicker(true);
                }}>
                {profileImg ? (
                  <Image source={{ uri: profileImg }} style={styles.avatar} />
                ) : (
                  <Icon name="camera" size={26} color={Colors.primary} />
                )}
              </TouchableOpacity>

              {/* FORM */}
              <View style={styles.form}>
                <AppInput
                  icon="user"
                  placeholder="Full Name"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />

                <AppInput
                  icon="map-pin"
                  placeholder="Local Address"
                  value={address}
                  onChangeText={setAddress}
                />

                <AppInput
                  icon="home"
                  placeholder="City"
                  value={city}
                  onChangeText={setCity}
                />

                <AppInput
                  icon="flag"
                  placeholder="State"
                  value={stateVal}
                  onChangeText={setStateVal}
                />

                <AppInput
                  icon="hash"
                  placeholder="Pincode"
                  value={pincode}
                  onChangeText={(t) => setPincode(t.replace(/[^0-9]/g, ''))}
                  keyboardType="number-pad"
                  maxLength={6}
                />

                {/* Aadhar Upload (Provider/Both) */}
                {(role === 'provider' || role === 'both') && (
                  <View style={{ marginTop: verticalScale(10) }}>
                    <Text style={styles.docTitle}>Upload Aadhar Card</Text>

                    <View style={styles.row}>
                      <UploadBox
                        label="Front"
                        image={aadharFront}
                        docType="aadharFront"
                      />
                      <UploadBox
                        label="Back"
                        image={aadharBack}
                        docType="aadharBack"
                      />
                    </View>
                  </View>
                )}
              </View>
            </ScrollView>

            {/* Sticky Button */}
            <AppButton
              title="Save & Continue"
              onPress={handleSubmit}
              disabled={!isValid}
            />
          </View>
        </KeyboardAvoidingView>

        {/* Image Picker Modal */}
        <ImagePickerModal
          visible={showPicker}
          onClose={() => setShowPicker(false)}
          onCamera={() => {
            setShowPicker(false);
            openCamera();
          }}
          onGallery={() => {
            setShowPicker(false);
            openGallery();
          }}
        />
      </SafeAreaView>
    </ImageBackground>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  bg: { flex: 1 },

  container: {
    flex: 1,
    paddingHorizontal: moderateScale(24),
    paddingVertical: verticalScale(20),
  },

  avatarBox: {
    alignSelf: 'center',
    height: moderateScale(100),
    width: moderateScale(100),
    borderRadius: moderateScale(50),
    borderWidth: 2,
    borderColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(20),
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },

  avatar: {
    height: '100%',
    width: '100%',
  },

  form: {
    gap: verticalScale(14),
  },

  docTitle: {
    color: Colors.white,
    fontSize: moderateScale(16),
    fontWeight: '600',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: moderateScale(12),
    marginTop: verticalScale(10),
  },

  uploadBox: {
    flex: 1,
    height: moderateScale(100),
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },

  uploadText: {
    color: Colors.white,
    marginTop: verticalScale(6),
    fontSize: moderateScale(14),
  },

  docImg: {
    height: '100%',
    width: '100%',
    borderRadius: moderateScale(12),
  },
});
