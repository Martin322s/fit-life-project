import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/src/context/AuthContext';
import { C, R } from '@/src/theme';

export default function ResetPassword() {
  const router = useRouter();
  const { token } = useLocalSearchParams<{ token: string }>();
  const { resetPassword } = useAuth();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!token) {
    return (
      <View style={[styles.root, styles.center]}>
        <Text style={styles.emoji}>⚠️</Text>
        <Text style={styles.title}>Невалиден линк</Text>
        <Text style={styles.sub}>Заявете нов линк за нулиране.</Text>
        <Pressable style={styles.btn} onPress={() => router.replace('/(auth)/forgot-password')}>
          <Text style={styles.btnText}>Заяви нов линк</Text>
        </Pressable>
      </View>
    );
  }

  const handleReset = async () => {
    if (password.length < 8) {
      setError('Паролата трябва да е поне 8 символа.');
      return;
    }
    if (password !== confirm) {
      setError('Паролите не съвпадат.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await resetPassword(token as string, password);
      setSuccess(true);
      setTimeout(() => router.replace('/(auth)/login'), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Грешка. Опитайте отново.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <View style={[styles.root, styles.center]}>
        <Text style={styles.emoji}>✅</Text>
        <Text style={styles.title}>Паролата е сменена!</Text>
        <Text style={styles.sub}>Пренасочване към вход…</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.inner}>
        <Text style={styles.title}>Нова парола</Text>
        <Text style={styles.sub}>Въведете и потвърдете новата си парола.</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.field}>
          <Text style={styles.label}>Нова парола</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Мин. 8 символа"
            placeholderTextColor={C.muted}
            secureTextEntry
            autoFocus
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Потвърди паролата</Text>
          <TextInput
            style={styles.input}
            value={confirm}
            onChangeText={setConfirm}
            placeholder="••••••••"
            placeholderTextColor={C.muted}
            secureTextEntry
          />
        </View>

        <Pressable
          style={[styles.btn, loading && styles.btnDisabled]}
          onPress={handleReset}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Смени паролата</Text>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  center: { justifyContent: 'center', alignItems: 'center', padding: 32 },
  inner: { flex: 1, padding: 24, paddingTop: 80 },
  emoji: { fontSize: 48, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '700', color: C.text, marginBottom: 8 },
  sub: { fontSize: 14, color: C.muted, marginBottom: 28, lineHeight: 20 },
  error: { color: C.red, fontSize: 13, marginBottom: 16, backgroundColor: C.red + '18', borderRadius: R.md, padding: 10 },
  field: { marginBottom: 16 },
  label: { fontSize: 13, color: C.muted, marginBottom: 6, fontWeight: '600' },
  input: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: R.md, paddingHorizontal: 14, paddingVertical: 13, fontSize: 15, color: C.text },
  btn: { backgroundColor: C.primary, borderRadius: R.md, paddingVertical: 15, alignItems: 'center', marginTop: 8 },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
