import { Tabs } from "expo-router";
import { View, StyleSheet } from "react-native";
import { Home, Dumbbell, BarChart2, User } from "lucide-react-native";

export default function TabsLayout() {
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
});
