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

import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CalendarToggle from "../../Components/DetailedOverview/CalendarToggle";
import DatePickerModal from "../../Components/DetailedOverview/DatePickerModal";
import FilterView from "../../Components/DetailedOverview/FilterView";
import MonthlyCalendar from "../../Components/DetailedOverview/MonthlyCalendar";
import TaskPlannerModal from "../../Components/DetailedOverview/TaskPlannerModal";
import TimePickerModal from "../../Components/DetailedOverview/TimePickerModal";
import WeeklyCalendar from "../../Components/DetailedOverview/WeeklyCalendar";
import { TIME_SECTIONS } from "../../data/appData";
import { useAppState } from "../../hooks/useAppState";
import { COLORS, FONTS, RADIUS, SPACING } from "../../theme/Themes";
import {
  formatDateLabel,
  getCurrentWeekDates,
  getShortDayName,
  getTaskProgress,
  getTodayString,
  getTotalXP,
  wasCompletedOn,
} from "../../utils/helpers";

export default function DetailedOverviewScreen() {
  const { habits, tasks, addTask } = useAppState();

  const weekDates = getCurrentWeekDates();
  const today = getTodayString();

  const [selectedDate, setSelectedDate] = useState(today);
  const [activeFilter, setActiveFilter] = useState(null);
  const [calendarMode, setCalendarMode] = useState("week"); // "week" | "month"
  const [planTaskVisible, setPlanTaskVisible] = useState(false);
  const [planTaskTitle, setPlanTaskTitle] = useState("");
  const [planTaskDate, setPlanTaskDate] = useState(today);
  const [planTaskStartTime, setPlanTaskStartTime] = useState("09:00");
  const [planTaskEndTime, setPlanTaskEndTime] = useState("10:00");
  const [planTaskCalendar, setPlanTaskCalendar] = useState(false);
  const [planTaskXp, setPlanTaskXp] = useState("medium");
  const [planTaskNotes, setPlanTaskNotes] = useState("");
  const [activePicker, setActivePicker] = useState(null);
  const [timePickerMode, setTimePickerMode] = useState("start");
  const [timePickerHour, setTimePickerHour] = useState(9);
  const [timePickerMinute, setTimePickerMinute] = useState(0);
  const [timePickerMeridiem, setTimePickerMeridiem] = useState("AM");
  const hourWheelRef = useRef(null);
  const minuteWheelRef = useRef(null);
  const hourOptions = useMemo(() => Array.from({ length: 12 }, (_, index) => index + 1), []);
  const minuteOptions = useMemo(() => Array.from({ length: 60 }, (_, index) => index), []);

  const parseTimeValue = (value) => {
    if (!value || typeof value !== "string") {
      return { hour: 9, minute: 0, meridiem: "AM" };
    }

    const match = value.match(/^(\d{1,2}):(\d{2})(?:\s*([AP]M))?$/i);
    if (!match) {
      return { hour: 9, minute: 0, meridiem: "AM" };
    }

    const hour24 = Number(match[1]);
    const minute = Number(match[2]);
    const meridiem = (match[3] || (hour24 >= 12 ? "PM" : "AM")).toUpperCase();
    const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;

    return { hour: hour12, minute, meridiem };
  };

  const formatTimeValue = (hour, minute, meridiem) => {
    const hour24 = ((hour % 12) + (meridiem === "PM" ? 12 : 0)) % 24;
    return `${String(hour24).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
  };

  useFocusEffect(
    useCallback(() => {
      setSelectedDate(today);
      return () => setSelectedDate(today);
    }, [today]),
  );

  useEffect(() => {
    if (activePicker !== "time") return;

    const currentValue =
      timePickerMode === "start" ? planTaskStartTime : planTaskEndTime;
    const parsed = parseTimeValue(currentValue);
    setTimePickerHour(parsed.hour);
    setTimePickerMinute(parsed.minute);
    setTimePickerMeridiem(parsed.meridiem);

    if (!hourWheelRef.current || !minuteWheelRef.current) return;

    const hourIndex = hourOptions.indexOf(parsed.hour);
    const minuteIndex = minuteOptions.indexOf(parsed.minute);
    const hourY = Math.max(0, (hourIndex >= 0 ? hourIndex : 0) * 42);
    const minuteY = Math.max(0, (minuteIndex >= 0 ? minuteIndex : 0) * 42);

    requestAnimationFrame(() => {
      hourWheelRef.current?.scrollTo({ y: hourY, animated: false });
      minuteWheelRef.current?.scrollTo({ y: minuteY, animated: false });
    });
  }, [
    activePicker,
    timePickerMode,
    planTaskStartTime,
    planTaskEndTime,
    hourOptions,
    minuteOptions,
  ]);

  const filteredHabits = activeFilter
    ? habits.filter((h) => h.timeSection === activeFilter)
    : habits;

  const totalXP = getTotalXP(habits);
  const { completed: completedTasksCount, total: totalTasksCount } =
    getTaskProgress(tasks);
  const bestStreak = habits.reduce((best, h) => Math.max(best, h.streak), 0);

  const filteredTasks = tasks.filter((task) => {
    const matchesDate =
      !task.dueDate ||
      task.dueDate === selectedDate ||
      task.date === selectedDate;

    if (!matchesDate) return false;

    return activeFilter ? task.timeSection === activeFilter : true;
  });

  const openPicker = (type, mode = "start") => {
    setPlanTaskVisible(false);
    setActivePicker(type);
    if (type === "time") {
      setTimePickerMode(mode);
    }
  };

  const closePicker = () => {
    setActivePicker(null);
    setPlanTaskVisible(true);
  };

  function resetPlanTaskForm() {
    setPlanTaskTitle("");
    setPlanTaskDate(today);
    setPlanTaskStartTime("09:00");
    setPlanTaskEndTime("10:00");
    setPlanTaskCalendar(false);
    setPlanTaskXp("medium");
    setPlanTaskNotes("");
    setActivePicker(null);
    setTimePickerMode("start");
  }

  function handlePlanTaskSave() {
    if (!planTaskTitle.trim()) return;

    const xpMap = { easy: 10, medium: 20, hard: 35 };

    addTask({
      title: planTaskTitle.trim(),
      timeSection: "morning",
      xpReward: xpMap[planTaskXp] || 20,
      dueDate: planTaskDate,
      priority: planTaskXp,
      scheduledStartTime: planTaskStartTime,
      scheduledEndTime: planTaskEndTime,
      calendarIntegration: planTaskCalendar ? "Yes" : "No",
      notes: planTaskNotes.trim(),
      isCompleted: false,
    });

    setPlanTaskVisible(false);
    resetPlanTaskForm();
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.pageHeader}>
          <View style={styles.pageHeaderRow}>
            <View style={styles.pageHeaderText}>
              <Text style={styles.pageTitle}>Detailed View</Text>
              <Text style={styles.pageSubtitle}>Your Day in detail</Text>
            </View>
            <TouchableOpacity
              style={styles.planTaskButton}
              onPress={() => {
                resetPlanTaskForm();
                setPlanTaskVisible(true);
              }}
            >
              <Text style={styles.planTaskButtonText}>Plan task</Text>
            </TouchableOpacity>
          </View>
        </View>

        <CalendarToggle
          calendarMode={calendarMode}
          setCalendarMode={setCalendarMode}
        />

        <WeeklyCalendar
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          calendarMode={calendarMode}
          weekDates={weekDates}
          today={today}
          habits={habits}
        />

        <MonthlyCalendar
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          calendarMode={calendarMode}
          habits={habits}
        />

        <View style={styles.statsBar}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>⚡ {totalXP}</Text>
            <Text style={styles.statLabel}>Total XP</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              ✅ {completedTasksCount}/{totalTasksCount}
            </Text>
            <Text style={styles.statLabel}>Tasks</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>🔥 {bestStreak}</Text>
            <Text style={styles.statLabel}>Best Streak</Text>
          </View>
        </View>

        <FilterView
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />

        {/* HABIT HISTORY LIST */}
        <Text style={styles.sectionHeader}>Habits This Week</Text>

        {filteredHabits.length === 0 && (
          <Text style={styles.emptyText}>
            No habits yet. Add some on the Overview tab!
          </Text>
        )}

        {filteredHabits.map((habit) => {
          const sectionInfo = TIME_SECTIONS.find(
            (s) => s.id === habit.timeSection,
          );
          return (
            <View key={habit.id} style={styles.habitCard}>
              <View style={styles.habitCardHeader}>
                <Text style={styles.habitCardIcon}>{habit.icon}</Text>
                <View style={styles.habitCardInfo}>
                  <Text style={styles.habitCardTitle}>{habit.title}</Text>
                  <Text style={styles.habitCardMeta}>
                    {sectionInfo?.emoji} {sectionInfo?.label} · 🔥{" "}
                    {habit.streak} day streak · +{habit.xpReward} XP
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
                          (habit.completedDates.length / habit.goalTarget) *
                            100,
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
        <Text style={styles.sectionHeader}>
          Tasks for {formatDateLabel(selectedDate)}
        </Text>

        {filteredTasks.length === 0 && (
          <Text style={styles.emptyText}>No tasks found for this day.</Text>
        )}

        {filteredTasks.map((task) => {
          const sectionInfo = TIME_SECTIONS.find(
            (s) => s.id === task.timeSection,
          );
          return (
            <View key={task.id} style={styles.taskCard}>
              <View
                style={[
                  styles.taskStatusBar,
                  {
                    backgroundColor: task.isCompleted
                      ? COLORS.success
                      : COLORS.textMuted,
                  },
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
                  <Text style={styles.taskMetaText}>
                    Priority: {task.priority}
                  </Text>
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

      <TaskPlannerModal
        visible={planTaskVisible}
        onClose={() => setPlanTaskVisible(false)}
        onCancel={() => {
          setPlanTaskVisible(false);
          resetPlanTaskForm();
        }}
        onSave={handlePlanTaskSave}
        onOpenDatePicker={() => openPicker("date")}
        onOpenTimePicker={(mode) => openPicker("time", mode)}
        planTaskTitle={planTaskTitle}
        setPlanTaskTitle={setPlanTaskTitle}
        planTaskDate={planTaskDate}
        planTaskStartTime={planTaskStartTime}
        planTaskEndTime={planTaskEndTime}
        planTaskCalendar={planTaskCalendar}
        setPlanTaskCalendar={setPlanTaskCalendar}
        planTaskXp={planTaskXp}
        setPlanTaskXp={setPlanTaskXp}
        planTaskNotes={planTaskNotes}
        setPlanTaskNotes={setPlanTaskNotes}
        styles={styles}
      />

      <DatePickerModal
        visible={activePicker === "date"}
        onClose={closePicker}
        today={today}
        value={planTaskDate}
        onSelect={(dateValue) => {
          setPlanTaskDate(dateValue);
          closePicker();
        }}
        styles={styles}
      />

      <TimePickerModal
        visible={activePicker === "time"}
        onClose={closePicker}
        hourOptions={hourOptions}
        minuteOptions={minuteOptions}
        timePickerHour={timePickerHour}
        setTimePickerHour={setTimePickerHour}
        timePickerMinute={timePickerMinute}
        setTimePickerMinute={setTimePickerMinute}
        timePickerMeridiem={timePickerMeridiem}
        setTimePickerMeridiem={setTimePickerMeridiem}
        timePickerMode={timePickerMode}
        timePickerValue={
          timePickerMode === "start" ? planTaskStartTime : planTaskEndTime
        }
        onSave={(timeValue) => {
          if (timePickerMode === "start") {
            setPlanTaskStartTime(timeValue);
          } else {
            setPlanTaskEndTime(timeValue);
          }
          closePicker();
        }}
        styles={styles}
        parseTimeValue={parseTimeValue}
        formatTimeValue={formatTimeValue}
        hourWheelRef={hourWheelRef}
        minuteWheelRef={minuteWheelRef}
      />
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
  pageHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: SPACING.sm,
  },
  pageHeaderText: {
    flex: 1,
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
  planTaskButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  planTaskButtonText: {
    color: COLORS.background,
    fontSize: FONTS.sm,
    fontWeight: "700",
  },

  // Stats Bar
  statsBar: {
    flexDirection: "row",
    backgroundColor: COLORS.card,
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
    backgroundColor: COLORS.card,
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
    height: 8,
    backgroundColor: COLORS.xpBarBg,
    borderRadius: RADIUS.full,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  goalBarFill: {
    height: "100%",
    backgroundColor: COLORS.xpBar,
    borderRadius: RADIUS.full,
  },

  // Task Card
  taskCard: {
    backgroundColor: COLORS.card,
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.38)",
    padding: SPACING.lg,
  },
  pickerOverlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.lg,
    backgroundColor: "rgba(10, 10, 10, 0.18)",
    zIndex: 20,
    elevation: 20,
  },
  modalCard: {
    backgroundColor: "rgba(27, 24, 22, 0.72)",
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
    width: "100%",
    maxWidth: 420,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
    zIndex: 1,
  },
  modalTitle: {
    fontSize: FONTS.xl,
    color: COLORS.textPrimary,
    fontWeight: "700",
    marginBottom: SPACING.md,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: FONTS.md,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: SPACING.sm,
  },
  inputText: {
    color: COLORS.textPrimary,
    fontSize: FONTS.md,
  },
  placeholderText: {
    color: COLORS.textMuted,
  },
  inputButton: {
    justifyContent: "center",
  },
  dateField: {
    width: "100%",
  },
  rowTwo: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
  rowThree: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
  inputHalf: {
    flex: 1,
  },
  inputThird: {
    flex: 1,
  },
  sectionLabel: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sm,
    marginBottom: SPACING.sm,
    marginTop: SPACING.xs,
  },
  inlineToggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  switchTrack: {
    width: 46,
    height: 24,
    borderRadius: 999,
    padding: 3,
    justifyContent: "center",
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    alignSelf: "center",
  },
  switchTrackActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  switchThumb: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.textPrimary,
    alignSelf: "flex-start",
  },
  switchThumbActive: {
    backgroundColor: COLORS.background,
    alignSelf: "flex-end",
  },
  xpRow: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  xpButton: {
    flex: 1,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    paddingVertical: SPACING.sm,
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  xpButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  xpButtonText: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sm,
    fontWeight: "600",
  },
  xpButtonTextActive: {
    color: COLORS.background,
  },
  notesInput: {
    minHeight: 90,
    textAlignVertical: "top",
  },
  modalActions: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  cancelButton: {
    flex: 1,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    paddingVertical: SPACING.md,
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  cancelButtonText: {
    color: COLORS.textPrimary,
    fontWeight: "600",
  },
  saveButton: {
    flex: 1,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: "center",
    backgroundColor: COLORS.primary,
  },
  saveButtonText: {
    color: COLORS.background,
    fontWeight: "700",
  },
  miniMonthCard: {
    backgroundColor: "rgba(31, 28, 25, 0.7)",
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    width: "100%",
    maxWidth: 360,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  miniCalendar: {
    borderRadius: RADIUS.lg,
    overflow: "hidden",
  },
  timePickerCard: {
    backgroundColor: "rgba(31, 28, 25, 0.78)",
    borderRadius: RADIUS.xl,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
    width: "100%",
    maxWidth: 340,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  pickerTitle: {
    fontSize: FONTS.md,
    color: COLORS.textPrimary,
    fontWeight: "700",
    marginBottom: SPACING.sm,
    textAlign: "center",
  },
  closePickerButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: "center",
    marginTop: SPACING.md,
  },
  closePickerButtonText: {
    color: COLORS.background,
    fontWeight: "700",
  },
  timePickerPanel: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    overflow: "hidden",
    minHeight: 168,
    position: "relative",
    paddingHorizontal: 18,
  },
  timeWheelHighlight: {
    position: "absolute",
    left: 8,
    right: 8,
    top: "50%",
    height: 30,
    marginTop: -15,
    borderRadius: RADIUS.sm,
    backgroundColor: "rgba(200, 165, 101, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(200, 165, 101, 0.18)",
  },
  timeWheelColumn: {
    width: 46,
    height: 162,
    zIndex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 0,
  },
  timeSeparatorColumn: {
    width: 8,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
    marginHorizontal: 0,
  },
  timeMinutesColumn: {
    width: 46,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
    marginRight: 0,
  },
  ampmRow: {
    flexDirection: "row",
    gap: SPACING.xs,
    marginTop: SPACING.sm,
    zIndex: 1,
    width: "100%",
  },
  timeSeparator: {
    color: COLORS.textPrimary,
    fontSize: FONTS.lg,
    fontWeight: "700",
    lineHeight: 20,
    includeFontPadding: false,
    marginTop: 0,
  },
  timeWheelContent: {
    paddingTop: 72,
    paddingBottom: 72,
    alignItems: "center",
    justifyContent: "center",
  },
  timeWheelItem: {
    height: 30,
    width: 52,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 0,
  },
  timeWheelItemSelected: {
    backgroundColor: "transparent",
    borderRadius: RADIUS.sm,
  },
  timeWheelItemSelectedStatic: {
    height: 42,
    width: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(200, 165, 101, 0.14)",
    borderRadius: RADIUS.sm,
  },
  timeWheelText: {
    color: COLORS.textMuted,
    fontSize: 24,
    fontWeight: "600",
    lineHeight: 24,
    textAlign: "center",
  },
  timeWheelTextSelected: {
    color: COLORS.textPrimary,
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 24,
    textAlign: "center",
  },
  ampmButton: {
    flex: 1,
    minHeight: 46,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  ampmButtonSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  ampmButtonText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.md,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  ampmButtonTextSelected: {
    color: COLORS.background,
  },
  amButtonSelected: {
    backgroundColor: "#f6e7a9",
    borderColor: "#f6e7a9",
  },
  pmButtonSelected: {
    backgroundColor: "#8b5cf6",
    borderColor: "#8b5cf6",
  },
  amTextSelected: {
    color: "#1b1b1b",
  },
  pmTextSelected: {
    color: "#f5f3ff",
  },
});
