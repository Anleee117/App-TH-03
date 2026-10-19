import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {colors} from '../theme';

export default function SectionTitle({title}: {title: string}) {
  return <Text style={styles.title}>{title}</Text>;
}

const styles = StyleSheet.create({
  title: {fontSize: 17, fontWeight: '700', color: colors.text, marginTop: 16, marginBottom: 8},
});
