import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppButton from './AppButton';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function ErrorView({ message = 'Đã có lỗi xảy ra', onRetry }) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⚠️</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry ? (
        <View style={styles.btnWrap}>
          <AppButton title="Thử lại" onPress={onRetry} variant="primary" />
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
  },
  icon: {
    fontSize: 40,
    marginBottom: spacing.md,
  },
  message: {
    ...typography.body,
    color: colors.danger,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  btnWrap: {
    marginTop: spacing.sm,
  },
});
