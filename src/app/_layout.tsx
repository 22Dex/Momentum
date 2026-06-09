import { Tabs } from 'expo-router';
import { COLORS } from '../theme/Themes';
import { AppProvider } from '../hooks/useAppState';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native';

export default function Layout() {
  return (
    <AppProvider>
        <Tabs
        screenOptions={{
            headerShown: false,

            tabBarActiveTintColor: COLORS.primary,
            tabBarInactiveTintColor: COLORS.textMuted,

            tabBarStyle: styles.tabBarStyle,
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: '600',
            },
          }}
      >
        <Tabs.Screen 
        name="index" 
        options={{ title: 'Home' }} 
        />

        <Tabs.Screen 
        name="DetailedOverviewScreen" 
        options={{ title: 'Calendar' }} 
        />

        <Tabs.Screen 
        name="ProgressScreen" 
        options={{ title: 'Habits' }} 
        />

          <Tabs.Screen
          name="More"
          options={{
            title:'',
            tabBarIcon: ({ color }) => (
          <Text
            style={{
              color: COLORS.primary,
              fontSize: 32,
              fontWeight: '700',
            }}
          >
        +
      </Text>
    ),
          }}
          />

        
      </Tabs>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',

    bottom: 45,

    alignSelf: 'center',

    width: 70,
    height: 70,
    borderRadius: 35,

    backgroundColor: COLORS.primary,

    justifyContent: 'center',
    alignItems: 'center',

    borderWidth: 4,
    borderColor: COLORS.background,

    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,

    zIndex: 100,
  },

  fabText: {
    color: COLORS.textPrimary,
    fontSize: 34,
    fontWeight: '700',
  },

  menuContainer: {
    position: 'absolute',

    bottom: 130,

    alignSelf: 'center',
    alignItems: 'center',

    gap: 12,

    zIndex: 99,
  },

  menuItem: {
    minWidth: 160,

    backgroundColor: COLORS.card,

    borderWidth: 1,
    borderColor: COLORS.cardBorder,

    borderRadius: 16,

    paddingVertical: 14,
    paddingHorizontal: 20,

    alignItems: 'center',
  },

  menuText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },

  tabBarStyle: {
  position: 'absolute',

  left: 20,
  right: 20,
  bottom: 20,

  height: 65,

  borderRadius: 32,

  backgroundColor: COLORS.card,

  borderTopWidth: 0,

  elevation: 8,

  shadowColor: '#000',
  shadowOpacity: 0.15,
  shadowRadius: 12,

  paddingBottom: 8,
  paddingTop: 8,
},
});