import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../hooks/useAuth";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, isLoggingOut } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <View className="flex-1 bg-white p-6">
      <View className="mb-8">
        <Text className="text-2xl font-bold mb-4">Profile</Text>

        <View className="bg-gray-100 p-4 rounded-lg mb-2">
          <Text className="text-gray-600 mb-1">Name</Text>
          <Text className="text-lg font-semibold">{user?.name}</Text>
        </View>

        <View className="bg-gray-100 p-4 rounded-lg">
          <Text className="text-gray-600 mb-1">Email</Text>
          <Text className="text-lg font-semibold">{user?.email}</Text>
        </View>
      </View>

      <Pressable
        className="bg-red-500 py-4 rounded-lg active:bg-red-600"
        onPress={handleLogout}
        disabled={isLoggingOut}
      >
        <Text className="text-white text-center font-semibold">
          {isLoggingOut ? "Signing out..." : "Sign Out"}
        </Text>
      </Pressable>
    </View>
  );
}
