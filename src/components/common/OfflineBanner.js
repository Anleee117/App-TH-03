import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import useNetworkStatus from '../../hooks/useNetworkStatus';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function OfflineBanner() {
  const { isOnline } = useNetworkStatus();

  if (isOnline) {
    return null;
  }

  return (
    <View style={styles.banner}>
      <Text style={styles.text}>Bạn đang offline</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.danger,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...typography.captionBold,
    color: colors.white,
  },
});
