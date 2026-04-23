import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/src/components/Card';
import { ScreenHeader } from '@/src/components/ScreenHeader';
import { C, R } from '@/src/theme';
import { stats, recentEntries, chartData, measurements } from '@/src/data/weightData';

const BMI_ZONES = [
  { label: 'Поднормено', max: 18.5, color: C.cyan },
  { label: 'Нормално', max: 25, color: C.green },
  { label: 'Наднормено', max: 30, color: C.amber },
  { label: 'Затлъстяване', max: Infinity, color: C.red },
];

function getBmiZone(bmi: number) {
  return BMI_ZONES.find(z => bmi < z.max) ?? BMI_ZONES[BMI_ZONES.length - 1];
}

export default function Weight() {
  const [modalVisible, setModalVisible] = useState(false);
  const [weightInput, setWeightInput] = useState('');
  const [noteInput, setNoteInput] = useState('');
  const [logged, setLogged] = useState(false);

  const bmiZone = getBmiZone(stats.bmi);
  const progressPct = Math.min(
    100,
    Math.max(0, ((stats.start - stats.current) / (stats.start - stats.goal)) * 100)
  );

  const chartMin = Math.min(...chartData.map(d => d.value)) - 1;
  const chartMax = Math.max(...chartData.map(d => d.value)) + 1;
  const chartRange = chartMax - chartMin;

  const handleLog = () => {
    if (!weightInput) return;
    setLogged(true);
  };

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <ScreenHeader
          title="Тегло"
          subtitle="Проследяване"
          action={{ label: '⚖️ Запиши', onPress: () => { setLogged(false); setWeightInput(''); setNoteInput(''); setModalVisible(true); } }}
        />

        {/* Stat Cards */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsRow}>
          <WeightStat label="Текущо" value={`${stats.current} кг`} color={C.primary} />
          <WeightStat label="Изгубено" value={`-${stats.totalLost} кг`} color={C.green} />
          <WeightStat label="До целта" value={`${stats.remaining} кг`} color={C.amber} />
          <WeightStat label="ИТМ" value={`${stats.bmi}`} color={bmiZone.color} />
        </ScrollView>

        {/* Chart */}
        <Card>
          <Text style={styles.cardTitle}>График на теглото</Text>
          <View style={styles.chart}>
            {chartData.map((point, i) => {
              const h = ((point.value - chartMin) / chartRange) * 100;
              return (
                <View key={i} style={styles.chartCol}>
                  <View style={styles.chartBar}>
                    <View
                      style={[
                        styles.chartFill,
                        { height: `${h}%` as any, backgroundColor: i === chartData.length - 1 ? C.primary : C.primary + '55' },
                      ]}
                    />
                  </View>
                  <Text style={styles.chartLabel} numberOfLines={1}>{point.label}</Text>
                </View>
              );
            })}
          </View>
          <View style={styles.chartFooter}>
            <Text style={styles.chartFooterText}>Начало: {stats.start} кг</Text>
            <Text style={styles.chartFooterText}>Цел: {stats.goal} кг</Text>
          </View>
        </Card>

        {/* Progress to goal */}
        <Card>
          <Text style={styles.cardTitle}>Напредък към целта</Text>
          <View style={styles.progressHeader}>
            <Text style={styles.progressFrom}>{stats.start} кг</Text>
            <Text style={styles.progressPct}>{Math.round(progressPct)}%</Text>
            <Text style={styles.progressTo}>{stats.goal} кг</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progressPct}%` as any }]} />
          </View>
          <Text style={styles.progressSub}>
            Изгубени {stats.totalLost} кг от {stats.start - stats.goal} кг цел
          </Text>
        </Card>

        {/* BMI Card */}
        <Card>
          <Text style={styles.cardTitle}>Индекс на телесна маса</Text>
          <View style={styles.bmiRow}>
            <View style={[styles.bmiBadge, { backgroundColor: bmiZone.color + '22', borderColor: bmiZone.color }]}>
              <Text style={[styles.bmiValue, { color: bmiZone.color }]}>{stats.bmi}</Text>
              <Text style={[styles.bmiZone, { color: bmiZone.color }]}>{bmiZone.label}</Text>
            </View>
            <View style={styles.bmiZones}>
              {BMI_ZONES.map(z => (
                <View key={z.label} style={styles.bmiZoneRow}>
                  <View style={[styles.bmiZoneDot, { backgroundColor: z.color }]} />
                  <Text style={styles.bmiZoneLabel}>{z.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </Card>

        {/* Measurements */}
        <Card>
          <Text style={styles.cardTitle}>Измервания</Text>
          <View style={styles.measureGrid}>
            {measurements.map(m => (
              <View key={m.label} style={styles.measureCell}>
                <Text style={styles.measureValue}>{m.value}</Text>
                <Text style={styles.measureUnit}>{m.unit}</Text>
                <Text style={styles.measureLabel}>{m.label}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* History */}
        <Card>
          <Text style={styles.cardTitle}>История</Text>
          {recentEntries.map(entry => (
            <View key={entry.id} style={styles.historyRow}>
              <View>
                <Text style={styles.historyDate}>{entry.date}</Text>
              </View>
              <View style={styles.historyRight}>
                <Text style={styles.historyWeight}>{entry.weight} кг</Text>
                <Text style={[styles.historyChange, { color: entry.change <= 0 ? C.green : C.red }]}>
                  {entry.change <= 0 ? '' : '+'}{entry.change} кг
                </Text>
              </View>
            </View>
          ))}
        </Card>
      </ScrollView>

      {/* Log Weight Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <KeyboardAvoidingView
          style={styles.overlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalCard}>
            {logged ? (
              <View style={styles.successBox}>
                <Text style={styles.successEmoji}>✅</Text>
                <Text style={styles.successTitle}>Записано!</Text>
                <Text style={styles.successSub}>Теглото е добавено успешно.</Text>
                <Pressable style={styles.modalBtn} onPress={() => setModalVisible(false)}>
                  <Text style={styles.modalBtnText}>Затвори</Text>
                </Pressable>
              </View>
            ) : (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Запиши тегло</Text>
                  <Pressable onPress={() => setModalVisible(false)}>
                    <Text style={styles.modalClose}>✕</Text>
                  </Pressable>
                </View>
                <Text style={styles.prevWeight}>Предишно: {stats.current} кг</Text>

                <TextInput
                  style={styles.weightInput}
                  value={weightInput}
                  onChangeText={setWeightInput}
                  placeholder="0.0"
                  placeholderTextColor={C.muted}
                  keyboardType="numeric"
                />
                <Text style={styles.weightUnit}>кг</Text>

                <View style={styles.modalField}>
                  <Text style={styles.modalLabel}>Бележка (по желание)</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={noteInput}
                    onChangeText={setNoteInput}
                    placeholder="Напр. след тренировка"
                    placeholderTextColor={C.muted}
                  />
                </View>

                <Pressable
                  style={[styles.modalBtn, !weightInput && styles.modalBtnDisabled]}
                  onPress={handleLog}
                  disabled={!weightInput}
                >
                  <Text style={styles.modalBtnText}>Запиши</Text>
                </Pressable>
              </>
            )}
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
  card: {
    backgroundColor: C.card,
    borderRadius: R.lg,
    padding: 14,
    marginRight: 10,
    minWidth: 110,
    borderTopWidth: 3,
    borderWidth: 1,
    borderColor: C.border,
  },
  label: { fontSize: 11, color: C.muted, marginBottom: 4 },
  value: { fontSize: 16, fontWeight: '700' },
});

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { padding: 16, paddingBottom: 32 },
  statsRow: { marginBottom: 16 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: C.text, marginBottom: 14 },
  chart: {
    flexDirection: 'row',
    height: 120,
    alignItems: 'flex-end',
    gap: 4,
    marginBottom: 10,
  },
  chartCol: { flex: 1, alignItems: 'center', gap: 4 },
  chartBar: { flex: 1, width: '80%', justifyContent: 'flex-end' },
  chartFill: { borderTopLeftRadius: 4, borderTopRightRadius: 4 },
  chartLabel: { fontSize: 9, color: C.muted, textAlign: 'center' },
  chartFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  chartFooterText: { fontSize: 11, color: C.muted },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  progressFrom: { fontSize: 12, color: C.muted },
  progressPct: { fontSize: 14, fontWeight: '700', color: C.green },
  progressTo: { fontSize: 12, color: C.muted },
  progressTrack: { height: 10, backgroundColor: C.border, borderRadius: R.full, overflow: 'hidden', marginBottom: 8 },
  progressFill: { height: '100%', backgroundColor: C.green, borderRadius: R.full },
  progressSub: { fontSize: 12, color: C.muted },
  bmiRow: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  bmiBadge: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bmiValue: { fontSize: 22, fontWeight: '800' },
  bmiZone: { fontSize: 10, fontWeight: '600', textAlign: 'center' },
  bmiZones: { flex: 1, gap: 6 },
  bmiZoneRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  bmiZoneDot: { width: 8, height: 8, borderRadius: 4 },
  bmiZoneLabel: { fontSize: 12, color: C.muted },
  measureGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  measureCell: {
    width: '45%',
    backgroundColor: C.bg,
    borderRadius: R.md,
    padding: 12,
    alignItems: 'center',
  },
  measureValue: { fontSize: 22, fontWeight: '700', color: C.text },
  measureUnit: { fontSize: 12, color: C.muted },
  measureLabel: { fontSize: 12, color: C.muted, marginTop: 2 },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  historyDate: { fontSize: 13, color: C.muted },
  historyRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  historyWeight: { fontSize: 15, fontWeight: '700', color: C.text },
  historyChange: { fontSize: 12, fontWeight: '600' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalCard: {
    backgroundColor: C.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: C.text },
  modalClose: { fontSize: 18, color: C.muted },
  prevWeight: { fontSize: 13, color: C.muted, marginBottom: 16 },
  weightInput: {
    fontSize: 52,
    fontWeight: '800',
    color: C.text,
    textAlign: 'center',
    borderBottomWidth: 2,
    borderBottomColor: C.primary,
    paddingBottom: 8,
    marginBottom: 4,
  },
  weightUnit: { fontSize: 16, color: C.muted, textAlign: 'center', marginBottom: 20 },
  modalField: { marginBottom: 16 },
  modalLabel: { fontSize: 13, color: C.muted, marginBottom: 6, fontWeight: '600' },
  modalInput: {
    backgroundColor: C.bg,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: R.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: C.text,
  },
  modalBtn: {
    backgroundColor: C.primary,
    borderRadius: R.md,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 4,
  },
  modalBtnDisabled: { opacity: 0.5 },
  modalBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  successBox: { alignItems: 'center', padding: 20 },
  successEmoji: { fontSize: 48, marginBottom: 12 },
  successTitle: { fontSize: 20, fontWeight: '700', color: C.text, marginBottom: 8 },
  successSub: { fontSize: 14, color: C.muted, marginBottom: 24 },
});
