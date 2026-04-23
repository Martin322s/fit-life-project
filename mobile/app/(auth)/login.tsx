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
  ScrollView,
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import { storage, KEYS } from '@/src/services/storage';
import { C, R } from '@/src/theme';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Моля, въведете email и парола.');
      return;
    }
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));

    await storage.set(KEYS.AUTH, {
      email: email.trim(),
      name: 'Мартин Иванов',
      loggedInAt: new Date().toISOString(),
    });

    setLoading(false);
    router.replace('/(tabs)/dashboard');
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.logo}>
          <Text style={styles.logoIcon}>⚡</Text>
          <Text style={styles.logoText}>FitLife</Text>
        </View>

        <Text style={styles.title}>Добре дошли обратно</Text>
        <Text style={styles.subtitle}>Влезте в профила си</Text>

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
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Парола</Text>
          <View style={styles.passWrapper}>
            <TextInput
              style={[styles.input, { flex: 1, borderWidth: 0 }]}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor={C.muted}
              secureTextEntry={!showPass}
            />
            <Pressable onPress={() => setShowPass(p => !p)} style={styles.eye}>
              <Text style={styles.eyeText}>{showPass ? '🙈' : '👁'}</Text>
            </Pressable>
          </View>
        </View>

        <Link href="/(auth)/forgot-password" asChild>
          <Pressable style={styles.forgotRow}>
            <Text style={styles.forgotText}>Забравена парола?</Text>
          </Pressable>
        </Link>

        <Pressable
          style={[styles.btn, loading && styles.btnDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Влез</Text>
          )}
        </Pressable>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Нямате акаунт? </Text>
          <Link href="/(auth)/register" asChild>
            <Pressable>
              <Text style={styles.footerLink}>Регистрирайте се</Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bg,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    gap: 8,
  },
  logoIcon: {
    fontSize: 28,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '800',
    color: C.text,
    letterSpacing: -0.5,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: C.text,
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: C.muted,
    textAlign: 'center',
    marginBottom: 28,
  },
  error: {
    color: C.red,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 16,
    backgroundColor: C.red + '18',
    borderRadius: R.md,
    padding: 10,
  },
  field: {
    marginBottom: 16,
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
  },
  passWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: R.md,
    paddingHorizontal: 14,
  },
  eye: {
    paddingLeft: 10,
    paddingVertical: 13,
  },
  eyeText: {
    fontSize: 16,
  },
  forgotRow: {
    alignSelf: 'flex-end',
    marginBottom: 24,
    marginTop: 4,
  },
  forgotText: {
    fontSize: 13,
    color: C.primary,
    fontWeight: '600',
  },
  btn: {
    backgroundColor: C.primary,
    borderRadius: R.md,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 24,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 14,
    color: C.muted,
  },
  footerLink: {
    fontSize: 14,
    color: C.primary,
    fontWeight: '600',
  },
});
