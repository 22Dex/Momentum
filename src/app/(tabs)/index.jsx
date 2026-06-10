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
// SPLIT THESE INTO COMPONENTS LATER:
//  - <XPBar /> — the top progress bar
//  - <TaskCircle /> — the circular progress indicator
//  - <TimeSectionCard /> — each of the 4 time sections
//  - <HabitRow /> — a single habit inside a section
//  - <TaskRow /> — a single task inside a section
//  - <AddHabitModal /> — the modal for adding a habit
//  - <AddTaskModal /> — the modal for adding a task
// // ============================================================
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
// SPLIT THESE INTO COMPONENTS LATER:
//  - <XPBar /> — the top progress bar
//  - <TaskCircle /> — the circular progress indicator
//  - <TimeSectionCard /> — each of the 4 time sections
//  - <HabitRow /> — a single habit inside a section
//  - <TaskRow /> — a single task inside a section
//  - <AddHabitModal /> — the modal for adding a habit
//  - <AddTaskModal /> — the modal for adding a task
//

import { useState } from "react";
import {
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
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
  wasCompletedOn,
  wasCompletedToday,
} from "../../utils/helpers";

export default function OverviewScreen() {
  const {
    habits,
    tasks,
    totalXP,
    toggleHabitToday,
    toggleTask,
    addHabit,
    addTask,
  } = useAppState();

  const today = getTodayString();
  const weekDates = getCurrentWeekDates();

  const [modalType, setModalType] = useState(null);
  const [activeSection, setActiveSection] = useState("morning");
  const [newHabitTitle, setNewHabitTitle] = useState("");
  const [newHabitXP, setNewHabitXP] = useState("10");
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

  function closeModal() {
    setModalType(null);
    setNewHabitTitle("");
    setNewHabitXP("10");
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
      xpReward: parseInt(newHabitXP) || 10,
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

        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.dateLabel}>{formatDateLabel(today)}</Text>
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

        <TaskCircle completedTasks={completedTasks} totalTasks={totalTasks} />

        {/* TIME SECTIONS */}
        {TIME_SECTIONS.map((section) => {
          const sectionHabits = habits.filter((h) => h.timeSection === section.id);
          const sectionTasks = tasksBySection[section.id] || [];

          return (
            <View key={section.id} style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleRow}>
                  <Text style={styles.sectionEmoji}>{section.emoji}</Text>
                  <Text style={styles.sectionTitle}>{section.label}</Text>
                  <Text style={styles.sectionTime}>{section.timeRange}</Text>
                </View>
                <View style={[styles.sectionAccent, { backgroundColor: section.color }]} />
              </View>

              {sectionHabits.map((habit) => (
                <View key={habit.id}>
                  <TouchableOpacity
                    style={styles.habitRow}
                    onPress={() => toggleHabitToday(habit.id)}
                  >
                    <View style={[styles.checkCircle, wasCompletedToday(habit) && styles.checkCircleDone]}>
                      {wasCompletedToday(habit) && <Text style={styles.checkMark}>✓</Text>}
                    </View>
                    <Text style={styles.habitIcon}>{habit.icon}</Text>
                    <View style={styles.habitInfo}>
                      <Text style={[styles.habitTitle, wasCompletedToday(habit) && styles.habitTitleDone]}>
                        {habit.title}
                      </Text>
                      <Text style={styles.habitMeta}>
                        🔥 {habit.streak} streak · +{habit.xpReward} XP
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <View style={styles.heatmapRow}>
                    {weekDates.map((date) => (
                      <View
                        key={date}
                        style={[styles.heatmapCell, wasCompletedOn(habit, date) && styles.heatmapCompleted]}
                      />
                    ))}
                  </View>
                </View>
              ))}

              {sectionHabits.length === 0 && sectionTasks.length === 0 && (
                <Text style={styles.emptyText}>No items yet. Add a habit or task!</Text>
              )}

              {sectionTasks.map((task) => (
                <TouchableOpacity
                  key={task.id}
                  style={styles.taskRow}
                  onPress={() => toggleTask(task.id)}
                >
                  <View style={[styles.taskCheck, task.isCompleted && styles.taskCheckDone]}>
                    {task.isCompleted && <Text style={styles.checkMark}>✓</Text>}
                  </View>
                  <View style={styles.taskInfo}>
                    <Text style={[styles.taskTitle, task.isCompleted && styles.taskTitleDone]}>
                      {task.title}
                    </Text>
                    {task.dueDate && task.dueDate !== today && (
                      <Text style={[
                        styles.taskDueDate,
                        task.dueDate < today && styles.taskOverdue,
                        task.dueDate > today && styles.taskFuture,
                      ]}>
                        {task.dueDate < today ? "⚠ " : "📅 "}
                        {formatDueDate(task.dueDate)}
                      </Text>
                    )}
                  </View>
                  {task.priority === "high" && (
                    <View style={styles.priorityBadge}>
                      <Text style={styles.priorityText}>!</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}

              <View style={styles.addButtonRow}>
                <TouchableOpacity style={styles.addBtn} onPress={() => openModal("habit", section.id)}>
                  <Text style={styles.addBtnText}>+ Habit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.addBtn, styles.addTaskBtn]} onPress={() => openModal("task", section.id)}>
                  <Text style={styles.addBtnText}>+ Task</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}

        <View style={{ height: SPACING.xxl }} />
      </ScrollView>

      {/* ADD HABIT MODAL */}
      <Modal visible={modalType === "habit"} transparent animationType="slide" onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>New Habit</Text>
            <Text style={styles.modalSection}>
              Section: {TIME_SECTIONS.find((s) => s.id === activeSection)?.label}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Habit name (e.g. Morning Run)"
              placeholderTextColor={COLORS.textMuted}
              value={newHabitTitle}
              onChangeText={setNewHabitTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="XP reward (e.g. 10)"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="numeric"
              value={newHabitXP}
              onChangeText={setNewHabitXP}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={closeModal}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleAddHabit}>
                <Text style={styles.saveBtnText}>Add Habit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ADD TASK MODAL */}
      <Modal visible={modalType === "task"} transparent animationType="slide" onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>New Task</Text>
            <Text style={styles.modalSection}>
              Section: {TIME_SECTIONS.find((s) => s.id === activeSection)?.label}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Task name (e.g. Reply to emails)"
              placeholderTextColor={COLORS.textMuted}
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
            />

            {/* Due Date Picker */}
            <Text style={styles.inputLabel}>Due Date:</Text>
            <View style={styles.datePicker}>
              <TouchableOpacity
                style={styles.dateArrow}
                onPress={() => setNewTaskDueDate(shiftDate(newTaskDueDate, -1))}
              >
                <Text style={styles.dateArrowText}>‹</Text>
              </TouchableOpacity>
              <Text style={styles.dateText}>{formatDueDate(newTaskDueDate)}</Text>
              <TouchableOpacity
                style={styles.dateArrow}
                onPress={() => setNewTaskDueDate(shiftDate(newTaskDueDate, 1))}
              >
                <Text style={styles.dateArrowText}>›</Text>
              </TouchableOpacity>
            </View>

            {/* Priority */}
            <Text style={styles.inputLabel}>Priority:</Text>
            <View style={styles.priorityRow}>
              {["low", "normal", "high"].map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[styles.priorityBtn, newTaskPriority === p && styles.priorityBtnActive]}
                  onPress={() => setNewTaskPriority(p)}
                >
                  <Text style={styles.priorityBtnText}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={closeModal}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleAddTask}>
                <Text style={styles.saveBtnText}>Add Task</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, paddingHorizontal: SPACING.md },
  header: { paddingTop: SPACING.lg, paddingBottom: SPACING.md },
  greeting: { fontSize: FONTS.sm, color: COLORS.textSecondary, marginTop: SPACING.xs, marginBottom: SPACING.md },
  dateLabel: { fontSize: FONTS.xl, color: COLORS.textPrimary, fontWeight: "700" },
  xpContainer: { marginTop: SPACING.sm },
  xpLabelRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: SPACING.xs },
  xpLabel: { fontSize: FONTS.sm, color: COLORS.textSecondary },
  xpBarBg: { height: 12, backgroundColor: COLORS.xpBarBg, borderRadius: RADIUS.full, overflow: "hidden" },
  xpBarFill: { height: "100%", backgroundColor: COLORS.xpBar, borderRadius: RADIUS.full },
  sectionCard: { backgroundColor: COLORS.card, borderRadius: RADIUS.lg, marginBottom: SPACING.md, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.cardBorder },
  sectionHeader: { marginBottom: SPACING.sm },
  sectionTitleRow: { flexDirection: "row", alignItems: "center", gap: SPACING.sm },
  sectionAccent: { height: 2, borderRadius: RADIUS.full, marginTop: SPACING.sm },
  sectionEmoji: { fontSize: FONTS.lg },
  sectionTitle: { fontSize: FONTS.lg, color: COLORS.textPrimary, fontWeight: "600", flex: 1 },
  sectionTime: { fontSize: FONTS.xs, color: COLORS.textMuted },
  emptyText: { color: COLORS.textMuted, fontSize: FONTS.sm, fontStyle: "italic", paddingVertical: SPACING.sm },
  habitRow: { flexDirection: "row", alignItems: "center", paddingVertical: SPACING.sm, gap: SPACING.sm },
  checkCircle: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: COLORS.primary, alignItems: "center", justifyContent: "center" },
  checkCircleDone: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  checkMark: { color: COLORS.textPrimary, fontSize: 12, fontWeight: "700" },
  habitIcon: { fontSize: FONTS.md },
  habitInfo: { flex: 1 },
  habitTitle: { fontSize: FONTS.md, color: COLORS.textPrimary },
  habitTitleDone: { color: COLORS.textMuted, textDecorationLine: "line-through" },
  habitMeta: { fontSize: FONTS.xs, color: COLORS.textMuted, marginTop: 2 },
  taskRow: { flexDirection: "row", alignItems: "center", paddingVertical: SPACING.sm, gap: SPACING.sm },
  taskCheck: { width: 20, height: 20, borderRadius: RADIUS.sm, borderWidth: 2, borderColor: COLORS.textMuted, alignItems: "center", justifyContent: "center" },
  taskCheckDone: { backgroundColor: COLORS.success, borderColor: COLORS.success },
  taskInfo: { flex: 1 },
  taskTitle: { fontSize: FONTS.md, color: COLORS.textPrimary },
  taskTitleDone: { color: COLORS.textMuted, textDecorationLine: "line-through" },
  taskDueDate: { fontSize: FONTS.xs, color: COLORS.textMuted, marginTop: 2 },
  taskOverdue: { color: COLORS.danger },
  taskFuture: { color: COLORS.primary },
  priorityBadge: { backgroundColor: COLORS.danger, borderRadius: RADIUS.full, width: 18, height: 18, alignItems: "center", justifyContent: "center" },
  priorityText: { color: COLORS.textPrimary, fontSize: FONTS.xs, fontWeight: "700" },
  addButtonRow: { flexDirection: "row", gap: SPACING.sm, marginTop: SPACING.sm },
  addBtn: { flex: 1, paddingVertical: SPACING.sm, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.primary, alignItems: "center" },
  addTaskBtn: { borderColor: COLORS.success },
  addBtnText: { color: COLORS.textSecondary, fontSize: FONTS.sm },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "flex-end" },
  modalCard: { backgroundColor: COLORS.card, borderTopLeftRadius: RADIUS.xl, borderTopRightRadius: RADIUS.xl, padding: SPACING.lg, paddingBottom: SPACING.xxl },
  modalTitle: { fontSize: FONTS.xl, color: COLORS.textPrimary, fontWeight: "700", marginBottom: SPACING.xs },
  modalSection: { fontSize: FONTS.sm, color: COLORS.textSecondary, marginBottom: SPACING.md },
  input: { backgroundColor: COLORS.background, borderRadius: RADIUS.md, padding: SPACING.md, color: COLORS.textPrimary, fontSize: FONTS.md, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.cardBorder },
  inputLabel: { color: COLORS.textSecondary, fontSize: FONTS.sm, marginBottom: SPACING.xs },
  datePicker: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: COLORS.background, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.cardBorder, marginBottom: SPACING.md, paddingVertical: SPACING.xs },
  dateArrow: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm },
  dateArrowText: { color: COLORS.primary, fontSize: 28, lineHeight: 30 },
  dateText: { color: COLORS.textPrimary, fontSize: FONTS.md, fontWeight: "600" },
  priorityRow: { flexDirection: "row", gap: SPACING.sm, marginBottom: SPACING.md },
  priorityBtn: { flex: 1, paddingVertical: SPACING.sm, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.cardBorder, alignItems: "center" },
  priorityBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  priorityBtnText: { color: COLORS.textPrimary, fontSize: FONTS.sm, textTransform: "capitalize" },
  modalButtons: { flexDirection: "row", gap: SPACING.sm, marginTop: SPACING.sm },
  cancelBtn: { flex: 1, paddingVertical: SPACING.md, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.cardBorder, alignItems: "center" },
  cancelBtnText: { color: COLORS.textSecondary, fontSize: FONTS.md },
  saveBtn: { flex: 2, paddingVertical: SPACING.md, borderRadius: RADIUS.md, backgroundColor: COLORS.primary, alignItems: "center" },
  saveBtnText: { color: COLORS.textPrimary, fontSize: FONTS.md, fontWeight: "600" },
  heatmapRow: { flexDirection: "row", gap: 4, marginLeft: 60, marginBottom: 8 },
  heatmapCell: { width: 12, height: 12, borderRadius: 3, backgroundColor: "#2A2A2A" },
  heatmapCompleted: { backgroundColor: COLORS.success },
});