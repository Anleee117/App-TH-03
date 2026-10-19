import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Calendar, Circle, CircleCheck} from 'lucide-react-native';
import {Assignment} from '../data/types';
import {formatDate, getCourseName} from '../utils/helpers';
import {colors} from '../theme';

type Props = {
  assignment: Assignment;
  onPress: () => void;
  onToggle?: () => void;
};

export default function AssignmentItem({assignment, onPress, onToggle}: Props) {
  const done = assignment.completed;
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {onToggle ? (
        <TouchableOpacity onPress={onToggle} style={styles.check}>
          {done ? (
            <CircleCheck size={26} color={colors.success} />
          ) : (
            <Circle size={26} color={colors.subText} />
          )}
        </TouchableOpacity>
      ) : null}
      <View style={styles.info}>
        <Text style={[styles.title, done && styles.titleDone]}>{assignment.title}</Text>
        <Text style={styles.meta}>{getCourseName(assignment.courseId)}</Text>
        <View style={styles.footer}>
          <Calendar size={14} color={colors.subText} />
          <Text style={styles.meta}> Hạn nộp: {formatDate(assignment.dueDate)}</Text>
          <Text style={[styles.status, {color: done ? colors.success : colors.warning}]}>
            {done ? 'Đã hoàn thành' : 'Chưa hoàn thành'}
          </Text>
        </View>
      </View>
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
  check: {marginRight: 10},
  info: {flex: 1},
  title: {fontSize: 15, fontWeight: '600', color: colors.text},
  titleDone: {textDecorationLine: 'line-through', color: colors.subText},
  meta: {fontSize: 13, color: colors.subText, marginTop: 2},
  footer: {flexDirection: 'row', alignItems: 'center', marginTop: 4},
  status: {fontSize: 12, fontWeight: '600', marginLeft: 'auto'},
});
