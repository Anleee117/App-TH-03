import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import AppButton from '../../components/common/AppButton';
import { useAppData } from '../../context/AppDataContext';
import { gradeService } from '../../api/gradeService';
import { ROUTES } from '../../navigation/routes';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function GradeDetailScreen({ route, navigation }) {
  const { id } = route.params || {};
  const { grades } = useAppData();

  const cachedGrade = grades.find((g) => g.id.toString() === (id || '').toString());
  const [grade, setGrade] = useState(cachedGrade || null);
  const [loading, setLoading] = useState(!cachedGrade);
  const [error, setError] = useState(null);

  const loadGrade = async () => {
    if (!id) {
      return;
    }
    try {
      setLoading(!grade);
      const res = await gradeService.getById(id);
      setGrade(res);
      setError(null);
    } catch (err) {
      if (!grade) {
        setError('Không thể tải chi tiết kết quả học tập');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGrade();
  }, [id]);

  useLayoutEffect(() => {
    if (grade?.course?.name) {
      navigation.setOptions({ title: grade.course.name });
    }
  }, [navigation, grade]);

  if (loading && !grade) {
    return (
      <ScreenContainer>
        <LoadingView message="Đang tải chi tiết điểm…" />
      </ScreenContainer>
    );
  }

  if (error && !grade) {
    return (
      <ScreenContainer>
        <ErrorView message={error} onRetry={loadGrade} />
      </ScreenContainer>
    );
  }

  const courseName = grade?.course?.name || `Môn học #${grade?.courseId}`;
  const cred = grade?.course?.credits || 3;

  return (
    <ScreenContainer scroll>
      <View style={styles.card}>
        <Text style={styles.courseName}>{courseName}</Text>
        <Text style={styles.subtitle}>
          Mã môn: {grade?.course?.code || '-'} • {cred} tín chỉ
        </Text>
        <Text style={styles.semester}>Học kỳ: {grade?.semester}</Text>

        <View style={styles.scoreTable}>
          <View style={styles.row}>
            <Text style={styles.label}>Điểm chuyên cần (10%):</Text>
            <Text style={styles.value}>
              {Number(grade?.attendance).toFixed(1)}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Điểm giữa kỳ (30%):</Text>
            <Text style={styles.value}>
              {Number(grade?.midterm).toFixed(1)}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Điểm cuối kỳ (60%):</Text>
            <Text style={styles.value}>
              {Number(grade?.final).toFixed(1)}
            </Text>
          </View>

          <View style={[styles.row, styles.totalRow]}>
            <Text style={styles.totalLabel}>Điểm tổng kết:</Text>
            <Text style={styles.totalValue}>
              {Number(grade?.total).toFixed(2)}
            </Text>
          </View>

          <View style={[styles.row, styles.letterRow]}>
            <Text style={styles.letterLabel}>Điểm chữ:</Text>
            <View style={styles.letterWrap}>
              <Text style={styles.letterValue}>{grade?.letter}</Text>
            </View>
          </View>
        </View>

        {grade?.courseId ? (
          <View style={styles.btnWrap}>
            <AppButton
              title="Xem thông tin môn học"
              variant="outline"
              onPress={() =>
                navigation.navigate(ROUTES.COURSE_DETAIL, {
                  id: grade.courseId,
                })
              }
            />
          </View>
        ) : null}
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
  courseName: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
  },
  semester: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  scoreTable: {
    marginTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
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
  },
  value: {
    ...typography.bodyBold,
    color: colors.text,
  },
  totalRow: {
    backgroundColor: colors.lightGray,
    paddingHorizontal: spacing.sm,
    marginVertical: spacing.xs,
  },
  totalLabel: {
    ...typography.bodyBold,
    color: colors.text,
  },
  totalValue: {
    ...typography.h3,
    color: colors.primary,
  },
  letterRow: {
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
  },
  letterLabel: {
    ...typography.bodyBold,
    color: colors.text,
  },
  letterWrap: {
    backgroundColor: colors.primary,
    borderRadius: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: 2,
  },
  letterValue: {
    ...typography.h3,
    color: colors.white,
  },
  btnWrap: {
    marginTop: spacing.xl,
  },
});
