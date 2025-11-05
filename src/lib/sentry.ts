import * as Sentry from "@sentry/react-native";
import { config } from "./config";

export const initializeSentry = () => {
  // Check if Sentry DSN is configured
  const sentryDsn = process.env.SENTRY_DSN;

  if (!sentryDsn) {
    console.log("Sentry DSN not configured, skipping Sentry initialization");
    return;
  }

  Sentry.init({
    dsn: sentryDsn,
    environment: config.appVariant,
    enabled: config.isProduction || config.isStaging,
    debug: config.isDevelopment,
    tracesSampleRate: config.isProduction ? 0.2 : 1.0,
    enableAutoSessionTracking: true,
    sessionTrackingIntervalMillis: 30000,
    beforeSend(event) {
      // Don't send events in development
      if (config.isDevelopment) {
        console.log("Sentry event (not sent in dev):", event);
        return null;
      }
      return event;
    },
  });

  // Set user context if needed
  Sentry.setTag("app.variant", config.appVariant);
};

export const logErrorToSentry = (error: Error, context?: Record<string, any>) => {
  if (config.isDevelopment) {
    console.error("Error:", error, context);
    return;
  }

  Sentry.captureException(error, {
    contexts: context ? { custom: context } : undefined,
  });
};

export const logMessageToSentry = (
  message: string,
  level: "info" | "warning" | "error" = "info"
) => {
  if (config.isDevelopment) {
    console.log(message);
    return;
  }

  Sentry.captureMessage(message, level);
};
