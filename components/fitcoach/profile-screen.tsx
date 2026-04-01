"use client"

import { useState } from "react"
import {
  Bell,
  Shield,
  Heart,
  Activity,
  Crown,
  LogOut,
  ChevronRight,
  Check,
  Zap,
  Star,
  Flame,
  X,
} from "lucide-react"

const integrations = [
  { id: "apple", label: "Apple Health", connected: true, icon: Heart, color: "#ef4444" },
  { id: "google", label: "Google Fit", connected: false, icon: Activity, color: "#3b82f6" },
]

const proFeatures = [
  "Неограниченные ИИ-тренировки",
  "Анализ техники в реальном времени",
  "Персональные программы",
  "Голосовые подсказки ИИ",
  "Расширенная аналитика",
  "Приоритетная поддержка",
]

type ModalType = "logout" | "upgrade" | null

export function ProfileScreen() {
  const [notifications, setNotifications] = useState(true)
  const [privacy, setPrivacy] = useState(false)
  const [modal, setModal] = useState<ModalType>(null)

  const isPro = false

  const xpPercent = 68
  const xpCurrent = 2340
  const xpNext = 3000

  return (
    <div className="phone-screen flex flex-col bg-background overflow-y-auto pb-28 relative">
      {/* Background glow */}
      <div
        className="absolute top-0 left-0 w-full h-64 pointer-events-none z-0"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(163,230,53,0.06) 0%, transparent 70%)" }}
      />

      {/* Header */}
      <div className="relative z-10 px-5 pt-14 pb-6 flex flex-col items-center text-center">
        {/* Avatar */}
        <div className="relative mb-4">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold"
            style={{
              background: "linear-gradient(135deg, #1a2d0a 0%, #0f1f18 100%)",
              border: "2px solid rgba(163,230,53,0.4)",
              boxShadow: "0 0 20px rgba(163,230,53,0.15)",
              color: "#a3e635",
            }}
          >
            А
          </div>
          {isPro && (
            <div
              className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: "#eab308", boxShadow: "0 0 8px rgba(234,179,8,0.5)" }}
            >
              <Crown className="w-3 h-3 text-black" />
            </div>
          )}
        </div>

        <h2 className="text-xl font-bold text-foreground">Алексей Петров</h2>
        <p className="text-muted-foreground text-sm mt-0.5">alexey@example.com</p>

        {/* Level badge */}
        <div
          className="mt-3 flex items-center gap-2 px-4 py-2 rounded-xl"
          style={{
            background: "rgba(163,230,53,0.1)",
            border: "1px solid rgba(163,230,53,0.25)",
          }}
        >
          <Star className="w-4 h-4" style={{ color: "#a3e635" }} />
          <span className="text-sm font-bold" style={{ color: "#a3e635" }}>Уровень 5</span>
          <span className="text-xs text-muted-foreground">· Продвинутый</span>
        </div>

        {/* XP bar */}
        <div className="w-full mt-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
            <span>Опыт</span>
            <span>{xpCurrent} / {xpNext} XP</span>
          </div>
          <div className="w-full h-2 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
            <div
              className="h-2 rounded-full transition-all duration-700"
              style={{
                width: `${xpPercent}%`,
                background: "#a3e635",
                boxShadow: "0 0 8px rgba(163,230,53,0.5)",
              }}
            />
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3 w-full mt-4">
          {[
            { label: "Тренировок", value: "48", icon: Zap, color: "#a3e635" },
            { label: "Стрик", value: "12", icon: Flame, color: "#f97316" },
            { label: "Бейджей", value: "4", icon: Star, color: "#eab308" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div
              key={label}
              className="rounded-2xl p-3 flex flex-col items-center gap-1"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <Icon className="w-4 h-4" style={{ color }} />
              <p className="text-lg font-bold text-foreground">{value}</p>
              <p className="text-[10px] text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Subscription card */}
      <div className="px-5 mb-4 relative z-10">
        {isPro ? (
          <div
            className="rounded-3xl p-5"
            style={{
              background: "linear-gradient(135deg, rgba(234,179,8,0.15) 0%, rgba(234,179,8,0.05) 100%)",
              border: "1px solid rgba(234,179,8,0.3)",
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Crown className="w-5 h-5" style={{ color: "#eab308" }} />
              <p className="font-bold" style={{ color: "#eab308" }}>ФитИИ Pro</p>
            </div>
            <p className="text-sm text-muted-foreground">Следующее списание: 12 апр 2026</p>
          </div>
        ) : (
          <button
            onClick={() => setModal("upgrade")}
            className="w-full rounded-3xl p-5 text-left transition-all active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, #1a2d0a 0%, #0a1a14 100%)",
              border: "1px solid rgba(163,230,53,0.3)",
              boxShadow: "0 0 24px rgba(163,230,53,0.1)",
            }}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Crown className="w-5 h-5" style={{ color: "#a3e635" }} />
                  <p className="font-bold" style={{ color: "#a3e635" }}>Обновить до Pro</p>
                </div>
                <p className="text-sm text-muted-foreground">Разблокируй все возможности ИИ</p>
              </div>
              <span
                className="px-2.5 py-1 rounded-lg text-xs font-bold"
                style={{ background: "#a3e635", color: "#09090b" }}
              >
                399₽/мес
              </span>
            </div>
          </button>
        )}
      </div>

      {/* Settings */}
      <div className="px-5 mb-4 relative z-10">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Настройки</p>
        <div
          className="rounded-3xl overflow-hidden"
          style={{ border: "1px solid rgba(255,255,255,0.06)" }}
        >
          {/* Notifications toggle */}
          <div
            className="flex items-center justify-between p-4"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(163,230,53,0.1)" }}
              >
                <Bell className="w-4 h-4" style={{ color: "#a3e635" }} />
              </div>
              <p className="text-sm font-medium text-foreground">Уведомления</p>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className="w-12 h-6 rounded-full relative transition-all duration-300"
              style={{
                background: notifications ? "#a3e635" : "rgba(255,255,255,0.1)",
                boxShadow: notifications ? "0 0 8px rgba(163,230,53,0.4)" : "none",
              }}
            >
              <div
                className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300"
                style={{ left: notifications ? "28px" : "4px", boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }}
              />
            </button>
          </div>

          {/* Privacy toggle */}
          <div
            className="flex items-center justify-between p-4"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(59,130,246,0.1)" }}
              >
                <Shield className="w-4 h-4" style={{ color: "#3b82f6" }} />
              </div>
              <p className="text-sm font-medium text-foreground">Приватность</p>
            </div>
            <button
              onClick={() => setPrivacy(!privacy)}
              className="w-12 h-6 rounded-full relative transition-all duration-300"
              style={{
                background: privacy ? "#3b82f6" : "rgba(255,255,255,0.1)",
                boxShadow: privacy ? "0 0 8px rgba(59,130,246,0.4)" : "none",
              }}
            >
              <div
                className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300"
                style={{ left: privacy ? "28px" : "4px", boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }}
              />
            </button>
          </div>

          {/* Integrations */}
          {integrations.map(({ id, label, connected, icon: Icon, color }) => (
            <div
              key={id}
              className="flex items-center justify-between p-4 last:border-0"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: `${color}18` }}
                >
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground">{connected ? "Подключено" : "Не подключено"}</p>
                </div>
              </div>
              {connected ? (
                <div
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg"
                  style={{ background: "rgba(163,230,53,0.1)" }}
                >
                  <Check className="w-3 h-3" style={{ color: "#a3e635" }} />
                  <span className="text-xs font-medium" style={{ color: "#a3e635" }}>Активно</span>
                </div>
              ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Logout button */}
      <div className="px-5 relative z-10">
        <button
          onClick={() => setModal("logout")}
          className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-semibold transition-all active:scale-95"
          style={{
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.2)",
            color: "#ef4444",
          }}
        >
          <LogOut className="w-4 h-4" />
          Выйти из аккаунта
        </button>
      </div>

      {/* Modals */}
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-end"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setModal(null) }}
        >
          <div
            className="w-full rounded-t-3xl p-6 max-w-[375px] mx-auto"
            style={{ background: "#18181b", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            {modal === "logout" && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-foreground">Выйти?</h3>
                  <button onClick={() => setModal(null)}>
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>
                <p className="text-muted-foreground text-sm mb-6">Твои данные сохранятся. Ты сможешь войти снова.</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setModal(null)}
                    className="flex-1 py-3.5 rounded-2xl font-semibold text-foreground transition-all active:scale-95"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                  >
                    Отмена
                  </button>
                  <button
                    onClick={() => setModal(null)}
                    className="flex-1 py-3.5 rounded-2xl font-semibold transition-all active:scale-95"
                    style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444" }}
                  >
                    Выйти
                  </button>
                </div>
              </>
            )}

            {modal === "upgrade" && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Crown className="w-5 h-5" style={{ color: "#a3e635" }} />
                    <h3 className="text-lg font-bold text-foreground">ФитИИ Pro</h3>
                  </div>
                  <button onClick={() => setModal(null)}>
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>
                <p className="text-3xl font-bold mb-1" style={{ color: "#a3e635" }}>399₽<span className="text-base text-muted-foreground font-normal">/месяц</span></p>
                <div className="flex flex-col gap-2 my-4">
                  {proFeatures.map((f) => (
                    <div key={f} className="flex items-center gap-2">
                      <Check className="w-4 h-4 flex-shrink-0" style={{ color: "#a3e635" }} />
                      <span className="text-sm text-foreground">{f}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setModal(null)}
                  className="w-full py-4 rounded-2xl font-bold text-base transition-all active:scale-95"
                  style={{
                    background: "#a3e635",
                    color: "#09090b",
                    boxShadow: "0 0 24px rgba(163,230,53,0.35)",
                  }}
                >
                  Подписаться на Pro
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
