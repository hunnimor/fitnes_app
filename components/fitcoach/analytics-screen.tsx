"use client"

import { useState } from "react"
import {
  Trophy,
  Star,
  Zap,
  Flame,
  TrendingUp,
  Calendar,
  Camera,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts"

const weightData = [
  { week: "Н1", val: 82 },
  { week: "Н2", val: 81.2 },
  { week: "Н3", val: 80.8 },
  { week: "Н4", val: 80.1 },
  { week: "Н5", val: 79.4 },
  { week: "Н6", val: 78.9 },
  { week: "Н7", val: 78.2 },
  { week: "Н8", val: 77.5 },
]

const repsData = [
  { week: "Н1", val: 8 },
  { week: "Н2", val: 10 },
  { week: "Н3", val: 10 },
  { week: "Н4", val: 12 },
  { week: "Н5", val: 13 },
  { week: "Н6", val: 15 },
  { week: "Н7", val: 16 },
  { week: "Н8", val: 18 },
]

const qualityData = [
  { week: "Н1", val: 55 },
  { week: "Н2", val: 60 },
  { week: "Н3", val: 68 },
  { week: "Н4", val: 72 },
  { week: "Н5", val: 75 },
  { week: "Н6", val: 80 },
  { week: "Н7", val: 85 },
  { week: "Н8", val: 90 },
]

const achievements = [
  { id: 1, title: "10 приседаний идеально", icon: Star, color: "#a3e635", earned: true },
  { id: 2, title: "7 дней подряд", icon: Flame, color: "#f97316", earned: true },
  { id: 3, title: "Первая тренировка", icon: Zap, color: "#3b82f6", earned: true },
  { id: 4, title: "Мастер планки", icon: Trophy, color: "#eab308", earned: true },
  { id: 5, title: "30 тренировок", icon: TrendingUp, color: "#ec4899", earned: false },
  { id: 6, title: "Идеальный месяц", icon: Calendar, color: "#10b981", earned: false },
]

// GitHub-style activity heatmap (12 weeks x 7 days)
function ActivityHeatmap() {
  const weeks = 13
  const days = 7
  const activityData = Array.from({ length: weeks * days }, (_, i) => {
    const r = Math.random()
    return r > 0.45 ? (r > 0.7 ? (r > 0.85 ? 3 : 2) : 1) : 0
  })

  const intensityColors: Record<number, string> = {
    0: "rgba(255,255,255,0.05)",
    1: "rgba(163,230,53,0.25)",
    2: "rgba(163,230,53,0.55)",
    3: "#a3e635",
  }

  const dayLabels = ["Пн", "", "Ср", "", "Пт", "", "Вс"]

  return (
    <div>
      <div className="flex gap-1">
        {/* Day labels column */}
        <div className="flex flex-col gap-1 mr-1">
          {dayLabels.map((d, i) => (
            <div key={i} className="h-4 flex items-center">
              <span className="text-[9px] text-muted-foreground w-4">{d}</span>
            </div>
          ))}
        </div>
        {/* Grid */}
        <div className="flex gap-1 flex-1 overflow-hidden">
          {Array.from({ length: weeks }).map((_, wi) => (
            <div key={wi} className="flex flex-col gap-1 flex-1">
              {Array.from({ length: days }).map((_, di) => {
                const intensity = activityData[wi * days + di]
                return (
                  <div
                    key={di}
                    className="rounded-sm"
                    style={{
                      background: intensityColors[intensity],
                      aspectRatio: "1",
                      boxShadow: intensity === 3 ? "0 0 4px rgba(163,230,53,0.4)" : "none",
                    }}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>
      {/* Legend */}
      <div className="flex items-center gap-1.5 mt-2 justify-end">
        <span className="text-[10px] text-muted-foreground">Меньше</span>
        {[0, 1, 2, 3].map((v) => (
          <div
            key={v}
            className="w-3 h-3 rounded-sm"
            style={{ background: intensityColors[v] }}
          />
        ))}
        <span className="text-[10px] text-muted-foreground">Больше</span>
      </div>
    </div>
  )
}

function MiniChart({ data, color, label, unit }: {
  data: { week: string; val: number }[]
  color: string
  label: string
  unit: string
}) {
  const latest = data[data.length - 1].val
  const prev = data[0].val
  const diff = ((latest - prev) / prev * 100).toFixed(1)
  const isPositive = parseFloat(diff) > 0

  return (
    <div
      className="rounded-3xl p-5"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <span
          className="text-xs font-bold px-2 py-0.5 rounded-full"
          style={{
            background: isPositive ? "rgba(163,230,53,0.1)" : "rgba(239,68,68,0.1)",
            color: isPositive ? "#a3e635" : "#ef4444",
          }}
        >
          {isPositive ? "+" : ""}{diff}%
        </span>
      </div>
      <p className="text-2xl font-bold mb-3" style={{ color }}>
        {latest} <span className="text-sm text-muted-foreground font-normal">{unit}</span>
      </p>
      <ResponsiveContainer width="100%" height={60}>
        <LineChart data={data}>
          <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
          <XAxis dataKey="week" tick={{ fill: "#52525b", fontSize: 9 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              background: "#18181b",
              border: `1px solid ${color}33`,
              borderRadius: "8px",
              color: "#fafafa",
              fontSize: "11px",
            }}
          />
          <Line type="monotone" dataKey="val" stroke={color} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function AnalyticsScreen() {
  const [activeTab, setActiveTab] = useState<"progress" | "compare" | "badges">("progress")

  return (
    <div className="phone-screen flex flex-col bg-background overflow-y-auto pb-24">
      <div className="px-5 pt-14 pb-4">
        <h1 className="text-2xl font-bold text-foreground" style={{ letterSpacing: "-0.02em" }}>Аналитика</h1>
        <p className="text-muted-foreground text-sm">8 недель прогресса</p>
      </div>

      {/* Tabs */}
      <div className="px-5 mb-5">
        <div
          className="flex rounded-2xl p-1 gap-1"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          {(["progress", "compare", "badges"] as const).map((tab) => {
            const labels = { progress: "Графики", compare: "Сравнение", badges: "Достижения" }
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: activeTab === tab ? "#a3e635" : "transparent",
                  color: activeTab === tab ? "#09090b" : "#71717a",
                  boxShadow: activeTab === tab ? "0 0 12px rgba(163,230,53,0.25)" : "none",
                }}
              >
                {labels[tab]}
              </button>
            )
          })}
        </div>
      </div>

      <div className="px-5 flex flex-col gap-4">
        {activeTab === "progress" && (
          <>
            <MiniChart data={weightData} color="#a3e635" label="Вес" unit="кг" />
            <MiniChart data={repsData} color="#3b82f6" label="Повторения (приседания)" unit="раз" />
            <MiniChart data={qualityData} color="#f59e0b" label="Качество техники" unit="%" />

            {/* Activity heatmap */}
            <div
              className="rounded-3xl p-5"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <p className="text-sm font-semibold text-foreground mb-3">Активность</p>
              <ActivityHeatmap />
            </div>
          </>
        )}

        {activeTab === "compare" && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">Сравни своё тело до и после</p>
            <div className="grid grid-cols-2 gap-4">
              {["До", "После"].map((label) => (
                <div
                  key={label}
                  className="rounded-3xl overflow-hidden flex flex-col items-center justify-center"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    aspectRatio: "3/4",
                  }}
                >
                  <Camera className="w-8 h-8 text-muted-foreground mb-2" />
                  <p className="text-sm font-semibold text-muted-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground/60 mt-1 px-3 text-center">Нажми чтобы добавить фото</p>
                </div>
              ))}
            </div>

            {/* Stats comparison */}
            <div
              className="rounded-3xl p-5"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <p className="text-sm font-semibold text-foreground mb-4">Ключевые метрики</p>
              {[
                { label: "Вес", before: "82 кг", after: "77.5 кг", positive: true },
                { label: "Жирность тела", before: "24%", after: "19%", positive: true },
                { label: "Мышечная масса", before: "62%", after: "68%", positive: true },
              ].map(({ label, before, after, positive }) => (
                <div key={label} className="flex items-center justify-between mb-3 last:mb-0">
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground/60">{before}</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="text-sm font-bold" style={{ color: positive ? "#a3e635" : "#ef4444" }}>{after}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "badges" && (
          <div>
            <p className="text-sm text-muted-foreground mb-4">4 из 6 достижений открыты</p>
            {/* Progress bar */}
            <div
              className="w-full h-2 rounded-full mb-5"
              style={{ background: "rgba(255,255,255,0.08)" }}
            >
              <div
                className="h-2 rounded-full"
                style={{
                  width: `${(4 / 6) * 100}%`,
                  background: "#a3e635",
                  boxShadow: "0 0 8px rgba(163,230,53,0.5)",
                }}
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {achievements.map(({ id, title, icon: Icon, color, earned }) => (
                <div
                  key={id}
                  className="rounded-2xl p-3 flex flex-col items-center gap-2 text-center"
                  style={{
                    background: earned ? `${color}10` : "rgba(255,255,255,0.03)",
                    border: `1px solid ${earned ? `${color}30` : "rgba(255,255,255,0.06)"}`,
                    opacity: earned ? 1 : 0.45,
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      background: earned ? `${color}15` : "rgba(255,255,255,0.05)",
                      boxShadow: earned ? `0 0 12px ${color}30` : "none",
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: earned ? color : "#52525b" }} />
                  </div>
                  <p className="text-[11px] font-semibold leading-tight" style={{ color: earned ? "#fafafa" : "#52525b" }}>
                    {title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
