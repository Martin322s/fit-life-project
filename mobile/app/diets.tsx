import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackHeader } from '@/src/components/BackHeader';
import { Card } from '@/src/components/Card';
import { C, R } from '@/src/theme';
import { activeDiet, foodGuide, availableDiets, mealIdeas } from '@/src/data/dietsData';

export default function Diets() {
  const [switchModal, setSwitchModal] = useState(false);
  const [selected, setSelected] = useState(availableDiets.find(d => d.active)?.id ?? '1');

  const proteinPct = Math.min(100, Math.round((activeDiet.macroActual.protein / activeDiet.macroTargets.protein) * 100));
  const fatPct = Math.min(100, Math.round((activeDiet.macroActual.fat / activeDiet.macroTargets.fat) * 100));
  const carbsPct = Math.min(100, Math.round((activeDiet.macroActual.carbs / activeDiet.macroTargets.carbs) * 100));

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <BackHeader title="Диети" action={{ label: 'Смени', onPress: () => setSwitchModal(true) }} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Stats Row */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsRow}>
          <DStat label="Активна диета" value={activeDiet.name} color={C.primary} />
          <DStat label="Спазване" value={`${activeDiet.compliance}%`} color={C.green} />
          <DStat label="Изгубено" value={`-${activeDiet.weightLost} кг`} color={C.amber} />
          <DStat label="Оставащи" value={`${activeDiet.daysRemaining} дни`} color={C.purple} />
        </ScrollView>

        {/* Active Diet Card */}
        <Card>
          <View style={styles.dietHeader}>
            <View>
              <Text style={styles.dietName}>{activeDiet.name}</Text>
              <Text style={styles.dietType}>{activeDiet.type}</Text>
            </View>
            <View style={[styles.activeBadge, { backgroundColor: C.green + '22', borderColor: C.green + '55' }]}>
              <Text style={[styles.activeBadgeText, { color: C.green }]}>● Активна</Text>
            </View>
          </View>
          <View style={styles.dietMeta}>
            <Text style={styles.dietMetaText}>Начало: {activeDiet.startDate}</Text>
            <Text style={styles.dietMetaText}>Оставащи: {activeDiet.daysRemaining} дни</Text>
          </View>
        </Card>

        {/* Macro Compliance */}
        <Card>
          <Text style={styles.cardTitle}>Спазване на макроси</Text>
          <MacroCompliance label="Протеин" target={activeDiet.macroTargets.protein} actual={activeDiet.macroActual.protein} pct={proteinPct} color={C.primary} unit="%" />
          <MacroCompliance label="Мазнини" target={activeDiet.macroTargets.fat} actual={activeDiet.macroActual.fat} pct={fatPct} color={C.amber} unit="%" />
          <MacroCompliance label="Въглехидрати" target={activeDiet.macroTargets.carbs} actual={activeDiet.macroActual.carbs} pct={carbsPct} color={C.green} unit="%" />
        </Card>

        {/* Food Guide */}
        <Card>
          <Text style={styles.cardTitle}>Хранителен наръчник</Text>
          <Text style={[styles.guideSection, { color: C.green }]}>✓ Разрешени храни</Text>
          {foodGuide.allowed.map(item => (
            <View key={item} style={styles.guideRow}>
              <Text style={styles.guideDot}>•</Text>
              <Text style={styles.guideItem}>{item}</Text>
            </View>
          ))}
          <Text style={[styles.guideSection, { color: C.red, marginTop: 12 }]}>✕ Забранени храни</Text>
          {foodGuide.avoid.map(item => (
            <View key={item} style={styles.guideRow}>
              <Text style={[styles.guideDot, { color: C.red }]}>•</Text>
              <Text style={[styles.guideItem, { color: C.muted }]}>{item}</Text>
            </View>
          ))}
        </Card>

        {/* Meal Ideas */}
        <Card>
          <Text style={styles.cardTitle}>Идеи за хранене 💡</Text>
          {mealIdeas.map(m => (
            <View key={m.meal} style={styles.mealIdeaRow}>
              <View>
                <Text style={styles.mealIdeaType}>{m.meal}</Text>
                <Text style={styles.mealIdeaName}>{m.idea}</Text>
              </View>
              <Text style={styles.mealIdeaCal}>{m.kcal} ккал</Text>
            </View>
          ))}
        </Card>
      </ScrollView>

      {/* Switch Diet Modal */}
      <Modal visible={switchModal} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Смяна на диета</Text>
              <Pressable onPress={() => setSwitchModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </Pressable>
            </View>
            <ScrollView>
              {availableDiets.map(diet => (
                <Pressable
                  key={diet.id}
                  style={[styles.dietOption, selected === diet.id && styles.dietOptionActive]}
                  onPress={() => setSelected(diet.id)}
                >
                  <View style={styles.dietOptionInfo}>
                    <Text style={styles.dietOptionName}>{diet.name}</Text>
                    <Text style={styles.dietOptionType}>{diet.type} · {diet.difficulty}</Text>
                  </View>
                  {diet.active && (
                    <View style={[styles.activeBadge, { backgroundColor: C.green + '22', borderColor: C.green + '55' }]}>
                      <Text style={[styles.activeBadgeText, { color: C.green, fontSize: 10 }]}>Текуща</Text>
                    </View>
                  )}
                  {selected === diet.id && !diet.active && (
                    <Text style={{ color: C.primary, fontSize: 18 }}>✓</Text>
                  )}
                </Pressable>
              ))}
            </ScrollView>
            <Pressable style={styles.modalBtn} onPress={() => setSwitchModal(false)}>
              <Text style={styles.modalBtnText}>Приложи промяната</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function MacroCompliance({
  label, target, actual, pct, color, unit,
}: {
  label: string; target: number; actual: number; pct: number; color: string; unit: string;
}) {
  return (
    <View style={styles.macroRow}>
      <View style={styles.macroHeader}>
        <Text style={styles.macroLabel}>{label}</Text>
        <Text style={{ fontSize: 12, color }}>
          {actual}{unit} / {target}{unit}
        </Text>
      </View>
      <View style={styles.macroTrack}>
        <View style={[styles.macroFill, { width: `${pct}%` as any, backgroundColor: color }]} />
      </View>
    </View>
  );
}

function DStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={[dsStyles.card, { borderTopColor: color }]}>
      <Text style={dsStyles.label}>{label}</Text>
      <Text style={[dsStyles.value, { color }]}>{value}</Text>
    </View>
  );
}

const dsStyles = StyleSheet.create({
  card: { backgroundColor: C.card, borderRadius: R.lg, padding: 14, marginRight: 10, minWidth: 130, borderTopWidth: 3, borderWidth: 1, borderColor: C.border },
  label: { fontSize: 11, color: C.muted, marginBottom: 4 },
  value: { fontSize: 14, fontWeight: '700' },
});

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { padding: 16, paddingBottom: 32 },
  statsRow: { marginBottom: 16 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: C.text, marginBottom: 14 },
  dietHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  dietName: { fontSize: 16, fontWeight: '700', color: C.text, marginBottom: 2 },
  dietType: { fontSize: 13, color: C.muted },
  activeBadge: { borderRadius: R.full, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1 },
  activeBadgeText: { fontSize: 12, fontWeight: '600' },
  dietMeta: { flexDirection: 'row', justifyContent: 'space-between' },
  dietMetaText: { fontSize: 12, color: C.muted },
  macroRow: { marginBottom: 12 },
  macroHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  macroLabel: { fontSize: 13, color: C.text },
  macroTrack: { height: 6, backgroundColor: C.border, borderRadius: R.full, overflow: 'hidden' },
  macroFill: { height: '100%', borderRadius: R.full },
  guideSection: { fontSize: 13, fontWeight: '700', marginBottom: 8 },
  guideRow: { flexDirection: 'row', gap: 8, marginBottom: 6 },
  guideDot: { fontSize: 14, color: C.green, lineHeight: 20 },
  guideItem: { fontSize: 13, color: C.text, flex: 1, lineHeight: 20 },
  mealIdeaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.border },
  mealIdeaType: { fontSize: 11, color: C.muted, marginBottom: 2 },
  mealIdeaName: { fontSize: 13, color: C.text, fontWeight: '500' },
  mealIdeaCal: { fontSize: 13, color: C.primary, fontWeight: '600' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: C.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 36, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 17, fontWeight: '700', color: C.text },
  modalClose: { fontSize: 18, color: C.muted },
  dietOption: { flexDirection: 'row', alignItems: 'center', padding: 14, borderWidth: 1, borderColor: C.border, borderRadius: R.md, marginBottom: 10 },
  dietOptionActive: { borderColor: C.primary, backgroundColor: C.primary + '0f' },
  dietOptionInfo: { flex: 1 },
  dietOptionName: { fontSize: 14, fontWeight: '600', color: C.text, marginBottom: 2 },
  dietOptionType: { fontSize: 12, color: C.muted },
  modalBtn: { backgroundColor: C.primary, borderRadius: R.md, paddingVertical: 15, alignItems: 'center', marginTop: 12 },
  modalBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
