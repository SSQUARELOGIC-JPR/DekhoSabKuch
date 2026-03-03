import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { Dropdown } from 'react-native-element-dropdown';

import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { useTranslation } from '../localization/useTranslation';
import { SupportTicketModalProps } from '../types/interfaces';

const SupportTicketModal: React.FC<SupportTicketModalProps> = ({
  visible,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const t = useTranslation();

  const [type, setType] = useState<string | null>(null);
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');

  const ticketTypes = useMemo(
    () => [
      { label: t.settings.ticket_types.payment, value: 'payment' },
      { label: t.settings.ticket_types.bug, value: 'bug' },
      { label: t.settings.ticket_types.provider, value: 'provider' },
      { label: t.settings.ticket_types.general, value: 'general' },
    ],
    [t]
  );

  const handleSubmit = () => {
    if (!type || !summary.trim() || !description.trim() || loading) return;

    onSubmit({
      type,
      summary,
      description,
    });

    setType(null);
    setSummary('');
    setDescription('');
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.title}>
            {t.settings.support_ticket_title}
          </Text>

          <Text style={styles.label}>{t.settings.ticket_type}</Text>
          <Dropdown
            style={styles.dropdown}
            data={ticketTypes}
            labelField="label"
            valueField="value"
            placeholder={t.settings.select_ticket_type}
            value={type}
            onChange={item => setType(item.value)}
          />

          <Text style={styles.label}>{t.settings.summary}</Text>
          <TextInput
            value={summary}
            onChangeText={setSummary}
            placeholder={t.settings.enter_summary}
            style={styles.input}
            placeholderTextColor={Colors.textSecondary}
          />

          <Text style={styles.label}>{t.settings.description}</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder={t.settings.describe_issue}
            multiline
            numberOfLines={4}
            style={[styles.input, styles.textArea]}
            placeholderTextColor={Colors.textSecondary}
          />

          <View style={styles.row}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={onClose}
              disabled={loading}>
              <Text style={styles.cancelText}>
                {t.common.cancel}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.submitBtn,
                loading && { opacity: 0.6 },
              ]}
              onPress={handleSubmit}
              disabled={loading}>
              <Text style={styles.submitText}>
                {t.settings.submit}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SupportTicketModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000070',
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    width: '90%',
    backgroundColor: Colors.white,
    borderRadius: moderateScale(18),
    padding: moderateScale(18),
  },
  title: {
    ...Typography.subtitle,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: verticalScale(12),
  },
  label: {
    ...Typography.small,
    color: Colors.textSecondary,
    marginBottom: verticalScale(4),
    marginTop: verticalScale(8),
  },
  dropdown: {
    height: verticalScale(48),
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: moderateScale(10),
    paddingHorizontal: moderateScale(10),
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: moderateScale(10),
    paddingHorizontal: moderateScale(10),
    height: verticalScale(46),
    color: Colors.textPrimary,
  },
  textArea: {
    height: verticalScale(90),
    textAlignVertical: 'top',
    paddingTop: verticalScale(8),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: verticalScale(16),
    gap: moderateScale(10),
  },
  cancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(10),
    alignItems: 'center',
  },
  submitBtn: {
    flex: 1,
    backgroundColor: Colors.accent,
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(10),
    alignItems: 'center',
  },
  cancelText: {
    ...Typography.label,
    color: Colors.textSecondary,
  },
  submitText: {
    ...Typography.label,
    color: Colors.white,
  },
});