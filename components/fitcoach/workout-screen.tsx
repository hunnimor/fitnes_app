"use client"

import { useState, useEffect, useRef } from "react"
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
} from "lucide-react"

const exercises = [
  { name: "Берпи", reps: 20, muscles: "Всё тело", tip: "Держи корпус в планке на спуске" },
  { name: "Приседания", reps: 15, muscles: "Квадрицепс, Ягодицы", tip: "Колени над носками, спина прямая" },
  { name: "Отжимания", reps: 12, muscles: "Грудь, Трицепс", tip: "Локти под углом 45° к телу" },
  { name: "Скалолаз", reps: 30, muscles: "Пресс, Кардио", tip: "Держи таз на уровне плеч" },
]

// Skeleton body SVG component
function SkeletonOverlay({ quality }: { quality: "good" | "ok" | "bad" }) {
  const color = quality === "good" ? "#a3e635" : quality === "ok" ? "#eab308" : "#ef4444"
  const glow = quality === "good" ? "rgba(163,230,53,0.6)" : quality === "ok" ? "rgba(234,179,8,0.6)" : "rgba(239,68,68,0.6)"

  return (
    <svg
      viewBox="0 0 100 200"
      className="absolute inset-0 w-full h-full"
      style={{ filter: `drop-shadow(0 0 4px ${glow})` }}
    >
      {/* Head */}
      <circle cx="50" cy="20" r="9" fill="none" stroke={color} strokeWidth="2" opacity="0.9" />
      {/* Neck */}
      <line x1="50" y1="29" x2="50" y2="38" stroke={color} strokeWidth="2" opacity="0.9" />
      {/* Shoulders */}
      <line x1="28" y1="42" x2="72" y2="42" stroke={color} strokeWidth="2" opacity="0.9" />
      {/* Torso */}
      <line x1="50" y1="38" x2="50" y2="90" stroke={color} strokeWidth="2" opacity="0.9" />
      {/* Left arm */}
      <line x1="28" y1="42" x2="18" y2="68" stroke={color} strokeWidth="2" opacity="0.9" />
      <line x1="18" y1="68" x2="12" y2="92" stroke={color} strokeWidth="2" opacity="0.9" />
      {/* Right arm */}
      <line x1="72" y1="42" x2="82" y2="68" stroke={color} strokeWidth="2" opacity="0.9" />
      <line x1="82" y1="68" x2="88" y2="92" stroke={color} strokeWidth="2" opacity="0.9" />
      {/* Hips */}
      <line x1="36" y1="90" x2="64" y2="90" stroke={color} strokeWidth="2" opacity="0.9" />
      {/* Left leg */}
      <line x1="36" y1="90" x2="30" y2="140" stroke={color} strokeWidth="2" opacity="0.9" />
      <line x1="30" y1="140" x2="26" y2="185" stroke={color} strokeWidth="2" opacity="0.9" />
      {/* Right leg */}
      <line x1="64" y1="90" x2="70" y2="140" stroke={color} strokeWidth="2" opacity="0.9" />
      <line x1="70" y1="140" x2="74" y2="185" stroke={color} strokeWidth="2" opacity="0.9" />

      {/* Joint dots */}
      {[
        [50, 20], [28, 42], [72, 42], [50, 90],
        [18, 68], [82, 68], [12, 92], [88, 92],
        [36, 90], [64, 90], [30, 140], [70, 140],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="3" fill={color} opacity="0.9" />
      ))}
    </svg>
  )
}

// Circular progress for quality
function QualityRing({ quality }: { quality: "good" | "ok" | "bad" }) {
  const value = quality === "good" ? 92 : quality === "ok" ? 67 : 34
  const color = quality === "good" ? "#a3e635" : quality === "ok" ? "#eab308" : "#ef4444"
  const label = quality === "good" ? "Отлично" : quality === "ok" ? "Нормально" : "Ошибка"
  const Icon = quality === "good" ? CheckCircle : quality === "ok" ? MinusCircle : AlertCircle

  const r = 26
  const circumference = 2 * Math.PI * r
  const offset = circumference - (value / 100) * circumference

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-16 h-16">
        <svg className="w-full h-full -rotate-90">
          <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
          <circle
            cx="32"
            cy="32"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 4px ${color})`, transition: "stroke-dashoffset 0.5s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
      </div>
      <p className="text-xs font-semibold mt-1" style={{ color }}>{label}</p>
      <p className="text-xs text-muted-foreground">{value}%</p>
    </div>
  )
}

export function WorkoutScreen() {
  const [exerciseIdx, setExerciseIdx] = useState(0)
  const [reps, setReps] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [restTime, setRestTime] = useState(0)
  const [quality, setQuality] = useState<"good" | "ok" | "bad">("good")
  const [showSheet, setShowSheet] = useState(false)
  const [showAITip, setShowAITip] = useState(true)
  const [workoutTime, setWorkoutTime] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const exercise = exercises[exerciseIdx]

  // Simulate rep counting
  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(() => {
      setReps((prev) => {
        if (prev < exercise.reps) return prev + 1
        return prev
      })
      // Simulate quality changes
      setQuality(["good", "good", "good", "ok", "bad", "good"][Math.floor(Math.random() * 6)] as "good" | "ok" | "bad")
    }, 1800)
    return () => clearInterval(interval)
  }, [isPlaying, exercise.reps])

  // Workout timer
  useEffect(() => {
    if (!isPlaying) return
    timerRef.current = setInterval(() => {
      setWorkoutTime((prev) => prev + 1)
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [isPlaying])

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`

  const handleNext = () => {
    setExerciseIdx((prev) => (prev + 1) % exercises.length)
    setReps(0)
    setRestTime(30)
    setQuality("good")
    const countdown = setInterval(() => {
      setRestTime((prev) => {
        if (prev <= 1) { clearInterval(countdown); return 0 }
        return prev - 1
      })
    }, 1000)
  }

  return (
    <div className="phone-screen flex flex-col bg-black relative overflow-hidden">
      {/* Camera / video placeholder */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(160deg, #0a0f0a 0%, #0d1117 40%, #070b07 100%)",
        }}
      />

      {/* Skeleton overlay on silhouette */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div
          className="relative"
          style={{ width: "140px", height: "280px", opacity: 0.85 }}
        >
          {/* Human silhouette hint */}
          <div
            className="absolute inset-0 rounded-full opacity-5"
            style={{ background: "rgba(163,230,53,0.3)", filter: "blur(40px)" }}
          />
          <SkeletonOverlay quality={quality} />
        </div>
      </div>

      {/* Top overlay */}
      <div className="relative z-20 flex items-start justify-between px-5 pt-14 pb-3">
        {/* Timer */}
        <div
          className="px-3 py-2 rounded-xl"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <p className="text-xs text-muted-foreground">Время</p>
          <p className="text-lg font-bold font-mono text-foreground">{formatTime(workoutTime)}</p>
        </div>

        {/* Quality ring */}
        <div
          className="px-3 py-2 rounded-xl"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <QualityRing quality={quality} />
        </div>

        {/* Reps counter */}
        <div
          className="px-3 py-2 rounded-xl text-right"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <p className="text-xs text-muted-foreground">Повторений</p>
          <p
            className="text-3xl font-bold font-mono leading-tight"
            style={{
              color: "#a3e635",
              textShadow: "0 0 16px rgba(163,230,53,0.6)",
              transition: "transform 0.15s",
            }}
          >
            {reps}
            <span className="text-lg text-muted-foreground font-normal">/{exercise.reps}</span>
          </p>
        </div>
      </div>

      {/* AI Voice tip bubble */}
      {showAITip && (
        <div className="relative z-20 mx-5 mb-2">
          <div
            className="rounded-2xl px-4 py-3 flex items-start gap-2.5"
            style={{
              background: "rgba(59,130,246,0.15)",
              border: "1px solid rgba(59,130,246,0.35)",
              backdropFilter: "blur(12px)",
            }}
          >
            <Volume2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#3b82f6" }} />
            <p className="text-sm text-foreground leading-relaxed flex-1">
              {exercise.tip}
            </p>
            <button onClick={() => setShowAITip(false)}>
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      )}

      {/* Rest timer overlay */}
      {restTime > 0 && (
        <div className="absolute inset-0 z-30 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.7)" }}>
          <div className="text-center">
            <p className="text-muted-foreground text-sm mb-2">Отдых</p>
            <p
              className="text-7xl font-bold font-mono"
              style={{ color: "#a3e635", textShadow: "0 0 40px rgba(163,230,53,0.5)" }}
            >
              {restTime}
            </p>
            <p className="text-muted-foreground text-sm mt-2">секунд</p>
          </div>
        </div>
      )}

      {/* Progress bar for reps */}
      <div className="relative z-20 mx-5 mb-4">
        <div className="w-full h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }}>
          <div
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              width: `${(reps / exercise.reps) * 100}%`,
              background: "#a3e635",
              boxShadow: "0 0 8px rgba(163,230,53,0.6)",
            }}
          />
        </div>
      </div>

      {/* Exercise label */}
      <div className="relative z-20 mx-5 mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Упражнение {exerciseIdx + 1}/{exercises.length}</p>
          <h2 className="text-xl font-bold text-foreground">{exercise.name}</h2>
        </div>
        <div
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl"
          style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)" }}
        >
          <Sparkles className="w-3.5 h-3.5" style={{ color: "#3b82f6" }} />
          <span className="text-xs font-medium" style={{ color: "#3b82f6" }}>ИИ активен</span>
        </div>
      </div>

      {/* Controls */}
      <div className="relative z-20 mx-5 mb-4 flex items-center gap-3">
        {/* Pause/Play */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex-1 py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-base transition-all active:scale-95"
          style={{
            background: isPlaying ? "rgba(255,255,255,0.1)" : "#a3e635",
            color: isPlaying ? "#fafafa" : "#09090b",
            border: isPlaying ? "1px solid rgba(255,255,255,0.12)" : "none",
            boxShadow: isPlaying ? "none" : "0 0 20px rgba(163,230,53,0.35)",
          }}
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
          {isPlaying ? "Пауза" : "Продолжить"}
        </button>

        {/* Next */}
        <button
          onClick={handleNext}
          className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all active:scale-95"
          style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <SkipForward className="w-5 h-5 text-muted-foreground" />
        </button>

        {/* AI Help */}
        <button
          onClick={() => setShowAITip(true)}
          className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all active:scale-95"
          style={{
            background: "rgba(59,130,246,0.1)",
            border: "1px solid rgba(59,130,246,0.25)",
          }}
        >
          <Sparkles className="w-5 h-5" style={{ color: "#3b82f6" }} />
        </button>
      </div>

      {/* Bottom sheet toggle */}
      <button
        onClick={() => setShowSheet(!showSheet)}
        className="relative z-20 mx-auto mb-2 flex items-center gap-1.5 px-4 py-2 rounded-full"
        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
      >
        <ChevronUp
          className="w-4 h-4 text-muted-foreground transition-transform"
          style={{ transform: showSheet ? "rotate(180deg)" : "rotate(0deg)" }}
        />
        <span className="text-xs text-muted-foreground">Об упражнении</span>
      </button>

      {/* Bottom sheet */}
      {showSheet && (
        <div
          className="relative z-20 mx-4 mb-4 rounded-3xl p-5"
          style={{
            background: "rgba(24,24,27,0.95)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(20px)",
          }}
        >
          <h3 className="text-lg font-bold text-foreground mb-1">{exercise.name}</h3>
          <p className="text-sm text-muted-foreground mb-3">Целевые мышцы: {exercise.muscles}</p>
          <div
            className="flex items-start gap-2.5 p-3 rounded-2xl"
            style={{ background: "rgba(163,230,53,0.06)", border: "1px solid rgba(163,230,53,0.1)" }}
          >
            <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#a3e635" }} />
            <p className="text-sm text-foreground leading-relaxed">{exercise.tip}</p>
          </div>
          <div className="flex gap-3 mt-4">
            <div className="flex-1 text-center p-2 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
              <p className="text-lg font-bold text-foreground">{exercise.reps}</p>
              <p className="text-xs text-muted-foreground">Повторений</p>
            </div>
            <div className="flex-1 text-center p-2 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
              <p className="text-lg font-bold" style={{ color: "#a3e635" }}>3</p>
              <p className="text-xs text-muted-foreground">Подхода</p>
            </div>
            <div className="flex-1 text-center p-2 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
              <p className="text-lg font-bold text-foreground">30с</p>
              <p className="text-xs text-muted-foreground">Отдых</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
