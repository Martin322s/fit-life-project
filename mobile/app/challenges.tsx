import React, { useCallback, useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Pressable,
  ActivityIndicator, RefreshControl, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackHeader } from '@/src/components/BackHeader';
import { Card } from '@/src/components/Card';
import { C, R } from '@/src/theme';
import { useAuth } from '@/src/context/AuthContext';
import { challengesApi, userChallengesApi, type ApiChallenge, type ApiUserChallenge } from '@/src/services/contentApi';

export default function Challenges() {
  const { user } = useAuth();

  const [available, setAvailable]       = useState<ApiChallenge[]>([]);
  const [userChallenges, setUserChallenges] = useState<ApiUserChallenge[]>([]);
  const [loading, setLoading]           = useState(true);
  const [refreshing, setRefreshing]     = useState(false);
  const [joiningId, setJoiningId]       = useState<string | null>(null);
  const [abandoningId, setAbandoningId] = useState<string | null>(null);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [ch, uc] = await Promise.all([
        challengesApi.list({ limit: 30 }),
        userChallengesApi.list(),
      ]);
      setAvailable(ch.items);
      const uid = user?.id;
      setUserChallenges(uid ? uc.items.filter(x => x.userId === uid) : uc.items);
    } catch {}
    finally { setLoading(false); setRefreshing(false); }
  }, [user?.id]);

  useEffect(() => { load(); }, [load]);

  const onRefresh = () => { setRefreshing(true); load(true); };

  const activeUserChallenges = userChallenges.filter(uc => uc.status === 'active');
  const joinedIds = new Set(userChallenges.map(uc => uc.challengeId));
  const notJoined = available.filter(c => !joinedIds.has(c.id));

  const handleJoin = async (challenge: ApiChallenge) => {
    setJoiningId(challenge.id);
    try {
      await userChallengesApi.join(challenge.id);
      await load(true);
    } catch (err) {
      Alert.alert('Грешка', err instanceof Error ? err.message : 'Грешка при присъединяване.');
    } finally {
      setJoiningId(null);
    }
  };

  const handleAbandon = (uc: ApiUserChallenge) => {
    Alert.alert('Изостави', `Изоставяне на "${uc.challenge.title}"?`, [
      { text: 'Отказ', style: 'cancel' },
      {
        text: 'Изостави',
        style: 'destructive',
        onPress: async () => {
          setAbandoningId(uc.id);
          try { await userChallengesApi.abandon(uc.id); await load(true); }
          catch {}
          finally { setAbandoningId(null); }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        <View style={styles.center}><ActivityIndicator color={C.primary} size="large" /></View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <BackHeader title="Предизвикателства" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.primary} />}
      >
        {/* Active challenges */}
        {activeUserChallenges.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Активни ({activeUserChallenges.length})</Text>
            {activeUserChallenges.map(uc => (
              <Card key={uc.id} style={[styles.card, styles.activeCard]}>
                <View style={styles.cardHeader}>
                  <View style={styles.info}>
                    <Text style={styles.tag}>АКТИВНО</Text>
                    <Text style={styles.title}>{uc.challenge.title}</Text>
                    {uc.challenge.description ? <Text style={styles.desc}>{uc.challenge.description}</Text> : null}
                  </View>
                </View>
                {uc.challenge.targetValue != null && (
                  <>
                    <View style={styles.progressRow}>
                      <Text style={styles.progressLabel}>Прогрес: {uc.progressValue} / {uc.challenge.targetValue} {uc.challenge.targetUnit ?? ''}</Text>
                      <Text style={styles.progressPct}>{Math.round((uc.progressValue / uc.challenge.targetValue) * 100)}%</Text>
                    </View>
                    <View style={styles.progressTrack}>
                      <View style={[styles.progressFill, { width: `${Math.min(100, (uc.progressValue / uc.challenge.targetValue) * 100)}%` as any }]} />
                    </View>
                  </>
                )}
                <View style={styles.actions}>
                  <Pressable
                    style={[styles.abandonBtn, abandoningId === uc.id && styles.btnDisabled]}
                    onPress={() => handleAbandon(uc)}
                    disabled={abandoningId === uc.id}
                  >
                    <Text style={styles.abandonBtnText}>{abandoningId === uc.id ? '…' : 'Изостави'}</Text>
                  </Pressable>
                </View>
              </Card>
            ))}
          </>
        )}

        {/* Available challenges */}
        {notJoined.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Налични ({notJoined.length})</Text>
            {notJoined.map(ch => (
              <Card key={ch.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.info}>
                    {ch.category   ? <Text style={styles.tag}>{ch.category}</Text>           : null}
                    <Text style={styles.title}>{ch.title}</Text>
                    {ch.description ? <Text style={styles.desc}>{ch.description}</Text>      : null}
                    <View style={styles.metaRow}>
                      {ch.difficulty  ? <Text style={styles.meta}>{ch.difficulty}</Text>     : null}
                      {ch.durationDays ? <Text style={styles.meta}>📅 {ch.durationDays} дни</Text> : null}
                      {ch.reward      ? <Text style={styles.meta}>🏅 {ch.reward}</Text>     : null}
                    </View>
                  </View>
                </View>
                <Pressable
                  style={[styles.joinBtn, joiningId === ch.id && styles.btnDisabled]}
                  onPress={() => handleJoin(ch)}
                  disabled={joiningId === ch.id}
                >
                  <Text style={styles.joinBtnText}>
                    {joiningId === ch.id ? 'Присъединяване…' : 'Присъедини се'}
                  </Text>
                </Pressable>
              </Card>
            ))}
          </>
        )}

        {available.length === 0 && userChallenges.length === 0 && (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyEmoji}>🏆</Text>
            <Text style={styles.emptyText}>Няма налични предизвикателства</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { padding: 16, paddingBottom: 32 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: C.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10, marginTop: 4 },
  card: { marginBottom: 12 },
  activeCard: { borderWidth: 1, borderColor: C.primary + '55' },
  cardHeader: { marginBottom: 10 },
  info: {},
  tag: { fontSize: 11, fontWeight: '700', color: C.primary, marginBottom: 4, textTransform: 'uppercase' },
  title: { fontSize: 15, fontWeight: '700', color: C.text, marginBottom: 4 },
  desc: { fontSize: 13, color: C.muted, lineHeight: 18, marginBottom: 6 },
  metaRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  meta: { fontSize: 12, color: C.muted },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressLabel: { fontSize: 13, color: C.muted },
  progressPct: { fontSize: 13, color: C.primary, fontWeight: '700' },
  progressTrack: { height: 6, backgroundColor: C.border, borderRadius: R.full, overflow: 'hidden', marginBottom: 12 },
  progressFill: { height: '100%', backgroundColor: C.primary, borderRadius: R.full },
  actions: { flexDirection: 'row', justifyContent: 'flex-end' },
  joinBtn: { backgroundColor: C.primary, borderRadius: R.md, paddingVertical: 10, paddingHorizontal: 20, alignItems: 'center' },
  joinBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  abandonBtn: { borderWidth: 1, borderColor: C.red + '55', borderRadius: R.md, paddingVertical: 8, paddingHorizontal: 16 },
  abandonBtnText: { color: C.red, fontSize: 13, fontWeight: '600' },
  btnDisabled: { opacity: 0.5 },
  emptyBox: { alignItems: 'center', paddingVertical: 48 },
  emptyEmoji: { fontSize: 36, marginBottom: 10 },
  emptyText: { fontSize: 14, color: C.muted, textAlign: 'center' },
});
