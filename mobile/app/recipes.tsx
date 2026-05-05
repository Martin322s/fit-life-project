import React, { useCallback, useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Pressable, TextInput,
  ActivityIndicator, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackHeader } from '@/src/components/BackHeader';
import { Card } from '@/src/components/Card';
import { C, R } from '@/src/theme';
import { recipesApi, type ApiRecipe } from '@/src/services/contentApi';

export default function Recipes() {
  const [items, setItems]     = useState<ApiRecipe[]>([]);
  const [search, setSearch]   = useState('');
  const [page, setPage]       = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (p: number, q: string, silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await recipesApi.list({ page: p, limit: 20, search: q || undefined });
      if (p === 1) setItems(res.items);
      else setItems(prev => [...prev, ...res.items]);
      setTotalPages(res.totalPages);
    } catch {}
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { load(1, search); }, [load, search]);

  const onRefresh = () => { setRefreshing(true); setPage(1); load(1, search, true); };

  const handleSearch = (text: string) => { setSearch(text); setPage(1); };

  const loadMore = () => {
    if (page < totalPages && !loading) {
      const next = page + 1;
      setPage(next);
      load(next, search, true);
    }
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <BackHeader title="Рецепти" />
      <View style={styles.searchBox}>
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={handleSearch}
          placeholder="Търсете рецепта…"
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
              <Text style={styles.emptyEmoji}>🍽️</Text>
              <Text style={styles.emptyText}>{search ? `Няма резултати за "${search}"` : 'Няма рецепти'}</Text>
            </View>
          ) : (
            items.map(item => <RecipeCard key={item.id} item={item} />)
          )}
          {loading && page > 1 && (
            <View style={styles.loadMore}><ActivityIndicator color={C.primary} /></View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function RecipeCard({ item }: { item: ApiRecipe }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <Card style={styles.card}>
      <Pressable onPress={() => setExpanded(e => !e)}>
        <View style={styles.cardHeader}>
          <View style={styles.cardInfo}>
            {item.category ? <Text style={styles.tag}>{item.category}</Text> : null}
            <Text style={styles.cardTitle}>{item.title}</Text>
            <View style={styles.metaRow}>
              {item.prepMinutes ? <Text style={styles.meta}>⏱ {item.prepMinutes} мин</Text> : null}
              {item.difficulty ? <Text style={styles.meta}>{item.difficulty}</Text> : null}
            </View>
          </View>
          {item.calories ? (
            <View style={styles.calBadge}>
              <Text style={styles.calVal}>{item.calories}</Text>
              <Text style={styles.calUnit}>ккал</Text>
            </View>
          ) : null}
        </View>

        {item.protein != null || item.carbs != null || item.fat != null ? (
          <View style={styles.macroRow}>
            {item.protein != null && <MacroBadge label="Б" value={item.protein} color={C.primary} />}
            {item.carbs   != null && <MacroBadge label="В" value={item.carbs}   color={C.green}   />}
            {item.fat     != null && <MacroBadge label="М" value={item.fat}     color={C.amber}   />}
          </View>
        ) : null}
      </Pressable>

      {expanded && (
        <>
          {item.description ? <Text style={styles.desc}>{item.description}</Text> : null}
          {item.ingredients && item.ingredients.length > 0 && (
            <>
              <Text style={styles.subheading}>Продукти</Text>
              {item.ingredients.map((ing, i) => <Text key={i} style={styles.listItem}>• {ing}</Text>)}
            </>
          )}
          {item.instructions && item.instructions.length > 0 && (
            <>
              <Text style={styles.subheading}>Приготвяне</Text>
              {item.instructions.map((step, i) => <Text key={i} style={styles.listItem}>{i + 1}. {step}</Text>)}
            </>
          )}
        </>
      )}
    </Card>
  );
}

function MacroBadge({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View style={[mbStyles.badge, { backgroundColor: color + '22' }]}>
      <Text style={[mbStyles.text, { color }]}>{label}: {Math.round(value)}г</Text>
    </View>
  );
}

const mbStyles = StyleSheet.create({
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
  cardHeader: { flexDirection: 'row', gap: 12 },
  cardInfo: { flex: 1 },
  tag: { fontSize: 11, color: C.primary, fontWeight: '700', marginBottom: 4, textTransform: 'uppercase' },
  cardTitle: { fontSize: 15, fontWeight: '700', color: C.text, marginBottom: 6 },
  metaRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  meta: { fontSize: 12, color: C.muted },
  calBadge: { alignItems: 'center', justifyContent: 'center', backgroundColor: C.primary + '22', borderRadius: R.md, paddingHorizontal: 10, paddingVertical: 6, minWidth: 52 },
  calVal: { fontSize: 16, fontWeight: '800', color: C.primary },
  calUnit: { fontSize: 10, color: C.muted },
  macroRow: { flexDirection: 'row', gap: 6, marginTop: 10 },
  desc: { fontSize: 13, color: C.muted, marginTop: 12, lineHeight: 18 },
  subheading: { fontSize: 13, fontWeight: '700', color: C.text, marginTop: 12, marginBottom: 6 },
  listItem: { fontSize: 13, color: C.muted, marginBottom: 4, lineHeight: 18 },
});
