import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ThemeColors } from "@/types";

const THEME_STORAGE_KEY = "@todo_theme_mode";

export const lightColors: ThemeColors = {
  bg: "#eef0ff",
  surface: "#ffffff",
  text: "#1f2937",
  textMuted: "#6b7280",
  border: "#e5e7eb",
  primary: "#6366f1",
  success: "#16a34a",
  danger: "#dc2626",
  statusBarStyle: "dark",
};

export const darkColors: ThemeColors = {
  bg: "#0f1117",
  surface: "#1a1d29",
  text: "#f3f4f6",
  textMuted: "#9ca3af",
  border: "#2d3040",
  primary: "#818cf8",
  success: "#4ade80",
  danger: "#f87171",
  statusBarStyle: "light",
};

interface ThemeContextType {
  isDarkMode: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
  isReady: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (saved === "dark") {
          setIsDarkMode(true);
        }
      } catch (err) {
        console.warn("Не вдалося завантажити тему:", err);
      } finally {
        setIsReady(true);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDarkMode((prev) => {
      const next = !prev;
      AsyncStorage.setItem(THEME_STORAGE_KEY, next ? "dark" : "light").catch(
        (err) => console.warn("Не вдалося зберегти тему:", err),
      );
      return next;
    });
  }, []);

  const colors = useMemo(
    () => (isDarkMode ? darkColors : lightColors),
    [isDarkMode],
  );

  const value = useMemo(
    () => ({ isDarkMode, colors, toggleTheme, isReady }),
    [isDarkMode, colors, toggleTheme, isReady],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme має використовуватись всередині ThemeProvider");
  }
  return ctx;
}
