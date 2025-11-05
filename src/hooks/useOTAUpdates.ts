import { useState } from "react";
import * as Updates from "expo-updates";
import { Platform } from "react-native";

export const useOTAUpdates = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkForUpdates = async () => {
    if (Platform.OS === "web" || __DEV__) {
      return;
    }

    try {
      setIsChecking(true);
      setError(null);

      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        setUpdateAvailable(true);
        return true;
      }

      return false;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to check for updates");
      return false;
    } finally {
      setIsChecking(false);
    }
  };

  const downloadUpdate = async () => {
    if (Platform.OS === "web" || __DEV__) {
      return;
    }

    try {
      setIsDownloading(true);
      setError(null);

      await Updates.fetchUpdateAsync();
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to download update");
      return false;
    } finally {
      setIsDownloading(false);
    }
  };

  const applyUpdate = async () => {
    if (Platform.OS === "web" || __DEV__) {
      return;
    }

    try {
      await Updates.reloadAsync();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to apply update");
    }
  };

  return {
    isChecking,
    isDownloading,
    updateAvailable,
    error,
    checkForUpdates,
    downloadUpdate,
    applyUpdate,
    currentVersion: Updates.updateId || "development",
  };
};
