import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import React from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";
import { api } from "@/convex/_generated/api";
import type { ThemeColors } from "@/types";

export default function SettingsScreen() {
  const { isDarkMode, toggleTheme, colors } = useTheme();
  const styles = createStyles(colors);

  const clearCompleted = useMutation(api.todos.clearCompleted);
  const clearAll = useMutation(api.todos.clearAll);

  const handleClearCompleted = () => {
    Alert.alert(
      "Очистити виконані",
      "Ви впевнені, що хочете видалити всі виконані завдання?",
      [
        { text: "Скасувати", style: "cancel" },
        {
          text: "Видалити",
          style: "destructive",
          onPress: async () => {
            try {
              const res = await clearCompleted();
              Alert.alert("Успішно", `Видалено ${res.deletedCount} завдань`);
            } catch {
              Alert.alert("Помилка", "Не вдалося видалити виконані завдання.");
            }
          },
        },
      ],
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      "Видалити ВСІ завдання",
      "Цю дію неможливо буде скасувати. Видалити всі завдання з хмари?",
      [
        { text: "Скасувати", style: "cancel" },
        {
          text: "Видалити все",
          style: "destructive",
          onPress: async () => {
            try {
              const res = await clearAll();
              Alert.alert(
                "Успішно",
                `Базу очищено. Видалено ${res.deletedCount} завдань`,
              );
            } catch {
              Alert.alert("Помилка", "Не вдалося очистити список завдань.");
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>⚙️ Налаштування</Text>

        <Text style={styles.sectionHeader}>ОФОРМЛЕННЯ</Text>
        <View style={styles.rowCard}>
          <View style={styles.rowLeft}>
            <Ionicons
              name={isDarkMode ? "moon" : "sunny"}
              size={22}
              color={isDarkMode ? "#A78BFA" : "#F59E0B"}
            />
            <Text style={styles.rowText}>
              {isDarkMode ? "Темна тема" : "Світла тема"}
            </Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: "#d1d5db", true: colors.primary }}
            thumbColor="#fff"
          />
        </View>

        <Text style={styles.sectionHeader}>КЕРУВАННЯ ХМАРОЮ CONVEX</Text>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleClearCompleted}
        >
          <Ionicons name="checkmark-done" size={20} color="#F59E0B" />
          <Text style={styles.actionButtonText}>
            Видалити виконані завдання
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.dangerButton} onPress={handleClearAll}>
          <Ionicons name="trash" size={20} color={colors.danger} />
          <Text style={styles.dangerButtonText}>
            Видалити абсолютно всі завдання
          </Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>
          Todo App v3.0 (Convex Cloud Edition)
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    content: { padding: 20 },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      marginBottom: 20,
      color: colors.text,
    },
    sectionHeader: {
      fontSize: 12,
      fontWeight: "bold",
      marginTop: 16,
      marginBottom: 8,
      letterSpacing: 0.5,
      color: colors.textMuted,
    },
    rowCard: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },
    rowLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
    rowText: {
      fontSize: 16,
      fontWeight: "500",
      color: colors.text,
    },
    actionButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      marginBottom: 10,
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },
    actionButtonText: {
      fontSize: 15,
      fontWeight: "500",
      color: colors.text,
    },
    dangerButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      marginBottom: 10,
      backgroundColor: colors.surface,
      borderColor: colors.danger,
    },
    dangerButtonText: {
      fontSize: 15,
      fontWeight: "500",
      color: colors.danger,
    },
    versionText: {
      textAlign: "center",
      marginTop: 32,
      fontSize: 12,
      color: colors.textMuted,
    },
  });
