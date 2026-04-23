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
import { ProgressBar } from '@/src/components/ProgressBar';
import { ScreenHeader } from '@/src/components/ScreenHeader';
import { C, R } from '@/src/theme';
import { budget, macros, meals, quality } from '@/src/data/caloriesData';

const MEAL_TYPES = ['breakfast', 'lunch', 'snack', 'dinner'] as const;
const MEAL_LABELS: Record<string, string> = {
  breakfast: 'Закуска',
  lunch: 'Обяд',
  snack: 'Снак',
  dinner: 'Вечеря',
};

export default function Calories() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<string>('breakfast');
  const [foodName, setFoodName] = useState('');
  const [foodCal, setFoodCal] = useState('');

  const openAdd = (type: string) => {
    setSelectedMeal(type);
    setFoodName('');
    setFoodCal('');
    setModalVisible(true);
  };

  const handleAdd = () => {
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <ScreenHeader
          title="Калории"
          subtitle="Днес"
          action={{ label: '+ Добави', onPress: () => openAdd('breakfast') }}
        />

        {/* Stat cards */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsRow}>
          <StatPill label="Оставащи" value={`${budget.remaining}`} color={C.green} />
          <StatPill label="Изядени" value={`${budget.eaten}`} color={C.primary} />
          <StatPill label="Изгорени" value={`${budget.burned}`} color={C.amber} />
          <StatPill label="TDEE" value={`${budget.tdee}`} color={C.purple} />
        </ScrollView>

        {/* Calorie bar */}
        <Card>
          <View style={styles.calHeader}>
            <Text style={styles.cardTitle}>Калориен баланс</Text>
            <Text style={styles.calPct}>{budget.pct}%</Text>
          </View>
          <View style={styles.calTrack}>
            <View style={[styles.calFill, { width: `${budget.pct}%` as any }]} />
          </View>
          <View style={styles.calLabels}>
            <Text style={styles.calSub}>Изядени: {budget.eaten} ккал</Text>
            <Text style={styles.calSub}>Цел: {budget.target} ккал</Text>
          </View>
        </Card>

        {/* Macros */}
        <Card>
          <Text style={styles.cardTitle}>Макронутриенти</Text>
          {macros.map(m => (
            <ProgressBar key={m.label} {...m} />
          ))}
        </Card>

        {/* Meal groups */}
        {MEAL_TYPES.map(type => {
          const group = meals.find(m => m.type === type);
          const total = group?.items.reduce((s, i) => s + i.calories, 0) ?? 0;
          return (
            <Card key={type}>
              <View style={styles.mealGroupHeader}>
                <Text style={styles.cardTitle}>{MEAL_LABELS[type]}</Text>
                <View style={styles.mealGroupRight}>
                  <Text style={styles.mealTotal}>{total} ккал</Text>
                  <Pressable onPress={() => openAdd(type)} style={styles.addBtn}>
                    <Text style={styles.addBtnText}>+</Text>
                  </Pressable>
                </View>
              </View>
              {group?.items.map(item => (
                <View key={item.id} style={styles.foodRow}>
                  <View style={styles.foodInfo}>
                    <Text style={styles.foodName}>{item.name}</Text>
                    <Text style={styles.foodMacros}>
                      Б: {item.protein}г  В: {item.carbs}г  М: {item.fat}г
                    </Text>
                  </View>
                  <Text style={styles.foodCal}>{item.calories} ккал</Text>
                </View>
              ))}
              {(!group || group.items.length === 0) && (
                <Text style={styles.emptyMeal}>Няма добавени храни</Text>
              )}
            </Card>
          );
        })}

        {/* Quality metrics */}
        <Card>
          <Text style={styles.cardTitle}>Качество на храненето</Text>
          {quality.map(q => (
            <View key={q.label} style={styles.qualRow}>
              <View style={styles.qualHeader}>
                <Text style={styles.qualLabel}>{q.label}</Text>
                <Text style={[styles.qualValue, { color: q.color }]}>
                  {q.value}/{q.target} {q.unit}
                </Text>
              </View>
              <View style={styles.qualTrack}>
                <View
                  style={[
                    styles.qualFill,
                    {
                      width: `${Math.min(100, (q.value / q.target) * 100)}%` as any,
                      backgroundColor: q.color,
                    },
                  ]}
                />
              </View>
            </View>
          ))}
        </Card>
      </ScrollView>

      {/* Add Food Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <KeyboardAvoidingView
          style={styles.overlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Добави храна — {MEAL_LABELS[selectedMeal]}</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </Pressable>
            </View>

            <View style={styles.modalField}>
              <Text style={styles.modalLabel}>Тип хранене</Text>
              <View style={styles.mealTypeTabs}>
                {MEAL_TYPES.map(t => (
                  <Pressable
                    key={t}
                    onPress={() => setSelectedMeal(t)}
                    style={[styles.mealTab, selectedMeal === t && styles.mealTabActive]}
                  >
                    <Text style={[styles.mealTabText, selectedMeal === t && styles.mealTabTextActive]}>
                      {MEAL_LABELS[t]}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.modalField}>
              <Text style={styles.modalLabel}>Наименование</Text>
              <TextInput
                style={styles.modalInput}
                value={foodName}
                onChangeText={setFoodName}
                placeholder="Напр. Пиле на скара"
                placeholderTextColor={C.muted}
              />
            </View>

            <View style={styles.modalField}>
              <Text style={styles.modalLabel}>Калории</Text>
              <TextInput
                style={styles.modalInput}
                value={foodCal}
                onChangeText={setFoodCal}
                placeholder="ккал"
                placeholderTextColor={C.muted}
                keyboardType="numeric"
              />
            </View>

            <Pressable
              style={[styles.modalBtn, (!foodName || !foodCal) && styles.modalBtnDisabled]}
              onPress={handleAdd}
              disabled={!foodName || !foodCal}
            >
              <Text style={styles.modalBtnText}>Добави</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

function StatPill({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={[spStyles.card, { borderTopColor: color }]}>
      <Text style={spStyles.label}>{label}</Text>
      <Text style={[spStyles.value, { color }]}>{value}</Text>
      <Text style={spStyles.unit}>ккал</Text>
    </View>
  );
}

const spStyles = StyleSheet.create({
  card: {
    backgroundColor: C.card,
    borderRadius: R.lg,
    padding: 12,
    marginRight: 10,
    minWidth: 100,
    borderTopWidth: 3,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
  },
  label: { fontSize: 11, color: C.muted, marginBottom: 4 },
  value: { fontSize: 18, fontWeight: '700' },
  unit: { fontSize: 10, color: C.muted, marginTop: 1 },
});

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { padding: 16, paddingBottom: 32 },
  statsRow: { marginBottom: 16 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: C.text, marginBottom: 14 },
  calHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  calPct: { fontSize: 14, fontWeight: '700', color: C.primary },
  calTrack: { height: 10, backgroundColor: C.border, borderRadius: R.full, overflow: 'hidden', marginBottom: 8 },
  calFill: { height: '100%', backgroundColor: C.primary, borderRadius: R.full },
  calLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  calSub: { fontSize: 12, color: C.muted },
  mealGroupHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  mealGroupRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  mealTotal: { fontSize: 13, color: C.primary, fontWeight: '600' },
  addBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: C.primary + '22',
    borderWidth: 1,
    borderColor: C.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtnText: { color: C.primary, fontSize: 16, fontWeight: '700', lineHeight: 18 },
  foodRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  foodInfo: { flex: 1 },
  foodName: { fontSize: 13, color: C.text, fontWeight: '500', marginBottom: 2 },
  foodMacros: { fontSize: 11, color: C.muted },
  foodCal: { fontSize: 13, color: C.primary, fontWeight: '600' },
  emptyMeal: { fontSize: 13, color: C.muted, fontStyle: 'italic' },
  qualRow: { marginBottom: 12 },
  qualHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  qualLabel: { fontSize: 13, color: C.text },
  qualValue: { fontSize: 13, fontWeight: '600' },
  qualTrack: { height: 6, backgroundColor: C.border, borderRadius: R.full, overflow: 'hidden' },
  qualFill: { height: '100%', borderRadius: R.full },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalCard: {
    backgroundColor: C.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 36,
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 16, fontWeight: '700', color: C.text, flex: 1 },
  modalClose: { fontSize: 18, color: C.muted, paddingLeft: 12 },
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
  mealTypeTabs: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  mealTab: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: R.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: C.bg,
  },
  mealTabActive: { borderColor: C.primary, backgroundColor: C.primary + '22' },
  mealTabText: { fontSize: 12, color: C.muted, fontWeight: '600' },
  mealTabTextActive: { color: C.primary },
  modalBtn: {
    backgroundColor: C.primary,
    borderRadius: R.md,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 4,
  },
  modalBtnDisabled: { opacity: 0.5 },
  modalBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
