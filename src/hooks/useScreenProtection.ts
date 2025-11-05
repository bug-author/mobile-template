import { useEffect } from "react";
import * as ScreenCapture from "expo-screen-capture";
import { Platform } from "react-native";

/**
 * Hook to prevent screenshots and screen recording on sensitive screens
 * iOS: Prevents screenshots and screen recording
 * Android: Prevents screenshots (screen recording harder to block)
 */
export const useScreenProtection = (enabled: boolean = true) => {
  useEffect(() => {
    if (!enabled || Platform.OS === "web") {
      return;
    }

    const preventScreenCapture = async () => {
      try {
        await ScreenCapture.preventScreenCaptureAsync();
      } catch (error) {
        console.error("Failed to prevent screen capture:", error);
      }
    };

    const allowScreenCapture = async () => {
      try {
        await ScreenCapture.allowScreenCaptureAsync();
      } catch (error) {
        console.error("Failed to allow screen capture:", error);
      }
    };

    preventScreenCapture();

    // Re-enable when component unmounts
    return () => {
      allowScreenCapture();
    };
  }, [enabled]);
};
