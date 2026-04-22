import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackHeader } from '@/src/components/BackHeader';
import { Card } from '@/src/components/Card';
import { C, R } from '@/src/theme';

type Tab = 'bmi' | 'tdee' | 'macros';

const ACTIVITY_LEVELS = [
  { label: 'Заседнал', multiplier: 1.2, desc: 'Никаква/малко активност' },
  { label: 'Лека', multiplier: 1.375, desc: '1-3 пъти/седмица' },
  { label: 'Умерена', multiplier: 1.55, desc: '3-5 пъти/седмица' },
  { label: 'Активен', multiplier: 1.725, desc: '6-7 пъти/седмица' },
  { label: 'Много активен', multiplier: 1.9, desc: 'Физически труд + спорт' },
];

const GOALS = [
  { label: 'Отслабване', adj: -500, color: C.red },
  { label: 'Поддържане', adj: 0, color: C.green },
  { label: 'Качване', adj: +300, color: C.primary },
];

export default function Calculators() {
  const [tab, setTab] = useState<Tab>('bmi');

  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmiResult, setBmiResult] = useState<number | null>(null);

  const [tdeeWeight, setTdeeWeight] = useState('');
  const [tdeeHeight, setTdeeHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [activityIdx, setActivityIdx] = useState(2);
  const [tdeeResult, setTdeeResult] = useState<number | null>(null);

  const [macroGoal, setMacroGoal] = useState(0);
  const [macroCalories, setMacroCalories] = useState('');
  const [macroResult, setMacroResult] = useState<{ protein: number; carbs: number; fat: number } | null>(null);

  const calcBMI = () => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (!h || !w) return;
    setBmiResult(+(w / ((h / 100) ** 2)).toFixed(1));
  };

  const calcTDEE = () => {
    const w = parseFloat(tdeeWeight);
    const h = parseFloat(tdeeHeight);
    const a = parseFloat(age);
    if (!w || !h || !a) return;
    const bmr = gender === 'male'
      ? 88.36 + 13.4 * w + 4.8 * h - 5.7 * a
      : 447.6 + 9.25 * w + 3.1 * h - 4.33 * a;
    setTdeeResult(Math.round(bmr * ACTIVITY_LEVELS[activityIdx].multiplier));
  };

  const calcMacros = () => {
    const kcal = parseFloat(macroCalories);
    if (!kcal) return;
    const adj = GOALS[macroGoal].adj;
    const target = kcal + adj;
    const protein = Math.round((target * 0.30) / 4);
    const fat = Math.round((target * 0.30) / 9);
    const carbs = Math.round((target * 0.40) / 4);
    setMacroResult({ protein, carbs, fat });
  };

  function getBmiLabel(bmi: number) {
    if (bmi < 18.5) return { label: 'Поднормено тегло', color: C.cyan };
    if (bmi < 25) return { label: 'Нормално тегло', color: C.green };
    if (bmi < 30) return { label: 'Наднормено тегло', color: C.amber };
    return { label: 'Затлъстяване', color: C.red };
  }

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <BackHeader title="Калкулатори" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Tab Bar */}
        <View style={styles.tabs}>
          {(['bmi', 'tdee', 'macros'] as Tab[]).map(t => (
            <Pressable
              key={t}
              style={[styles.tab, tab === t && styles.tabActive]}
              onPress={() => setTab(t)}
            >
              <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
                {t === 'bmi' ? 'ИТМ' : t === 'tdee' ? 'TDEE' : 'Макроси'}
              </Text>
            </Pressable>
          ))}
        </View>

        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

          {tab === 'bmi' && (
            <Card>
              <Text style={styles.cardTitle}>🧮 Изчислете ИТМ</Text>
              <Field label="Тегло (кг)" value={weight} onChange={setWeight} />
              <Field label="Височина (см)" value={height} onChange={setHeight} />
              <Pressable style={styles.calcBtn} onPress={calcBMI}>
                <Text style={styles.calcBtnText}>Изчисли</Text>
              </Pressable>
              {bmiResult !== null && (() => {
                const { label, color } = getBmiLabel(bmiResult);
                return (
                  <View style={[styles.result, { borderColor: color }]}>
                    <Text style={[styles.resultValue, { color }]}>{bmiResult}</Text>
                    <Text style={[styles.resultLabel, { color }]}>{label}</Text>
                    <Text style={styles.resultNote}>
                      Нормален ИТМ: 18.5 – 24.9
                    </Text>
                  </View>
                );
              })()}
              <View style={styles.bmiZones}>
                {[
                  { label: 'Поднормено', range: '< 18.5', color: C.cyan },
                  { label: 'Нормално', range: '18.5 – 24.9', color: C.green },
                  { label: 'Наднормено', range: '25 – 29.9', color: C.amber },
                  { label: 'Затлъстяване', range: '≥ 30', color: C.red },
                ].map(z => (
                  <View key={z.label} style={styles.bmiZoneRow}>
                    <View style={[styles.bmiZoneDot, { backgroundColor: z.color }]} />
                    <Text style={styles.bmiZoneLabel}>{z.label}</Text>
                    <Text style={styles.bmiZoneRange}>{z.range}</Text>
                  </View>
                ))}
              </View>
            </Card>
          )}

          {tab === 'tdee' && (
            <Card>
              <Text style={styles.cardTitle}>🔥 Изчислете TDEE</Text>
              <View style={styles.genderRow}>
                <Pressable
                  style={[styles.genderBtn, gender === 'male' && styles.genderActive]}
                  onPress={() => setGender('male')}
                >
                  <Text style={[styles.genderText, gender === 'male' && { color: C.primary }]}>♂ Мъж</Text>
                </Pressable>
                <Pressable
                  style={[styles.genderBtn, gender === 'female' && styles.genderActive]}
                  onPress={() => setGender('female')}
                >
                  <Text style={[styles.genderText, gender === 'female' && { color: C.primary }]}>♀ Жена</Text>
                </Pressable>
              </View>
              <Field label="Тегло (кг)" value={tdeeWeight} onChange={setTdeeWeight} />
              <Field label="Височина (см)" value={tdeeHeight} onChange={setTdeeHeight} />
              <Field label="Възраст (години)" value={age} onChange={setAge} />
              <Text style={styles.fieldLabel}>Ниво на активност</Text>
              {ACTIVITY_LEVELS.map((al, i) => (
                <Pressable
                  key={al.label}
                  style={[styles.activityBtn, activityIdx === i && styles.activityActive]}
                  onPress={() => setActivityIdx(i)}
                >
                  <Text style={[styles.activityLabel, activityIdx === i && { color: C.primary }]}>{al.label}</Text>
                  <Text style={styles.activityDesc}>{al.desc}</Text>
                </Pressable>
              ))}
              <Pressable style={styles.calcBtn} onPress={calcTDEE}>
                <Text style={styles.calcBtnText}>Изчисли</Text>
              </Pressable>
              {tdeeResult !== null && (
                <View style={[styles.result, { borderColor: C.amber }]}>
                  <Text style={[styles.resultValue, { color: C.amber }]}>{tdeeResult}</Text>
                  <Text style={[styles.resultLabel, { color: C.amber }]}>ккал/ден</Text>
                  <Text style={styles.resultNote}>
                    Отслабване: ~{tdeeResult - 500} ккал{'\n'}
                    Качване: ~{tdeeResult + 300} ккал
                  </Text>
                </View>
              )}
            </Card>
          )}

          {tab === 'macros' && (
            <Card>
              <Text style={styles.cardTitle}>📊 Изчислете макроси</Text>
              <Field label="Дневни калории" value={macroCalories} onChange={setMacroCalories} placeholder="напр. 2200" />
              <Text style={styles.fieldLabel}>Цел</Text>
              <View style={styles.goalRow}>
                {GOALS.map((g, i) => (
                  <Pressable
                    key={g.label}
                    style={[styles.goalBtn, macroGoal === i && styles.goalActive]}
                    onPress={() => setMacroGoal(i)}
                  >
                    <Text style={[styles.goalText, macroGoal === i && { color: GOALS[i].color }]}>{g.label}</Text>
                  </Pressable>
                ))}
              </View>
              <Text style={styles.macroNote}>Разпределение: 30% протеин · 40% въглехидрати · 30% мазнини</Text>
              <Pressable style={styles.calcBtn} onPress={calcMacros}>
                <Text style={styles.calcBtnText}>Изчисли</Text>
              </Pressable>
              {macroResult && (
                <View style={styles.macroResult}>
                  <MacroResultBox label="Протеин" value={macroResult.protein} unit="г" color={C.primary} />
                  <MacroResultBox label="Въглехидрати" value={macroResult.carbs} unit="г" color={C.green} />
                  <MacroResultBox label="Мазнини" value={macroResult.fat} unit="г" color={C.amber} />
                </View>
              )}
            </Card>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <View style={fStyles.field}>
      <Text style={fStyles.label}>{label}</Text>
      <TextInput
        style={fStyles.input}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder ?? '0'}
        placeholderTextColor={C.muted}
        keyboardType="numeric"
      />
    </View>
  );
}

function MacroResultBox({ label, value, unit, color }: { label: string; value: number; unit: string; color: string }) {
  return (
    <View style={mrStyles.box}>
      <Text style={[mrStyles.value, { color }]}>{value}</Text>
      <Text style={mrStyles.unit}>{unit}</Text>
      <Text style={mrStyles.label}>{label}</Text>
    </View>
  );
}

const fStyles = StyleSheet.create({
  field: { marginBottom: 14 },
  label: { fontSize: 13, color: C.muted, marginBottom: 6, fontWeight: '600' },
  input: { backgroundColor: C.bg, borderWidth: 1, borderColor: C.border, borderRadius: R.md, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: C.text },
});

const mrStyles = StyleSheet.create({
  box: { flex: 1, alignItems: 'center', backgroundColor: C.bg, borderRadius: R.md, padding: 14 },
  value: { fontSize: 24, fontWeight: '800' },
  unit: { fontSize: 12, color: C.muted },
  label: { fontSize: 11, color: C.muted, marginTop: 2 },
});

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { padding: 16, paddingBottom: 32 },
  tabs: { flexDirection: 'row', backgroundColor: C.card, borderBottomWidth: 1, borderBottomColor: C.border },
  tab: { flex: 1, paddingVertical: 14, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: C.primary },
  tabText: { fontSize: 14, color: C.muted, fontWeight: '600' },
  tabTextActive: { color: C.primary },
  cardTitle: { fontSize: 15, fontWeight: '700', color: C.text, marginBottom: 16 },
  fieldLabel: { fontSize: 13, color: C.muted, marginBottom: 8, fontWeight: '600' },
  genderRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  genderBtn: { flex: 1, borderWidth: 1, borderColor: C.border, borderRadius: R.md, paddingVertical: 12, alignItems: 'center', backgroundColor: C.bg },
  genderActive: { borderColor: C.primary, backgroundColor: C.primary + '18' },
  genderText: { fontSize: 14, color: C.muted, fontWeight: '600' },
  activityBtn: { borderWidth: 1, borderColor: C.border, borderRadius: R.md, padding: 12, marginBottom: 8, backgroundColor: C.bg },
  activityActive: { borderColor: C.primary, backgroundColor: C.primary + '0f' },
  activityLabel: { fontSize: 13, fontWeight: '600', color: C.text, marginBottom: 2 },
  activityDesc: { fontSize: 11, color: C.muted },
  calcBtn: { backgroundColor: C.primary, borderRadius: R.md, paddingVertical: 14, alignItems: 'center', marginTop: 4, marginBottom: 16 },
  calcBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  result: { borderWidth: 2, borderRadius: R.lg, padding: 20, alignItems: 'center', marginBottom: 20 },
  resultValue: { fontSize: 44, fontWeight: '900' },
  resultLabel: { fontSize: 14, fontWeight: '700', marginBottom: 8 },
  resultNote: { fontSize: 12, color: C.muted, textAlign: 'center', lineHeight: 18 },
  bmiZones: { marginTop: 8, gap: 8 },
  bmiZoneRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  bmiZoneDot: { width: 10, height: 10, borderRadius: 5 },
  bmiZoneLabel: { flex: 1, fontSize: 13, color: C.text },
  bmiZoneRange: { fontSize: 12, color: C.muted },
  goalRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  goalBtn: { flex: 1, borderWidth: 1, borderColor: C.border, borderRadius: R.md, paddingVertical: 10, alignItems: 'center', backgroundColor: C.bg },
  goalActive: { borderColor: C.primary, backgroundColor: C.primary + '0f' },
  goalText: { fontSize: 12, color: C.muted, fontWeight: '600', textAlign: 'center' },
  macroNote: { fontSize: 12, color: C.muted, marginBottom: 14, lineHeight: 18 },
  macroResult: { flexDirection: 'row', gap: 8 },
});
