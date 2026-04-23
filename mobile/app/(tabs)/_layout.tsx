import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C } from '@/src/theme';

function Icon({ label }: { label: string }) {
  return <Text style={{ fontSize: 20 }}>{label}</Text>;
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: C.card,
          borderTopColor: C.border,
          borderTopWidth: 1,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom + 6,
          paddingTop: 6,
        },
        tabBarActiveTintColor: C.primary,
        tabBarInactiveTintColor: C.muted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{ title: 'Начало', tabBarIcon: () => <Icon label="🏠" /> }}
      />
      <Tabs.Screen
        name="calories"
        options={{ title: 'Калории', tabBarIcon: () => <Icon label="🔥" /> }}
      />
      <Tabs.Screen
        name="weight"
        options={{ title: 'Тегло', tabBarIcon: () => <Icon label="⚖️" /> }}
      />
      <Tabs.Screen
        name="training"
        options={{ title: 'Тренировки', tabBarIcon: () => <Icon label="💪" /> }}
      />
      <Tabs.Screen
        name="more"
        options={{ title: 'Още', tabBarIcon: () => <Icon label="☰" /> }}
      />
    </Tabs>
  );
}
