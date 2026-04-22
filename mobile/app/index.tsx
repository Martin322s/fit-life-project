import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { storage, KEYS } from '@/src/services/storage';
import { C } from '@/src/theme';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    storage.get(KEYS.AUTH).then(auth => {
      if (auth) {
        router.replace('/(tabs)/dashboard');
      } else {
        router.replace('/(auth)/login');
      }
    });
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator color={C.primary} size="large" />
    </View>
  );
}
