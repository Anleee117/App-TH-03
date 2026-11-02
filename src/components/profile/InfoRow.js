import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function InfoRow({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || '-'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    minHeight: 44,
    alignItems: 'center',
  },
  label: {
    ...typography.body,
    color: colors.textMuted,
    width: 120,
  },
  value: {
    ...typography.bodyBold,
    color: colors.text,
    flex: 1,
    textAlign: 'right',
  },
});
