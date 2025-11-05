import Constants from "expo-constants";

export const config = {
  apiUrl: Constants.expoConfig?.extra?.apiUrl || "",
  posthogApiKey: Constants.expoConfig?.extra?.posthogApiKey || "",
  revenuecatApiKey: Constants.expoConfig?.extra?.revenuecatApiKey || "",
  onesignalAppId: Constants.expoConfig?.extra?.onesignalAppId || "",
  sentryDsn: Constants.expoConfig?.extra?.sentryDsn || "",
  appVariant: Constants.expoConfig?.extra?.appVariant || "production",
  isDevelopment: Constants.expoConfig?.extra?.appVariant === "development",
  isStaging: Constants.expoConfig?.extra?.appVariant === "staging",
  isProduction: Constants.expoConfig?.extra?.appVariant === "production",
};
