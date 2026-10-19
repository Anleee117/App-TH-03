import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/types';
import {sessions} from '../data/mockData';
import {dayLabels, getCourse} from '../utils/helpers';
import InfoRow from '../components/InfoRow';
import EmptyState from '../components/EmptyState';
import {colors} from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'SessionDetail'>;

export default function SessionDetailScreen({route}: Props) {
  const session = sessions.find(item => item.id === route.params.sessionId);
  const course = session ? getCourse(session.courseId) : undefined;

  if (!session || !course) {
    return <EmptyState message="Không tìm thấy buổi học" />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.title}>{course.name}</Text>
        <InfoRow label="Mã môn học" value={course.code} />
        <InfoRow label="Thứ" value={dayLabels[session.day]} />
        <InfoRow label="Thời gian" value={`${session.startTime} - ${session.endTime}`} />
        <InfoRow label="Phòng học" value={session.room} />
        <InfoRow label="Hình thức" value={session.type} />
        <InfoRow label="Giảng viên" value={course.lecturer} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  content: {padding: 16},
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 8},
});
