import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/src/components/Card';
import { ProgressBar } from '@/src/components/ProgressBar';
import { C, R } from '@/src/theme';
import {
  user,
  calories,
  macros,
  water,
  steps,
  todayMeals,
} from '@/src/data/dashboardData';

export default function Dashboard() {
  const calPct = Math.min(100, Math.round((calories.eaten / calories.target) * 100));
  const today = new Date().toLocaleDateString('bg-BG', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Добро утро, {user.name.split(' ')[0]}! 👋</Text>
            <Text style={styles.date}>{today}</Text>
          </View>
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user.initials}</Text>
            </View>
            <View style={styles.streakBadge}>
              <Text style={styles.streakText}>🔥{user.streak}</Text>
            </View>
          </View>
        </View>

        {/* Quick Stats Row */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsScroll}>
          <QuickStat label="Калории" value={`${calories.remaining}`} sub="оставащи" color={C.primary} />
          <QuickStat label="Вода" value={`${water.glasses}/${water.target}`} sub="чаши" color={C.cyan} />
          <QuickStat label="Стъпки" value={`${steps.current.toLocaleString()}`} sub={`от ${steps.target.toLocaleString()}`} color={C.purple} />
        </ScrollView>

        {/* Calorie Ring Card */}
        <Card style={styles.ringCard}>
          <View style={styles.ringRow}>
            <View style={[styles.ring, { borderColor: C.primary }]}>
              <Text style={styles.ringPct}>{calPct}%</Text>
              <Text style={styles.ringLabel}>от целта</Text>
            </View>
            <View style={styles.ringStats}>
              <RingStat label="Изядени" value={`${calories.eaten} ккал`} color={C.primary} />
              <RingStat label="Изгорени" value={`${calories.burned} ккал`} color={C.green} />
              <RingStat label="Оставащи" value={`${calories.remaining} ккал`} color={C.amber} />
              <RingStat label="Цел" value={`${calories.target} ккал`} color={C.muted} />
            </View>
          </View>
        </Card>

        {/* Macros */}
        <Card>
          <Text style={styles.cardTitle}>Макронутриенти</Text>
          {macros.map(m => (
            <ProgressBar key={m.label} {...m} />
          ))}
        </Card>

        {/* Water */}
        <Card style={styles.waterCard}>
          <View style={styles.waterHeader}>
            <Text style={styles.cardTitle}>Вода 💧</Text>
            <Text style={styles.waterCount}>{water.glasses}/{water.target} чаши</Text>
          </View>
          <View style={styles.glassRow}>
            {Array.from({ length: water.target }).map((_, i) => (
              <View
                key={i}
                style={[styles.glass, i < water.glasses && styles.glassFull]}
              />
            ))}
          </View>
          <Pressable style={styles.waterBtn}>
            <Text style={styles.waterBtnText}>+ Добави чаша</Text>
          </Pressable>
        </Card>

        {/* Today's Meals */}
        <Card>
          <Text style={styles.cardTitle}>Днешни хранения</Text>
          {todayMeals.map(meal => (
            <View key={meal.id} style={styles.mealRow}>
              <View style={styles.mealDot} />
              <View style={styles.mealInfo}>
                <Text style={styles.mealType}>{meal.type}</Text>
                <Text style={styles.mealName}>{meal.name}</Text>
              </View>
              <Text style={styles.mealCal}>{meal.calories} ккал</Text>
            </View>
          ))}
          <Pressable style={styles.addMealBtn}>
            <Text style={styles.addMealText}>+ Добави хранене</Text>
          </Pressable>
        </Card>

        {/* Steps Progress */}
        <Card>
          <Text style={styles.cardTitle}>Стъпки 👟</Text>
          <View style={styles.stepsRow}>
            <Text style={styles.stepsValue}>{steps.current.toLocaleString()}</Text>
            <Text style={styles.stepsMuted}>/ {steps.target.toLocaleString()}</Text>
          </View>
          <View style={styles.stepsTrack}>
            <View
              style={[
                styles.stepsFill,
                { width: `${Math.min(100, (steps.current / steps.target) * 100)}%` as any },
              ]}
            />
          </View>
          <Text style={styles.stepsSub}>
            {steps.target - steps.current > 0
              ? `Остават ${(steps.target - steps.current).toLocaleString()} стъпки`
              : 'Целта е постигната! 🎉'}
          </Text>
        </Card>

      </ScrollView>
    </SafeAreaView>
  );
}

function QuickStat({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <View style={[qStyles.card, { borderTopColor: color }]}>
      <Text style={qStyles.label}>{label}</Text>
      <Text style={[qStyles.value, { color }]}>{value}</Text>
      <Text style={qStyles.sub}>{sub}</Text>
    </View>
  );
}

function RingStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={rStyles.row}>
      <View style={[rStyles.dot, { backgroundColor: color }]} />
      <View>
        <Text style={rStyles.label}>{label}</Text>
        <Text style={[rStyles.value, { color }]}>{value}</Text>
      </View>
    </View>
  );
}

const qStyles = StyleSheet.create({
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
  value: { fontSize: 20, fontWeight: '700', color: C.text },
  sub: { fontSize: 11, color: C.muted, marginTop: 2 },
});

const rStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  label: { fontSize: 11, color: C.muted },
  value: { fontSize: 13, fontWeight: '700' },
});

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { padding: 16, paddingBottom: 32 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  greeting: { fontSize: 20, fontWeight: '700', color: C.text },
  date: { fontSize: 13, color: C.muted, marginTop: 2, textTransform: 'capitalize' },
  avatarWrap: { position: 'relative' },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: C.primary + '33',
    borderWidth: 2,
    borderColor: C.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { fontSize: 14, fontWeight: '700', color: C.primary },
  streakBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: C.card,
    borderRadius: R.full,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  streakText: { fontSize: 10, fontWeight: '700' },
  statsScroll: { marginBottom: 16 },
  ringCard: { marginBottom: 16 },
  ringRow: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  ring: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringPct: { fontSize: 22, fontWeight: '800', color: C.text },
  ringLabel: { fontSize: 11, color: C.muted },
  ringStats: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: C.text, marginBottom: 14 },
  waterCard: { marginBottom: 0 },
  waterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  waterCount: { fontSize: 13, color: C.cyan, fontWeight: '600' },
  glassRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 14,
    flexWrap: 'wrap',
  },
  glass: {
    width: 28,
    height: 36,
    borderRadius: 6,
    backgroundColor: C.border,
    borderWidth: 1,
    borderColor: C.border,
  },
  glassFull: {
    backgroundColor: C.cyan + '55',
    borderColor: C.cyan,
  },
  waterBtn: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: C.cyan,
    borderRadius: R.md,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  waterBtnText: { fontSize: 13, color: C.cyan, fontWeight: '600' },
  mealRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  mealDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.primary,
  },
  mealInfo: { flex: 1 },
  mealType: { fontSize: 11, color: C.muted },
  mealName: { fontSize: 13, color: C.text, fontWeight: '500' },
  mealCal: { fontSize: 13, color: C.primary, fontWeight: '600' },
  addMealBtn: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: R.md,
    paddingVertical: 10,
    alignItems: 'center',
  },
  addMealText: { fontSize: 13, color: C.muted, fontWeight: '600' },
  stepsRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4, marginBottom: 8 },
  stepsValue: { fontSize: 28, fontWeight: '800', color: C.text },
  stepsMuted: { fontSize: 14, color: C.muted },
  stepsTrack: {
    height: 8,
    backgroundColor: C.border,
    borderRadius: R.full,
    overflow: 'hidden',
    marginBottom: 8,
  },
  stepsFill: {
    height: '100%',
    backgroundColor: C.purple,
    borderRadius: R.full,
  },
  stepsSub: { fontSize: 12, color: C.muted },
});
