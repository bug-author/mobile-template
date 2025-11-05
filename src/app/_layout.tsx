import "../global.css";
import "../lib/i18n";
import { useEffect } from "react";
import { Stack } from "expo-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { PostHogProvider } from "posthog-react-native";
import { useColorScheme } from "react-native";
import Toast from "react-native-toast-message";
import { queryClient } from "../lib/query-client";
import { posthog } from "../lib/posthog";
import { initializeRevenueCat } from "../lib/revenuecat";
import { initializeOneSignal } from "../lib/onesignal";
import { initializeSentry } from "../lib/sentry";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { OfflineBanner } from "../components/OfflineBanner";
import { useTheme } from "../stores/theme.store";

function AppContent() {
  const { actualTheme } = useTheme();
  const systemColorScheme = useColorScheme();

  useEffect(() => {
    // Initialize third-party services
    initializeSentry();
    initializeRevenueCat();
    initializeOneSignal();
  }, []);

  return (
    <>
      <OfflineBanner />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: actualTheme === "dark" ? "#1f2937" : "#ffffff",
          },
          headerTintColor: actualTheme === "dark" ? "#ffffff" : "#000000",
        }}
      >
        <Stack.Screen name="index" options={{ title: "Home" }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
      <Toast />
    </>
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
