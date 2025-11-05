import { useState, useEffect } from "react";
import { View, Text, Pressable, Switch, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../hooks/useAuth";
import { ThemeToggle } from "../../components/ThemeToggle";
import { LanguageSwitcher } from "../../components/LanguageSwitcher";
import { biometricAuth } from "../../lib/biometric-auth";
import { toast } from "../../lib/toast";
import { useAuthStore } from "../../stores/auth.store";

export default function ProfileScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user, logout, isLoggingOut } = useAuth();
  const { biometricEnabled, setBiometricEnabled } = useAuthStore();
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState("");

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    const available = await biometricAuth.isAvailable();
    setBiometricAvailable(available);

    if (available) {
      const type = await biometricAuth.getBiometricTypeName();
      setBiometricType(type);
    }
  };

  const handleBiometricToggle = async (value: boolean) => {
    if (value) {
      const result = await biometricAuth.authenticate({
        promptMessage: `Enable ${biometricType}`,
      });

      if (result.success) {
        await setBiometricEnabled(true);
        toast.success(`${biometricType} enabled successfully`);
      } else {
        toast.error(result.error || "Authentication failed");
      }
    } else {
      await setBiometricEnabled(false);
      toast.success(`${biometricType} disabled`);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed");
    }
  };

  return (
    <ScrollView className="flex-1 bg-white dark:bg-gray-900">
      <View className="p-6">
        <Text className="text-2xl font-bold mb-6 dark:text-white">
          {t("profile.title")}
        </Text>

        {/* User Info */}
        <View className="mb-6">
          <View className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-2">
            <Text className="text-gray-600 dark:text-gray-400 mb-1">
              {t("profile.name")}
            </Text>
            <Text className="text-lg font-semibold dark:text-white">{user?.name}</Text>
          </View>

          <View className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <Text className="text-gray-600 dark:text-gray-400 mb-1">
              {t("profile.email")}
            </Text>
            <Text className="text-lg font-semibold dark:text-white">{user?.email}</Text>
          </View>
        </View>

        {/* Theme Settings */}
        <View className="mb-6">
          <Text className="text-lg font-semibold mb-3 dark:text-white">Theme</Text>
          <ThemeToggle />
        </View>

        {/* Language Settings */}
        <View className="mb-6">
          <Text className="text-lg font-semibold mb-3 dark:text-white">Language</Text>
          <LanguageSwitcher />
        </View>

        {/* Biometric Auth */}
        {biometricAvailable && (
          <View className="mb-6">
            <View className="flex-row items-center justify-between bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
              <View className="flex-1">
                <Text className="text-lg font-semibold dark:text-white">
                  {biometricType}
                </Text>
                <Text className="text-gray-600 dark:text-gray-400 text-sm">
                  Use {biometricType} to unlock the app
                </Text>
              </View>
              <Switch
                value={biometricEnabled}
                onValueChange={handleBiometricToggle}
                trackColor={{ false: "#767577", true: "#3b82f6" }}
                thumbColor={biometricEnabled ? "#2563eb" : "#f4f3f4"}
              />
            </View>
          </View>
        )}

        {/* Logout Button */}
        <Pressable
          className="bg-red-500 py-4 rounded-lg active:bg-red-600 dark:bg-red-600 dark:active:bg-red-700"
          onPress={handleLogout}
          disabled={isLoggingOut}
        >
          <Text className="text-white text-center font-semibold">
            {isLoggingOut ? "Signing out..." : t("auth.signOut")}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
