import * as LocalAuthentication from "expo-local-authentication";
import { Platform } from "react-native";

export const biometricAuth = {
  /**
   * Check if biometric hardware is available
   */
  isAvailable: async (): Promise<boolean> => {
    if (Platform.OS === "web") {
      return false;
    }

    const compatible = await LocalAuthentication.hasHardwareAsync();
    if (!compatible) {
      return false;
    }

    const enrolled = await LocalAuthentication.isEnrolledAsync();
    return enrolled;
  },

  /**
   * Get supported authentication types
   */
  getSupportedTypes: async (): Promise<LocalAuthentication.AuthenticationType[]> => {
    if (Platform.OS === "web") {
      return [];
    }
    return await LocalAuthentication.supportedAuthenticationTypesAsync();
  },

  /**
   * Get biometric type name for display
   */
  getBiometricTypeName: async (): Promise<string> => {
    const types = await biometricAuth.getSupportedTypes();

    if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      return Platform.OS === "ios" ? "Face ID" : "Face Recognition";
    }

    if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      return Platform.OS === "ios" ? "Touch ID" : "Fingerprint";
    }

    if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
      return "Iris Recognition";
    }

    return "Biometric";
  },

  /**
   * Authenticate user with biometrics
   */
  authenticate: async (options?: {
    promptMessage?: string;
    cancelLabel?: string;
    disableDeviceFallback?: boolean;
  }): Promise<{ success: boolean; error?: string }> => {
    if (Platform.OS === "web") {
      return { success: false, error: "Biometrics not supported on web" };
    }

    const biometricTypeName = await biometricAuth.getBiometricTypeName();

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: options?.promptMessage || `Authenticate with ${biometricTypeName}`,
        cancelLabel: options?.cancelLabel || "Cancel",
        disableDeviceFallback: options?.disableDeviceFallback || false,
        fallbackLabel: "Use Passcode",
      });

      if (result.success) {
        return { success: true };
      } else {
        return {
          success: false,
          error: result.error || "Authentication failed",
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Authentication error",
      };
    }
  },
};
