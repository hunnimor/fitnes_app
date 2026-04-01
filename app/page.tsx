"use client"

import { useState } from "react"
import { OnboardingScreen } from "@/components/fitcoach/onboarding-screen"
import { DashboardScreen } from "@/components/fitcoach/dashboard-screen"
import { WorkoutScreen } from "@/components/fitcoach/workout-screen"
import { AnalyticsScreen } from "@/components/fitcoach/analytics-screen"
import { ProfileScreen } from "@/components/fitcoach/profile-screen"
import { TabBar } from "@/components/fitcoach/tab-bar"

type Tab = "home" | "workout" | "analytics" | "profile"

export default function AIFitCoachApp() {
  const [onboarded, setOnboarded] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>("home")

  if (!onboarded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#09090b]">
        <div className="relative" style={{ width: 375, height: 812 }}>
          {/* Phone chrome */}
          <div
            className="absolute inset-0 rounded-[48px] overflow-hidden shadow-2xl"
            style={{
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 40px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04), inset 0 0 0 1px rgba(255,255,255,0.02)",
            }}
          >
            {/* Status bar notch */}
            <div
              className="absolute top-0 left-0 right-0 h-11 z-50 flex items-center justify-between px-8"
              style={{ background: "rgba(9,9,11,0.9)" }}
            >
              <span className="text-[11px] font-semibold text-foreground">9:41</span>
              <div
                className="w-24 h-6 rounded-full"
                style={{ background: "#09090b", border: "1px solid rgba(255,255,255,0.1)" }}
              />
              <div className="flex items-center gap-1">
                <div className="flex gap-0.5 items-end">
                  {[3, 5, 7, 9].map((h, i) => (
                    <div key={i} className="w-0.5 rounded-full bg-foreground" style={{ height: h }} />
                  ))}
                </div>
                <svg width="14" height="10" viewBox="0 0 14 10" className="text-foreground fill-current opacity-80">
                  <path d="M7 2a8.5 8.5 0 0 1 5.657 2.343l1.414-1.414A10.5 10.5 0 0 0 7 0 10.5 10.5 0 0 0-.071 2.929l1.414 1.414A8.5 8.5 0 0 1 7 2z"/>
                  <path d="M7 5a5.5 5.5 0 0 1 3.536 1.293l1.414-1.414A7.5 7.5 0 0 0 7 3a7.5 7.5 0 0 0-4.95 1.879L3.464 6.29A5.5 5.5 0 0 1 7 5z"/>
                  <circle cx="7" cy="9" r="1.5"/>
                </svg>
                <div className="flex items-center gap-0.5">
                  <div className="w-5 h-2.5 rounded-[2px] border border-foreground/60 flex items-center px-0.5">
                    <div className="flex-1 h-1.5 rounded-sm bg-foreground/80" />
                  </div>
                </div>
              </div>
            </div>

            <OnboardingScreen onComplete={() => setOnboarded(true)} />
          </div>
        </div>
      </div>
    )
  }

  const renderScreen = () => {
    switch (activeTab) {
      case "home": return <DashboardScreen />
      case "workout": return <WorkoutScreen />
      case "analytics": return <AnalyticsScreen />
      case "profile": return <ProfileScreen />
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090b]">
      {/* Ambient background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(163,230,53,0.04) 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 80% 80%, rgba(59,130,246,0.04) 0%, transparent 60%)",
        }}
      />

      <div className="relative" style={{ width: 375, height: 812 }}>
        {/* Phone chrome */}
        <div
          className="absolute inset-0 rounded-[48px] overflow-hidden shadow-2xl"
          style={{
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 40px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04), inset 0 0 0 1px rgba(255,255,255,0.02)",
          }}
        >
          {/* Status bar */}
          <div
            className="absolute top-0 left-0 right-0 h-11 z-50 flex items-center justify-between px-8"
            style={{ background: "rgba(9,9,11,0.9)" }}
          >
            <span className="text-[11px] font-semibold text-foreground">9:41</span>
            <div
              className="w-24 h-6 rounded-full"
              style={{ background: "#09090b", border: "1px solid rgba(255,255,255,0.1)" }}
            />
            <div className="flex items-center gap-1">
              <div className="flex gap-0.5 items-end">
                {[3, 5, 7, 9].map((h, i) => (
                  <div key={i} className="w-0.5 rounded-full bg-foreground" style={{ height: h }} />
                ))}
              </div>
              <svg width="14" height="10" viewBox="0 0 14 10" className="text-foreground fill-current opacity-80">
                <path d="M7 2a8.5 8.5 0 0 1 5.657 2.343l1.414-1.414A10.5 10.5 0 0 0 7 0 10.5 10.5 0 0 0-.071 2.929l1.414 1.414A8.5 8.5 0 0 1 7 2z"/>
                <path d="M7 5a5.5 5.5 0 0 1 3.536 1.293l1.414-1.414A7.5 7.5 0 0 0 7 3a7.5 7.5 0 0 0-4.95 1.879L3.464 6.29A5.5 5.5 0 0 1 7 5z"/>
                <circle cx="7" cy="9" r="1.5"/>
              </svg>
              <div className="flex items-center gap-0.5">
                <div className="w-5 h-2.5 rounded-[2px] border border-foreground/60 flex items-center px-0.5">
                  <div className="flex-1 h-1.5 rounded-sm bg-foreground/80" />
                </div>
              </div>
            </div>
          </div>

          {/* Screen content */}
          <div className="absolute inset-0 pt-11">
            {renderScreen()}
          </div>

          {/* Tab bar */}
          <TabBar active={activeTab} onChange={setActiveTab} />
        </div>

        {/* Phone side buttons (decorative) */}
        <div
          className="absolute -right-[3px] top-24 w-[3px] h-12 rounded-r-full"
          style={{ background: "rgba(255,255,255,0.06)" }}
        />
        <div
          className="absolute -left-[3px] top-20 w-[3px] h-8 rounded-l-full"
          style={{ background: "rgba(255,255,255,0.06)" }}
        />
        <div
          className="absolute -left-[3px] top-32 w-[3px] h-8 rounded-l-full"
          style={{ background: "rgba(255,255,255,0.06)" }}
        />
        <div
          className="absolute -left-[3px] top-44 w-[3px] h-8 rounded-l-full"
          style={{ background: "rgba(255,255,255,0.06)" }}
        />
      </div>
    </div>
  )
}
