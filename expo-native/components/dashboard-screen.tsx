import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import {
  Flame,
  Play,
  Clock,
  TrendingUp,
  Sparkles,
  ChevronRight,
  Bell,
  Zap,
} from "lucide-react-native";
import { useAuth } from "@/lib/auth-context";

const weekData = [
  { day: "Пн", score: 60 },
  { day: "Вт", score: 75 },
  { day: "Ср", score: 55 },
  { day: "Чт", score: 85 },
  { day: "Пт", score: 70 },
  { day: "Сб", score: 90 },
  { day: "Вс", score: 78 },
];

const upcomingWorkouts = [
  { name: "HIIT + Кардио", duration: "15 мин", muscles: "Всё тело", difficulty: "Высокая" },
  { name: "Силовая спина", duration: "25 мин", muscles: "Спина, бицепс", difficulty: "Средняя" },
];

export function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [greeting, setGreeting] = useState("Доброе утро");
  const [streakAnimated, setStreakAnimated] = useState(false);

  const displayName = user?.user_metadata?.username ?? user?.email?.split("@")[0] ?? "Атлет";

  useEffect(() => {
    const h = new Date().getHours();
    if (h >= 5 && h < 12) setGreeting("Доброе утро");
    else if (h >= 12 && h < 18) setGreeting("Добрый день");
    else setGreeting("Добрый вечер");

    const timer = setTimeout(() => setStreakAnimated(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greetingText}>{greeting},</Text>
          <Text style={styles.nameText}>{displayName}</Text>
        </View>
        <View style={styles.headerActions}>
          {/* Streak badge */}
          <View style={styles.streakBadge}>
            <Flame size={16} color="#f97316" />
            <Text
              style={[
                styles.streakText,
                {
                  transform: [{ scale: streakAnimated ? 1 : 1.4 }],
                },
              ]}
            >
              12
            </Text>
          </View>
          {/* Notification bell */}
          <TouchableOpacity style={styles.bellButton} activeOpacity={0.8}>
            <Bell size={20} color="#71717a" />
            <View style={styles.bellDot} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main workout card */}
      <View style={styles.workoutCard}>
        <View style={styles.workoutCardContent}>
          <View style={styles.workoutHeader}>
            <View style={styles.workoutInfo}>
              <Text style={styles.workoutTodayText}>Сегодня</Text>
              <Text style={styles.workoutNameText}>HIIT + Кардио</Text>
              <Text style={styles.workoutDescText}>
                Всё тело · Высокая интенсивность
              </Text>
            </View>
            <View style={styles.durationBadge}>
              <Clock size={14} color="#a3e635" />
              <Text style={styles.durationText}>15 мин</Text>
            </View>
          </View>

          {/* Exercise chips */}
          <View style={styles.exerciseChips}>
            {["Берпи", "Прыжки", "Планка", "Скалолаз"].map((exercise) => (
              <View key={exercise} style={styles.chip}>
                <Text style={styles.chipText}>{exercise}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.startWorkoutButton}
            onPress={() => router.push("/(tabs)/workout")}
            activeOpacity={0.8}
          >
            <Play size={20} color="#09090b" fill="#09090b" />
            <Text style={styles.startWorkoutButtonText}>Начать тренировку</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        {[
          { label: "Калории", value: "2 340", unit: "ккал", icon: Flame, color: "#f97316" },
          { label: "Минуты", value: "87", unit: "мин", icon: Clock, color: "#a3e635" },
          { label: "Серии", value: "6", unit: "шт", icon: Zap, color: "#3b82f6" },
        ].map(({ label, value, unit, icon: Icon, color }) => (
          <View key={label} style={styles.statCard}>
            <Icon size={16} color={color} />
            <View>
              <Text style={styles.statValue}>{value}</Text>
              <Text style={styles.statUnit}>{unit} · {label}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Progress chart placeholder */}
      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <View>
            <Text style={styles.progressTitle}>Прогресс за неделю</Text>
            <Text style={styles.progressDesc}>Качество техники (%)</Text>
          </View>
          <View style={styles.progressBadge}>
            <TrendingUp size={14} color="#a3e635" />
            <Text style={styles.progressBadgeText}>+12%</Text>
          </View>
        </View>
        {/* Simple chart visualization */}
        <View style={styles.chartContainer}>
          {weekData.map((item, index) => (
            <View key={index} style={styles.chartBar}>
              <View
                style={[
                  styles.chartBarFill,
                  {
                    height: `${item.score}%`,
                    backgroundColor: "#a3e635",
                  },
                ]}
              />
              <Text style={styles.chartLabel}>{item.day}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* AI Tip */}
      <View style={styles.aiTipCard}>
        <View style={styles.aiTipIcon}>
          <Sparkles size={18} color="#3b82f6" />
        </View>
        <View style={styles.aiTipContent}>
          <Text style={styles.aiTipTitle}>ИИ-совет дня</Text>
          <Text style={styles.aiTipText}>
            Сегодня сделай акцент на мобильность. Добавь 5 мин растяжки после
            тренировки — это ускорит восстановление на 30%.
          </Text>
        </View>
      </View>

      {/* Upcoming workouts */}
      <View style={styles.upcomingSection}>
        <View style={styles.upcomingHeader}>
          <Text style={styles.upcomingTitle}>Следующие тренировки</Text>
          <TouchableOpacity style={styles.seeAllButton} activeOpacity={0.8}>
            <Text style={styles.seeAllText}>Все</Text>
            <ChevronRight size={14} color="#a3e635" />
          </TouchableOpacity>
        </View>
        {upcomingWorkouts.map((workout, index) => (
          <View key={index} style={styles.workoutItem}>
            <View style={styles.workoutItemLeft}>
              <View style={styles.workoutItemIcon}>
                <Zap size={20} color="#a3e635" />
              </View>
              <View>
                <Text style={styles.workoutItemName}>{workout.name}</Text>
                <Text style={styles.workoutItemDesc}>
                  {workout.muscles} · {workout.duration}
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.difficultyBadge,
                {
                  backgroundColor:
                    workout.difficulty === "Высокая"
                      ? "rgba(239,68,68,0.1)"
                      : "rgba(234,179,8,0.1)",
                },
              ]}
            >
              <Text
                style={[
                  styles.difficultyText,
                  {
                    color:
                      workout.difficulty === "Высокая" ? "#ef4444" : "#eab308",
                  },
                ]}
              >
                {workout.difficulty}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#09090b",
  },
  content: {
    paddingTop: 60,
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  greetingText: {
    fontSize: 14,
    color: "#71717a",
  },
  nameText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fafafa",
    letterSpacing: -0.5,
  },
  headerActions: {
    flexDirection: "row",
    gap: 12,
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "rgba(249,115,22,0.15)",
    borderWidth: 1,
    borderColor: "rgba(249,115,22,0.3)",
  },
  streakText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#f97316",
  },
  bellButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  bellDot: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#a3e635",
    shadowColor: "#a3e635",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
  },
  workoutCard: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  workoutCardContent: {
    borderRadius: 32,
    padding: 20,
    backgroundColor: "#1a2d0a",
    borderWidth: 1,
    borderColor: "rgba(163,230,53,0.25)",
    shadowColor: "#a3e635",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 32,
  },
  workoutHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutTodayText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#a3e635",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  workoutNameText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fafafa",
    marginBottom: 4,
  },
  workoutDescText: {
    fontSize: 13,
    color: "#71717a",
  },
  durationBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "rgba(163,230,53,0.12)",
    borderWidth: 1,
    borderColor: "rgba(163,230,53,0.2)",
  },
  durationText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#a3e635",
  },
  exerciseChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  chipText: {
    fontSize: 12,
    color: "#a1a1aa",
  },
  startWorkoutButton: {
    width: "100%",
    height: 48,
    borderRadius: 20,
    backgroundColor: "#a3e635",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#a3e635",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
  },
  startWorkoutButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#09090b",
  },
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    padding: 12,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    gap: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fafafa",
  },
  statUnit: {
    fontSize: 11,
    color: "#71717a",
  },
  progressCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 24,
    padding: 20,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fafafa",
  },
  progressDesc: {
    fontSize: 12,
    color: "#71717a",
  },
  progressBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: "rgba(163,230,53,0.1)",
  },
  progressBadgeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#a3e635",
  },
  chartContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 80,
    gap: 4,
  },
  chartBar: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  chartBarFill: {
    width: "100%",
    borderRadius: 4,
    minHeight: 4,
  },
  chartLabel: {
    fontSize: 9,
    color: "#52525b",
    marginTop: 4,
  },
  aiTipCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 24,
    padding: 16,
    flexDirection: "row",
    gap: 12,
    backgroundColor: "rgba(59,130,246,0.08)",
    borderWidth: 1,
    borderColor: "rgba(59,130,246,0.2)",
  },
  aiTipIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "rgba(59,130,246,0.15)",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  aiTipContent: {
    flex: 1,
  },
  aiTipTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#3b82f6",
    marginBottom: 4,
  },
  aiTipText: {
    fontSize: 13,
    color: "#fafafa",
    lineHeight: 20,
  },
  upcomingSection: {
    paddingHorizontal: 20,
  },
  upcomingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  upcomingTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fafafa",
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  seeAllText: {
    fontSize: 12,
    color: "#a3e635",
    fontWeight: "500",
  },
  workoutItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    marginBottom: 12,
  },
  workoutItemLeft: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  workoutItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(163,230,53,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  workoutItemName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fafafa",
    marginBottom: 2,
  },
  workoutItemDesc: {
    fontSize: 12,
    color: "#71717a",
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: "500",
  },
});
