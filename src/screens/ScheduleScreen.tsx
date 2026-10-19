import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {sessions} from '../data/mockData';
import {ScheduleSession} from '../data/types';
import {RootStackParamList} from '../navigation/types';
import SessionItem from '../components/SessionItem';
import FilterChips from '../components/FilterChips';
import EmptyState from '../components/EmptyState';
import {colors} from '../theme';

const dayOptions = [
  {label: 'Tất cả', value: 0},
  {label: 'T2', value: 2},
  {label: 'T3', value: 3},
  {label: 'T4', value: 4},
  {label: 'T5', value: 5},
  {label: 'T6', value: 6},
  {label: 'T7', value: 7},
  {label: 'CN', value: 8},
];

export default function ScheduleScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selectedDay, setSelectedDay] = useState(0);
  const [data, setData] = useState<ScheduleSession[]>(sessions);

  useEffect(() => {
    const filtered = sessions
      .filter(item => selectedDay === 0 || item.day === selectedDay)
      .sort((a, b) => a.day - b.day || a.startTime.localeCompare(b.startTime));
    setData(filtered);
  }, [selectedDay]);

  return (
    <View style={styles.container}>
      <FilterChips options={dayOptions} value={selectedDay} onChange={setSelectedDay} />
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.content}
        ListEmptyComponent={<EmptyState message="Không có lịch học" />}
        renderItem={({item}) => (
          <SessionItem
            session={item}
            onPress={() => navigation.navigate('SessionDetail', {sessionId: item.id})}
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
