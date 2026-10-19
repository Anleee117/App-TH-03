import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {BookOpen, ChevronRight} from 'lucide-react-native';
import {Course} from '../data/types';
import {colors} from '../theme';

type Props = {
  course: Course;
  onPress: () => void;
};

export default function CourseItem({course, onPress}: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.iconBox}>
        <BookOpen size={22} color={colors.primary} />
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{course.name}</Text>
        <Text style={styles.meta}>
          {course.code} - {course.credits} tín chỉ
        </Text>
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
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#E8EFFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  info: {flex: 1},
  name: {fontSize: 15, fontWeight: '600', color: colors.text},
  meta: {fontSize: 13, color: colors.subText, marginTop: 2},
});
