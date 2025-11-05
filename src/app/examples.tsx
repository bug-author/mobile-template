import { useState } from "react";
import { View, Text, Pressable, Image, ScrollView } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { imagePickerService, sharingService } from "../lib/media";
import { SkeletonList } from "../components/SkeletonLoader";
import { toast } from "../lib/toast";

// Example data for FlashList
const generateData = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: `item-${i}`,
    title: `Item ${i + 1}`,
    description: `This is description for item ${i + 1}`,
  }));

export default function ExamplesScreen() {
  const [data, setData] = useState(generateData(20));
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleTakePhoto = async () => {
    const photo = await imagePickerService.takePhoto();
    if (photo) {
      setSelectedImage(photo.uri);
      toast.success("Photo captured!");
    }
  };

  const handlePickImage = async () => {
    const image = await imagePickerService.pickImage();
    if (image) {
      setSelectedImage(image.uri);
      toast.success("Image selected!");
    }
  };

  const handleShareImage = async () => {
    if (!selectedImage) return;

    try {
      await sharingService.shareFile(selectedImage, "image/jpeg");
    } catch (_error) {
      toast.error("Failed to share image");
    }
  };

  const simulateLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <ScrollView className="flex-1 bg-white dark:bg-gray-900">
      <View className="p-6">
        <Text className="text-3xl font-bold mb-6 dark:text-white">UI Examples</Text>

        {/* Image Picker & Share */}
        <View className="mb-8">
          <Text className="text-xl font-semibold mb-3 dark:text-white">Image Picker & Share</Text>

          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              className="w-full h-48 rounded-lg mb-3"
              resizeMode="cover"
            />
          )}

          <View className="flex-row gap-2 mb-2">
            <Pressable
              className="flex-1 bg-blue-500 py-3 rounded-lg active:bg-blue-600"
              onPress={handleTakePhoto}
            >
              <Text className="text-white text-center font-semibold">📸 Camera</Text>
            </Pressable>

            <Pressable
              className="flex-1 bg-green-500 py-3 rounded-lg active:bg-green-600"
              onPress={handlePickImage}
            >
              <Text className="text-white text-center font-semibold">🖼️ Gallery</Text>
            </Pressable>
          </View>

          {selectedImage && (
            <Pressable
              className="bg-purple-500 py-3 rounded-lg active:bg-purple-600"
              onPress={handleShareImage}
            >
              <Text className="text-white text-center font-semibold">Share Image</Text>
            </Pressable>
          )}
        </View>

        {/* Skeleton Loaders */}
        <View className="mb-8">
          <Text className="text-xl font-semibold mb-3 dark:text-white">Skeleton Loaders</Text>

          <Pressable
            className="bg-gray-500 py-3 rounded-lg active:bg-gray-600 mb-3"
            onPress={simulateLoading}
          >
            <Text className="text-white text-center font-semibold">Toggle Loading</Text>
          </Pressable>

          {loading ? (
            <SkeletonList count={3} />
          ) : (
            <Text className="dark:text-white">Content loaded!</Text>
          )}
        </View>

        {/* FlashList Example */}
        <View className="mb-8">
          <Text className="text-xl font-semibold mb-3 dark:text-white">
            FlashList (High Performance)
          </Text>

          <View className="h-96 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
            <FlashList
              data={data}
              estimatedItemSize={80}
              renderItem={({ item }) => (
                <View className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <Text className="font-semibold dark:text-white">{item.title}</Text>
                  <Text className="text-gray-600 dark:text-gray-400 text-sm">
                    {item.description}
                  </Text>
                </View>
              )}
              keyExtractor={(item) => item.id}
            />
          </View>
        </View>

        {/* Pull to Refresh */}
        <View className="mb-8">
          <Text className="text-xl font-semibold mb-3 dark:text-white">Pull to Refresh</Text>

          <Text className="text-gray-600 dark:text-gray-400 mb-3">
            Scroll down in the main area to see pull-to-refresh in action!
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
