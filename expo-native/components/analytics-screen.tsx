import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import {
  Trophy,
  Star,
  Zap,
  Flame,
  TrendingUp,
  Calendar,
  Camera,
} from "lucide-react-native";

const weightData = [
  { week: "Н1", val: 82 },
  { week: "Н2", val: 81.2 },
  { week: "Н3", val: 80.8 },
  { week: "Н4", val: 80.1 },
  { week: "Н5", val: 79.4 },
  { week: "Н6", val: 78.9 },
  { week: "Н7", val: 78.2 },
  { week: "Н8", val: 77.5 },
];

const repsData = [
  { week: "Н1", val: 8 },
  { week: "Н2", val: 10 },
  { week: "Н3", val: 10 },
  { week: "Н4", val: 12 },
  { week: "Н5", val: 13 },
  { week: "Н6", val: 15 },
  { week: "Н7", val: 16 },
  { week: "Н8", val: 18 },
];

const qualityData = [
  { week: "Н1", val: 55 },
  { week: "Н2", val: 60 },
  { week: "Н3", val: 68 },
  { week: "Н4", val: 72 },
  { week: "Н5", val: 75 },
  { week: "Н6", val: 80 },
  { week: "Н7", val: 85 },
  { week: "Н8", val: 90 },
];

const achievements = [
  { id: 1, title: "10 приседаний идеально", icon: Star, color: "#a3e635", earned: true },
  { id: 2, title: "7 дней подряд", icon: Flame, color: "#f97316", earned: true },
  { id: 3, title: "Первая тренировка", icon: Zap, color: "#3b82f6", earned: true },
  { id: 4, title: "Мастер планки", icon: Trophy, color: "#eab308", earned: true },
  { id: 5, title: "30 тренировок", icon: TrendingUp, color: "#ec4899", earned: false },
  { id: 6, title: "Идеальный месяц", icon: Calendar, color: "#10b981", earned: false },
];

// Activity heatmap component
function ActivityHeatmap() {
  const weeks = 13;
  const days = 7;
  const activityData = Array.from({ length: weeks * days }, (_, i) => {
    const r = Math.random();
    return r > 0.45 ? (r > 0.7 ? (r > 0.85 ? 3 : 2) : 1) : 0;
  });

  const intensityColors: Record<number, string> = {
    0: "rgba(255,255,255,0.05)",
    1: "rgba(163,230,53,0.25)",
    2: "rgba(163,230,53,0.55)",
    3: "#a3e635",
  };

  const dayLabels = ["Пн", "", "Ср", "", "Пт", "", "Вс"];

  return (
    <View>
      <View style={styles.heatmapContainer}>
        {/* Day labels */}
        <View style={styles.dayLabels}>
          {dayLabels.map((d, i) => (
            <View key={i} style={styles.dayLabel}>
              <Text style={styles.dayLabelText}>{d}</Text>
            </View>
          ))}
        </View>
        {/* Grid */}
        <View style={styles.heatmapGrid}>
          {Array.from({ length: weeks }).map((_, wi) => (
            <View key={wi} style={styles.heatmapWeek}>
              {Array.from({ length: days }).map((_, di) => {
                const intensity = activityData[wi * days + di];
                return (
                  <View
                    key={di}
                    style={[
                      styles.heatmapCell,
                      {
                        backgroundColor: intensityColors[intensity],
                        shadowColor: intensity === 3 ? "#a3e635" : "transparent",
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: intensity === 3 ? 0.4 : 0,
                        shadowRadius: 4,
                      },
                    ]}
                  />
                );
              })}
            </View>
          ))}
        </View>
      </View>
      {/* Legend */}
      <View style={styles.legend}>
        <Text style={styles.legendText}>Меньше</Text>
        {[0, 1, 2, 3].map((v) => (
          <View
            key={v}
            style={[
              styles.legendBox,
              { backgroundColor: intensityColors[v] },
            ]}
          />
        ))}
        <Text style={styles.legendText}>Больше</Text>
      </View>
    </View>
  );
}

// Mini chart component (simplified bar chart for React Native)
function MiniChart({ data, color, label, unit }: {
  data: { week: string; val: number }[];
  color: string;
  label: string;
  unit: string;
}) {
  const latest = data[data.length - 1].val;
  const prev = data[0].val;
  const diff = ((latest - prev) / prev * 100).toFixed(1);
  const isPositive = parseFloat(diff) > 0;
  const maxValue = Math.max(...data.map((d) => d.val));

  return (
    <View style={styles.miniChart}>
      <View style={styles.miniChartHeader}>
        <Text style={styles.miniChartLabel}>{label}</Text>
        <View
          style={[
            styles.miniChartBadge,
            {
              backgroundColor: isPositive
                ? "rgba(163,230,53,0.1)"
                : "rgba(239,68,68,0.1)",
            },
          ]}
        >
          <Text
            style={[
              styles.miniChartBadgeText,
              { color: isPositive ? "#a3e635" : "#ef4444" },
            ]}
          >
            {isPositive ? "+" : ""}
            {diff}%
          </Text>
        </View>
      </View>
      <Text style={[styles.miniChartValue, { color }]}>
        {latest}{" "}
        <Text style={styles.miniChartUnit}>{unit}</Text>
      </Text>
      {/* Simple bar chart */}
      <View style={styles.miniChartBars}>
        {data.map((item, index) => (
          <View key={index} style={styles.miniBar}>
            <View
              style={[
                styles.miniBarFill,
                {
                  height: `${(item.val / maxValue) * 100}%`,
                  backgroundColor: color,
                },
              ]}
            />
            <Text style={styles.miniBarLabel}>{item.week}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export function AnalyticsScreen() {
  const [activeTab, setActiveTab] = useState<"progress" | "compare" | "badges">("progress");

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Аналитика</Text>
        <Text style={styles.headerDesc}>8 недель прогресса</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <View style={styles.tabs}>
          {(["progress", "compare", "badges"] as const).map((tab) => {
            const labels = { progress: "Графики", compare: "Сравнение", badges: "Достижения" };
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.tab,
                  {
                    backgroundColor: isActive ? "#a3e635" : "transparent",
                  },
                ]}
                onPress={() => setActiveTab(tab)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.tabText,
                    { color: isActive ? "#09090b" : "#71717a" },
                  ]}
                >
                  {labels[tab]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.tabContent}>
        {activeTab === "progress" && (
          <>
            <MiniChart data={weightData} color="#a3e635" label="Вес" unit="кг" />
            <MiniChart data={repsData} color="#3b82f6" label="Повторения" unit="раз" />
            <MiniChart data={qualityData} color="#f59e0b" label="Качество" unit="%" />

            {/* Activity heatmap */}
            <View style={styles.activityCard}>
              <Text style={styles.activityTitle}>Активность</Text>
              <ActivityHeatmap />
            </View>
          </>
        )}

        {activeTab === "compare" && (
          <View style={styles.compareContent}>
            <Text style={styles.compareDesc}>Сравни своё тело до и после</Text>
            <View style={styles.compareGrid}>
              {["До", "После"].map((label) => (
                <TouchableOpacity key={label} style={styles.compareCard} activeOpacity={0.8}>
                  <Camera size={32} color="#71717a" />
                  <Text style={styles.compareLabel}>{label}</Text>
                  <Text style={styles.compareHint}>Нажми чтобы добавить фото</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Stats comparison */}
            <View style={styles.statsCard}>
              <Text style={styles.statsTitle}>Ключевые метрики</Text>
              {[
                { label: "Вес", before: "82 кг", after: "77.5 кг", positive: true },
                { label: "Жирность тела", before: "24%", after: "19%", positive: true },
                { label: "Мышечная масса", before: "62%", after: "68%", positive: true },
              ].map(({ label, before, after, positive }) => (
                <View key={label} style={styles.statRow}>
                  <Text style={styles.statLabel}>{label}</Text>
                  <View style={styles.statValues}>
                    <Text style={styles.statBefore}>{before}</Text>
                    <Text style={styles.statArrow}>→</Text>
                    <Text
                      style={[
                        styles.statAfter,
                        { color: positive ? "#a3e635" : "#ef4444" },
                      ]}
                    >
                      {after}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {activeTab === "badges" && (
          <View style={styles.badgesContent}>
            <Text style={styles.badgesDesc}>4 из 6 достижений открыты</Text>
            {/* Progress bar */}
            <View style={styles.badgesProgress}>
              <View
                style={[
                  styles.badgesProgressFill,
                  { width: `${(4 / 6) * 100}%` },
                ]}
              />
            </View>
            <View style={styles.badgesGrid}>
              {achievements.map(({ id, title, icon: Icon, color, earned }) => (
                <View
                  key={id}
                  style={[
                    styles.badgeCard,
                    {
                      backgroundColor: earned ? `${color}10` : "rgba(255,255,255,0.03)",
                      borderColor: earned ? `${color}30` : "rgba(255,255,255,0.06)",
                      opacity: earned ? 1 : 0.45,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.badgeIcon,
                      {
                        backgroundColor: earned ? `${color}15` : "rgba(255,255,255,0.05)",
                      },
                    ]}
                  >
                    <Icon size={20} color={earned ? color : "#52525b"} />
                  </View>
                  <Text
                    style={[
                      styles.badgeTitle,
                      { color: earned ? "#fafafa" : "#52525b" },
                    ]}
                  >
                    {title}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
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
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fafafa",
    letterSpacing: -0.5,
  },
  headerDesc: {
    fontSize: 14,
    color: "#71717a",
  },
  tabsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tabs: {
    flexDirection: "row",
    padding: 4,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    gap: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 16,
    alignItems: "center",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
  },
  tabContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
  miniChart: {
    borderRadius: 24,
    padding: 20,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  miniChartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  miniChartLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fafafa",
  },
  miniChartBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  miniChartBadgeText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  miniChartValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
  },
  miniChartUnit: {
    fontSize: 14,
    color: "#71717a",
    fontWeight: "400",
  },
  miniChartBars: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 60,
    gap: 4,
  },
  miniBar: {
    flex: 1,
    alignItems: "center",
  },
  miniBarFill: {
    flex: 1,
    width: "100%",
    borderRadius: 4,
    minHeight: 4,
  },
  miniBarLabel: {
    fontSize: 9,
    color: "#52525b",
    marginTop: 4,
  },
  activityCard: {
    borderRadius: 24,
    padding: 20,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fafafa",
    marginBottom: 12,
  },
  heatmapContainer: {
    flexDirection: "row",
    marginBottom: 8,
  },
  dayLabels: {
    marginRight: 4,
    justifyContent: "space-between",
  },
  dayLabel: {
    height: 16,
    justifyContent: "center",
  },
  dayLabelText: {
    fontSize: 9,
    color: "#71717a",
  },
  heatmapGrid: {
    flex: 1,
    flexDirection: "row",
    gap: 4,
  },
  heatmapWeek: {
    flex: 1,
    flexDirection: "column",
    gap: 4,
  },
  heatmapCell: {
    aspectRatio: 1,
    borderRadius: 4,
  },
  legend: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 6,
  },
  legendText: {
    fontSize: 10,
    color: "#71717a",
  },
  legendBox: {
    width: 12,
    height: 12,
    borderRadius: 4,
  },
  compareContent: {
    gap: 16,
  },
  compareDesc: {
    fontSize: 14,
    color: "#71717a",
  },
  compareGrid: {
    flexDirection: "row",
    gap: 16,
  },
  compareCard: {
    flex: 1,
    aspectRatio: 3 / 4,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  compareLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#71717a",
  },
  compareHint: {
    fontSize: 11,
    color: "#71717a",
    textAlign: "center",
    paddingHorizontal: 12,
  },
  statsCard: {
    borderRadius: 24,
    padding: 20,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  statsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fafafa",
    marginBottom: 16,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 14,
    color: "#71717a",
  },
  statValues: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  statBefore: {
    fontSize: 14,
    color: "#71717a",
  },
  statArrow: {
    fontSize: 14,
    color: "#71717a",
  },
  statAfter: {
    fontSize: 14,
    fontWeight: "600",
  },
  badgesContent: {
    gap: 16,
  },
  badgesDesc: {
    fontSize: 14,
    color: "#71717a",
  },
  badgesProgress: {
    width: "100%",
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.08)",
    overflow: "hidden",
  },
  badgesProgressFill: {
    height: "100%",
    backgroundColor: "#a3e635",
    shadowColor: "#a3e635",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  badgesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  badgeCard: {
    width: "31%",
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    gap: 8,
  },
  badgeIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeTitle: {
    fontSize: 10,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 14,
  },
});
