import * as Sentry from "@sentry/react-native";
import { config } from "./config";

export const initializeSentry = () => {
  // Check if Sentry DSN is configured
  if (!config.sentryDsn) {
    console.log("Sentry DSN not configured, skipping Sentry initialization");
    return;
  }

  Sentry.init({
    dsn: config.sentryDsn,
    environment: config.appVariant,
    enabled: config.isProduction || config.isStaging,
    debug: config.isDevelopment,

    // Performance Monitoring
    tracesSampleRate: config.isProduction ? 0.2 : 1.0,
    enableAutoSessionTracking: true,
    sessionTrackingIntervalMillis: 30000,

    // Capture unhandled promise rejections
    enableNativeFramesTracking: true,

    beforeSend(event) {
      // Don't send events in development (just log them)
      if (config.isDevelopment) {
        console.log("Sentry event (not sent in dev):", event);
        return null;
      }
      return event;
    },

    beforeBreadcrumb(breadcrumb) {
      // Filter out sensitive breadcrumbs
      if (breadcrumb.category === "console") {
        return null;
      }
      return breadcrumb;
    },
  });

  // Set initial tags
  Sentry.setTag("app.variant", config.appVariant);
  Sentry.setTag("app.platform", config.isDevelopment ? "development" : "production");

  console.log(`Sentry initialized for ${config.appVariant} environment`);
};

export const identifyUser = (userId: string, email?: string, name?: string) => {
  Sentry.setUser({
    id: userId,
    email,
    username: name,
  });
};

export const clearUser = () => {
  Sentry.setUser(null);
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
    console.log(`[${level.toUpperCase()}]`, message);
    return;
  }

  Sentry.captureMessage(message, level);
};

export const addBreadcrumb = (message: string, category?: string, data?: Record<string, any>) => {
  Sentry.addBreadcrumb({
    message,
    category: category || "custom",
    data,
    level: "info",
  });
};

export const setContext = (key: string, context: Record<string, any>) => {
  Sentry.setContext(key, context);
};

// Re-export Sentry for advanced usage
export { Sentry };
