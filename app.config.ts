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

const getDeepLinkingScheme = () => {
  if (IS_DEV) return "mobileappdev";
  if (IS_STAGING) return "mobileappstaging";
  return "mobileapp";
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: getAppName(),
  slug: "mobile-template",
  version: "1.0.0",
  orientation: "portrait",
  icon: getIconPath(),
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  scheme: getDeepLinkingScheme(),
  splash: {
    image: "./assets/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: getBundleId(),
    associatedDomains: [`applinks:${IS_DEV ? "dev." : IS_STAGING ? "staging." : ""}yourapp.com`],
    infoPlist: {
      NSFaceIDUsageDescription:
        "We use Face ID to securely authenticate you and protect your account.",
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    package: getBundleId(),
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    intentFilters: [
      {
        action: "VIEW",
        autoVerify: true,
        data: [
          {
            scheme: "https",
            host: `${IS_DEV ? "dev." : IS_STAGING ? "staging." : ""}yourapp.com`,
            pathPrefix: "/",
          },
        ],
        category: ["BROWSABLE", "DEFAULT"],
      },
    ],
    permissions: [
      "USE_BIOMETRIC",
      "USE_FINGERPRINT",
      "READ_EXTERNAL_STORAGE",
      "WRITE_EXTERNAL_STORAGE",
      "CAMERA",
    ],
  },
  web: {
    favicon: "./assets/favicon.png",
  },
  plugins: [
    "expo-router",
    "expo-secure-store",
    "expo-local-authentication",
    "expo-screen-capture",
    [
      "expo-media-library",
      {
        photosPermission: "Allow $(PRODUCT_NAME) to access your photos.",
        savePhotosPermission: "Allow $(PRODUCT_NAME) to save photos.",
        isAccessMediaLocationEnabled: true,
      },
    ],
    [
      "expo-image-picker",
      {
        photosPermission: "The app accesses your photos to let you share them.",
        cameraPermission: "The app accesses your camera to let you take photos.",
      },
    ],
    "expo-updates",
    [
      "react-native-gesture-handler",
      {
        enableCrashReporter: false,
      },
    ],
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
    [
      "@sentry/react-native/expo",
      {
        url: "https://sentry.io/",
        project: process.env.SENTRY_PROJECT || "your-project",
        organization: process.env.SENTRY_ORG || "your-org",
      },
    ],
  ],
  extra: {
    apiUrl: process.env.API_URL,
    posthogApiKey: process.env.POSTHOG_API_KEY,
    revenuecatApiKey: process.env.REVENUECAT_API_KEY,
    onesignalAppId: process.env.ONESIGNAL_APP_ID,
    sentryDsn: process.env.SENTRY_DSN,
    appVariant: process.env.APP_VARIANT,
    eas: {
      projectId: "your-eas-project-id",
    },
  },
});
