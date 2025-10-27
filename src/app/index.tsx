import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../hooks/useAuth";

export default function HomeScreen() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  return (
    <View className="flex-1 items-center justify-center bg-white p-4">
      <Text className="text-3xl font-bold mb-4">Mobile App Template</Text>

      {isAuthenticated ? (
        <View className="items-center">
          <Text className="text-lg mb-4">Welcome, {user?.name}!</Text>
          <Pressable
            className="bg-red-500 px-6 py-3 rounded-lg active:bg-red-600"
            onPress={() => router.push("/(auth)/profile")}
          >
            <Text className="text-white font-semibold">Go to Profile</Text>
          </Pressable>
        </View>
      ) : (
        <View className="items-center">
          <Text className="text-gray-600 mb-6">Please sign in to continue</Text>
          <Pressable
            className="bg-blue-500 px-6 py-3 rounded-lg active:bg-blue-600"
            onPress={() => router.push("/(auth)/login")}
          >
            <Text className="text-white font-semibold">Sign In</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
