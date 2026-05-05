import React, { useCallback, useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Pressable, Modal,
  TextInput, KeyboardAvoidingView, Platform, ActivityIndicator,
  RefreshControl, Alert, type StyleProp, type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Card } from '@/src/components/Card';
import { ScreenHeader } from '@/src/components/ScreenHeader';
import { C, R } from '@/src/theme';
import { useAuth } from '@/src/context/AuthContext';
import { workoutsApi, type ApiWorkout } from '@/src/services/contentApi';

const WORKOUT_TYPES = ['Сила', 'Кардио', 'HIIT', 'Йога', 'Гъвкавост', 'Функционален', 'Друго'];

function isToday(dateStr: string): boolean {
  const d = new Date(dateStr);
  const t = new Date();
  return (
    d.getFullYear() === t.getFullYear() &&
    d.getMonth() === t.getMonth() &&
    d.getDate() === t.getDate()
  );
}

function isThisWeek(dateStr: string): boolean {
  const d = new Date(dateStr);
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);
  return d >= weekStart;
}

export default function Training() {
  const { user } = useAuth();
  const router = useRouter();

  const [workouts, setWorkouts] = useState<ApiWorkout[]>([]);
  const [loading, setLoading]   = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving]     = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle]       = useState('');
  const [type, setType]         = useState(WORKOUT_TYPES[0]);
  const [duration, setDuration] = useState('');
  const [calories, setCalories] = useState('');
  const [notes, setNotes]       = useState('');
  const [modalError, setModalError] = useState('');

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await workoutsApi.list();
      const uid = user?.id;
      const items = uid ? res.items.filter(w => w.userId === uid) : res.items;
      setWorkouts(items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch {}
    finally { setLoading(false); setRefreshing(false); }
  }, [user?.id]);

  useEffect(() => { load(); }, [load]);

  const onRefresh = () => { setRefreshing(true); load(true); };

  const weekWorkouts  = workouts.filter(w => isThisWeek(w.createdAt));
  const todayWorkouts = workouts.filter(w => isToday(w.createdAt));
  const weekMinutes   = weekWorkouts.reduce((s, w) => s + w.durationMinutes, 0);
  const weekCals      = weekWorkouts.reduce((s, w) => s + (w.caloriesBurned ?? 0), 0);

  const openAdd = () => {
    setTitle('');
    setType(WORKOUT_TYPES[0]);
    setDuration('');
    setCalories('');
    setNotes('');
    setModalError('');
    setModalVisible(true);
  };

  const handleSave = async () => {
    const dur = parseInt(duration, 10);
    if (!title.trim() || isNaN(dur) || dur <= 0) {
      setModalError('Въведете наименование и продължителност.');
      return;
    }
    setModalError('');
    setSaving(true);
    try {
      await workoutsApi.create({
        title: title.trim(),
        type,
        durationMinutes: dur,
        caloriesBurned: calories ? parseInt(calories, 10) : undefined,
        notes: notes.trim() || undefined,
      });
      setModalVisible(false);
      load(true);
    } catch (err) {
      setModalError(err instanceof Error ? err.message : 'Грешка. Опитайте отново.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (w: ApiWorkout) => {
    Alert.alert('Изтрий', `Изтриване на "${w.title}"?`, [
      { text: 'Отказ', style: 'cancel' },
      {
        text: 'Изтрий',
        style: 'destructive',
        onPress: async () => {
          try { await workoutsApi.remove(w.id); load(true); } catch {}
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
          title="Тренировки"
          subtitle="Дневник"
          action={{ label: '+ Добави', onPress: openAdd }}
        />

        {/* Weekly stats */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsRow}>
          <StatPill label="Тренировки" value={`${weekWorkouts.length}`} sub="тази седмица" color={C.primary} />
          <StatPill label="Минути"     value={`${weekMinutes}`}         sub="тази седмица" color={C.purple} />
          {weekCals > 0 && <StatPill label="Изгорени" value={`${weekCals}`} sub="ккал" color={C.amber} />}
          <StatPill label="Общо"       value={`${workouts.length}`}     sub="тренировки"   color={C.green} />
        </ScrollView>

        {/* Today */}
        <Card>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Днес ({todayWorkouts.length})</Text>
            <Pressable style={styles.addBtn} onPress={openAdd}>
              <Text style={styles.addBtnText}>+</Text>
            </Pressable>
          </View>
          {todayWorkouts.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyEmoji}>💪</Text>
              <Text style={styles.emptyText}>Все още няма тренировки за днес</Text>
              <Pressable style={styles.emptyBtn} onPress={openAdd}>
                <Text style={styles.emptyBtnText}>Запиши тренировка</Text>
              </Pressable>
            </View>
          ) : (
            todayWorkouts.map(w => <WorkoutRow key={w.id} w={w} onDelete={handleDelete} />)
          )}
        </Card>

        {/* Browse training plans */}
        <Pressable style={styles.plansBtn} onPress={() => router.push('/training-plans')}>
          <View style={styles.plansBtnInner}>
            <Text style={styles.plansBtnIcon}>🏋️</Text>
            <View style={styles.plansBtnText}>
              <Text style={styles.plansBtnTitle}>Разгледайте тренировъчни програми</Text>
              <Text style={styles.plansBtnSub}>Намерете план за вашата цел</Text>
            </View>
            <Text style={styles.plansBtnArrow}>›</Text>
          </View>
        </Pressable>

        {/* Recent workouts */}
        {workouts.length > 0 && (
          <Card>
            <Text style={styles.cardTitle}>Последни тренировки</Text>
            {workouts.slice(0, 10).map(w => <WorkoutRow key={w.id} w={w} onDelete={handleDelete} />)}
          </Card>
        )}

        {workouts.length === 0 && (
          <Card>
            <View style={styles.emptyBox}>
              <Text style={styles.emptyEmoji}>📋</Text>
              <Text style={styles.emptyText}>Нямате записани тренировки</Text>
              <Text style={styles.emptySubtext}>Започнете да следите напредъка си!</Text>
            </View>
          </Card>
        )}
      </ScrollView>

      {/* Add Workout Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <KeyboardAvoidingView
          style={styles.overlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Добави тренировка</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </Pressable>
            </View>

            <ModalField label="Наименование *" value={title} onChangeText={setTitle} placeholder="напр. Сутрешна тренировка" />

            <Text style={styles.fieldLabel}>Вид</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeRow}>
              {WORKOUT_TYPES.map(t => (
                <Pressable
                  key={t}
                  style={[styles.typeChip, type === t && styles.typeChipActive]}
                  onPress={() => setType(t)}
                >
                  <Text style={[styles.typeChipText, type === t && styles.typeChipTextActive]}>{t}</Text>
                </Pressable>
              ))}
            </ScrollView>

            <View style={styles.rowFields}>
              <ModalField
                label="Продължителност (мин) *"
                value={duration}
                onChangeText={setDuration}
                placeholder="45"
                keyboardType="numeric"
                style={{ flex: 1 }}
              />
              <ModalField
                label="Изгорени ккал"
                value={calories}
                onChangeText={setCalories}
                placeholder="300"
                keyboardType="numeric"
                style={{ flex: 1 }}
              />
            </View>

            <ModalField label="Бележка" value={notes} onChangeText={setNotes} placeholder="По желание…" />

            {modalError ? <Text style={styles.modalError}>{modalError}</Text> : null}

            <Pressable
              style={[styles.modalBtn, (saving || !title || !duration) && styles.modalBtnDisabled]}
              onPress={handleSave}
              disabled={saving || !title.trim() || !duration}
            >
              {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.modalBtnText}>Запази</Text>}
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

function WorkoutRow({ w, onDelete }: { w: ApiWorkout; onDelete: (w: ApiWorkout) => void }) {
  return (
    <View style={rowStyles.row}>
      <View style={[rowStyles.badge, { backgroundColor: C.primary + '22' }]}>
        <Text style={[rowStyles.badgeText, { color: C.primary }]}>{w.type.slice(0, 2)}</Text>
      </View>
      <View style={rowStyles.info}>
        <Text style={rowStyles.title}>{w.title}</Text>
        <Text style={rowStyles.meta}>
          {w.type} · {w.durationMinutes} мин
          {w.caloriesBurned ? ` · ${w.caloriesBurned} ккал` : ''}
        </Text>
        <Text style={rowStyles.date}>
          {new Date(w.createdAt).toLocaleDateString('bg-BG', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
      <Pressable onPress={() => onDelete(w)} style={rowStyles.del}>
        <Text style={rowStyles.delText}>🗑</Text>
      </Pressable>
    </View>
  );
}

function StatPill({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <View style={[spStyles.card, { borderTopColor: color }]}>
      <Text style={spStyles.label}>{label}</Text>
      <Text style={[spStyles.value, { color }]}>{value}</Text>
      <Text style={spStyles.sub}>{sub}</Text>
    </View>
  );
}

function ModalField({ label, style, ...props }: { label: string; style?: StyleProp<ViewStyle> } & React.ComponentProps<typeof TextInput>) {
  return (
    <View style={[{ marginBottom: 12 }, style]}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor={C.muted}
        {...props}
      />
    </View>
  );
}

const rowStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.border },
  badge: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  badgeText: { fontSize: 13, fontWeight: '800' },
  info: { flex: 1 },
  title: { fontSize: 14, fontWeight: '600', color: C.text, marginBottom: 2 },
  meta: { fontSize: 12, color: C.muted },
  date: { fontSize: 11, color: C.muted, marginTop: 1 },
  del: { padding: 6 },
  delText: { fontSize: 16 },
});

const spStyles = StyleSheet.create({
  card: { backgroundColor: C.card, borderRadius: R.lg, padding: 14, marginRight: 10, minWidth: 110, borderTopWidth: 3, borderWidth: 1, borderColor: C.border },
  label: { fontSize: 11, color: C.muted, marginBottom: 4 },
  value: { fontSize: 20, fontWeight: '700', color: C.text },
  sub: { fontSize: 11, color: C.muted, marginTop: 2 },
});

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { padding: 16, paddingBottom: 32 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  statsRow: { marginBottom: 16 },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: C.text },
  addBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: C.primary + '22', borderWidth: 1, borderColor: C.primary, justifyContent: 'center', alignItems: 'center' },
  addBtnText: { color: C.primary, fontSize: 18, fontWeight: '700', lineHeight: 20 },
  emptyBox: { alignItems: 'center', paddingVertical: 20 },
  emptyEmoji: { fontSize: 32, marginBottom: 8 },
  emptyText: { fontSize: 14, color: C.muted, marginBottom: 6 },
  emptySubtext: { fontSize: 12, color: C.muted, marginBottom: 12 },
  emptyBtn: { borderWidth: 1, borderColor: C.primary, borderRadius: R.md, paddingHorizontal: 16, paddingVertical: 8 },
  emptyBtnText: { color: C.primary, fontWeight: '600', fontSize: 13 },
  plansBtn: { backgroundColor: C.card, borderRadius: R.lg, borderWidth: 1, borderColor: C.border, marginBottom: 16, overflow: 'hidden' },
  plansBtnInner: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  plansBtnIcon: { fontSize: 24 },
  plansBtnText: { flex: 1 },
  plansBtnTitle: { fontSize: 14, fontWeight: '700', color: C.text, marginBottom: 2 },
  plansBtnSub: { fontSize: 12, color: C.muted },
  plansBtnArrow: { fontSize: 22, color: C.muted },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: C.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 36 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 16, fontWeight: '700', color: C.text },
  modalClose: { fontSize: 18, color: C.muted, paddingLeft: 12 },
  fieldLabel: { fontSize: 12, color: C.muted, marginBottom: 5, fontWeight: '600' },
  input: { backgroundColor: C.bg, borderWidth: 1, borderColor: C.border, borderRadius: R.md, paddingHorizontal: 12, paddingVertical: 11, fontSize: 14, color: C.text },
  typeRow: { marginBottom: 12 },
  typeChip: { borderWidth: 1, borderColor: C.border, borderRadius: R.full, paddingHorizontal: 12, paddingVertical: 6, marginRight: 8, backgroundColor: C.bg },
  typeChipActive: { borderColor: C.primary, backgroundColor: C.primary + '22' },
  typeChipText: { fontSize: 12, color: C.muted, fontWeight: '600' },
  typeChipTextActive: { color: C.primary },
  rowFields: { flexDirection: 'row', gap: 8 },
  modalError: { color: C.red, fontSize: 13, marginBottom: 10 },
  modalBtn: { backgroundColor: C.primary, borderRadius: R.md, paddingVertical: 14, alignItems: 'center', marginTop: 4 },
  modalBtnDisabled: { opacity: 0.5 },
  modalBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
