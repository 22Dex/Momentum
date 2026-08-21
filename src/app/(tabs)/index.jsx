// ============================================================
// OVERVIEW SCREEN — Main home screen of the app
//
// WHAT THIS SHOWS:
//  1. XP bar at the top (how much XP earned today)
//  2. Today's date + day greeting
//  3. Task completion circle (shows X/Y tasks done)
//  4. Four time sections: Morning, Afternoon, Evening, Night
//     - Each section shows habits + tasks for that time
//     - Tap a habit to complete it
//     - Tap + to add a new habit or task
//
// CHILD COMPONENTS:
//  - OverviewHeader
//  - TimeSectionCard
//  - AddHabitModal
//  - AddTaskModal
// ============================================================

import { useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    View,
} from "react-native";
import AddHabitModal from "../../Components/Home/AddHabitModal";
import LogAmountModal from "../../Components/Home/LogAmountModal";
import AddTaskModal from "../../Components/Home/AddTaskModal";
import OverviewHeader from "../../Components/Home/OverviewHeader";
import TimeSectionCard from "../../Components/Home/TimeSectionCard";
import TaskCircle from "../../Components/TaskCircle";
import { TIME_SECTIONS } from "../../data/appData";
import { getRandomQuote } from "../../data/quotes";
import { useAppState } from "../../hooks/useAppState";
import { COLORS, FONTS, RADIUS, SPACING } from "../../theme/Themes";
import {
    formatDateLabel,
    getCurrentWeekDates,
    getTodayString,
    getTodayXP,
    getXPPercent,
    groupTasksBySection,
} from "../../utils/helpers";

export default function OverviewScreen() {
  const { habits, tasks, toggleHabitToday, toggleTask, addHabit, addTask } =
    useAppState();

  const today = getTodayString();
  const weekDates = getCurrentWeekDates();

  const [modalType, setModalType] = useState(null);
  const [activeSection, setActiveSection] = useState("morning");
  const [newHabitTitle, setNewHabitTitle] = useState("");
  const [newHabitMeasureType, setNewHabitMeasureType] = useState('streak');
  const [newHabitGoalAmount, setNewHabitGoalAmount] = useState(1);
  const [newHabitUnit, setNewHabitUnit] = useState('');
  const [newHabitDifficulty, setNewHabitDifficulty] = useState('easy');
  // Logging amount modal
  const [loggingModalVisible, setLoggingModalVisible] = useState(false);
  const [loggingAmount, setLoggingAmount] = useState('');
  const [activeHabitForLogging, setActiveHabitForLogging] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("normal");
  const [newTaskDueDate, setNewTaskDueDate] = useState(today);

  const tasksBySection = groupTasksBySection(tasks);
  const dailyXPGoal = 100;
  const todayXP = getTodayXP(habits);
  const xpPercent = getXPPercent(todayXP, dailyXPGoal);
  const completedTasks = tasks.filter((t) => t.isCompleted).length;
  const totalTasks = tasks.length;
  const [quote] = useState(getRandomQuote());

  function openModal(type, sectionId) {
    setActiveSection(sectionId);
    setNewTaskDueDate(today);
    setModalType(type);
  }

  function openAmountModalForHabit(habit) {
    setActiveHabitForLogging(habit);
    setLoggingAmount('');
    setLoggingModalVisible(true);
  }

  function closeLoggingModal() {
    setActiveHabitForLogging(null);
    setLoggingAmount('');
    setLoggingModalVisible(false);
  }

  function closeModal() {
    setModalType(null);
    setNewHabitTitle("");
    setNewHabitMeasureType('streak');
    setNewHabitGoalAmount(1);
    setNewHabitUnit('');
    setNewHabitDifficulty('easy');
    setNewTaskTitle("");
    setNewTaskPriority("normal");
    setNewTaskDueDate(today);
  }

  function handleAddHabit() {
    if (!newHabitTitle.trim()) return;
    addHabit({
      title: newHabitTitle.trim(),
      timeSection: activeSection,
      icon: "⭐",
      difficulty: newHabitDifficulty,
      measureType: newHabitMeasureType,
      goalAmount: newHabitGoalAmount,
      unit: newHabitUnit,
      goalTarget: 7,
      goalType: "streak",
    });
    closeModal();
  }

  function handleAddTask() {
    if (!newTaskTitle.trim()) return;
    addTask({
      title: newTaskTitle.trim(),
      timeSection: activeSection,
      xpReward: 5,
      dueDate: newTaskDueDate,
      priority: newTaskPriority,
    });
    closeModal();
  }

  function shiftDate(dateStr, days) {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + days);
    return d.toISOString().split("T")[0];
  }

  function formatDueDate(dateStr) {
    if (dateStr === today) return "Today";
    if (dateStr === shiftDate(today, 1)) return "Tomorrow";
    if (dateStr === shiftDate(today, -1)) return "Yesterday";
    return dateStr;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <OverviewHeader
          dateLabel={formatDateLabel(today)}
          quote={quote}
          todayXP={todayXP}
          dailyXPGoal={dailyXPGoal}
          xpPercent={xpPercent}
          styles={styles}
        />

        <TaskCircle completedTasks={completedTasks} totalTasks={totalTasks} />

        {TIME_SECTIONS.map((section) => {
          const sectionHabits = habits.filter(
            (h) => h.timeSection === section.id,
          );
          const sectionTasks = tasksBySection[section.id] || [];

          return (
            <TimeSectionCard
              key={section.id}
              section={section}
              sectionHabits={sectionHabits}
              sectionTasks={sectionTasks}
              weekDates={weekDates}
              today={today}
              toggleHabitToday={toggleHabitToday}
              onLogAmountHabit={openAmountModalForHabit}
              toggleTask={toggleTask}
              openModal={openModal}
              formatDueDate={formatDueDate}
              styles={styles}
            />
          );
        })}

        <View style={{ height: SPACING.xxl }} />
      </ScrollView>

        <AddHabitModal
        visible={modalType === "habit"}
        onClose={closeModal}
        activeSectionLabel={
          TIME_SECTIONS.find((s) => s.id === activeSection)?.label
        }
        newHabitTitle={newHabitTitle}
        setNewHabitTitle={setNewHabitTitle}
        newHabitMeasureType={newHabitMeasureType}
        setNewHabitMeasureType={setNewHabitMeasureType}
        newHabitGoalAmount={newHabitGoalAmount}
        setNewHabitGoalAmount={setNewHabitGoalAmount}
        newHabitUnit={newHabitUnit}
        setNewHabitUnit={setNewHabitUnit}
        newHabitDifficulty={newHabitDifficulty}
        setNewHabitDifficulty={setNewHabitDifficulty}
        onAddHabit={handleAddHabit}
        styles={styles}
      />

      <AddTaskModal
        visible={modalType === "task"}
        onClose={closeModal}
        activeSectionLabel={
          TIME_SECTIONS.find((s) => s.id === activeSection)?.label
        }
        newTaskTitle={newTaskTitle}
        setNewTaskTitle={setNewTaskTitle}
        newTaskDueDate={newTaskDueDate}
        formatDueDate={formatDueDate}
        shiftDate={shiftDate}
        setNewTaskDueDate={setNewTaskDueDate}
        newTaskPriority={newTaskPriority}
        setNewTaskPriority={setNewTaskPriority}
        onAddTask={handleAddTask}
        styles={styles}
      />

      <LogAmountModal
        visible={loggingModalVisible}
        onClose={closeLoggingModal}
        habit={activeHabitForLogging}
        loggingAmount={loggingAmount}
        setLoggingAmount={setLoggingAmount}
        onLog={() => {
          if (!activeHabitForLogging) return;
          const amt = parseFloat(loggingAmount) || 0;
          toggleHabitToday(activeHabitForLogging.id, amt);
          closeLoggingModal();
        }}
        styles={styles}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, paddingHorizontal: SPACING.md },
  header: { paddingTop: SPACING.lg, paddingBottom: SPACING.md },
  greeting: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    marginBottom: SPACING.md,
  },
  dateLabel: {
    fontSize: FONTS.xl,
    color: COLORS.textPrimary,
    fontWeight: "700",
  },
  xpContainer: { marginTop: SPACING.sm },
  xpLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.xs,
  },
  xpLabel: { fontSize: FONTS.sm, color: COLORS.textSecondary },
  xpBarBg: {
    height: 16,
    backgroundColor: "#121212",
    borderRadius: 999,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#1A1A1A",
    shadowColor: "#000000",
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  xpBarFill: {
    height: "100%",
    backgroundColor: COLORS.xpBar,
    borderRadius: 999,
    opacity: 0.95,
  },
  sectionCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  sectionHeader: { marginBottom: SPACING.sm },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  sectionAccent: {
    height: 2,
    borderRadius: RADIUS.full,
    marginTop: SPACING.sm,
  },
  sectionEmoji: { fontSize: FONTS.lg },
  sectionTitle: {
    fontSize: FONTS.lg,
    color: COLORS.textPrimary,
    fontWeight: "600",
    flex: 1,
  },
  sectionTime: { fontSize: FONTS.xs, color: COLORS.textMuted },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: FONTS.sm,
    fontStyle: "italic",
    paddingVertical: SPACING.sm,
  },
  habitRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  checkCircleDone: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkMark: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: "700",
  },
  habitIcon: { fontSize: FONTS.md },
  habitInfo: { flex: 1 },
  habitTitle: { fontSize: FONTS.md, color: COLORS.textPrimary },
  habitTitleDone: {
    color: COLORS.textMuted,
    textDecorationLine: "line-through",
  },
  habitMeta: { fontSize: FONTS.xs, color: COLORS.textMuted, marginTop: 2 },
  heatmapRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: SPACING.sm,
    marginLeft: 44,
  },
  heatmapCell: {
    flex: 1,
    height: 10,
    borderRadius: 999,
    backgroundColor: "#2A241F",
    borderWidth: 1,
    borderColor: "#3A322E",
  },
  heatmapCompleted: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  taskCheck: {
    width: 20,
    height: 20,
    borderRadius: RADIUS.sm,
    borderWidth: 2,
    borderColor: COLORS.textMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  taskCheckDone: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  taskInfo: { flex: 1 },
  taskTitle: { fontSize: FONTS.md, color: COLORS.textPrimary },
  taskTitleDone: {
    color: COLORS.textMuted,
    textDecorationLine: "line-through",
  },
  taskDueDate: { fontSize: FONTS.xs, color: COLORS.textMuted, marginTop: 2 },
  taskOverdue: { color: COLORS.danger },
  taskFuture: { color: COLORS.primary },
  priorityBadge: {
    backgroundColor: COLORS.danger,
    borderRadius: RADIUS.full,
    width: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  priorityText: {
    color: COLORS.textPrimary,
    fontSize: FONTS.xs,
    fontWeight: "700",
  },
  addButtonRow: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  addBtn: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.primary,
    alignItems: "center",
  },
  addTaskBtn: { borderColor: COLORS.success },
  addBtnText: { color: COLORS.textSecondary, fontSize: FONTS.sm },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  modalTitle: {
    fontSize: FONTS.xl,
    color: COLORS.textPrimary,
    fontWeight: "700",
    marginBottom: SPACING.xs,
  },
  modalSection: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    color: COLORS.textPrimary,
    fontSize: FONTS.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  inputLabel: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sm,
    marginBottom: SPACING.xs,
  },
  datePicker: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  dateArrow: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm },
  dateArrowText: { color: COLORS.primary, fontSize: 28, lineHeight: 30 },
  dateText: {
    color: COLORS.textPrimary,
    fontSize: FONTS.md,
    fontWeight: "600",
  },
  priorityRow: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  priorityBtn: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    alignItems: "center",
  },
  priorityBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  priorityBtnText: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sm,
    textTransform: "capitalize",
  },
  modalButtons: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    alignItems: "center",
  },
  cancelBtnText: { color: COLORS.textSecondary, fontSize: FONTS.md },
  saveBtn: {
    flex: 2,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
    alignItems: "center",
  },
  saveBtnText: {
    color: COLORS.textPrimary,
    fontSize: FONTS.md,
    fontWeight: "600",
  },
});
