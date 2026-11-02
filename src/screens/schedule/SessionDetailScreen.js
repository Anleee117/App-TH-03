import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import AppButton from '../../components/common/AppButton';
import { useAppData } from '../../context/AppDataContext';
import { sessionService } from '../../api/sessionService';
import { ROUTES } from '../../navigation/routes';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function SessionDetailScreen({ route, navigation }) {
  const { id } = route.params || {};
  const { sessions } = useAppData();

  const cachedSession = sessions.find((s) => s.id.toString() === (id || '').toString());
  const [session, setSession] = useState(cachedSession || null);
  const [loading, setLoading] = useState(!cachedSession);
  const [error, setError] = useState(null);

  const loadSession = async () => {
    if (!id) {
      return;
    }
    try {
      setLoading(!session);
      const res = await sessionService.getById(id);
      setSession(res);
      setError(null);
    } catch (err) {
      if (!session) {
        setError('Không thể tải chi tiết buổi học');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSession();
  }, [id]);

  useLayoutEffect(() => {
    if (session?.course?.name) {
      navigation.setOptions({ title: session.course.name });
    }
  }, [navigation, session]);

  if (loading && !session) {
    return (
      <ScreenContainer>
        <LoadingView message="Đang tải chi tiết buổi học…" />
      </ScreenContainer>
    );
  }

  if (error && !session) {
    return (
      <ScreenContainer>
        <ErrorView message={error} onRetry={loadSession} />
      </ScreenContainer>
    );
  }

  const dayStr =
    session?.dayOfWeek === 8
      ? 'Chủ nhật'
      : `Thứ ${session?.dayOfWeek}`;

  return (
    <ScreenContainer scroll>
      <View style={styles.card}>
        <Text style={styles.courseName}>
          {session?.course?.name || `Môn học #${session?.courseId}`}
        </Text>
        <Text style={styles.courseCode}>{session?.course?.code}</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Thứ:</Text>
          <Text style={styles.value}>{dayStr}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Thời gian:</Text>
          <Text style={styles.value}>
            {session?.startTime} - {session?.endTime}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Phòng học:</Text>
          <Text style={styles.value}>{session?.room}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Giảng viên:</Text>
          <Text style={styles.value}>{session?.course?.lecturer || '-'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Ghi chú:</Text>
          <Text style={styles.value}>{session?.note || 'Không có'}</Text>
        </View>

        {session?.courseId ? (
          <View style={styles.btnWrap}>
            <AppButton
              title="Xem môn học này"
              variant="outline"
              onPress={() =>
                navigation.navigate(ROUTES.COURSE_DETAIL, {
                  id: session.courseId,
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
  courseCode: {
    ...typography.captionBold,
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
  btnWrap: {
    marginTop: spacing.lg,
  },
});
