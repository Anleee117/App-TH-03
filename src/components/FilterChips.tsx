import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {colors} from '../theme';

type Option<T> = {
  label: string;
  value: T;
};

type Props<T> = {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
};

export default function FilterChips<T extends string | number>({options, value, onChange}: Props<T>) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.content}>
      {options.map(option => {
        const active = option.value === value;
        return (
          <TouchableOpacity
            key={String(option.value)}
            style={[styles.chip, active && styles.chipActive]}
            onPress={() => onChange(option.value)}>
            <Text style={[styles.chipText, active && styles.chipTextActive]}>{option.label}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {flexGrow: 0},
  content: {paddingHorizontal: 16, paddingVertical: 12},
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  chipActive: {backgroundColor: colors.primary, borderColor: colors.primary},
  chipText: {fontSize: 14, color: colors.text},
  chipTextActive: {color: '#FFFFFF', fontWeight: '600'},
});
