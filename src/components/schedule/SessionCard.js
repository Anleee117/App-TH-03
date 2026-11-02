import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

function SessionCard({ session, onPress }) {
  if (!session) {
    return null;
  }

  const courseTitle = session.course?.name || `Môn học #${session.courseId}`;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      accessibilityLabel={`Buổi học môn ${courseTitle}`}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={styles.time}>
          {session.startTime} - {session.endTime}
        </Text>
        <Text style={styles.room}>Phòng: {session.room}</Text>
      </View>
      <Text style={styles.title}>{courseTitle}</Text>
      {session.note ? (
        <Text style={styles.note}>Ghi chú: {session.note}</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  time: {
    ...typography.captionBold,
    color: colors.primary,
  },
  room: {
    ...typography.caption,
    color: colors.textMuted,
  },
  title: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  note: {
    ...typography.body,
    color: colors.textMuted,
  },
});

export default React.memo(SessionCard);
