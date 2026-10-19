import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, TextInput, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Search} from 'lucide-react-native';
import {courses} from '../data/mockData';
import {Course} from '../data/types';
import {RootStackParamList} from '../navigation/types';
import CourseItem from '../components/CourseItem';
import EmptyState from '../components/EmptyState';
import {colors} from '../theme';

export default function CoursesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [query, setQuery] = useState('');
  const [data, setData] = useState<Course[]>(courses);

  useEffect(() => {
    const keyword = query.trim().toLowerCase();
    setData(courses.filter(item => item.name.toLowerCase().includes(keyword)));
  }, [query]);

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <Search size={22} color={colors.subText} />
        <TextInput
          style={styles.input}
          placeholder="Tìm kiếm môn học theo tên"
          placeholderTextColor={colors.subText}
          value={query}
          onChangeText={setQuery}
        />
      </View>
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.content}
        ListEmptyComponent={<EmptyState message="Không tìm thấy môn học phù hợp" />}
        renderItem={({item}) => (
          <CourseItem
            course={item}
            onPress={() => navigation.navigate('CourseDetail', {courseId: item.id})}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    margin: 16,
    marginBottom: 0,
    paddingHorizontal: 12,
  },
  input: {flex: 1, fontSize: 15, color: colors.text, paddingVertical: 10, marginLeft: 8},
  content: {padding: 16},
});
