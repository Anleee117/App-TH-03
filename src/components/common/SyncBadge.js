import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function SyncBadge({ pending = false }) {
  if (!pending) {
    return null;
  }

  return (
    <View style={styles.badge}>
      <Text style={styles.text}>Chưa đồng bộ</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: colors.badgeBg,
    borderColor: colors.badgeText,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  text: {
    ...typography.captionBold,
    color: colors.badgeText,
    fontSize: 11,
  },
});
