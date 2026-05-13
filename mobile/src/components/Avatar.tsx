import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { C } from '@/src/theme';

type AvatarProps = {
  avatarUrl?: string | null;
  initials: string;
  size?: number;
  /** Override border-radius. Defaults to size/2 (circle). */
  borderRadius?: number;
};

/**
 * Shows a profile image when available, otherwise falls back to an
 * initials circle. Passing `key={avatarUrl}` from the parent forces
 * React Native to bust its image cache whenever the URL changes.
 */
export function Avatar({ avatarUrl, initials, size = 44, borderRadius }: AvatarProps) {
  const r = borderRadius ?? size / 2;
  const sharedStyle = { width: size, height: size, borderRadius: r };

  if (avatarUrl) {
    return (
      <Image
        key={avatarUrl}
        source={{ uri: avatarUrl }}
        style={sharedStyle}
      />
    );
  }

  return (
    <View style={[styles.placeholder, sharedStyle]}>
      <Text style={[styles.text, { fontSize: Math.round(size * 0.34) }]}>
        {initials}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: C.primary + '33',
    borderWidth: 2,
    borderColor: C.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontWeight: '700',
    color: C.primary,
  },
});
