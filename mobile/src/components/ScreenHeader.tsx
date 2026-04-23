import { View, Text, StyleSheet, Pressable } from 'react-native';
import { C } from '@/src/theme';

type Props = {
  title: string;
  subtitle?: string;
  action?: { label: string; onPress: () => void };
};

export function ScreenHeader({ title, subtitle, action }: Props) {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {action && (
        <Pressable style={styles.btn} onPress={action.onPress}>
          <Text style={styles.btnText}>{action.label}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: C.text,
  },
  subtitle: {
    fontSize: 13,
    color: C.muted,
    marginTop: 2,
  },
  btn: {
    backgroundColor: C.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  btnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
});
