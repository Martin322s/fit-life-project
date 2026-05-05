import { View, ActivityIndicator } from 'react-native';
import { C } from '@/src/theme';

// The Guard component in _layout.tsx handles all routing.
// This screen shows a spinner while the auth state loads.
export default function Index() {
  return (
    <View style={{ flex: 1, backgroundColor: C.bg, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator color={C.primary} size="large" />
    </View>
  );
}
