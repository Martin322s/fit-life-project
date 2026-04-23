import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Card } from '@/src/components/Card';
import { storage, KEYS } from '@/src/services/storage';
import { C, R } from '@/src/theme';

const MENU_SECTIONS = [
  {
    title: 'Здраве',
    items: [
      { icon: '🥗', label: 'Диети', desc: 'Активна диета и спазване', route: '/diets' },
      { icon: '🛒', label: 'Магазин', desc: 'Продукти и пакети', route: '/shop' },
      { icon: '🏆', label: 'Предизвикателства', desc: 'Активни и предстоящи', route: '/challenges' },
      { icon: '📦', label: 'Продукти', desc: 'База данни с храни', route: '/products' },
    ],
  },
  {
    title: 'Инструменти',
    items: [
      { icon: '🧮', label: 'Калкулатори', desc: 'ИТМ, TDEE, макроси', route: '/calculators' },
      { icon: '🍽️', label: 'Рецепти', desc: 'Планиране на хранене', route: '/recipes' },
    ],
  },
  {
    title: 'Профил',
    items: [
      { icon: '👤', label: 'Профил', desc: 'Лична информация', route: '/profile' },
      { icon: '⚙️', label: 'Настройки', desc: 'Предпочитания и акаунт', route: '/settings' },
    ],
  },
];

export default function More() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Изход',
      'Сигурни ли сте, че искате да излезете?',
      [
        { text: 'Отказ', style: 'cancel' },
        {
          text: 'Изход',
          style: 'destructive',
          onPress: async () => {
            setLoggingOut(true);
            await storage.remove(KEYS.AUTH);
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Още</Text>

        {/* Profile Card */}
        <Card style={styles.profileCard}>
          <View style={styles.profileInner}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>МИ</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Мартин Иванов</Text>
              <Text style={styles.profileEmail}>martin@example.com</Text>
              <View style={styles.proBadge}>
                <Text style={styles.proBadgeText}>⚡ Pro план</Text>
              </View>
            </View>
          </View>

          <View style={styles.profileStats}>
            <ProfileStat label="Серия" value="7 дни 🔥" />
            <View style={styles.statDivider} />
            <ProfileStat label="Тренировки" value="48" />
            <View style={styles.statDivider} />
            <ProfileStat label="Изгубени кг" value="7.7 кг" />
          </View>
        </Card>

        {/* Menu Sections */}
        {MENU_SECTIONS.map(section => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Card style={styles.menuCard}>
              {section.items.map((item, i) => (
                <Pressable
                  key={item.label}
                  style={[
                    styles.menuRow,
                    i < section.items.length - 1 && styles.menuRowBorder,
                  ]}
                  onPress={() => router.push(item.route as any)}
                >
                  <Text style={styles.menuIcon}>{item.icon}</Text>
                  <View style={styles.menuText}>
                    <Text style={styles.menuLabel}>{item.label}</Text>
                    <Text style={styles.menuDesc}>{item.desc}</Text>
                  </View>
                  <Text style={styles.menuArrow}>›</Text>
                </Pressable>
              ))}
            </Card>
          </View>
        ))}

        {/* Logout */}
        <Pressable
          style={[styles.logoutBtn, loggingOut && styles.logoutDisabled]}
          onPress={handleLogout}
          disabled={loggingOut}
        >
          <Text style={styles.logoutText}>🚪 Изход от профила</Text>
        </Pressable>

        <Text style={styles.version}>FitLife v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function ProfileStat({ label, value }: { label: string; value: string }) {
  return (
    <View style={psStyles.box}>
      <Text style={psStyles.value}>{value}</Text>
      <Text style={psStyles.label}>{label}</Text>
    </View>
  );
}

const psStyles = StyleSheet.create({
  box: { flex: 1, alignItems: 'center' },
  value: { fontSize: 14, fontWeight: '700', color: C.text, marginBottom: 2 },
  label: { fontSize: 11, color: C.muted },
});

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { padding: 16, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: '700', color: C.text, marginBottom: 20 },
  profileCard: { marginBottom: 24 },
  profileInner: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 20 },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: C.primary + '33',
    borderWidth: 2,
    borderColor: C.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { fontSize: 18, fontWeight: '700', color: C.primary },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 17, fontWeight: '700', color: C.text, marginBottom: 2 },
  profileEmail: { fontSize: 13, color: C.muted, marginBottom: 6 },
  proBadge: {
    alignSelf: 'flex-start',
    backgroundColor: C.amber + '22',
    borderRadius: R.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: C.amber + '55',
  },
  proBadgeText: { fontSize: 11, color: C.amber, fontWeight: '700' },
  profileStats: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: C.border,
    paddingTop: 14,
  },
  statDivider: { width: 1, backgroundColor: C.border },
  section: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 13,
    color: C.muted,
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuCard: { padding: 0 },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  menuRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  menuIcon: { fontSize: 20, width: 28, textAlign: 'center' },
  menuText: { flex: 1 },
  menuLabel: { fontSize: 14, color: C.text, fontWeight: '600', marginBottom: 1 },
  menuDesc: { fontSize: 12, color: C.muted },
  menuArrow: { fontSize: 22, color: C.muted, fontWeight: '300' },
  logoutBtn: {
    borderWidth: 1,
    borderColor: C.red + '55',
    borderRadius: R.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: C.red + '0a',
  },
  logoutDisabled: { opacity: 0.5 },
  logoutText: { color: C.red, fontSize: 15, fontWeight: '600' },
  version: { fontSize: 12, color: C.muted, textAlign: 'center' },
});
