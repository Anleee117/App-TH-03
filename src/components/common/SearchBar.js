import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function SearchBar({
  value = '',
  onChangeText,
  placeholder = 'Tìm kiếm...',
}) {
  const handleClear = () => {
    if (onChangeText) {
      onChangeText('');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
      />
      {value.length > 0 ? (
        <TouchableOpacity
          style={styles.clearBtn}
          onPress={handleClear}
          accessibilityLabel="Xóa nội dung tìm kiếm"
          activeOpacity={0.7}
        >
          <Text style={styles.clearText}>✕</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    height: 44,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.text,
    paddingVertical: 0,
  },
  clearBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearText: {
    fontSize: 16,
    color: colors.textMuted,
  },
});
