import { View, Animated, Easing } from "react-native";
import { useEffect, useRef } from "react";

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  className?: string;
}

export function SkeletonLoader({
  width = "100%",
  height = 20,
  borderRadius = 4,
  className = "",
}: SkeletonLoaderProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 750,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 750,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [opacity]);

  return (
    <Animated.View
      className={`bg-gray-200 dark:bg-gray-700 ${className}`}
      style={{
        width,
        height,
        borderRadius,
        opacity,
      }}
    />
  );
}

export function SkeletonCard() {
  return (
    <View className="p-4 bg-white dark:bg-gray-800 rounded-lg mb-3">
      <View className="flex-row items-center mb-3">
        <SkeletonLoader width={50} height={50} borderRadius={25} className="mr-3" />
        <View className="flex-1">
          <SkeletonLoader width="60%" height={16} className="mb-2" />
          <SkeletonLoader width="40%" height={12} />
        </View>
      </View>
      <SkeletonLoader width="100%" height={12} className="mb-2" />
      <SkeletonLoader width="80%" height={12} />
    </View>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <View>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </View>
  );
}
