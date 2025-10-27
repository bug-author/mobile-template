import { OneSignal } from "react-native-onesignal";
import { config } from "./config";

export const initializeOneSignal = () => {
  if (!config.onesignalAppId) {
    console.warn("OneSignal App ID not configured");
    return;
  }

  OneSignal.initialize(config.onesignalAppId);

  OneSignal.Notifications.requestPermission(true);

  OneSignal.Notifications.addEventListener("click", (event) => {
    console.log("OneSignal: notification clicked:", event);
  });
};
