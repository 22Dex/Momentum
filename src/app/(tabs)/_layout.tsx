import { NativeTabs } from "expo-router/unstable-native-tabs";
import { View } from "react-native";

const tabBarTheme = {
  backgroundColor: "#1B1815",
  tintColor: "#D7BA7D",
  iconColor: {
    default: "#9C907F",
    selected: "#F0D49B",
  },
};

export default function Layout() {
  return (
    <View style={{ flex: 1 }}>
      <NativeTabs
        backgroundColor={tabBarTheme.backgroundColor}
        tintColor={tabBarTheme.tintColor}
        iconColor={tabBarTheme.iconColor}
        blurEffect="dark"
      >
        <NativeTabs.Trigger name="index">
          <NativeTabs.Trigger.Icon sf="house.fill" md="home" />
          <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="DetailedOverviewScreen">
          <NativeTabs.Trigger.Icon sf="calendar" md="calendar_month" />
          <NativeTabs.Trigger.Label>Calendar</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="ProgressScreen">
          <NativeTabs.Trigger.Icon
            sf="checkmark.circle.fill"
            md="check_circle"
          />
          <NativeTabs.Trigger.Label>Habits</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="More">
          <NativeTabs.Trigger.Icon sf="cloud.fill" md="cloud" />
          <NativeTabs.Trigger.Label>Review</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="Tools">
          <NativeTabs.Trigger.Icon sf="sparkles" md="auto_awesome" />
          <NativeTabs.Trigger.Label>Tools</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
      </NativeTabs>
    </View>
  );
}
