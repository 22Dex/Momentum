import {Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Calendar} from 'react-native-calendars';
import COLORS from '../../theme/Themes'


const CalendarToggle = ({showCalendar, setShowCalendar, selectedDate, setSelectedDate}) => {
  const theme = useTheme();

    return (
        <View style={styles.toggleContainer}>
                  <TouchableOpacity
                    style={[styles.toggleBtn, calendarMode === "week" && styles.toggleBtnActive]}
                    onPress={() => setCalendarMode("week")}
                  >
                    <Text style={[styles.toggleBtnText, calendarMode === "week" && styles.toggleBtnTextActive]}>
                      Week
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.toggleBtn, calendarMode === "month" && styles.toggleBtnActive]}
                    onPress={() => setCalendarMode("month")}
                  >
                    <Text style={[styles.toggleBtnText, calendarMode === "month" && styles.toggleBtnTextActive]}>
                      Month
                    </Text>
                  </TouchableOpacity>
                </View>
    );
};

const styles = {
// Toggle
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
  },
  toggleBtnActive: {
    backgroundColor: COLORS.primary,
  },
  toggleBtnText: {
    fontSize: FONTS.sm,
    color: COLORS.textMuted,
    fontWeight: "600",
  },
  toggleBtnTextActive: {
    color: COLORS.textPrimary,
  },
};

export default CalendarToggle;