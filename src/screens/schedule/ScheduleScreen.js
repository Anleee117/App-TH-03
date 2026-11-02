import React, { useState, useMemo } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import ScreenContainer from '../../components/common/ScreenContainer';
import DaySelector from '../../components/schedule/DaySelector';
import SessionCard from '../../components/schedule/SessionCard';
import EmptyState from '../../components/common/EmptyState';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import LoadingView from '../../components/common/LoadingView';
import { useAppData } from '../../context/AppDataContext';
import { ROUTES } from '../../navigation/routes';
import spacing from '../../theme/spacing';

function getTodayDayOfWeek() {
  const day = new Date().getDay();
  return day === 0 ? 8 : day + 1;
}

export default function ScheduleScreen({ navigation }) {
  const { sessions, loading, lastUpdated, loadAll } = useAppData();
  const [selectedDay, setSelectedDay] = useState(getTodayDayOfWeek());
  const [refreshing, setRefreshing] = useState(false);

  const filtered = useMemo(() => {
    return sessions.filter(
      (item) => Number(item.dayOfWeek) === Number(selectedDay)
    );
  }, [sessions, selectedDay]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAll();
    setRefreshing(false);
  };

  if (loading && sessions.length === 0) {
    return (
      <ScreenContainer>
        <LoadingView message="Đang tải thời khóa biểu…" />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <DaySelector
        selectedDay={selectedDay}
        onSelectDay={setSelectedDay}
      />
      <LastUpdatedText timestamp={lastUpdated} />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            title="Không có lịch học"
            description={`Không có buổi học nào vào ${
              selectedDay === 8 ? 'Chủ nhật' : `Thứ ${selectedDay}`
            }`}
          />
        }
        renderItem={({ item }) => (
          <SessionCard
            session={item}
            onPress={() =>
              navigation.navigate(ROUTES.SESSION_DETAIL, { id: item.id })
            }
          />
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
});
