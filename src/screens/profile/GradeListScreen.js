import React, { useState, useMemo } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import ScreenContainer from '../../components/common/ScreenContainer';
import GradeRow from '../../components/grade/GradeRow';
import GpaSummary from '../../components/grade/GpaSummary';
import FilterChips from '../../components/common/FilterChips';
import EmptyState from '../../components/common/EmptyState';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import LoadingView from '../../components/common/LoadingView';
import { useAppData } from '../../context/AppDataContext';
import { ROUTES } from '../../navigation/routes';
import { calcGpa } from '../../utils/gpa';
import spacing from '../../theme/spacing';

const SEMESTER_OPTIONS = [
  { label: 'Tất cả học kỳ', value: 'ALL' },
  { label: 'HK1 2026-2027', value: 'HK1 2026-2027' },
  { label: 'HK2 2026-2027', value: 'HK2 2026-2027' },
];

export default function GradeListScreen({ navigation }) {
  const { grades, courses, loading, lastUpdated, loadAll } = useAppData();
  const [semester, setSemester] = useState('ALL');
  const [refreshing, setRefreshing] = useState(false);

  const filtered = useMemo(() => {
    return grades.filter((item) => {
      if (semester === 'ALL') {
        return true;
      }
      return item.semester === semester;
    });
  }, [grades, semester]);

  const { gpa, totalCredits } = calcGpa(filtered, courses);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAll();
    setRefreshing(false);
  };

  if (loading && grades.length === 0) {
    return (
      <ScreenContainer>
        <LoadingView message="Đang tải kết quả học tập…" />
      </ScreenContainer>
    );
  }

  const header = (
    <View style={styles.header}>
      <FilterChips
        options={SEMESTER_OPTIONS}
        selected={semester}
        onSelect={setSemester}
      />
      <GpaSummary gpa={gpa} totalCredits={totalCredits} />
      <LastUpdatedText timestamp={lastUpdated} />
    </View>
  );

  return (
    <ScreenContainer>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={header}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            title="Chưa có điểm"
            description="Không có kết quả học tập trong học kỳ này"
          />
        }
        renderItem={({ item }) => (
          <GradeRow
            grade={item}
            onPress={() =>
              navigation.navigate(ROUTES.GRADE_DETAIL, { id: item.id })
            }
          />
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: spacing.xs,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
});
