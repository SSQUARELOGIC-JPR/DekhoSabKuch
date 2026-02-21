import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  FlatList,
  TouchableOpacity,
  Switch,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';

import { Images } from '../constants/images';
import { Colors } from '../theme/colors';

type RoleType = 'customer' | 'provider' | 'both';
type ModeType = 'user' | 'provider';

// Dummy Categories (with icons)
const categories = [
  { id: '1', name: 'Plumber', icon: 'tool' },
  { id: '2', name: 'Electrician', icon: 'zap' },
  { id: '3', name: 'Carpenter', icon: 'box' },
  { id: '4', name: 'Painter', icon: 'droplet' },
];

// Dummy Providers
const providers = [
  { id: '1', name: 'Ramesh Verma', service: 'Electrician', rating: 4.5 },
  { id: '2', name: 'Suresh Kumar', service: 'Plumber', rating: 4.2 },
  { id: '3', name: 'Vijay Sharma', service: 'Carpenter', rating: 4.8 },
  { id: '4', name: 'Amit Singh', service: 'Electrician', rating: 4.1 },
];

const HomeScreen = ({ route }: any) => {
  const role: RoleType = route?.params?.role || 'customer';
  const [mode, setMode] = useState<ModeType>('user');
  const [search, setSearch] = useState('');

  const toggleMode = () => {
    setMode(prev => (prev === 'user' ? 'provider' : 'user'));
  };

  const showToggle = role === 'both';
  const isProviderOnly = role === 'provider';

  // 🔍 Search Filter
  const filteredProviders = useMemo(() => {
    return providers.filter(
      p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.service.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  // ================= HEADER =================
  const Header = () => (
    <View style={styles.header}>
      <TouchableOpacity>
        <Icon name="menu" size={24} color={Colors.white} />
      </TouchableOpacity>

      {!isProviderOnly && (
        <Text style={styles.headerTitle}>
          {mode === 'user' ? 'Find Services' : 'Provider Dashboard'}
        </Text>
      )}

      {showToggle && (
        <Switch
          value={mode === 'provider'}
          onValueChange={toggleMode}
          trackColor={{ false: '#ccc', true: Colors.primary }}
          thumbColor={Colors.white}
        />
      )}
    </View>
  );

  // ================= SEARCH BAR =================
  const SearchBar = () => (
    <View style={styles.searchBox}>
      <Icon name="search" size={18} color={Colors.textSecondary} />
      <TextInput
        placeholder="Search Plumber, Electrician..."
        placeholderTextColor={Colors.textSecondary}
        style={styles.searchInput}
        value={search}
        onChangeText={setSearch}
      />
    </View>
  );

  // ================= CATEGORY ITEM =================
  const CategoryItem = ({ item }: any) => (
    <TouchableOpacity style={styles.categoryChip}>
      <Icon name={item.icon} size={18} color={Colors.primary} />
      <Text style={styles.categoryText}>{item.name}</Text>
    </TouchableOpacity>
  );

  // ================= PROVIDER CARD =================
  const ProviderCard = ({ item }: any) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.service}>{item.service}</Text>

        <View style={styles.ratingRow}>
          <Text style={styles.rating}>⭐ {item.rating}</Text>
          <Text style={styles.distance}>• 2 km</Text>
        </View>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.callBtn}>
          <Icon name="phone" size={16} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.whatsappBtn}>
          <Icon name="message-circle" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  // ================= USER MODE UI =================
  const UserHome = () => (
    <>
      <SearchBar />

      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        renderItem={CategoryItem}
        contentContainerStyle={{ marginVertical: verticalScale(15) }}
      />

      <FlatList
        data={filteredProviders}
        keyExtractor={item => item.id}
        renderItem={ProviderCard}
        showsVerticalScrollIndicator={false}
      />
    </>
  );

  // ================= PROVIDER DASHBOARD =================
  const ProviderDashboard = () => (
    <View style={styles.dashboard}>
      <Text style={styles.dashboardTitle}>Provider Dashboard</Text>

      <View style={styles.infoBox}>
        <Text style={styles.infoLabel}>Plan Active Till</Text>
        <Text style={styles.infoValue}>25 May 2024</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoLabel}>Total Leads</Text>
        <Text style={styles.infoValue}>12</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoLabel}>Rating</Text>
        <Text style={styles.infoValue}>4.5 ⭐</Text>
      </View>
    </View>
  );

  return (
    <ImageBackground source={Images.splashBg} style={styles.bg}>
      <SafeAreaView style={styles.container}>
        <Header />

        {/* CONTENT LOGIC */}
        {role === 'provider' && <ProviderDashboard />}
        {role === 'customer' && <UserHome />}
        {role === 'both' &&
          (mode === 'user' ? <UserHome /> : <ProviderDashboard />)}
      </SafeAreaView>
    </ImageBackground>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  bg: { flex: 1 },

  container: {
    flex: 1,
    paddingHorizontal: moderateScale(20),
    paddingTop: verticalScale(10),
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(10),
  },

  headerTitle: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: Colors.white,
  },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: moderateScale(10),
    paddingHorizontal: moderateScale(12),
    height: moderateScale(45),
  },

  searchInput: {
    flex: 1,
    marginLeft: moderateScale(8),
    color: Colors.textPrimary,
  },

  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: moderateScale(20),
    paddingHorizontal: moderateScale(16),
    paddingVertical: verticalScale(8),
    marginRight: moderateScale(10),
    gap: moderateScale(6),
    elevation: 3,
  },

  categoryText: {
    fontSize: moderateScale(13),
    fontWeight: '600',
    color: Colors.textPrimary,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: moderateScale(12),
    padding: moderateScale(14),
    marginBottom: verticalScale(12),
    elevation: 3,
  },

  name: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: Colors.textPrimary,
  },

  service: {
    fontSize: moderateScale(13),
    color: Colors.textSecondary,
    marginTop: verticalScale(2),
  },

  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(4),
  },

  rating: {
    fontSize: moderateScale(13),
    color: Colors.primary,
    fontWeight: '600',
  },

  distance: {
    marginLeft: moderateScale(6),
    fontSize: moderateScale(12),
    color: Colors.textSecondary,
  },

  actionRow: {
    flexDirection: 'row',
    gap: moderateScale(8),
  },

  callBtn: {
    backgroundColor: '#2ecc71',
    padding: moderateScale(8),
    borderRadius: moderateScale(8),
  },

  whatsappBtn: {
    backgroundColor: '#25D366',
    padding: moderateScale(8),
    borderRadius: moderateScale(8),
  },

  dashboard: {
    marginTop: verticalScale(20),
    gap: verticalScale(14),
  },

  dashboardTitle: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: verticalScale(10),
  },

  infoBox: {
    backgroundColor: Colors.white,
    borderRadius: moderateScale(12),
    padding: moderateScale(16),
  },

  infoLabel: {
    fontSize: moderateScale(13),
    color: Colors.textSecondary,
  },

  infoValue: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: Colors.primary,
    marginTop: verticalScale(4),
  },
});
