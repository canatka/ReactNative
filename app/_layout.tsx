import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";

const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL;

const convex = convexUrl
  ? new ConvexReactClient(convexUrl, {
      unsavedChangesWarning: false,
    })
  : null;

function RootNavigator() {
  const { isDarkMode } = useTheme();

  return (
    <>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}

function MissingConvexUrl() {
  return (
    <View style={styles.missingContainer}>
      <Text style={styles.missingTitle}>⚠️ Convex не налаштовано</Text>
      <Text style={styles.missingText}>
        Змінна EXPO_PUBLIC_CONVEX_URL не знайдена.
      </Text>
      <Text style={styles.missingText}>
        1. Запустіть: npx convex dev{"\n"}
        2. Додайте URL у файл .env:{"\n"}
        EXPO_PUBLIC_CONVEX_URL=https://....convex.cloud{"\n"}
        3. Перезапустіть: npx expo start -c
      </Text>
    </View>
  );
}

export default function RootLayout() {
  if (!convex) {
    return <MissingConvexUrl />;
  }

  return (
    <SafeAreaProvider>
      <ConvexProvider client={convex}>
        <ThemeProvider>
          <RootNavigator />
        </ThemeProvider>
      </ConvexProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  missingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff7ed",
  },
  missingTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#9a3412",
    marginBottom: 12,
  },
  missingText: {
    fontSize: 14,
    color: "#7c2d12",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 10,
  },
});
