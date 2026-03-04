import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';

interface SelectModalProps {
  visible: boolean;
  title: string;
  data: string[];
  onClose: () => void;
  onSelect: (value: string) => void;
}

const SelectModal: React.FC<SelectModalProps> = ({
  visible,
  title,
  data,
  onClose,
  onSelect,
}) => {
  const [search, setSearch] = useState('');

  const filteredData = useMemo(() => {
    return data.filter(item =>
      item.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, data]);

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="x" size={20} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Search */}
          <View style={styles.searchBox}>
            <Icon
              name="search"
              size={18}
              color={Colors.textSecondary}
              style={{ marginRight: 8 }}
            />
            <TextInput
              placeholder="Search..."
              placeholderTextColor={Colors.textSecondary}
              value={search}
              onChangeText={setSearch}
              style={styles.searchInput}
            />
          </View>

          {/* List */}
          <FlatList
            data={filteredData}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
              >
                <Text style={styles.itemText}>{item}</Text>
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
            style={styles.list}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default SelectModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000070',
    justifyContent: 'center',
    alignItems: 'center',
  },

  container: {
    width: '90%',
    maxHeight: '75%',
    backgroundColor: Colors.white,
    borderRadius: moderateScale(18),
    padding: moderateScale(16),
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(10),
  },

  title: {
    ...Typography.subtitle,
    fontWeight: '700',
    color: Colors.textPrimary,
  },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: moderateScale(10),
    paddingHorizontal: moderateScale(12),
    height: verticalScale(42),
    marginBottom: verticalScale(10),
  },

  searchInput: {
    flex: 1,
    color: Colors.textPrimary,
  },

  list: {
    flexGrow: 0,
  },

  item: {
    paddingVertical: verticalScale(12),
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },

  itemText: {
    ...Typography.small,
    color: Colors.textPrimary,
  },
});