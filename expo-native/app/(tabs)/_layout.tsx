import { Tabs, useRouter } from "expo-router";
import { StyleSheet, ActivityIndicator, View, Platform } from "react-native";
import { Home, Dumbbell, BarChart2, User } from "lucide-react-native";
import { useAuth } from "@/lib/auth-context";
import { useEffect } from "react";

export default function TabsLayout() {
  const router = useRouter();
  const { user, loading } = useAuth();

  // Auth guard: only run on native (iOS/Android). Web doesn't need auth gating.
  useEffect(() => {
    if (Platform.OS !== "web" && !loading && !user) {
      router.replace("/auth/login" as any);
    }
  }, [loading, user]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#a3e635" />
      </View>
    );
  }

  if (Platform.OS !== "web" && !user) {
    return null; // useEffect handles redirect
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: "#a3e635",
        tabBarInactiveTintColor: "#52525b",
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Главная",
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} strokeWidth={2.5} />,
        }}
      />
      <Tabs.Screen
        name="workout"
        options={{
          title: "Тренировка",
          tabBarIcon: ({ color, size }) => <Dumbbell size={size} color={color} strokeWidth={2.5} />,
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: "Аналитика",
          tabBarIcon: ({ color, size }) => <BarChart2 size={size} color={color} strokeWidth={2.5} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Профиль",
          tabBarIcon: ({ color, size }) => <User size={size} color={color} strokeWidth={2.5} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 85,
    backgroundColor: "rgba(9, 9, 11, 0.92)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.07)",
    paddingBottom: 25,
    paddingTop: 10,
  },
  tabBarLabel: {
    fontSize: 10,
    fontWeight: "600",
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#09090b",
  },
});
