"use client"

import { useState, useEffect } from "react"
import {
  Flame,
  Play,
  Clock,
  TrendingUp,
  Sparkles,
  ChevronRight,
  Bell,
  Zap,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts"

const weekData = [
  { day: "Пн", score: 60 },
  { day: "Вт", score: 75 },
  { day: "Ср", score: 55 },
  { day: "Чт", score: 85 },
  { day: "Пт", score: 70 },
  { day: "Сб", score: 90 },
  { day: "Вс", score: 78 },
]

const upcomingWorkouts = [
  { name: "HIIT + Кардио", duration: "15 мин", muscles: "Всё тело", difficulty: "Высокая" },
  { name: "Силовая спина", duration: "25 мин", muscles: "Спина, бицепс", difficulty: "Средняя" },
]

export function DashboardScreen() {
  const [greeting, setGreeting] = useState("Доброе утро")
  const [streakAnimated, setStreakAnimated] = useState(false)

  useEffect(() => {
    const h = new Date().getHours()
    if (h >= 5 && h < 12) setGreeting("Доброе утро")
    else if (h >= 12 && h < 18) setGreeting("Добрый день")
    else setGreeting("Добрый вечер")

    const timer = setTimeout(() => setStreakAnimated(true), 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="phone-screen flex flex-col bg-background overflow-y-auto pb-24">
      {/* Background glow */}
      <div
        className="absolute top-0 right-[-60px] w-[250px] h-[250px] rounded-full pointer-events-none z-0"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)" }}
      />

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-14 pb-4 relative z-10">
        <div>
          <p className="text-muted-foreground text-sm">{greeting},</p>
          <h1 className="text-2xl font-bold text-foreground" style={{ letterSpacing: "-0.02em" }}>
            Алексей
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {/* Streak badge */}
          <div
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl"
            style={{
              background: "rgba(249,115,22,0.15)",
              border: "1px solid rgba(249,115,22,0.3)",
            }}
          >
            <Flame
              className="w-4 h-4"
              style={{
                color: "#f97316",
                filter: "drop-shadow(0 0 4px rgba(249,115,22,0.6))",
              }}
            />
            <span
              className="text-sm font-bold"
              style={{
                color: "#f97316",
                transition: "all 0.5s",
                transform: streakAnimated ? "scale(1)" : "scale(1.4)",
              }}
            >
              12
            </span>
          </div>
          {/* Notification bell */}
          <button
            className="w-10 h-10 rounded-xl flex items-center justify-center relative"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span
              className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
              style={{ background: "#a3e635", boxShadow: "0 0 6px rgba(163,230,53,0.6)" }}
            />
          </button>
        </div>
      </div>

      {/* Main workout card */}
      <div className="px-5 mb-4 relative z-10">
        <div
          className="rounded-3xl p-5 overflow-hidden relative"
          style={{
            background: "linear-gradient(135deg, #1a2d0a 0%, #0f1f1a 100%)",
            border: "1px solid rgba(163,230,53,0.25)",
            boxShadow: "0 0 32px rgba(163,230,53,0.12)",
          }}
        >
          {/* Decorative grid lines */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "linear-gradient(rgba(163,230,53,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(163,230,53,0.3) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#a3e635" }}>
                  Сегодня
                </p>
                <h2 className="text-xl font-bold text-foreground">HIIT + Кардио</h2>
                <p className="text-muted-foreground text-sm mt-0.5">Всё тело · Высокая интенсивность</p>
              </div>
              <div
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl"
                style={{ background: "rgba(163,230,53,0.12)", border: "1px solid rgba(163,230,53,0.2)" }}
              >
                <Clock className="w-3.5 h-3.5" style={{ color: "#a3e635" }} />
                <span className="text-xs font-bold" style={{ color: "#a3e635" }}>15 мин</span>
              </div>
            </div>

            {/* Exercise chips */}
            <div className="flex gap-2 mb-5 flex-wrap">
              {["Берпи", "Прыжки", "Планка", "Скалолаз"].map((e) => (
                <span
                  key={e}
                  className="px-2.5 py-1 rounded-full text-xs font-medium"
                  style={{ background: "rgba(255,255,255,0.06)", color: "#a1a1aa" }}
                >
                  {e}
                </span>
              ))}
            </div>

            <button
              className="w-full py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
              style={{
                background: "#a3e635",
                color: "#09090b",
                boxShadow: "0 0 20px rgba(163,230,53,0.35)",
              }}
            >
              <Play className="w-5 h-5 fill-current" />
              Начать тренировку
            </button>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="px-5 mb-4 grid grid-cols-3 gap-3 relative z-10">
        {[
          { label: "Калории", value: "2 340", unit: "ккал", icon: Flame, color: "#f97316" },
          { label: "Минуты", value: "87", unit: "мин", icon: Clock, color: "#a3e635" },
          { label: "Серии", value: "6", unit: "шт", icon: Zap, color: "#3b82f6" },
        ].map(({ label, value, unit, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-2xl p-3 flex flex-col gap-2"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <Icon className="w-4 h-4" style={{ color }} />
            <div>
              <p className="text-lg font-bold text-foreground leading-none">{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{unit} · {label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Progress chart */}
      <div className="px-5 mb-4 relative z-10">
        <div
          className="rounded-3xl p-5"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-foreground">Прогресс за неделю</h3>
              <p className="text-xs text-muted-foreground">Качество техники (%)</p>
            </div>
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
              style={{ background: "rgba(163,230,53,0.1)" }}
            >
              <TrendingUp className="w-3.5 h-3.5" style={{ color: "#a3e635" }} />
              <span className="text-xs font-bold" style={{ color: "#a3e635" }}>+12%</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={80}>
            <LineChart data={weekData}>
              <XAxis
                dataKey="day"
                tick={{ fill: "#52525b", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "#18181b",
                  border: "1px solid rgba(163,230,53,0.2)",
                  borderRadius: "8px",
                  color: "#fafafa",
                  fontSize: "12px",
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#a3e635"
                strokeWidth={2.5}
                dot={{ fill: "#a3e635", r: 3, strokeWidth: 0 }}
                activeDot={{ fill: "#a3e635", r: 5, strokeWidth: 0, filter: "drop-shadow(0 0 4px #a3e635)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Tip */}
      <div className="px-5 mb-4 relative z-10">
        <div
          className="rounded-3xl p-4 flex items-start gap-3"
          style={{
            background: "rgba(59,130,246,0.08)",
            border: "1px solid rgba(59,130,246,0.2)",
          }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ background: "rgba(59,130,246,0.15)" }}
          >
            <Sparkles className="w-4.5 h-4.5" style={{ color: "#3b82f6" }} />
          </div>
          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: "#3b82f6" }}>ИИ-совет дня</p>
            <p className="text-sm text-foreground leading-relaxed">
              Сегодня сделай акцент на мобильность. Добавь 5 мин растяжки после тренировки — это ускорит восстановление на 30%.
            </p>
          </div>
        </div>
      </div>

      {/* Upcoming workouts */}
      <div className="px-5 relative z-10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground">Следующие тренировки</h3>
          <button className="text-xs flex items-center gap-0.5" style={{ color: "#a3e635" }}>
            Все
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {upcomingWorkouts.map((w, i) => (
            <div
              key={i}
              className="rounded-2xl p-4 flex items-center justify-between"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(163,230,53,0.1)" }}
                >
                  <Zap className="w-5 h-5" style={{ color: "#a3e635" }} />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">{w.name}</p>
                  <p className="text-xs text-muted-foreground">{w.muscles} · {w.duration}</p>
                </div>
              </div>
              <span
                className="text-xs px-2 py-1 rounded-lg font-medium"
                style={{
                  background: w.difficulty === "Высокая" ? "rgba(239,68,68,0.1)" : "rgba(234,179,8,0.1)",
                  color: w.difficulty === "Высокая" ? "#ef4444" : "#eab308",
                }}
              >
                {w.difficulty}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
