import { Tabs } from 'expo-router';
import { COLORS } from '../theme';
import { AppProvider } from '../hooks/useAppState';

export default function Layout() {
  return (
    <AppProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.primaryLight,
          tabBarStyle: { backgroundColor: COLORS.background },
        }}
      >
        <Tabs.Screen name="index" options={{ title: 'Home' }} />
        <Tabs.Screen name="DetailedOverviewScreen" options={{ title: 'Calendar' }} />
        <Tabs.Screen name="ProgressScreen" options={{ title: 'Habits' }} />
        <Tabs.Screen name="More" options={{ title: 'More' }} />
      </Tabs>
    </AppProvider>
  );
}