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
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useDispatch, useSelector } from 'react-redux';

import { Colors } from '../theme/colors';
import FormField from '../components/FormField';
import { ImagePickerModal } from '../components/ImagePickerModal';
import { requestCameraPermission } from '../utils/permissions';
import { Routes } from '../constants/routes';
import { RootState } from '../store';
import { updateProfileDone, updateUserProfile } from '../store/authSlice';
import AccessBlockModal from '../components/AccessBlockModal';
import { useTranslation } from '../localization/useTranslation';
import { updateProfileApi } from '../services/api';
import { apiHandler } from '../utils/apiHandler';
import { ENV } from '../config/env';

type RoleType = 'customer' | 'provider' | 'both';
type DocType = 'profile' | 'aadharFront' | 'aadharBack';

const ProfileScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const role: RoleType = user?.role || 'customer';
  const insets = useSafeAreaInsets();
  const t = useTranslation();

  const [loading, setLoading] = useState(false);

  const [profileImg, setProfileImg] = useState<string | null>(null);
  const [aadharFrontImage, setAadharFrontImage] = useState<string | null>(null);
  const [aadharBackImage, setAadharBackImage] = useState<string | null>(null);

  const [category, setCategory] = useState('');
  const [experience, setExperience] = useState('');
  const [about, setAbout] = useState('');

  const [activeDoc, setActiveDoc] = useState<DocType>('profile');
  const [showPicker, setShowPicker] = useState(false);

  const [name, setName] = useState('');
  const [village, setVillage] = useState('');
  const [tehsil, setTehsil] = useState('');
  const [city, setCity] = useState('');
  const [stateVal, setStateVal] = useState('');
  const [pincode, setPincode] = useState('');

  const [isEdit, setIsEdit] = useState(!user?.profileDone);
  const [showSuccess, setShowSuccess] = useState(false);

  const getImageUri = (img?: string | null) => {
    if (!img) return undefined;
    if (img.startsWith('file') || img.startsWith('http')) return img;
    return ENV.IMAGE_BASE_URL + 'uploads/' + img;
  };

  useEffect(() => {
    if (user) {
      setName(user.name ?? '');
      setVillage(user.village ?? '');
      setTehsil(user.tehsil ?? '');
      setCity(user.city ?? '');
      setStateVal(user.state ?? '');
      setPincode(user.pincode ?? '');
      setProfileImg(user.profileImage ?? null);
      setAadharFrontImage(user.aadharFrontImage ?? null);
      setAadharBackImage(user.aadharBackImage ?? null);
      setCategory(user.category ?? '');
      setExperience(user.experience ? String(user.experience) : '');
      setAbout(user.about ?? '');
    }
  }, [user]);

  const handleImageSelect = (uri: string | null) => {
    if (!uri) return;
    if (activeDoc === 'profile') setProfileImg(uri);
    if (activeDoc === 'aadharFront') setAadharFrontImage(uri);
    if (activeDoc === 'aadharBack') setAadharBackImage(uri);
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
    city.trim().length > 0 &&
    stateVal.trim().length > 0 &&
    pincode.length === 6 &&
    (role === 'customer' ||
      (aadharFrontImage &&
        aadharBackImage &&
        category.trim().length > 0 &&
        experience.trim().length > 0 &&
        about.trim().length > 0));

  const handleSubmit = async () => {
    if (!isValid || loading) return;

    setLoading(true);

    const formData = new FormData();

    formData.append('role', role);
    formData.append('name', name.trim());
    formData.append('village', village.trim());
    formData.append('tehsil', tehsil.trim());
    formData.append('city', city.trim());
    formData.append('state', stateVal.trim());
    formData.append('pincode', pincode);
    formData.append('category', category.trim());
    formData.append('experience', experience);
    formData.append('about', about.trim());

    if (profileImg?.startsWith('file')) {
      formData.append('profileImage', {
        uri: profileImg,
        name: 'profile.jpg',
        type: 'image/jpeg',
      } as any);
    }

    if (aadharFrontImage?.startsWith('file')) {
      formData.append('aadharFrontImage', {
        uri: aadharFrontImage,
        name: 'aadharFront.jpg',
        type: 'image/jpeg',
      } as any);
    }

    if (aadharBackImage?.startsWith('file')) {
      formData.append('aadharBackImage', {
        uri: aadharBackImage,
        name: 'aadharBack.jpg',
        type: 'image/jpeg',
      } as any);
    }

    const res = await apiHandler(() => updateProfileApi(formData));

    setLoading(false);
    if (!res?.data) return;

    dispatch(updateUserProfile(res.data));
    dispatch(updateProfileDone());

    setIsEdit(false);

    if (!res.data.paymentDone) {
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
        <Image source={{ uri: getImageUri(image) }} style={styles.docImg} />
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
      <View style={[styles.header, { paddingTop: insets.top + verticalScale(10) }]}>
        <Text style={styles.title}>{t.profile.profilePaggeTitle}</Text>

        {user?.profileDone && (
          <TouchableOpacity style={styles.editBtn} onPress={() => setIsEdit(!isEdit)}>
            <Icon name={isEdit ? 'x' : 'edit-2'} size={14} color={Colors.white} style={{ marginRight: 6 }} />
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
            <Image source={{ uri: getImageUri(profileImg) }} style={styles.headerAvatarImg} />
          ) : (
            <Icon name="camera" size={22} color={Colors.white} />
          )}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView style={styles.body} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>{t.profile.personalInfo}</Text>

            <FormField icon="user" placeholder={t.profile.name} value={name} onChangeText={setName} editable={isEdit} />
            <FormField icon="phone" placeholder="Mobile Number" value={user?.mobile || ''} editable={false} />

            <Text style={styles.sectionTitle}>{t.profile.addressDetails}</Text>

            <FormField icon="flag" placeholder={t.profile.state} value={stateVal} onChangeText={setStateVal} editable={isEdit} />
            <FormField icon="home" placeholder={t.profile.city} value={city} onChangeText={setCity} editable={isEdit} />
            <FormField icon="map-pin" placeholder={t.profile.tehsil} value={tehsil} onChangeText={setTehsil} editable={isEdit} />
            <FormField icon="map" placeholder={t.profile.village} value={village} onChangeText={setVillage} editable={isEdit} />
            <FormField
              icon="hash"
              placeholder={t.profile.pincode}
              value={pincode}
              keyboardType="number-pad"
              maxLength={6}
              onChangeText={(v) => setPincode(v.replace(/[^0-9]/g, ''))}
              editable={isEdit}
            />

            {(role === 'provider' || role === 'both') && (
              <>
                <Text style={styles.sectionTitle}>{t.profile.professionalDetails}</Text>

                <FormField icon="tool" placeholder={t.profile.category} value={category} onChangeText={setCategory} editable={isEdit} />

                <FormField
                  icon="award"
                  placeholder={t.profile.experience}
                  value={experience}
                  keyboardType="number-pad"
                  maxLength={2}
                  onChangeText={(v) => {
                    const cleaned = v.replace(/[^0-9]/g, '');
                    if (cleaned.length <= 2) setExperience(cleaned);
                  }}
                  editable={isEdit}
                />

                <FormField
                  icon="file-text"
                  placeholder={t.profile.aboutService}
                  value={about}
                  onChangeText={setAbout}
                  editable={isEdit}
                  multiline
                />

                <Text style={styles.docTitle}>{t.profile.uploadId}</Text>
                <View style={styles.row}>
                  <UploadBox label={t.common.front} image={aadharFrontImage} docType="aadharFront" />
                  <UploadBox label={t.common.back} image={aadharBackImage} docType="aadharBack" />
                </View>
              </>
            )}
          </View>
        </ScrollView>

        {isEdit && (
          <TouchableOpacity
            style={[styles.ctaButton, isValid ? styles.ctaActive : styles.ctaDisabled]}
            disabled={!isValid || loading}
            onPress={handleSubmit}>
            {loading ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.ctaText}>{t.profile.continue}</Text>}
          </TouchableOpacity>
        )}
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

      <AccessBlockModal
        visible={showSuccess}
        title={t.profile.updateSuccessTitle}
        subtitle={t.profile.updateSuccessSubtitle}
        laterText={t.profile.ok}
        okText={t.profile.ok}
        showLater={false}
        onClose={() => setShowSuccess(false)}
        onOk={() => {
          setShowSuccess(false);
          navigation.reset({
            index: 0,
            routes: [{ name: Routes.BottomTabs }],
          });
        }}
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

  card: {
    backgroundColor: Colors.white,
    borderRadius: moderateScale(14),
    padding: moderateScale(14),
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: verticalScale(14),
  },

  sectionTitle: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: verticalScale(12),
    marginBottom: verticalScale(4),
  },

  docTitle: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: Colors.textPrimary,
    marginTop: verticalScale(10),
  },

  row: {
    flexDirection: 'row',
    gap: moderateScale(12),
    marginTop: verticalScale(8),
  },

  uploadBox: {
    flex: 1,
    height: moderateScale(90),
    borderRadius: moderateScale(10),
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
    borderRadius: moderateScale(10),
  },

  ctaButton: {
    height: verticalScale(42),
    borderRadius: moderateScale(10),
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: verticalScale(10),
  },

  ctaActive: { backgroundColor: Colors.accent },
  ctaDisabled: { backgroundColor: Colors.lightGray },

  ctaText: {
    fontSize: moderateScale(15),
    fontWeight: '600',
    color: Colors.white,
  },
});