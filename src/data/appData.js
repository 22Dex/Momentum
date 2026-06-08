// ============================================================
// DATA — Default/starting data for the app
// Think of this as the "blueprint" for your data shapes.
// When you add a real database later, these shapes stay the same.
// ============================================================

// TIME SECTIONS — the four parts of the day
export const TIME_SECTIONS = [
  {
    id: 'morning',
    label: 'Morning',
    emoji: '🌅',
    timeRange: '6 AM – 12 PM',
    color: '#FFD166',
  },
  {
    id: 'afternoon',
    label: 'Afternoon',
    emoji: '☀️',
    timeRange: '12 PM – 5 PM',
    color: '#06D6A0',
  },
  {
    id: 'evening',
    label: 'Evening',
    emoji: '🌆',
    timeRange: '5 PM – 9 PM',
    color: '#118AB2',
  },
  {
    id: 'night',
    label: 'Night',
    emoji: '🌙',
    timeRange: '9 PM – 12 AM',
    color: '#7B2D8B',
  },
];

// HABIT SHAPE — what a single habit looks like
// When you create a habit, it will look like this object
export const EMPTY_HABIT = {
  id: '',                // Unique ID (you'll generate this)
  title: '',             // Name of the habit
  timeSection: '',       // 'morning', 'afternoon', 'evening', or 'night'
  icon: '⭐',            // Emoji icon for the habit
  xpReward: 10,          // How much XP completing this gives
  streak: 0,             // Current streak (days in a row)
  completedDates: [],    // Array of date strings like '2026-06-07'
  goalTarget: 7,         // Goal: do this X days in a row (or X times)
  goalType: 'streak',    // 'streak' or 'total'
  createdAt: '',         // When the habit was created
};

// TASK SHAPE — what a single task (to-do) looks like
export const EMPTY_TASK = {
  id: '',
  title: '',
  timeSection: '',       // Which part of the day this task belongs to
  isCompleted: false,
  xpReward: 5,
  dueDate: '',           // Date string 'YYYY-MM-DD'
  priority: 'normal',    // 'low', 'normal', 'high'
  createdAt: '',
};

// GOAL SHAPE — for the Progress/Goal Tracker page
export const EMPTY_GOAL = {
  id: '',
  title: '',
  description: '',
  targetXP: 100,         // How much XP needed to complete this goal
  currentXP: 0,          // XP earned so far toward this goal
  isCompleted: false,
  reward: '',            // What you "earn" when done (just a label)
  createdAt: '',
  completedAt: '',
};

// JOURNAL ENTRY SHAPE — for the Tools page
export const EMPTY_JOURNAL_ENTRY = {
  id: '',
  date: '',              // 'YYYY-MM-DD'
  mood: '',              // 'great', 'good', 'okay', 'bad'
  moodEmoji: '😊',
  content: '',           // The actual journal text
  gratitude: '',         // Optional gratitude section
  createdAt: '',
};

// FOCUS SESSION SHAPE — for the Tools page
export const EMPTY_FOCUS_SESSION = {
  id: '',
  date: '',
  durationMinutes: 25,   // Default: 25-minute Pomodoro
  isCompleted: false,
  taskLinked: '',        // Optional: which task this was for
};

// WEEKLY REVIEW SHAPE — for the Tools page
export const EMPTY_WEEKLY_REVIEW = {
  id: '',
  weekStart: '',         // Date string for Monday of that week
  wins: '',              // What went well
  improvements: '',      // What to do better
  nextWeekGoal: '',      // Main goal for next week
  overallRating: 3,      // 1-5 stars
  createdAt: '',
};

// SAMPLE DATA — Remove this when you have real data!
// This just shows you what filled-in data looks like.
export const SAMPLE_HABITS = [
  {
    id: 'h1',
    title: 'Morning Meditation',
    timeSection: 'morning',
    icon: '🧘',
    xpReward: 15,
    streak: 5,
    completedDates: ['2026-06-01', '2026-06-02', '2026-06-03', '2026-06-04', '2026-06-05'],
    goalTarget: 30,
    goalType: 'streak',
    createdAt: '2026-06-01',
  },
  {
    id: 'h2',
    title: 'Read 20 Minutes',
    timeSection: 'night',
    icon: '📚',
    xpReward: 10,
    streak: 3,
    completedDates: ['2026-06-03', '2026-06-04', '2026-06-05'],
    goalTarget: 21,
    goalType: 'streak',
    createdAt: '2026-06-01',
  },
];

export const SAMPLE_TASKS = [
  {
    id: 't1',
    title: 'Review project notes',
    timeSection: 'morning',
    isCompleted: false,
    xpReward: 10,
    dueDate: '2026-06-07',
    priority: 'high',
    createdAt: '2026-06-06',
  },
  {
    id: 't2',
    title: 'Reply to emails',
    timeSection: 'afternoon',
    isCompleted: true,
    xpReward: 5,
    dueDate: '2026-06-07',
    priority: 'normal',
    createdAt: '2026-06-06',
  },
];
