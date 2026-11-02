import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

const DAYS = [
  { day: 2, label: 'T2' },
  { day: 3, label: 'T3' },
  { day: 4, label: 'T4' },
  { day: 5, label: 'T5' },
  { day: 6, label: 'T6' },
  { day: 7, label: 'T7' },
  { day: 8, label: 'CN' },
];

export default function DaySelector({ selectedDay, onSelectDay }) {
  return (
    <View style={styles.container}>
      {DAYS.map((item) => {
        const isMatch = selectedDay === item.day;
        return (
          <TouchableOpacity
            key={item.day}
            style={[styles.btn, isMatch && styles.btnActive]}
            onPress={() => onSelectDay && onSelectDay(item.day)}
            accessibilityLabel={`Chọn ngày ${item.label}`}
            activeOpacity={0.7}
          >
            <Text style={[styles.text, isMatch && styles.textActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  btn: {
    minWidth: 44,
    minHeight: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.lightGray,
  },
  btnActive: {
    backgroundColor: colors.primary,
  },
  text: {
    ...typography.captionBold,
    color: colors.text,
  },
  textActive: {
    color: colors.white,
  },
});
