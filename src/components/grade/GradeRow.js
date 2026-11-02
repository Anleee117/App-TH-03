import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

function GradeRow({ grade, onPress }) {
  if (!grade) {
    return null;
  }

  const courseTitle = grade.course?.name || `Môn học #${grade.courseId}`;
  const cred = grade.course?.credits || 3;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      accessibilityLabel={`Kết quả môn ${courseTitle}`}
      activeOpacity={0.7}
    >
      <View style={styles.left}>
        <Text style={styles.title}>{courseTitle}</Text>
        <Text style={styles.subtitle}>
          {cred} tín chỉ • Học kỳ: {grade.semester}
        </Text>
      </View>
      <View style={styles.right}>
        <Text style={styles.score}>{Number(grade.total).toFixed(1)}</Text>
        <View style={styles.letterWrap}>
          <Text style={styles.letter}>{grade.letter}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    minHeight: 44,
  },
  left: {
    flex: 1,
    marginRight: spacing.md,
  },
  title: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textMuted,
  },
  right: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  score: {
    ...typography.h3,
    color: colors.text,
  },
  letterWrap: {
    backgroundColor: colors.lightGray,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 6,
    minWidth: 32,
    alignItems: 'center',
  },
  letter: {
    ...typography.captionBold,
    color: colors.primary,
  },
});

export default React.memo(GradeRow);
