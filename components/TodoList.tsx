import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import type { Id } from "@/convex/_generated/dataModel";
import type { ThemeColors, Todo } from "@/types";
import TodoItem from "./TodoItem";

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: Id<"todos">) => Promise<void>;
  onDelete: (id: Id<"todos">) => Promise<void>;
  onEdit: (id: Id<"todos">, text: string) => Promise<void>;
}

export default function TodoList({
  todos,
  onToggle,
  onDelete,
  onEdit,
}: TodoListProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  if (todos.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          Список завдань порожній. Додайте нове завдання!
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={todos}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <TodoItem
          todo={item}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      )}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    listContent: {
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    emptyContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 40,
      paddingVertical: 40,
    },
    emptyText: {
      fontSize: 14,
      textAlign: "center",
      color: colors.textMuted,
    },
  });
