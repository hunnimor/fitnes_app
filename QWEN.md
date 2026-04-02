# ФитИИ (FitCoach) — AI-Powered Fitness App

## Project Overview

**ФитИИ** is a mobile-first AI fitness trainer application that provides computer vision-powered workout analysis, real-time form correction, and personalized training plans. The project exists in two versions:

1. **React Web** — Web version with phone-frame UI simulator (this directory)
2. **React Native Expo** — Native mobile app for iOS/Android (`expo-native/`)

### Key Features
- **Onboarding flow** — Goal selection, equipment availability, and fitness level assessment
- **Dashboard** — Daily workout recommendations, progress tracking, streaks, and AI tips
- **Workout screen** — Real-time exercise tracking with computer vision analysis
- **Analytics** — Weekly progress charts and performance metrics
- **Profile** — User settings and preferences
- **Dark theme** — Neon lime (#a3e635) and electric blue (#3b82f6) accent colors

---

## 📱 React Native Expo Version

### Quick Start

```bash
cd expo-native
pnpm install
pnpm start
```

Then:
- Press **`i`** for iOS simulator
- Press **`a`** for Android emulator
- Scan QR code with **Expo Go** app on real device

### Tech Stack (Expo)

| Category | Technology |
|----------|------------|
| **Framework** | Expo SDK 54 |
| **Navigation** | Expo Router 6 |
| **Language** | TypeScript |
| **Styling** | React Native StyleSheet |
| **Icons** | lucide-react-native |
| **Camera** | expo-camera |

### Project Structure (Expo)

```
expo-native/
├── app/                      # Expo Router navigation
│   ├── _layout.tsx           # Root layout
│   ├── onboarding.tsx        # Onboarding screen
│   └── (tabs)/               # Tab navigation
│       ├── _layout.tsx       # Tab bar layout
│       ├── index.tsx         # Dashboard
│       ├── workout.tsx       # Workout with camera
│       ├── analytics.tsx     # Analytics
│       └── profile.tsx       # Profile
├── components/               # Screen components
│   ├── onboarding-screen.tsx
│   ├── dashboard-screen.tsx
│   ├── workout-screen.tsx
│   ├── analytics-screen.tsx
│   └── profile-screen.tsx
├── hooks/                    # Custom hooks
├── lib/                      # Utilities
├── assets/                   # Images, icons
└── app.json                  # Expo config
```

### Camera Permissions

The app requests camera and microphone permissions for:
- Real-time form analysis
- Voice coaching feedback

Configured in `app.json`:
```json
{
  "ios": {
    "infoPlist": {
      "NSCameraUsageDescription": "ФитИИ использует камеру для анализа техники упражнений",
      "NSMicrophoneUsageDescription": "ФитИИ использует микрофон для голосовых подсказок"
    }
  },
  "android": {
    "permissions": ["CAMERA", "RECORD_AUDIO"]
  }
}
```

---

## 🌐 React Web Version

### Quick Start

```bash
pnpm install
pnpm dev
```

Opens at `http://localhost:3000`

### Tech Stack (Web)

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16.1.6 |
| **Language** | TypeScript 5.7.3 |
| **UI Library** | React 19.2.4 |
| **Styling** | Tailwind CSS 4.2.0 |
| **Components** | shadcn/ui (new-york style) |
| **Icons** | Lucide React |
| **Charts** | Recharts |
| **Forms** | React Hook Form + Zod |
| **Deployment** | Vercel Analytics |

### Project Structure (Web)

```
fitnes_app/
├── app/                    # Next.js App Router
│   ├── globals.css         # Global styles + Tailwind config
│   ├── layout.tsx          # Root layout with metadata
│   └── page.tsx            # Main app component (phone frame wrapper)
├── components/
│   ├── fitcoach/           # Core app screens
│   │   ├── onboarding-screen.tsx
│   │   ├── dashboard-screen.tsx
│   │   ├── workout-screen.tsx
│   │   ├── analytics-screen.tsx
│   │   ├── profile-screen.tsx
│   │   └── tab-bar.tsx
│   ├── ui/                 # shadcn/ui components
│   └── theme-provider.tsx
├── hooks/
│   ├── use-mobile.ts       # Mobile device detection
│   └── use-toast.ts        # Toast notifications
├── lib/
│   └── utils.ts            # cn() utility for class merging
├── public/                 # Static assets
└── styles/                 # Additional styles
```

### Building and Running (Web)

```bash
# Development
pnpm dev

# Production build
pnpm build
pnpm start

# Linting
pnpm lint
```

---

## Design System

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--background` | `#09090b` | Main background |
| `--foreground` | `#fafafa` | Primary text |
| `--primary` | `#a3e635` | Neon lime (CTA, accents) |
| `--secondary` | `#3b82f6` | Electric blue |
| `--surface` | `#18181b` | Card backgrounds |
| `--muted` | `#27272a` | Subtle backgrounds |

### Custom Utility Classes (Web)

- `.glass` — Glassmorphism effect with backdrop blur
- `.glow-lime` / `.glow-blue` — Neon glow shadows
- `.neon-border-lime` / `.neon-border-blue` — Glowing borders
- `.text-glow-lime` — Text glow effect
- `.phone-screen` — 375x812px constrained viewport

---

## Development Conventions

### Code Style
- **TypeScript**: Strict mode enabled
- **Path aliases**: `@/*` maps to project root
- **Component naming**: PascalCase for components, kebab-case for files
- **Imports**: Use path aliases (`@/components/...`, `@/lib/...`)

### Architecture Patterns
- **Client components**: All screens use `"use client"` directive for interactivity
- **State management**: React `useState` and `useEffect` hooks
- **Responsive design**: Phone-frame constrained UI (375x812px simulator for web)

---

## Notes

- The app metadata is in Russian (`ФитИИ — Твой ИИ-тренер в кармане`)
- Both versions share the same design and functionality
- Expo version is recommended for production mobile deployment
- Web version is useful for prototyping and web demos
