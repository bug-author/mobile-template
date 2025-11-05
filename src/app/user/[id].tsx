import { View, Text, ScrollView, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useScreenProtection } from "../../hooks/useScreenProtection";

// Example: Deep link opens this screen
// URL: mobileapp://user/123
// Universal link: https://yourapp.com/user/123
// QR code can contain: https://yourapp.com/user/123

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Protect this screen from screenshots (optional)
  useScreenProtection(false); // Set to true to enable

  return (
    <ScrollView className="flex-1 bg-white dark:bg-gray-900">
      <View className="p-6">
        <View className="items-center mb-8">
          <View className="w-24 h-24 bg-blue-500 rounded-full items-center justify-center mb-4">
            <Text className="text-white text-3xl font-bold">
              {id?.toString().charAt(0).toUpperCase()}
            </Text>
          </View>

          <Text className="text-2xl font-bold dark:text-white mb-2">User #{id}</Text>
          <Text className="text-gray-600 dark:text-gray-400">Opened via deep link</Text>
        </View>

        <View className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-4">
          <Text className="text-sm text-gray-600 dark:text-gray-400 mb-2">Deep Link Examples:</Text>
          <Text className="font-mono text-xs text-gray-800 dark:text-gray-200 mb-1">
            mobileapp://user/{id}
          </Text>
          <Text className="font-mono text-xs text-gray-800 dark:text-gray-200">
            https://yourapp.com/user/{id}
          </Text>
        </View>

        <View className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
          <Text className="text-blue-800 dark:text-blue-200 font-semibold mb-2">
            💡 QR Code Integration
          </Text>
          <Text className="text-blue-700 dark:text-blue-300 text-sm">
            You can generate QR codes containing the universal link (https://yourapp.com/user/{id}).
            When scanned, the app opens directly to this profile!
          </Text>
        </View>

        <Pressable
          className="bg-blue-500 py-4 rounded-lg active:bg-blue-600 mb-3"
          onPress={() => router.push("/")}
        >
          <Text className="text-white text-center font-semibold">Go Home</Text>
        </Pressable>

        <Pressable
          className="bg-gray-200 dark:bg-gray-700 py-4 rounded-lg active:bg-gray-300 dark:active:bg-gray-600"
          onPress={() => router.back()}
        >
          <Text className="text-gray-800 dark:text-gray-200 text-center font-semibold">
            Go Back
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
