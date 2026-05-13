import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Card } from '@/src/components/Card';
import { Avatar } from '@/src/components/Avatar';
import { C, R } from '@/src/theme';
import { useAuth, getInitials, getDisplayName } from '@/src/context/AuthContext';

const MENU_SECTIONS = [
  {
    title: 'Здраве',
    items: [
      { icon: '🏋️', label: 'Тренировъчни програми', desc: 'Намерете план за вашата цел', route: '/training-plans' },
      { icon: '🥗', label: 'Диети',                  desc: 'Разгледайте диетите',        route: '/diets'          },
      { icon: '🏆', label: 'Предизвикателства',       desc: 'Активни и предстоящи',       route: '/challenges'     },
      { icon: '📦', label: 'Продукти',                desc: 'База данни с храни',         route: '/products'       },
      { icon: '🍽️', label: 'Рецепти',                 desc: 'Планиране на хранене',       route: '/recipes'        },
    ],
  },
  {
    title: 'Инструменти',
    items: [
      { icon: '🧮', label: 'Калкулатори', desc: 'ИТМ, TDEE, макроси', route: '/calculators' },
    ],
  },
  {
    title: 'Акаунт',
    items: [
      { icon: '👤', label: 'Профил', desc: 'Лична информация и цели', route: '/profile' },
    ],
  },
];

export default function More() {
  const router = useRouter();
  const { user, profile, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const initials    = user ? getInitials(user) : '?';
  const displayName = user ? getDisplayName(user) : '';

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
            await logout();
            // Guard in _layout.tsx redirects to login
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
        <Pressable onPress={() => router.push('/profile')}>
          <Card style={styles.profileCard}>
            <View style={styles.profileInner}>
              <Avatar
                avatarUrl={profile?.avatarUrl}
                initials={initials}
                size={56}
              />
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{displayName}</Text>
                <Text style={styles.profileEmail}>{user?.email ?? ''}</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>⚡ FitLife</Text>
                </View>
              </View>
              <Text style={styles.profileArrow}>›</Text>
            </View>
          </Card>
        </Pressable>

        {/* Menu Sections */}
        {MENU_SECTIONS.map(section => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Card style={styles.menuCard}>
              {section.items.map((item, i) => (
                <Pressable
                  key={item.label}
                  style={[styles.menuRow, i < section.items.length - 1 && styles.menuRowBorder]}
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

        <Pressable
          style={[styles.logoutBtn, loggingOut && styles.logoutDisabled]}
          onPress={handleLogout}
          disabled={loggingOut}
        >
          <Text style={styles.logoutText}>🚪 Изход от профила</Text>
        </Pressable>

        <Text style={styles.version}>FitLife Mobile v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { padding: 16, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: '700', color: C.text, marginBottom: 20 },
  profileCard: { marginBottom: 24 },
  profileInner: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 17, fontWeight: '700', color: C.text, marginBottom: 2 },
  profileEmail: { fontSize: 13, color: C.muted, marginBottom: 6 },
  profileArrow: { fontSize: 22, color: C.muted, fontWeight: '300' },
  badge: { alignSelf: 'flex-start', backgroundColor: C.primary + '22', borderRadius: R.full, paddingHorizontal: 10, paddingVertical: 3, borderWidth: 1, borderColor: C.primary + '55' },
  badgeText: { fontSize: 11, color: C.primary, fontWeight: '700' },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 13, color: C.muted, fontWeight: '700', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  menuCard: { padding: 0 },
  menuRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  menuRowBorder: { borderBottomWidth: 1, borderBottomColor: C.border },
  menuIcon: { fontSize: 20, width: 28, textAlign: 'center' },
  menuText: { flex: 1 },
  menuLabel: { fontSize: 14, color: C.text, fontWeight: '600', marginBottom: 1 },
  menuDesc: { fontSize: 12, color: C.muted },
  menuArrow: { fontSize: 22, color: C.muted, fontWeight: '300' },
  logoutBtn: { borderWidth: 1, borderColor: C.red + '55', borderRadius: R.md, paddingVertical: 14, alignItems: 'center', marginBottom: 20, backgroundColor: C.red + '0a' },
  logoutDisabled: { opacity: 0.5 },
  logoutText: { color: C.red, fontSize: 15, fontWeight: '600' },
  version: { fontSize: 12, color: C.muted, textAlign: 'center' },
});
