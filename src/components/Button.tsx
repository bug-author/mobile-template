import { Pressable, Text, ActivityIndicator } from "react-native";
import { cn } from "../lib/utils";

interface ButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export function Button({
  onPress,
  children,
  variant = "primary",
  disabled = false,
  loading = false,
  className,
}: ButtonProps) {
  const baseStyles = "px-6 py-3 rounded-lg items-center justify-center";
  const variantStyles = {
    primary: "bg-blue-500 active:bg-blue-600",
    secondary: "bg-gray-500 active:bg-gray-600",
    danger: "bg-red-500 active:bg-red-600",
  };
  const disabledStyles = "opacity-50";

  return (
    <Pressable
      className={cn(
        baseStyles,
        variantStyles[variant],
        (disabled || loading) && disabledStyles,
        className
      )}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text className="text-white font-semibold">{children}</Text>
      )}
    </Pressable>
  );
}
