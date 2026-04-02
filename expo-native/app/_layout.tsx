import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ title: "ФитИИ" }} />
        <Stack.Screen name="onboarding" options={{ title: "Добро пожаловать" }} />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}
