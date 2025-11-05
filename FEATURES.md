# Features Guide

This document provides detailed information about all features included in this React Native template.

## Table of Contents

- [Error Handling](#error-handling)
- [Dark Mode](#dark-mode)
- [Internationalization](#internationalization)
- [Security Features](#security-features)
- [Network Detection](#network-detection)
- [Deep Linking](#deep-linking)
- [Notifications](#notifications)
- [Analytics & Monitoring](#analytics--monitoring)
- [Testing](#testing)
- [CI/CD](#cicd)

## Error Handling

### Error Boundaries

Error boundaries catch React component errors and display a fallback UI.

**Implementation**:
```tsx
import { ErrorBoundary } from "./src/components/ErrorBoundary";

<ErrorBoundary>
  <YourApp />
</ErrorBoundary>
```

**Features**:
- Automatic error logging to PostHog
- Optional Sentry integration
- Different UI for development vs production
- Reset button to recover from errors

**Custom Fallback**:
```tsx
<ErrorBoundary
  fallback={(error, resetError) => (
    <CustomErrorScreen error={error} onReset={resetError} />
  )}
>
  <YourComponent />
</ErrorBoundary>
```

### Sentry Integration (Recommended)

Sentry provides detailed error tracking and performance monitoring. The **free tier is included** and provides everything you need!

**Free Tier Includes**:
- 5,000 errors/month (plenty for development and production)
- 10,000 performance transactions/month
- 30 days data retention
- Source maps support
- Full stack traces
- User identification

**Quick Setup**:
1. Create account at [sentry.io](https://sentry.io) (free)
2. Create a React Native project
3. Get your DSN (looks like: `https://abc@o123.ingest.sentry.io/456`)
4. Add to environment variables:
   ```env
   SENTRY_DSN=your-sentry-dsn
   SENTRY_PROJECT=your-project
   SENTRY_ORG=your-org
   ```
5. Sentry automatically initializes in `_layout.tsx`

See [SENTRY_SETUP.md](./SENTRY_SETUP.md) for detailed setup guide.

**What You Get**:
- Automatic error capture
- Performance monitoring
- User identification (see which users are affected)
- Breadcrumbs (see what led to the error)
- Release tracking

**Manual Error Logging**:
```tsx
import { logErrorToSentry } from "./src/lib/sentry";

try {
  await processPayment();
} catch (error) {
  logErrorToSentry(error, {
    context: "payment-flow",
    amount: 99.99
  });
}
```

**User Identification**:

Automatically identifies users after login:
```tsx
// Called automatically in useAuth hook
identifyUser(user.id, user.email, user.name);
```

### PostHog vs Sentry

Both are free and complement each other perfectly!

**PostHog is best for**:
- Product analytics
- Feature flags
- Session recordings
- Understanding user behavior
- A/B testing

**Sentry is best for**:
- Detailed error stack traces
- Error grouping and deduplication
- Performance monitoring
- Release tracking
- Finding and fixing bugs

**Recommendation**: Use both! PostHog tells you what users do, Sentry tells you when things break.

## Dark Mode

Automatic dark mode support with system preference detection.

**Usage**:
```tsx
import { useTheme } from "./src/stores/theme.store";

function MyComponent() {
  const { theme, actualTheme, setTheme, isDark } = useTheme();

  return (
    <View className="bg-white dark:bg-gray-900">
      <Text className="text-black dark:text-white">Hello</Text>
    </View>
  );
}
```

**Theme Options**:
- `light`: Always light mode
- `dark`: Always dark mode
- `system`: Follow system preference (default)

**Theme Toggle Component**:
```tsx
import { ThemeToggle } from "./src/components/ThemeToggle";

<ThemeToggle />
```

## Internationalization

Multi-language support using i18next.

**Usage**:
```tsx
import { useTranslation } from "react-i18next";

function MyComponent() {
  const { t } = useTranslation();

  return <Text>{t("auth.signIn")}</Text>;
}
```

**Adding Translations**:

Edit `src/lib/i18n.ts`:
```typescript
const resources = {
  en: {
    translation: {
      welcome: "Welcome",
    },
  },
  es: {
    translation: {
      welcome: "Bienvenido",
    },
  },
};
```

**Changing Language**:
```tsx
import { changeLanguage } from "./src/lib/i18n";

changeLanguage("es");
```

**Supported Languages**:
- English (en)
- Spanish (es)

Add more languages by extending the `resources` object.

## Security Features

### Secure Storage

Sensitive data is stored securely using Expo Secure Store.

**Usage**:
```tsx
import { secureStorage, STORAGE_KEYS } from "./src/lib/secure-storage";

// Store token
await secureStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);

// Retrieve token
const token = await secureStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

// Remove token
await secureStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
```

**Platforms**:
- **iOS**: Keychain
- **Android**: Keystore
- **Web**: localStorage (not truly secure, fallback only)

**Auth Store Integration**:

The auth store automatically uses secure storage for tokens:
```tsx
const { setToken } = useAuthStore();
await setToken(token); // Stored securely
```

### Biometric Authentication

Face ID / Touch ID support for enhanced security.

**Check Availability**:
```tsx
import { biometricAuth } from "./src/lib/biometric-auth";

const available = await biometricAuth.isAvailable();
const typeName = await biometricAuth.getBiometricTypeName();
// Returns: "Face ID", "Touch ID", "Fingerprint", etc.
```

**Authenticate**:
```tsx
const result = await biometricAuth.authenticate({
  promptMessage: "Authenticate to continue",
  cancelLabel: "Cancel",
});

if (result.success) {
  // Authentication successful
} else {
  console.error(result.error);
}
```

**Example Implementation**:

See `src/app/(auth)/profile.tsx` for a complete example with toggle switch.

## Network Detection

Detect online/offline status and show appropriate UI.

**Usage**:
```tsx
import { useNetworkStatus } from "./src/hooks/useNetworkStatus";

function MyComponent() {
  const { isConnected, isOffline, connectionType } = useNetworkStatus();

  if (isOffline) {
    return <Text>You are offline</Text>;
  }

  return <Text>Connected via {connectionType}</Text>;
}
```

**Offline Banner**:

The `OfflineBanner` component is automatically included in the app layout and shows when offline.

**Queue Offline Requests**:

Use TanStack Query's built-in offline support:
```tsx
const mutation = useMutation({
  mutationFn: api.post,
  networkMode: "offlineFirst", // Queue when offline
});
```

## Deep Linking

Handle deep links and universal links.

**URL Schemes**:
- Development: `mobileappdev://`
- Staging: `mobileappstaging://`
- Production: `mobileapp://`

**Universal Links (iOS)**:
- Development: `https://dev.yourapp.com`
- Staging: `https://staging.yourapp.com`
- Production: `https://yourapp.com`

**Setup Required**:

1. **iOS**: Add `apple-app-site-association` file to your domain
2. **Android**: Add `assetlinks.json` file to your domain

**Handling Links**:

Expo Router handles deep links automatically based on file structure:

```
src/app/
  product/
    [id].tsx  <- Handles /product/123
```

**Manual Link Handling**:
```tsx
import * as Linking from "expo-linking";

const url = await Linking.getInitialURL();

Linking.addEventListener("url", ({ url }) => {
  // Handle URL
});
```

## Notifications

### Toast Notifications

User feedback via toast messages.

**Usage**:
```tsx
import { toast } from "./src/lib/toast";

toast.success("Operation successful!");
toast.error("Something went wrong");
toast.info("FYI: New update available");
toast.warning("Please verify your email");
```

**Customization**:
```tsx
toast.success("Saved!", "Settings Updated");
// Shows title and message
```

### Push Notifications (OneSignal)

Configured in `src/lib/onesignal.ts`.

**Setup**:
1. Add `ONESIGNAL_APP_ID` to environment variables
2. Configure FCM (Android) and APNs (iOS) in OneSignal dashboard
3. OneSignal initializes automatically on app start

**Handling Notifications**:

Edit `src/lib/onesignal.ts` to customize notification handling.

## Analytics & Monitoring

### PostHog

Product analytics configured in `src/lib/posthog.ts`.

**Track Events**:
```tsx
import { posthog } from "./src/lib/posthog";

posthog.capture("button_clicked", {
  button_name: "upgrade",
  screen: "settings",
});
```

**User Properties**:
```tsx
posthog.identify(user.id, {
  email: user.email,
  name: user.name,
  plan: "pro",
});
```

### RevenueCat

In-app purchases configured in `src/lib/revenuecat.ts`.

**Usage**:
```tsx
import Purchases from "react-native-purchases";

// Get offerings
const offerings = await Purchases.getOfferings();

// Make purchase
await Purchases.purchasePackage(package);

// Check subscription status
const customerInfo = await Purchases.getCustomerInfo();
```

## Testing

### Unit & Component Tests

Using Jest and React Native Testing Library.

**Run Tests**:
```bash
bun test
bun test:watch
bun test:coverage
```

**Example Test**:
```tsx
import { render, fireEvent } from "@testing-library/react-native";
import { Button } from "./Button";

test("calls onPress when pressed", () => {
  const onPress = jest.fn();
  const { getByText } = render(<Button onPress={onPress}>Click</Button>);

  fireEvent.press(getByText("Click"));
  expect(onPress).toHaveBeenCalled();
});
```

### E2E Tests (Maestro)

End-to-end testing with Maestro.

**Install Maestro**:
```bash
curl -fsSL "https://get.maestro.mobile.dev" | bash
```

**Run Tests**:
```bash
maestro test .maestro/
```

**Write Tests**:

Create `.maestro/my-test.yaml`:
```yaml
appId: com.yourcompany.mobileapp.dev
---
- launchApp
- tapOn: "Sign In"
- inputText: "test@example.com"
- assertVisible: "Welcome"
```

See `.maestro/README.md` for more details.

## CI/CD

### GitHub Actions

Automated workflows for testing, linting, and building.

**Workflows**:

1. **CI** (`.github/workflows/ci.yml`):
   - Runs on push to main/develop
   - Linting, type checking, tests
   - Builds production apps (iOS/Android)

2. **PR Checks** (`.github/workflows/pr.yml`):
   - Runs on pull requests
   - Linting, type checking, tests
   - Validates commit messages
   - E2E tests (with `run-e2e` label)

**Required Secrets**:
```
EXPO_TOKEN - Expo account token
CODECOV_TOKEN - Codecov token (optional)
```

**Get Expo Token**:
```bash
eas login
eas whoami --show-token
```

Add to GitHub: Settings → Secrets → Actions → New repository secret

### EAS Build

Configured in `eas.json` with profiles for development, staging, and production.

**Build Commands**:
```bash
# Development
eas build --profile development --platform ios

# Staging
eas build --profile staging --platform android

# Production
eas build --profile production --platform all
```

## Feature Flags

PostHog supports feature flags for gradual rollouts and A/B testing.

**Setup**:
```tsx
import { posthog } from "./src/lib/posthog";

const showNewFeature = posthog.isFeatureEnabled("new-feature");

if (showNewFeature) {
  return <NewFeature />;
}
```

## Performance Monitoring

### Sentry Performance

When Sentry is configured, performance monitoring is enabled automatically.

**Custom Transactions**:
```tsx
import * as Sentry from "@sentry/react-native";

const transaction = Sentry.startTransaction({ name: "api-call" });
try {
  await api.get("/data");
  transaction.setStatus("ok");
} catch (error) {
  transaction.setStatus("error");
} finally {
  transaction.finish();
}
```

## Best Practices

### Error Handling
- Always wrap async operations in try/catch
- Use Error Boundaries for React errors
- Log errors with context for easier debugging

### Security
- Never store sensitive data in AsyncStorage
- Use Secure Storage for tokens
- Enable biometric auth for sensitive operations
- Validate all user input

### Performance
- Use React.memo for expensive components
- Implement pagination for large lists
- Use image optimization
- Monitor bundle size

### Testing
- Write tests for critical user flows
- Use E2E tests for important features
- Maintain > 80% code coverage

### Internationalization
- Use translation keys, not hardcoded strings
- Test with different languages
- Support RTL languages if needed

## Troubleshooting

See individual feature documentation and the main README for troubleshooting guides.

For more help:
- [Expo Documentation](https://docs.expo.dev)
- [React Native Documentation](https://reactnative.dev)
- Create an issue in the repository
