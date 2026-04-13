import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
} from "react-native";
import { useRouter, type Href } from "expo-router";
import {
  Bell,
  Shield,
  Heart,
  Activity,
  Crown,
  LogOut,
  ChevronRight,
  Check,
  Zap,
  Star,
  Flame,
  X,
} from "lucide-react-native";
import { useAuth } from "@/lib/auth-context";

const integrations = [
  { id: "apple", label: "Apple Health", connected: true, icon: Heart, color: "#ef4444" },
  { id: "google", label: "Google Fit", connected: false, icon: Activity, color: "#3b82f6" },
];

const proFeatures = [
  "Неограниченные ИИ-тренировки",
  "Анализ техники в реальном времени",
  "Персональные программы",
  "Голосовые подсказки ИИ",
  "Расширенная аналитика",
  "Приоритетная поддержка",
];

type ModalType = "logout" | "upgrade" | null;

export function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [privacy, setPrivacy] = useState(false);
  const [modal, setModal] = useState<ModalType>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  const displayName = user?.user_metadata?.username ?? user?.email?.split("@")[0] ?? "Пользователь";
  const displayEmail = user?.email ?? "";
  const initial = displayName.charAt(0).toUpperCase();

  const isPro = false;

  const xpPercent = 68;
  const xpCurrent = 2340;
  const xpNext = 3000;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          {isPro && (
            <View style={styles.proBadge}>
              <Crown size={12} color="#09090b" />
            </View>
          )}
        </View>

        <Text style={styles.name}>{displayName}</Text>
        <Text style={styles.email}>{displayEmail}</Text>

        {/* Level badge */}
        <View style={styles.levelBadge}>
          <Star size={16} color="#a3e635" />
          <Text style={styles.levelText}>Уровень 5</Text>
          <Text style={styles.levelDesc}>· Продвинутый</Text>
        </View>

        {/* XP bar */}
        <View style={styles.xpContainer}>
          <View style={styles.xpHeader}>
            <Text style={styles.xpLabel}>Опыт</Text>
            <Text style={styles.xpValue}>
              {xpCurrent} / {xpNext} XP
            </Text>
          </View>
          <View style={styles.xpBar}>
            <View
              style={[
                styles.xpFill,
                { width: `${xpPercent}%` },
              ]}
            />
          </View>
        </View>

        {/* Quick stats */}
        <View style={styles.quickStats}>
          {[
            { label: "Тренировок", value: "48", icon: Zap, color: "#a3e635" },
            { label: "Стрик", value: "12", icon: Flame, color: "#f97316" },
            { label: "Бейджей", value: "4", icon: Star, color: "#eab308" },
          ].map(({ label, value, icon: Icon, color }) => (
            <View key={label} style={styles.quickStat}>
              <Icon size={16} color={color} />
              <Text style={styles.quickStatValue}>{value}</Text>
              <Text style={styles.quickStatLabel}>{label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Subscription card */}
      <View style={styles.section}>
        {isPro ? (
          <View style={styles.proCard}>
            <View style={styles.proCardHeader}>
              <Crown size={20} color="#eab308" />
              <Text style={styles.proCardTitle}>ФитИИ Pro</Text>
            </View>
            <Text style={styles.proCardDesc}>
              Следующее списание: 12 апр 2026
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.upgradeCard}
            onPress={() => setModal("upgrade")}
            activeOpacity={0.8}
          >
            <View style={styles.upgradeContent}>
              <View style={styles.upgradeHeader}>
                <Crown size={20} color="#a3e635" />
                <Text style={styles.upgradeTitle}>Обновить до Pro</Text>
              </View>
              <Text style={styles.upgradeDesc}>Разблокируй все возможности ИИ</Text>
            </View>
            <View style={styles.upgradePrice}>
              <Text style={styles.upgradePriceText}>399₽/мес</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Настройки</Text>
        <View style={styles.settingsContainer}>
          {/* Notifications toggle */}
          <View style={styles.setting}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: "rgba(163,230,53,0.1)" }]}>
                <Bell size={16} color="#a3e635" />
              </View>
              <Text style={styles.settingLabel}>Уведомления</Text>
            </View>
            <TouchableOpacity
              style={[
                styles.toggle,
                { backgroundColor: notifications ? "#a3e635" : "rgba(255,255,255,0.1)" },
              ]}
              onPress={() => setNotifications(!notifications)}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.toggleKnob,
                  {
                    left: notifications ? 28 : 4,
                    backgroundColor: notifications ? "#fff" : "#fff",
                  },
                ]}
              />
            </TouchableOpacity>
          </View>

          {/* Privacy toggle */}
          <View style={styles.setting}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: "rgba(59,130,246,0.1)" }]}>
                <Shield size={16} color="#3b82f6" />
              </View>
              <Text style={styles.settingLabel}>Приватность</Text>
            </View>
            <TouchableOpacity
              style={[
                styles.toggle,
                { backgroundColor: privacy ? "#3b82f6" : "rgba(255,255,255,0.1)" },
              ]}
              onPress={() => setPrivacy(!privacy)}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.toggleKnob,
                  {
                    left: privacy ? 28 : 4,
                  },
                ]}
              />
            </TouchableOpacity>
          </View>

          {/* Integrations */}
          {integrations.map(({ id, label, connected, icon: Icon, color }) => (
            <View key={id} style={styles.setting}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: `${color}18` }]}>
                  <Icon size={16} color={color} />
                </View>
                <View>
                  <Text style={styles.settingLabel}>{label}</Text>
                  <Text style={styles.settingDesc}>
                    {connected ? "Подключено" : "Не подключено"}
                  </Text>
                </View>
              </View>
              {connected ? (
                <View style={styles.activeBadge}>
                  <Check size={12} color="#a3e635" />
                  <Text style={styles.activeBadgeText}>Активно</Text>
                </View>
              ) : (
                <ChevronRight size={16} color="#71717a" />
              )}
            </View>
          ))}
        </View>
      </View>

      {/* Logout button */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => setModal("logout")}
          activeOpacity={0.8}
        >
          <LogOut size={16} color="#ef4444" />
          <Text style={styles.logoutText}>Выйти из аккаунта</Text>
        </TouchableOpacity>
      </View>

      {/* Modals */}
      <Modal
        transparent
        visible={modal !== null}
        animationType="slide"
        onRequestClose={() => setModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {modal === "logout" && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Выйти?</Text>
                  <TouchableOpacity onPress={() => setModal(null)}>
                    <X size={20} color="#71717a" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.modalDesc}>
                  Твои данные сохранятся. Ты сможешь войти снова.
                </Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.modalCancelButton}
                    onPress={() => setModal(null)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.modalCancelText}>Отмена</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalConfirmButton}
                    onPress={async () => {
                      setLoggingOut(true);
                      await signOut();
                      setLoggingOut(false);
                      setModal(null);
                      router.replace("/auth/login" as Href);
                    }}
                    disabled={loggingOut}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.modalConfirmText}>
                      {loggingOut ? "..." : "Выйти"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {modal === "upgrade" && (
              <>
                <View style={styles.modalHeader}>
                  <View style={styles.modalTitleContainer}>
                    <Crown size={20} color="#a3e635" />
                    <Text style={styles.modalTitle}>ФитИИ Pro</Text>
                  </View>
                  <TouchableOpacity onPress={() => setModal(null)}>
                    <X size={20} color="#71717a" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.modalPrice}>
                  399₽<Text style={styles.modalPriceUnit}>/месяц</Text>
                </Text>
                <View style={styles.modalFeatures}>
                  {proFeatures.map((feature) => (
                    <View key={feature} style={styles.modalFeature}>
                      <Check size={16} color="#a3e635" />
                      <Text style={styles.modalFeatureText}>{feature}</Text>
                    </View>
                  ))}
                </View>
                <TouchableOpacity
                  style={styles.modalSubscribeButton}
                  onPress={() => setModal(null)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.modalSubscribeText}>
                    Подписаться на Pro
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#09090b",
  },
  content: {
    paddingTop: 60,
    paddingBottom: 100,
  },
  header: {
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: "#1a2d0a",
    borderWidth: 2,
    borderColor: "rgba(163,230,53,0.4)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#a3e635",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#a3e635",
  },
  proBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#eab308",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#eab308",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fafafa",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "#71717a",
    marginBottom: 12,
  },
  levelBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "rgba(163,230,53,0.1)",
    borderWidth: 1,
    borderColor: "rgba(163,230,53,0.25)",
  },
  levelText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#a3e635",
  },
  levelDesc: {
    fontSize: 12,
    color: "#71717a",
  },
  xpContainer: {
    width: "100%",
    marginTop: 16,
  },
  xpHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  xpLabel: {
    fontSize: 12,
    color: "#71717a",
  },
  xpValue: {
    fontSize: 12,
    color: "#71717a",
  },
  xpBar: {
    width: "100%",
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.08)",
    overflow: "hidden",
  },
  xpFill: {
    height: "100%",
    backgroundColor: "#a3e635",
    shadowColor: "#a3e635",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  quickStats: {
    flexDirection: "row",
    width: "100%",
    gap: 12,
    marginTop: 16,
  },
  quickStat: {
    flex: 1,
    padding: 12,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    gap: 4,
  },
  quickStatValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fafafa",
  },
  quickStatLabel: {
    fontSize: 10,
    color: "#71717a",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#71717a",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  proCard: {
    borderRadius: 24,
    padding: 20,
    backgroundColor: "rgba(234,179,8,0.15)",
    borderWidth: 1,
    borderColor: "rgba(234,179,8,0.3)",
  },
  proCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  proCardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#eab308",
  },
  proCardDesc: {
    fontSize: 13,
    color: "#71717a",
  },
  upgradeCard: {
    borderRadius: 24,
    padding: 20,
    backgroundColor: "#1a2d0a",
    borderWidth: 1,
    borderColor: "rgba(163,230,53,0.3)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#a3e635",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
  },
  upgradeContent: {
    flex: 1,
  },
  upgradeHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  upgradeTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#a3e635",
  },
  upgradeDesc: {
    fontSize: 13,
    color: "#71717a",
  },
  upgradePrice: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#a3e635",
  },
  upgradePriceText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#09090b",
  },
  settingsContainer: {
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  setting: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "rgba(255,255,255,0.02)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  settingIcon: {
    width: 32,
    height: 32,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#fafafa",
  },
  settingDesc: {
    fontSize: 12,
    color: "#71717a",
  },
  toggle: {
    width: 48,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
  },
  toggleKnob: {
    position: "absolute",
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  activeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: "rgba(163,230,53,0.1)",
  },
  activeBadgeText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#a3e635",
  },
  logoutButton: {
    width: "100%",
    height: 56,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "rgba(239,68,68,0.08)",
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.2)",
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ef4444",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#18181b",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fafafa",
  },
  modalTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  modalDesc: {
    fontSize: 14,
    color: "#71717a",
    marginBottom: 24,
  },
  modalPrice: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#a3e635",
    marginBottom: 16,
  },
  modalPriceUnit: {
    fontSize: 16,
    color: "#71717a",
    fontWeight: "400",
  },
  modalFeatures: {
    gap: 8,
    marginBottom: 24,
  },
  modalFeature: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  modalFeatureText: {
    fontSize: 14,
    color: "#fafafa",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    height: 56,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fafafa",
  },
  modalConfirmButton: {
    flex: 1,
    height: 56,
    borderRadius: 20,
    backgroundColor: "rgba(239,68,68,0.15)",
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalConfirmText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ef4444",
  },
  modalSubscribeButton: {
    width: "100%",
    height: 56,
    borderRadius: 20,
    backgroundColor: "#a3e635",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#a3e635",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
  },
  modalSubscribeText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#09090b",
  },
});
