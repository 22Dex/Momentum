// ============================================================
// THEME — Colors, font sizes, spacing
// All your app's visual constants live here.
// Change a value here and it updates everywhere in the app.
// ============================================================

export const COLORS = {
  // Main brand colors
  primary: '#6C63FF',        // Purple — buttons, active states
  primaryLight: '#A89CFF',   // Lighter purple — backgrounds
  accent: '#FF6584',         // Pink — streaks, highlights
  success: '#43D19E',        // Green — completed tasks
  warning: '#FFB74D',        // Orange — in-progress
  danger: '#FF5252',         // Red — missed/overdue

  // Backgrounds
  background: '#0F0F1A',     // Dark navy — main screen bg
  card: '#1A1A2E',           // Slightly lighter — card bg
  cardBorder: '#2A2A45',     // Subtle border color

  // Text
  textPrimary: '#FFFFFF',    // White — main text
  textSecondary: '#A0A0C0',  // Muted — subtitles, labels
  textMuted: '#606080',      // Very muted — placeholder text

  // Time-of-day section colors
  morning: '#FFD166',        // Warm yellow
  afternoon: '#06D6A0',      // Teal/green
  evening: '#118AB2',        // Blue
  night: '#7B2D8B',          // Deep purple

  // XP / Progress bar
  xpBar: '#FFD700',          // Gold for XP bar
  xpBarBg: '#2A2A45',        // Dark background behind XP bar
};

export const FONTS = {
  // Font sizes — think of these like a scale
  xs: 11,
  sm: 13,
  md: 15,
  lg: 18,
  xl: 22,
  xxl: 28,
  xxxl: 36,
};

export const SPACING = {
  // Use these instead of raw numbers for consistent spacing
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const RADIUS = {
  // Border radius values
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999, // Makes a perfect circle/pill shape
};
