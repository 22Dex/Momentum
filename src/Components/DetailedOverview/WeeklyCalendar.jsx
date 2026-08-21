import { Text, TouchableOpacity, View } from "react-native";
import { COLORS, FONTS, RADIUS, SPACING } from "../../theme/Themes";
import { getShortDayName, wasCompletedOn } from "../../utils/helpers";

const WeeklyCalendar = ({
  selectedDate,
  setSelectedDate,
  calendarMode,
  weekDates,
  today,
  habits,
}) => {
  return (
    calendarMode === "week" && (
      <View style={styles.weekStrip}>
        {weekDates.map((date) => {
          const isSelected = date === selectedDate;
          const isToday = date === today;
          const hasActivity = habits.some((h) => wasCompletedOn(h, date));

          return (
            <TouchableOpacity
              key={date}
              style={[
                styles.dayButton,
                isSelected && styles.dayButtonSelected,
                isToday && !isSelected && styles.dayButtonToday,
              ]}
              onPress={() => setSelectedDate(date)}
            >
              <Text
                style={[styles.dayName, isSelected && styles.dayTextSelected]}
              >
                {getShortDayName(date).charAt(0)}
              </Text>
              <Text
                style={[styles.dayNumber, isSelected && styles.dayTextSelected]}
              >
                {new Date(date).getDate()}
              </Text>
              {hasActivity && (
                <View
                  style={[
                    styles.activityDot,
                    isSelected && styles.activityDotSelected,
                  ]}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    )
  );
};

const styles = {
  // Week strip
  weekStrip: {
    flexDirection: "row",
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  dayButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
  },
  dayButtonSelected: {
    backgroundColor: COLORS.cardBorder,
  },
  dayButtonToday: {
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    backgroundColor: COLORS.elevated,
  },
  dayName: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  dayNumber: {
    fontSize: FONTS.md,
    color: COLORS.textPrimary,
    fontWeight: "600",
  },
  dayTextSelected: {
    color: COLORS.textPrimary,
    fontWeight: "700",
  },
  activityDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: COLORS.primary,
    marginTop: 2,
  },
  activityDotSelected: {
    backgroundColor: COLORS.textPrimary,
  },
};

export default WeeklyCalendar;
