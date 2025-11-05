import { View, Text, Pressable } from "react-native";
import { useTheme } from "../stores/theme.store";

export function ThemeToggle() {
  const { theme, actualTheme, setTheme } = useTheme();

  const themes: Array<"light" | "dark" | "system"> = ["light", "dark", "system"];

  return (
    <View className="flex-row gap-2 p-2 bg-gray-100 rounded-lg dark:bg-gray-800">
      {themes.map((t) => (
        <Pressable
          key={t}
          className={`px-4 py-2 rounded-md ${
            theme === t
              ? "bg-blue-500 dark:bg-blue-600"
              : "bg-white dark:bg-gray-700"
          }`}
          onPress={() => setTheme(t)}
        >
          <Text
            className={`capitalize ${
              theme === t
                ? "text-white font-semibold"
                : "text-gray-700 dark:text-gray-300"
            }`}
          >
            {t}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
