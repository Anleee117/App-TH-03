import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ChevronRight, Clock, MapPin} from 'lucide-react-native';
import {ScheduleSession} from '../data/types';
import {dayLabels, getCourseName} from '../utils/helpers';
import {colors} from '../theme';

type Props = {
  session: ScheduleSession;
  onPress: () => void;
};

export default function SessionItem({session, onPress}: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.dayBox}>
        <Text style={styles.dayText}>{dayLabels[session.day]}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{getCourseName(session.courseId)}</Text>
        <View style={styles.row}>
          <Clock size={14} color={colors.subText} />
          <Text style={styles.meta}>
            {session.startTime} - {session.endTime}
          </Text>
        </View>
        <View style={styles.row}>
          <MapPin size={14} color={colors.subText} />
          <Text style={styles.meta}>Phòng {session.room}</Text>
        </View>
      </View>
      <ChevronRight size={24} color={colors.subText} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dayBox: {
    width: 64,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#E8EFFC',
    alignItems: 'center',
    marginRight: 12,
  },
  dayText: {fontSize: 13, fontWeight: '700', color: colors.primary},
  info: {flex: 1},
  name: {fontSize: 15, fontWeight: '600', color: colors.text, marginBottom: 4},
  row: {flexDirection: 'row', alignItems: 'center', marginTop: 2},
  meta: {fontSize: 13, color: colors.subText, marginLeft: 4},
});
