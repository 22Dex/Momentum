import { NativeTabs } from 'expo-router/unstable-native-tabs';
import FloatingMenu from '../../Components/FloatMenu';
import { View } from 'react-native';

export default function Layout() {
  return (
    <View style={{ flex: 1 }}>
      <NativeTabs>
        <NativeTabs.Trigger name="index">
          <NativeTabs.Trigger.Icon sf="house.fill" md="home" />
          <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="DetailedOverviewScreen">
          <NativeTabs.Trigger.Icon sf="calendar" md="calendar_month" />
          <NativeTabs.Trigger.Label>Calendar</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="ProgressScreen">
          <NativeTabs.Trigger.Icon sf="checkmark.circle.fill" md="check_circle" />
          <NativeTabs.Trigger.Label>Habits</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="More">
          <NativeTabs.Trigger.Icon sf="moon.stars.fill" md="bedtime" />
          <NativeTabs.Trigger.Label>Reflect</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
      </NativeTabs>

      <View style={{ position: 'absolute', right: 0, top: 60 }}>
        <FloatingMenu />
      </View>
    </View>
  );
}