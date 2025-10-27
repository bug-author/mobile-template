import PostHog from "posthog-react-native";
import { config } from "./config";

export const posthog = new PostHog(config.posthogApiKey, {
  host: "https://app.posthog.com",
  captureApplicationLifecycleEvents: true,
  captureDeepLinks: true,
});
