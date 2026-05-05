import React, { useCallback, useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Pressable, Modal,
  TextInput, KeyboardAvoidingView, Platform, ActivityIndicator,
  RefreshControl, Alert, type StyleProp, type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/src/components/Card';
import { ProgressBar } from '@/src/components/ProgressBar';
import { ScreenHeader } from '@/src/components/ScreenHeader';
import { C, R } from '@/src/theme';
import { useAuth } from '@/src/context/AuthContext';
import { mealsApi, isToday, sumCalories, sumMacros, type ApiMeal } from '@/src/services/mealsApi';
import { profileApi, type ApiProfile } from '@/src/services/profileApi';

const MEAL_LABELS = ['Закуска', 'Обяд', 'Снак', 'Вечеря'];

type ModalMode = 'add' | 'edit';

export default function Calories() {
  const { user } = useAuth();

  const [meals, setMeals]     = useState<ApiMeal[]>([]);
  const [profile, setProfile] = useState<ApiProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving]   = useState(false);

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode]       = useState<ModalMode>('add');
  const [editTarget, setEditTarget]     = useState<ApiMeal | null>(null);
  const [mealLabel, setMealLabel]       = useState('Закуска');
  const [foodName, setFoodName]         = useState('');
  const [foodCal, setFoodCal]           = useState('');
  const [foodProtein, setFoodProtein]   = useState('');
  const [foodCarbs, setFoodCarbs]       = useState('');
  const [foodFat, setFoodFat]           = useState('');
  const [modalError, setModalError]     = useState('');

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [m, prof] = await Promise.all([
        mealsApi.list(),
        profileApi.get().catch(() => null as { profile: ApiProfile } | null),
      ]);
      const uid = user?.id;
      setMeals(uid ? m.items.filter(x => x.userId === uid) : m.items);
      setProfile(prof?.profile ?? null);
    } catch {}
    finally { setLoading(false); setRefreshing(false); }
  }, [user?.id]);

  useEffect(() => { load(); }, [load]);

  const onRefresh = () => { setRefreshing(true); load(true); };

  const todayMeals = meals
    .filter(m => isToday(m.createdAt))
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const todayCalories = sumCalories(todayMeals);
  const todayMacros   = sumMacros(todayMeals);

  const goalCalories = profile?.caloriesTarget ?? 2000;
  const remaining    = Math.max(0, goalCalories - todayCalories);
  const pct          = Math.min(100, Math.round((todayCalories / goalCalories) * 100));

  const openAdd = (label = 'Закуска') => {
    setModalMode('add');
    setEditTarget(null);
    setMealLabel(label);
    setFoodName(''); setFoodCal(''); setFoodProtein(''); setFoodCarbs(''); setFoodFat('');
    setModalError('');
    setModalVisible(true);
  };

  const openEdit = (meal: ApiMeal) => {
    setModalMode('edit');
    setEditTarget(meal);
    setFoodName(meal.title);
    setFoodCal(String(meal.calories));
    setFoodProtein(meal.protein != null ? String(Math.round(meal.protein)) : '');
    setFoodCarbs(meal.carbs != null ? String(Math.round(meal.carbs)) : '');
    setFoodFat(meal.fat != null ? String(Math.round(meal.fat)) : '');
    setModalError('');
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!foodCal || Number(foodCal) <= 0) {
      setModalError('Въведете калории.');
      return;
    }
    setModalError('');
    setSaving(true);
    try {
      const title = foodName.trim() || mealLabel;
      const data = {
        title,
        calories: Number(foodCal),
        ...(foodProtein ? { protein: Number(foodProtein) } : {}),
        ...(foodCarbs   ? { carbs:   Number(foodCarbs)   } : {}),
        ...(foodFat     ? { fat:     Number(foodFat)     } : {}),
      };
      if (modalMode === 'add') {
        await mealsApi.create(data);
      } else if (editTarget) {
        await mealsApi.update(editTarget.id, data);
      }
      setModalVisible(false);
      load(true);
    } catch (err) {
      setModalError(err instanceof Error ? err.message : 'Грешка. Опитайте отново.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (meal: ApiMeal) => {
    Alert.alert('Изтрий', `Изтриване на "${meal.title}"?`, [
      { text: 'Отказ', style: 'cancel' },
      {
        text: 'Изтрий',
        style: 'destructive',
        onPress: async () => {
          try {
            await mealsApi.remove(meal.id);
            load(true);
          } catch {}
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
          title="Калории"
          subtitle={new Date().toLocaleDateString('bg-BG', { day: 'numeric', month: 'long' })}
          action={{ label: '+ Добави', onPress: () => openAdd() }}
        />

        {/* Budget pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsRow}>
          <StatPill label="Оставащи"  value={`${remaining}`}      color={remaining > 0 ? C.green : C.red} />
          <StatPill label="Изядени"   value={`${todayCalories}`}  color={C.primary} />
          <StatPill label="Цел"       value={`${goalCalories}`}   color={C.purple} />
          <StatPill label="Брой ястия" value={`${todayMeals.length}`} color={C.cyan} />
        </ScrollView>

        {/* Calorie bar */}
        <Card>
          <View style={styles.calHeader}>
            <Text style={styles.cardTitle}>Калориен баланс</Text>
            <Text style={[styles.calPct, { color: pct >= 100 ? C.red : C.primary }]}>{pct}%</Text>
          </View>
          <View style={styles.calTrack}>
            <View style={[styles.calFill, { width: `${pct}%` as any, backgroundColor: pct >= 100 ? C.red : C.primary }]} />
          </View>
          <View style={styles.calLabels}>
            <Text style={styles.calSub}>Изядени: {todayCalories} ккал</Text>
            <Text style={styles.calSub}>Цел: {goalCalories} ккал</Text>
          </View>
        </Card>

        {/* Macros */}
        <Card>
          <Text style={styles.cardTitle}>Макронутриенти</Text>
          <ProgressBar label="Протеин"      consumed={Math.round(todayMacros.protein)} target={profile?.proteinTarget ?? 150} color={C.primary} unit="г" />
          <ProgressBar label="Въглехидрати" consumed={Math.round(todayMacros.carbs)}   target={profile?.carbsTarget   ?? 200} color={C.green}   unit="г" />
          <ProgressBar label="Мазнини"      consumed={Math.round(todayMacros.fat)}      target={profile?.fatTarget     ?? 65}  color={C.amber}   unit="г" />
        </Card>

        {/* Meal list */}
        <Card>
          <View style={styles.mealGroupHeader}>
            <Text style={styles.cardTitle}>Хранения днес</Text>
            <Pressable onPress={() => openAdd()} style={styles.addBtn}>
              <Text style={styles.addBtnText}>+</Text>
            </Pressable>
          </View>

          {todayMeals.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyEmoji}>🍽️</Text>
              <Text style={styles.emptyText}>Нямате добавени хранения за днес</Text>
              <Pressable style={styles.emptyBtn} onPress={() => openAdd()}>
                <Text style={styles.emptyBtnText}>Добавете първото</Text>
              </Pressable>
            </View>
          ) : (
            todayMeals.map(meal => (
              <View key={meal.id} style={styles.foodRow}>
                <View style={styles.foodInfo}>
                  <Text style={styles.foodName}>{meal.title}</Text>
                  <Text style={styles.foodMacros}>
                    {new Date(meal.createdAt).toLocaleTimeString('bg-BG', { hour: '2-digit', minute: '2-digit' })}
                    {meal.protein != null ? `  Б:${Math.round(meal.protein)}г` : ''}
                    {meal.carbs   != null ? `  В:${Math.round(meal.carbs)}г`   : ''}
                    {meal.fat     != null ? `  М:${Math.round(meal.fat)}г`     : ''}
                  </Text>
                </View>
                <Text style={styles.foodCal}>{meal.calories}</Text>
                <Pressable onPress={() => openEdit(meal)} style={styles.actionBtn}>
                  <Text style={styles.actionBtnText}>✏️</Text>
                </Pressable>
                <Pressable onPress={() => handleDelete(meal)} style={styles.actionBtn}>
                  <Text style={styles.actionBtnText}>🗑</Text>
                </Pressable>
              </View>
            ))
          )}
        </Card>
      </ScrollView>

      {/* Add / Edit Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <KeyboardAvoidingView
          style={styles.overlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {modalMode === 'add' ? 'Добави храна' : 'Редактирай храна'}
              </Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </Pressable>
            </View>

            {modalMode === 'add' && (
              <View style={styles.modalField}>
                <Text style={styles.modalLabel}>Тип хранене</Text>
                <View style={styles.mealTypeTabs}>
                  {MEAL_LABELS.map(t => (
                    <Pressable
                      key={t}
                      onPress={() => setMealLabel(t)}
                      style={[styles.mealTab, mealLabel === t && styles.mealTabActive]}
                    >
                      <Text style={[styles.mealTabText, mealLabel === t && styles.mealTabTextActive]}>{t}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}

            <ModalField label="Наименование" value={foodName} onChangeText={setFoodName} placeholder="Напр. Пиле на скара" />
            <ModalField label="Калории *" value={foodCal} onChangeText={setFoodCal} placeholder="ккал" keyboardType="numeric" />

            <View style={styles.macroRow}>
              <ModalField label="Протеин г" value={foodProtein} onChangeText={setFoodProtein} placeholder="0" keyboardType="numeric" style={{ flex: 1 }} />
              <ModalField label="Въгл. г"   value={foodCarbs}   onChangeText={setFoodCarbs}   placeholder="0" keyboardType="numeric" style={{ flex: 1 }} />
              <ModalField label="Мазн. г"   value={foodFat}     onChangeText={setFoodFat}     placeholder="0" keyboardType="numeric" style={{ flex: 1 }} />
            </View>

            {modalError ? <Text style={styles.modalError}>{modalError}</Text> : null}

            <Pressable
              style={[styles.modalBtn, (saving || !foodCal) && styles.modalBtnDisabled]}
              onPress={handleSave}
              disabled={saving || !foodCal}
            >
              {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.modalBtnText}>Запази</Text>}
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
    </View>
  );
}

function ModalField({ label, style, ...props }: { label: string; style?: StyleProp<ViewStyle> } & React.ComponentProps<typeof TextInput>) {
  return (
    <View style={[{ marginBottom: 12 }, style]}>
      <Text style={styles.modalLabel}>{label}</Text>
      <TextInput
        style={styles.modalInput}
        placeholderTextColor={C.muted}
        {...props}
      />
    </View>
  );
}

const spStyles = StyleSheet.create({
  card: { backgroundColor: C.card, borderRadius: R.lg, padding: 12, marginRight: 10, minWidth: 90, borderTopWidth: 3, borderWidth: 1, borderColor: C.border, alignItems: 'center' },
  label: { fontSize: 10, color: C.muted, marginBottom: 4 },
  value: { fontSize: 18, fontWeight: '700' },
});

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { padding: 16, paddingBottom: 32 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  statsRow: { marginBottom: 16 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: C.text, marginBottom: 14 },
  calHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  calPct: { fontSize: 14, fontWeight: '700' },
  calTrack: { height: 10, backgroundColor: C.border, borderRadius: R.full, overflow: 'hidden', marginBottom: 8 },
  calFill: { height: '100%', borderRadius: R.full },
  calLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  calSub: { fontSize: 12, color: C.muted },
  mealGroupHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  addBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: C.primary + '22', borderWidth: 1, borderColor: C.primary, justifyContent: 'center', alignItems: 'center' },
  addBtnText: { color: C.primary, fontSize: 18, fontWeight: '700', lineHeight: 20 },
  emptyBox: { alignItems: 'center', paddingVertical: 24 },
  emptyEmoji: { fontSize: 32, marginBottom: 8 },
  emptyText: { fontSize: 14, color: C.muted, marginBottom: 12 },
  emptyBtn: { borderWidth: 1, borderColor: C.primary, borderRadius: R.md, paddingHorizontal: 16, paddingVertical: 8 },
  emptyBtnText: { color: C.primary, fontWeight: '600', fontSize: 13 },
  foodRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 6 },
  foodInfo: { flex: 1 },
  foodName: { fontSize: 13, color: C.text, fontWeight: '500', marginBottom: 2 },
  foodMacros: { fontSize: 11, color: C.muted },
  foodCal: { fontSize: 13, color: C.primary, fontWeight: '600', minWidth: 40, textAlign: 'right' },
  actionBtn: { padding: 4 },
  actionBtnText: { fontSize: 16 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: C.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 36 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 16, fontWeight: '700', color: C.text },
  modalClose: { fontSize: 18, color: C.muted, paddingLeft: 12 },
  modalField: { marginBottom: 14 },
  modalLabel: { fontSize: 12, color: C.muted, marginBottom: 5, fontWeight: '600' },
  modalInput: { backgroundColor: C.bg, borderWidth: 1, borderColor: C.border, borderRadius: R.md, paddingHorizontal: 12, paddingVertical: 11, fontSize: 14, color: C.text },
  macroRow: { flexDirection: 'row', gap: 8 },
  modalError: { color: C.red, fontSize: 13, marginBottom: 10 },
  mealTypeTabs: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  mealTab: { borderWidth: 1, borderColor: C.border, borderRadius: R.full, paddingHorizontal: 11, paddingVertical: 5, backgroundColor: C.bg },
  mealTabActive: { borderColor: C.primary, backgroundColor: C.primary + '22' },
  mealTabText: { fontSize: 12, color: C.muted, fontWeight: '600' },
  mealTabTextActive: { color: C.primary },
  modalBtn: { backgroundColor: C.primary, borderRadius: R.md, paddingVertical: 14, alignItems: 'center', marginTop: 4 },
  modalBtnDisabled: { opacity: 0.5 },
  modalBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
