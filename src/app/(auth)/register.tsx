import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../hooks/useAuth";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isRegistering } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await register(data);
      router.replace("/");
    } catch (error) {
      Alert.alert("Error", "Registration failed");
    }
  };

  return (
    <View className="flex-1 bg-white p-6">
      <Text className="text-2xl font-bold mb-8">Sign Up</Text>

      <View className="mb-4">
        <Text className="text-gray-700 mb-2">Name</Text>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3"
              placeholder="Enter your name"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.name && (
          <Text className="text-red-500 mt-1">{errors.name.message}</Text>
        )}
      </View>

      <View className="mb-4">
        <Text className="text-gray-700 mb-2">Email</Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3"
              placeholder="Enter your email"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          )}
        />
        {errors.email && (
          <Text className="text-red-500 mt-1">{errors.email.message}</Text>
        )}
      </View>

      <View className="mb-6">
        <Text className="text-gray-700 mb-2">Password</Text>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3"
              placeholder="Enter your password"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry
            />
          )}
        />
        {errors.password && (
          <Text className="text-red-500 mt-1">{errors.password.message}</Text>
        )}
      </View>

      <Pressable
        className="bg-blue-500 py-4 rounded-lg mb-4 active:bg-blue-600"
        onPress={handleSubmit(onSubmit)}
        disabled={isRegistering}
      >
        <Text className="text-white text-center font-semibold">
          {isRegistering ? "Creating account..." : "Sign Up"}
        </Text>
      </Pressable>

      <Pressable onPress={() => router.back()}>
        <Text className="text-blue-500 text-center">
          Already have an account? Sign In
        </Text>
      </Pressable>
    </View>
  );
}
