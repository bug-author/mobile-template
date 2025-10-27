import "dotenv/config";
import { ExpoConfig, ConfigContext } from "expo/config";

const IS_DEV = process.env.APP_VARIANT === "development";
const IS_STAGING = process.env.APP_VARIANT === "staging";

const getAppName = () => {
  if (IS_DEV) return "MobileApp (Dev)";
  if (IS_STAGING) return "MobileApp (Staging)";
  return "MobileApp";
};

const getBundleId = () => {
  if (IS_DEV) return "com.yourcompany.mobileapp.dev";
  if (IS_STAGING) return "com.yourcompany.mobileapp.staging";
  return "com.yourcompany.mobileapp";
};

const getIconPath = () => {
  if (IS_DEV) return "./assets/icon-dev.png";
  if (IS_STAGING) return "./assets/icon-staging.png";
  return "./assets/icon.png";
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: getAppName(),
  slug: "mobile-template",
  version: "1.0.0",
  orientation: "portrait",
  icon: getIconPath(),
  userInterfaceStyle: "light",
  newArchEnabled: true,
  splash: {
    image: "./assets/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: getBundleId(),
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    package: getBundleId(),
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
  },
  web: {
    favicon: "./assets/favicon.png",
  },
  plugins: [
    "expo-router",
    [
      "onesignal-expo-plugin",
      {
        mode: IS_DEV ? "development" : "production",
      },
    ],
    [
      "react-native-purchases",
      {
        apiKey: process.env.REVENUECAT_API_KEY,
      },
    ],
  ],
  extra: {
    apiUrl: process.env.API_URL,
    posthogApiKey: process.env.POSTHOG_API_KEY,
    revenuecatApiKey: process.env.REVENUECAT_API_KEY,
    onesignalAppId: process.env.ONESIGNAL_APP_ID,
    appVariant: process.env.APP_VARIANT,
    eas: {
      projectId: "your-eas-project-id",
    },
  },
});
