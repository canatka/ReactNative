import { useMutation, useQuery } from "convex/react";
import { ConvexError } from "convex/values";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import TodoForm from "@/components/TodoForm";
import TodoList from "@/components/TodoList";
import { useTheme } from "@/context/ThemeContext";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import type { ThemeColors } from "@/types";

const getErrorMessage = (error: unknown): string => {
  if (error instanceof ConvexError && typeof error.data === "string") {
    return error.data;
  }
  return "Не вдалося виконати дію. Перевірте з'єднання з Convex.";
};

export default function TodosScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const todos = useQuery(api.todos.getTodos);

  const addTodo = useMutation(api.todos.createTodo);
  const toggleTodo = useMutation(api.todos.toggleTodo);
  const updateTodo = useMutation(api.todos.updateTodo);
  const deleteTodo = useMutation(api.todos.deleteTodo);

  const handleAdd = async (text: string) => {
    try {
      await addTodo({ text });
    } catch (error) {
      Alert.alert("Помилка", getErrorMessage(error));
    }
  };

  const handleToggle = async (id: Id<"todos">) => {
    try {
      await toggleTodo({ id });
    } catch (error) {
      Alert.alert("Помилка", getErrorMessage(error));
    }
  };

  const handleEdit = async (id: Id<"todos">, text: string) => {
    try {
      await updateTodo({ id, text });
    } catch (error) {
      Alert.alert("Помилка", getErrorMessage(error));
    }
  };

  const handleDelete = async (id: Id<"todos">) => {
    try {
      await deleteTodo({ id });
    } catch (error) {
      Alert.alert("Помилка", getErrorMessage(error));
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Header
          totalCount={todos?.length ?? 0}
          completedCount={todos?.filter((t) => t.isCompleted).length ?? 0}
        />

        <TodoForm onAdd={handleAdd} />

        {todos === undefined ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Синхронізація з Convex...</Text>
          </View>
        ) : (
          <TodoList
            todos={todos}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    flex: {
      flex: 1,
    },
    centerContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    loadingText: {
      marginTop: 12,
      fontSize: 14,
      color: colors.textMuted,
    },
  });
