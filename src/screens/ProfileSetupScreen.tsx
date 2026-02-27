import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Text,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useDispatch, useSelector } from 'react-redux';

import { Colors } from '../theme/colors';
import { AppInput } from '../components/AppInput';
import { ImagePickerModal } from '../components/ImagePickerModal';
import { requestCameraPermission } from '../utils/permissions';
import { Routes } from '../constants/routes';
import { RootState } from '../store';
import { updateProfileDone, updateUserProfile } from '../store/authSlice';
import AccessBlockModal from '../components/AccessBlockModal';
import { useTranslation } from '../localization/useTranslation';

type RoleType = 'customer' | 'provider' | 'both';
type DocType = 'profile' | 'aadharFront' | 'aadharBack';

const ProfileScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const role: RoleType = user?.role || 'customer';
  const insets = useSafeAreaInsets();
  const t = useTranslation();

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

  const [isEdit, setIsEdit] = useState(!user?.profileDone);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (user?.profileDone) {
      setName(user.name ?? '');
      setAddress(user.address ?? '');
      setCity(user.city ?? '');
      setStateVal(user.state ?? '');
      setPincode(user.pincode ?? '');
      setProfileImg(user.profileImage ?? null);
      setAadharFront(user.aadharFront ?? null);
      setAadharBack(user.aadharBack ?? null);
    }
  }, [user]);

  const handleImageSelect = (uri: string | null) => {
    if (!uri) return;
    if (activeDoc === 'profile') setProfileImg(uri);
    if (activeDoc === 'aadharFront') setAadharFront(uri);
    if (activeDoc === 'aadharBack') setAadharBack(uri);
  };

  const openCamera = async () => {
    const granted = await requestCameraPermission();
    if (!granted) return;
    const res = await launchCamera({ mediaType: 'photo', quality: 0.7 });
    if (res.assets?.length) handleImageSelect(res.assets[0].uri || null);
  };

  const openGallery = async () => {
    const res = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.7,
      selectionLimit: 1,
    });
    if (res.assets?.length) handleImageSelect(res.assets[0].uri || null);
  };

  const isValid =
    name.trim().length > 0 &&
    address.trim().length > 0 &&
    city.trim().length > 0 &&
    stateVal.trim().length > 0 &&
    pincode.length === 6 &&
    (role === 'customer' || (aadharFront && aadharBack));

  const handleSubmit = () => {
    if (!isValid) return;

    dispatch(
      updateUserProfile({
        name,
        address,
        city,
        state: stateVal,
        pincode,
        profileImage: profileImg,
        aadharFront,
        aadharBack,
      }),
    );

    dispatch(updateProfileDone());
    setIsEdit(false);

    if (!user?.paymentDone) {
      navigation.navigate(Routes.Payment, { role });
    } else {
      setShowSuccess(true);
    }
  };

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
        if (!isEdit) return;
        setActiveDoc(docType);
        setShowPicker(true);
      }}>
      {image ? (
        <Image source={{ uri: image }} style={styles.docImg} />
      ) : (
        <>
          <Icon name="upload" size={20} color={Colors.primary} />
          <Text style={styles.uploadText}>{label}</Text>
        </>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.root}>
      {/* HEADER */}
      <View style={[styles.header, { paddingTop: insets.top + verticalScale(10) }]}>
        <Text style={styles.title}>{t.profile.profilePaggeTitle}</Text>

        {user?.profileDone && (
          <TouchableOpacity style={styles.editBtn} onPress={() => setIsEdit(!isEdit)}>
            <Icon
              name={isEdit ? 'x' : 'edit-2'}
              size={moderateScale(14)}
              color={Colors.white}
              style={{ marginRight: moderateScale(4) }}
            />
            <Text style={styles.editText}>
              {isEdit ? t.common.cancel : t.profile.edit}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.headerAvatar}
          onPress={() => {
            if (!isEdit) return;
            setActiveDoc('profile');
            setShowPicker(true);
          }}>
          {profileImg ? (
            <Image source={{ uri: profileImg }} style={styles.headerAvatarImg} />
          ) : (
            <Icon name="camera" size={22} color={Colors.white} />
          )}
        </TouchableOpacity>
      </View>

      {/* BODY */}
      <KeyboardAvoidingView
        style={styles.body}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.card}>
            <AppInput icon="user" placeholder={t.profile.name} value={name} onChangeText={setName} editable={isEdit} />
            <AppInput icon="map-pin" placeholder={t.profile.address} value={address} onChangeText={setAddress} editable={isEdit} />
            <AppInput icon="home" placeholder={t.profile.city} value={city} onChangeText={setCity} editable={isEdit} />
            <AppInput icon="flag" placeholder={t.profile.state} value={stateVal} onChangeText={setStateVal} editable={isEdit} />
            <AppInput
              icon="hash"
              placeholder={t.profile.pincode}
              value={pincode}
              onChangeText={(tVal) => setPincode(tVal.replace(/[^0-9]/g, ''))}
              keyboardType="number-pad"
              maxLength={6}
              editable={isEdit}
            />

            {(role === 'provider' || role === 'both') && (
              <>
                <Text style={styles.docTitle}>{t.profile.uploadId}</Text>
                <View style={styles.row}>
                  <UploadBox label={t.common.front} image={aadharFront} docType="aadharFront" />
                  <UploadBox label={t.common.back} image={aadharBack} docType="aadharBack" />
                </View>
              </>
            )}
          </View>

        </ScrollView>

        {/* Bottom Button */}
        <View style={styles.bottomBtnWrap}>
          {isEdit && (
            <TouchableOpacity
              style={[
                styles.ctaButton,
                isValid ? styles.ctaActive : styles.ctaDisabled,
              ]}
              disabled={!isValid}
              onPress={handleSubmit}>
              <Text style={[styles.ctaText, !isValid && { color: Colors.textSecondary }]}>
                {t.profile.continue}
              </Text>
            </TouchableOpacity>
          )}
        </View>

      </KeyboardAvoidingView>

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

      {/* SUCCESS MODAL */}
      <AccessBlockModal
        visible={showSuccess}
        title={t.profile.updateSuccessTitle}
        subtitle={t.profile.updateSuccessSubtitle}
        laterText={t.profile.ok}
        okText={t.profile.ok}
        showLater={false}
        onClose={() => setShowSuccess(false)}
        onOk={() => setShowSuccess(false)}
      />
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.backgroundAlt },

  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: moderateScale(16),
    paddingBottom: verticalScale(26),
    borderBottomLeftRadius: moderateScale(24),
    borderBottomRightRadius: moderateScale(24),
    alignItems: 'center',
  },

  editBtn: {
    position: 'absolute',
    right: moderateScale(16),
    top: verticalScale(40),
    paddingHorizontal: moderateScale(10),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(6),
    backgroundColor: 'rgba(255,255,255,0.15)',
    flexDirection: 'row',
    alignItems: 'center',
  },

  editText: {
    color: Colors.white,
    fontSize: moderateScale(13),
    fontWeight: '600',
  },

  headerAvatar: {
    height: moderateScale(70),
    width: moderateScale(70),
    borderRadius: moderateScale(35),
    borderWidth: 3,
    borderColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(10),
    backgroundColor: Colors.primary,
  },

  headerAvatarImg: {
    height: '100%',
    width: '100%',
    borderRadius: moderateScale(35),
  },

  title: {
    color: Colors.white,
    fontSize: moderateScale(20),
    fontWeight: '700',
  },

  body: { flex: 1, paddingHorizontal: moderateScale(16) },

  scrollContent: {
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(10),
  },

  card: {
    backgroundColor: Colors.white,
    borderRadius: moderateScale(12),
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(6),
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
  },

  docTitle: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: Colors.textPrimary,
  },

  row: { flexDirection: 'row', gap: moderateScale(12) },

  uploadBox: {
    flex: 1,
    height: moderateScale(90),
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.lightWhite,
  },

  uploadText: {
    color: Colors.textSecondary,
    marginTop: verticalScale(6),
    fontSize: moderateScale(13),
  },

  docImg: {
    height: '100%',
    width: '100%',
    borderRadius: moderateScale(12),
  },

  bottomBtnWrap: {
    paddingTop: verticalScale(6),
    paddingBottom: verticalScale(4),
  },

  ctaButton: {
    height: verticalScale(36),
    borderRadius: moderateScale(8),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: moderateScale(24),
  },

  ctaActive: { backgroundColor: Colors.accent },
  ctaDisabled: { backgroundColor: Colors.lightGray },

  ctaText: {
    fontSize: moderateScale(15),
    fontWeight: '600',
    color: Colors.white,
  },
});