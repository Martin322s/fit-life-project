import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { BackHeader } from '@/src/components/BackHeader';
import { Card } from '@/src/components/Card';
import { storage, KEYS } from '@/src/services/storage';
import { C, R } from '@/src/theme';

export default function Settings() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [mealReminders, setMealReminders] = useState(true);
  const [weightReminders, setWeightReminders] = useState(false);
  const [waterReminders, setWaterReminders] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(true);
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
  const [calorieGoal, setCalorieGoal] = useState('2200');

  const handleDeleteData = () => {
    Alert.alert(
      'Изтриване на данни',
      'Сигурни ли сте? Това ще изтрие всички записи. Акаунтът ви ще бъде запазен.',
      [
        { text: 'Отказ', style: 'cancel' },
        {
          text: 'Изтрий',
          style: 'destructive',
          onPress: async () => {
            await storage.remove(KEYS.WEIGHT_LOG);
            await storage.remove(KEYS.FOOD_LOG);
            Alert.alert('Готово', 'Данните са изтрити.');
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert('Изход', 'Сигурни ли сте?', [
      { text: 'Отказ', style: 'cancel' },
      {
        text: 'Изход',
        style: 'destructive',
        onPress: async () => {
          await storage.remove(KEYS.AUTH);
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <BackHeader title="Настройки" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Notifications */}
        <Card>
          <Text style={styles.cardTitle}>Известия</Text>
          <ToggleRow label="Известия" desc="Активирай всички известия" value={notifications} onChange={setNotifications} />
          <ToggleRow label="Хранения" desc="Напомняния за ядене" value={mealReminders} onChange={setMealReminders} disabled={!notifications} />
          <ToggleRow label="Тегло" desc="Напомняне за записване" value={weightReminders} onChange={setWeightReminders} disabled={!notifications} />
          <ToggleRow label="Вода" desc="Напомняния за хидратация" value={waterReminders} onChange={setWaterReminders} disabled={!notifications} />
          <ToggleRow label="Седмичен отчет" desc="Резюме всяка неделя" value={weeklyReport} onChange={setWeeklyReport} disabled={!notifications} last />
        </Card>

        {/* Units */}
        <Card>
          <Text style={styles.cardTitle}>Мерни единици</Text>
          <View style={styles.unitsRow}>
            <Pressable
              style={[styles.unitBtn, units === 'metric' && styles.unitActive]}
              onPress={() => setUnits('metric')}
            >
              <Text style={[styles.unitText, units === 'metric' && { color: C.primary }]}>Метрична (кг, см)</Text>
            </Pressable>
            <Pressable
              style={[styles.unitBtn, units === 'imperial' && styles.unitActive]}
              onPress={() => setUnits('imperial')}
            >
              <Text style={[styles.unitText, units === 'imperial' && { color: C.primary }]}>Имперска (lb, ft)</Text>
            </Pressable>
          </View>
        </Card>

        {/* About */}
        <Card>
          <Text style={styles.cardTitle}>За приложението</Text>
          <InfoRow label="Версия" value="1.0.0" />
          <InfoRow label="База данни" value="Локална (офлайн)" />
          <InfoRow label="Поддръжка" value="support@fitlife.bg" last />
        </Card>

        {/* Danger Zone */}
        <Card style={styles.dangerCard}>
          <Text style={[styles.cardTitle, { color: C.red }]}>Опасна зона</Text>
          <Pressable style={styles.dangerBtn} onPress={handleDeleteData}>
            <Text style={styles.dangerBtnText}>🗑️ Изтрий всички данни</Text>
          </Pressable>
          <Pressable style={[styles.dangerBtn, styles.dangerBtnLogout]} onPress={handleLogout}>
            <Text style={[styles.dangerBtnText, { color: C.red }]}>🚪 Изход от профила</Text>
          </Pressable>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

function ToggleRow({
  label, desc, value, onChange, disabled, last,
}: {
  label: string; desc: string; value: boolean; onChange: (v: boolean) => void; disabled?: boolean; last?: boolean;
}) {
  return (
    <View style={[trStyles.row, !last && trStyles.rowBorder, disabled && trStyles.disabled]}>
      <View style={trStyles.info}>
        <Text style={trStyles.label}>{label}</Text>
        <Text style={trStyles.desc}>{desc}</Text>
      </View>
      <Switch
        value={value && !disabled}
        onValueChange={onChange}
        disabled={disabled}
        trackColor={{ false: C.border, true: C.primary + '88' }}
        thumbColor={value && !disabled ? C.primary : C.muted}
      />
    </View>
  );
}

function InfoRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[irStyles.row, !last && irStyles.rowBorder]}>
      <Text style={irStyles.label}>{label}</Text>
      <Text style={irStyles.value}>{value}</Text>
    </View>
  );
}

const trStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: 12 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: C.border },
  disabled: { opacity: 0.4 },
  info: { flex: 1 },
  label: { fontSize: 14, color: C.text, fontWeight: '500', marginBottom: 2 },
  desc: { fontSize: 12, color: C.muted },
});

const irStyles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: C.border },
  label: { fontSize: 14, color: C.text },
  value: { fontSize: 13, color: C.muted },
});

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { padding: 16, paddingBottom: 40 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: C.text, marginBottom: 14 },
  unitsRow: { gap: 8 },
  unitBtn: { borderWidth: 1, borderColor: C.border, borderRadius: R.md, paddingVertical: 12, paddingHorizontal: 14, backgroundColor: C.bg },
  unitActive: { borderColor: C.primary, backgroundColor: C.primary + '18' },
  unitText: { fontSize: 14, color: C.muted, fontWeight: '600' },
  dangerCard: { borderColor: C.red + '44' },
  dangerBtn: { borderWidth: 1, borderColor: C.border, borderRadius: R.md, paddingVertical: 14, alignItems: 'center', marginBottom: 10, backgroundColor: C.bg },
  dangerBtnLogout: { borderColor: C.red + '55', backgroundColor: C.red + '0a' },
  dangerBtnText: { fontSize: 14, fontWeight: '600', color: C.text },
});
