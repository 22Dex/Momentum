// ============================================================
// TOOLS SCREEN — Journal, Focus Timer & Weekly Review
//
// WHAT THIS SHOWS:
//  This screen has three sections, accessed by tabs at the top:
//
//  📓 JOURNAL TAB:
//   - Streak counter (days in a row you journaled)
//   - Today's mood selector
//   - Text input for today's journal entry
//   - Optional gratitude field
//   - Scrollable list of past journal entries
//
//  ⏱ FOCUS TAB:
//   - Focus minutes tracker (total minutes focused this week)
//   - A simple countdown timer (default 25 minutes / Pomodoro)
//   - Start/Pause/Reset controls
//   - Log of recent focus sessions
//
//  📋 WEEKLY REVIEW TAB:
//   - Form to fill in wins, improvements, next week's goal
//   - 1-5 star rating for the week
//   - List of past weekly reviews
//
// SPLIT THESE INTO COMPONENTS LATER:
//  - <TabBar tabs={[]} activeTab={} onTabChange={} /> — the top tab switcher
//  - <StreakBadge count={n} label="Journal Streak" /> — streak display
//  - <MoodSelector mood={} onSelect={} /> — emoji mood buttons
//  - <JournalEntryCard entry={} /> — a single past entry
//  - <FocusTimer onComplete={} /> — the countdown timer logic + UI
//  - <FocusSessionList sessions={[]} /> — list of past sessions
//  - <WeeklyReviewForm onSave={} /> — the weekly review form
//  - <WeeklyReviewCard review={} /> — a past review card
// ============================================================

import { useEffect, useRef, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAppState } from "../../hooks/useAppState";
import { COLORS, FONTS, RADIUS, SPACING } from "../../theme/Themes";
import {
  formatDateLabel,
  formatTimer,
  getTodayString,
  getTotalFocusMinutes,
} from "../../utils/helpers";

// Tabs for this screen
const TABS = [
  { id: "journal", label: "📓 Journal" },
  { id: "focus", label: "⏱ Focus" },
  { id: "review", label: "📋 Review" },
];

// Mood options for the journal
const MOODS = [
  { id: "great", emoji: "😄", label: "Great" },
  { id: "good", emoji: "😊", label: "Good" },
  { id: "okay", emoji: "😐", label: "Okay" },
  { id: "bad", emoji: "😞", label: "Bad" },
];

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function ToolsScreen() {
  const {
    journalEntries,
    addJournalEntry,
    focusSessions,
    addFocusSession,
    weeklyReviews,
    addWeeklyReview,
  } = useAppState();

  // Active tab
  const [activeTab, setActiveTab] = useState("journal");

  // ---- Journal state ----
  const [journalMood, setJournalMood] = useState("good");
  const [journalContent, setJournalContent] = useState("");
  const [journalGratitude, setJournalGratitude] = useState("");

  // ---- Focus Timer state ----
  const [focusDuration, setFocusDuration] = useState(25); // minutes
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null); // Holds the interval reference

  // ---- Weekly Review state ----
  const [reviewWins, setReviewWins] = useState("");
  const [reviewImprovements, setReviewImprovements] = useState("");
  const [reviewNextGoal, setReviewNextGoal] = useState("");
  const [reviewRating, setReviewRating] = useState(3);
  const [menu, setMenu] = useState(false);

  const today = getTodayString();

  // ---- Journal streak calculation ----
  // Count how many days in a row you've journaled (ending today or yesterday)
  const journalStreak = (() => {
    if (journalEntries.length === 0) return 0;
    const dates = [...new Set(journalEntries.map((e) => e.date))]
      .sort()
      .reverse();
    let streak = 0;
    let expected = today;
    for (const date of dates) {
      if (date === expected) {
        streak++;
        const d = new Date(expected + "T00:00:00");
        d.setDate(d.getDate() - 1);
        expected = d.toISOString().split("T")[0];
      } else {
        break;
      }
    }
    return streak;
  })();

  // ---- Focus timer logic ----
  // useEffect runs when isRunning changes. It starts/stops the interval.
  useEffect(() => {
    if (isRunning) {
      // Start the countdown
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            // Timer done!
            clearInterval(timerRef.current);
            setIsRunning(false);
            addFocusSession(focusDuration); // Save the session
            Alert.alert(
              "Session complete! 🎉",
              `You focused for ${focusDuration} minutes!`,
            );
            return focusDuration * 60; // Reset timer
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      // Pause: clear the interval
      clearInterval(timerRef.current);
    }

    // Cleanup when component unmounts or isRunning changes
    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  function resetTimer() {
    setIsRunning(false);
    setSecondsLeft(focusDuration * 60);
  }

  function changeDuration(minutes) {
    setFocusDuration(minutes);
    setSecondsLeft(minutes * 60);
    setIsRunning(false);
  }

  // Total focus minutes this week
  const totalFocusMinutes = getTotalFocusMinutes(focusSessions);

  // ---- Journal save ----
  function handleSaveJournal() {
    if (!journalContent.trim()) {
      Alert.alert("Oops!", "Write something in your journal first!");
      return;
    }
    addJournalEntry({
      mood: journalMood,
      moodEmoji: MOODS.find((m) => m.id === journalMood)?.emoji || "😊",
      content: journalContent.trim(),
      gratitude: journalGratitude.trim(),
    });
    setJournalContent("");
    setJournalGratitude("");
    Alert.alert("Saved! ✨", "Journal entry saved.");
  }

  // ---- Weekly review save ----
  function handleSaveReview() {
    if (!reviewWins.trim()) {
      Alert.alert("Oops!", "Write at least one win for the week!");
      return;
    }
    addWeeklyReview({
      weekStart: today,
      wins: reviewWins.trim(),
      improvements: reviewImprovements.trim(),
      nextWeekGoal: reviewNextGoal.trim(),
      overallRating: reviewRating,
    });
    setReviewWins("");
    setReviewImprovements("");
    setReviewNextGoal("");
    setReviewRating(3);
    Alert.alert("Review saved! 📋", "Great job reflecting on your week.");
  }

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ---- TAB BAR ---- */}
      {/* SPLIT INTO: <TabBar /> */}
      <View style={styles.tabBar}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.tabActive]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.id && styles.tabTextActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* ============================================================
            JOURNAL TAB
            ============================================================ */}
        {activeTab === "journal" && (
          <View>
            {/* Streak + Focus Minutes row */}
            {/* SPLIT INTO: <StreakBadge /> */}
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statEmoji}>🔥</Text>
                <Text style={styles.statBigNumber}>{journalStreak}</Text>
                <Text style={styles.statCardLabel}>Journal Streak</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statEmoji}>⏱</Text>
                <Text style={styles.statBigNumber}>{totalFocusMinutes}</Text>
                <Text style={styles.statCardLabel}>Focus Minutes</Text>
              </View>
            </View>

            {/* Today's journal entry form */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Today's Entry</Text>
              <Text style={styles.cardSubtitle}>{formatDateLabel(today)}</Text>

              {/* Mood selector */}
              {/* SPLIT INTO: <MoodSelector /> */}
              <Text style={styles.inputLabel}>How are you feeling?</Text>
              <View style={styles.moodRow}>
                {MOODS.map((mood) => (
                  <TouchableOpacity
                    key={mood.id}
                    style={[
                      styles.moodBtn,
                      journalMood === mood.id && styles.moodBtnActive,
                    ]}
                    onPress={() => setJournalMood(mood.id)}
                  >
                    <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                    <Text style={styles.moodLabel}>{mood.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Journal text input */}
              <Text style={styles.inputLabel}>Journal</Text>
              <TextInput
                style={[styles.input, styles.inputMultiline]}
                placeholder="Write about your day..."
                placeholderTextColor={COLORS.textMuted}
                value={journalContent}
                onChangeText={setJournalContent}
                multiline
                numberOfLines={5}
              />

              {/* Gratitude section */}
              <Text style={styles.inputLabel}>
                What are you grateful for? (optional)
              </Text>
              <TextInput
                style={[styles.input, styles.inputMultilineSmall]}
                placeholder="I'm grateful for..."
                placeholderTextColor={COLORS.textMuted}
                value={journalGratitude}
                onChangeText={setJournalGratitude}
                multiline
                numberOfLines={3}
              />

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveJournal}
              >
                <Text style={styles.saveButtonText}>Save Entry ✨</Text>
              </TouchableOpacity>
            </View>

            {/* Past journal entries */}
            {/* SPLIT INTO: <JournalEntryCard entry={} /> */}
            {journalEntries.length > 0 && (
              <Text style={styles.sectionTitle}>Past Entries</Text>
            )}
            {journalEntries.map((entry) => (
              <View key={entry.id} style={styles.entryCard}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryEmoji}>{entry.moodEmoji}</Text>
                  <View>
                    <Text style={styles.entryDate}>
                      {formatDateLabel(entry.date)}
                    </Text>
                    <Text style={styles.entryMood}>{entry.mood}</Text>
                  </View>
                </View>
                <Text style={styles.entryContent} numberOfLines={3}>
                  {entry.content}
                </Text>
                {entry.gratitude ? (
                  <Text style={styles.entryGratitude}>
                    🙏 {entry.gratitude}
                  </Text>
                ) : null}
              </View>
            ))}
          </View>
        )}

        {/* ============================================================
            FOCUS TAB
            SPLIT INTO: <FocusTimer /> + <FocusSessionList />
            ============================================================ */}
        {activeTab === "focus" && (
          <View>
            {/* Focus minutes tracker */}
            <View style={styles.statsRow}>
              <View style={[styles.statCard, { flex: 1 }]}>
                <Text style={styles.statEmoji}>⏱</Text>
                <Text style={styles.statBigNumber}>{totalFocusMinutes}</Text>
                <Text style={styles.statCardLabel}>Total Focus Minutes</Text>
              </View>
              <View style={[styles.statCard, { flex: 1 }]}>
                <Text style={styles.statEmoji}>🧘</Text>
                <Text style={styles.statBigNumber}>
                  {focusSessions.filter((s) => s.isCompleted).length}
                </Text>
                <Text style={styles.statCardLabel}>Sessions Done</Text>
              </View>
            </View>

            {/* Timer display */}
            <View style={styles.timerCard}>
              <Text style={styles.timerDisplay}>
                {formatTimer(secondsLeft)}
              </Text>
              <Text style={styles.timerSubtext}>
                {isRunning ? "● Focusing..." : "Ready to focus"}
              </Text>

              {/* Duration selector buttons */}
              <View style={styles.durationRow}>
                {[5, 15, 25, 50].map((mins) => (
                  <TouchableOpacity
                    key={mins}
                    style={[
                      styles.durationBtn,
                      focusDuration === mins && styles.durationBtnActive,
                    ]}
                    onPress={() => changeDuration(mins)}
                  >
                    <Text style={styles.durationBtnText}>{mins}m</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Timer controls */}
              <View style={styles.timerControls}>
                <TouchableOpacity style={styles.resetBtn} onPress={resetTimer}>
                  <Text style={styles.resetBtnText}>Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.startBtn, isRunning && styles.pauseBtn]}
                  onPress={() => setIsRunning((r) => !r)}
                >
                  <Text style={styles.startBtnText}>
                    {isRunning ? "⏸ Pause" : "▶ Start"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Recent sessions */}
            {focusSessions.length > 0 && (
              <Text style={styles.sectionTitle}>Recent Sessions</Text>
            )}
            {focusSessions.slice(0, 10).map((session) => (
              <View key={session.id} style={styles.sessionRow}>
                <Text style={styles.sessionIcon}>⏱</Text>
                <Text style={styles.sessionDuration}>
                  {session.durationMinutes} min
                </Text>
                <Text style={styles.sessionDate}>
                  {formatDateLabel(session.date)}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* ============================================================
            WEEKLY REVIEW TAB
            SPLIT INTO: <WeeklyReviewForm /> + <WeeklyReviewCard />
            ============================================================ */}
        {activeTab === "review" && (
          <View>
            {/* Review form */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Weekly Review</Text>
              <Text style={styles.cardSubtitle}>Reflect on your week</Text>

              <Text style={styles.inputLabel}>
                🏆 What went well this week?
              </Text>
              <TextInput
                style={[styles.input, styles.inputMultilineSmall]}
                placeholder="Your wins, achievements, proud moments..."
                placeholderTextColor={COLORS.textMuted}
                value={reviewWins}
                onChangeText={setReviewWins}
                multiline
                numberOfLines={3}
              />

              <Text style={styles.inputLabel}>📈 What could be better?</Text>
              <TextInput
                style={[styles.input, styles.inputMultilineSmall]}
                placeholder="Areas to improve, habits to build..."
                placeholderTextColor={COLORS.textMuted}
                value={reviewImprovements}
                onChangeText={setReviewImprovements}
                multiline
                numberOfLines={3}
              />

              <Text style={styles.inputLabel}>🎯 Main goal for next week</Text>
              <TextInput
                style={styles.input}
                placeholder="One thing to focus on..."
                placeholderTextColor={COLORS.textMuted}
                value={reviewNextGoal}
                onChangeText={setReviewNextGoal}
              />

              {/* Star rating */}
              {/* SPLIT INTO: <StarRating rating={} onChange={} /> */}
              <Text style={styles.inputLabel}>Overall week rating</Text>
              <View style={styles.starRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setReviewRating(star)}
                  >
                    <Text
                      style={[
                        styles.star,
                        star <= reviewRating && styles.starActive,
                      ]}
                    >
                      ★
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveReview}
              >
                <Text style={styles.saveButtonText}>Save Review 📋</Text>
              </TouchableOpacity>
            </View>

            {/* Past reviews */}
            {/* SPLIT INTO: <WeeklyReviewCard review={} /> */}
            {weeklyReviews.length > 0 && (
              <Text style={styles.sectionTitle}>Past Reviews</Text>
            )}
            {weeklyReviews.map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewDate}>
                    Week of {formatDateLabel(review.weekStart)}
                  </Text>
                  <Text style={styles.reviewStars}>
                    {"★".repeat(review.overallRating)}
                    {"☆".repeat(5 - review.overallRating)}
                  </Text>
                </View>
                <Text style={styles.reviewLabel}>🏆 Wins</Text>
                <Text style={styles.reviewContent}>{review.wins}</Text>
                {review.nextWeekGoal ? (
                  <>
                    <Text style={styles.reviewLabel}>🎯 Next week goal</Text>
                    <Text style={styles.reviewContent}>
                      {review.nextWeekGoal}
                    </Text>
                  </>
                ) : null}
              </View>
            ))}
          </View>
        )}

        <View style={{ height: SPACING.xxl }} />
      </ScrollView>
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

  // Tab bar at top
  tabBar: {
    flexDirection: "row",
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: "center",
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: FONTS.sm,
    color: COLORS.textMuted,
  },
  tabTextActive: {
    color: COLORS.primary,
    fontWeight: "600",
  },

  container: {
    flex: 1,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
  },

  // Stat cards row
  statsRow: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  statEmoji: {
    fontSize: FONTS.xl,
    marginBottom: SPACING.xs,
  },
  statBigNumber: {
    fontSize: FONTS.xxl,
    color: COLORS.textPrimary,
    fontWeight: "700",
  },
  statCardLabel: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
    textAlign: "center",
  },

  // Card
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  cardTitle: {
    fontSize: FONTS.lg,
    color: COLORS.textPrimary,
    fontWeight: "700",
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },

  // Labels + inputs
  inputLabel: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    marginTop: SPACING.sm,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    color: COLORS.textPrimary,
    fontSize: FONTS.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: SPACING.sm,
  },
  inputMultiline: {
    height: 120,
    textAlignVertical: "top",
  },
  inputMultilineSmall: {
    height: 80,
    textAlignVertical: "top",
  },

  // Mood selector
  moodRow: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  moodBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    backgroundColor: COLORS.background,
  },
  moodBtnActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + "33",
  },
  moodEmoji: {
    fontSize: FONTS.xl,
  },
  moodLabel: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },

  // Save button
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: "center",
    marginTop: SPACING.sm,
  },
  saveButtonText: {
    color: COLORS.textPrimary,
    fontSize: FONTS.md,
    fontWeight: "600",
  },

  // Section title
  sectionTitle: {
    fontSize: FONTS.lg,
    color: COLORS.textPrimary,
    fontWeight: "600",
    marginBottom: SPACING.sm,
    marginTop: SPACING.sm,
  },

  // Journal entry card
  entryCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  entryHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  entryEmoji: {
    fontSize: FONTS.xxl,
  },
  entryDate: {
    fontSize: FONTS.sm,
    color: COLORS.textPrimary,
    fontWeight: "600",
  },
  entryMood: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
    textTransform: "capitalize",
  },
  entryContent: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  entryGratitude: {
    fontSize: FONTS.sm,
    color: COLORS.warning,
    marginTop: SPACING.sm,
  },

  // Timer
  timerCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: "center",
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  timerDisplay: {
    fontSize: 64,
    color: COLORS.textPrimary,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
    letterSpacing: 4,
  },
  timerSubtext: {
    fontSize: FONTS.sm,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
    marginBottom: SPACING.md,
  },
  durationRow: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  durationBtn: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  durationBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  durationBtnText: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sm,
  },
  timerControls: {
    flexDirection: "row",
    gap: SPACING.sm,
    width: "100%",
  },
  resetBtn: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    alignItems: "center",
  },
  resetBtnText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.md,
  },
  startBtn: {
    flex: 2,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.success,
    alignItems: "center",
  },
  pauseBtn: {
    backgroundColor: COLORS.warning,
  },
  startBtnText: {
    color: COLORS.textPrimary,
    fontSize: FONTS.md,
    fontWeight: "700",
  },

  // Focus session row
  sessionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  sessionIcon: {
    fontSize: FONTS.lg,
  },
  sessionDuration: {
    fontSize: FONTS.md,
    color: COLORS.textPrimary,
    fontWeight: "600",
    flex: 1,
  },
  sessionDate: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
  },

  // Weekly review
  starRow: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  star: {
    fontSize: 30,
    color: COLORS.cardBorder,
  },
  starActive: {
    color: COLORS.xpBar,
  },
  reviewCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  reviewDate: {
    fontSize: FONTS.sm,
    color: COLORS.textPrimary,
    fontWeight: "600",
  },
  reviewStars: {
    fontSize: FONTS.md,
    color: COLORS.xpBar,
  },
  reviewLabel: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
    marginBottom: 2,
    marginTop: SPACING.sm,
  },
  reviewContent: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});
