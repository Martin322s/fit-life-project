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
import { shopProducts, bundles } from '@/src/data/shopData';

export default function Shop() {
  const [cart, setCart] = useState<Set<string>>(new Set());

  const toggleCart = (id: string) => {
    setCart(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <BackHeader
        title="Магазин"
        action={{ label: `🛒 ${cart.size}`, onPress: () => {} }}
      />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Featured Bundles */}
        <Text style={styles.section}>⚡ Специални пакети</Text>
        {bundles.map(bundle => (
          <Card key={bundle.id} style={styles.bundleCard}>
            <View style={styles.bundleHeader}>
              <View style={[styles.bundleBadge, { backgroundColor: C.red + '22' }]}>
                <Text style={[styles.bundleBadgeText, { color: C.red }]}>{bundle.badge}</Text>
              </View>
              <View style={styles.bundlePrices}>
                <Text style={styles.bundleOriginal}>{bundle.originalPrice.toFixed(2)} лв.</Text>
                <Text style={styles.bundlePrice}>{bundle.price.toFixed(2)} лв.</Text>
              </View>
            </View>
            <Text style={styles.bundleName}>{bundle.name}</Text>
            <Text style={styles.bundleDesc}>{bundle.desc}</Text>
            <View style={styles.bundleItems}>
              {bundle.items.map(item => (
                <View key={item} style={styles.bundleItem}>
                  <Text style={styles.bundleItemDot}>•</Text>
                  <Text style={styles.bundleItemText}>{item}</Text>
                </View>
              ))}
            </View>
            <Pressable style={styles.bundleBtn} onPress={() => toggleCart(bundle.id)}>
              <Text style={styles.bundleBtnText}>
                {cart.has(bundle.id) ? '✓ В количката' : 'Добави в количката'}
              </Text>
            </Pressable>
          </Card>
        ))}

        {/* Products */}
        <Text style={styles.section}>🛍️ Всички продукти</Text>
        {shopProducts.map(product => (
          <View key={product.id} style={styles.productRow}>
            <View style={styles.productInfo}>
              {product.badge && (
                <View style={[styles.productBadge, { backgroundColor: C.primary + '22' }]}>
                  <Text style={[styles.productBadgeText, { color: C.primary }]}>{product.badge}</Text>
                </View>
              )}
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productCategory}>{product.category}</Text>
              <View style={styles.ratingRow}>
                <Text style={styles.ratingStars}>★</Text>
                <Text style={styles.ratingValue}>{product.rating}</Text>
                <Text style={styles.ratingCount}>({product.reviews})</Text>
              </View>
            </View>
            <View style={styles.productRight}>
              <View style={styles.priceBlock}>
                {product.originalPrice && (
                  <Text style={styles.originalPrice}>{product.originalPrice.toFixed(2)} лв.</Text>
                )}
                <Text style={styles.price}>{product.price.toFixed(2)} лв.</Text>
              </View>
              <Pressable
                style={[styles.addBtn, cart.has(product.id) && styles.addBtnActive]}
                onPress={() => toggleCart(product.id)}
              >
                <Text style={styles.addBtnText}>{cart.has(product.id) ? '✓' : '+'}</Text>
              </Pressable>
            </View>
          </View>
        ))}

        {cart.size > 0 && (
          <Pressable style={styles.checkoutBtn}>
            <Text style={styles.checkoutText}>Към плащане · {cart.size} продукта</Text>
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { padding: 16, paddingBottom: 32 },
  section: { fontSize: 15, fontWeight: '700', color: C.text, marginBottom: 12 },
  bundleCard: { marginBottom: 14 },
  bundleHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  bundleBadge: { borderRadius: R.full, paddingHorizontal: 10, paddingVertical: 4 },
  bundleBadgeText: { fontSize: 13, fontWeight: '800' },
  bundlePrices: { alignItems: 'flex-end' },
  bundleOriginal: { fontSize: 12, color: C.muted, textDecorationLine: 'line-through' },
  bundlePrice: { fontSize: 18, fontWeight: '800', color: C.text },
  bundleName: { fontSize: 16, fontWeight: '700', color: C.text, marginBottom: 4 },
  bundleDesc: { fontSize: 13, color: C.muted, marginBottom: 12 },
  bundleItems: { marginBottom: 14 },
  bundleItem: { flexDirection: 'row', gap: 8, marginBottom: 4 },
  bundleItemDot: { color: C.green, fontSize: 14 },
  bundleItemText: { fontSize: 13, color: C.text, flex: 1 },
  bundleBtn: { backgroundColor: C.primary, borderRadius: R.md, paddingVertical: 12, alignItems: 'center' },
  bundleBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  productRow: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: C.card, borderRadius: R.lg, borderWidth: 1, borderColor: C.border, padding: 14, marginBottom: 10, gap: 12 },
  productInfo: { flex: 1 },
  productBadge: { alignSelf: 'flex-start', borderRadius: R.full, paddingHorizontal: 8, paddingVertical: 2, marginBottom: 6 },
  productBadgeText: { fontSize: 10, fontWeight: '700' },
  productName: { fontSize: 14, fontWeight: '600', color: C.text, marginBottom: 3 },
  productCategory: { fontSize: 12, color: C.muted, marginBottom: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingStars: { color: C.amber, fontSize: 13 },
  ratingValue: { fontSize: 12, fontWeight: '700', color: C.text },
  ratingCount: { fontSize: 11, color: C.muted },
  productRight: { alignItems: 'flex-end', gap: 8 },
  priceBlock: { alignItems: 'flex-end' },
  originalPrice: { fontSize: 11, color: C.muted, textDecorationLine: 'line-through' },
  price: { fontSize: 16, fontWeight: '700', color: C.text },
  addBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: C.primary + '22', borderWidth: 1, borderColor: C.primary, justifyContent: 'center', alignItems: 'center' },
  addBtnActive: { backgroundColor: C.primary },
  addBtnText: { fontSize: 18, color: '#fff', fontWeight: '700', lineHeight: 20 },
  checkoutBtn: { backgroundColor: C.green, borderRadius: R.md, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  checkoutText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
