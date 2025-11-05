import { useState } from "react";
import { View, Text, Pressable, Image } from "react-native";
import { useRouter } from "expo-router";
import { useOnboardingStore } from "../../stores/onboarding.store";

const onboardingSteps = [
  {
    id: 1,
    title: "Welcome to MobileApp",
    description: "Your all-in-one solution for managing your tasks and staying organized.",
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    image: require("../../../assets/icon.png"),
  },
  {
    id: 2,
    title: "Stay Secure",
    description: "Your data is protected with biometric authentication and secure storage.",
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    image: require("../../../assets/icon.png"),
  },
  {
    id: 3,
    title: "Work Offline",
    description: "Access your data anytime, even without an internet connection.",
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    image: require("../../../assets/icon.png"),
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { completeOnboarding } = useOnboardingStore();
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    completeOnboarding();
    router.replace("/");
  };

  const step = onboardingSteps[currentStep];

  return (
    <View className="flex-1 bg-white dark:bg-gray-900 justify-between p-6">
      {/* Skip Button */}
      <View className="items-end">
        <Pressable onPress={handleSkip}>
          <Text className="text-blue-500 text-lg">Skip</Text>
        </Pressable>
      </View>

      {/* Content */}
      <View className="flex-1 items-center justify-center">
        <Image
          source={step.image}
          style={{ width: 200, height: 200, marginBottom: 40 }}
          resizeMode="contain"
        />

        <Text className="text-3xl font-bold text-center mb-4 dark:text-white">{step.title}</Text>

        <Text className="text-gray-600 dark:text-gray-400 text-center text-lg px-8">
          {step.description}
        </Text>
      </View>

      {/* Pagination Dots */}
      <View className="flex-row justify-center mb-8">
        {onboardingSteps.map((_, index) => (
          <View
            key={index}
            className={`h-2 w-2 rounded-full mx-1 ${
              index === currentStep ? "bg-blue-500 w-8" : "bg-gray-300 dark:bg-gray-700"
            }`}
          />
        ))}
      </View>

      {/* Next Button */}
      <Pressable className="bg-blue-500 py-4 rounded-lg active:bg-blue-600" onPress={handleNext}>
        <Text className="text-white text-center font-semibold text-lg">
          {currentStep === onboardingSteps.length - 1 ? "Get Started" : "Next"}
        </Text>
      </Pressable>
    </View>
  );
}
