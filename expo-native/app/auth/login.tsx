import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter, type Href } from "expo-router";
import { useAuth } from "@/lib/auth-context";
import { Sparkles, Mail, Lock } from "lucide-react-native";

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Ошибка", "Заполни все поля");
      return;
    }
    setLoading(true);
    const { error } = await signIn(email.trim(), password);
    setLoading(false);
    if (error) {
      Alert.alert("Ошибка входа", error.message);
    } else {
      router.replace("/(tabs)" as Href);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}>
            <Sparkles size={32} color="#a3e635" />
          </View>
          <Text style={styles.logoText}>ФитИИ</Text>
          <Text style={styles.logoSubtitle}>Твой ИИ-тренер в кармане</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.title}>Вход</Text>

          <View style={styles.inputGroup}>
            <View style={styles.inputWrapper}>
              <Mail size={18} color="#71717a" />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#52525b"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                textContentType="emailAddress"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputWrapper}>
              <Lock size={18} color="#71717a" />
              <TextInput
                style={styles.input}
                placeholder="Пароль"
                placeholderTextColor="#52525b"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                textContentType="password"
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.forgotButton}
            activeOpacity={0.7}
          >
            <Text style={styles.forgotText}>Забыли пароль?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonLoading]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#09090b" />
            ) : (
              <Text style={styles.loginButtonText}>Войти</Text>
            )}
          </TouchableOpacity>

          <View style={styles.signupRow}>
            <Text style={styles.signupText}>Нет аккаунта?</Text>
            <TouchableOpacity onPress={() => router.push("/auth/signup" as Href)} activeOpacity={0.7}>
              <Text style={styles.signupLink}>Создать</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#09090b",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 48,
  },
  logoIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "rgba(163,230,53,0.1)",
    borderWidth: 1,
    borderColor: "rgba(163,230,53,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  logoText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fafafa",
    letterSpacing: -0.5,
  },
  logoSubtitle: {
    fontSize: 14,
    color: "#71717a",
    marginTop: 4,
  },
  form: {
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fafafa",
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#fafafa",
  },
  forgotButton: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotText: {
    fontSize: 14,
    color: "#3b82f6",
  },
  loginButton: {
    width: "100%",
    height: 56,
    borderRadius: 20,
    backgroundColor: "#a3e635",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#a3e635",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  loginButtonLoading: {
    opacity: 0.7,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#09090b",
  },
  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 24,
  },
  signupText: {
    fontSize: 14,
    color: "#71717a",
  },
  signupLink: {
    fontSize: 14,
    fontWeight: "600",
    color: "#a3e635",
  },
});
