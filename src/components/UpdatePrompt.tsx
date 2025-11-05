import { View, Text, Pressable, Modal } from "react-native";
import { useState, useEffect } from "react";
import { useOTAUpdates } from "../hooks/useOTAUpdates";

export function UpdatePrompt() {
  const [showModal, setShowModal] = useState(false);
  const { updateAvailable, isDownloading, checkForUpdates, downloadUpdate, applyUpdate } =
    useOTAUpdates();

  useEffect(() => {
    // Check for updates on app start
    checkForUpdates();
  }, []);

  useEffect(() => {
    if (updateAvailable) {
      setShowModal(true);
    }
  }, [updateAvailable]);

  const handleUpdate = async () => {
    const success = await downloadUpdate();
    if (success) {
      await applyUpdate();
    }
  };

  if (!showModal || !updateAvailable) {
    return null;
  }

  return (
    <Modal visible={showModal} transparent animationType="fade">
      <View className="flex-1 bg-black/50 items-center justify-center p-6">
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm">
          <Text className="text-2xl font-bold mb-2 dark:text-white">Update Available</Text>

          <Text className="text-gray-600 dark:text-gray-400 mb-6">
            A new version of the app is available. Update now to get the latest features and
            improvements.
          </Text>

          <View className="gap-3">
            <Pressable
              className="bg-blue-500 py-4 rounded-lg active:bg-blue-600"
              onPress={handleUpdate}
              disabled={isDownloading}
            >
              <Text className="text-white text-center font-semibold">
                {isDownloading ? "Downloading..." : "Update Now"}
              </Text>
            </Pressable>

            <Pressable
              className="py-4 rounded-lg"
              onPress={() => setShowModal(false)}
              disabled={isDownloading}
            >
              <Text className="text-gray-600 dark:text-gray-400 text-center font-semibold">
                Later
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
