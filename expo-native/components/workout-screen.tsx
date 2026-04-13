import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
} from "react-native";
import {
  Pause,
  Play,
  SkipForward,
  Sparkles,
  Volume2,
  ChevronUp,
  X,
  AlertCircle,
  CheckCircle,
  MinusCircle,
  RotateCcw,
} from "lucide-react-native";
import { CameraView, useCameraPermissions, type CameraType } from "expo-camera";
import { LinearGradient } from "expo-linear-gradient";
import {
  detectPose,
  initPoseDetector,
  type Keypoint,
  SKELETON_CONNECTIONS,
} from "@/lib/pose-detection";
import { analyzeForm, RepCounter, type FormAnalysis } from "@/lib/exercise-analyzer";

const exercises = [
  { name: "Берпи", reps: 20, muscles: "Всё тело", tip: "Держи корпус в планке на спуске" },
  { name: "Приседания", reps: 15, muscles: "Квадрицепс, Ягодицы", tip: "Колени над носками, спина прямая" },
  { name: "Отжимания", reps: 12, muscles: "Грудь, Трицепс", tip: "Локти под углом 45° к телу" },
  { name: "Скалолаз", reps: 30, muscles: "Пресс, Кардио", tip: "Держи таз на уровне плеч" },
];

// ─── Skeleton overlay drawn on top of camera ───
function SkeletonOverlay({ keypoints }: { keypoints: Keypoint[] }) {
  const points = keypoints.filter((k) => k.confidence > 0.4);

  return (
    <View style={styles.skeletonContainer}>
      {/* Draw connections */}
      {SKELETON_CONNECTIONS.map(([a, b], i) => {
        const kpA = keypoints[a];
        const kpB = keypoints[b];
        if (!kpA || !kpB || kpA.confidence < 0.4 || kpB.confidence < 0.4) return null;
        return (
          <View
            key={`line-${i}`}
            style={[
              styles.skeletonLine,
              {
                left: kpA.x,
                top: kpA.y,
                width: Math.sqrt((kpB.x - kpA.x) ** 2 + (kpB.y - kpA.y) ** 2),
                transform: [
                  { rotate: `${Math.atan2(kpB.y - kpA.y, kpB.x - kpA.x)}rad` },
                ],
              },
            ]}
          />
        );
      })}
      {/* Draw joints */}
      {points.map((kp) => (
        <View
          key={kp.label}
          style={[
            styles.joint,
            { left: kp.x - 4, top: kp.y - 4 },
          ]}
        />
      ))}
    </View>
  );
}

// ─── Quality ring ───
function QualityRing({ score }: { score: number }) {
  const quality: "good" | "ok" | "bad" = score >= 75 ? "good" : score >= 50 ? "ok" : "bad";
  const color = quality === "good" ? "#a3e635" : quality === "ok" ? "#eab308" : "#ef4444";
  const label = quality === "good" ? "Отлично" : quality === "ok" ? "Нормально" : "Ошибка";
  const Icon = quality === "good" ? CheckCircle : quality === "ok" ? MinusCircle : AlertCircle;

  return (
    <View style={styles.qualityContainer}>
      <View style={[styles.qualityRing, { borderColor: `${color}33` }]}>
        <View
          style={[
            styles.qualityRingFill,
            {
              borderColor: color,
              shadowColor: color,
            },
          ]}
        />
        <View style={styles.qualityIcon}>
          <Icon size={20} color={color} />
        </View>
      </View>
      <Text style={[styles.qualityLabel, { color }]}>{label}</Text>
      <Text style={styles.qualityPercent}>{score}%</Text>
    </View>
  );
}

export function WorkoutScreen() {
  const [exerciseIdx, setExerciseIdx] = useState(0);
  const [reps, setReps] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [restTime, setRestTime] = useState(0);
  const [formScore, setFormScore] = useState(100);
  const [corrections, setCorrections] = useState<string[]>([]);
  const [showSheet, setShowSheet] = useState(false);
  const [showAITip, setShowAITip] = useState(true);
  const [workoutTime, setWorkoutTime] = useState(0);
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraFacing, setCameraFacing] = useState<CameraType>("front");
  const [poseLoading, setPoseLoading] = useState(true);
  const [keypoints, setKeypoints] = useState<Keypoint[]>([]);

  const repCounterRef = useRef(new RepCounter());
  const detectionIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cameraRef = useRef<any>(null);

  const exercise = exercises[exerciseIdx];

  // Init pose detector on mount
  useEffect(() => {
    initPoseDetector().then(() => setPoseLoading(false));
    return () => {
      if (detectionIntervalRef.current) clearInterval(detectionIntervalRef.current);
    };
  }, []);

  // Pose detection loop — runs every 300ms
  useEffect(() => {
    if (!isPlaying) return;

    detectionIntervalRef.current = setInterval(async () => {
      try {
        const result = await detectPose();
        setKeypoints(result.keypoints);

        // Analyze form
        const analysis: FormAnalysis = analyzeForm(result.keypoints, exercise.name);
        setFormScore(analysis.score);
        setCorrections(analysis.corrections);

        // Update rep counter
        const count = repCounterRef.current.update(analysis.phase);
        setReps(count);
      } catch (err) {
        console.warn("Pose detection error:", err);
      }
    }, 300);

    return () => {
      if (detectionIntervalRef.current) clearInterval(detectionIntervalRef.current);
    };
  }, [isPlaying, exercise.name]);

  // Workout timer
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setWorkoutTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const formatTime = useCallback(
    (s: number) =>
      `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`,
    []
  );

  const handleNext = useCallback(() => {
    repCounterRef.current.reset();
    setExerciseIdx((prev) => (prev + 1) % exercises.length);
    setReps(0);
    setRestTime(30);
    setFormScore(100);
    setCorrections([]);
    const countdown = setInterval(() => {
      setRestTime((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const handleFlipCamera = useCallback(() => {
    setCameraFacing((prev) => (prev === "front" ? "back" : "front"));
  }, []);

  // ─── Permission denied screen ───
  if (permission && !permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <Sparkles size={48} color="#a3e635" />
          <Text style={styles.permissionTitle}>Нужен доступ к камере</Text>
          <Text style={styles.permissionText}>
            ФитИИ использует камеру для анализа техники упражнений
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermission}
            activeOpacity={0.8}
          >
            <Text style={styles.permissionButtonText}>Разрешить</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!permission) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#a3e635" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Camera — front facing by default, toggleable */}
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={cameraFacing}
      />

      {/* Gradient overlay */}
      <View style={styles.gradientOverlay}>
        <LinearGradient
          colors={["rgba(9,9,11,0.3)", "rgba(9,9,11,0.5)", "rgba(9,9,11,0.8)"]}
          style={StyleSheet.absoluteFill}
        />
      </View>

      {/* Skeleton overlay */}
      {keypoints.length > 0 && (
        <View style={styles.skeletonWrapper}>
          <SkeletonOverlay keypoints={keypoints} />
        </View>
      )}

      {/* Pose loading indicator */}
      {poseLoading && (
        <View style={styles.poseLoadingOverlay}>
          <ActivityIndicator size="large" color="#a3e635" />
          <Text style={styles.poseLoadingText}>Загрузка ИИ-модели...</Text>
        </View>
      )}

      {/* Top overlay */}
      <View style={styles.topOverlay}>
        {/* Timer */}
        <View style={styles.overlayCard}>
          <Text style={styles.overlayLabel}>Время</Text>
          <Text style={styles.overlayTime}>{formatTime(workoutTime)}</Text>
        </View>

        {/* Quality ring */}
        <QualityRing score={formScore} />

        {/* Reps counter */}
        <View style={styles.overlayCard}>
          <Text style={styles.overlayLabel}>Повторений</Text>
          <View style={styles.repsContainer}>
            <Text style={styles.repsCount}>{reps}</Text>
            <Text style={styles.repsTotal}>/{exercise.reps}</Text>
          </View>
        </View>
      </View>

      {/* Camera flip button */}
      <TouchableOpacity
        style={styles.flipCameraButton}
        onPress={handleFlipCamera}
        activeOpacity={0.8}
      >
        <RotateCcw size={20} color="#fafafa" />
      </TouchableOpacity>

      {/* Correction tips */}
      {corrections.length > 0 && (
        <View style={styles.correctionContainer}>
          {corrections.map((tip, i) => (
            <View key={i} style={styles.correctionBubble}>
              <AlertCircle size={14} color="#ef4444" />
              <Text style={styles.correctionText}>{tip}</Text>
            </View>
          ))}
        </View>
      )}

      {/* AI Voice tip bubble */}
      {showAITip && corrections.length === 0 && (
        <View style={styles.aiTipContainer}>
          <View style={styles.aiTipBubble}>
            <Volume2 size={16} color="#3b82f6" />
            <Text style={styles.aiTipText}>{exercise.tip}</Text>
            <TouchableOpacity onPress={() => setShowAITip(false)}>
              <X size={16} color="#71717a" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Rest timer overlay */}
      {restTime > 0 && (
        <Modal transparent visible>
          <View style={styles.restModal}>
            <View style={styles.restContent}>
              <Text style={styles.restLabel}>Отдых</Text>
              <Text style={styles.restTimer}>{restTime}</Text>
              <Text style={styles.restUnit}>секунд</Text>
            </View>
          </View>
        </Modal>
      )}

      {/* Progress bar */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${exercise.reps > 0 ? Math.min((reps / exercise.reps) * 100, 100) : 0}%` },
            ]}
          />
        </View>
      </View>

      {/* Exercise label */}
      <View style={styles.exerciseInfo}>
        <View>
          <Text style={styles.exerciseNumber}>
            Упражнение {exerciseIdx + 1}/{exercises.length}
          </Text>
          <Text style={styles.exerciseName}>{exercise.name}</Text>
        </View>
        <View style={styles.aiActiveBadge}>
          <Sparkles size={14} color="#3b82f6" />
          <Text style={styles.aiActiveText}>ИИ активен</Text>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[
            styles.controlButton,
            styles.pauseButton,
            {
              backgroundColor: isPlaying
                ? "rgba(255,255,255,0.1)"
                : "#a3e635",
            },
          ]}
          onPress={() => setIsPlaying(!isPlaying)}
          activeOpacity={0.8}
        >
          {isPlaying ? (
            <Pause size={20} color="#fafafa" />
          ) : (
            <Play size={20} color="#09090b" fill="#09090b" />
          )}
          <Text
            style={[
              styles.controlButtonText,
              { color: isPlaying ? "#fafafa" : "#09090b" },
            ]}
          >
            {isPlaying ? "Пауза" : "Продолжить"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlIconButton}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <SkipForward size={20} color="#71717a" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlIconButton, styles.aiButton]}
          onPress={() => setShowAITip(true)}
          activeOpacity={0.8}
        >
          <Sparkles size={20} color="#3b82f6" />
        </TouchableOpacity>
      </View>

      {/* Bottom sheet toggle */}
      <TouchableOpacity
        style={styles.sheetToggle}
        onPress={() => setShowSheet(!showSheet)}
        activeOpacity={0.8}
      >
        <ChevronUp
          size={16}
          color="#71717a"
          style={{ transform: [{ rotate: showSheet ? "180deg" : "0deg" }] }}
        />
        <Text style={styles.sheetToggleText}>Об упражнении</Text>
      </TouchableOpacity>

      {/* Bottom sheet */}
      {showSheet && (
        <View style={styles.bottomSheet}>
          <Text style={styles.sheetTitle}>{exercise.name}</Text>
          <Text style={styles.sheetSubtitle}>
            Целевые мышцы: {exercise.muscles}
          </Text>
          <View style={styles.sheetTip}>
            <Sparkles size={16} color="#a3e635" />
            <Text style={styles.sheetTipText}>{exercise.tip}</Text>
          </View>
          <View style={styles.sheetStats}>
            <View style={styles.sheetStat}>
              <Text style={styles.sheetStatValue}>{exercise.reps}</Text>
              <Text style={styles.sheetStatLabel}>Повторений</Text>
            </View>
            <View style={styles.sheetStat}>
              <Text style={[styles.sheetStatValue, { color: "#a3e635" }]}>3</Text>
              <Text style={styles.sheetStatLabel}>Подхода</Text>
            </View>
            <View style={styles.sheetStat}>
              <Text style={styles.sheetStatValue}>30с</Text>
              <Text style={styles.sheetStatLabel}>Отдых</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#09090b",
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  skeletonWrapper: {
    ...StyleSheet.absoluteFillObject,
  },
  skeletonContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  joint: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#a3e635",
    shadowColor: "#a3e635",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
  },
  skeletonLine: {
    position: "absolute",
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "rgba(163,230,53,0.7)",
    shadowColor: "#a3e635",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    transformOrigin: "left",
  },
  permissionContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    backgroundColor: "#09090b",
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fafafa",
    marginTop: 24,
    marginBottom: 8,
  },
  permissionText: {
    fontSize: 14,
    color: "#71717a",
    textAlign: "center",
    marginBottom: 24,
  },
  permissionButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 24,
    backgroundColor: "#a3e635",
  },
  permissionButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#09090b",
  },
  poseLoadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(9,9,11,0.8)",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  poseLoadingText: {
    fontSize: 14,
    color: "#a3e635",
    fontWeight: "600",
  },
  topOverlay: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 12,
  },
  overlayCard: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
  },
  overlayLabel: {
    fontSize: 11,
    color: "#71717a",
  },
  overlayTime: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fafafa",
    fontFamily: "monospace",
  },
  qualityContainer: {
    alignItems: "center",
  },
  qualityRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  qualityRingFill: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 32,
    borderWidth: 4,
    borderStartColor: "transparent",
    borderEndColor: "transparent",
    borderBottomColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  qualityIcon: {
    position: "absolute",
  },
  qualityLabel: {
    fontSize: 11,
    fontWeight: "600",
    marginTop: 4,
  },
  qualityPercent: {
    fontSize: 11,
    color: "#71717a",
  },
  repsContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  repsCount: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#a3e635",
    fontFamily: "monospace",
    textShadowColor: "rgba(163,230,53,0.6)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
  },
  repsTotal: {
    fontSize: 16,
    color: "#71717a",
    fontWeight: "400",
    marginLeft: 2,
  },
  flipCameraButton: {
    position: "absolute",
    top: 100,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  correctionContainer: {
    paddingHorizontal: 20,
    marginBottom: 8,
    gap: 6,
  },
  correctionBubble: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 10,
    borderRadius: 12,
    backgroundColor: "rgba(239,68,68,0.12)",
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.25)",
  },
  correctionText: {
    flex: 1,
    fontSize: 13,
    color: "#ef4444",
    fontWeight: "500",
  },
  aiTipContainer: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  aiTipBubble: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 12,
    borderRadius: 16,
    backgroundColor: "rgba(59,130,246,0.15)",
    borderWidth: 1,
    borderColor: "rgba(59,130,246,0.35)",
  },
  aiTipText: {
    flex: 1,
    fontSize: 13,
    color: "#fafafa",
    lineHeight: 18,
  },
  restModal: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    alignItems: "center",
    justifyContent: "center",
  },
  restContent: {
    alignItems: "center",
  },
  restLabel: {
    fontSize: 14,
    color: "#71717a",
    marginBottom: 8,
  },
  restTimer: {
    fontSize: 72,
    fontWeight: "bold",
    color: "#a3e635",
    fontFamily: "monospace",
    textShadowColor: "rgba(163,230,53,0.5)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 40,
  },
  restUnit: {
    fontSize: 14,
    color: "#71717a",
    marginTop: 8,
  },
  progressBarContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  progressBarBg: {
    width: "100%",
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  progressBarFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "#a3e635",
    shadowColor: "#a3e635",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
  exerciseInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  exerciseNumber: {
    fontSize: 12,
    color: "#71717a",
    marginBottom: 4,
  },
  exerciseName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fafafa",
  },
  aiActiveBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "rgba(59,130,246,0.1)",
    borderWidth: 1,
    borderColor: "rgba(59,130,246,0.2)",
  },
  aiActiveText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#3b82f6",
  },
  controls: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  controlButton: {
    flex: 1,
    height: 56,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  pauseButton: {
    borderWidth: 1,
  },
  controlButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  controlIconButton: {
    width: 56,
    height: 56,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  aiButton: {
    backgroundColor: "rgba(59,130,246,0.1)",
    borderColor: "rgba(59,130,246,0.25)",
  },
  sheetToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    alignSelf: "center",
    marginBottom: 8,
  },
  sheetToggleText: {
    fontSize: 12,
    color: "#71717a",
  },
  bottomSheet: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 32,
    padding: 20,
    backgroundColor: "rgba(24,24,27,0.95)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fafafa",
    marginBottom: 4,
  },
  sheetSubtitle: {
    fontSize: 14,
    color: "#71717a",
    marginBottom: 12,
  },
  sheetTip: {
    flexDirection: "row",
    gap: 10,
    padding: 12,
    borderRadius: 16,
    backgroundColor: "rgba(163,230,53,0.06)",
    borderWidth: 1,
    borderColor: "rgba(163,230,53,0.1)",
    marginBottom: 16,
  },
  sheetTipText: {
    flex: 1,
    fontSize: 13,
    color: "#fafafa",
    lineHeight: 18,
  },
  sheetStats: {
    flexDirection: "row",
    gap: 12,
  },
  sheetStat: {
    flex: 1,
    padding: 8,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.04)",
    alignItems: "center",
  },
  sheetStatValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fafafa",
  },
  sheetStatLabel: {
    fontSize: 11,
    color: "#71717a",
    marginTop: 2,
  },
});
