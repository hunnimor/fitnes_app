# ФитИИ — AI Fitness Trainer (Expo)

Мобильное приложение для фитнес-тренировок с ИИ-анализом техники упражнений.

## 🚀 Быстрый старт

### 1. Установка зависимостей

```bash
cd expo-native
pnpm install
```

### 2. Запуск приложения

```bash
pnpm start
```

Затем:
- Нажмите **`i`** для запуска на iOS симуляторе
- Нажмите **`a`** для запуска на Android эмуляторе
- Отсканируйте QR-код через **Expo Go** на реальном устройстве

## 📁 Структура проекта

```
expo-native/
├── app/                      # Expo Router навигация
│   ├── _layout.tsx           # Главный layout
│   ├── onboarding.tsx        # Экран онбординга
│   └── (tabs)/               # Tab navigation
│       ├── _layout.tsx       # Layout с таббаром
│       ├── index.tsx         # Главная (Dashboard)
│       ├── workout.tsx       # Тренировка с камерой
│       ├── analytics.tsx     # Аналитика
│       └── profile.tsx       # Профиль
├── components/               # React Native компоненты
│   ├── onboarding-screen.tsx
│   ├── dashboard-screen.tsx
│   ├── workout-screen.tsx
│   ├── analytics-screen.tsx
│   └── profile-screen.tsx
├── hooks/                    # Custom hooks
│   ├── use-mobile.ts
│   └── use-toast.ts
├── lib/                      # Utilities
│   └── utils.ts
├── assets/                   # Изображения, шрифты
├── app.json                  # Конфигурация Expo
├── tailwind.config.js        # NativeWind конфигурация
├── babel.config.js           # Babel с NativeWind
└── package.json
```

## 🛠 Технологии

| Категория | Технология |
|-----------|------------|
| **Framework** | Expo SDK 52 |
| **Navigation** | Expo Router 4 |
| **Styling** | NativeWind (Tailwind CSS) |
| **Icons** | lucide-react-native |
| **Camera** | expo-camera |
| **Language** | TypeScript |

## 📱 Основные возможности

### 1. **Онбординг**
- Выбор цели (похудение, набор массы, выносливость, реабилитация)
- Выбор оборудования (тело, гантели, турник, зал)
- Выбор уровня подготовки

### 2. **Dashboard**
- Персональное приветствие
- Тренировка дня с рекомендациями
- Статистика (калории, минуты, серии)
- Прогресс за неделю (график)
- ИИ-советы

### 3. **Тренировка с ИИ**
- **Камера** для анализа техники в реальном времени
- **Скелетная анимация** для визуализации позы
- **Счётчик повторений** с ИИ-детекцией
- **Оценка качества** (отлично/нормально/ошибка)
- **Голосовые подсказки** с техникой выполнения
- **Таймер** отдыха между подходами

### 4. **Аналитика**
- Графики веса, повторений, качества техники
- Heatmap активности (GitHub-style)
- Сравнение фото до/после
- Достижения и бейджи

### 5. **Профиль**
- Уровень и XP прогресс
- Быстрые статистики
- Подписка ФитИИ Pro
- Настройки (уведомления, приватность)
- Интеграции (Apple Health, Google Fit)

## 🎨 Дизайн-система

### Цветовая палитра

| Цвет | Значение | Использование |
|------|----------|---------------|
| `#09090b` | Background | Основной фон |
| `#fafafa` | Foreground | Текст |
| `#a3e635` | Primary (Neon Lime) | CTA, акценты |
| `#3b82f6` | Secondary (Electric Blue) | Вторичные элементы |
| `#18181b` | Surface | Карточки |

### Кастомные стили

Компоненты используют `StyleSheet` с тенями для неонового эффекта:

```typescript
{
  shadowColor: "#a3e635",
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.35,
  shadowRadius: 24,
}
```

## 🔧 Конфигурация

### Разрешения (app.json)

Приложение запрашивает:
- **CAMERA** — для анализа техники упражнений
- **RECORD_AUDIO** — для голосовых подсказок

### NativeWind

Стили Tailwind CSS работают через NativeWind:

```bash
# Установить NativeWind
pnpm add nativewind
pnpm add -D tailwindcss
```

## 📦 Сборка

### Для iOS

```bash
pnpm ios
```

### Для Android

```bash
pnpm android
```

### Для Web

```bash
pnpm web
```

## 🚢 Деплой

### EAS Build

```bash
# Установить EAS CLI
pnpm add -g eas-cli

# Настроить проект
eas build:configure

# Собрать для iOS
eas build --platform ios

# Собрать для Android
eas build --platform android
```

### EAS Submit

```bash
# Отправить в App Store
eas submit --platform ios

# Отправить в Google Play
eas submit --platform android
```

## 🔐 Переменные окружения

Создайте файл `.env` для чувствительных данных:

```env
# Пример
API_URL=https://api.fitii.app
ANALYTICS_KEY=your_key_here
```

## 🧪 Тестирование

```bash
# Запустить линтер
pnpm lint

# Запустить TypeScript проверку
npx tsc --noEmit
```

## 📝 Заметки

- Приложение использует **Expo Go** для разработки
- Для production сборки используйте **EAS Build**
- Камера требует реального устройства для тестирования
- Все экраны адаптированы под mobile-first (375x812)

## 🤝 Контрибьюция

1. Fork репозиторий
2. Создайте ветку (`git checkout -b feature/amazing-feature`)
3. Commit изменений (`git commit -m 'Add amazing feature'`)
4. Push (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📄 Лицензия

MIT License
