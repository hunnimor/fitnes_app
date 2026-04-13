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
import { Sparkles, Mail, Lock, User } from "lucide-react-native";

export default function SignupScreen() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert("Ошибка", "Заполни все поля");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Ошибка", "Пароли не совпадают");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Ошибка", "Пароль должен быть минимум 6 символов");
      return;
    }
    setLoading(true);
    const { error } = await signUp(email.trim(), password, username.trim());
    setLoading(false);
    if (error) {
      Alert.alert("Ошибка регистрации", error.message);
    } else {
      Alert.alert(
        "Аккаунт создан",
        "Проверь почту для подтверждения, затем войди",
        [{ text: "OK", onPress: () => router.replace("/auth/login" as Href) }]
      );
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
          <Text style={styles.logoSubtitle}>Начни тренироваться с ИИ</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.title}>Создать аккаунт</Text>

          <View style={styles.inputGroup}>
            <View style={styles.inputWrapper}>
              <User size={18} color="#71717a" />
              <TextInput
                style={styles.input}
                placeholder="Имя"
                placeholderTextColor="#52525b"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="words"
              />
            </View>
          </View>

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

          <View style={styles.inputGroup}>
            <View style={styles.inputWrapper}>
              <Lock size={18} color="#71717a" />
              <TextInput
                style={styles.input}
                placeholder="Повтори пароль"
                placeholderTextColor="#52525b"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                textContentType="password"
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.signupButton, loading && styles.signupButtonLoading]}
            onPress={handleSignup}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#09090b" />
            ) : (
              <Text style={styles.signupButtonText}>Создать аккаунт</Text>
            )}
          </TouchableOpacity>

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Уже есть аккаунт?</Text>
            <TouchableOpacity onPress={() => router.replace("/auth/login" as Href)} activeOpacity={0.7}>
              <Text style={styles.loginLink}>Войти</Text>
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
    marginBottom: 32,
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
    marginBottom: 12,
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
  signupButton: {
    width: "100%",
    height: 56,
    borderRadius: 20,
    backgroundColor: "#a3e635",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    shadowColor: "#a3e635",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  signupButtonLoading: {
    opacity: 0.7,
  },
  signupButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#09090b",
  },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 24,
  },
  loginText: {
    fontSize: 14,
    color: "#71717a",
  },
  loginLink: {
    fontSize: 14,
    fontWeight: "600",
    color: "#a3e635",
  },
});
