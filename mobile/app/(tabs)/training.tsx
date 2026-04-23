import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/src/components/Card';
import { ScreenHeader } from '@/src/components/ScreenHeader';
import { C, R } from '@/src/theme';
import { stats, activePlan, weekSchedule, todayExercises, personalRecords } from '@/src/data/trainingData';

export default function Training() {
  const [exercises, setExercises] = useState(todayExercises);

  const toggleExercise = (id: string) => {
    setExercises(prev =>
      prev.map(e => (e.id === id ? { ...e, done: !e.done } : e))
    );
  };

  const doneCnt = exercises.filter(e => e.done).length;

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <ScreenHeader title="Тренировки" subtitle="Активен план" />

        {/* Stats Row */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsRow}>
          <TStat label="Тренировки" value={`${stats.sessionsThisWeek}`} sub="тази седмица" color={C.primary} />
          <TStat label="Обем" value={stats.totalVolume} sub="тази седмица" color={C.purple} />
          <TStat label="Серия" value={`🔥 ${stats.streak}`} sub="дни" color={C.amber} />
          <TStat label="Общо" value={`${stats.totalSessions}`} sub="тренировки" color={C.green} />
        </ScrollView>

        {/* Active Plan */}
        <Card style={styles.planCard}>
          <View style={styles.planHeader}>
            <View style={[styles.planBadge, { backgroundColor: C.primary + '22' }]}>
              <Text style={[styles.planBadgeText, { color: C.primary }]}>{activePlan.level}</Text>
            </View>
            <Text style={styles.planWeek}>Седмица {activePlan.currentWeek}/{activePlan.totalWeeks}</Text>
          </View>
          <Text style={styles.planName}>{activePlan.name}</Text>
          <Text style={styles.planType}>{activePlan.type} · {activePlan.sessionsPerWeek} тренировки/седмица</Text>
          <View style={styles.planTrack}>
            <View
              style={[
                styles.planFill,
                { width: `${(activePlan.currentWeek / activePlan.totalWeeks) * 100}%` as any },
              ]}
            />
          </View>
          <Text style={styles.planProgress}>
            {activePlan.currentWeek} от {activePlan.totalWeeks} седмици завършени
          </Text>
        </Card>

        {/* Weekly Schedule */}
        <Card>
          <Text style={styles.cardTitle}>Седмична програма</Text>
          {weekSchedule.map(day => (
            <View
              key={day.day}
              style={[styles.scheduleRow, day.isToday && styles.scheduleRowToday]}
            >
              <View style={styles.scheduleDay}>
                <Text style={[styles.scheduleDayText, day.isToday && { color: C.primary }]}>
                  {day.day}
                </Text>
                {day.isToday && <View style={styles.todayDot} />}
              </View>
              <Text
                style={[
                  styles.scheduleFocus,
                  day.rest && { color: C.muted, fontStyle: 'italic' },
                  day.isToday && { color: C.text, fontWeight: '600' },
                ]}
              >
                {day.focus}
              </Text>
              <Text style={styles.scheduleDone}>{day.done ? '✅' : day.rest ? '—' : '○'}</Text>
            </View>
          ))}
        </Card>

        {/* Today's Workout */}
        <Card>
          <View style={styles.todayHeader}>
            <Text style={styles.cardTitle}>Днешна тренировка</Text>
            <Text style={styles.todayProgress}>{doneCnt}/{exercises.length}</Text>
          </View>
          {doneCnt === exercises.length && (
            <View style={styles.completeBanner}>
              <Text style={styles.completeText}>🎉 Тренировката е завършена!</Text>
            </View>
          )}
          {exercises.map(ex => (
            <Pressable
              key={ex.id}
              style={[styles.exerciseRow, ex.done && styles.exerciseDone]}
              onPress={() => toggleExercise(ex.id)}
            >
              <View style={[styles.checkbox, ex.done && styles.checkboxDone]}>
                {ex.done && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <View style={styles.exerciseInfo}>
                <Text style={[styles.exerciseName, ex.done && styles.exerciseNameDone]}>
                  {ex.name}
                </Text>
                <Text style={styles.exerciseMeta}>
                  {ex.sets} серии × {ex.reps} повт.
                  {ex.weight > 0 ? ` · ${ex.weight} кг` : ''}
                </Text>
              </View>
            </Pressable>
          ))}
        </Card>

        {/* Personal Records */}
        <Card>
          <Text style={styles.cardTitle}>Лични рекорди 🏆</Text>
          {personalRecords.map(pr => (
            <View key={pr.exercise} style={styles.prRow}>
              <View style={styles.prInfo}>
                <Text style={styles.prExercise}>{pr.exercise}</Text>
                <Text style={styles.prDate}>{pr.date}</Text>
              </View>
              <Text style={styles.prRecord}>{pr.record}</Text>
            </View>
          ))}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

function TStat({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <View style={[tsStyles.card, { borderTopColor: color }]}>
      <Text style={tsStyles.label}>{label}</Text>
      <Text style={[tsStyles.value, { color }]}>{value}</Text>
      <Text style={tsStyles.sub}>{sub}</Text>
    </View>
  );
}

const tsStyles = StyleSheet.create({
  card: {
    backgroundColor: C.card,
    borderRadius: R.lg,
    padding: 14,
    marginRight: 10,
    minWidth: 120,
    borderTopWidth: 3,
    borderWidth: 1,
    borderColor: C.border,
  },
  label: { fontSize: 11, color: C.muted, marginBottom: 4 },
  value: { fontSize: 16, fontWeight: '700' },
  sub: { fontSize: 11, color: C.muted, marginTop: 2 },
});

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { padding: 16, paddingBottom: 32 },
  statsRow: { marginBottom: 16 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: C.text, marginBottom: 14 },
  planCard: { marginBottom: 16 },
  planHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  planBadge: { borderRadius: R.full, paddingHorizontal: 10, paddingVertical: 4 },
  planBadgeText: { fontSize: 12, fontWeight: '700' },
  planWeek: { fontSize: 12, color: C.muted },
  planName: { fontSize: 17, fontWeight: '700', color: C.text, marginBottom: 4 },
  planType: { fontSize: 13, color: C.muted, marginBottom: 14 },
  planTrack: { height: 6, backgroundColor: C.border, borderRadius: R.full, overflow: 'hidden', marginBottom: 6 },
  planFill: { height: '100%', backgroundColor: C.primary, borderRadius: R.full },
  planProgress: { fontSize: 12, color: C.muted },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    gap: 12,
  },
  scheduleRowToday: { backgroundColor: C.primary + '0a', borderRadius: R.md, paddingHorizontal: 8 },
  scheduleDay: { width: 28, alignItems: 'center' },
  scheduleDayText: { fontSize: 13, fontWeight: '700', color: C.muted },
  todayDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: C.primary, marginTop: 2 },
  scheduleFocus: { flex: 1, fontSize: 13, color: C.text },
  scheduleDone: { fontSize: 14 },
  todayHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  todayProgress: { fontSize: 14, color: C.primary, fontWeight: '700' },
  completeBanner: {
    backgroundColor: C.green + '22',
    borderRadius: R.md,
    padding: 12,
    marginBottom: 14,
    alignItems: 'center',
  },
  completeText: { color: C.green, fontWeight: '700', fontSize: 14 },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  exerciseDone: { opacity: 0.5 },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: C.muted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxDone: { backgroundColor: C.green, borderColor: C.green },
  checkmark: { color: '#fff', fontSize: 12, fontWeight: '800' },
  exerciseInfo: { flex: 1 },
  exerciseName: { fontSize: 14, color: C.text, fontWeight: '500', marginBottom: 2 },
  exerciseNameDone: { textDecorationLine: 'line-through' },
  exerciseMeta: { fontSize: 12, color: C.muted },
  prRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  prInfo: {},
  prExercise: { fontSize: 13, color: C.text, fontWeight: '500', marginBottom: 2 },
  prDate: { fontSize: 11, color: C.muted },
  prRecord: { fontSize: 14, color: C.amber, fontWeight: '700' },
});
