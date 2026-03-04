import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { Colors } from '../theme/colors';

interface FormFieldProps {
  icon?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  editable?: boolean;
  keyboardType?: any;
  maxLength?: number;
  multiline?: boolean;
  numberOfLines?: number;
  isDropdown?: boolean;
  onPressDropdown?: () => void;
  inputStyle?: any;
}

const FormField: React.FC<FormFieldProps> = ({
  icon,
  placeholder,
  value,
  onChangeText,
  editable = true,
  keyboardType = 'default',
  maxLength,
  multiline = false,
  numberOfLines = 1,
  isDropdown = false,
  onPressDropdown,
  inputStyle,
}) => {
  const Container = isDropdown ? TouchableOpacity : View;

  return (
    <Container
      activeOpacity={0.8}
      onPress={isDropdown ? onPressDropdown : undefined}
      style={[
        styles.wrapper,
        multiline && styles.multilineWrapper,
        !editable && styles.disabled,
      ]}
    >
      {icon && (
        <Icon
          name={icon}
          size={moderateScale(18)}
          color={Colors.primary}
          style={[
            styles.leftIcon,
            multiline && styles.multilineIcon,
          ]}
        />
      )}

      {isDropdown ? (
        <Text
          style={[
            styles.dropdownText,
            !value && styles.placeholderText,
          ]}
        >
          {value || placeholder}
        </Text>
      ) : (
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={Colors.textSecondary}
          value={value}
          onChangeText={onChangeText}
          editable={editable}
          keyboardType={keyboardType}
          maxLength={maxLength}
          multiline={multiline}
          numberOfLines={numberOfLines}
          style={[
            styles.input,
            multiline && styles.textArea,
            inputStyle,
          ]}
        />
      )}

      {isDropdown && (
        <Icon
          name="chevron-down"
          size={moderateScale(18)}
          color={Colors.textSecondary}
        />
      )}
    </Container>
  );
};

export default FormField;

const styles = StyleSheet.create({
  wrapper: {
  flexDirection: 'row',
  alignItems: 'center',
  borderWidth: 1,
  borderColor: Colors.border,
  borderRadius: moderateScale(10),
  marginTop: moderateScale(14),
  paddingHorizontal: moderateScale(12),
  paddingVertical: verticalScale(10),
  backgroundColor: Colors.white,
},

  multilineWrapper: {
    alignItems: 'flex-start',
    height: 'auto',
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(10),
  },

  disabled: {
    backgroundColor: Colors.lightWhite,
  },

  leftIcon: {
    marginRight: moderateScale(8),
  },

  multilineIcon: {
    marginTop: verticalScale(2),
  },

  input: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: moderateScale(14),
    paddingVertical: 0,
  },

  textArea: {
    minHeight: verticalScale(80),
    textAlignVertical: 'top',
  },

  dropdownText: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: moderateScale(14),
  },

  placeholderText: {
    color: Colors.textSecondary,
  },
});