import { Text, View } from "react-native";

export default function OverviewHeader({
  dateLabel,
  quote,
  todayXP,
  dailyXPGoal,
  xpPercent,
  styles,
}) {
  return (
    <View style={styles.header}>
      <Text style={styles.dateLabel}>{dateLabel}</Text>
      <Text style={styles.greeting}>
        {quote.text} — {quote.author}
      </Text>
      <View style={styles.xpContainer}>
        <View style={styles.xpLabelRow}>
          <Text style={styles.xpLabel}>⚡ {todayXP} XP Today</Text>
          <Text style={styles.xpLabel}>{dailyXPGoal} XP goal</Text>
        </View>
        <View style={styles.xpBarBg}>
          <View style={[styles.xpBarFill, { width: `${xpPercent}%` }]} />
        </View>
      </View>
    </View>
  );
}
