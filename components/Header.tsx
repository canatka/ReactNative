import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import type { ThemeColors } from "@/types";

interface HeaderProps {
  totalCount: number;
  completedCount: number;
}

export default function Header({ totalCount, completedCount }: HeaderProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.header}>
      <View style={styles.titleGroup}>
        <Text style={styles.icon}>📝</Text>
        <Text style={styles.title}>Мій Список Завдань</Text>
      </View>
      <Text style={styles.subtitle}>
        {totalCount > 0
          ? `Виконано ${completedCount} з ${totalCount} завдань`
          : "Додайте своє перше завдання"}
      </Text>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    header: {
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 12,
    },
    titleGroup: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    icon: {
      fontSize: 24,
    },
    title: {
      fontSize: 22,
      fontWeight: "800",
      color: colors.text,
    },
    subtitle: {
      fontSize: 14,
      marginTop: 4,
      color: colors.textMuted,
    },
  });
