import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackHeader } from '@/src/components/BackHeader';
import { Card } from '@/src/components/Card';
import { C, R } from '@/src/theme';
import { recipes, weeklyPlan, type Recipe } from '@/src/data/recipesData';

const CATEGORIES = ['Всички', 'Закуска', 'Обяд', 'Вечеря', 'Снак'];
const CAT_MAP: Record<string, string> = {
  'Закуска': 'breakfast',
  'Обяд': 'lunch',
  'Вечеря': 'dinner',
  'Снак': 'snack',
};

export default function Recipes() {
  const [filter, setFilter] = useState('Всички');
  const [saved, setSaved] = useState<Set<string>>(new Set(recipes.filter(r => r.saved).map(r => r.id)));

  const filtered = filter === 'Всички'
    ? recipes
    : recipes.filter(r => r.category === CAT_MAP[filter]);

  const toggleSave = (id: string) => {
    setSaved(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const savedCount = saved.size;
  const totalCal = recipes.reduce((s, r) => s + r.calories, 0);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <BackHeader title="Рецепти" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Stats */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsRow}>
          <RStat label="Рецепти" value={`${recipes.length}`} color={C.primary} />
          <RStat label="Запазени" value={`${savedCount}`} color={C.green} />
          <RStat label="Ср. калории" value={`${Math.round(totalCal / recipes.length)}`} color={C.amber} />
        </ScrollView>

        {/* Weekly Meal Plan */}
        <Card>
          <Text style={styles.cardTitle}>Седмичен план 📅</Text>
          {Object.entries(weeklyPlan).map(([day, meal]) => (
            <View key={day} style={styles.planRow}>
              <Text style={styles.planDay}>{day}</Text>
              {meal ? (
                <Text style={styles.planMeal}>{meal}</Text>
              ) : (
                <Text style={styles.planEmpty}>Не е планирано</Text>
              )}
            </View>
          ))}
        </Card>

        {/* Filter Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          {CATEGORIES.map(cat => (
            <Pressable
              key={cat}
              style={[styles.filterTab, filter === cat && styles.filterTabActive]}
              onPress={() => setFilter(cat)}
            >
              <Text style={[styles.filterTabText, filter === cat && styles.filterTabTextActive]}>
                {cat}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Recipe Grid */}
        <View style={styles.grid}>
          {filtered.map(recipe => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              isSaved={saved.has(recipe.id)}
              onToggleSave={() => toggleSave(recipe.id)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function RecipeCard({ recipe, isSaved, onToggleSave }: { recipe: Recipe; isSaved: boolean; onToggleSave: () => void }) {
  return (
    <View style={rcStyles.card}>
      <View style={rcStyles.header}>
        <View style={[rcStyles.catBadge, { backgroundColor: C.primary + '22' }]}>
          <Text style={[rcStyles.catText, { color: C.primary }]}>{recipe.categoryLabel}</Text>
        </View>
        <Pressable onPress={onToggleSave}>
          <Text style={{ fontSize: 18 }}>{isSaved ? '❤️' : '🤍'}</Text>
        </Pressable>
      </View>
      <Text style={rcStyles.name}>{recipe.name}</Text>
      <Text style={rcStyles.meta}>{recipe.time} · {recipe.servings} порции</Text>
      <View style={rcStyles.macros}>
        <MacroPill value={`${recipe.calories} ккал`} color={C.primary} />
        <MacroPill value={`Б ${recipe.protein}г`} color={C.cyan} />
        <MacroPill value={`В ${recipe.carbs}г`} color={C.green} />
        <MacroPill value={`М ${recipe.fat}г`} color={C.amber} />
      </View>
    </View>
  );
}

function MacroPill({ value, color }: { value: string; color: string }) {
  return (
    <View style={[mpStyles.pill, { backgroundColor: color + '18' }]}>
      <Text style={[mpStyles.text, { color }]}>{value}</Text>
    </View>
  );
}

function RStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={[rsStyles.card, { borderTopColor: color }]}>
      <Text style={rsStyles.label}>{label}</Text>
      <Text style={[rsStyles.value, { color }]}>{value}</Text>
    </View>
  );
}

const rsStyles = StyleSheet.create({
  card: { backgroundColor: C.card, borderRadius: R.lg, padding: 14, marginRight: 10, minWidth: 110, borderTopWidth: 3, borderWidth: 1, borderColor: C.border, alignItems: 'center' },
  label: { fontSize: 11, color: C.muted, marginBottom: 4 },
  value: { fontSize: 20, fontWeight: '700' },
});

const mpStyles = StyleSheet.create({
  pill: { borderRadius: R.full, paddingHorizontal: 8, paddingVertical: 3 },
  text: { fontSize: 10, fontWeight: '600' },
});

const rcStyles = StyleSheet.create({
  card: { backgroundColor: C.card, borderRadius: R.lg, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: C.border },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  catBadge: { borderRadius: R.full, paddingHorizontal: 10, paddingVertical: 3 },
  catText: { fontSize: 11, fontWeight: '600' },
  name: { fontSize: 14, fontWeight: '700', color: C.text, marginBottom: 4 },
  meta: { fontSize: 12, color: C.muted, marginBottom: 10 },
  macros: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
});

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { padding: 16, paddingBottom: 32 },
  statsRow: { marginBottom: 16 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: C.text, marginBottom: 14 },
  planRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: C.border },
  planDay: { fontSize: 13, fontWeight: '600', color: C.text, width: 100 },
  planMeal: { fontSize: 13, color: C.text, flex: 1, textAlign: 'right' },
  planEmpty: { fontSize: 13, color: C.muted, fontStyle: 'italic', flex: 1, textAlign: 'right' },
  filterRow: { marginBottom: 16 },
  filterTab: { borderWidth: 1, borderColor: C.border, borderRadius: R.full, paddingHorizontal: 14, paddingVertical: 7, marginRight: 8, backgroundColor: C.card },
  filterTabActive: { borderColor: C.primary, backgroundColor: C.primary + '22' },
  filterTabText: { fontSize: 13, color: C.muted, fontWeight: '600' },
  filterTabTextActive: { color: C.primary },
  grid: {},
});
