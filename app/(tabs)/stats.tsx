import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";
import { api } from "@/convex/_generated/api";
import type { ThemeColors } from "@/types";

export default function StatsScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const stats = useQuery(api.todos.getStats);

  if (stats === undefined) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>📊 Статистика</Text>
        <Text style={styles.subtitle}>Аналітика завдань у реальному часі</Text>

        <View style={styles.grid}>
          <View style={styles.card}>
            <Ionicons name="list" size={28} color={colors.primary} />
            <Text style={styles.cardValue}>{stats.total}</Text>
            <Text style={styles.cardLabel}>Всього завдань</Text>
          </View>

          <View style={styles.card}>
            <Ionicons name="time" size={28} color="#F59E0B" />
            <Text style={styles.cardValue}>{stats.active}</Text>
            <Text style={styles.cardLabel}>В процесі</Text>
          </View>

          <View style={styles.card}>
            <Ionicons
              name="checkmark-done-circle"
              size={28}
              color={colors.success}
            />
            <Text style={styles.cardValue}>{stats.completed}</Text>
            <Text style={styles.cardLabel}>Виконано</Text>
          </View>

          <View style={styles.card}>
            <Ionicons name="trending-up" size={28} color="#8B5CF6" />
            <Text style={styles.cardValue}>{stats.percentage}%</Text>
            <Text style={styles.cardLabel}>Прогрес</Text>
          </View>
        </View>

        <View style={styles.progressTrack}>
          <View
            style={[styles.progressFill, { width: `${stats.percentage}%` }]}
          />
        </View>
        <Text style={styles.progressCaption}>
          {stats.total === 0
            ? "Додайте завдання, щоб побачити прогрес"
            : `Виконано ${stats.completed} із ${stats.total} завдань`}
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
    centerContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: colors.text,
    },
    subtitle: {
      fontSize: 14,
      marginTop: 4,
      marginBottom: 20,
      color: colors.textMuted,
    },
    grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
    card: {
      width: "48%",
      padding: 16,
      borderRadius: 16,
      borderWidth: 1,
      alignItems: "center",
      gap: 6,
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },
    cardValue: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.text,
    },
    cardLabel: {
      fontSize: 13,
      color: colors.textMuted,
    },
    progressTrack: {
      height: 10,
      borderRadius: 5,
      marginTop: 24,
      overflow: "hidden",
      backgroundColor: colors.border,
    },
    progressFill: {
      height: "100%",
      borderRadius: 5,
      backgroundColor: colors.primary,
    },
    progressCaption: {
      fontSize: 13,
      marginTop: 8,
      textAlign: "center",
      color: colors.textMuted,
    },
  });
