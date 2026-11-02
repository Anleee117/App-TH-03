import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppButton from './AppButton';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function EmptyState({
  title = 'Không có dữ liệu',
  description = '',
  actionLabel = 'Thử lại',
  onAction,
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
      {onAction ? (
        <View style={styles.btnWrap}>
          <AppButton title={actionLabel} variant="outline" onPress={onAction} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    minHeight: 200,
  },
  title: {
    ...typography.h3,
    color: colors.text,
    textAlign: 'center',
  },
  description: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  btnWrap: {
    marginTop: spacing.sm,
  },
});
