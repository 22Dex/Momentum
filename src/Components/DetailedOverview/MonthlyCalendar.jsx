import {Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useTheme} from '@react-navigation/native';
import {Calendar} from 'react-native-calendars';

const MonthlyCalendar = ({selectedDate, setSelectedDate}) => {
    const theme = useTheme();

    return (
        calendarMode === "month" && (
                  <View style={styles.calendarContainer}>
                    <Calendar
                      onDayPress={(day) => setSelectedDate(day.dateString)}
                      markedDates={{
                        [selectedDate]: {
                          selected: true,
                          selectedColor: COLORS.primary,
                        },
                      }}
                      theme={{
                        todayTextColor: COLORS.primary,
                        selectedDayBackgroundColor: COLORS.primary,
                        calendarBackground: COLORS.card,
                        dayTextColor: COLORS.textPrimary,
                        monthTextColor: COLORS.textPrimary,
                        arrowColor: COLORS.primary,
                      }}
                    />
                  </View>
                )
    );
}

const styles = {
  calendarContainer: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
}