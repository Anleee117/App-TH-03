import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useApp} from '../context/AppContext';
import {Assignment} from '../data/types';
import {RootStackParamList} from '../navigation/types';
import AssignmentItem from '../components/AssignmentItem';
import FilterChips from '../components/FilterChips';
import EmptyState from '../components/EmptyState';
import {colors} from '../theme';

type Filter = 'all' | 'pending' | 'done';

const filterOptions: {label: string; value: Filter}[] = [
  {label: 'Tất cả', value: 'all'},
  {label: 'Chưa hoàn thành', value: 'pending'},
  {label: 'Đã hoàn thành', value: 'done'},
];

export default function AssignmentsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {assignments, toggleAssignment} = useApp();
  const [filter, setFilter] = useState<Filter>('all');
  const [data, setData] = useState<Assignment[]>([]);

  useEffect(() => {
    const filtered = assignments
      .filter(item => {
        if (filter === 'pending') {
          return !item.completed;
        }
        if (filter === 'done') {
          return item.completed;
        }
        return true;
      })
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
    setData(filtered);
  }, [assignments, filter]);

  return (
    <View style={styles.container}>
      <FilterChips options={filterOptions} value={filter} onChange={setFilter} />
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.content}
        ListEmptyComponent={<EmptyState message="Không có bài tập" />}
        renderItem={({item}) => (
          <AssignmentItem
            assignment={item}
            onToggle={() => toggleAssignment(item.id)}
            onPress={() => navigation.navigate('AssignmentDetail', {assignmentId: item.id})}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  content: {paddingHorizontal: 16, paddingBottom: 16},
});
