import React, { useCallback, useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Pressable, TextInput, ActivityIndicator, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { BackHeader } from '@/src/components/BackHeader';
import { Card } from '@/src/components/Card';
import { C, R } from '@/src/theme';
import { profileApi, type ApiProfile, type ProfileGoalType, type ProfileActivityLevel } from '@/src/services/profileApi';

const GOALS: { value: ProfileGoalType; label: string }[] = [
  { value: 'lose_weight', label: 'Отслабване' },
  { value: 'maintain',    label: 'Поддържане' },
  { value: 'gain_weight', label: 'Качване'    },
];

const ACTIVITIES: { value: ProfileActivityLevel; label: string }[] = [
  { value: 'sedentary', label: 'Заседнал'          },
  { value: 'light',     label: 'Лека активност'    },
  { value: 'moderate',  label: 'Умерена активност' },
  { value: 'very',      label: 'Много активен'     },
];

type Genders = 'male' | 'female';

export default function Profile() {
  const [profile, setProfile] = useState<ApiProfile | null>(null);
  const [loading, setLoading]         = useState(true);
  const [saving, setSaving]           = useState(false);
  const [saved, setSaved]             = useState(false);
  const [error, setError]             = useState('');
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError]         = useState('');

  // Editable form state
  const [firstName, setFirstName]   = useState('');
  const [lastName, setLastName]     = useState('');
  const [age, setAge]               = useState('');
  const [gender, setGender]         = useState<Genders | ''>('');
  const [heightCm, setHeightCm]     = useState('');
  const [goalWeight, setGoalWeight] = useState('');
  const [goalType, setGoalType]     = useState<ProfileGoalType | null>(null);
  const [activity, setActivity]     = useState<ProfileActivityLevel | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { profile: p } = await profileApi.get();
      setProfile(p);
      setFirstName(p.firstName);
      setLastName(p.lastName);
      setAge(p.age != null ? String(p.age) : '');
      setGender((p.gender ?? '') as Genders | '');
      setHeightCm(p.heightCm != null ? String(p.heightCm) : '');
      setGoalWeight(p.goalWeight != null ? String(p.goalWeight) : '');
      setGoalType(p.goalType ?? null);
      setActivity(p.activityLevel ?? null);
    } catch {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const bmi = profile?.currentWeight && heightCm
    ? +(profile.currentWeight / ((Number(heightCm) / 100) ** 2)).toFixed(1)
    : null;

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    setError('');
    try {
      await profileApi.update({
        firstName: firstName.trim() || undefined,
        lastName:  lastName.trim()  || undefined,
        gender: gender ? (gender as 'male' | 'female') : null,
        age:        age        ? Number(age)        : null,
        heightCm:   heightCm   ? Number(heightCm)   : null,
        goalWeight: goalWeight ? Number(goalWeight) : null,
        goalType:   goalType   ?? null,
        activityLevel: activity ?? null,
      });
      setSaved(true);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Грешка. Опитайте отново.');
    } finally {
      setSaving(false);
    }
  };

  const handlePickAvatar = async () => {
    setAvatarError('');
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      setAvatarError('Нужен е достъп до галерията за избор на снимка.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });
    if (result.canceled || !result.assets?.[0]) return;

    const asset = result.assets[0];
    setAvatarUploading(true);
    try {
      const { profile: updated } = await profileApi.uploadAvatar(
        asset.uri,
        asset.mimeType ?? 'image/jpeg',
      );
      setProfile(updated);
    } catch (err) {
      setAvatarError(err instanceof Error ? err.message : 'Грешка при качване.');
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    setAvatarError('');
    setAvatarUploading(true);
    try {
      const { profile: updated } = await profileApi.deleteAvatar();
      setProfile(updated);
    } catch (err) {
      setAvatarError(err instanceof Error ? err.message : 'Грешка при премахване.');
    } finally {
      setAvatarUploading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        <View style={styles.center}><ActivityIndicator color={C.primary} size="large" /></View>
      </SafeAreaView>
    );
  }

  const initials = profile
    ? `${profile.firstName[0] ?? ''}${profile.lastName[0] ?? ''}`.toUpperCase()
    : '?';

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <BackHeader
        title="Профил"
        action={{
          label: saving ? '…' : saved ? '✓ Запазен' : 'Запази',
          onPress: handleSave,
        }}
      />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {error ? <Text style={styles.error}>{error}</Text> : null}

        {/* Avatar */}
        <Card style={styles.avatarCard}>
          <Text style={styles.sectionTitle}>Аватар</Text>
          <View style={styles.avatarRow}>
            {profile?.avatarUrl
              ? <Image source={{ uri: profile.avatarUrl }} style={styles.avatar} />
              : (
                <View style={[styles.avatar, styles.avatarPlaceholder]}>
                  <Text style={styles.avatarInitials}>{initials}</Text>
                </View>
              )
            }
            <View style={styles.avatarActions}>
              <Pressable
                style={[styles.avatarBtn, avatarUploading && styles.btnDisabled]}
                onPress={handlePickAvatar}
                disabled={avatarUploading}
              >
                {avatarUploading
                  ? <ActivityIndicator color={C.primary} size="small" />
                  : <Text style={styles.avatarBtnText}>📷 Избери снимка</Text>
                }
              </Pressable>
              {profile?.avatarUrl && !avatarUploading && (
                <Pressable style={styles.removeBtn} onPress={handleRemoveAvatar}>
                  <Text style={styles.removeBtnText}>Премахни</Text>
                </Pressable>
              )}
            </View>
          </View>
          {avatarError ? <Text style={styles.avatarErr}>{avatarError}</Text> : null}
        </Card>

        {/* Stats */}
        {bmi || profile?.currentWeight ? (
          <Card style={styles.statsCard}>
            {profile?.currentWeight && (
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Текущо тегло</Text>
                <Text style={styles.statVal}>{profile.currentWeight} кг</Text>
              </View>
            )}
            {bmi && (
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>ИТМ</Text>
                <Text style={[styles.statVal, { color: bmi < 25 ? C.green : bmi < 30 ? C.amber : C.red }]}>{bmi}</Text>
              </View>
            )}
            {goalWeight && (
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Целево тегло</Text>
                <Text style={styles.statVal}>{goalWeight} кг</Text>
              </View>
            )}
          </Card>
        ) : null}

        {/* Personal info */}
        <Card>
          <Text style={styles.sectionTitle}>Лична информация</Text>
          <Field label="Собствено Иiе" value={firstName} onChangeText={v => { setFirstName(v); setSaved(false); }} placeholder="Иван" />
          <Field label="Фамилия"       value={lastName}  onChangeText={v => { setLastName(v);  setSaved(false); }} placeholder="Петров" />
          <Field label="Възраст"       value={age}       onChangeText={v => { setAge(v);       setSaved(false); }} placeholder="30" keyboardType="numeric" />

          <Text style={styles.fieldLabel}>Пол</Text>
          <View style={styles.chipRow}>
            {(['male', 'female'] as const).map(g => (
              <Pressable key={g} style={[styles.chip, gender === g && styles.chipActive]} onPress={() => { setGender(g); setSaved(false); }}>
                <Text style={[styles.chipText, gender === g && styles.chipTextActive]}>
                  {g === 'male' ? 'Мъж' : 'Жена'}
                </Text>
              </Pressable>
            ))}
          </View>
        </Card>

        {/* Body stats */}
        <Card>
          <Text style={styles.sectionTitle}>Физически данни</Text>
          <Field label="Ръст (см)"         value={heightCm}   onChangeText={v => { setHeightCm(v);   setSaved(false); }} placeholder="175" keyboardType="numeric" />
          <Field label="Целево тегло (кг)" value={goalWeight} onChangeText={v => { setGoalWeight(v); setSaved(false); }} placeholder="70"  keyboardType="numeric" />
        </Card>

        {/* Goals */}
        <Card>
          <Text style={styles.sectionTitle}>Цел</Text>
          <View style={styles.chipRow}>
            {GOALS.map(g => (
              <Pressable key={g.value} style={[styles.chip, goalType === g.value && styles.chipActive]} onPress={() => { setGoalType(g.value); setSaved(false); }}>
                <Text style={[styles.chipText, goalType === g.value && styles.chipTextActive]}>{g.label}</Text>
              </Pressable>
            ))}
          </View>
        </Card>

        {/* Activity */}
        <Card>
          <Text style={styles.sectionTitle}>Ниво на активност</Text>
          <View style={styles.chipRow}>
            {ACTIVITIES.map(a => (
              <Pressable key={a.value} style={[styles.chip, activity === a.value && styles.chipActive]} onPress={() => { setActivity(a.value); setSaved(false); }}>
                <Text style={[styles.chipText, activity === a.value && styles.chipTextActive]}>{a.label}</Text>
              </Pressable>
            ))}
          </View>
        </Card>

        <Pressable style={[styles.saveBtn, saving && styles.btnDisabled]} onPress={handleSave} disabled={saving}>
          {saving
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.saveBtnText}>{saved ? '✓ Запазен' : 'Запази промените'}</Text>
          }
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function Field({ label, ...props }: { label: string } & React.ComponentProps<typeof TextInput>) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput style={styles.input} placeholderTextColor={C.muted} {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  root:               { flex: 1, backgroundColor: C.bg },
  scroll:             { padding: 16, paddingBottom: 40 },
  center:             { flex: 1, justifyContent: 'center', alignItems: 'center' },
  error:              { color: C.red, fontSize: 13, marginBottom: 12, backgroundColor: C.red + '18', borderRadius: R.md, padding: 10 },
  statsCard:          { marginBottom: 16 },
  statRow:            { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  statLabel:          { fontSize: 13, color: C.muted },
  statVal:            { fontSize: 13, fontWeight: '700', color: C.text },
  sectionTitle:       { fontSize: 14, fontWeight: '700', color: C.text, marginBottom: 12 },
  field:              { marginBottom: 12 },
  fieldLabel:         { fontSize: 13, color: C.muted, marginBottom: 5, fontWeight: '600' },
  input:              { backgroundColor: C.bg, borderWidth: 1, borderColor: C.border, borderRadius: R.md, paddingHorizontal: 14, paddingVertical: 11, fontSize: 14, color: C.text },
  chipRow:            { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  chip:               { borderWidth: 1, borderColor: C.border, borderRadius: R.full, paddingHorizontal: 14, paddingVertical: 7, backgroundColor: C.card },
  chipActive:         { borderColor: C.primary, backgroundColor: C.primary + '22' },
  chipText:           { fontSize: 13, color: C.muted, fontWeight: '500' },
  chipTextActive:     { color: C.primary, fontWeight: '700' },
  saveBtn:            { backgroundColor: C.primary, borderRadius: R.md, paddingVertical: 15, alignItems: 'center', marginTop: 8 },
  btnDisabled:        { opacity: 0.6 },
  saveBtnText:        { color: '#fff', fontSize: 15, fontWeight: '700' },
  // Avatar
  avatarCard:         { marginBottom: 16 },
  avatarRow:          { flexDirection: 'row', alignItems: 'center', gap: 16 },
  avatar:             { width: 72, height: 72, borderRadius: 16 },
  avatarPlaceholder:  { backgroundColor: C.primary + '33', alignItems: 'center', justifyContent: 'center' },
  avatarInitials:     { color: C.primary, fontSize: 24, fontWeight: '800' },
  avatarActions:      { flex: 1, gap: 8 },
  avatarBtn:          { borderWidth: 1, borderColor: C.border, borderRadius: R.md, paddingHorizontal: 14, paddingVertical: 9, alignItems: 'center' },
  avatarBtnText:      { fontSize: 13, color: C.text, fontWeight: '600' },
  removeBtn:          { paddingHorizontal: 14, paddingVertical: 6, alignItems: 'center' },
  removeBtnText:      { fontSize: 12, color: C.red, fontWeight: '600' },
  avatarErr:          { color: C.red, fontSize: 12, marginTop: 8 },
});
