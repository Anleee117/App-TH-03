import React, { useState, useMemo } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import ScreenContainer from '../../components/common/ScreenContainer';
import CourseCard from '../../components/course/CourseCard';
import SearchBar from '../../components/common/SearchBar';
import FilterChips from '../../components/common/FilterChips';
import EmptyState from '../../components/common/EmptyState';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import LoadingView from '../../components/common/LoadingView';
import { useAppData } from '../../context/AppDataContext';
import { ROUTES } from '../../navigation/routes';
import spacing from '../../theme/spacing';

const SEMESTER_OPTIONS = [
  { label: 'Tất cả học kỳ', value: 'ALL' },
  { label: 'HK1 2026-2027', value: 'HK1 2026-2027' },
  { label: 'HK2 2026-2027', value: 'HK2 2026-2027' },
];

export default function CourseListScreen({ navigation }) {
  const { courses, loading, lastUpdated, loadAll } = useAppData();
  const [kw, setKw] = useState('');
  const [semester, setSemester] = useState('ALL');
  const [refreshing, setRefreshing] = useState(false);

  const filtered = useMemo(() => {
    return courses.filter((item) => {
      const matchKw =
        !kw ||
        item.name.toLowerCase().includes(kw.toLowerCase()) ||
        item.code.toLowerCase().includes(kw.toLowerCase());
      const matchSem = semester === 'ALL' || item.semester === semester;
      return matchKw && matchSem;
    });
  }, [courses, kw, semester]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAll();
    setRefreshing(false);
  };

  if (loading && courses.length === 0) {
    return (
      <ScreenContainer>
        <LoadingView message="Đang tải danh sách môn học…" />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.topBar}>
        <SearchBar
          value={kw}
          onChangeText={setKw}
          placeholder="Tìm môn học theo mã hoặc tên..."
        />
        <FilterChips
          options={SEMESTER_OPTIONS}
          selected={semester}
          onSelect={setSemester}
        />
        <LastUpdatedText timestamp={lastUpdated} />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            title="Không tìm thấy môn học nào"
            description="Hãy thử đổi từ khóa tìm kiếm hoặc lọc học kỳ khác"
          />
        }
        renderItem={({ item }) => (
          <CourseCard
            course={item}
            onPress={() =>
              navigation.navigate(ROUTES.COURSE_DETAIL, { id: item.id })
            }
          />
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  topBar: {
    paddingTop: spacing.xs,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
});
