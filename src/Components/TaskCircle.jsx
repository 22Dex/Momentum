import { StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { COLORS, FONTS, SPACING } from "../theme/Themes";

export default function TaskCircle({ completedTasks, totalTasks }) {
  const progress =
    totalTasks === 0 ? 0 : Math.min(completedTasks / totalTasks, 1);
  const radius = 165;
  const strokeWidth = 18;
  const centerX = 195;
  const centerY = 200;
  const arcLength = Math.PI * radius;
  const strokeDashoffset = arcLength - progress * arcLength;
  const arcPath = `M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY}`;

  return (
    <View style={styles.circleContainer}>
      <View style={styles.gaugeContainer}>
        <Svg width={390} height={240} viewBox="0 0 390 240">
          <Path
            d={arcPath}
            stroke={COLORS.cardBorder}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
          />

          <Path
            d={arcPath}
            stroke={COLORS.primary}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={`${arcLength} ${arcLength}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </Svg>

        <View style={styles.gaugeText}>
          <Text style={styles.circleNumber}>{Math.round(progress * 100)}%</Text>
          <Text style={styles.circleLabel}>
            {completedTasks}/{totalTasks}
          </Text>
        </View>
      </View>

      <Text style={styles.circleCaption}>
        {completedTasks === totalTasks && totalTasks > 0
          ? "🎉 All done!"
          : `${totalTasks - completedTasks} tasks left`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circleContainer: {
    alignItems: "center",
    marginVertical: SPACING.lg,
  },

  gaugeContainer: {
    width: "100%",
    height: 240,
    justifyContent: "center",
    alignItems: "center",
  },

  gaugeText: {
    position: "absolute",
    top: 84,
    left: "50%",
    width: 180,
    marginLeft: -90,
    alignItems: "center",
    justifyContent: "center",
  },

  circleNumber: {
    fontSize: 26,
    color: COLORS.textPrimary,
    fontWeight: "700",
    textAlign: "center",
  },

  circleLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 4,
  },

  circleCaption: {
    marginTop: SPACING.sm,
    color: COLORS.textSecondary,
    fontSize: FONTS.sm,
  },
});
