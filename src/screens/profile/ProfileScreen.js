import React, { useState } from 'react';
import { View, Text, StyleSheet, RefreshControl } from 'react-native';
import ScreenContainer from '../../components/common/ScreenContainer';
import InfoRow from '../../components/profile/InfoRow';
import GpaSummary from '../../components/grade/GpaSummary';
import AppButton from '../../components/common/AppButton';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import LoadingView from '../../components/common/LoadingView';
import { useAppData } from '../../context/AppDataContext';
import { ROUTES } from '../../navigation/routes';
import { calcGpa } from '../../utils/gpa';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function ProfileScreen({ navigation }) {
  const { student, grades, courses, loading, lastUpdated, loadAll } = useAppData();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAll();
    setRefreshing(false);
  };

  if (loading && !student) {
    return (
      <ScreenContainer>
        <LoadingView message="Đang tải thông tin cá nhân…" />
      </ScreenContainer>
    );
  }

  const { gpa, totalCredits } = calcGpa(grades, courses);

  return (
    <ScreenContainer
      scroll
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <View style={styles.content}>
        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {student?.fullName ? student.fullName.charAt(0).toUpperCase() : 'S'}
            </Text>
          </View>
          <Text style={styles.fullName}>{student?.fullName || '-'}</Text>
          <Text style={styles.studentCode}>
            Mã SV: {student?.studentCode || student?.id || '-'}
          </Text>
        </View>

        <LastUpdatedText timestamp={lastUpdated} style={styles.lastUpdate} />

        <GpaSummary gpa={gpa} totalCredits={totalCredits} />

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Thông tin sinh viên</Text>
          <InfoRow
            label="Mã sinh viên"
            value={student?.studentCode || student?.id}
          />
          <InfoRow label="Họ và tên" value={student?.fullName} />
          <InfoRow label="Lớp học" value={student?.className} />
          <InfoRow label="Ngành học" value={student?.major} />
          <InfoRow label="Email" value={student?.email} />
          <InfoRow label="Số điện thoại" value={student?.phone} />
        </View>

        <View style={styles.btnRow}>
          <AppButton
            title="Chỉnh sửa thông tin"
            variant="primary"
            onPress={() => navigation.navigate(ROUTES.EDIT_PROFILE)}
          />
          <View style={styles.spacer} />
          <AppButton
            title="Xem bảng điểm chi tiết"
            variant="outline"
            onPress={() => navigation.navigate(ROUTES.GRADE_LIST)}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.xxl,
  },
  avatarWrap: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  avatarText: {
    ...typography.h1,
    color: colors.white,
    fontSize: 26,
  },
  fullName: {
    ...typography.h2,
    color: colors.text,
  },
  studentCode: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  lastUpdate: {
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
  },
  cardTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  btnRow: {
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
  },
  spacer: {
    height: spacing.sm,
  },
});
