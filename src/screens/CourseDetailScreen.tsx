import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/types';
import {sessions} from '../data/mockData';
import {dayLabels, getCourse} from '../utils/helpers';
import InfoRow from '../components/InfoRow';
import SectionTitle from '../components/SectionTitle';
import EmptyState from '../components/EmptyState';
import {colors} from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'CourseDetail'>;

export default function CourseDetailScreen({route}: Props) {
  const course = getCourse(route.params.courseId);

  if (!course) {
    return <EmptyState message="Không tìm thấy môn học" />;
  }

  const courseSessions = sessions.filter(item => item.courseId === course.id);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.title}>{course.name}</Text>
        <InfoRow label="Mã môn học" value={course.code} />
        <InfoRow label="Số tín chỉ" value={String(course.credits)} />
        <InfoRow label="Giảng viên" value={course.lecturer} />
      </View>
      <SectionTitle title="Mô tả" />
      <View style={styles.card}>
        <Text style={styles.description}>{course.description}</Text>
      </View>
      <SectionTitle title="Lịch học" />
      <View style={styles.card}>
        {courseSessions.length === 0 ? (
          <EmptyState message="Chưa có lịch học" />
        ) : (
          courseSessions.map(item => (
            <InfoRow
              key={item.id}
              label={dayLabels[item.day]}
              value={`${item.startTime} - ${item.endTime}, phòng ${item.room}`}
            />
          ))
        )}
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
  description: {fontSize: 14, color: colors.text, lineHeight: 21},
});
