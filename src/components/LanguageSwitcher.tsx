import { View, Text, Pressable } from "react-native";
import { useTranslation } from "react-i18next";
import { changeLanguage } from "../lib/i18n";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const languages = [
    { code: "en", label: "English" },
    { code: "es", label: "Español" },
  ];

  return (
    <View className="flex-row gap-2 p-2 bg-gray-100 rounded-lg dark:bg-gray-800">
      {languages.map((lang) => (
        <Pressable
          key={lang.code}
          className={`px-4 py-2 rounded-md ${
            i18n.language === lang.code
              ? "bg-blue-500 dark:bg-blue-600"
              : "bg-white dark:bg-gray-700"
          }`}
          onPress={() => changeLanguage(lang.code)}
        >
          <Text
            className={`${
              i18n.language === lang.code
                ? "text-white font-semibold"
                : "text-gray-700 dark:text-gray-300"
            }`}
          >
            {lang.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
