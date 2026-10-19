import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors} from '../theme';

type Props = {
  label: string;
  value: string;
};

export default function InfoRow({label, value}: Props) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  label: {width: 120, fontSize: 14, color: colors.subText},
  value: {flex: 1, fontSize: 14, color: colors.text, fontWeight: '500'},
});
