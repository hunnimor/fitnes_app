import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "@/lib/auth-context";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Public routes */}
        <Stack.Screen name="auth/login" options={{ title: "Вход" }} />
        <Stack.Screen name="auth/signup" options={{ title: "Регистрация" }} />
        <Stack.Screen name="onboarding" options={{ title: "Добро пожаловать" }} />
        {/* Protected tabs */}
        <Stack.Screen name="(tabs)" options={{ title: "ФитИИ" }} />
      </Stack>
      <StatusBar style="light" />
    </AuthProvider>
  );
}
