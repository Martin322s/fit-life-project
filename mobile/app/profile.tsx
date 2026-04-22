import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackHeader } from '@/src/components/BackHeader';
import { Card } from '@/src/components/Card';
import { C, R } from '@/src/theme';

const INITIAL = {
  name: 'Мартин Иванов',
  email: 'martin@example.com',
  age: '30',
  height: '180',
  weight: '77.3',
  goalWeight: '72',
  goal: 'lose' as 'lose' | 'maintain' | 'gain',
  activityLevel: 'moderate',
  plan: 'Pro',
};

const GOALS = [
  { value: 'lose', label: 'Отслабване' },
  { value: 'maintain', label: 'Поддържане' },
  { value: 'gain', label: 'Качване' },
] as const;

const ACTIVITY = [
  { value: 'sedentary', label: 'Заседнал' },
  { value: 'light', label: 'Лека активност' },
  { value: 'moderate', label: 'Умерена активност' },
  { value: 'active', label: 'Активен' },
  { value: 'very_active', label: 'Много активен' },
] as const;

export default function Profile() {
  const [form, setForm] = useState(INITIAL);
  const [saved, setSaved] = useState(false);

  const set = (key: keyof typeof INITIAL, value: string) => {
    setForm(p => ({ ...p, [key]: value }));
    setSaved(false);
  };

  const bmi = form.weight && form.height
    ? (parseFloat(form.weight) / ((parseFloat(form.height) / 100) ** 2)).toFixed(1)
    : '—';

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <BackHeader
        title="Профил"
        action={{ label: saved ? '✓ Запазен' : 'Запази', onPress: () => setSaved(true) }}
      />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Avatar Card */}
        <Card style={styles.avatarCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>МИ</Text>
          </View>
          <Text style={styles.avatarName}>{form.name}</Text>
          <Text style={styles.avatarEmail}>{form.email}</Text>
          <View style={styles.planBadge}>
            <Text style={styles.planBadgeText}>⚡ {form.plan} план</Text>
          </View>
          <View style={styles.quickStats}>
            <QStat label="ИТМ" value={bmi} />
            <View style={styles.qstatDiv} />
            <QStat label="Тегло" value={`${form.weight} кг`} />
            <View style={styles.qstatDiv} />
            <QStat label="Цел" value={`${form.goalWeight} кг`} />
          </View>
        </Card>

        {/* Personal Info */}
        <Card>
          <Text style={styles.cardTitle}>Лична информация</Text>
          <ProfileField label="Имена" value={form.name} onSet={v => set('name', v)} />
          <ProfileField label="Email" value={form.email} onSet={v => set('email', v)} keyboard="email-address" />
          <ProfileField label="Възраст" value={form.age} onSet={v => set('age', v)} keyboard="numeric" suffix="г." />
        </Card>

        {/* Body Stats */}
        <Card>
          <Text style={styles.cardTitle}>Физически данни</Text>
          <ProfileField label="Тегло" value={form.weight} onSet={v => set('weight', v)} keyboard="numeric" suffix="кг" />
          <ProfileField label="Целево тегло" value={form.goalWeight} onSet={v => set('goalWeight', v)} keyboard="numeric" suffix="кг" />
          <ProfileField label="Височина" value={form.height} onSet={v => set('height', v)} keyboard="numeric" suffix="см" />
        </Card>

        {/* Goal */}
        <Card>
          <Text style={styles.cardTitle}>Цел</Text>
          <View style={styles.optionRow}>
            {GOALS.map(g => (
              <Pressable
                key={g.value}
                style={[styles.optionBtn, form.goal === g.value && styles.optionActive]}
                onPress={() => { set('goal', g.value); }}
              >
                <Text style={[styles.optionText, form.goal === g.value && { color: C.primary }]}>
                  {g.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </Card>

        {/* Activity Level */}
        <Card>
          <Text style={styles.cardTitle}>Ниво на активност</Text>
          {ACTIVITY.map(a => (
            <Pressable
              key={a.value}
              style={[styles.activityRow, form.activityLevel === a.value && styles.activityRowActive]}
              onPress={() => set('activityLevel', a.value)}
            >
              <Text style={[styles.activityLabel, form.activityLevel === a.value && { color: C.primary }]}>
                {a.label}
              </Text>
              {form.activityLevel === a.value && <Text style={{ color: C.primary }}>✓</Text>}
            </Pressable>
          ))}
        </Card>

        <Pressable style={[styles.saveBtn, saved && styles.saveBtnDone]} onPress={() => setSaved(true)}>
          <Text style={styles.saveBtnText}>{saved ? '✓ Промените са запазени' : 'Запази промените'}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function ProfileField({
  label, value, onSet, keyboard, suffix,
}: {
  label: string; value: string; onSet: (v: string) => void; keyboard?: 'email-address' | 'numeric'; suffix?: string;
}) {
  return (
    <View style={pfStyles.field}>
      <Text style={pfStyles.label}>{label}</Text>
      <View style={pfStyles.inputRow}>
        <TextInput
          style={pfStyles.input}
          value={value}
          onChangeText={onSet}
          keyboardType={keyboard ?? 'default'}
          autoCapitalize={keyboard === 'email-address' ? 'none' : 'words'}
          autoCorrect={false}
        />
        {suffix && <Text style={pfStyles.suffix}>{suffix}</Text>}
      </View>
    </View>
  );
}

function QStat({ label, value }: { label: string; value: string }) {
  return (
    <View style={qsStyles.box}>
      <Text style={qsStyles.value}>{value}</Text>
      <Text style={qsStyles.label}>{label}</Text>
    </View>
  );
}

const pfStyles = StyleSheet.create({
  field: { marginBottom: 14 },
  label: { fontSize: 12, color: C.muted, marginBottom: 6, fontWeight: '600' },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.bg, borderWidth: 1, borderColor: C.border, borderRadius: R.md, paddingHorizontal: 12 },
  input: { flex: 1, paddingVertical: 12, fontSize: 15, color: C.text },
  suffix: { fontSize: 13, color: C.muted },
});

const qsStyles = StyleSheet.create({
  box: { flex: 1, alignItems: 'center' },
  value: { fontSize: 14, fontWeight: '700', color: C.text, marginBottom: 2 },
  label: { fontSize: 11, color: C.muted },
});

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { padding: 16, paddingBottom: 40 },
  avatarCard: { alignItems: 'center', marginBottom: 16 },
  avatarCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: C.primary + '33', borderWidth: 3, borderColor: C.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarText: { fontSize: 24, fontWeight: '800', color: C.primary },
  avatarName: { fontSize: 18, fontWeight: '700', color: C.text, marginBottom: 4 },
  avatarEmail: { fontSize: 13, color: C.muted, marginBottom: 10 },
  planBadge: { backgroundColor: C.amber + '22', borderRadius: R.full, paddingHorizontal: 14, paddingVertical: 5, borderWidth: 1, borderColor: C.amber + '55', marginBottom: 16 },
  planBadgeText: { fontSize: 13, color: C.amber, fontWeight: '700' },
  quickStats: { flexDirection: 'row', width: '100%', borderTopWidth: 1, borderTopColor: C.border, paddingTop: 14 },
  qstatDiv: { width: 1, backgroundColor: C.border },
  cardTitle: { fontSize: 15, fontWeight: '700', color: C.text, marginBottom: 14 },
  optionRow: { flexDirection: 'row', gap: 8 },
  optionBtn: { flex: 1, borderWidth: 1, borderColor: C.border, borderRadius: R.md, paddingVertical: 10, alignItems: 'center', backgroundColor: C.bg },
  optionActive: { borderColor: C.primary, backgroundColor: C.primary + '18' },
  optionText: { fontSize: 12, color: C.muted, fontWeight: '600', textAlign: 'center' },
  activityRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.border },
  activityRowActive: { },
  activityLabel: { fontSize: 14, color: C.text },
  saveBtn: { backgroundColor: C.primary, borderRadius: R.md, paddingVertical: 15, alignItems: 'center' },
  saveBtnDone: { backgroundColor: C.green },
  saveBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
