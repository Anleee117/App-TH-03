import React, { useState, useMemo } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import ScreenContainer from '../../components/common/ScreenContainer';
import AssignmentItem from '../../components/assignment/AssignmentItem';
import FilterChips from '../../components/common/FilterChips';
import EmptyState from '../../components/common/EmptyState';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import LoadingView from '../../components/common/LoadingView';
import AppButton from '../../components/common/AppButton';
import { useAppData } from '../../context/AppDataContext';
import { ROUTES } from '../../navigation/routes';
import { isOverdue } from '../../utils/date';
import spacing from '../../theme/spacing';

const FILTER_OPTIONS = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Chưa xong', value: 'todo' },
  { label: 'Đã xong', value: 'done' },
  { label: 'Quá hạn', value: 'overdue' },
];

export default function AssignmentListScreen({ navigation }) {
  const {
    assignments,
    pendingIds,
    loading,
    lastUpdated,
    loadAll,
    toggleAssignmentStatus,
  } = useAppData();
  const [filter, setFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const filtered = useMemo(() => {
    return assignments.filter((item) => {
      const overdue = isOverdue(item.dueDate, item.status);
      if (filter === 'todo') {
        return item.status !== 'done';
      }
      if (filter === 'done') {
        return item.status === 'done';
      }
      if (filter === 'overdue') {
        return overdue;
      }
      return true;
    });
  }, [assignments, filter]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAll();
    setRefreshing(false);
  };

  if (loading && assignments.length === 0) {
    return (
      <ScreenContainer>
        <LoadingView message="Đang tải danh sách bài tập…" />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.topBar}>
        <View style={styles.btnRow}>
          <AppButton
            title="+ Thêm bài tập mới"
            variant="primary"
            onPress={() => navigation.navigate(ROUTES.ASSIGNMENT_FORM)}
          />
        </View>
        <FilterChips
          options={FILTER_OPTIONS}
          selected={filter}
          onSelect={setFilter}
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
            title="Không có bài tập nào"
            description="Chưa có bài tập phù hợp với bộ lọc đã chọn"
          />
        }
        renderItem={({ item }) => (
          <AssignmentItem
            assignment={item}
            pending={pendingIds.includes(item.id.toString())}
            onPress={() =>
              navigation.navigate(ROUTES.ASSIGNMENT_DETAIL, { id: item.id })
            }
            onToggleStatus={() => toggleAssignmentStatus(item.id)}
          />
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  topBar: {
    paddingTop: spacing.sm,
  },
  btnRow: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xs,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
});
