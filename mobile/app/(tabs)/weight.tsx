import React, { useCallback, useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Pressable, Modal,
  TextInput, KeyboardAvoidingView, Platform, ActivityIndicator,
  RefreshControl, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/src/components/Card';
import { ScreenHeader } from '@/src/components/ScreenHeader';
import { C, R } from '@/src/theme';
import { useAuth } from '@/src/context/AuthContext';
import { progressApi, type ApiProgressEntry } from '@/src/services/progressApi';
import { profileApi, type ApiProfile } from '@/src/services/profileApi';

const BMI_ZONES = [
  { label: 'Поднормено', max: 18.5, color: C.cyan },
  { label: 'Нормално',   max: 25,   color: C.green },
  { label: 'Наднормено', max: 30,   color: C.amber },
  { label: 'Затлъстяване', max: Infinity, color: C.red },
];

function getBmiZone(bmi: number) {
  return BMI_ZONES.find(z => bmi < z.max) ?? BMI_ZONES[BMI_ZONES.length - 1];
}

function calcBmi(weightKg: number, heightCm: number) {
  return +(weightKg / ((heightCm / 100) ** 2)).toFixed(1);
}

const MONTHS_BG = ['Яну','Фев','Мар','Апр','Май','Юни','Юли','Авг','Сеп','Окт','Ное','Дек'];

export default function Weight() {
  const { user } = useAuth();

  const [progress, setProgress] = useState<ApiProgressEntry[]>([]);
  const [profile, setProfile]   = useState<ApiProfile | null>(null);
  const [loading, setLoading]   = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving]     = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [weightInput, setWeightInput]   = useState('');
  const [noteInput, setNoteInput]       = useState('');
  const [modalError, setModalError]     = useState('');

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [p, prof] = await Promise.all([
        progressApi.list(),
        profileApi.get().catch(() => null as { profile: ApiProfile } | null),
      ]);
      const uid = user?.id;
      setProgress(uid ? p.items.filter(x => x.userId === uid) : p.items);
      setProfile(prof?.profile ?? null);
    } catch {}
    finally { setLoading(false); setRefreshing(false); }
  }, [user?.id]);

  useEffect(() => { load(); }, [load]);

  const onRefresh = () => { setRefreshing(true); load(true); };

  // Sort newest first
  const sorted = [...progress]
    .filter(p => p.weightKg != null)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const current = sorted[0]?.weightKg ?? null;
  const previous = sorted[1]?.weightKg ?? null;
  const change = current != null && previous != null ? +(current - previous).toFixed(1) : null;
  const goalWeight = profile?.goalWeight ?? null;
  const heightCm   = profile?.heightCm ?? null;

  const bmi = current && heightCm ? calcBmi(current, heightCm) : null;
  const bmiZone = bmi ? getBmiZone(bmi) : null;

  const totalLost = sorted.length > 1 ? +(sorted[sorted.length - 1].weightKg! - current!).toFixed(1) : null;
  const progressPct = current && goalWeight && sorted.length > 0
    ? Math.min(100, Math.max(0,
        ((sorted[sorted.length - 1].weightKg! - current) / (sorted[sorted.length - 1].weightKg! - goalWeight)) * 100
      ))
    : 0;

  // Chart data — up to last 7 entries, oldest → newest
  const chartEntries = sorted.slice(0, 7).reverse();
  const chartMin = chartEntries.length > 0 ? Math.min(...chartEntries.map(d => d.weightKg!)) - 0.5 : 0;
  const chartMax = chartEntries.length > 0 ? Math.max(...chartEntries.map(d => d.weightKg!)) + 0.5 : 1;
  const chartRange = chartMax - chartMin || 1;

  const openLog = () => {
    setWeightInput('');
    setNoteInput('');
    setModalError('');
    setModalVisible(true);
  };

  const handleLog = async () => {
    const val = parseFloat(weightInput);
    if (isNaN(val) || val <= 0) {
      setModalError('Въведете валидно тегло.');
      return;
    }
    setModalError('');
    setSaving(true);
    try {
      await progressApi.create({ weightKg: val, notes: noteInput.trim() || undefined });
      setModalVisible(false);
      load(true);
    } catch (err) {
      setModalError(err instanceof Error ? err.message : 'Грешка. Опитайте отново.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (entry: ApiProgressEntry) => {
    Alert.alert('Изтрий запис', 'Изтриване на това измерване?', [
      { text: 'Отказ', style: 'cancel' },
      {
        text: 'Изтрий',
        style: 'destructive',
        onPress: async () => {
          try { await progressApi.remove(entry.id); load(true); } catch {}
        },
      },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.center}><ActivityIndicator color={C.primary} size="large" /></View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.primary} />}
      >
        <ScreenHeader
          title="Тегло"
          subtitle="Проследяване"
          action={{ label: '⚖️ Запиши', onPress: openLog }}
        />

        {/* Stat pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsRow}>
          <WeightStat label="Текущо" value={current != null ? `${current} кг` : '—'} color={C.primary} />
          {totalLost != null && <WeightStat label="Изгубено" value={`${totalLost > 0 ? '-' : '+'}${Math.abs(totalLost)} кг`} color={C.green} />}
          {change != null && <WeightStat label="Промяна" value={`${change > 0 ? '+' : ''}${change} кг`} color={change <= 0 ? C.green : C.red} />}
          {goalWeight && <WeightStat label="Цел" value={`${goalWeight} кг`} color={C.amber} />}
          {bmi && <WeightStat label="ИТМ" value={`${bmi}`} color={bmiZone?.color ?? C.muted} />}
        </ScrollView>

        {/* Chart */}
        {chartEntries.length >= 2 ? (
          <Card>
            <Text style={styles.cardTitle}>График (последните {chartEntries.length} записа)</Text>
            <View style={styles.chart}>
              {chartEntries.map((point, i) => {
                const h = Math.max(4, ((point.weightKg! - chartMin) / chartRange) * 100);
                const isLast = i === chartEntries.length - 1;
                return (
                  <View key={point.id} style={styles.chartCol}>
                    <View style={styles.chartBar}>
                      <View style={[styles.chartFill, { height: `${h}%` as any, backgroundColor: isLast ? C.primary : C.primary + '55' }]} />
                    </View>
                    <Text style={styles.chartLabel}>
                      {(() => { const d = new Date(point.createdAt); return `${d.getDate()} ${MONTHS_BG[d.getMonth()]}`; })()}
                    </Text>
                  </View>
                );
              })}
            </View>
          </Card>
        ) : sorted.length === 0 ? (
          <Card>
            <View style={styles.emptyBox}>
              <Text style={styles.emptyEmoji}>⚖️</Text>
              <Text style={styles.emptyText}>Запишете първото си тегло, за да видите графика</Text>
              <Pressable style={styles.emptyBtn} onPress={openLog}>
                <Text style={styles.emptyBtnText}>Запиши тегло</Text>
              </Pressable>
            </View>
          </Card>
        ) : null}

        {/* Goal progress */}
        {current != null && goalWeight != null && sorted.length > 0 && (
          <Card>
            <Text style={styles.cardTitle}>Прогрес към целта</Text>
            <View style={styles.goalRow}>
              <View style={styles.goalStat}>
                <Text style={styles.goalVal}>{sorted[sorted.length - 1].weightKg} кг</Text>
                <Text style={styles.goalLbl}>Начало</Text>
              </View>
              <View style={[styles.goalStat, { alignItems: 'center' }]}>
                <Text style={[styles.goalVal, { color: C.primary }]}>{current} кг</Text>
                <Text style={styles.goalLbl}>Сега</Text>
              </View>
              <View style={[styles.goalStat, { alignItems: 'flex-end' }]}>
                <Text style={[styles.goalVal, { color: C.green }]}>{goalWeight} кг</Text>
                <Text style={styles.goalLbl}>Цел</Text>
              </View>
            </View>
            <View style={styles.goalTrack}>
              <View style={[styles.goalFill, { width: `${progressPct}%` as any }]} />
            </View>
            <Text style={styles.goalSub}>{Math.round(progressPct)}% от целта</Text>
          </Card>
        )}

        {/* BMI Card */}
        {bmi != null && bmiZone != null && (
          <Card>
            <Text style={styles.cardTitle}>Индекс на телесна маса (ИТМ)</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <Text style={{ fontFamily: undefined, fontSize: 36, fontWeight: '800', color: bmiZone.color }}>{bmi}</Text>
              <View style={{ backgroundColor: bmiZone.color + '22', borderRadius: R.full, paddingHorizontal: 12, paddingVertical: 4 }}>
                <Text style={{ color: bmiZone.color, fontWeight: '700', fontSize: 13 }}>{bmiZone.label}</Text>
              </View>
            </View>
            <Text style={styles.bmiSub}>Нормален ИТМ: 18.5 – 24.9</Text>
          </Card>
        )}

        {/* History */}
        {sorted.length > 0 && (
          <Card>
            <Text style={styles.cardTitle}>История ({sorted.length} записа)</Text>
            {sorted.slice(0, 10).map(entry => (
              <View key={entry.id} style={styles.histRow}>
                <View style={styles.histInfo}>
                  <Text style={styles.histWeight}>{entry.weightKg} кг</Text>
                  <Text style={styles.histDate}>
                    {new Date(entry.createdAt).toLocaleDateString('bg-BG', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </Text>
                  {entry.notes ? <Text style={styles.histNote}>{entry.notes}</Text> : null}
                </View>
                <Pressable onPress={() => handleDelete(entry)} style={styles.deleteBtn}>
                  <Text style={styles.deleteBtnText}>🗑</Text>
                </Pressable>
              </View>
            ))}
          </Card>
        )}
      </ScrollView>

      {/* Log Weight Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <KeyboardAvoidingView
          style={styles.overlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Запиши тегло</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </Pressable>
            </View>

            {current != null && (
              <Text style={styles.lastWeight}>Последно записано: {current} кг</Text>
            )}

            <View style={styles.modalField}>
              <Text style={styles.modalLabel}>Тегло (кг)</Text>
              <TextInput
                style={[styles.modalInput, styles.weightBig]}
                value={weightInput}
                onChangeText={setWeightInput}
                placeholder={current ? String(current) : '75.0'}
                placeholderTextColor={C.muted}
                keyboardType="decimal-pad"
                autoFocus
              />
            </View>

            <View style={styles.modalField}>
              <Text style={styles.modalLabel}>Бележка (по желание)</Text>
              <TextInput
                style={styles.modalInput}
                value={noteInput}
                onChangeText={setNoteInput}
                placeholder="напр. след тренировка…"
                placeholderTextColor={C.muted}
              />
            </View>

            {modalError ? <Text style={styles.modalError}>{modalError}</Text> : null}

            <Pressable
              style={[styles.modalBtn, (saving || !weightInput) && styles.modalBtnDisabled]}
              onPress={handleLog}
              disabled={saving || !weightInput}
            >
              {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.modalBtnText}>Запиши</Text>}
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

function WeightStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={[wsStyles.card, { borderTopColor: color }]}>
      <Text style={wsStyles.label}>{label}</Text>
      <Text style={[wsStyles.value, { color }]}>{value}</Text>
    </View>
  );
}

const wsStyles = StyleSheet.create({
  card: { backgroundColor: C.card, borderRadius: R.lg, padding: 12, marginRight: 10, minWidth: 100, borderTopWidth: 3, borderWidth: 1, borderColor: C.border },
  label: { fontSize: 11, color: C.muted, marginBottom: 4 },
  value: { fontSize: 16, fontWeight: '700', color: C.text },
});

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { padding: 16, paddingBottom: 32 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  statsRow: { marginBottom: 16 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: C.text, marginBottom: 14 },
  chart: { flexDirection: 'row', alignItems: 'flex-end', gap: 6, height: 120, marginBottom: 8 },
  chartCol: { flex: 1, alignItems: 'center', gap: 4 },
  chartBar: { flex: 1, width: '100%', backgroundColor: C.border, borderRadius: 4, overflow: 'hidden', justifyContent: 'flex-end' },
  chartFill: { width: '100%', borderRadius: 4 },
  chartLabel: { fontSize: 10, color: C.muted, textAlign: 'center' },
  emptyBox: { alignItems: 'center', paddingVertical: 20 },
  emptyEmoji: { fontSize: 32, marginBottom: 8 },
  emptyText: { fontSize: 13, color: C.muted, marginBottom: 12, textAlign: 'center' },
  emptyBtn: { borderWidth: 1, borderColor: C.primary, borderRadius: R.md, paddingHorizontal: 16, paddingVertical: 8 },
  emptyBtnText: { color: C.primary, fontWeight: '600', fontSize: 13 },
  goalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  goalStat: {},
  goalVal: { fontSize: 17, fontWeight: '700', color: C.text },
  goalLbl: { fontSize: 11, color: C.muted },
  goalTrack: { height: 8, backgroundColor: C.border, borderRadius: R.full, overflow: 'hidden', marginBottom: 6 },
  goalFill: { height: '100%', backgroundColor: C.primary, borderRadius: R.full },
  goalSub: { fontSize: 12, color: C.muted },
  bmiSub: { fontSize: 13, color: C.muted },
  histRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 10 },
  histInfo: { flex: 1 },
  histWeight: { fontSize: 16, fontWeight: '700', color: C.text },
  histDate: { fontSize: 12, color: C.muted },
  histNote: { fontSize: 12, color: C.muted, fontStyle: 'italic' },
  deleteBtn: { padding: 6 },
  deleteBtnText: { fontSize: 16 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: C.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 36 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 16, fontWeight: '700', color: C.text },
  modalClose: { fontSize: 18, color: C.muted, paddingLeft: 12 },
  lastWeight: { fontSize: 13, color: C.muted, marginBottom: 12 },
  modalField: { marginBottom: 14 },
  modalLabel: { fontSize: 13, color: C.muted, marginBottom: 6, fontWeight: '600' },
  modalInput: { backgroundColor: C.bg, borderWidth: 1, borderColor: C.border, borderRadius: R.md, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: C.text },
  weightBig: { fontSize: 24, fontWeight: '700', textAlign: 'center' },
  modalError: { color: C.red, fontSize: 13, marginBottom: 10 },
  modalBtn: { backgroundColor: C.primary, borderRadius: R.md, paddingVertical: 14, alignItems: 'center', marginTop: 4 },
  modalBtnDisabled: { opacity: 0.5 },
  modalBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
