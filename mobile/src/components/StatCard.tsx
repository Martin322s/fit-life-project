import { View, Text, StyleSheet } from 'react-native';
import { C, R } from '@/src/theme';

type Props = {
  label: string;
  value: string;
  sub?: string;
  accent?: string;
  accentColor?: string;
};

export function StatCard({ label, value, sub, accent, accentColor = C.primary }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      {sub && <Text style={styles.sub}>{sub}</Text>}
      {accent && (
        <View style={[styles.badge, { backgroundColor: accentColor + '22' }]}>
          <Text style={[styles.badgeText, { color: accentColor }]}>{accent}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: C.card,
    borderRadius: R.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: C.border,
    minWidth: 130,
  },
  label: {
    fontSize: 12,
    color: C.muted,
    marginBottom: 4,
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
    color: C.text,
  },
  sub: {
    fontSize: 11,
    color: C.muted,
    marginTop: 2,
  },
  badge: {
    alignSelf: 'flex-start',
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: R.full,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
