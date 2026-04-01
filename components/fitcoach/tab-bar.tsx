"use client"

import { Home, Dumbbell, BarChart2, User } from "lucide-react"

type Tab = "home" | "workout" | "analytics" | "profile"

type TabBarProps = {
  active: Tab
  onChange: (tab: Tab) => void
}

const tabs = [
  { id: "home" as Tab, label: "Главная", icon: Home },
  { id: "workout" as Tab, label: "Тренировка", icon: Dumbbell },
  { id: "analytics" as Tab, label: "Аналитика", icon: BarChart2 },
  { id: "profile" as Tab, label: "Профиль", icon: User },
]

export function TabBar({ active, onChange }: TabBarProps) {
  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-30 pb-safe"
      style={{
        background: "rgba(9,9,11,0.92)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div className="flex items-center px-2 py-2">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = active === id
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className="flex-1 flex flex-col items-center gap-1 py-2 rounded-2xl transition-all duration-200 active:scale-90"
              style={{
                background: isActive ? "rgba(163,230,53,0.08)" : "transparent",
              }}
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
            >
              <div className="relative">
                <Icon
                  className="w-5 h-5 transition-all duration-200"
                  style={{
                    color: isActive ? "#a3e635" : "#52525b",
                    filter: isActive ? "drop-shadow(0 0 6px rgba(163,230,53,0.5))" : "none",
                  }}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {isActive && (
                  <div
                    className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                    style={{ background: "#a3e635", boxShadow: "0 0 4px rgba(163,230,53,0.8)" }}
                  />
                )}
              </div>
              <span
                className="text-[10px] font-semibold transition-all duration-200"
                style={{ color: isActive ? "#a3e635" : "#52525b" }}
              >
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
