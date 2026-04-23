import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import { storage, KEYS } from '@/src/services/storage';
import { C, R } from '@/src/theme';

type Step1 = { name: string; email: string; password: string };
type Step2 = { weight: string; height: string; goalWeight: string; goal: 'lose' | 'maintain' | 'gain' };

const GOALS = [
  { value: 'lose', label: 'Отслабване' },
  { value: 'maintain', label: 'Поддържане' },
  { value: 'gain', label: 'Качване' },
] as const;

function calculateProfile(s1: Step1, s2: Step2) {
  const w = parseFloat(s2.weight);
  const h = parseFloat(s2.height);
  const bmi = +(w / ((h / 100) ** 2)).toFixed(1);
  const bmr = 88.36 + 13.4 * w + 4.8 * h - 5.7 * 30;
  const tdee = Math.round(bmr * 1.55);
  const calorieGoal = s2.goal === 'lose' ? tdee - 500 : s2.goal === 'gain' ? tdee + 300 : tdee;
  return { bmi, tdee, calorieGoal };
}

export default function Register() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 'success'>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [s1, setS1] = useState<Step1>({ name: '', email: '', password: '' });
  const [s2, setS2] = useState<Step2>({ weight: '', height: '', goalWeight: '', goal: 'lose' });

  const handleStep1 = () => {
    if (!s1.name.trim() || !s1.email.trim() || s1.password.length < 6) {
      setError('Попълнете всички полета. Паролата трябва да е поне 6 символа.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleStep2 = async () => {
    if (!s2.weight || !s2.height || !s2.goalWeight) {
      setError('Попълнете всички полета.');
      return;
    }
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));

    const calc = calculateProfile(s1, s2);
    const profile = {
      name: s1.name.trim(),
      email: s1.email.trim(),
      gender: 'male' as const,
      age: 30,
      height: parseFloat(s2.height),
      weight: parseFloat(s2.weight),
      goalWeight: parseFloat(s2.goalWeight),
      goal: s2.goal,
      activityLevel: 'moderate' as const,
      plan: 'free' as const,
      ...calc,
    };

    await storage.set(KEYS.PROFILE, profile);
    await storage.set(KEYS.AUTH, {
      email: s1.email.trim(),
      name: s1.name.trim(),
      loggedInAt: new Date().toISOString(),
    });

    setLoading(false);
    setStep('success');
  };

  if (step === 'success') {
    return (
      <View style={styles.root}>
        <View style={styles.successBox}>
          <Text style={styles.successEmoji}>🎉</Text>
          <Text style={styles.successTitle}>Акаунтът е създаден!</Text>
          <Text style={styles.successSub}>Готови сте да започнете вашето фитнес пътуване.</Text>
          <Pressable style={styles.btn} onPress={() => router.replace('/(tabs)/dashboard')}>
            <Text style={styles.btnText}>Към таблото</Text>
          </Pressable>
        </View>
      </View>
    );
  }

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

        <View style={styles.stepRow}>
          <View style={[styles.stepDot, step === 1 && styles.stepActive]} />
          <View style={styles.stepLine} />
          <View style={[styles.stepDot, step === 2 && styles.stepActive]} />
        </View>

        <Text style={styles.title}>
          {step === 1 ? 'Създайте акаунт' : 'Вашите данни'}
        </Text>
        <Text style={styles.subtitle}>
          {step === 1 ? 'Стъпка 1 от 2 — Основна информация' : 'Стъпка 2 от 2 — Тяло и цел'}
        </Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {step === 1 && (
          <>
            <Field label="Имена" value={s1.name} onChange={v => setS1(p => ({ ...p, name: v }))} placeholder="Мартин Иванов" />
            <Field label="Email" value={s1.email} onChange={v => setS1(p => ({ ...p, email: v }))} placeholder="your@email.com" keyboard="email-address" />
            <Field label="Парола" value={s1.password} onChange={v => setS1(p => ({ ...p, password: v }))} placeholder="Мин. 6 символа" secure />
            <Pressable style={styles.btn} onPress={handleStep1}>
              <Text style={styles.btnText}>Следваща стъпка →</Text>
            </Pressable>
          </>
        )}

        {step === 2 && (
          <>
            <Field label="Тегло (кг)" value={s2.weight} onChange={v => setS2(p => ({ ...p, weight: v }))} placeholder="78" keyboard="numeric" />
            <Field label="Височина (см)" value={s2.height} onChange={v => setS2(p => ({ ...p, height: v }))} placeholder="180" keyboard="numeric" />
            <Field label="Целево тегло (кг)" value={s2.goalWeight} onChange={v => setS2(p => ({ ...p, goalWeight: v }))} placeholder="72" keyboard="numeric" />

            <Text style={styles.label}>Цел</Text>
            <View style={styles.goalRow}>
              {GOALS.map(g => (
                <Pressable
                  key={g.value}
                  style={[styles.goalBtn, s2.goal === g.value && styles.goalActive]}
                  onPress={() => setS2(p => ({ ...p, goal: g.value }))}
                >
                  <Text style={[styles.goalText, s2.goal === g.value && styles.goalTextActive]}>
                    {g.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.rowBtns}>
              <Pressable style={styles.backBtn} onPress={() => setStep(1)}>
                <Text style={styles.backBtnText}>← Назад</Text>
              </Pressable>
              <Pressable style={[styles.btn, styles.btnFlex, loading && styles.btnDisabled]} onPress={handleStep2} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Завърши</Text>}
              </Pressable>
            </View>
          </>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>Вече имате акаунт? </Text>
          <Link href="/(auth)/login" asChild>
            <Pressable>
              <Text style={styles.footerLink}>Влезте</Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({
  label, value, onChange, placeholder, keyboard, secure,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  keyboard?: 'email-address' | 'numeric';
  secure?: boolean;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={C.muted}
        keyboardType={keyboard ?? 'default'}
        secureTextEntry={secure}
        autoCapitalize={keyboard === 'email-address' ? 'none' : 'words'}
        autoCorrect={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bg,
  },
  scroll: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 60,
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    gap: 8,
  },
  logoIcon: { fontSize: 26 },
  logoText: {
    fontSize: 26,
    fontWeight: '800',
    color: C.text,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 8,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: C.border,
  },
  stepActive: {
    backgroundColor: C.primary,
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: C.border,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: C.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: C.muted,
    textAlign: 'center',
    marginBottom: 24,
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
  goalRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
    marginTop: 6,
  },
  goalBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: R.md,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: C.card,
  },
  goalActive: {
    borderColor: C.primary,
    backgroundColor: C.primary + '22',
  },
  goalText: {
    fontSize: 12,
    color: C.muted,
    fontWeight: '600',
  },
  goalTextActive: {
    color: C.primary,
  },
  rowBtns: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  backBtn: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: R.md,
    paddingVertical: 15,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  backBtnText: {
    color: C.muted,
    fontSize: 14,
    fontWeight: '600',
  },
  btn: {
    backgroundColor: C.primary,
    borderRadius: R.md,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 24,
  },
  btnFlex: {
    flex: 1,
    marginBottom: 0,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  btnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
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
  successBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  successEmoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: C.text,
    marginBottom: 10,
  },
  successSub: {
    fontSize: 14,
    color: C.muted,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
});
