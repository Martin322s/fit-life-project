import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackHeader } from '@/src/components/BackHeader';
import { Card } from '@/src/components/Card';
import { C, R } from '@/src/theme';
import { activeChallenges, upcomingChallenges, leaderboard } from '@/src/data/challengesData';

export default function Challenges() {
  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <BackHeader title="Предизвикателства" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Active Challenges */}
        <Text style={styles.section}>🔥 Активни предизвикателства</Text>
        {activeChallenges.map(ch => {
          const pct = Math.round((ch.progress / ch.total) * 100);
          return (
            <Card key={ch.id} style={styles.challengeCard}>
              <View style={styles.challengeHeader}>
                <Text style={styles.challengeIcon}>{ch.icon}</Text>
                <View style={styles.challengeInfo}>
                  <Text style={styles.challengeName}>{ch.name}</Text>
                  <Text style={styles.challengeDesc}>{ch.desc}</Text>
                </View>
              </View>
              <View style={styles.challengeProgress}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressLabel}>
                    {ch.progress} / {ch.total} дни
                  </Text>
                  <Text style={[styles.progressPct, { color: C.green }]}>{pct}%</Text>
                </View>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${pct}%` as any, backgroundColor: C.green }]} />
                </View>
              </View>
              <View style={styles.challengeFooter}>
                <Text style={styles.challengeReward}>🏅 Награда: {ch.reward}</Text>
                <Text style={styles.challengeDays}>⏳ {ch.daysLeft} дни остават</Text>
              </View>
            </Card>
          );
        })}

        {/* Upcoming */}
        <Text style={styles.section}>📅 Предстоящи предизвикателства</Text>
        {upcomingChallenges.map(ch => (
          <Card key={ch.id} style={styles.upcomingCard}>
            <View style={styles.upcomingHeader}>
              <Text style={styles.challengeIcon}>{ch.icon}</Text>
              <View style={styles.challengeInfo}>
                <Text style={styles.challengeName}>{ch.name}</Text>
                <Text style={styles.challengeDesc}>{ch.desc}</Text>
              </View>
            </View>
            <View style={styles.upcomingFooter}>
              <View style={styles.upcomingMeta}>
                <Text style={styles.upcomingDate}>📆 {ch.startDate}</Text>
                <Text style={styles.upcomingParticipants}>👥 {ch.participants} участника</Text>
              </View>
              <Pressable style={styles.joinBtn}>
                <Text style={styles.joinBtnText}>Запиши се</Text>
              </Pressable>
            </View>
            <Text style={styles.challengeReward}>🏅 Награда: {ch.reward}</Text>
          </Card>
        ))}

        {/* Leaderboard */}
        <Text style={styles.section}>🏆 Класация</Text>
        <Card>
          {leaderboard.map(entry => (
            <View
              key={entry.rank}
              style={[styles.leaderRow, entry.isMe && styles.leaderRowMe]}
            >
              <Text style={[styles.leaderRank, entry.rank <= 3 && { color: C.amber }]}>
                {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`}
              </Text>
              <View style={styles.leaderAvatar}>
                <Text style={styles.leaderAvatarText}>{entry.avatar}</Text>
              </View>
              <Text style={[styles.leaderName, entry.isMe && { color: C.primary, fontWeight: '700' }]}>
                {entry.name}{entry.isMe ? ' (Аз)' : ''}
              </Text>
              <Text style={styles.leaderPoints}>{entry.points.toLocaleString()} т.</Text>
            </View>
          ))}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { padding: 16, paddingBottom: 32 },
  section: { fontSize: 15, fontWeight: '700', color: C.text, marginBottom: 12, marginTop: 4 },
  challengeCard: { marginBottom: 12 },
  challengeHeader: { flexDirection: 'row', gap: 12, marginBottom: 14, alignItems: 'flex-start' },
  challengeIcon: { fontSize: 28 },
  challengeInfo: { flex: 1 },
  challengeName: { fontSize: 15, fontWeight: '700', color: C.text, marginBottom: 3 },
  challengeDesc: { fontSize: 13, color: C.muted, lineHeight: 18 },
  challengeProgress: { marginBottom: 12 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressLabel: { fontSize: 12, color: C.muted },
  progressPct: { fontSize: 12, fontWeight: '700' },
  progressTrack: { height: 8, backgroundColor: C.border, borderRadius: R.full, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: R.full },
  challengeFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  challengeReward: { fontSize: 12, color: C.amber, fontWeight: '600', marginTop: 8 },
  challengeDays: { fontSize: 12, color: C.muted },
  upcomingCard: { marginBottom: 12 },
  upcomingHeader: { flexDirection: 'row', gap: 12, marginBottom: 12, alignItems: 'flex-start' },
  upcomingFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  upcomingMeta: { gap: 4 },
  upcomingDate: { fontSize: 12, color: C.muted },
  upcomingParticipants: { fontSize: 12, color: C.muted },
  joinBtn: { backgroundColor: C.primary, borderRadius: R.md, paddingHorizontal: 16, paddingVertical: 8 },
  joinBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  leaderRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.border },
  leaderRowMe: { backgroundColor: C.primary + '0a', borderRadius: R.md, paddingHorizontal: 8, marginHorizontal: -8 },
  leaderRank: { fontSize: 16, width: 36, textAlign: 'center', color: C.muted, fontWeight: '700' },
  leaderAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: C.border, justifyContent: 'center', alignItems: 'center' },
  leaderAvatarText: { fontSize: 11, fontWeight: '700', color: C.muted },
  leaderName: { flex: 1, fontSize: 14, color: C.text },
  leaderPoints: { fontSize: 13, color: C.amber, fontWeight: '700' },
});
