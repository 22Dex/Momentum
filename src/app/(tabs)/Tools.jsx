import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Svg, { Circle } from "react-native-svg";
import { useAppState } from "../../hooks/useAppState";
import { COLORS, FONTS, RADIUS, SPACING } from "../../theme/Themes";
import { formatTimer, getTotalFocusMinutes } from "../../utils/helpers";

export default function ToolsScreen() {
  const { focusSessions, addFocusSession } = useAppState();
  const router = useRouter();

  const [focusDuration, setFocusDuration] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  const totalFocusMinutes = getTotalFocusMinutes(focusSessions);

  useEffect(() => {
    if (!isRunning) {
      clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setIsRunning(false);
          addFocusSession(focusDuration);
          Alert.alert(
            "Session complete! 🎉",
            `You focused for ${focusDuration} minutes!`,
          );
          return focusDuration * 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [focusDuration, isRunning, addFocusSession]);

  function resetTimer() {
    setIsRunning(false);
    setSecondsLeft(focusDuration * 60);
  }

  function changeDuration(minutes) {
    setFocusDuration(minutes);
    setSecondsLeft(minutes * 60);
    setIsRunning(false);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Tools</Text>
          <Text style={styles.subtitle}>Focus, settings, and account</Text>
        </View>

        <View style={styles.timerCard}>
          <View style={styles.timerRingWrap}>
            <Svg width={320} height={320} viewBox="0 0 320 320">
              <Circle
                cx="160"
                cy="160"
                r="126"
                stroke={COLORS.cardBorder}
                strokeWidth={10}
                fill="transparent"
              />
              <Circle
                cx="160"
                cy="160"
                r="126"
                stroke={COLORS.primary}
                strokeWidth={10}
                fill="transparent"
                strokeDasharray={2 * Math.PI * 126}
                strokeDashoffset={
                  2 *
                  Math.PI *
                  126 *
                  (1 -
                    Math.min(
                      1,
                      Math.max(
                        0,
                        (focusDuration * 60 - secondsLeft) /
                          (focusDuration * 60),
                      ),
                    ))
                }
                strokeLinecap="round"
                rotation={-90}
                originX="160"
                originY="160"
              />
            </Svg>

            <View style={styles.timerCenter}>
              <Text style={styles.timerDisplay}>
                {formatTimer(secondsLeft)}
              </Text>
              <Text style={styles.timerSubtext}>
                {isRunning ? "Focus mode" : "Ready when you are"}
              </Text>
            </View>
          </View>

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
                <Text style={styles.durationBtnText}>
                  {mins === 5 || mins === 15 ? `${mins}m break` : `${mins}m`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.timerControls}>
            <TouchableOpacity style={styles.resetBtn} onPress={resetTimer}>
              <Text style={styles.resetBtnText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.startBtn, isRunning && styles.pauseBtn]}
              onPress={() => setIsRunning((r) => !r)}
            >
              <Text style={styles.startBtnText}>
                {isRunning ? "Pause" : "Start"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>⏱</Text>
            <Text style={styles.statBigNumber}>{totalFocusMinutes}</Text>
            <Text style={styles.statCardLabel}>Focused Minutes</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>📈</Text>
            <Text style={styles.statBigNumber}>
              {focusSessions.filter((s) => s.isCompleted).length}
            </Text>
            <Text style={styles.statCardLabel}>Sessions</Text>
          </View>
        </View>

        <View style={styles.utilityStack}>
          <TouchableOpacity
            style={styles.utilityCard}
            onPress={() => router.push("/Account")}
          >
            <Text style={styles.utilityEmoji}>👤</Text>
            <View style={styles.utilityTextWrap}>
              <Text style={styles.utilityTitle}>Account</Text>
              <Text style={styles.utilityMeta}>Profile and preferences</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.utilityCard}
            onPress={() => router.push("/settings")}
          >
            <Text style={styles.utilityEmoji}>⚙️</Text>
            <View style={styles.utilityTextWrap}>
              <Text style={styles.utilityTitle}>Settings</Text>
              <Text style={styles.utilityMeta}>App controls</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  header: {
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONTS.xxl,
    color: COLORS.textPrimary,
    fontWeight: "700",
  },
  subtitle: {
    marginTop: SPACING.xs,
    color: COLORS.textSecondary,
    fontSize: FONTS.sm,
  },
  timerCard: {
    backgroundColor: COLORS.card,
    borderRadius: 30,
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.md,
    alignItems: "center",
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  timerRingWrap: {
    width: 330,
    height: 330,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.md,
  },
  timerCenter: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  timerDisplay: {
    fontSize: 46,
    color: COLORS.textPrimary,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
    letterSpacing: 2,
    opacity: 0.92,
  },
  timerSubtext: {
    fontSize: FONTS.sm,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
    opacity: 0.9,
  },
  durationRow: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  durationBtn: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    backgroundColor: COLORS.background,
    minWidth: 72,
    alignItems: "center",
    opacity: 0.96,
  },
  durationBtnActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primaryLight,
  },
  durationBtnText: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sm,
    fontWeight: "600",
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
    backgroundColor: COLORS.background,
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
    backgroundColor: COLORS.primary,
    alignItems: "center",
  },
  pauseBtn: {
    backgroundColor: COLORS.warning,
  },
  startBtnText: {
    color: "#0B0B0B",
    fontSize: FONTS.md,
    fontWeight: "700",
  },
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
  utilityStack: {
    gap: SPACING.sm,
  },
  utilityCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: SPACING.md,
  },
  utilityEmoji: {
    fontSize: FONTS.xl,
    marginRight: SPACING.sm,
  },
  utilityTextWrap: {
    flex: 1,
  },
  utilityTitle: {
    color: COLORS.textPrimary,
    fontSize: FONTS.md,
    fontWeight: "600",
  },
  utilityMeta: {
    color: COLORS.textMuted,
    fontSize: FONTS.sm,
    marginTop: 2,
  },
});
