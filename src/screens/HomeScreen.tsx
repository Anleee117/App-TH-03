
import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CircleUser } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApp } from '../context/AppContext';
import { initialStudent } from '../data/mockData';
import type { Student } from '../data/types';
import { RootStackParamList } from '../navigation/types';
import CourseItem from '../components/CourseItem';
import AssignmentItem from '../components/AssignmentItem';
import SectionTitle from '../components/SectionTitle';
import EmptyState from '../components/EmptyState';
import { colors } from '../theme';

const STUDENT_KEY = '@student_profile';

export default function HomeScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { assignments } = useApp();

  const [student, setStudent] = useState<Student>(initialStudent);


  const loadStudent = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(STUDENT_KEY);

      if (stored) {
        const savedStudent = JSON.parse(stored) as Partial<Student>;

        setStudent({
          ...initialStudent,
          ...savedStudent,
          id: initialStudent.id,
          className: initialStudent.className,
          major: initialStudent.major,
        });
      } else {
        setStudent(initialStudent);
      }
    } catch (error) {
      console.error('Lỗi tải thông tin sinh viên:', error);
      setStudent(initialStudent);
    }
  }, []);


  useEffect(() => {
    loadStudent();

    const unsubscribe = navigation.addListener('focus', loadStudent);

    return unsubscribe;
  }, [navigation, loadStudent]);

  const upcoming = assignments
    .filter(item => !item.completed)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 3);

  const header = (
    <View>
      <View style={styles.profileCard}>
        <CircleUser size={56} color="#FFFFFF" />
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{student.fullName}</Text>
          <Text style={styles.studentId}>
            Mã sinh viên: {student.id}
          </Text>
        </View>
      </View>
      <SectionTitle title="Môn học đang học" />
    </View>
  );

  const footer = (
    <View>
      <SectionTitle title="Bài tập sắp đến hạn" />
      {upcoming.length === 0 ? (
        <EmptyState message="Không có bài tập sắp đến hạn" />
      ) : (
        upcoming.map(item => (
          <AssignmentItem
            key={item.id}
            assignment={item}
            onPress={() =>
              navigation.navigate('AssignmentDetail', {
                assignmentId: item.id,
              })
            }
          />
        ))
      )}
    </View>
  );

  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.content}
      data={require('../data/mockData').courses}
      keyExtractor={item => item.id}
      ListHeaderComponent={header}
      ListFooterComponent={footer}
      ListEmptyComponent={
        <EmptyState message="Chưa có môn học nào" />
      }
      renderItem={({ item }) => (
        <CourseItem
          course={item}
          onPress={() =>
            navigation.navigate('CourseDetail', {
              courseId: item.id,
            })
          }
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16 },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 14,
    padding: 16,
  },
  profileInfo: { marginLeft: 12, flex: 1 },
  name: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
  studentId: { fontSize: 14, color: '#DCE6FA', marginTop: 4 },
});
