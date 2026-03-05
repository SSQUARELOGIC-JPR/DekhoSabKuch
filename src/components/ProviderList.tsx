import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import StarRating from './StarRating';
import { ProviderListProps, Provider } from '../types/interfaces';
import { useTranslation } from '../localization/useTranslation';
import { translateDynamic } from '../localization/translateDynamic';
import { ENV } from '../config/env';

const ProviderList: React.FC<ProviderListProps> = ({
  data,
  onBlockedPress,
  onCall,
  onMessage,
  onViewProfile,
  currentUserId,
}) => {
  const t = useTranslation();

  const renderItem = ({ item }: { item: Provider }) => {
    const isSelf = item._id === currentUserId;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => onViewProfile?.(item) || onBlockedPress?.()}
      >
        {/* Avatar */}
        <View style={styles.avatar}>
          {item.profileImage ? (
            <Image
              source={{
                uri:
                  ENV.IMAGE_BASE_URL +
                  'uploads/' +
                  item.profileImage,
              }}
              style={styles.avatarImg}
              resizeMode="cover"
            />
          ) : (
            <Icon
              name="person"
              size={moderateScale(20)}
              color={Colors.white}
            />
          )}
        </View>

        {/* Info */}
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{item.name}</Text>

            {isSelf && (
              <View style={styles.youBadge}>
                <Text style={styles.youText}>YOU</Text>
              </View>
            )}
          </View>

          <Text style={styles.category}>
            {translateDynamic(item.category, t.categories)}
          </Text>

          <StarRating rating={item.rating} />

          <View style={styles.metaRow}>
            <Icon
              name="location-outline"
              size={moderateScale(13)}
              color={Colors.textSecondary}
            />
            <Text style={styles.metaText}>{item.city}</Text>
          </View>
        </View>

        {/* Right Column */}
        <View style={styles.rightColumn}>
          {/* Arrow */}
          <TouchableOpacity
            onPress={() => onViewProfile?.(item) || onBlockedPress?.()}
          >
            <Icon
              name="chevron-forward"
              size={moderateScale(20)}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>

          {/* Call & Chat */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() =>
                onCall
                  ? onCall(item.phone as any, item._id)
                  : onBlockedPress?.()
              }
            >
              <Icon
                name="call"
                size={moderateScale(15)}
                color={Colors.primary}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() =>
                onMessage
                  ? onMessage(item.phone as any, item._id)
                  : onBlockedPress?.()
              }
            >
              <Icon
                name="logo-whatsapp"
                size={moderateScale(15)}
                color={Colors.primary}
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item._id}
      renderItem={renderItem}
      scrollEnabled={false}
      contentContainerStyle={styles.list}
      ListEmptyComponent={
        <Text style={styles.empty}>
          {t.common.noProviders}
        </Text>
      }
    />
  );
};

export default ProviderList;

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: moderateScale(14),
    paddingBottom: verticalScale(20),
  },

  card: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: moderateScale(14),
    padding: moderateScale(12),
    marginBottom: verticalScale(10),
    alignItems: 'center',
    elevation: 4,
    position: 'relative',
  },

  avatar: {
    width: moderateScale(46),
    height: moderateScale(46),
    borderRadius: moderateScale(10),
    marginRight: moderateScale(10),
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.08)',
    overflow: 'hidden',
  },

  avatarImg: {
    width: '100%',
    height: '100%',
    borderRadius: moderateScale(10),
  },

  info: {
    flex: 1,
    paddingRight: moderateScale(60),
  },

  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(6),
  },

  name: {
    ...Typography.subtitle,
    fontWeight: '700',
    color: Colors.textPrimary,
  },

  youBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: moderateScale(6),
    paddingVertical: verticalScale(1),
    borderRadius: moderateScale(6),
  },

  youText: {
    fontSize: moderateScale(9),
    color: Colors.white,
    fontWeight: '700',
  },

  category: {
    ...Typography.small,
    color: Colors.textSecondary,
    marginTop: verticalScale(1),
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(3),
  },

  metaText: {
    marginLeft: moderateScale(3),
    ...Typography.small,
    color: Colors.textDark,
  },

  rightColumn: {
    position: 'absolute',
    right: moderateScale(6),
    top: moderateScale(10),
    bottom: moderateScale(10),
    justifyContent: 'space-evenly',
    alignItems: 'flex-end',
  },

  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(6),
  },

  iconBtn: {
    width: moderateScale(30),
    height: moderateScale(30),
    borderRadius: moderateScale(15),
    backgroundColor: Colors.lightWhite,
    justifyContent: 'center',
    alignItems: 'center',
  },

  empty: {
    textAlign: 'center',
    marginTop: verticalScale(20),
    color: Colors.textSecondary,
    ...Typography.small,
  },
});