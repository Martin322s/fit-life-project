import { View, Text, StyleSheet } from 'react-native';
import { C, R } from '@/src/theme';

type Props = {
  label: string;
  consumed: number;
  target: number;
  color: string;
  unit: string;
};

export function ProgressBar({ label, consumed, target, color, unit }: Props) {
  const pct = Math.min(100, Math.round((consumed / target) * 100));

  return (
    <View style={styles.row}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.values}>
          <Text style={{ color }}>{consumed}</Text>
          <Text style={styles.muted}>/{target}{unit}</Text>
        </Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%` as any, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    fontSize: 13,
    color: C.text,
  },
  values: {
    fontSize: 13,
    fontWeight: '600',
  },
  muted: {
    color: C.muted,
    fontWeight: '400',
  },
  track: {
    height: 6,
    backgroundColor: C.border,
    borderRadius: R.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: R.full,
  },
});
