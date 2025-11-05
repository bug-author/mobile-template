import { View, Text } from "react-native";
import { useNetworkStatus } from "../hooks/useNetworkStatus";
import { useTranslation } from "react-i18next";

export function OfflineBanner() {
  const { isOffline } = useNetworkStatus();
  const { t } = useTranslation();

  if (!isOffline) {
    return null;
  }

  return (
    <View className="bg-red-500 px-4 py-2">
      <Text className="text-white text-center font-semibold">{t("network.offline")}</Text>
    </View>
  );
}
