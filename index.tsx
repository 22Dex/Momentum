import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "react-native";

import { AppProvider } from "./src/hooks/useAppState";
import { COLORS } from "./src/theme/Themes";

// Import your screen components
import progress from "./src/app/DetailedOverviewScreen";
import More from "./src/app/(tabs)/More";
import Habits from "./src/app/ProgressScreen";

const Tab = createBottomTabNavigator();

export default function Index() {
  return (
    <AppProvider>
      <NavigationContainer>
        <StatusBar
          barStyle="light-content"
          backgroundColor={COLORS.background}
        />
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: { backgroundColor: COLORS.background },
            tabBarActiveTintColor: COLORS.primary,
            tabBarInactiveTintColor: COLORS.gray,
          }}
        >
          <Tab.Screen name="Calendar" component={progress} />
          <Tab.Screen name="Habit" component={Habits} />
          <Tab.Screen name="More" component={More} />
        </Tab.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}
