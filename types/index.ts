import type { Doc } from "@/convex/_generated/dataModel";

export type Todo = Doc<"todos">;

export interface ThemeColors {
  bg: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string;
  primary: string;
  success: string;
  danger: string;
  statusBarStyle: "light" | "dark";
}
