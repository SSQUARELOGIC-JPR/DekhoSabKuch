import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Image,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { ScreenProps } from '../types/interfaces';
import { RootState } from '../store';
import { useTranslation } from '../localization/useTranslation';
import { translateDynamic } from '../localization/translateDynamic';
import { getProviderByIdApi } from '../services/api';
import { apiHandler } from '../utils/apiHandler';
import { ENV } from '../config/env';
import AccessBlockModal from '../components/AccessBlockModal';

const ProviderDetailsScreen: React.FC<ScreenProps> = ({
  navigation,
  route,
}) => {
  const insets = useSafeAreaInsets();
  const t = useTranslation();

  const user = useSelector((state: RootState) => state.auth.user);

  const initialProvider = route?.params?.provider;
  const providerId = route?.params?.providerId || initialProvider?._id;

  const [provider, setProvider] = useState<any>(
    initialProvider || null
  );

  const [loading, setLoading] = useState(!initialProvider);

  const [showSelfModal, setShowSelfModal] = useState(false);

  const getImageUri = (img?: string) => {
    if (!img) return undefined;
    if (img.startsWith('http') || img.startsWith('file')) return img;
    return ENV.IMAGE_BASE_URL + 'uploads/' + img;
  };

  const fetchProvider = useCallback(async () => {
    if (!providerId) return;

    setLoading(true);

    const res = await apiHandler(() =>
      getProviderByIdApi(providerId)
    );

    setLoading(false);

    if (!res?.provider) return;

    setProvider(res.provider);
  }, [providerId]);

  useEffect(() => {
    if (!initialProvider && providerId) {
      fetchProvider();
    }
  }, [fetchProvider]);

  const isSelfProvider = () => {
    return (user as any)?._id === provider?._id;
  };

  const handleCall = () => {
    if (!provider?.mobile) return;

    if (isSelfProvider()) {
      setShowSelfModal(true);
      return;
    }

    Linking.openURL(`tel:${provider.mobile}`);
  };

  const handleWhatsApp = () => {
    if (!provider?.mobile) return;

    if (isSelfProvider()) {
      setShowSelfModal(true);
      return;
    }

    const url = `whatsapp://send?phone=91${provider.mobile}`;

    Linking.openURL(url).catch(() => {
      Linking.openURL(`https://wa.me/91${provider.mobile}`);
    });
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator
          size="large"
          color={Colors.primary}
        />
      </View>
    );
  }

  if (!provider) {
    return (
      <View style={styles.loader}>
        <Text style={{ color: Colors.textPrimary }}>
          {t.common.notAvailable}
        </Text>
      </View>
    );
  }

  const fullAddress = [
    provider.village,
    provider.tehsil,
    provider.city,
    provider.state,
    provider.pincode,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <View style={styles.root}>
      {/* HEADER */}
      <View
        style={[
          styles.header,
          { paddingTop: insets.top + verticalScale(8) },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.backBtn,
            { top: insets.top + 6 },
          ]}
          onPress={() => navigation.goBack()}
        >
          <Icon
            name="arrow-left"
            size={22}
            color={Colors.white}
          />
        </TouchableOpacity>

        <View style={styles.avatar}>
          {provider.profileImage ? (
            <Image
              source={{
                uri: getImageUri(
                  provider.profileImage
                ),
              }}
              style={styles.avatarImg}
            />
          ) : (
            <Icon
              name="user"
              size={40}
              color={Colors.white}
            />
          )}
        </View>

        <Text style={styles.name}>
          {provider.name}
        </Text>

        <Text style={styles.role}>
          {translateDynamic(
            provider.category,
            t.categories
          )}
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* INFO CARD */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Icon
              name="map-pin"
              size={18}
              color={Colors.primary}
            />
            <Text style={styles.infoText}>
              {t.providerDetails.location}:{' '}
              {fullAddress || '-'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Icon
              name="star"
              size={18}
              color={Colors.warning}
            />
            <Text
              style={[
                styles.infoText,
                {
                  color: Colors.warning,
                  fontWeight: '700',
                },
              ]}
            >
              {provider.rating || 0} ⭐
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Icon
              name="briefcase"
              size={18}
              color={Colors.primary}
            />
            <Text style={styles.infoText}>
              {t.providerDetails.servicesDone}:{' '}
              {provider.servicesDone || 0}+
            </Text>
          </View>
        </View>

        {/* STATS */}
        <View style={styles.statsCard}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>
              {provider.experience || 0}+
            </Text>

            <Text style={styles.statLabel}>
              {t.providerDetails.experience}
            </Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statNumber}>
              {provider.servicesDone || 0}+
            </Text>

            <Text style={styles.statLabel}>
              {t.providerDetails.servicesDone}
            </Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statNumber}>
              {provider.rating || 0}
            </Text>

            <Text style={styles.statLabel}>
              {t.providerDetails.rating}
            </Text>
          </View>
        </View>

        {/* ABOUT */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {t.providerDetails.about}
          </Text>

          <Text style={styles.cardDesc}>
            {provider.about || '-'}
          </Text>
        </View>

        {/* ACTION BUTTONS */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.callBtn}
            onPress={handleCall}
          >
            <Icon
              name="phone"
              size={18}
              color={Colors.white}
            />

            <Text style={styles.btnText}>
              {t.providerDetails.call}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.whatsappBtn}
            onPress={handleWhatsApp}
          >
            <Icon
              name="message-circle"
              size={18}
              color={Colors.white}
            />

            <Text style={styles.btnText}>
              {t.providerDetails.whatsapp}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* SELF ACTION MODAL */}
      <AccessBlockModal
        visible={showSelfModal}
        title={t.common.selfActionTitle}
        subtitle={t.common.selfActionSubtitle}
        laterText={t.common.cancel}
        okText={t.settings.ok}
        onClose={() => setShowSelfModal(false)}
        onOk={() => setShowSelfModal(false)}
      />
    </View>
  );
};

export default ProviderDetailsScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.backgroundAlt,
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    backgroundColor: Colors.primary,
    alignItems: 'center',
    paddingBottom: verticalScale(26),
    borderBottomLeftRadius: moderateScale(26),
    borderBottomRightRadius: moderateScale(26),
  },

  avatar: {
    height: moderateScale(110),
    width: moderateScale(110),
    borderRadius: moderateScale(55),
    backgroundColor: Colors.primaryCard,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(10),
    elevation: 6,
    overflow: 'hidden',
  },

  avatarImg: {
    height: '100%',
    width: '100%',
  },

  name: {
    ...Typography.title,
    color: Colors.white,
  },

  role: {
    ...Typography.subtitle,
    color: Colors.primarySoft2,
  },

  infoCard: {
    backgroundColor: Colors.white,
    margin: moderateScale(14),
    borderRadius: moderateScale(16),
    padding: moderateScale(16),
    elevation: 3,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(10),
    gap: moderateScale(8),
  },

  infoText: {
    ...Typography.small,
    color: Colors.textPrimary,
    flex: 1,
  },

  statsCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: moderateScale(14),
    marginBottom: verticalScale(10),
    backgroundColor: Colors.white,
    borderRadius: moderateScale(16),
    paddingVertical: verticalScale(16),
    elevation: 3,
  },

  statBox: {
    alignItems: 'center',
    flex: 1,
  },

  statNumber: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: Colors.primary,
  },

  statLabel: {
    ...Typography.small,
    color: Colors.textSecondary,
    marginTop: verticalScale(2),
  },

  card: {
    backgroundColor: Colors.white,
    marginHorizontal: moderateScale(14),
    borderRadius: moderateScale(16),
    padding: moderateScale(16),
    elevation: 3,
  },

  cardTitle: {
    ...Typography.subtitle,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: verticalScale(6),
  },

  cardDesc: {
    ...Typography.small,
    color: Colors.textSecondary,
    lineHeight: moderateScale(18),
  },

  actionsRow: {
    flexDirection: 'row',
    gap: moderateScale(12),
    margin: moderateScale(14),
  },

  callBtn: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: moderateScale(12),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: verticalScale(12),
    gap: moderateScale(6),
  },

  whatsappBtn: {
    flex: 1,
    backgroundColor: Colors.whatsapp,
    borderRadius: moderateScale(12),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: verticalScale(12),
    gap: moderateScale(6),
  },

  btnText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: moderateScale(14),
  },

  backBtn: {
    position: 'absolute',
    left: moderateScale(14),
    height: moderateScale(36),
    width: moderateScale(36),
    borderRadius: moderateScale(18),
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});