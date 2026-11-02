import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Calendar } from 'lucide-react-native';
import StatusToggle from './StatusToggle';
import SyncBadge from '../common/SyncBadge';
import { formatDate, isOverdue } from '../../utils/date';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

function AssignmentItem({
  assignment,
  pending = false,
  onPress,
  onToggleStatus,
}) {
  if (!assignment) {
    return null;
  }

  const overdue = isOverdue(assignment.dueDate, assignment.status);
  const courseTitle = assignment.course?.name || `Môn học #${assignment.courseId}`;

  return (
    <TouchableOpacity
      style={[styles.card, overdue && styles.cardOverdue]}
      onPress={onPress}
      accessibilityLabel={`Bài tập ${assignment.title}`}
      activeOpacity={0.7}
    >
      <View style={styles.toggleWrap}>
        <StatusToggle
          status={assignment.status}
          onToggle={onToggleStatus}
        />
      </View>
      <View style={styles.info}>
        <Text
          style={[
            styles.title,
            assignment.status === 'done' && styles.titleDone,
          ]}
          numberOfLines={2}
        >
          {assignment.title}
        </Text>
        <Text style={styles.course} numberOfLines={1}>
          {courseTitle}
        </Text>
        <View style={styles.dateRow}>
          <Calendar
            size={12}
            color={overdue ? colors.danger : colors.textMuted}
            style={styles.dateIcon}
          />
          <Text style={[styles.date, overdue && styles.dateOverdue]}>
            Hạn nộp: {formatDate(assignment.dueDate)} {overdue ? '(Quá hạn)' : ''}
          </Text>
        </View>
        <SyncBadge pending={pending} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    minHeight: 44,
  },
  cardOverdue: {
    borderColor: '#FCA5A5',
    backgroundColor: '#FEF2F2',
  },
  toggleWrap: {
    marginRight: spacing.sm,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  title: {
    ...typography.h3,
    color: colors.text,
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  course: {
    ...typography.caption,
    color: colors.textMuted,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  dateIcon: {
    marginRight: 4,
  },
  date: {
    ...typography.caption,
    color: colors.textMuted,
  },
  dateOverdue: {
    color: colors.danger,
    fontWeight: '700',
  },
});

export default React.memo(AssignmentItem);
