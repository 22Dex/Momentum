// ============================================================
// useAppState — Global state for the whole app
//
// WHAT IS THIS?
// This is a custom "hook" that holds all your app's data in one place.
// Every screen can read and update this data.
//
// HOW IT WORKS:
// 1. AppProvider wraps your whole app (see App.js)
// 2. Any screen calls useAppState() to get the data + functions
// 3. When data changes, screens automatically re-render
//
// LATER: Replace useState with AsyncStorage or a real database
// ============================================================

import React, { createContext, useContext, useState } from 'react';
import {
  generateId,
  getTodayString,
  calculateStreak,
  getHabitBaseXP,
  computeXPForAmount,
} from '../utils/helpers';
import { SAMPLE_HABITS, SAMPLE_TASKS } from '../data/appData';

// Step 1: Create the "container" for our global state
const AppContext = createContext(null);

// Step 2: The Provider — wrap your app with this in App.js
export function AppProvider({ children }) {
  // ------- HABITS STATE -------
  // habits = the array of all habits
  // setHabits = function to update the habits array
  const [habits, setHabits] = useState(SAMPLE_HABITS); // Start with sample data

  // ------- TASKS STATE -------
  const [tasks, setTasks] = useState(SAMPLE_TASKS);

  // ------- GOALS STATE -------
  const [goals, setGoals] = useState([]);

  // ------- JOURNAL STATE -------
  const [journalEntries, setJournalEntries] = useState([]);

  // ------- FOCUS SESSIONS STATE -------
  const [focusSessions, setFocusSessions] = useState([]);

  // ------- WEEKLY REVIEWS STATE -------
  const [weeklyReviews, setWeeklyReviews] = useState([]);

  // ------- XP STATE -------
  // totalXP is the global XP bar at the top of the app
  const [totalXP, setTotalXP] = useState(0);

  // ------- STREAK STATE -------
  // Overall app streak (days you've opened the app and done something)
  const [appStreak, setAppStreak] = useState(0);

  // =============================================
  // HABIT FUNCTIONS
  // =============================================

  /** Add a new habit to the list */
  function addHabit(habitData) {
    const newHabit = {
      ...habitData,
      id: generateId('habit'),
      streak: 0,
      completedDates: [],
      createdAt: getTodayString(),
    };
    setHabits((prev) => [...prev, newHabit]);
  }

  /** Delete a habit by its ID */
  function deleteHabit(habitId) {
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
  }

  /** Mark a habit as complete (or un-complete) for today */
  /**
   * Toggle or log a habit for today.
   * If `amount` is provided (and habit.measureType === 'amount'), compute proportional XP.
   * Otherwise behave like a binary/streak toggle and award base XP.
   */
  function toggleHabitToday(habitId, amount = null) {
    const today = getTodayString();
    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id !== habitId) return habit; // Not this habit, skip

        const alreadyDone = habit.completedDates.includes(today);
        let newDates = habit.completedDates;

        if (habit.measureType === 'amount') {
          // amount-style logging: adding a log entry for today
          if (amount == null) return habit; // require amount to log

          // If already done today, remove existing log and subtract XP
          if (alreadyDone) {
            // remove today's log(s)
            const todaysLogs = (habit.logs || []).filter((l) => l.date === today);
            const xpToRemove = todaysLogs.reduce((s, l) => s + (l.xp || 0), 0);
            newDates = habit.completedDates.filter((d) => d !== today);
            setTotalXP((xp) => Math.max(0, xp - xpToRemove));
            return {
              ...habit,
              completedDates: newDates,
              logs: (habit.logs || []).filter((l) => l.date !== today),
              streak: calculateStreak(newDates),
            };
          }

          // Compute XP for the amount logged and add a log entry
          const xpEarned = computeXPForAmount(habit, amount);
          const newLog = { date: today, amount, xp: xpEarned };
          newDates = [...(habit.completedDates || []), today];
          setTotalXP((xp) => xp + xpEarned);

          return {
            ...habit,
            completedDates: newDates,
            logs: [...(habit.logs || []), newLog],
            streak: calculateStreak(newDates),
          };
        } else {
          // binary/streak habit
          if (alreadyDone) {
            // Un-complete it: remove today from the list and subtract base XP
            newDates = habit.completedDates.filter((d) => d !== today);
            const base = getHabitBaseXP(habit);
            setTotalXP((xp) => Math.max(0, xp - base));
          } else {
            // Complete it: add today to the list + earn base XP
            newDates = [...habit.completedDates, today];
            const base = getHabitBaseXP(habit);
            setTotalXP((xp) => xp + base);
          }

          return {
            ...habit,
            completedDates: newDates,
            streak: calculateStreak(newDates), // Recalculate streak
          };
        }
      })
    );
  }

  // =============================================
  // TASK FUNCTIONS
  // =============================================

  /** Add a new task */
  function addTask(taskData) {
    const newTask = {
      ...taskData,
      id: generateId('task'),
      isCompleted: false,
      createdAt: getTodayString(),
    };
    setTasks((prev) => [...prev, newTask]);
  }

  /** Delete a task by ID */
  function deleteTask(taskId) {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  }

  /** Toggle a task's completed status */
  function toggleTask(taskId) {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== taskId) return task;

        const nowComplete = !task.isCompleted;
        if (nowComplete) {
          setTotalXP((xp) => xp + task.xpReward); // Give XP when completed
        } else {
          setTotalXP((xp) => Math.max(0, xp - task.xpReward)); // Remove XP if un-done
        }

        return { ...task, isCompleted: nowComplete };
      })
    );
  }

  // =============================================
  // GOAL FUNCTIONS
  // =============================================

  /** Add a new goal */
  function addGoal(goalData) {
    const newGoal = {
      ...goalData,
      id: generateId('goal'),
      currentXP: 0,
      isCompleted: false,
      createdAt: getTodayString(),
      completedAt: '',
    };
    setGoals((prev) => [...prev, newGoal]);
  }

  /** Add XP progress to a specific goal */
  function addGoalXP(goalId, xpAmount) {
    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id !== goalId) return goal;

        const newXP = Math.min(goal.targetXP, goal.currentXP + xpAmount);
        const isNowComplete = newXP >= goal.targetXP;

        return {
          ...goal,
          currentXP: newXP,
          isCompleted: isNowComplete,
          completedAt: isNowComplete ? getTodayString() : '',
        };
      })
    );
  }

  /** Delete a goal */
  function deleteGoal(goalId) {
    setGoals((prev) => prev.filter((g) => g.id !== goalId));
  }

  // =============================================
  // JOURNAL FUNCTIONS
  // =============================================

  /** Add a new journal entry */
  function addJournalEntry(entryData) {
    const newEntry = {
      ...entryData,
      id: generateId('journal'),
      date: getTodayString(),
      createdAt: new Date().toISOString(),
    };
    setJournalEntries((prev) => [newEntry, ...prev]); // Newest first
  }

  // =============================================
  // FOCUS SESSION FUNCTIONS
  // =============================================

  /** Record a completed focus session */
  function addFocusSession(durationMinutes) {
    const newSession = {
      id: generateId('focus'),
      date: getTodayString(),
      durationMinutes,
      isCompleted: true,
    };
    setFocusSessions((prev) => [newSession, ...prev]);
    setTotalXP((xp) => xp + Math.floor(durationMinutes / 5)); // 1 XP per 5 min
  }

  // =============================================
  // WEEKLY REVIEW FUNCTIONS
  // =============================================

  /** Save a weekly review */
  function addWeeklyReview(reviewData) {
    const newReview = {
      ...reviewData,
      id: generateId('review'),
      createdAt: new Date().toISOString(),
    };
    setWeeklyReviews((prev) => [newReview, ...prev]);
  }

  // =============================================
  // WHAT WE SHARE with all screens
  // =============================================
  const value = {
    // Data
    habits,
    tasks,
    goals,
    journalEntries,
    focusSessions,
    weeklyReviews,
    totalXP,
    appStreak,

    // Habit functions
    addHabit,
    deleteHabit,
    toggleHabitToday,

    // Task functions
    addTask,
    deleteTask,
    toggleTask,

    // Goal functions
    addGoal,
    addGoalXP,
    deleteGoal,

    // Journal functions
    addJournalEntry,

    // Focus functions
    addFocusSession,

    // Weekly review functions
    addWeeklyReview,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Step 3: The hook — call this in any screen to get data + functions
// Example usage in a screen:
//   const { habits, toggleHabitToday } = useAppState();
export function useAppState() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppState must be used inside AppProvider');
  }
  return context;
}
