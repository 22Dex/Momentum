import { StyleSheet, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { COLORS, RADIUS, SPACING } from "../../theme/Themes";

export default function MonthlyCalendar({
  selectedDate,
  setSelectedDate,
  calendarMode,
}) {
  return (
    calendarMode === "month" && (
      <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={(day) => setSelectedDate(day.dateString)}
          onMonthChange={(month) =>
            setSelectedDate(month.dateString || selectedDate)
          }
          markedDates={{
            [selectedDate]: {
              selected: true,
              selectedColor: COLORS.primary,
              selectedTextColor: COLORS.textPrimary,
            },
          }}
          theme={{
            backgroundColor: COLORS.background,
            calendarBackground: COLORS.background,
            textSectionTitleColor: COLORS.textSecondary,
            dayTextColor: COLORS.textPrimary,
            monthTextColor: COLORS.textPrimary,
            arrowColor: COLORS.textSecondary,
            todayTextColor: COLORS.textPrimary,
            selectedDayBackgroundColor: COLORS.primary,
            selectedDayTextColor: COLORS.textPrimary,
            textDisabledColor: "#B7B3AF",
            dotColor: COLORS.primary,
            selectedDotColor: COLORS.textPrimary,
            textDayFontFamily: "System",
            textMonthFontFamily: "System",
            textDayHeaderFontFamily: "System",
            textDayFontWeight: "500",
            textMonthFontWeight: "700",
            weekVerticalMargin: 6,
            paddingLeft: 10,
            paddingRight: 10,
            "stylesheet.calendar.header": {
              week: {
                marginTop: 6,
                flexDirection: "row",
                justifyContent: "space-between",
              },
            },
          }}
        />
      </View>
    )
  );
}

const styles = StyleSheet.create({
  calendarContainer: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
});
