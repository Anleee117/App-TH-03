import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import AppButton from '../../components/common/AppButton';
import SyncBadge from '../../components/common/SyncBadge';
import { useAppData } from '../../context/AppDataContext';
import { assignmentService } from '../../api/assignmentService';
import { ROUTES } from '../../navigation/routes';
import { formatDate, isOverdue } from '../../utils/date';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function AssignmentDetailScreen({ route, navigation }) {
  const { id } = route.params || {};
  const {
    assignments,
    pendingIds,
    toggleAssignmentStatus,
  } = useAppData();

  const cachedAssignment = assignments.find(
    (a) => a.id.toString() === (id || '').toString()
  );
  const [assignment, setAssignment] = useState(cachedAssignment || null);
  const [loading, setLoading] = useState(!cachedAssignment);
  const [error, setError] = useState(null);

  const loadAssignment = async () => {
    if (!id) {
      return;
    }
    try {
      setLoading(!assignment);
      const res = await assignmentService.getById(id);
      setAssignment(res);
      setError(null);
    } catch (err) {
      if (!assignment) {
        setError('Không thể tải chi tiết bài tập');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignment();
  }, [id]);

  useEffect(() => {
    if (cachedAssignment) {
      setAssignment(cachedAssignment);
    }
  }, [cachedAssignment]);

  useLayoutEffect(() => {
    if (assignment?.title) {
      navigation.setOptions({ title: assignment.title });
    }
  }, [navigation, assignment]);

  if (loading && !assignment) {
    return (
      <ScreenContainer>
        <LoadingView message="Đang tải chi tiết bài tập…" />
      </ScreenContainer>
    );
  }

  if (error && !assignment) {
    return (
      <ScreenContainer>
        <ErrorView message={error} onRetry={loadAssignment} />
      </ScreenContainer>
    );
  }

  const isPending = pendingIds.includes(assignment?.id?.toString());
  const overdue = isOverdue(assignment?.dueDate, assignment?.status);
  const courseName =
    assignment?.course?.name || `Môn học #${assignment?.courseId}`;

  const handleToggle = () => {
    if (assignment) {
      toggleAssignmentStatus(assignment.id);
    }
  };

  return (
    <ScreenContainer scroll>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>{assignment?.title}</Text>
          <SyncBadge pending={isPending} />
        </View>

        <Text style={styles.course}>{courseName}</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Hạn nộp:</Text>
          <Text style={[styles.value, overdue && styles.overdueText]}>
            {formatDate(assignment?.dueDate)} {overdue ? '(Quá hạn)' : ''}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Trạng thái:</Text>
          <Text
            style={[
              styles.value,
              assignment?.status === 'done' ? styles.doneText : styles.todoText,
            ]}
          >
            {assignment?.status === 'done'
              ? 'Đã hoàn thành'
              : 'Chưa hoàn thành'}
          </Text>
        </View>

        <Text style={styles.descLabel}>Mô tả bài tập:</Text>
        <Text style={styles.desc}>
          {assignment?.description || 'Không có mô tả chi tiết'}
        </Text>

        <View style={styles.btnGroup}>
          <AppButton
            title={
              assignment?.status === 'done'
                ? 'Đánh dấu chưa hoàn thành'
                : 'Đánh dấu đã hoàn thành'
            }
            variant={assignment?.status === 'done' ? 'outline' : 'primary'}
            onPress={handleToggle}
          />

          {assignment?.courseId ? (
            <View style={styles.btnSpacer}>
              <AppButton
                title="Xem thông tin môn học"
                variant="outline"
                onPress={() =>
                  navigation.navigate(ROUTES.COURSE_DETAIL, {
                    id: assignment.courseId,
                  })
                }
              />
            </View>
          ) : null}
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    margin: spacing.md,
  },
  header: {
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  course: {
    ...typography.bodyBold,
    color: colors.primary,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  label: {
    ...typography.body,
    color: colors.textMuted,
    width: 100,
  },
  value: {
    ...typography.bodyBold,
    color: colors.text,
    flex: 1,
    textAlign: 'right',
  },
  overdueText: {
    color: colors.danger,
  },
  doneText: {
    color: colors.success,
  },
  todoText: {
    color: colors.warning,
  },
  descLabel: {
    ...typography.bodyBold,
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  desc: {
    ...typography.body,
    color: colors.text,
    lineHeight: 20,
  },
  btnGroup: {
    marginTop: spacing.xl,
  },
  btnSpacer: {
    marginTop: spacing.sm,
  },
});
