import Purchases from "react-native-purchases";
import { config } from "./config";

export const initializeRevenueCat = async () => {
  if (!config.revenuecatApiKey) {
    console.warn("RevenueCat API key not configured");
    return;
  }

  Purchases.configure({
    apiKey: config.revenuecatApiKey,
  });

  if (config.isDevelopment) {
    Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
  }
};
