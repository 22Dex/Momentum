import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useAppState } from '../hooks/useAppState';
import { COLORS, FONTS, SPACING, RADIUS } from '../theme';
import { TIME_SECTIONS } from '../data/appData';
import {
  getTodayString,
  formatDateLabel,
  wasCompletedToday,
  getXPPercent,
  getTodayXP,
  groupTasksBySection,
} from '../utils/helpers';

// ============================================================
// MAIN COMPONENT
// ============================================================
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

  // Controls which modal is open: null | 'habit' | 'task'
  const [modalType, setModalType] = useState(null);
  // Which time section the modal is for
  const [activeSection, setActiveSection] = useState('morning');

  // Form state for adding a new habit
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [newHabitXP, setNewHabitXP] = useState('10');

  // Form state for adding a new task
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('normal');

  // Today's date string (e.g. '2026-06-07')
  const today = getTodayString();

  // Group tasks by section for easy lookup
  const tasksBySection = groupTasksBySection(tasks);

  // Calculate XP % for the bar
  const dailyXPGoal = 100; // Change this to your goal
  const todayXP = getTodayXP(habits);
  const xpPercent = getXPPercent(todayXP, dailyXPGoal);

  // Count completed tasks today
  const completedTasks = tasks.filter((t) => t.isCompleted).length;
  const totalTasks = tasks.length;

  // ---- HANDLERS ----

  function openModal(type, sectionId) {
    setActiveSection(sectionId);
    setModalType(type);
  }

  function closeModal() {
    setModalType(null);
    setNewHabitTitle('');
    setNewHabitXP('10');
    setNewTaskTitle('');
    setNewTaskPriority('normal');
  }

  function handleAddHabit() {
    if (!newHabitTitle.trim()) return; // Don't add empty habits
    addHabit({
      title: newHabitTitle.trim(),
      timeSection: activeSection,
      icon: '⭐',
      xpReward: parseInt(newHabitXP) || 10,
      goalTarget: 7,
      goalType: 'streak',
    });
    closeModal();
  }

  function handleAddTask() {
    if (!newTaskTitle.trim()) return;
    addTask({
      title: newTaskTitle.trim(),
      timeSection: activeSection,
      xpReward: 5,
      dueDate: today,
      priority: newTaskPriority,
    });
    closeModal();
  }

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* ---- HEADER: Date + XP Bar ---- */}
        {/* SPLIT INTO: <XPBar /> and <DayHeader /> */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Good day 👋</Text>
          <Text style={styles.dateLabel}>{formatDateLabel(today)}</Text>

          {/* XP Progress Bar */}
          <View style={styles.xpContainer}>
            <View style={styles.xpLabelRow}>
              <Text style={styles.xpLabel}>⚡ {todayXP} XP Today</Text>
              <Text style={styles.xpLabel}>{dailyXPGoal} XP goal</Text>
            </View>
            <View style={styles.xpBarBg}>
              {/* The colored fill — width changes based on XP % */}
              <View style={[styles.xpBarFill, { width: `${xpPercent}%` }]} />
            </View>
          </View>
        </View>

        {/* ---- TASK COMPLETION CIRCLE ---- */}
        {/* SPLIT INTO: <TaskCircle /> */}
        <View style={styles.circleContainer}>
          {/* 
            TODO: Replace this View with an actual SVG circle/arc.
            Libraries to use: react-native-svg or react-native-progress
            The circle should fill up as tasks are completed.
          */}
          <View style={styles.circlePlaceholder}>
            <Text style={styles.circleNumber}>{completedTasks}</Text>
            <Text style={styles.circleLabel}>/{totalTasks}</Text>
            <Text style={styles.circleSub}>tasks done</Text>
          </View>
          <Text style={styles.circleCaption}>
            {completedTasks === totalTasks && totalTasks > 0
              ? '🎉 All done!'
              : `${totalTasks - completedTasks} tasks left`}
          </Text>
        </View>

        {/* ---- FOUR TIME SECTIONS ---- */}
        {/* SPLIT INTO: <TimeSectionCard section={section} /> */}
        {TIME_SECTIONS.map((section) => {
          // Get habits for this section
          const sectionHabits = habits.filter(
            (h) => h.timeSection === section.id
          );
          // Get tasks for this section
          const sectionTasks = tasksBySection[section.id] || [];

          return (
            <View key={section.id} style={styles.sectionCard}>
              {/* Section Header */}
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleRow}>
                  <Text style={styles.sectionEmoji}>{section.emoji}</Text>
                  <Text style={styles.sectionTitle}>{section.label}</Text>
                  <Text style={styles.sectionTime}>{section.timeRange}</Text>
                </View>
                {/* Left color accent bar */}
                <View
                  style={[
                    styles.sectionAccent,
                    { backgroundColor: section.color },
                  ]}
                />
              </View>

              {/* Habits in this section */}
              {/* SPLIT INTO: <HabitRow habit={habit} onToggle={...} /> */}
              {sectionHabits.length === 0 && sectionTasks.length === 0 && (
                <Text style={styles.emptyText}>No items yet. Add a habit or task!</Text>
              )}

              {sectionHabits.map((habit) => (
                <TouchableOpacity
                  key={habit.id}
                  style={styles.habitRow}
                  onPress={() => toggleHabitToday(habit.id)}
                >
                  {/* Check circle — filled if done today */}
                  <View
                    style={[
                      styles.checkCircle,
                      wasCompletedToday(habit) && styles.checkCircleDone,
                    ]}
                  >
                    {wasCompletedToday(habit) && (
                      <Text style={styles.checkMark}>✓</Text>
                    )}
                  </View>

                  <Text style={styles.habitIcon}>{habit.icon}</Text>

                  <View style={styles.habitInfo}>
                    <Text
                      style={[
                        styles.habitTitle,
                        wasCompletedToday(habit) && styles.habitTitleDone,
                      ]}
                    >
                      {habit.title}
                    </Text>
                    <Text style={styles.habitMeta}>
                      🔥 {habit.streak} streak · +{habit.xpReward} XP
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}

              {/* Tasks in this section */}
              {/* SPLIT INTO: <TaskRow task={task} onToggle={...} /> */}
              {sectionTasks.map((task) => (
                <TouchableOpacity
                  key={task.id}
                  style={styles.taskRow}
                  onPress={() => toggleTask(task.id)}
                >
                  <View
                    style={[
                      styles.taskCheck,
                      task.isCompleted && styles.taskCheckDone,
                    ]}
                  >
                    {task.isCompleted && (
                      <Text style={styles.checkMark}>✓</Text>
                    )}
                  </View>
                  <Text
                    style={[
                      styles.taskTitle,
                      task.isCompleted && styles.taskTitleDone,
                    ]}
                  >
                    {task.title}
                  </Text>
                  {/* Priority badge */}
                  {task.priority === 'high' && (
                    <View style={styles.priorityBadge}>
                      <Text style={styles.priorityText}>!</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}

              {/* Add buttons for this section */}
              <View style={styles.addButtonRow}>
                <TouchableOpacity
                  style={styles.addBtn}
                  onPress={() => openModal('habit', section.id)}
                >
                  <Text style={styles.addBtnText}>+ Habit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.addBtn, styles.addTaskBtn]}
                  onPress={() => openModal('task', section.id)}
                >
                  <Text style={styles.addBtnText}>+ Task</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}

        <View style={{ height: SPACING.xxl }} />
      </ScrollView>

      {/* ============================================================
          ADD HABIT MODAL
          SPLIT INTO: <AddHabitModal visible={...} onClose={...} />
          ============================================================ */}
      <Modal
        visible={modalType === 'habit'}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>New Habit</Text>
            <Text style={styles.modalSection}>
              Section:{' '}
              {TIME_SECTIONS.find((s) => s.id === activeSection)?.label}
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

      {/* ============================================================
          ADD TASK MODAL
          SPLIT INTO: <AddTaskModal visible={...} onClose={...} />
          ============================================================ */}
      <Modal
        visible={modalType === 'task'}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>New Task</Text>
            <Text style={styles.modalSection}>
              Section:{' '}
              {TIME_SECTIONS.find((s) => s.id === activeSection)?.label}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Task name (e.g. Reply to emails)"
              placeholderTextColor={COLORS.textMuted}
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
            />

            {/* Priority picker — simple buttons */}
            <Text style={styles.inputLabel}>Priority:</Text>
            <View style={styles.priorityRow}>
              {['low', 'normal', 'high'].map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.priorityBtn,
                    newTaskPriority === p && styles.priorityBtnActive,
                  ]}
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

// ============================================================
// STYLES
// ============================================================
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: SPACING.md,
  },

  // Header
  header: {
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  greeting: {
    fontSize: FONTS.xl,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  dateLabel: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    marginBottom: SPACING.md,
  },

  // XP Bar
  xpContainer: {
    marginTop: SPACING.sm,
  },
  xpLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  xpLabel: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
  },
  xpBarBg: {
    height: 12,
    backgroundColor: COLORS.xpBarBg,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  xpBarFill: {
    height: '100%',
    backgroundColor: COLORS.xpBar,
    borderRadius: RADIUS.full,
    // TODO: Add animated width transition using Animated.View
  },

  // Task Circle
  circleContainer: {
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
  circlePlaceholder: {
    // TODO: Replace with actual SVG circle using react-native-svg
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.card,
  },
  circleNumber: {
    fontSize: FONTS.xl,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  circleLabel: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
  },
  circleSub: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
  },
  circleCaption: {
    marginTop: SPACING.sm,
    color: COLORS.textSecondary,
    fontSize: FONTS.sm,
  },

  // Time Section Cards
  sectionCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  sectionHeader: {
    marginBottom: SPACING.sm,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  sectionAccent: {
    height: 2,
    borderRadius: RADIUS.full,
    marginTop: SPACING.sm,
  },
  sectionEmoji: {
    fontSize: FONTS.lg,
  },
  sectionTitle: {
    fontSize: FONTS.lg,
    color: COLORS.textPrimary,
    fontWeight: '600',
    flex: 1,
  },
  sectionTime: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: FONTS.sm,
    fontStyle: 'italic',
    paddingVertical: SPACING.sm,
  },

  // Habit Row
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleDone: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkMark: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  habitIcon: {
    fontSize: FONTS.md,
  },
  habitInfo: {
    flex: 1,
  },
  habitTitle: {
    fontSize: FONTS.md,
    color: COLORS.textPrimary,
  },
  habitTitleDone: {
    color: COLORS.textMuted,
    textDecorationLine: 'line-through',
  },
  habitMeta: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },

  // Task Row
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  taskCheck: {
    width: 20,
    height: 20,
    borderRadius: RADIUS.sm,
    borderWidth: 2,
    borderColor: COLORS.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskCheckDone: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  taskTitle: {
    fontSize: FONTS.md,
    color: COLORS.textPrimary,
    flex: 1,
  },
  taskTitleDone: {
    color: COLORS.textMuted,
    textDecorationLine: 'line-through',
  },
  priorityBadge: {
    backgroundColor: COLORS.danger,
    borderRadius: RADIUS.full,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priorityText: {
    color: COLORS.textPrimary,
    fontSize: FONTS.xs,
    fontWeight: '700',
  },

  // Add Buttons
  addButtonRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  addBtn: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.primary,
    alignItems: 'center',
  },
  addTaskBtn: {
    borderColor: COLORS.success,
  },
  addBtnText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sm,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end', // Slides up from bottom
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
    fontWeight: '700',
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
  priorityRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  priorityBtn: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    alignItems: 'center',
  },
  priorityBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  priorityBtnText: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sm,
    textTransform: 'capitalize',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.md,
  },
  saveBtn: {
    flex: 2,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  saveBtnText: {
    color: COLORS.textPrimary,
    fontSize: FONTS.md,
    fontWeight: '600',
  },
});
