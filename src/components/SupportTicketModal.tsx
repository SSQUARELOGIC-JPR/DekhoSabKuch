import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';

import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { useTranslation } from '../localization/useTranslation';
import { SupportTicketModalProps } from '../types/interfaces';
import FormField from '../components/FormField';
import SelectModal from '../components/SelectModal';

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
  const [showTypeModal, setShowTypeModal] = useState(false);

  const ticketTypes = useMemo(
    () => [
      { label: t.settings.ticket_types.payment, value: 'payment' },
      { label: t.settings.ticket_types.bug, value: 'bug' },
      { label: t.settings.ticket_types.provider, value: 'provider' },
      { label: t.settings.ticket_types.general, value: 'general' },
    ],
    [t]
  );

  const typeLabels = ticketTypes.map(item => item.label);

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

          {/* Ticket Type Dropdown */}
          <FormField
            icon="list"
            placeholder={t.settings.select_ticket_type}
            value={
              ticketTypes.find(i => i.value === type)?.label || ''
            }
            isDropdown
            editable={false}
            onPressDropdown={() => setShowTypeModal(true)}
          />

          {/* Summary */}
          <FormField
            icon="file-text"
            placeholder={t.settings.enter_summary}
            value={summary}
            onChangeText={setSummary}
          />

          {/* Description */}
          <FormField
            icon="message-square"
            placeholder={t.settings.describe_issue}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
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

      {/* Type Selection Modal */}
      <SelectModal
        visible={showTypeModal}
        title={t.settings.ticket_type}
        data={typeLabels}
        onClose={() => setShowTypeModal(false)}
        onSelect={(label: string) => {
          const selected = ticketTypes.find(
            item => item.label === label
          );
          setType(selected?.value || null);
        }}
      />
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
    marginBottom: verticalScale(10),
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