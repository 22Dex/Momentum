import { Stack } from 'expo-router';
import { AppProvider } from '../hooks/useAppState';

export default function RootLayout() {
  return (
    <AppProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="Account" options={{ title: 'Account' }} />
        <Stack.Screen name="settings" options={{ title: 'Settings' }} />
      </Stack>
    </AppProvider>
  );
}