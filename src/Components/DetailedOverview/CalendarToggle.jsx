import { Text, TouchableOpacity, View } from "react-native";
import { COLORS, FONTS, RADIUS, SPACING } from "../../theme/Themes";

const CalendarToggle = ({ calendarMode, setCalendarMode }) => {
  return (
    <View style={styles.toggleContainer}>
      <TouchableOpacity
        style={[
          styles.toggleBtn,
          calendarMode === "week" && styles.toggleBtnActive,
        ]}
        onPress={() => setCalendarMode("week")}
      >
        <Text
          style={[
            styles.toggleBtnText,
            calendarMode === "week" && styles.toggleBtnTextActive,
          ]}
        >
          Week
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.toggleBtn,
          calendarMode === "month" && styles.toggleBtnActive,
        ]}
        onPress={() => setCalendarMode("month")}
      >
        <Text
          style={[
            styles.toggleBtnText,
            calendarMode === "month" && styles.toggleBtnTextActive,
          ]}
        >
          Month
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.full,
    padding: 4,
    marginBottom: SPACING.md,
    alignSelf: "center",
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  toggleBtn: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    minWidth: 98,
    alignItems: "center",
  },
  toggleBtnActive: {
    backgroundColor: COLORS.cardBorder,
  },
  toggleBtnText: {
    fontSize: FONTS.sm,
    color: COLORS.textMuted,
    fontWeight: "600",
  },
  toggleBtnTextActive: {
    color: COLORS.textPrimary,
    fontWeight: "700",
  },
};

export default CalendarToggle;
