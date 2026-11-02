import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function GpaSummary({ gpa = 0, totalCredits = 0 }) {
  const gpaStr = Number(gpa).toFixed(2);

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.label}>GPA HỆ 4</Text>
        <Text style={styles.value}>{gpaStr}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.box}>
        <Text style={styles.label}>TÍN CHỈ TÍCH LŨY</Text>
        <Text style={styles.value}>{totalCredits}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    alignItems: 'center',
  },
  box: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 36,
    backgroundColor: '#E2E8F0',
  },
  label: {
    ...typography.captionBold,
    color: colors.textMuted,
    fontSize: 11,
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  value: {
    ...typography.h1,
    color: colors.primary,
    fontSize: 24,
  },
});
