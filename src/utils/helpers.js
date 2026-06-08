// ============================================================
// UTILS — Helper functions used across the whole app
// These are small tools that do one thing well.
// ============================================================

// ------- DATE HELPERS -------

/**
 * Returns today's date as a string like '2026-06-07'
 * Use this any time you need to save "today's date"
 */
export function getTodayString() {
  const today = new Date();
  return today.toISOString().split('T')[0]; // Just the YYYY-MM-DD part
}

/**
 * Formats a date string into a human-friendly label
 * Example: '2026-06-07' → 'Sunday, June 7'
 */
export function formatDateLabel(dateString) {
  const date = new Date(dateString + 'T00:00:00'); // force local time
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Returns all 7 dates for the current week (Mon–Sun)
 * Useful for the weekly overview calendar strip
 */
export function getCurrentWeekDates() {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday...
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const week = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + mondayOffset + i);
    week.push(d.toISOString().split('T')[0]);
  }
  return week; // Array of 7 date strings
}

/**
 * Returns the short day name for a date string
 * Example: '2026-06-07' → 'Sun'
 */
export function getShortDayName(dateString) {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

/**
 * Checks if a habit was completed on a specific date
 */
export function wasCompletedOn(habit, dateString) {
  return habit.completedDates.includes(dateString);
}

/**
 * Checks if a habit was completed today
 */
export function wasCompletedToday(habit) {
  return wasCompletedOn(habit, getTodayString());
}

// ------- ID GENERATOR -------

/**
 * Creates a simple unique ID for new habits/tasks/etc.
 * Example output: 'id_1718000000000_abc12'
 */
export function generateId(prefix = 'id') {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 7);
  return `${prefix}_${timestamp}_${random}`;
}

// ------- XP HELPERS -------

/**
 * Calculates what percentage of a goal's XP is filled
 * Returns a number 0–100
 * Example: goalXP=50, targetXP=100 → 50
 */
export function getXPPercent(currentXP, targetXP) {
  if (targetXP === 0) return 0;
  return Math.min(100, Math.round((currentXP / targetXP) * 100));
}

/**
 * Calculates the total XP earned today from completed habits
 */
export function getTodayXP(habits) {
  const today = getTodayString();
  return habits
    .filter((h) => h.completedDates.includes(today))
    .reduce((total, h) => total + h.xpReward, 0);
}

/**
 * Calculates total XP ever earned (all time)
 */
export function getTotalXP(habits) {
  return habits.reduce((total, h) => {
    return total + h.completedDates.length * h.xpReward;
  }, 0);
}

// ------- STREAK HELPERS -------

/**
 * Calculates the current streak for a habit
 * A streak = how many days in a row (ending today or yesterday) it was completed
 */
export function calculateStreak(completedDates) {
  if (!completedDates || completedDates.length === 0) return 0;

  // Sort dates newest first
  const sorted = [...completedDates].sort().reverse();
  const today = getTodayString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayString = yesterday.toISOString().split('T')[0];

  // Streak must include today or yesterday to still be "active"
  if (sorted[0] !== today && sorted[0] !== yesterdayString) return 0;

  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const current = new Date(sorted[i - 1] + 'T00:00:00');
    const prev = new Date(sorted[i] + 'T00:00:00');
    const diff = (current - prev) / (1000 * 60 * 60 * 24); // days between
    if (diff === 1) {
      streak++;
    } else {
      break; // Gap found, streak is over
    }
  }
  return streak;
}

// ------- TASK HELPERS -------

/**
 * Groups tasks by their time section
 * Returns an object like: { morning: [...], afternoon: [...], ... }
 */
export function groupTasksBySection(tasks) {
  const groups = { morning: [], afternoon: [], evening: [], night: [] };
  tasks.forEach((task) => {
    if (groups[task.timeSection]) {
      groups[task.timeSection].push(task);
    }
  });
  return groups;
}

/**
 * Counts how many tasks are completed vs total
 * Returns: { completed: 2, total: 5 }
 */
export function getTaskProgress(tasks) {
  return {
    completed: tasks.filter((t) => t.isCompleted).length,
    total: tasks.length,
  };
}

// ------- FOCUS TIME -------

/**
 * Formats seconds into a MM:SS string
 * Example: 90 → '1:30'
 */
export function formatTimer(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Sums total focus minutes from completed sessions
 */
export function getTotalFocusMinutes(sessions) {
  return sessions
    .filter((s) => s.isCompleted)
    .reduce((total, s) => total + s.durationMinutes, 0);
}
