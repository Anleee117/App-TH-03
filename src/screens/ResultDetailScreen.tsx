import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/types';
import {results} from '../data/mockData';
import {getCourse} from '../utils/helpers';
import InfoRow from '../components/InfoRow';
import EmptyState from '../components/EmptyState';
import {colors} from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'ResultDetail'>;

export default function ResultDetailScreen({route}: Props) {
  const result = results.find(item => item.id === route.params.resultId);
  const course = result ? getCourse(result.courseId) : undefined;

  if (!result || !course) {
    return <EmptyState message="Không tìm thấy kết quả học tập" />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.title}>{course.name}</Text>
        <InfoRow label="Mã môn học" value={course.code} />
        <InfoRow label="Số tín chỉ" value={String(course.credits)} />
        <InfoRow label="Điểm quá trình" value={result.processScore.toFixed(1)} />
        <InfoRow label="Điểm giữa kỳ" value={result.midtermScore.toFixed(1)} />
        <InfoRow label="Điểm cuối kỳ" value={result.finalScore.toFixed(1)} />
        <InfoRow label="Điểm tổng kết" value={result.totalScore.toFixed(1)} />
        <InfoRow label="Điểm chữ" value={result.grade} />
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
