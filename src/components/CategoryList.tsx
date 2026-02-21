import React from 'react';
import { FlatList, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { categories } from '../utils/providersData';
import { CategoryListProps, Category } from '../types/interfaces';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';

const CategoryList: React.FC<CategoryListProps> = ({ selected, onSelect }) => {
  const renderItem = ({ item }: { item: Category }) => {
    const isActive = selected === item.name;

    return (
      <TouchableOpacity
        style={[styles.card, isActive && styles.activeCard]}
        onPress={() => onSelect(item.name)}
        activeOpacity={0.8}
      >
        <Icon
          name={item.icon as any}
          size={moderateScale(20)}
          color={isActive ? Colors.white : Colors.primary}
        />
        <Text style={[styles.text, isActive && styles.activeText]}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.wrapper}>
      <FlatList
        horizontal
        data={categories}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={renderItem}
      />
    </View>
  );
};

export default CategoryList;

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'visible', // shadow cut fix
  },
  list: {
    paddingBottom: verticalScale(4),
  },
  card: {
    backgroundColor: Colors.white,
    paddingVertical: verticalScale(10),
    paddingHorizontal: moderateScale(14),
    borderRadius: moderateScale(14),
    marginRight: moderateScale(10),
    alignItems: 'center',
    elevation: 2,
  },
  activeCard: {
    backgroundColor: Colors.primary,
  },
  text: {
    marginTop: verticalScale(4),
    ...Typography.small,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  activeText: {
    color: Colors.white,
  },
});