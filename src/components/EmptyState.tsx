import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Inbox} from 'lucide-react-native';
import {colors} from '../theme';

export default function EmptyState({message}: {message: string}) {
  return (
    <View style={styles.container}>
      <Inbox size={48} color={colors.subText} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {alignItems: 'center', justifyContent: 'center', padding: 32},
  text: {marginTop: 8, fontSize: 15, color: colors.subText, textAlign: 'center'},
});
