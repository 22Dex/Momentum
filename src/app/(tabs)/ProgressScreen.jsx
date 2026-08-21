// ============================================================
// PROGRESS SCREEN — Goal Tracker & XP System
//
// WHAT THIS SHOWS:
//  1. Total XP earned (big number at top) with level indicator
//  2. List of goals with XP progress bars
//     - Each goal has a title, XP progress bar, and % complete
//     - Completed goals are shown separately at the bottom
//  3. Add Goal button (opens a modal)
//
// HOW XP WORKS:
//  - You earn XP by completing habits and tasks (in Overview)
//  - This screen lets you SET goals and track progress toward them
//  - When a goal's XP bar fills up, it's marked as complete
//  - Use the "Add XP" button to manually add XP to a goal (for testing)
//
// SPLIT THESE INTO COMPONENTS LATER:
//  - <XPLevelBanner totalXP={totalXP} /> — the big XP display + level
//  - <GoalCard goal={goal} onAddXP={...} onDelete={...} /> — single goal
//  - <GoalProgressBar current={n} target={n} /> — the XP fill bar
//  - <AddGoalModal visible={...} onClose={...} onSave={...} />
//  - <CompletedGoalsList goals={[]} /> — section for finished goals
// ============================================================

import { useState } from "react";
import {
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useAppState } from "../../hooks/useAppState";
import { COLORS, FONTS, RADIUS, SPACING } from "../../theme/Themes";
import { getXPPercent, getTodayString } from "../../utils/helpers";
// Local accent override: replace gold undertones with dark burgundy
const BURGUNDY = '#5A0D0D';
const BURGUNDY_LIGHT = '#8A2B2B';

// ---- LEVEL SYSTEM ----
// Simple formula: every 100 XP = 1 level
// Change this function later to make leveling harder over time
function getLevelFromXP(xp) {
  return Math.floor(xp / 100) + 1;
}

function getXPForNextLevel(xp) {
  const level = getLevelFromXP(xp);
  return level * 100; // Each level needs 100 * level XP
}

function getXPProgressInLevel(xp) {
  return xp % 100; // XP within the current level (0–99)
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function ProgressScreen() {
  const { goals, habits, addGoal, addGoalXP, deleteGoal, totalXP } =
    useAppState();

  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalDescription, setNewGoalDescription] = useState("");
  const [newGoalTarget, setNewGoalTarget] = useState("100");
  const [newGoalReward, setNewGoalReward] = useState("");
  const [newGoalPeriod, setNewGoalPeriod] = useState('week');

  // Separate active goals from completed ones
  const activeGoals = goals.filter((g) => !g.isCompleted);
  const completedGoals = goals.filter((g) => g.isCompleted);

  // Level info
  const level = getLevelFromXP(totalXP);
  const levelXP = getXPProgressInLevel(totalXP);
  const nextLevelXP = 100; // XP needed per level (keep it simple)

  // ---- HANDLERS ----
  function handleAddGoal() {
    if (!newGoalTitle.trim()) return;
    addGoal({
      title: newGoalTitle.trim(),
      description: newGoalDescription.trim(),
      targetXP: parseInt(newGoalTarget) || 100,
      period: newGoalPeriod,
      reward: newGoalReward.trim(),
    });
    setShowAddModal(false);
    setNewGoalTitle("");
    setNewGoalDescription("");
    setNewGoalTarget("100");
    setNewGoalReward("");
  }

  // Map period id to days
  function periodToDays(period) {
    switch (period) {
      case 'week':
        return 7;
      case '2w':
        return 14;
      case 'month':
        return 30;
      case '3m':
        return 90;
      case '6m':
        return 180;
      case 'year':
        return 365;
      default:
        return 30;
    }
  }

  function computeDaysLeft(goal) {
    if (!goal || !goal.createdAt) return null;
    const total = periodToDays(goal.period || goal.period || 'month');
    const start = new Date(goal.createdAt + 'T00:00:00');
    const today = new Date(getTodayString() + 'T00:00:00');
    const diffMs = today - start;
    const elapsed = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const left = total - elapsed;
    return left;
  }

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* ---- PAGE TITLE ---- */}
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Progress</Text>
          <Text style={styles.pageSubtitle}>Goals, XP & Achievements</Text>
        </View>

        {/* ============================================================
            XP LEVEL BANNER
            SPLIT INTO: <XPLevelBanner totalXP={totalXP} />
            ============================================================ */}
        <View style={styles.levelBanner}>
          {/* Level badge */}
          <View style={styles.levelBadge}>
            <Text style={styles.levelNumber}>{level}</Text>
            <Text style={styles.levelLabel}>LEVEL</Text>
          </View>

          <View style={styles.levelInfo}>
            <View style={styles.levelTitleRow}>
              <Text style={styles.levelTitle}>Level {level}</Text>
              <Text style={styles.totalXPText}>⚡ {totalXP} Total XP</Text>
            </View>

            {/* Level progress bar */}
            <View style={styles.levelBarBg}>
              <View
                style={[
                  styles.levelBarFill,
                  {
                    width: `${getXPPercent(levelXP, nextLevelXP)}%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.levelProgress}>
              {levelXP} / {nextLevelXP} XP to Level {level + 1}
            </Text>
          </View>
        </View>

        {/* ============================================================
            ACTIVE GOALS
            SPLIT INTO: <GoalCard goal={goal} ... />
            ============================================================ */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Active Goals</Text>
          <TouchableOpacity
            style={styles.addGoalBtn}
            onPress={() => setShowAddModal(true)}
          >
            <Text style={styles.addGoalBtnText}>+ New Goal</Text>
          </TouchableOpacity>
        </View>

        {activeGoals.length === 0 && (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>🎯</Text>
            <Text style={styles.emptyTitle}>No goals yet</Text>
            <Text style={styles.emptySubtitle}>
              Tap "+ New Goal" to create your first goal
            </Text>
          </View>
        )}

        {activeGoals.map((goal) => {
          const percent = getXPPercent(goal.currentXP, goal.targetXP);

          return (
            <View key={goal.id} style={styles.goalCard}>
              {/* Goal header */}
              <View style={styles.goalCardHeader}>
                <View style={styles.goalTitleArea}>
                  <Text style={styles.goalTitle}>{goal.title}</Text>
                  {goal.description ? (
                    <Text style={styles.goalDescription}>
                      {goal.description}
                    </Text>
                  ) : null}
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.goalPercent}>{percent}%</Text>
                  <Text style={styles.daysLeftText}>
                    {(() => {
                      const left = computeDaysLeft(goal);
                      if (left == null) return '';
                      if (left <= 0) return 'Expired';
                      if (left === 1) return '1 day left';
                      return `${left} days left`;
                    })()}
                  </Text>
                </View>
              </View>

              {/* XP progress bar */}
              {/* SPLIT INTO: <GoalProgressBar current={} target={} /> */}
              <View style={styles.goalBarBg}>
                <View
                  style={[
                    styles.goalBarFill,
                    { width: `${percent}%` },
                    percent >= 100 && styles.goalBarComplete,
                  ]}
                />
              </View>
              <Text style={styles.goalXPText}>
                ⚡ {goal.currentXP} / {goal.targetXP} XP
              </Text>

              {/* Reward label */}
              {goal.reward ? (
                <Text style={styles.rewardText}>🏆 Reward: {goal.reward}</Text>
              ) : null}

              {/* Action buttons */}
              <View style={styles.goalActions}>
                <TouchableOpacity
                  style={[styles.addXPBtn, styles.deleteBtn]}
                  onPress={() => deleteGoal(goal.id)}
                >
                  <Text style={[styles.addXPBtnText, styles.deleteBtnText]}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}

        {/* ============================================================
            COMPLETED GOALS
            SPLIT INTO: <CompletedGoalsList goals={completedGoals} />
            ============================================================ */}
        {completedGoals.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: SPACING.lg }]}>
              🏆 Completed Goals
            </Text>
            {completedGoals.map((goal) => (
              <View
                key={goal.id}
                style={[styles.goalCard, styles.completedGoalCard]}
              >
                <View style={styles.completedBadge}>
                  <Text style={styles.completedBadgeText}>COMPLETE</Text>
                </View>
                <Text style={styles.goalTitle}>{goal.title}</Text>
                <Text style={styles.goalXPText}>
                  ⚡ {goal.targetXP} XP earned
                </Text>
                {goal.reward ? (
                  <Text style={styles.rewardText}>🏆 {goal.reward}</Text>
                ) : null}
              </View>
            ))}
          </>
        )}

        <View style={{ height: SPACING.xxl }} />
      </ScrollView>

      {/* ============================================================
          ADD GOAL MODAL
          SPLIT INTO: <AddGoalModal visible={...} onClose={...} />
          ============================================================ */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowAddModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalCardCentered} onStartShouldSetResponder={() => true}>
              <Text style={styles.modalTitle}>Create Goal</Text>
              <Text style={[styles.inputLabel, { marginTop: 6 }]}>Short-term or long-term goals — pick a window to track over</Text>

              <Text style={[styles.inputLabel, { marginTop: 14 }]}>Tracking window</Text>
              <View style={styles.priorityRow}>
                {[
                  { id: 'week', label: '1 Week' },
                  { id: '2w', label: '2 Weeks' },
                  { id: 'month', label: '1 Month' },
                  { id: '3m', label: '3 Months' },
                  { id: '6m', label: '6 Months' },
                  { id: 'year', label: '1 Year' },
                ].map((p) => (
                  <TouchableOpacity
                    key={p.id}
                    style={[
                      styles.priorityBtn,
                      newGoalPeriod === p.id && styles.priorityBtnActive,
                    ]}
                    onPress={() => setNewGoalPeriod(p.id)}
                  >
                    <Text style={[styles.priorityBtnText, newGoalPeriod === p.id && styles.priorityBtnTextActive]}>{p.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.inputLabel, { marginTop: 12 }]}>Goal title</Text>
              <TextInput
                style={styles.input}
                placeholder="Goal title (e.g. Build a workout habit)"
                placeholderTextColor={COLORS.textMuted}
                value={newGoalTitle}
                onChangeText={setNewGoalTitle}
              />

              <Text style={styles.inputLabel}>XP target</Text>
              <TextInput
                style={styles.input}
                placeholder="XP target (e.g. 100)"
                placeholderTextColor={COLORS.textMuted}
                keyboardType="numeric"
                value={newGoalTarget}
                onChangeText={setNewGoalTarget}
              />

              <Text style={styles.inputLabel}>Description (optional)</Text>
              <TextInput
                style={[styles.input, styles.inputMultiline]}
                placeholder="Description (optional)"
                placeholderTextColor={COLORS.textMuted}
                value={newGoalDescription}
                onChangeText={setNewGoalDescription}
                multiline
                numberOfLines={3}
              />

              <Text style={styles.inputLabel}>Reward (optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="Reward when done (e.g. Buy new headphones)"
                placeholderTextColor={COLORS.textMuted}
                value={newGoalReward}
                onChangeText={setNewGoalReward}
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setShowAddModal(false)}
                >
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveBtn} onPress={handleAddGoal}>
                  <Text style={styles.saveBtnText}>Create Goal</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
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

  // Level Banner
  levelBanner: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    borderWidth: 1,
    borderColor: BURGUNDY,
  },
  levelBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: BURGUNDY,
    alignItems: "center",
    justifyContent: "center",
  },
  levelNumber: {
    fontSize: FONTS.xl,
    color: COLORS.textPrimary,
    fontWeight: "700",
  },
  levelLabel: {
    fontSize: FONTS.xs,
    color: BURGUNDY_LIGHT,
  },
  levelInfo: {
    flex: 1,
  },
  levelTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.xs,
  },
  levelTitle: {
    fontSize: FONTS.lg,
    color: COLORS.textPrimary,
    fontWeight: "700",
  },
  totalXPText: {
    fontSize: FONTS.sm,
    color: BURGUNDY,
  },
  levelBarBg: {
    height: 12,
    backgroundColor: COLORS.cardBorder,
    borderRadius: RADIUS.full,
    overflow: "hidden",
    marginBottom: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  levelBarFill: {
    height: "100%",
    backgroundColor: BURGUNDY,
    borderRadius: RADIUS.full,
  },
  levelProgress: {
    fontSize: FONTS.xs,
    color: COLORS.textSecondary,
    letterSpacing: 0.2,
  },

  // Priority / selector row (used for tracking-window buttons)
  priorityRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
    marginBottom: SPACING.md,
    justifyContent: 'space-between',
  },
  priorityBtn: {
    width: '48%',
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  priorityBtnActive: {
    backgroundColor: BURGUNDY,
    borderColor: BURGUNDY,
  },
  priorityBtnText: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sm,
    textTransform: "none",
    fontWeight: "600",
  },
  priorityBtnTextActive: {
    color: COLORS.textPrimaryInvert || '#fff',
  },

  // Section row
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    fontSize: FONTS.lg,
    color: COLORS.textPrimary,
    fontWeight: "600",
  },
  addGoalBtn: {
    backgroundColor: BURGUNDY,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
  },
  addGoalBtnText: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sm,
    fontWeight: "600",
  },

  // Empty state
  emptyCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    alignItems: "center",
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderStyle: "dashed",
  },
  emptyEmoji: {
    fontSize: 40,
    marginBottom: SPACING.sm,
  },
  emptyTitle: {
    fontSize: FONTS.lg,
    color: COLORS.textPrimary,
    fontWeight: "600",
    marginBottom: SPACING.xs,
  },
  emptySubtitle: {
    fontSize: FONTS.sm,
    color: COLORS.textMuted,
    textAlign: "center",
  },

  // Goal Card
  goalCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  completedGoalCard: {
    opacity: 0.7,
    borderColor: COLORS.success,
  },
  goalCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: SPACING.sm,
  },
  goalTitleArea: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  goalTitle: {
    fontSize: FONTS.md,
    color: COLORS.textPrimary,
    fontWeight: "600",
  },
  goalDescription: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  goalPercent: {
    fontSize: FONTS.lg,
    color: BURGUNDY,
    fontWeight: "700",
  },
  goalBarBg: {
    height: 12,
    backgroundColor: COLORS.cardBorder,
    borderRadius: RADIUS.full,
    overflow: "hidden",
    marginBottom: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  goalBarFill: {
    height: "100%",
    backgroundColor: BURGUNDY,
    borderRadius: RADIUS.full,
  },
  goalBarComplete: {
    backgroundColor: COLORS.success,
  },
  goalXPText: {
    fontSize: FONTS.xs,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    letterSpacing: 0.2,
  },
  rewardText: {
    fontSize: FONTS.sm,
    color: COLORS.warning,
    marginBottom: SPACING.sm,
    fontWeight: "600",
  },
  goalActions: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginTop: SPACING.xs,
  },
  addXPBtn: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    backgroundColor: BURGUNDY_LIGHT + "33", // 20% opacity
    borderWidth: 1,
    borderColor: BURGUNDY,
  },
  addXPBtnText: {
    color: BURGUNDY_LIGHT,
    fontSize: FONTS.sm,
    fontWeight: "600",
  },
  deleteBtn: {
    marginLeft: "auto",
    borderColor: COLORS.danger,
    backgroundColor: COLORS.danger + "22",
  },
  deleteBtnText: {
    color: COLORS.danger,
  },

  // Completed badge
  completedBadge: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.success + "33",
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    marginBottom: SPACING.sm,
  },
  completedBadgeText: {
    color: COLORS.success,
    fontSize: FONTS.xs,
    fontWeight: "700",
    letterSpacing: 1,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  modalCardCentered: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    width: '92%',
    maxWidth: 720,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
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
    padding: SPACING.md,
    color: COLORS.textPrimary,
    fontSize: FONTS.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  inputMultiline: {
    height: 80,
    textAlignVertical: "top",
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
  cancelBtnText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.md,
  },
  saveBtn: {
    flex: 2,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: BURGUNDY,
    alignItems: "center",
  },
  saveBtnText: {
    color: COLORS.textPrimary,
    fontSize: FONTS.md,
    fontWeight: "600",
  },
  daysLeftText: {
    fontSize: FONTS.xs,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
});
