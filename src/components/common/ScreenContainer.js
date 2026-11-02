import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import OfflineBanner from './OfflineBanner';
import colors from '../../theme/colors';

export default function ScreenContainer({
  children,
  scroll = false,
  refreshControl,
}) {
  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      <OfflineBanner />
      {scroll ? (
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          refreshControl={refreshControl}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={styles.container}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
