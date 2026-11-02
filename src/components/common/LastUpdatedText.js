import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { formatTime } from '../../utils/date';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function LastUpdatedText({ timestamp, style }) {
  if (!timestamp) {
    return null;
  }

  const formatted = formatTime(timestamp);
  if (!formatted) {
    return null;
  }

  return (
    <Text style={[styles.text, style]}>Cập nhật lần cuối: {formatted}</Text>
  );
}

const styles = StyleSheet.create({
  text: {
    ...typography.caption,
    color: colors.textMuted,
    paddingHorizontal: spacing.md,
    marginVertical: spacing.xs,
  },
});
