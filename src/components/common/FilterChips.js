import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function FilterChips({ options = [], selected, onSelect }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {options.map((item) => {
        const isMatch = selected === item.value;
        return (
          <TouchableOpacity
            key={item.value}
            style={[styles.chip, isMatch && styles.chipSelected]}
            onPress={() => onSelect && onSelect(item.value)}
            accessibilityLabel={item.label}
            activeOpacity={0.7}
          >
            <Text style={[styles.text, isMatch && styles.textSelected]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    gap: spacing.sm,
    alignItems: 'center',
  },
  chip: {
    minHeight: 36,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: 18,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  text: {
    ...typography.captionBold,
    color: colors.text,
    fontSize: 13,
  },
  textSelected: {
    color: colors.white,
  },
});
