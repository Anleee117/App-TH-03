import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function AppButton({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
}) {
  const isOutline = variant === 'outline';
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.btn,
        isOutline ? styles.btnOutline : styles.btnPrimary,
        isDisabled && styles.btnDisabled,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      accessibilityLabel={title}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={isOutline ? colors.primary : colors.white}
        />
      ) : (
        <Text
          style={[
            styles.text,
            isOutline ? styles.textOutline : styles.textPrimary,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    minHeight: 44,
    minWidth: 44,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimary: {
    backgroundColor: colors.primary,
  },
  btnOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  btnDisabled: {
    opacity: 0.5,
  },
  text: {
    ...typography.bodyBold,
  },
  textPrimary: {
    color: colors.white,
  },
  textOutline: {
    color: colors.primary,
  },
});
