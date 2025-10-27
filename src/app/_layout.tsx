import "../global.css";
import { useEffect } from "react";
import { Stack } from "expo-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { PostHogProvider } from "posthog-react-native";
import { queryClient } from "../lib/query-client";
import { posthog } from "../lib/posthog";
import { initializeRevenueCat } from "../lib/revenuecat";
import { initializeOneSignal } from "../lib/onesignal";

export default function RootLayout() {
  useEffect(() => {
    initializeRevenueCat();
    initializeOneSignal();
  }, []);

  return (
    <PostHogProvider client={posthog}>
      <QueryClientProvider client={queryClient}>
        <Stack>
          <Stack.Screen name="index" options={{ title: "Home" }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack>
      </QueryClientProvider>
    </PostHogProvider>
  );
}
