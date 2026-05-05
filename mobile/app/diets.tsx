import React, { useCallback, useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TextInput,
  ActivityIndicator, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackHeader } from '@/src/components/BackHeader';
import { Card } from '@/src/components/Card';
import { C, R } from '@/src/theme';
import { dietsApi, type ApiDiet } from '@/src/services/contentApi';

export default function Diets() {
  const [items, setItems]     = useState<ApiDiet[]>([]);
  const [search, setSearch]   = useState('');
  const [page, setPage]       = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (p: number, q: string, silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await dietsApi.list({ page: p, limit: 20, search: q || undefined });
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
      <BackHeader title="Диети" />
      <View style={styles.searchBox}>
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={t => { setSearch(t); setPage(1); }}
          placeholder="Търсете диета…"
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
              <Text style={styles.emptyEmoji}>🥗</Text>
              <Text style={styles.emptyText}>{search ? `Няма резултати за "${search}"` : 'Няма диети'}</Text>
            </View>
          ) : (
            items.map(item => (
              <Card key={item.id} style={styles.card}>
                <View style={styles.header}>
                  <View style={styles.info}>
                    {item.category ? <Text style={styles.tag}>{item.category}</Text> : null}
                    <Text style={styles.title}>{item.title}</Text>
                    <View style={styles.metaRow}>
                      {item.difficulty  ? <Text style={styles.meta}>{item.difficulty}</Text>               : null}
                      {item.durationDays ? <Text style={styles.meta}>📅 {item.durationDays} дни</Text>      : null}
                      {item.goalType    ? <Text style={styles.meta}>{item.goalType}</Text>                 : null}
                    </View>
                  </View>
                  {item.caloriesPerDay ? (
                    <View style={styles.calBadge}>
                      <Text style={styles.calVal}>{item.caloriesPerDay}</Text>
                      <Text style={styles.calUnit}>ккал/ден</Text>
                    </View>
                  ) : null}
                </View>
                {item.description ? <Text style={styles.desc}>{item.description}</Text> : null}
                {(item.proteinTarget != null || item.carbsTarget != null || item.fatTarget != null) && (
                  <View style={styles.macroRow}>
                    {item.proteinTarget != null && <MacroBadge label="Протеин" value={item.proteinTarget} color={C.primary} />}
                    {item.carbsTarget   != null && <MacroBadge label="Въгл."   value={item.carbsTarget}   color={C.green}   />}
                    {item.fatTarget     != null && <MacroBadge label="Мазн."   value={item.fatTarget}     color={C.amber}   />}
                  </View>
                )}
              </Card>
            ))
          )}
          {loading && page > 1 && <View style={styles.loadMore}><ActivityIndicator color={C.primary} /></View>}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function MacroBadge({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View style={[mbS.badge, { backgroundColor: color + '22' }]}>
      <Text style={[mbS.text, { color }]}>{label}: {Math.round(value)}г</Text>
    </View>
  );
}

const mbS = StyleSheet.create({
  badge: { borderRadius: R.full, paddingHorizontal: 8, paddingVertical: 3 },
  text: { fontSize: 11, fontWeight: '600' },
});

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
  tag: { fontSize: 11, color: C.green, fontWeight: '700', marginBottom: 4, textTransform: 'uppercase' },
  title: { fontSize: 15, fontWeight: '700', color: C.text, marginBottom: 6 },
  metaRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  meta: { fontSize: 12, color: C.muted },
  calBadge: { alignItems: 'center', justifyContent: 'center', backgroundColor: C.primary + '22', borderRadius: R.md, paddingHorizontal: 10, paddingVertical: 6, minWidth: 52 },
  calVal: { fontSize: 16, fontWeight: '800', color: C.primary },
  calUnit: { fontSize: 10, color: C.muted },
  desc: { fontSize: 13, color: C.muted, lineHeight: 18, marginBottom: 8 },
  macroRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
});
