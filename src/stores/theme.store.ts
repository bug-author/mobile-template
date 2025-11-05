import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "react-native";

type Theme = "light" | "dark" | "system";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  actualTheme: "light" | "dark";
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "system",
      actualTheme: "light",
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export const useTheme = () => {
  const systemColorScheme = useColorScheme();
  const { theme, setTheme } = useThemeStore();

  const actualTheme = theme === "system" ? systemColorScheme || "light" : theme;

  return {
    theme,
    actualTheme,
    setTheme,
    isDark: actualTheme === "dark",
  };
};
