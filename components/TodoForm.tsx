import React, { useState } from "react";
import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "@/context/ThemeContext";
import type { ThemeColors } from "@/types";

interface TodoFormProps {
  onAdd: (text: string) => Promise<void>;
}

export default function TodoForm({ onAdd }: TodoFormProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const trimmed = text.trim();
    if (!trimmed || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onAdd(trimmed);
      setText("");
      Keyboard.dismiss();
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDisabled = !text.trim() || isSubmitting;

  return (
    <View style={styles.form}>
      <TextInput
        style={styles.input}
        placeholder="Що потрібно зробити?"
        placeholderTextColor={colors.textMuted}
        value={text}
        onChangeText={setText}
        editable={!isSubmitting}
        maxLength={120}
        returnKeyType="done"
        onSubmitEditing={handleSubmit}
      />
      <TouchableOpacity
        style={[styles.addButton, isDisabled && styles.addButtonDisabled]}
        onPress={handleSubmit}
        disabled={isDisabled}
      >
        <Text style={styles.addButtonText}>
          {isSubmitting ? "Додаємо..." : "Додати"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    form: {
      flexDirection: "row",
      paddingHorizontal: 20,
      paddingVertical: 12,
      gap: 10,
    },
    input: {
      flex: 1,
      borderRadius: 10,
      paddingHorizontal: 14,
      paddingVertical: 10,
      fontSize: 15,
      backgroundColor: colors.surface,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
    },
    addButton: {
      borderRadius: 10,
      paddingHorizontal: 18,
      justifyContent: "center",
      backgroundColor: colors.primary,
    },
    addButtonDisabled: {
      opacity: 0.5,
    },
    addButtonText: {
      color: "#fff",
      fontWeight: "700",
      fontSize: 14,
    },
  });
