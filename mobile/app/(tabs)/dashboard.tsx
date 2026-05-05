import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Card } from '@/src/components/Card';
import { ProgressBar } from '@/src/components/ProgressBar';
import { C, R } from '@/src/theme';
import { useAuth, getInitials, getDisplayName } from '@/src/context/AuthContext';
import { mealsApi, isToday, sumCalories, sumMacros, type ApiMeal } from '@/src/services/mealsApi';
import { progressApi, type ApiProgressEntry } from '@/src/services/progressApi';
import { profileApi, type ApiProfile } from '@/src/services/profileApi';
import { hydrationApi } from '@/src/services/hydrationApi';

const DEFAULT_GOAL = 2000;
const DEFAULT_MACROS = { protein: 150, carbs: 200, fat: 65 };

function calcBmi(weightKg: number, heightCm: number) {
  return +(weightKg / ((heightCm / 100) ** 2)).toFixed(1);
}

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();

  const [meals, setMeals]       = useState<ApiMeal[]>([]);
  const [progress, setProgress] = useState<ApiProgressEntry[]>([]);
  const [profile, setProfile]   = useState<ApiProfile | null>(null);
  const [hydrationMl, setHydrationMl] = useState(0);
  const [loading, setLoading]   = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [m, p, prof, hydration] = await Promise.all([
        mealsApi.list(),
        progressApi.list(),
        profileApi.get().catch(() => null as { profile: ApiProfile } | null),
        hydrationApi.getToday().catch(() => ({ items: [], totalMl: 0 })),
      ]);
      const uid = user?.id;
      setMeals(uid ? m.items.filter(x => x.userId === uid) : m.items);
      setProgress(uid ? p.items.filter(x => x.userId === uid) : p.items);
      setProfile(prof?.profile ?? null);
      setHydrationMl(hydration.totalMl);
    } catch {}
    finally { setLoading(false); setRefreshing(false); }
  }, [user?.id]);

  useEffect(() => { load(); }, [load]);

  const onRefresh = () => { setRefreshing(true); load(true); };

  const today = new Date().toLocaleDateString('bg-BG', { weekday: 'long', day: 'numeric', month: 'long' });

  const todayMeals = meals.filter(m => isToday(m.createdAt))
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  const todayCalories = sumCalories(todayMeals);
  const todayMacros   = sumMacros(todayMeals);

  const goalCalories = profile?.caloriesTarget ?? DEFAULT_GOAL;
  const proteinGoal  = profile?.proteinTarget  ?? DEFAULT_MACROS.protein;
  const carbsGoal    = profile?.carbsTarget    ?? DEFAULT_MACROS.carbs;
  const fatGoal      = profile?.fatTarget      ?? DEFAULT_MACROS.fat;
  const remaining    = Math.max(0, goalCalories - todayCalories);
  const calPct       = Math.min(100, Math.round((todayCalories / goalCalories) * 100));

  const progressSorted = [...progress]
    .filter(p => p.weightKg != null)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const currentWeight = progressSorted[0]?.weightKg ?? null;

  const bmi = currentWeight && profile?.heightCm
    ? calcBmi(currentWeight, profile.heightCm)
    : null;

  const displayName = user ? getDisplayName(user) : '';
  const initials    = user ? getInitials(user) : '?';

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
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Здравей, {user?.firstName ?? displayName.split(' ')[0]}! 👋</Text>
            <Text style={styles.date}>{today}</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
        </View>

        {/* Quick Stats */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsScroll}>
          <QuickStat label="Оставащи ккал" value={`${remaining}`} sub="ккал" color={remaining > 0 ? C.primary : C.red} />
          <QuickStat label="Изядени" value={`${todayCalories}`} sub={`от ${goalCalories} ккал`} color={C.green} />
          <QuickStat label="Вода" value={`${Math.round(hydrationMl / 100) / 10}`} sub="л днес" color={C.cyan} />
          {currentWeight && <QuickStat label="Тегло" value={`${currentWeight}`} sub="кг" color={C.amber} />}
          {bmi && <QuickStat label="ИТМ" value={`${bmi}`} sub="индекс" color={C.purple} />}
        </ScrollView>

        {/* Calorie Ring */}
        <Card style={styles.ringCard}>
          <View style={styles.ringRow}>
            <View style={[styles.ring, { borderColor: calPct >= 100 ? C.red : C.primary }]}>
              <Text style={styles.ringPct}>{calPct}%</Text>
              <Text style={styles.ringLabel}>от целта</Text>
            </View>
            <View style={styles.ringStats}>
              <RingStat label="Изядени"   value={`${todayCalories} ккал`} color={C.primary} />
              <RingStat label="Оставащи"  value={`${remaining} ккал`}     color={C.green} />
              <RingStat label="Цел"       value={`${goalCalories} ккал`}  color={C.muted} />
            </View>
          </View>
        </Card>

        {/* Macros */}
        <Card>
          <Text style={styles.cardTitle}>Макронутриенти</Text>
          <ProgressBar label="Протеин"      consumed={Math.round(todayMacros.protein)} target={proteinGoal} color={C.primary} unit="г" />
          <ProgressBar label="Въглехидрати" consumed={Math.round(todayMacros.carbs)}   target={carbsGoal}   color={C.green}   unit="г" />
          <ProgressBar label="Мазнини"      consumed={Math.round(todayMacros.fat)}      target={fatGoal}     color={C.amber}   unit="г" />
        </Card>

        {/* Today's Meals */}
        <Card>
          <View style={styles.mealHeader}>
            <Text style={styles.cardTitle}>Днешни хранения</Text>
            <Pressable onPress={() => router.push('/(tabs)/calories')}>
              <Text style={styles.seeAll}>Виж всички →</Text>
            </Pressable>
          </View>
          {todayMeals.length === 0 ? (
            <Text style={styles.empty}>Все още няма хранения за днес. Добавете от таб Калории.</Text>
          ) : (
            todayMeals.slice(0, 4).map(meal => (
              <View key={meal.id} style={styles.mealRow}>
                <View style={styles.mealDot} />
                <View style={styles.mealInfo}>
                  <Text style={styles.mealName}>{meal.title}</Text>
                  <Text style={styles.mealTime}>
                    {new Date(meal.createdAt).toLocaleTimeString('bg-BG', { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
                <Text style={styles.mealCal}>{meal.calories} ккал</Text>
              </View>
            ))
          )}
        </Card>

        {/* Weight progress */}
        {progressSorted.length >= 2 && profile?.goalWeight && (
          <Card>
            <Text style={styles.cardTitle}>Прогрес на теглото</Text>
            <View style={styles.weightRow}>
              <View style={styles.weightStat}>
                <Text style={styles.weightVal}>{currentWeight} кг</Text>
                <Text style={styles.weightLbl}>Текущо</Text>
              </View>
              <View style={styles.weightStat}>
                <Text style={[styles.weightVal, { color: C.green }]}>{profile.goalWeight} кг</Text>
                <Text style={styles.weightLbl}>Цел</Text>
              </View>
            </View>
          </Card>
        )}

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
  card: { backgroundColor: C.card, borderRadius: R.lg, padding: 14, marginRight: 10, minWidth: 120, borderTopWidth: 3, borderWidth: 1, borderColor: C.border },
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
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  greeting: { fontSize: 20, fontWeight: '700', color: C.text },
  date: { fontSize: 13, color: C.muted, marginTop: 2, textTransform: 'capitalize' },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: C.primary + '33', borderWidth: 2, borderColor: C.primary, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 14, fontWeight: '700', color: C.primary },
  statsScroll: { marginBottom: 16 },
  ringCard: { marginBottom: 16 },
  ringRow: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  ring: { width: 110, height: 110, borderRadius: 55, borderWidth: 8, justifyContent: 'center', alignItems: 'center' },
  ringPct: { fontSize: 22, fontWeight: '800', color: C.text },
  ringLabel: { fontSize: 11, color: C.muted },
  ringStats: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: C.text, marginBottom: 14 },
  mealHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  seeAll: { fontSize: 13, color: C.primary, fontWeight: '600' },
  empty: { fontSize: 13, color: C.muted, fontStyle: 'italic' },
  mealRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 10 },
  mealDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.primary },
  mealInfo: { flex: 1 },
  mealName: { fontSize: 13, color: C.text, fontWeight: '500' },
  mealTime: { fontSize: 11, color: C.muted },
  mealCal: { fontSize: 13, color: C.primary, fontWeight: '600' },
  weightRow: { flexDirection: 'row', gap: 24 },
  weightStat: {},
  weightVal: { fontSize: 22, fontWeight: '800', color: C.text },
  weightLbl: { fontSize: 12, color: C.muted },
});
