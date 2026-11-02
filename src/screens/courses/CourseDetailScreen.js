import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import SessionCard from '../../components/schedule/SessionCard';
import AssignmentItem from '../../components/assignment/AssignmentItem';
import { useAppData } from '../../context/AppDataContext';
import { courseService } from '../../api/courseService';
import { ROUTES } from '../../navigation/routes';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function CourseDetailScreen({ route, navigation }) {
  const { id } = route.params || {};
  const { courses, sessions, assignments, pendingIds, toggleAssignmentStatus } = useAppData();

  const cachedCourse = courses.find((c) => c.id.toString() === (id || '').toString());
  const [course, setCourse] = useState(cachedCourse || null);
  const [loading, setLoading] = useState(!cachedCourse);
  const [error, setError] = useState(null);

  const loadCourse = async () => {
    if (!id) {
      return;
    }
    try {
      setLoading(!course);
      const res = await courseService.getById(id);
      setCourse(res);
      setError(null);
    } catch (err) {
      if (!course) {
        setError('Không thể tải thông tin môn học');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourse();
  }, [id]);

  useLayoutEffect(() => {
    if (course?.name) {
      navigation.setOptions({ title: course.name });
    }
  }, [navigation, course]);

  if (loading && !course) {
    return (
      <ScreenContainer>
        <LoadingView message="Đang tải chi tiết môn học…" />
      </ScreenContainer>
    );
  }

  if (error && !course) {
    return (
      <ScreenContainer>
        <ErrorView message={error} onRetry={loadCourse} />
      </ScreenContainer>
    );
  }

  const courseSessions = sessions.filter(
    (s) => s.courseId.toString() === (id || '').toString()
  );
  const courseAssignments = assignments.filter(
    (a) => a.courseId.toString() === (id || '').toString()
  );

  return (
    <ScreenContainer scroll>
      <View style={styles.card}>
        <Text style={styles.code}>{course?.code}</Text>
        <Text style={styles.name}>{course?.name}</Text>
        <Text style={styles.info}>Số tín chỉ: {course?.credits}</Text>
        <Text style={styles.info}>Giảng viên: {course?.lecturer}</Text>
        <Text style={styles.info}>Học kỳ: {course?.semester}</Text>
        <Text style={styles.descLabel}>Mô tả môn học:</Text>
        <Text style={styles.desc}>{course?.description}</Text>
      </View>

      <Text style={styles.sectionTitle}>Lịch học môn này</Text>
      {courseSessions.length === 0 ? (
        <Text style={styles.emptyNote}>Chưa có lịch học cho môn này</Text>
      ) : (
        courseSessions.map((item) => (
          <SessionCard
            key={item.id.toString()}
            session={item}
            onPress={() =>
              navigation.navigate(ROUTES.SESSION_DETAIL, { id: item.id })
            }
          />
        ))
      )}

      <Text style={styles.sectionTitle}>Bài tập môn này</Text>
      {courseAssignments.length === 0 ? (
        <Text style={styles.emptyNote}>Chưa có bài tập nào cho môn này</Text>
      ) : (
        courseAssignments.map((item) => (
          <AssignmentItem
            key={item.id.toString()}
            assignment={item}
            pending={pendingIds.includes(item.id.toString())}
            onPress={() =>
              navigation.navigate(ROUTES.ASSIGNMENT_DETAIL, { id: item.id })
            }
            onToggleStatus={() => toggleAssignmentStatus(item.id)}
          />
        ))
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    margin: spacing.md,
  },
  code: {
    ...typography.captionBold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  name: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  info: {
    ...typography.body,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  descLabel: {
    ...typography.bodyBold,
    color: colors.text,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  desc: {
    ...typography.body,
    color: colors.text,
    lineHeight: 20,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  emptyNote: {
    ...typography.caption,
    color: colors.textMuted,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
});
