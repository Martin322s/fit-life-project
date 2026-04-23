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
import { C, R } from '@/src/theme';

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    if (!email.trim()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setSent(true);
  };

  if (sent) {
    return (
      <View style={[styles.root, styles.center]}>
        <Text style={styles.sentEmoji}>📧</Text>
        <Text style={styles.sentTitle}>Имейлът е изпратен</Text>
        <Text style={styles.sentSub}>
          Проверете пощата си за инструкции за възстановяване на паролата.
        </Text>
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
        <Text style={styles.subtitle}>
          Въведете имейла си и ще изпратим инструкции за нулиране на паролата.
        </Text>

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
        />

        <Pressable
          style={[styles.btn, (!email.trim() || loading) && styles.btnDisabled]}
          onPress={handleSend}
          disabled={!email.trim() || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Изпрати инструкции</Text>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bg,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  inner: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
  },
  back: {
    marginBottom: 32,
  },
  backText: {
    fontSize: 14,
    color: C.primary,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: C.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: C.muted,
    marginBottom: 28,
    lineHeight: 20,
  },
  label: {
    fontSize: 13,
    color: C.muted,
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: R.md,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    color: C.text,
    marginBottom: 20,
  },
  btn: {
    backgroundColor: C.primary,
    borderRadius: R.md,
    paddingVertical: 15,
    alignItems: 'center',
  },
  btnDisabled: {
    opacity: 0.5,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  sentEmoji: {
    fontSize: 56,
    marginBottom: 20,
  },
  sentTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: C.text,
    marginBottom: 10,
  },
  sentSub: {
    fontSize: 14,
    color: C.muted,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
});
