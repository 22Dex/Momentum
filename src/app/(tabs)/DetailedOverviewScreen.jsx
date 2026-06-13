// ============================================================
// DETAILED OVERVIEW SCREEN — In-depth view of your data
//
// WHAT THIS SHOWS:
//  1. A 7-day calendar strip (Mon–Sun of the current week)
//     - Tap a day to view that day's data
//     - Shows which days had activity (dots below)
//  2. Stats summary bar (total XP, completed tasks, best streak)
//  3. All habits listed with their 7-day completion grid
//     - Each circle = one day. Filled = done, empty = missed
//  4. All tasks listed with status
//
// SPLIT THESE INTO COMPONENTS LATER:
//  - <WeekCalendarStrip /> — the 7-day date picker at top
//  - <StatsSummaryBar /> — XP / tasks / streak totals
//  - <HabitHistoryCard habit={habit} weekDates={[]} /> — habit + weekly dots
//  - <DetailedTaskList tasks={[]} /> — full task list with filters
//  - <SectionFilterBar /> — filter by morning/afternoon/evening/night

import { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { TIME_SECTIONS } from "../../data/appData";
import { useAppState } from "../../hooks/useAppState";
import { COLORS, FONTS, RADIUS, SPACING } from "../../theme/Themes"
import {
  getCurrentWeekDates,
  getShortDayName,
  getTaskProgress,
  getTodayString,
  getTotalXP,
  wasCompletedOn,
} from "../../utils/helpers";
import CalendarToggle from "../../Components/DetailedOverview/CalendarToggle";
import WeeklyCalendar from "../../Components/DetailedOverview/WeeklyCalendar";


export default function DetailedOverviewScreen() {
  const { habits, tasks } = useAppState();

  const weekDates = getCurrentWeekDates();
  const today = getTodayString();

  const [selectedDate, setSelectedDate] = useState(today);
  const [activeFilter, setActiveFilter] = useState(null);
  const [calendarMode, setCalendarMode] = useState("week"); // "week" | "month"

  const filteredHabits = activeFilter
    ? habits.filter((h) => h.timeSection === activeFilter)
    : habits;

  const totalXP = getTotalXP(habits);
  const { completed: completedTasksCount, total: totalTasksCount } =
    getTaskProgress(tasks);
  const bestStreak = habits.reduce((best, h) => Math.max(best, h.streak), 0);

  const filteredTasks = tasks.filter((t) =>
    activeFilter ? t.timeSection === activeFilter : true
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* PAGE HEADER */}
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Detailed View</Text>
          <Text style={styles.pageSubtitle}>Your habits & tasks in detail</Text>
        </View>

        <CalendarToggle
          showCalendar={calendarMode === "month"}
          setShowCalendar={(show) => setCalendarMode(show ? "month" : "week")}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />

        <WeeklyCalendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} calendarMode={calendarMode} />

        {/* MONTHLY CALENDAR */}
        {calendarMode === "month" && (
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
                calendarBackground: COLORS.cardBorder,
                dayTextColor: COLORS.textPrimary,
                monthTextColor: COLORS.textPrimary,
                arrowColor: COLORS.primary,
              }}
            />
          </View>
        )}

        {/* STATS BAR */}
        <View style={styles.statsBar}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>⚡ {totalXP}</Text>
            <Text style={styles.statLabel}>Total XP</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>✅ {completedTasksCount}/{totalTasksCount}</Text>
            <Text style={styles.statLabel}>Tasks</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>🔥 {bestStreak}</Text>
            <Text style={styles.statLabel}>Best Streak</Text>
          </View>
        </View>

        {/* SECTION FILTER BAR */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterBar}
          contentContainerStyle={styles.filterBarContent}
        >
          <TouchableOpacity
            style={[styles.filterBtn, activeFilter === null && styles.filterBtnActive]}
            onPress={() => setActiveFilter(null)}
          >
            <Text style={styles.filterBtnText}>All</Text>
          </TouchableOpacity>

          {TIME_SECTIONS.map((section) => (
            <TouchableOpacity
              key={section.id}
              style={[
                styles.filterBtn,
                activeFilter === section.id && styles.filterBtnActive,
                activeFilter === section.id && { borderColor: section.color },
              ]}
              onPress={() =>
                setActiveFilter(activeFilter === section.id ? null : section.id)
              }
            >
              <Text style={styles.filterBtnText}>
                {section.emoji} {section.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* HABIT HISTORY LIST */}
        <Text style={styles.sectionHeader}>Habits This Week</Text>

        {filteredHabits.length === 0 && (
          <Text style={styles.emptyText}>No habits yet. Add some on the Overview tab!</Text>
        )}

        {filteredHabits.map((habit) => {
          const sectionInfo = TIME_SECTIONS.find((s) => s.id === habit.timeSection);
          return (
            <View key={habit.id} style={styles.habitCard}>
              <View style={styles.habitCardHeader}>
                <Text style={styles.habitCardIcon}>{habit.icon}</Text>
                <View style={styles.habitCardInfo}>
                  <Text style={styles.habitCardTitle}>{habit.title}</Text>
                  <Text style={styles.habitCardMeta}>
                    {sectionInfo?.emoji} {sectionInfo?.label} · 🔥 {habit.streak} day streak · +{habit.xpReward} XP
                  </Text>
                </View>
              </View>

              <View style={styles.dotGrid}>
                {weekDates.map((date) => {
                  const done = wasCompletedOn(habit, date);
                  const isToday = date === today;
                  return (
                    <View key={date} style={styles.dotColumn}>
                      <Text style={styles.dotDayLabel}>
                        {getShortDayName(date).charAt(0)}
                      </Text>
                      <View
                        style={[
                          styles.dot,
                          done && styles.dotDone,
                          isToday && !done && styles.dotToday,
                        ]}
                      />
                    </View>
                  );
                })}
              </View>

              <View style={styles.goalRow}>
                <Text style={styles.goalLabel}>
                  Goal: {habit.completedDates.length} / {habit.goalTarget} days
                </Text>
                <View style={styles.goalBarBg}>
                  <View
                    style={[
                      styles.goalBarFill,
                      {
                        width: `${Math.min(
                          100,
                          (habit.completedDates.length / habit.goalTarget) * 100
                        )}%`,
                      },
                    ]}
                  />
                </View>
              </View>
            </View>
          );
        })}

        {/* TASK LIST */}
        <Text style={styles.sectionHeader}>Tasks</Text>

        {filteredTasks.length === 0 && (
          <Text style={styles.emptyText}>No tasks found.</Text>
        )}

        {filteredTasks.map((task) => {
          const sectionInfo = TIME_SECTIONS.find((s) => s.id === task.timeSection);
          return (
            <View key={task.id} style={styles.taskCard}>
              <View
                style={[
                  styles.taskStatusBar,
                  { backgroundColor: task.isCompleted ? COLORS.success : COLORS.textMuted },
                ]}
              />
              <View style={styles.taskCardContent}>
                <Text
                  style={[
                    styles.taskCardTitle,
                    task.isCompleted && styles.taskTitleDone,
                  ]}
                >
                  {task.title}
                </Text>
                <View style={styles.taskCardMeta}>
                  <Text style={styles.taskMetaText}>
                    {sectionInfo?.emoji} {sectionInfo?.label}
                  </Text>
                  <Text style={styles.taskMetaText}>Priority: {task.priority}</Text>
                  <Text style={styles.taskMetaText}>
                    {task.isCompleted ? "✅ Done" : "⏳ Pending"}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}

        <View style={{ height: SPACING.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: SPACING.md,
  },
  pageHeader: {
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  pageTitle: {
    fontSize: FONTS.xxl,
    color: COLORS.textPrimary,
    fontWeight: "700",
  },
  pageSubtitle: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },



  // Stats Bar
  statsBar: {
    flexDirection: "row",
    backgroundColor: COLORS.cardBorder,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: FONTS.md,
    color: COLORS.textPrimary,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.cardBorder,
  },

  // Filter Bar
  filterBar: {
    marginBottom: SPACING.md,
  },
  filterBarContent: {
    gap: SPACING.sm,
    paddingRight: SPACING.md,
  },
  filterBtn: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    backgroundColor: COLORS.cardBorder,
  },
  filterBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterBtnText: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sm,
  },

  // Section headers
  sectionHeader: {
    fontSize: FONTS.lg,
    color: COLORS.textPrimary,
    fontWeight: "600",
    marginBottom: SPACING.sm,
    marginTop: SPACING.sm,
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: FONTS.sm,
    fontStyle: "italic",
    marginBottom: SPACING.md,
  },

  // Habit Card
  habitCard: {
    backgroundColor: COLORS.cardBorder,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  habitCardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  habitCardIcon: {
    fontSize: FONTS.xl,
  },
  habitCardInfo: {
    flex: 1,
  },
  habitCardTitle: {
    fontSize: FONTS.md,
    color: COLORS.textPrimary,
    fontWeight: "600",
  },
  habitCardMeta: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },

  // Dot grid
  dotGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.sm,
  },
  dotColumn: {
    alignItems: "center",
    gap: 4,
  },
  dotDayLabel: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.cardBorder,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  dotDone: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  dotToday: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },

  // Goal bar
  goalRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  goalLabel: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
    minWidth: 100,
  },
  goalBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: COLORS.cardBorder,
    borderRadius: RADIUS.full,
    overflow: "hidden",
  },
  goalBarFill: {
    height: "100%",
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.full,
  },

  // Task Card
  taskCard: {
    backgroundColor: COLORS.cardBorder,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.sm,
    flexDirection: "row",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  taskStatusBar: {
    width: 4,
  },
  taskCardContent: {
    flex: 1,
    padding: SPACING.md,
  },
  taskCardTitle: {
    fontSize: FONTS.md,
    color: COLORS.textPrimary,
    fontWeight: "600",
    marginBottom: SPACING.xs,
  },
  taskTitleDone: {
    color: COLORS.textMuted,
    textDecorationLine: "line-through",
  },
  taskCardMeta: {
    flexDirection: "row",
    gap: SPACING.md,
    flexWrap: "wrap",
  },
  taskMetaText: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
  },
});