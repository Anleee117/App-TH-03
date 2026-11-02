import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

function CourseCard({ course, onPress }) {
  if (!course) {
    return null;
  }

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      accessibilityLabel={`Môn học ${course.name}`}
      activeOpacity={0.7}
    >
      <View style={styles.topRow}>
        <Text style={styles.code}>{course.code}</Text>
        <Text style={styles.credits}>{course.credits} tín chỉ</Text>
      </View>
      <Text style={styles.name}>{course.name}</Text>
      <Text style={styles.lecturer}>Giảng viên: {course.lecturer}</Text>
      {course.semester ? (
        <Text style={styles.semester}>Học kỳ: {course.semester}</Text>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    minHeight: 44,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  code: {
    ...typography.captionBold,
    color: colors.primary,
  },
  credits: {
    ...typography.caption,
    color: colors.textMuted,
  },
  name: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  lecturer: {
    ...typography.body,
    color: colors.textMuted,
  },
  semester: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
});

export default React.memo(CourseCard);
