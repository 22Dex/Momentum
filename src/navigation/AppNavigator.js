// ============================================================
// NAVIGATION — Bottom tab bar that connects all screens
//
// HOW REACT NAVIGATION WORKS:
// 1. You install it (see App.js for install commands)
// 2. You create a "Navigator" — think of it as the container
// 3. Inside it, you add "Screens" — each screen = one tab
// 4. The user taps tabs to move between screens
//
// THE 4 TABS:
//  🏠 Overview      → OverviewScreen (daily habits + tasks)
//  📊 Detailed      → DetailedOverviewScreen (7-day calendar + stats)
//  ⚡ Progress      → ProgressScreen (goals + XP tracker)
//  🛠 Tools         → ToolsScreen (journal + focus + weekly review)
// ============================================================

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';

// Import all four screens
import OverviewScreen from '../screens/OverviewScreen';
import DetailedOverviewScreen from '../screens/DetailedOverviewScreen';
import ProgressScreen from '../screens/ProgressScreen';
import ToolsScreen from '../screens/ToolsScreen';

import { COLORS, FONTS, SPACING, RADIUS } from '../theme';

// Create the tab navigator
const Tab = createBottomTabNavigator();

// ---- Tab icon component ----
// SPLIT INTO: <TabIcon emoji={} label={} focused={} /> later
function TabIcon({ emoji, label, focused }) {
  return (
    <View style={{ alignItems: 'center', paddingTop: 4 }}>
      <Text style={{ fontSize: 20 }}>{emoji}</Text>
      <Text
        style={{
          fontSize: FONTS.xs,
          color: focused ? COLORS.primary : COLORS.textMuted,
          marginTop: 2,
          fontWeight: focused ? '600' : '400',
        }}
      >
        {label}
      </Text>
    </View>
  );
}

// ============================================================
// MAIN NAVIGATOR COMPONENT
// ============================================================
export default function AppNavigator() {
  return (
    <Tab.Navigator
      // Hide the default tab bar labels (we draw our own in TabIcon)
      screenOptions={{
        headerShown: false,          // No top header bar
        tabBarShowLabel: false,      // Hide default labels
        tabBarStyle: {
          backgroundColor: COLORS.card,
          borderTopColor: COLORS.cardBorder,
          borderTopWidth: 1,
          height: 70,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
      }}
    >
      {/* TAB 1: Overview (Daily Planner) */}
      <Tab.Screen
        name="Overview"
        component={OverviewScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🏠" label="Today" focused={focused} />
          ),
        }}
      />

      {/* TAB 2: Detailed Overview */}
      <Tab.Screen
        name="Detailed"
        component={DetailedOverviewScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="📊" label="Details" focused={focused} />
          ),
        }}
      />

      {/* TAB 3: Progress / Goals / XP */}
      <Tab.Screen
        name="Progress"
        component={ProgressScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="⚡" label="Progress" focused={focused} />
          ),
        }}
      />

      {/* TAB 4: Tools (Journal, Focus, Review) */}
      <Tab.Screen
        name="Tools"
        component={ToolsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🛠" label="Tools" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
