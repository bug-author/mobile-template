import "../global.css";
import "../lib/i18n";
import { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { PostHogProvider } from "posthog-react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { queryClient } from "../lib/query-client";
import { posthog } from "../lib/posthog";
import { initializeRevenueCat } from "../lib/revenuecat";
import { initializeOneSignal } from "../lib/onesignal";
import { initializeSentry } from "../lib/sentry";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { OfflineBanner } from "../components/OfflineBanner";
import { UpdatePrompt } from "../components/UpdatePrompt";
import { useTheme } from "../stores/theme.store";
import { useOnboardingStore } from "../stores/onboarding.store";
import { useAuthStore } from "../stores/auth.store";

function NavigationHandler() {
  const segments = useSegments();
  const router = useRouter();
  const { hasCompletedOnboarding } = useOnboardingStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";
    const onOnboarding = segments[0] === "onboarding";

    // Redirect to onboarding if first time
    if (!hasCompletedOnboarding && !onOnboarding) {
      router.replace("/onboarding");
      return;
    }

    // Redirect to auth if not authenticated and not in auth group
    if (!isAuthenticated && !inAuthGroup && !onOnboarding) {
      router.replace("/(auth)/login");
    }
  }, [hasCompletedOnboarding, isAuthenticated, segments]);

  return null;
}

function AppContent() {
  const { actualTheme } = useTheme();

  useEffect(() => {
    // Initialize third-party services
    initializeSentry();
    initializeRevenueCat();
    initializeOneSignal();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationHandler />
      <OfflineBanner />
      <UpdatePrompt />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: actualTheme === "dark" ? "#1f2937" : "#ffffff",
          },
          headerTintColor: actualTheme === "dark" ? "#ffffff" : "#000000",
        }}
      >
        <Stack.Screen name="index" options={{ title: "Home" }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="user/[id]" options={{ title: "User Profile" }} />
      </Stack>
      <Toast />
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <PostHogProvider client={posthog}>
        <QueryClientProvider client={queryClient}>
          <AppContent />
        </QueryClientProvider>
      </PostHogProvider>
    </ErrorBoundary>
  );
}
