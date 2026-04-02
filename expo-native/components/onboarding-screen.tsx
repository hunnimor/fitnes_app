import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import {
  Dumbbell,
  Activity,
  Heart,
  Zap,
  User,
  BarChart2,
  ArrowRight,
  Check,
} from "lucide-react-native";

type OnboardingProps = {
  onComplete: () => void;
};

const goals = [
  { id: "loss", label: "Похудение", icon: Activity, color: "#a3e635" },
  { id: "mass", label: "Набор массы", icon: Dumbbell, color: "#3b82f6" },
  { id: "endurance", label: "Выносливость", icon: Zap, color: "#f59e0b" },
  { id: "rehab", label: "Реабилитация", icon: Heart, color: "#ec4899" },
];

const equipment = [
  { id: "body", label: "Тело", icon: User },
  { id: "dumbbells", label: "Гантели", icon: Dumbbell },
  { id: "pullup", label: "Турник", icon: Activity },
  { id: "gym", label: "Полный зал", icon: BarChart2 },
];

const levels = [
  { id: "beginner", label: "Новичок", desc: "Только начинаю" },
  { id: "intermediate", label: "Средний", desc: "Тренируюсь 1-2 года" },
  { id: "advanced", label: "Продвинутый", desc: "3+ лет опыта" },
];

export function OnboardingScreen({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  const toggleEquipment = (id: string) => {
    setSelectedEquipment((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  const canProceed = () => {
    if (step === 1) return selectedGoal !== null;
    if (step === 2) return selectedEquipment.length > 0;
    if (step === 3) return selectedLevel !== null;
    return true;
  };

  const stepLabels = ["Цель", "Оборудование", "Уровень"];

  // Welcome screen
  if (step === 0) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.welcomeContainer}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Activity size={40} color="#09090b" strokeWidth={2.5} />
          </View>
        </View>

        <Text style={styles.title}>ФитИИ</Text>
        <Text style={styles.subtitle}>Твой ИИ-тренер в кармане</Text>
        <Text style={styles.description}>
          Компьютерное зрение анализирует технику в реальном времени и помогает
          тренироваться правильно
        </Text>

        <View style={styles.featuresContainer}>
          {["Анализ техники", "Голосовые подсказки", "Счётчик повторений", "Персональный план"].map(
            (feature) => (
              <View key={feature} style={styles.featureChip}>
                <Text style={styles.featureChipText}>{feature}</Text>
              </View>
            )
          )}
        </View>

        <TouchableOpacity
          style={styles.startButton}
          onPress={() => setStep(1)}
          activeOpacity={0.8}
        >
          <Text style={styles.startButtonText}>Начать</Text>
          <ArrowRight size={20} color="#09090b" />
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // Steps 1-3
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.stepsContainer}>
      {/* Progress bar */}
      <View style={styles.progressContainer}>
        {stepLabels.map((label, i) => {
          const isActive = i === step - 1;
          const isCompleted = i < step - 1;
          return (
            <View key={label} style={styles.progressItem}>
              <View
                style={[
                  styles.progressDot,
                  {
                    backgroundColor: isActive || isCompleted ? "#a3e635" : "rgba(255,255,255,0.08)",
                  },
                ]}
              >
                {isCompleted ? (
                  <Check size={14} color="#09090b" strokeWidth={3} />
                ) : (
                  <Text
                    style={[
                      styles.progressDotText,
                      { color: isActive ? "#09090b" : "#71717a" },
                    ]}
                  >
                    {i + 1}
                  </Text>
                )}
              </View>
              <Text
                style={[
                  styles.progressLabel,
                  { color: isActive ? "#a3e635" : "#71717a" },
                ]}
              >
                {label}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Step 1: Goal */}
      {step === 1 && (
        <View style={styles.stepContent}>
          <Text style={styles.stepTitle}>Выбери цель</Text>
          <Text style={styles.stepDescription}>Что хочешь достичь?</Text>
          <View style={styles.grid}>
            {goals.map(({ id, label, icon: Icon, color }) => {
              const selected = selectedGoal === id;
              return (
                <TouchableOpacity
                  key={id}
                  style={[
                    styles.goalCard,
                    {
                      backgroundColor: selected ? `${color}15` : "rgba(255,255,255,0.04)",
                      borderColor: selected ? color : "rgba(255,255,255,0.08)",
                      shadowColor: selected ? color : "transparent",
                    },
                  ]}
                  onPress={() => setSelectedGoal(id)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.goalIcon, { backgroundColor: `${color}20` }]}>
                    <Icon size={20} color={color} />
                  </View>
                  <Text
                    style={[
                      styles.goalLabel,
                      { color: selected ? color : "#fafafa" },
                    ]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {/* Step 2: Equipment */}
      {step === 2 && (
        <View style={styles.stepContent}>
          <Text style={styles.stepTitle}>Оборудование</Text>
          <Text style={styles.stepDescription}>
            Выбери что у тебя есть (можно несколько)
          </Text>
          <View style={styles.grid}>
            {equipment.map(({ id, label, icon: Icon }) => {
              const selected = selectedEquipment.includes(id);
              return (
                <TouchableOpacity
                  key={id}
                  style={[
                    styles.equipmentCard,
                    {
                      backgroundColor: selected
                        ? "rgba(163,230,53,0.1)"
                        : "rgba(255,255,255,0.04)",
                      borderColor: selected ? "#a3e635" : "rgba(255,255,255,0.08)",
                    },
                  ]}
                  onPress={() => toggleEquipment(id)}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.equipmentIcon,
                      {
                        backgroundColor: selected
                          ? "rgba(163,230,53,0.15)"
                          : "rgba(255,255,255,0.06)",
                      },
                    ]}
                  >
                    <Icon
                      size={20}
                      color={selected ? "#a3e635" : "#71717a"}
                    />
                  </View>
                  <Text
                    style={[
                      styles.equipmentLabel,
                      { color: selected ? "#a3e635" : "#fafafa" },
                    ]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {/* Step 3: Level */}
      {step === 3 && (
        <View style={styles.stepContent}>
          <Text style={styles.stepTitle}>Твой уровень</Text>
          <Text style={styles.stepDescription}>
            Это поможет подобрать нагрузку
          </Text>
          <View style={styles.levelsContainer}>
            {levels.map(({ id, label, desc }) => {
              const selected = selectedLevel === id;
              return (
                <TouchableOpacity
                  key={id}
                  style={[
                    styles.levelCard,
                    {
                      backgroundColor: selected
                        ? "rgba(163,230,53,0.1)"
                        : "rgba(255,255,255,0.04)",
                      borderColor: selected ? "#a3e635" : "rgba(255,255,255,0.08)",
                    },
                  ]}
                  onPress={() => setSelectedLevel(id)}
                  activeOpacity={0.8}
                >
                  <View>
                    <Text
                      style={[
                        styles.levelLabel,
                        { color: selected ? "#a3e635" : "#fafafa" },
                      ]}
                    >
                      {label}
                    </Text>
                    <Text style={styles.levelDesc}>{desc}</Text>
                  </View>
                  <View
                    style={[
                      styles.levelCheckbox,
                      {
                        borderColor: selected ? "#a3e635" : "rgba(255,255,255,0.2)",
                        backgroundColor: selected ? "#a3e635" : "transparent",
                      },
                    ]}
                  >
                    {selected && <Check size={14} color="#09090b" strokeWidth={3} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {/* Navigation buttons */}
      <View style={styles.buttonContainer}>
        {step > 1 && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setStep(step - 1)}
            activeOpacity={0.8}
          >
            <Text style={styles.backButtonText}>Назад</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[
            styles.nextButton,
            {
              backgroundColor: canProceed() ? "#a3e635" : "rgba(163,230,53,0.3)",
            },
          ]}
          onPress={() => {
            if (step < 3) {
              setStep(step + 1);
            } else {
              onComplete();
            }
          }}
          disabled={!canProceed()}
          activeOpacity={0.8}
        >
          <Text style={styles.nextButtonText}>
            {step === 3 ? "Начать тренировки!" : "Далее"}
          </Text>
          <ArrowRight size={20} color="#09090b" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#09090b",
  },
  welcomeContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  stepsContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 24,
  },
  logoContainer: {
    marginBottom: 32,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: "#a3e635",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#a3e635",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#fafafa",
    letterSpacing: -0.5,
    marginBottom: 12,
    textShadowColor: "rgba(163,230,53,0.4)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "#71717a",
    marginBottom: 8,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: "#71717a",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  featuresContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    marginTop: 32,
    marginBottom: 48,
  },
  featureChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    backgroundColor: "rgba(163,230,53,0.1)",
    borderWidth: 1,
    borderColor: "rgba(163,230,53,0.2)",
  },
  featureChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#a3e635",
  },
  startButton: {
    width: "100%",
    height: 56,
    borderRadius: 24,
    backgroundColor: "#a3e635",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#a3e635",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#09090b",
  },
  progressContainer: {
    marginBottom: 32,
  },
  progressItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  progressDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  progressDotText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: "600",
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fafafa",
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: "#71717a",
    marginBottom: 24,
  },
  stepContent: {
    flex: 1,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  goalCard: {
    width: "47%",
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: "flex-start",
    gap: 12,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 16,
  },
  goalIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  goalLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  equipmentCard: {
    width: "47%",
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: "flex-start",
    gap: 12,
  },
  equipmentIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  equipmentLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  levelsContainer: {
    gap: 12,
  },
  levelCard: {
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  levelLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  levelDesc: {
    fontSize: 14,
    color: "#71717a",
  },
  levelCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    paddingTop: 24,
  },
  backButton: {
    paddingHorizontal: 20,
    height: 56,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fafafa",
  },
  nextButton: {
    flex: 1,
    height: 56,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#a3e635",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#09090b",
  },
});
