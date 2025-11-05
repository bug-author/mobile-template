import * as ImagePicker from "expo-image-picker";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";

export const imagePickerService = {
  /**
   * Request camera permissions
   */
  requestCameraPermissions: async (): Promise<boolean> => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    return status === "granted";
  },

  /**
   * Request media library permissions
   */
  requestMediaLibraryPermissions: async (): Promise<boolean> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return status === "granted";
  },

  /**
   * Pick image from camera
   */
  takePhoto: async (): Promise<ImagePicker.ImagePickerAsset | null> => {
    const hasPermission = await imagePickerService.requestCameraPermissions();
    if (!hasPermission) {
      return null;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      return result.assets[0];
    }

    return null;
  },

  /**
   * Pick image from gallery
   */
  pickImage: async (): Promise<ImagePicker.ImagePickerAsset | null> => {
    const hasPermission = await imagePickerService.requestMediaLibraryPermissions();
    if (!hasPermission) {
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      return result.assets[0];
    }

    return null;
  },

  /**
   * Pick multiple images from gallery
   */
  pickMultipleImages: async (): Promise<ImagePicker.ImagePickerAsset[]> => {
    const hasPermission = await imagePickerService.requestMediaLibraryPermissions();
    if (!hasPermission) {
      return [];
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      return result.assets;
    }

    return [];
  },
};

export const sharingService = {
  /**
   * Check if sharing is available
   */
  isAvailable: async (): Promise<boolean> => {
    return await Sharing.isAvailableAsync();
  },

  /**
   * Share a file
   */
  shareFile: async (uri: string, mimeType?: string): Promise<void> => {
    const isAvailable = await sharingService.isAvailable();
    if (!isAvailable) {
      console.warn("Sharing is not available on this device");
      return;
    }

    await Sharing.shareAsync(uri, {
      mimeType,
      dialogTitle: "Share",
      UTI: mimeType,
    });
  },

  /**
   * Share text using native share
   */
  shareText: async (text: string, title?: string): Promise<void> => {
    if (Platform.OS === "web") {
      // Web Share API
      if (navigator.share) {
        await navigator.share({
          title: title || "Share",
          text,
        });
      }
      return;
    }

    // For mobile, you'd typically use react-native Share API
    // But we're using expo-sharing for consistency
  },
};
