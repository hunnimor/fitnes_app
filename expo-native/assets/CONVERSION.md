# ФитИИ — AI Fitness Coach

## Конвертация из React Web в React Native Expo

Этот проект был сконвертирован из React Web (v0) в React Native Expo.

### Что было изменено:

1. **HTML → React Native компоненты**
   - `div` → `View`
   - `p`, `h1`, `h2`, `span` → `Text`
   - `button` → `TouchableOpacity`
   - `img` → `Image`

2. **Стили**
   - Tailwind CSS → NativeWind
   - CSS классы → StyleSheet
   - Hover эффекты → onPress

3. **Иконки**
   - `lucide-react` → `lucide-react-native`

4. **Навигация**
   - Client-side routing → Expo Router (tabs)

5. **Камера**
   - Видео заглушка → `expo-camera` / `react-native-vision-camera`

### Структура компонентов:

```
components/
├── onboarding-screen.tsx    # Онбординг (цель, оборудование, уровень)
├── dashboard-screen.tsx     # Главная (тренировка дня, статистика)
├── workout-screen.tsx       # Тренировка с камерой и ИИ-анализом
├── analytics-screen.tsx     # Графики и достижения
└── profile-screen.tsx       # Профиль и настройки
```

### Запуск:

```bash
cd expo-native
pnpm install
pnpm start
```
