import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "@/context/ThemeContext";
import type { Id } from "@/convex/_generated/dataModel";
import type { ThemeColors, Todo } from "@/types";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: Id<"todos">) => Promise<void>;
  onDelete: (id: Id<"todos">) => Promise<void>;
  onEdit: (id: Id<"todos">, text: string) => Promise<void>;
}

export default function TodoItem({
  todo,
  onToggle,
  onDelete,
  onEdit,
}: TodoItemProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleSave = async () => {
    const trimmed = editText.trim();
    if (!trimmed) {
      setEditText(todo.text);
      setIsEditing(false);
      return;
    }
    if (trimmed !== todo.text) {
      await onEdit(todo._id, trimmed);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(todo.text);
    setIsEditing(false);
  };

  const startEditing = () => {
    setEditText(todo.text);
    setIsEditing(true);
  };

  return (
    <View style={styles.item}>
      <TouchableOpacity onPress={() => onToggle(todo._id)}>
        <Ionicons
          name={todo.isCompleted ? "checkmark-circle" : "ellipse-outline"}
          size={26}
          color={todo.isCompleted ? colors.success : colors.textMuted}
        />
      </TouchableOpacity>

      {isEditing ? (
        <TextInput
          style={styles.editInput}
          value={editText}
          onChangeText={setEditText}
          onBlur={handleSave}
          onSubmitEditing={handleSave}
          autoFocus
          maxLength={120}
          returnKeyType="done"
        />
      ) : (
        <TouchableOpacity
          style={styles.textWrapper}
          onLongPress={startEditing}
        >
          <Text
            style={[styles.text, todo.isCompleted && styles.textCompleted]}
            numberOfLines={3}
          >
            {todo.text}
          </Text>
        </TouchableOpacity>
      )}

      <View style={styles.actions}>
        {isEditing ? (
          <TouchableOpacity onPress={handleCancel} style={styles.actionBtn}>
            <Ionicons name="close" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={startEditing}
            style={styles.actionBtn}
          >
            <Ionicons
              name="create-outline"
              size={20}
              color={colors.textMuted}
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => onDelete(todo._id)}
          style={styles.actionBtn}
        >
          <Ionicons name="trash-outline" size={20} color={colors.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    item: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 12,
      padding: 14,
      marginBottom: 10,
      borderWidth: 1,
      gap: 12,
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },
    textWrapper: {
      flex: 1,
    },
    text: {
      fontSize: 15,
      color: colors.text,
    },
    textCompleted: {
      textDecorationLine: "line-through",
      color: colors.textMuted,
    },
    editInput: {
      flex: 1,
      fontSize: 15,
      borderBottomWidth: 1,
      paddingVertical: 2,
      color: colors.text,
      borderBottomColor: colors.primary,
    },
    actions: {
      flexDirection: "row",
      gap: 6,
    },
    actionBtn: {
      padding: 4,
    },
  });
