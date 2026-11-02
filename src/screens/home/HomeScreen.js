import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import ScreenContainer from '../../components/common/ScreenContainer';
import CourseCard from '../../components/course/CourseCard';
import AssignmentItem from '../../components/assignment/AssignmentItem';
import EmptyState from '../../components/common/EmptyState';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import LoadingView from '../../components/common/LoadingView';
import { useAppData } from '../../context/AppDataContext';
import { useSync } from '../../context/SyncContext';
import { ROUTES } from '../../navigation/routes';
import { daysLeft } from '../../utils/date';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function HomeScreen({ navigation }) {
  const {
    student,
    courses,
    assignments,
    pendingIds,
    loading,
    lastUpdated,
    loadAll,
    toggleAssignmentStatus,
  } = useAppData();
  const { pendingCount } = useSync();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAll();
    setRefreshing(false);
  };

  if (loading && !student && courses.length === 0) {
    return (
      <ScreenContainer>
        <LoadingView message="Đang tải tổng quan…" />
      </ScreenContainer>
    );
  }

  const upcomingAssignments = assignments.filter((item) => {
    if (item.status === 'done') {
      return false;
    }
    const d = daysLeft(item.dueDate);
    return d >= 0 && d <= 7;
  });

  const totalPending = pendingCount || pendingIds.length;

  const header = (
    <View style={styles.headerWrap}>
      <View style={styles.studentCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {student?.fullName ? student.fullName.charAt(0).toUpperCase() : 'S'}
          </Text>
        </View>
        <View style={styles.studentInfo}>
          <Text style={styles.studentName}>
            {student?.fullName || 'Chưa cập nhật'}
          </Text>
          <Text style={styles.studentCode}>
            Mã SV: {student?.studentCode || student?.id || '-'}
          </Text>
          <Text style={styles.studentClass}>
            Lớp: {student?.className || '-'}
          </Text>
        </View>
      </View>

      {totalPending > 0 ? (
        <View style={styles.syncAlert}>
          <Text style={styles.syncAlertText}>
            Có {totalPending} thay đổi chưa đồng bộ
          </Text>
        </View>
      ) : null}

      <LastUpdatedText timestamp={lastUpdated} />

      <Text style={styles.sectionTitle}>Môn học đang học</Text>
    </View>
  );

  const footer = (
    <View style={styles.footerWrap}>
      <Text style={styles.sectionTitle}>Bài tập đến hạn (7 ngày tới)</Text>
      {upcomingAssignments.length === 0 ? (
        <EmptyState
          title="Không có bài tập đến hạn"
          description="Bạn đã hoàn thành hết bài tập trong tuần này"
        />
      ) : (
        upcomingAssignments.map((item) => (
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
    </View>
  );

  return (
    <ScreenContainer>
      <FlatList
        data={courses}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={header}
        ListFooterComponent={footer}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <EmptyState
            title="Chưa có môn học"
            description="Kéo xuống để tải lại dữ liệu"
            onAction={handleRefresh}
          />
        }
        renderItem={({ item }) => (
          <CourseCard
            course={item}
            onPress={() =>
              navigation.navigate(ROUTES.COURSE_DETAIL, { id: item.id })
            }
          />
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerWrap: {
    paddingTop: spacing.sm,
  },
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    ...typography.h2,
    color: colors.primary,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    ...typography.h2,
    color: colors.white,
  },
  studentCode: {
    ...typography.caption,
    color: '#DCE6FA',
    marginTop: 2,
  },
  studentClass: {
    ...typography.caption,
    color: '#DCE6FA',
  },
  syncAlert: {
    backgroundColor: colors.badgeBg,
    borderColor: colors.badgeText,
    borderWidth: 1,
    borderRadius: 8,
    padding: spacing.sm,
    marginHorizontal: spacing.md,
    marginBottom: spacing.xs,
  },
  syncAlertText: {
    ...typography.captionBold,
    color: colors.badgeText,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  footerWrap: {
    marginTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
});
