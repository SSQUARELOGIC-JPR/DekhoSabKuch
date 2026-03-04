import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Linking,
  ActivityIndicator,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import CategoryList from '../components/CategoryList';
import ProviderList from '../components/ProviderList';
import AccessBlockModal from '../components/AccessBlockModal';
import { Routes } from '../constants/routes';
import { RootState } from '../store';
import { useTranslation } from '../localization/useTranslation';
import { translateDynamic } from '../localization/translateDynamic';
import { getProvidersApi } from '../services/api';
import { apiHandler } from '../utils/apiHandler';
import { ENV } from '../config/env';

const LIMIT = 20;

const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const user = useSelector((state: RootState) => state.auth.user);
  const t = useTranslation();

  const [selectedCategory, setSelectedCategory] =
    useState<string>('Electrician');
  const [redirectTo, setRedirectTo] =
    useState<'profile' | 'payment' | null>(null);
  const [search, setSearch] = useState('');
  const [showBlocked, setShowBlocked] = useState(false);

  const [providers, setProviders] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  // ===============================
  // 📡 FETCH PROVIDERS
  // ===============================
  const fetchProviders = useCallback(
    async (pageNumber: number) => {
      if (loading || (!hasMore && pageNumber !== 1)) return;

      setLoading(true);

      const res = await apiHandler(() =>
        getProvidersApi(pageNumber, LIMIT)
      );

      setLoading(false);

      if (!res) return;

      const newProviders = res?.providers || [];

      setProviders(prev => {
        const merged =
          pageNumber === 1
            ? newProviders
            : [...prev, ...newProviders];

        const uniqueMap = new Map();
        merged.forEach((item: { _id: any; }) => {
          uniqueMap.set(item._id, item);
        });

        return Array.from(uniqueMap.values());
      });

      setHasMore(newProviders.length === LIMIT);
      setPage(pageNumber);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    fetchProviders(1);
  }, []);

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchProviders(page + 1);
    }
  };

  // ===============================
  // 🔐 ACCESS CONTROL
  // ===============================
  const checkAccess = () => {
    if (!user?.profileDone) {
      setRedirectTo('profile');
      setShowBlocked(true);
      return false;
    }

    if (!user?.paymentDone) {
      setRedirectTo('payment');
      setShowBlocked(true);
      return false;
    }

    return true;
  };

  const handleCall = (phone: string) => {
    if (!checkAccess()) return;
    Linking.openURL(`tel:${phone}`);
  };

  const handleWhatsApp = (phone: string) => {
    if (!checkAccess()) return;

    const url = `whatsapp://send?phone=91${phone}`;
    Linking.openURL(url).catch(() => {
      Linking.openURL(`https://wa.me/91${phone}`);
    });
  };

  const handleViewProfile = (provider: any) => {
    if (!checkAccess()) return;
    navigation.navigate(Routes.ProviderDetails, { provider });
  };

  // ===============================
  // 🔎 FILTER LOGIC
  // ===============================
  const filteredProviders = providers.filter(item => {
    const translatedCategory = translateDynamic(
      item.category,
      t.categories
    );

    const matchCategory =
      !selectedCategory ||
      item.category === selectedCategory;

    const matchSearch =
      item.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      item.category
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      translatedCategory
        .toLowerCase()
        .includes(search.toLowerCase());

    return matchCategory && matchSearch;
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View
        style={[
          styles.topHeader,
          { paddingTop: insets.top + verticalScale(6) },
        ]}
      >
        <Text style={styles.greeting}>
          {t.home.greeting}
        </Text>
        <Text style={styles.title}>
          {t.home.title}
        </Text>

        <View style={styles.searchBar}>
          <Icon
            name="search"
            size={moderateScale(18)}
            color={Colors.textPlaceholder}
          />
          <TextInput
            placeholder={t.home.searchPlaceholder}
            placeholderTextColor={Colors.textPlaceholder}
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } =
            nativeEvent;

          const isEndReached =
            layoutMeasurement.height +
              contentOffset.y >=
            contentSize.height - 20;

          if (isEndReached) loadMore();
        }}
        scrollEventThrottle={400}
      >
        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t.home.categories}
          </Text>

          <CategoryList
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </View>

        {/* Featured */}
        {filteredProviders.length > 0 && (
          <View style={styles.featuredCard}>
            <View>
              <Text style={styles.featuredTitle}>
                {t.home.topRated}
              </Text>

              <Text style={styles.featuredName}>
                {filteredProviders[0]?.name}
              </Text>

              <Text style={styles.featuredCategory}>
                {translateDynamic(
                  selectedCategory,
                  t.categories
                )}
              </Text>
            </View>

            <View style={styles.featuredAvatar}>
              {filteredProviders[0]?.profileImage ? (
                <Image
                  source={{
                    uri:
                      ENV.IMAGE_BASE_URL +
                      'uploads/' +
                      filteredProviders[0]
                        .profileImage,
                  }}
                  style={styles.featuredAvatar}
                  resizeMode="cover"
                />
              ) : (
                <Icon
                  name="person"
                  size={moderateScale(24)}
                  color={Colors.white}
                />
              )}
            </View>
          </View>
        )}

        {/* Provider List */}
        <ProviderList
          data={filteredProviders}
          onCall={handleCall}
          onMessage={handleWhatsApp}
          onViewProfile={handleViewProfile}
        />

        {loading && (
          <ActivityIndicator
            size="large"
            color={Colors.primary}
            style={{ marginVertical: 20 }}
          />
        )}
      </ScrollView>

      {/* Access Block Modal */}
      <AccessBlockModal
        visible={showBlocked}
        title={t.profile.title}
        subtitle={
          redirectTo === 'profile'
            ? t.profile.blockSubtitle
            : t.payment.blockSubtitle
        }
        laterText={t.profile.later}
        okText={t.profile.completeNow}
        onClose={() => setShowBlocked(false)}
        onOk={() => {
          setShowBlocked(false);

          if (redirectTo === 'profile') {
            navigation.navigate(Routes.Profile);
          } else if (redirectTo === 'payment') {
            navigation.navigate(Routes.Payment);
          }
        }}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.backgroundAlt },

  topHeader: {
    backgroundColor: Colors.primary,
    paddingHorizontal: moderateScale(14),
    paddingBottom: verticalScale(14),
    borderBottomLeftRadius: moderateScale(20),
    borderBottomRightRadius: moderateScale(20),
  },

  greeting: {
    color: Colors.white,
    ...Typography.subtitle,
  },

  title: {
    color: Colors.white,
    ...Typography.title,
    marginBottom: verticalScale(10),
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: moderateScale(12),
    paddingHorizontal: moderateScale(12),
    height: verticalScale(42),
  },

  searchInput: {
    marginLeft: moderateScale(6),
    flex: 1,
    color: Colors.textPrimary,
  },

  section: {
    marginTop: verticalScale(12),
    paddingLeft: moderateScale(14),
  },

  sectionTitle: {
    ...Typography.subtitle,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: verticalScale(8),
  },

  featuredCard: {
    margin: moderateScale(14),
    backgroundColor: Colors.primary,
    borderRadius: moderateScale(16),
    padding: moderateScale(14),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  featuredTitle: {
    color: Colors.primarySoft,
    ...Typography.small,
  },

  featuredName: {
    color: Colors.white,
    ...Typography.subtitle,
    fontWeight: '700',
    marginTop: verticalScale(2),
  },

  featuredCategory: {
    color: Colors.primarySoft2,
    marginTop: verticalScale(1),
    ...Typography.small,
  },

  featuredAvatar: {
    width: moderateScale(46),
    height: moderateScale(46),
    borderRadius: moderateScale(23),
    backgroundColor: Colors.primaryCard,
    justifyContent: 'center',
    alignItems: 'center',
  },
});