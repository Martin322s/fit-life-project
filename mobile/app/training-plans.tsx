import React, { useCallback, useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Pressable, TextInput,
  ActivityIndicator, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackHeader } from '@/src/components/BackHeader';
import { Card } from '@/src/components/Card';
import { C, R } from '@/src/theme';
import { trainingPlansApi, type ApiTrainingPlan } from '@/src/services/contentApi';

const LEVEL_COLORS: Record<string, string> = {
  beginner:     C.green,
  intermediate: C.amber,
  advanced:     C.red,
};

export default function TrainingPlans() {
  const [items, setItems]     = useState<ApiTrainingPlan[]>([]);
  const [search, setSearch]   = useState('');
  const [page, setPage]       = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (p: number, q: string, silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await trainingPlansApi.list({ page: p, limit: 20, search: q || undefined });
      if (p === 1) setItems(res.items);
      else setItems(prev => [...prev, ...res.items]);
      setTotalPages(res.totalPages);
    } catch {}
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { load(1, search); }, [load, search]);

  const onRefresh = () => { setRefreshing(true); setPage(1); load(1, search, true); };

  const loadMore = () => {
    if (page < totalPages && !loading) {
      const next = page + 1;
      setPage(next);
      load(next, search, true);
    }
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <BackHeader title="Тренировъчни програми" />
      <View style={styles.searchBox}>
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={t => { setSearch(t); setPage(1); }}
          placeholder="Търсете програма…"
          placeholderTextColor={C.muted}
          clearButtonMode="while-editing"
        />
      </View>

      {loading && page === 1 ? (
        <View style={styles.center}><ActivityIndicator color={C.primary} size="large" /></View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.primary} />}
          onMomentumScrollEnd={({ nativeEvent }) => {
            const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
            if (contentOffset.y + layoutMeasurement.height >= contentSize.height - 40) loadMore();
          }}
          scrollEventThrottle={400}
        >
          {items.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyEmoji}>🏋️</Text>
              <Text style={styles.emptyText}>
                {search ? `Няма резултати за "${search}"` : 'Няма тренировъчни програми'}
              </Text>
            </View>
          ) : (
            items.map(item => <PlanCard key={item.id} item={item} />)
          )}
          {loading && page > 1 && (
            <View style={styles.loadMore}><ActivityIndicator color={C.primary} /></View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function PlanCard({ item }: { item: ApiTrainingPlan }) {
  const [expanded, setExpanded] = useState(false);
  const levelColor = item.level ? (LEVEL_COLORS[item.level] ?? C.muted) : C.muted;

  return (
    <Card style={styles.card}>
      <Pressable onPress={() => setExpanded(e => !e)}>
        <View style={styles.header}>
          <View style={styles.info}>
            {item.level && (
              <View style={[styles.levelBadge, { backgroundColor: levelColor + '22' }]}>
                <Text style={[styles.levelText, { color: levelColor }]}>{item.level}</Text>
              </View>
            )}
            <Text style={styles.title}>{item.title}</Text>
            <View style={styles.metaRow}>
              {item.durationWeeks   ? <Text style={styles.meta}>📅 {item.durationWeeks} седм.</Text>    : null}
              {item.sessionsPerWeek ? <Text style={styles.meta}>🔁 {item.sessionsPerWeek}×/седм.</Text> : null}
              {item.averageSessionMinutes ? <Text style={styles.meta}>⏱ {item.averageSessionMinutes} мин</Text> : null}
            </View>
          </View>
          {item.caloriesBurnEstimate ? (
            <View style={styles.calBadge}>
              <Text style={styles.calVal}>{item.caloriesBurnEstimate}</Text>
              <Text style={styles.calUnit}>ккал/сес.</Text>
            </View>
          ) : null}
        </View>

        {item.goalType && (
          <Text style={styles.goal}>🎯 {item.goalType}</Text>
        )}

        {(item.equipment && item.equipment.length > 0) && (
          <View style={styles.tagRow}>
            {item.equipment.slice(0, 4).map((e, i) => (
              <View key={i} style={styles.tag}>
                <Text style={styles.tagText}>{e}</Text>
              </View>
            ))}
          </View>
        )}

        <Text style={styles.expand}>{expanded ? '▲ Скрий' : '▼ Виж детайли'}</Text>
      </Pressable>

      {expanded && (
        <View style={styles.details}>
          {item.description ? (
            <Text style={styles.desc}>{item.description}</Text>
          ) : null}

          {item.targetMuscles && item.targetMuscles.length > 0 && (
            <>
              <Text style={styles.subheading}>Мускулни групи</Text>
              <Text style={styles.listText}>{item.targetMuscles.join(' · ')}</Text>
            </>
          )}

          {item.weeklySchedule && item.weeklySchedule.length > 0 && (
            <>
              <Text style={styles.subheading}>Седмична програма</Text>
              {item.weeklySchedule.map((day, i) => (
                <Text key={i} style={styles.listItem}>📌 {day}</Text>
              ))}
            </>
          )}

          {item.planStructure && item.planStructure.length > 0 && (
            <>
              <Text style={styles.subheading}>Структура на плана</Text>
              {item.planStructure.map((s, i) => (
                <Text key={i} style={styles.listItem}>• {s}</Text>
              ))}
            </>
          )}

          {item.safetyNotes && item.safetyNotes.length > 0 && (
            <>
              <Text style={styles.subheading}>Бележки за безопасност</Text>
              {item.safetyNotes.map((n, i) => (
                <Text key={i} style={styles.listItem}>⚠️ {n}</Text>
              ))}
            </>
          )}
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  searchBox: { paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.border },
  searchInput: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: R.md, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, color: C.text },
  scroll: { padding: 16, paddingBottom: 32 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyBox: { alignItems: 'center', paddingVertical: 40 },
  emptyEmoji: { fontSize: 36, marginBottom: 10 },
  emptyText: { fontSize: 14, color: C.muted, textAlign: 'center' },
  loadMore: { alignItems: 'center', paddingVertical: 16 },
  card: { marginBottom: 12 },
  header: { flexDirection: 'row', gap: 12, marginBottom: 8 },
  info: { flex: 1 },
  levelBadge: { alignSelf: 'flex-start', borderRadius: R.full, paddingHorizontal: 8, paddingVertical: 2, marginBottom: 6 },
  levelText: { fontSize: 11, fontWeight: '700', textTransform: 'capitalize' },
  title: { fontSize: 15, fontWeight: '700', color: C.text, marginBottom: 6 },
  metaRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  meta: { fontSize: 12, color: C.muted },
  calBadge: { alignItems: 'center', justifyContent: 'center', backgroundColor: C.primary + '22', borderRadius: R.md, paddingHorizontal: 10, paddingVertical: 6, minWidth: 64 },
  calVal: { fontSize: 15, fontWeight: '800', color: C.primary },
  calUnit: { fontSize: 10, color: C.muted },
  goal: { fontSize: 12, color: C.muted, marginBottom: 8 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 },
  tag: { backgroundColor: C.border, borderRadius: R.full, paddingHorizontal: 8, paddingVertical: 3 },
  tagText: { fontSize: 11, color: C.muted },
  expand: { fontSize: 12, color: C.primary, fontWeight: '600', marginTop: 4 },
  details: { borderTopWidth: 1, borderTopColor: C.border, marginTop: 12, paddingTop: 12 },
  desc: { fontSize: 13, color: C.muted, lineHeight: 18, marginBottom: 10 },
  subheading: { fontSize: 13, fontWeight: '700', color: C.text, marginTop: 10, marginBottom: 6 },
  listText: { fontSize: 13, color: C.muted, lineHeight: 18 },
  listItem: { fontSize: 13, color: C.muted, marginBottom: 4, lineHeight: 18 },
});
