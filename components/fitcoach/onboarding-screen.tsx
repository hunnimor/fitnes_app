"use client"

import { useState } from "react"
import {
  Dumbbell,
  Activity,
  Heart,
  Zap,
  User,
  BarChart2,
  ArrowRight,
  Check,
} from "lucide-react"

type OnboardingProps = {
  onComplete: () => void
}

const goals = [
  { id: "loss", label: "Похудение", icon: Activity, color: "#a3e635" },
  { id: "mass", label: "Набор массы", icon: Dumbbell, color: "#3b82f6" },
  { id: "endurance", label: "Выносливость", icon: Zap, color: "#f59e0b" },
  { id: "rehab", label: "Реабилитация", icon: Heart, color: "#ec4899" },
]

const equipment = [
  { id: "body", label: "Тело", icon: User },
  { id: "dumbbells", label: "Гантели", icon: Dumbbell },
  { id: "pullup", label: "Турник", icon: Activity },
  { id: "gym", label: "Полный зал", icon: BarChart2 },
]

const levels = [
  { id: "beginner", label: "Новичок", desc: "Только начинаю" },
  { id: "intermediate", label: "Средний", desc: "Тренируюсь 1-2 года" },
  { id: "advanced", label: "Продвинутый", desc: "3+ лет опыта" },
]

export function OnboardingScreen({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0)
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null)
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([])
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null)
  const [visible, setVisible] = useState(true)

  const goToStep = (next: number) => {
    setVisible(false)
    setTimeout(() => {
      setStep(next)
      setVisible(true)
    }, 200)
  }

  const toggleEquipment = (id: string) => {
    setSelectedEquipment((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    )
  }

  const canProceed = () => {
    if (step === 1) return selectedGoal !== null
    if (step === 2) return selectedEquipment.length > 0
    if (step === 3) return selectedLevel !== null
    return true
  }

  const stepLabels = ["Цель", "Оборудование", "Уровень"]

  return (
    <div className="phone-screen flex flex-col bg-background relative overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute top-[-120px] left-[-80px] w-[300px] h-[300px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(163,230,53,0.08) 0%, transparent 70%)" }}
      />

      <div
        className="flex flex-col flex-1"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(10px)",
          transition: "opacity 0.2s ease, transform 0.2s ease",
        }}
      >
        {/* Welcome screen */}
        {step === 0 && (
          <div className="flex flex-col items-center justify-center flex-1 px-6 text-center">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center mb-8 glow-lime"
              style={{ background: "linear-gradient(135deg, #a3e635 0%, #65a30d 100%)" }}
            >
              <Activity className="w-10 h-10 text-black" strokeWidth={2.5} />
            </div>

            <h1
              className="text-4xl font-bold text-foreground mb-3 text-balance"
              style={{ letterSpacing: "-0.02em", textShadow: "0 0 20px rgba(163,230,53,0.4)" }}
            >
              ФитИИ
            </h1>
            <p className="text-lg text-muted-foreground mb-2 text-balance">
              Твой ИИ-тренер в кармане
            </p>
            <p className="text-sm text-muted-foreground/70 text-balance leading-relaxed px-4">
              Компьютерное зрение анализирует технику в реальном времени и помогает тренироваться правильно
            </p>

            <div className="flex flex-wrap gap-2 justify-center mt-8 mb-12">
              {["Анализ техники", "Голосовые подсказки", "Счётчик повторений", "Персональный план"].map((f) => (
                <span
                  key={f}
                  className="px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{
                    background: "rgba(163,230,53,0.1)",
                    border: "1px solid rgba(163,230,53,0.2)",
                    color: "#a3e635",
                  }}
                >
                  {f}
                </span>
              ))}
            </div>

            <button
              onClick={() => goToStep(1)}
              className="w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all active:scale-95"
              style={{
                background: "#a3e635",
                color: "#09090b",
                boxShadow: "0 0 24px rgba(163,230,53,0.35)",
              }}
            >
              Начать
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Step screens */}
        {step >= 1 && step <= 3 && (
          <div className="flex flex-col flex-1 px-6 pt-12 pb-6">
            {/* Progress bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                {stepLabels.map((label, i) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
                      style={{
                        background: i < step ? "#a3e635" : i === step - 1 ? "#a3e635" : "rgba(255,255,255,0.08)",
                        color: i < step ? "#09090b" : i === step - 1 ? "#09090b" : "#71717a",
                      }}
                    >
                      {i < step - 1 ? <Check className="w-3.5 h-3.5" /> : i + 1}
                    </div>
                    <span
                      className="text-xs font-medium"
                      style={{ color: i === step - 1 ? "#a3e635" : "#71717a" }}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </div>
              <div className="w-full h-1 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                <div
                  className="h-1 rounded-full transition-all duration-500"
                  style={{
                    width: `${((step - 1) / 2) * 100}%`,
                    background: "#a3e635",
                    boxShadow: "0 0 8px rgba(163,230,53,0.5)",
                  }}
                />
              </div>
            </div>

            {/* Step 1: Goal */}
            {step === 1 && (
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-1">Выбери цель</h2>
                <p className="text-muted-foreground mb-6 text-sm">Что хочешь достичь?</p>
                <div className="grid grid-cols-2 gap-3">
                  {goals.map(({ id, label, icon: Icon, color }) => {
                    const selected = selectedGoal === id
                    return (
                      <button
                        key={id}
                        onClick={() => setSelectedGoal(id)}
                        className="p-4 rounded-2xl flex flex-col items-start gap-3 transition-all active:scale-95"
                        style={{
                          background: selected ? `${color}15` : "rgba(255,255,255,0.04)",
                          border: `1px solid ${selected ? color : "rgba(255,255,255,0.08)"}`,
                          boxShadow: selected ? `0 0 16px ${color}25` : "none",
                        }}
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ background: `${color}20` }}
                        >
                          <Icon className="w-5 h-5" style={{ color }} />
                        </div>
                        <span className="text-sm font-semibold" style={{ color: selected ? color : "#fafafa" }}>
                          {label}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Step 2: Equipment */}
            {step === 2 && (
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-1">Оборудование</h2>
                <p className="text-muted-foreground mb-6 text-sm">Выбери что у тебя есть (можно несколько)</p>
                <div className="grid grid-cols-2 gap-3">
                  {equipment.map(({ id, label, icon: Icon }) => {
                    const selected = selectedEquipment.includes(id)
                    return (
                      <button
                        key={id}
                        onClick={() => toggleEquipment(id)}
                        className="p-4 rounded-2xl flex flex-col items-start gap-3 transition-all active:scale-95"
                        style={{
                          background: selected ? "rgba(163,230,53,0.1)" : "rgba(255,255,255,0.04)",
                          border: `1px solid ${selected ? "#a3e635" : "rgba(255,255,255,0.08)"}`,
                          boxShadow: selected ? "0 0 16px rgba(163,230,53,0.2)" : "none",
                        }}
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ background: selected ? "rgba(163,230,53,0.15)" : "rgba(255,255,255,0.06)" }}
                        >
                          <Icon className="w-5 h-5" style={{ color: selected ? "#a3e635" : "#71717a" }} />
                        </div>
                        <span className="text-sm font-semibold" style={{ color: selected ? "#a3e635" : "#fafafa" }}>
                          {label}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Step 3: Level */}
            {step === 3 && (
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-1">Твой уровень</h2>
                <p className="text-muted-foreground mb-6 text-sm">Это поможет подобрать нагрузку</p>
                <div className="flex flex-col gap-3">
                  {levels.map(({ id, label, desc }) => {
                    const selected = selectedLevel === id
                    return (
                      <button
                        key={id}
                        onClick={() => setSelectedLevel(id)}
                        className="p-4 rounded-2xl flex items-center justify-between transition-all active:scale-95"
                        style={{
                          background: selected ? "rgba(163,230,53,0.1)" : "rgba(255,255,255,0.04)",
                          border: `1px solid ${selected ? "#a3e635" : "rgba(255,255,255,0.08)"}`,
                          boxShadow: selected ? "0 0 16px rgba(163,230,53,0.2)" : "none",
                        }}
                      >
                        <div className="text-left">
                          <p className="font-semibold text-base" style={{ color: selected ? "#a3e635" : "#fafafa" }}>
                            {label}
                          </p>
                          <p className="text-sm text-muted-foreground">{desc}</p>
                        </div>
                        <div
                          className="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all"
                          style={{
                            borderColor: selected ? "#a3e635" : "rgba(255,255,255,0.2)",
                            background: selected ? "#a3e635" : "transparent",
                          }}
                        >
                          {selected && <Check className="w-3.5 h-3.5 text-black" />}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="mt-auto pt-6 flex gap-3">
              {step > 1 && (
                <button
                  onClick={() => goToStep(step - 1)}
                  className="px-5 py-4 rounded-2xl font-semibold text-base transition-all active:scale-95"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#fafafa",
                  }}
                >
                  Назад
                </button>
              )}
              <button
                onClick={() => {
                  if (step < 3) goToStep(step + 1)
                  else onComplete()
                }}
                disabled={!canProceed()}
                className="flex-1 py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: canProceed() ? "#a3e635" : "rgba(163,230,53,0.3)",
                  color: "#09090b",
                  boxShadow: canProceed() ? "0 0 24px rgba(163,230,53,0.35)" : "none",
                }}
              >
                {step === 3 ? "Начать тренировки!" : "Далее"}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
