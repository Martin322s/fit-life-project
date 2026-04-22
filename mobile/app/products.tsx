import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackHeader } from '@/src/components/BackHeader';
import { Card } from '@/src/components/Card';
import { C, R } from '@/src/theme';
import { products, categories, type Product } from '@/src/data/productsData';

export default function Products() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Всички');
  const [selected, setSelected] = useState<Product | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set(products.filter(p => p.favorite).map(p => p.id)));

  const filtered = products.filter(p => {
    const matchCat = category === 'Всички' || p.category === category;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const toggleFav = (id: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <BackHeader title="Продукти" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Search */}
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Търси продукт..."
            placeholderTextColor={C.muted}
            autoCorrect={false}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch('')}>
              <Text style={styles.clearSearch}>✕</Text>
            </Pressable>
          )}
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statPill}>
            <Text style={styles.statPillValue}>{products.length}</Text>
            <Text style={styles.statPillLabel}>продукта</Text>
          </View>
          <View style={styles.statPill}>
            <Text style={styles.statPillValue}>{favorites.size}</Text>
            <Text style={styles.statPillLabel}>любими</Text>
          </View>
          <View style={styles.statPill}>
            <Text style={styles.statPillValue}>{categories.length - 1}</Text>
            <Text style={styles.statPillLabel}>категории</Text>
          </View>
        </View>

        {/* Category Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catRow}>
          {categories.map(cat => (
            <Pressable
              key={cat}
              style={[styles.catTab, category === cat && styles.catTabActive]}
              onPress={() => setCategory(cat)}
            >
              <Text style={[styles.catTabText, category === cat && styles.catTabTextActive]}>{cat}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Selected Product Detail */}
        {selected && (
          <Card style={styles.detailCard}>
            <View style={styles.detailHeader}>
              <View style={styles.detailInfo}>
                <Text style={styles.detailName}>{selected.name}</Text>
                <Text style={styles.detailBrand}>{selected.brand}</Text>
              </View>
              <Pressable onPress={() => setSelected(null)}>
                <Text style={styles.detailClose}>✕</Text>
              </Pressable>
            </View>
            <Text style={styles.detailServing}>На {selected.serving}</Text>
            <View style={styles.detailMacros}>
              <MacroBox label="Калории" value={`${selected.calories}`} unit="ккал" color={C.primary} />
              <MacroBox label="Протеин" value={`${selected.protein}`} unit="г" color={C.cyan} />
              <MacroBox label="Въглехидрати" value={`${selected.carbs}`} unit="г" color={C.green} />
              <MacroBox label="Мазнини" value={`${selected.fat}`} unit="г" color={C.amber} />
            </View>
          </Card>
        )}

        {/* Product List */}
        <Text style={styles.resultsLabel}>{filtered.length} резултата</Text>
        {filtered.map(product => (
          <Pressable key={product.id} onPress={() => setSelected(product)}>
            <View style={[styles.productRow, selected?.id === product.id && styles.productRowActive]}>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productMeta}>{product.brand} · {product.category} · {product.serving}</Text>
              </View>
              <View style={styles.productRight}>
                <Text style={styles.productCal}>{product.calories}</Text>
                <Text style={styles.productCalUnit}>ккал</Text>
              </View>
              <Pressable onPress={() => toggleFav(product.id)} style={styles.favBtn}>
                <Text style={{ fontSize: 16 }}>{favorites.has(product.id) ? '❤️' : '🤍'}</Text>
              </Pressable>
            </View>
          </Pressable>
        ))}

        {filtered.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyText}>Няма намерени продукти</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function MacroBox({ label, value, unit, color }: { label: string; value: string; unit: string; color: string }) {
  return (
    <View style={mbStyles.box}>
      <Text style={[mbStyles.value, { color }]}>{value}</Text>
      <Text style={mbStyles.unit}>{unit}</Text>
      <Text style={mbStyles.label}>{label}</Text>
    </View>
  );
}

const mbStyles = StyleSheet.create({
  box: { flex: 1, alignItems: 'center', backgroundColor: C.bg, borderRadius: R.md, padding: 10 },
  value: { fontSize: 18, fontWeight: '800' },
  unit: { fontSize: 11, color: C.muted },
  label: { fontSize: 10, color: C.muted, marginTop: 2 },
});

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { padding: 16, paddingBottom: 32 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: R.md, paddingHorizontal: 12, marginBottom: 14 },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 15, color: C.text },
  clearSearch: { fontSize: 14, color: C.muted, paddingLeft: 8 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  statPill: { flex: 1, backgroundColor: C.card, borderRadius: R.md, borderWidth: 1, borderColor: C.border, padding: 10, alignItems: 'center' },
  statPillValue: { fontSize: 18, fontWeight: '700', color: C.text },
  statPillLabel: { fontSize: 11, color: C.muted },
  catRow: { marginBottom: 16 },
  catTab: { borderWidth: 1, borderColor: C.border, borderRadius: R.full, paddingHorizontal: 14, paddingVertical: 7, marginRight: 8, backgroundColor: C.card },
  catTabActive: { borderColor: C.primary, backgroundColor: C.primary + '22' },
  catTabText: { fontSize: 13, color: C.muted, fontWeight: '600' },
  catTabTextActive: { color: C.primary },
  detailCard: { marginBottom: 16, backgroundColor: C.card },
  detailHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  detailInfo: { flex: 1 },
  detailName: { fontSize: 15, fontWeight: '700', color: C.text, marginBottom: 2 },
  detailBrand: { fontSize: 12, color: C.muted },
  detailClose: { fontSize: 18, color: C.muted, paddingLeft: 12 },
  detailServing: { fontSize: 12, color: C.muted, marginBottom: 14 },
  detailMacros: { flexDirection: 'row', gap: 8 },
  resultsLabel: { fontSize: 12, color: C.muted, marginBottom: 10 },
  productRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: R.md, borderWidth: 1, borderColor: C.border, padding: 12, marginBottom: 8, gap: 10 },
  productRowActive: { borderColor: C.primary },
  productInfo: { flex: 1 },
  productName: { fontSize: 13, fontWeight: '600', color: C.text, marginBottom: 2 },
  productMeta: { fontSize: 11, color: C.muted },
  productRight: { alignItems: 'center' },
  productCal: { fontSize: 16, fontWeight: '700', color: C.primary },
  productCalUnit: { fontSize: 10, color: C.muted },
  favBtn: { padding: 4 },
  empty: { alignItems: 'center', paddingVertical: 40 },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyText: { fontSize: 14, color: C.muted },
});
