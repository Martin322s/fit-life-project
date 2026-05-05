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
import { useAuth } from '@/src/context/AuthContext';
import { C, R } from '@/src/theme';

type Step = 1 | 2 | 'success';

const GOALS = [
  { value: 'lose' as const,     label: 'Отслабване' },
  { value: 'maintain' as const, label: 'Поддържане' },
  { value: 'gain' as const,     label: 'Качване' },
];

const ACTIVITIES = [
  { value: 'sedentary' as const, label: 'Заседнал' },
  { value: 'light' as const,    label: 'Лека активност' },
  { value: 'moderate' as const, label: 'Умерена активност' },
  { value: 'very' as const,     label: 'Много активен' },
];

export default function Register() {
  const router = useRouter();
  const { register } = useAuth();

  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1 fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName]   = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');

  // Step 2 fields
  const [weight, setWeight]       = useState('');
  const [height, setHeight]       = useState('');
  const [goalWeight, setGoalWeight] = useState('');
  const [goal, setGoal]           = useState<'lose' | 'maintain' | 'gain'>('lose');
  const [activity, setActivity]   = useState<'sedentary' | 'light' | 'moderate' | 'very'>('moderate');

  const handleStep1 = () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim() || password.length < 8) {
      setError('Попълнете всички полета. Паролата трябва да е поне 8 символа.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleStep2 = async () => {
    if (!weight || !height) {
      setError('Моля, въведете тегло и ръст.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        password,
        weight: parseFloat(weight),
        weightUnit: 'kg',
        height: parseFloat(height),
        heightUnit: 'cm',
        goal,
        activity,
      });
      setStep('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Грешка при регистрация.');
    } finally {
      setLoading(false);
    }
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

        <Text style={styles.stepLabel}>Стъпка {step} от 2</Text>
        <Text style={styles.title}>{step === 1 ? 'Създайте акаунт' : 'Физически данни'}</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {step === 1 && (
          <>
            <Field label="Собствено Иiе" value={firstName} onChangeText={setFirstName} placeholder="Иван" />
            <Field label="Фамилия" value={lastName} onChangeText={setLastName} placeholder="Петров" />
            <Field label="Email" value={email} onChangeText={setEmail} placeholder="your@email.com" keyboardType="email-address" autoCapitalize="none" />
            <Field label="Парола (мин. 8 символа)" value={password} onChangeText={setPassword} placeholder="••••••••" secureTextEntry />

            <Pressable style={styles.btn} onPress={handleStep1}>
              <Text style={styles.btnText}>Продължи →</Text>
            </Pressable>
          </>
        )}

        {step === 2 && (
          <>
            <Field label="Тегло (кг)" value={weight} onChangeText={setWeight} placeholder="75" keyboardType="decimal-pad" />
            <Field label="Ръст (см)" value={height} onChangeText={setHeight} placeholder="175" keyboardType="decimal-pad" />
            <Field label="Целево тегло (кг, по желание)" value={goalWeight} onChangeText={setGoalWeight} placeholder="70" keyboardType="decimal-pad" />

            <Text style={styles.groupLabel}>Цел</Text>
            <View style={styles.chipRow}>
              {GOALS.map(g => (
                <Pressable
                  key={g.value}
                  style={[styles.chip, goal === g.value && styles.chipActive]}
                  onPress={() => setGoal(g.value)}
                >
                  <Text style={[styles.chipText, goal === g.value && styles.chipTextActive]}>
                    {g.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.groupLabel}>Ниво на активност</Text>
            <View style={styles.chipRow}>
              {ACTIVITIES.map(a => (
                <Pressable
                  key={a.value}
                  style={[styles.chip, activity === a.value && styles.chipActive]}
                  onPress={() => setActivity(a.value)}
                >
                  <Text style={[styles.chipText, activity === a.value && styles.chipTextActive]}>
                    {a.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Pressable
              style={[styles.btn, loading && styles.btnDisabled]}
              onPress={handleStep2}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnText}>Завърши регистрацията</Text>
              )}
            </Pressable>

            <Pressable style={styles.back} onPress={() => { setError(''); setStep(1); }}>
              <Text style={styles.backText}>← Назад</Text>
            </Pressable>
          </>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>Имате акаунт? </Text>
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

function Field({ label, ...props }: { label: string } & React.ComponentProps<typeof TextInput>) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor={C.muted}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { flexGrow: 1, padding: 24, paddingTop: 48 },
  successBox: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  successEmoji: { fontSize: 48, marginBottom: 16 },
  successTitle: { fontSize: 24, fontWeight: '700', color: C.text, marginBottom: 8, textAlign: 'center' },
  successSub: { fontSize: 15, color: C.muted, textAlign: 'center', marginBottom: 32 },
  logo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 24, gap: 8 },
  logoIcon: { fontSize: 24 },
  logoText: { fontSize: 24, fontWeight: '800', color: C.text },
  stepLabel: { fontSize: 12, color: C.muted, textAlign: 'center', marginBottom: 4 },
  title: { fontSize: 22, fontWeight: '700', color: C.text, textAlign: 'center', marginBottom: 20 },
  error: { color: C.red, fontSize: 13, textAlign: 'center', marginBottom: 16, backgroundColor: C.red + '18', borderRadius: R.md, padding: 10 },
  field: { marginBottom: 14 },
  label: { fontSize: 13, color: C.muted, marginBottom: 6, fontWeight: '600' },
  input: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: R.md, paddingHorizontal: 14, paddingVertical: 13, fontSize: 15, color: C.text },
  groupLabel: { fontSize: 13, color: C.muted, fontWeight: '600', marginBottom: 8, marginTop: 4 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  chip: { borderWidth: 1, borderColor: C.border, borderRadius: R.full, paddingHorizontal: 14, paddingVertical: 8, backgroundColor: C.card },
  chipActive: { borderColor: C.primary, backgroundColor: C.primary + '22' },
  chipText: { fontSize: 13, color: C.muted, fontWeight: '500' },
  chipTextActive: { color: C.primary, fontWeight: '700' },
  btn: { backgroundColor: C.primary, borderRadius: R.md, paddingVertical: 15, alignItems: 'center', marginTop: 8, marginBottom: 12 },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  back: { alignItems: 'center', marginBottom: 16 },
  backText: { fontSize: 14, color: C.muted },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 8 },
  footerText: { fontSize: 14, color: C.muted },
  footerLink: { fontSize: 14, color: C.primary, fontWeight: '600' },
});
