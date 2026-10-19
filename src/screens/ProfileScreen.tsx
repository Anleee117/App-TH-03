
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { initialStudent, courses, results } from '../data/mockData';
import type { Student, ResultItem } from '../data/types';

const STUDENT_KEY = '@student_profile';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export default function ProfileScreen({ navigation }: Props) {
  const [student, setStudent] = useState<Student>(initialStudent);
  const [editName, setEditName] = useState(initialStudent.fullName);
  const [editEmail, setEditEmail] = useState(initialStudent.email);
  const [editPhone, setEditPhone] = useState(initialStudent.phone);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadStudent = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(STUDENT_KEY);

      let profile: Student;

      if (stored) {
        const savedProfile = JSON.parse(stored) as Partial<Student>;

        profile = {
          ...initialStudent,
          ...savedProfile,
          id: initialStudent.id,
          className: initialStudent.className,
          major: initialStudent.major,
        };
      } else {
        profile = initialStudent;
        await AsyncStorage.setItem(
          STUDENT_KEY,
          JSON.stringify(profile),
        );
      }

      setStudent(profile);
      setEditName(profile.fullName);
      setEditEmail(profile.email);
      setEditPhone(profile.phone);
    } catch (error) {
      console.error('Lỗi tải thông tin sinh viên:', error);
      Alert.alert('Lỗi', 'Không thể tải thông tin sinh viên.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadStudent);
    loadStudent();

    return unsubscribe;
  }, [navigation, loadStudent]);

  const saveProfile = async () => {
    const name = editName.trim();
    const email = editEmail.trim();
    const phone = editPhone.trim();

    if (!name || !email || !phone) {
      Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    const updated: Student = {
      ...student,
      fullName: name,
      email,
      phone,
    };

    try {
      await AsyncStorage.setItem(
        STUDENT_KEY,
        JSON.stringify(updated),
      );

      setStudent(updated);
      setIsEditing(false);
      Alert.alert('Thành công', 'Đã lưu thông tin sinh viên.');
    } catch (error) {
      console.error('Lỗi lưu thông tin sinh viên:', error);
      Alert.alert('Lỗi', 'Không thể lưu thông tin sinh viên.');
    }
  };

  const cancelEditing = () => {
    setEditName(student.fullName);
    setEditEmail(student.email);
    setEditPhone(student.phone);
    setIsEditing(false);
  };

  const renderResultItem = ({ item }: { item: ResultItem }) => {
    const course = courses.find(
      courseItem => courseItem.id === item.courseId,
    );

    return (
      <TouchableOpacity
        style={styles.gradeCard}
        onPress={() =>
          navigation.navigate('ResultDetail', { result: item })
        }>
        <View style={styles.gradeLeft}>
          <Text style={styles.gradeCourse}>
            {course?.name ?? 'Môn học không xác định'}
          </Text>
          <Text style={styles.gradeCredits}>
            {course?.code ?? item.courseId}
            {' - Điểm tổng kết: '}
            {item.totalScore.toFixed(1)}
          </Text>
        </View>

        <View style={styles.gradeRight}>
          <Text style={styles.gradeLetter}>{item.grade}</Text>
          <Text style={styles.arrow}>{'›'}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2058D8" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled">
      <View style={styles.section}>
        <View style={styles.profileHeading}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {student.fullName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.sectionTitle}>Thông tin sinh viên</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Mã sinh viên</Text>
          <Text style={styles.value}>{student.id}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Lớp</Text>
          <Text style={styles.value}>{student.className}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Ngành học</Text>
          <Text style={styles.value}>{student.major}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Họ tên</Text>
          <Text style={styles.value}>{student.fullName}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{student.email}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Số điện thoại</Text>
          <Text style={styles.value}>{student.phone}</Text>
        </View>

        {isEditing && (
          <View style={styles.editForm}>
            <Text style={styles.inputLabel}>Họ tên</Text>
            <TextInput
              style={styles.input}
              value={editName}
              onChangeText={setEditName}
              placeholder="Nhập họ tên"
              placeholderTextColor="#999"
            />

            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              value={editEmail}
              onChangeText={setEditEmail}
              placeholder="Nhập email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.inputLabel}>Số điện thoại</Text>
            <TextInput
              style={styles.input}
              value={editPhone}
              onChangeText={setEditPhone}
              placeholder="Nhập số điện thoại"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
            />
          </View>
        )}

        <View style={styles.buttonRow}>
          {isEditing ? (
            <>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={cancelEditing}>
                <Text style={styles.cancelBtnText}>Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.editBtn}
                onPress={saveProfile}>
                <Text style={styles.editBtnText}>Lưu</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => setIsEditing(true)}>
              <Text style={styles.editBtnText}>Chỉnh sửa</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.resultsSection}>
        <Text style={styles.resultsTitle}>Kết quả học tập</Text>

        <FlatList
          data={results}
          keyExtractor={item => item.id}
          renderItem={renderResultItem}
          scrollEnabled={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              Chưa có kết quả học tập.
            </Text>
          }
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F5FA',
  },
  content: {
    paddingTop: 4,
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F5FA',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 12,
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  profileHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#2058D8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#2058D8',
    fontSize: 22,
    fontWeight: 'bold',
  },
  sectionTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#202435',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF0F5',
  },
  label: {
    width: 108,
    fontSize: 13,
    color: '#858B9A',
  },
  value: {
    flex: 1,
    fontSize: 13,
    color: '#303443',
    fontWeight: '500',
  },
  editForm: {
    marginTop: 12,
  },
  inputLabel: {
    fontSize: 13,
    color: '#606779',
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDE2ED',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#303443',
    backgroundColor: '#FFFFFF',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 10,
  },
  editBtn: {
    flex: 1,
    backgroundColor: '#2058D8',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  editBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  cancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CBD0DC',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#606779',
    fontSize: 14,
    fontWeight: '600',
  },
  resultsSection: {
    marginHorizontal: 12,
    marginTop: 20,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#202435',
    marginBottom: 10,
  },
  gradeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
  },
  gradeLeft: {
    flex: 1,
    paddingRight: 8,
  },
  gradeCourse: {
    fontSize: 14,
    color: '#303443',
    fontWeight: '600',
  },
  gradeCredits: {
    fontSize: 12,
    color: '#858B9A',
    marginTop: 4,
  },
  gradeRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  gradeLetter: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2058D8',
  },
  arrow: {
    fontSize: 25,
    color: '#858B9A',
  },
  emptyText: {
    textAlign: 'center',
    color: '#858B9A',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
});
