import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/types';
import {useApp} from '../context/AppContext';
import {formatDate, getCourse} from '../utils/helpers';
import InfoRow from '../components/InfoRow';
import SectionTitle from '../components/SectionTitle';
import EmptyState from '../components/EmptyState';
import {colors} from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'AssignmentDetail'>;

export default function AssignmentDetailScreen({route}: Props) {
  const {assignments, toggleAssignment} = useApp();
  const assignment = assignments.find(item => item.id === route.params.assignmentId);

  if (!assignment) {
    return <EmptyState message="Không tìm thấy bài tập" />;
  }

  const course = getCourse(assignment.courseId);
  const done = assignment.completed;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.title}>{assignment.title}</Text>
        <InfoRow label="Môn học" value={course?.name ?? ''} />
        <InfoRow label="Hạn nộp" value={formatDate(assignment.dueDate)} />
        <InfoRow label="Trạng thái" value={done ? 'Đã hoàn thành' : 'Chưa hoàn thành'} />
      </View>
      <SectionTitle title="Nội dung" />
      <View style={styles.card}>
        <Text style={styles.description}>{assignment.description}</Text>
      </View>
      <TouchableOpacity
        style={[styles.button, {backgroundColor: done ? colors.warning : colors.success}]}
        onPress={() => toggleAssignment(assignment.id)}>
        <Text style={styles.buttonText}>
          {done ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu đã hoàn thành'}
        </Text>
      </TouchableOpacity>
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
  button: {marginTop: 20, borderRadius: 12, paddingVertical: 14, alignItems: 'center'},
  buttonText: {fontSize: 16, fontWeight: '700', color: '#FFFFFF'},
});
