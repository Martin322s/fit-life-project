import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '@/src/context/AuthContext';

// ─── Route guard ──────────────────────────────────────────────────────────────
// Runs after every auth-state change. Redirects:
//   - Unauthenticated users away from app tabs → login
//   - Authenticated users away from auth screens → dashboard

function Guard() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuth = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuth) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuth) {
      router.replace('/(tabs)/dashboard');
    }
  }, [isAuthenticated, isLoading, router, segments]);

  return null;
}

// ─── Root layout ──────────────────────────────────────────────────────────────

export default function RootLayout() {
  return (
    <AuthProvider>
      <Guard />
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style="light" />
    </AuthProvider>
  );
}
