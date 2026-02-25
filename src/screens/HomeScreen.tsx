import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { categories, providers } from '../utils/providersData';
import { Strings } from '../constants/strings';
import CategoryList from '../components/CategoryList';
import ProviderList from '../components/ProviderList';
import AccessBlockModal from '../components/AccessBlockModal';
import { AuthContext } from '../context/AuthContext';

const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const { user } = useContext(AuthContext);

  const [selectedCategory, setSelectedCategory] = useState<string>('Electrician');
  const [search, setSearch] = useState<string>('');
  const [showBlocked, setShowBlocked] = useState(false);

  const checkAccess = () => {
    if (!user?.profileDone || !user?.paymentDone) {
      setShowBlocked(true);
      return false;
    }
    return true;
  };

  const filteredProviders = providers.filter(item => {
    const matchCategory = item.category === selectedCategory;
    const matchSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.topHeader, { paddingTop: insets.top + verticalScale(6) }]}>
        <Text style={styles.greeting}>{Strings.home.greeting}</Text>
        <Text style={styles.title}>{Strings.home.title}</Text>

        <View style={styles.searchBar}>
          <Icon name="search" size={moderateScale(18)} color={Colors.textPlaceholder} />
          <TextInput
            placeholder={Strings.home.searchPlaceholder}
            placeholderTextColor={Colors.textPlaceholder}
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{Strings.home.categories}</Text>

          <CategoryList
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </View>

        {/* Featured */}
        <View style={styles.featuredCard}>
          <View>
            <Text style={styles.featuredTitle}>{Strings.home.topRated}</Text>
            <Text style={styles.featuredName}>
              {filteredProviders[0]?.name || Strings.home.topRated}
            </Text>
            <Text style={styles.featuredCategory}>{selectedCategory}</Text>
          </View>
          <View style={styles.featuredAvatar}>
            <Icon name="person" size={moderateScale(24)} color={Colors.white} />
          </View>
        </View>

        {/* Provider List */}
        <ProviderList
          data={filteredProviders}
        // onPressItem={() => {
        //   if (!checkAccess()) return;
        // }}
        />
      </ScrollView>

      <AccessBlockModal
        visible={showBlocked}
        onClose={() => setShowBlocked(false)}
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