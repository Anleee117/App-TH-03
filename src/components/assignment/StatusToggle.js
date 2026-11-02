import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';
import colors from '../../theme/colors';

export default function StatusToggle({ status = 'todo', onToggle }) {
  const isDone = status === 'done';

  return (
    <TouchableOpacity
      style={styles.touchArea}
      onPress={onToggle}
      accessibilityLabel={isDone ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu đã hoàn thành'}
      activeOpacity={0.7}
    >
      <View style={[styles.circle, isDone ? styles.circleDone : styles.circleTodo]}>
        {isDone ? (
          <Check size={14} color={colors.white} strokeWidth={3} />
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touchArea: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleTodo: {
    borderColor: '#CBD5E1',
    backgroundColor: colors.white,
  },
  circleDone: {
    borderColor: colors.success,
    backgroundColor: colors.success,
  },
});
