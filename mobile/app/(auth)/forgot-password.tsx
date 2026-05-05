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
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/context/AuthContext';
import { C, R } from '@/src/theme';

export default function ForgotPassword() {
  const router = useRouter();
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [devUrl, setDevUrl] = useState('');
  const [error, setError] = useState('');

  const handleSend = async () => {
    if (!email.trim()) {
      setError('Моля, въведете email адрес.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await forgotPassword(email.trim().toLowerCase());
      if (res.devResetUrl) {
        // Dev mode: show the reset URL so testers can access it without email
        setDevUrl(res.devResetUrl);
        console.log('[DEV] Reset URL:', res.devResetUrl);
      }
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Грешка. Опитайте отново.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <View style={[styles.root, styles.center]}>
        <Text style={styles.sentEmoji}>📧</Text>
        <Text style={styles.sentTitle}>Имейлът е изпратен</Text>
        <Text style={styles.sentSub}>
          Проверете пощата си за инструкции за възстановяване на паролата.
        </Text>
        {devUrl ? (
          <View style={styles.devBox}>
            <Text style={styles.devLabel}>DEV: Reset link</Text>
            <Text style={styles.devUrl} selectable>{devUrl}</Text>
          </View>
        ) : null}
        <Pressable style={styles.btn} onPress={() => router.replace('/(auth)/login')}>
          <Text style={styles.btnText}>Обратно към вход</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.inner}>
        <Pressable style={styles.back} onPress={() => router.back()}>
          <Text style={styles.backText}>← Назад</Text>
        </Pressable>

        <Text style={styles.title}>Забравена парола</Text>
        <Text style={styles.sub}>
          Въведете вашия email и ще ви изпратим линк за нулиране.
        </Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="your@email.com"
            placeholderTextColor={C.muted}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus
          />
        </View>

        <Pressable
          style={[styles.btn, (!email.trim() || loading) && styles.btnDisabled]}
          onPress={handleSend}
          disabled={!email.trim() || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Изпрати линк</Text>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  center: { justifyContent: 'center', alignItems: 'center', padding: 32 },
  inner: { flex: 1, padding: 24, paddingTop: 60 },
  sentEmoji: { fontSize: 48, marginBottom: 16 },
  sentTitle: { fontSize: 22, fontWeight: '700', color: C.text, marginBottom: 8, textAlign: 'center' },
  sentSub: { fontSize: 14, color: C.muted, textAlign: 'center', marginBottom: 24, lineHeight: 20 },
  devBox: { backgroundColor: C.card, borderRadius: R.md, padding: 12, marginBottom: 20, borderWidth: 1, borderColor: C.border, width: '100%' },
  devLabel: { fontSize: 11, color: C.amber, fontWeight: '700', marginBottom: 4 },
  devUrl: { fontSize: 12, color: C.muted, lineHeight: 16 },
  back: { marginBottom: 24 },
  backText: { fontSize: 14, color: C.primary, fontWeight: '600' },
  title: { fontSize: 24, fontWeight: '700', color: C.text, marginBottom: 8 },
  sub: { fontSize: 14, color: C.muted, marginBottom: 28, lineHeight: 20 },
  error: { color: C.red, fontSize: 13, marginBottom: 16, backgroundColor: C.red + '18', borderRadius: R.md, padding: 10 },
  field: { marginBottom: 20 },
  label: { fontSize: 13, color: C.muted, marginBottom: 6, fontWeight: '600' },
  input: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: R.md, paddingHorizontal: 14, paddingVertical: 13, fontSize: 15, color: C.text },
  btn: { backgroundColor: C.primary, borderRadius: R.md, paddingVertical: 15, alignItems: 'center' },
  btnDisabled: { opacity: 0.5 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
