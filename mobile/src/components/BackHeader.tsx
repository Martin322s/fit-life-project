import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { C } from '@/src/theme';

type Props = {
  title: string;
  action?: { label: string; onPress: () => void };
};

export function BackHeader({ title, action }: Props) {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <Pressable style={styles.back} onPress={() => router.back()}>
        <Text style={styles.backArrow}>‹</Text>
        <Text style={styles.backText}>Назад</Text>
      </Pressable>
      <Text style={styles.title}>{title}</Text>
      {action ? (
        <Pressable style={styles.action} onPress={action.onPress}>
          <Text style={styles.actionText}>{action.label}</Text>
        </Pressable>
      ) : (
        <View style={styles.spacer} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    minWidth: 70,
  },
  backArrow: { fontSize: 24, color: C.primary, lineHeight: 26 },
  backText: { fontSize: 15, color: C.primary, fontWeight: '600' },
  title: { fontSize: 16, fontWeight: '700', color: C.text },
  action: { minWidth: 70, alignItems: 'flex-end' },
  actionText: { fontSize: 14, color: C.primary, fontWeight: '600' },
  spacer: { minWidth: 70 },
});
