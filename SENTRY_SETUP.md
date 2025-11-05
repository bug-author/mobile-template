# Sentry Setup Guide

This guide will walk you through setting up Sentry for error tracking and performance monitoring.

## Why Sentry?

Sentry provides:
- **Detailed error tracking** with full stack traces
- **Performance monitoring** to find slow operations
- **Release tracking** to see which version has issues
- **Breadcrumbs** to see what led to an error
- **User context** to understand who is affected
- **Source maps** to see actual source code in errors

## Sentry Free Tier

The free tier is perfect for this app:
- **5,000 errors/month** - Plenty for development and early production
- **10,000 performance transactions/month**
- **30 days data retention**
- **1 project**
- **Source maps support**

## Setup Instructions

### 1. Create Sentry Account

1. Go to [sentry.io](https://sentry.io)
2. Click "Sign Up"
3. Choose "Create a new organization" or use existing

### 2. Create a New Project

1. Click "Create Project"
2. Choose platform: **React Native**
3. Alert frequency: Choose your preference
4. Project name: Your app name (e.g., "Mobile App")
5. Click "Create Project"

### 3. Get Your DSN

After creating the project, you'll see your DSN (Data Source Name).

It looks like:
```
https://abc123def456@o123456.ingest.sentry.io/7890123
```

### 4. Configure Environment Variables

Add to your `.env.development`:
```env
SENTRY_DSN=https://abc123def456@o123456.ingest.sentry.io/7890123
SENTRY_PROJECT=your-project-name
SENTRY_ORG=your-org-name
```

Add to your `.env.staging`:
```env
SENTRY_DSN=https://abc123def456@o123456.ingest.sentry.io/7890123
SENTRY_PROJECT=your-project-name
SENTRY_ORG=your-org-name
```

Add to your `.env.production`:
```env
SENTRY_DSN=https://abc123def456@o123456.ingest.sentry.io/7890123
SENTRY_PROJECT=your-project-name
SENTRY_ORG=your-org-name
```

**Note**: You can use the same DSN for all environments, or create separate Sentry projects for each.

### 5. Verify Integration

The app automatically initializes Sentry on startup when `SENTRY_DSN` is configured.

To test, add this to any screen:
```tsx
import { logErrorToSentry } from "../lib/sentry";

// Trigger a test error
logErrorToSentry(new Error("Test error from mobile app"));
```

Check your Sentry dashboard - you should see the error appear within a few seconds!

## Features Included

### Automatic Error Capture

All errors are automatically captured:
- Unhandled exceptions
- Promise rejections
- React component errors (via Error Boundary)

### User Identification

Users are automatically identified after login:
```tsx
// Automatically called in useAuth hook
identifyUser(user.id, user.email, user.name);
```

In Sentry, you'll see:
- Which user experienced the error
- Their email and name
- All errors grouped by user

### Performance Monitoring

Performance is automatically tracked:
- Screen load times
- API call durations
- Frame drops

Sample rate:
- **Development**: 100% of transactions
- **Production**: 20% of transactions (to stay within free tier)

### Breadcrumbs

Breadcrumbs show what happened before an error:
```tsx
import { addBreadcrumb } from "../lib/sentry";

addBreadcrumb("User clicked checkout button", "user-action", {
  cart_value: 99.99,
  items_count: 3,
});
```

### Context Data

Add custom context to errors:
```tsx
import { setContext } from "../lib/sentry";

setContext("shopping_cart", {
  total: 99.99,
  items: 3,
  coupon_applied: true,
});
```

### Manual Error Logging

Log errors manually with context:
```tsx
import { logErrorToSentry } from "../lib/sentry";

try {
  await processPayment();
} catch (error) {
  logErrorToSentry(error as Error, {
    payment_method: "credit_card",
    amount: 99.99,
    currency: "USD",
  });
}
```

## Environment Behavior

### Development
- Sentry is **enabled** but events are **not sent**
- Errors are logged to console instead
- Allows testing without polluting your Sentry dashboard

### Staging
- Sentry is **fully enabled**
- All errors are sent to Sentry
- Tagged with `environment: staging`

### Production
- Sentry is **fully enabled**
- All errors are sent to Sentry
- Tagged with `environment: production`
- 20% performance sampling to conserve quota

## Source Maps

For production builds, enable source maps to see actual code in errors:

### EAS Build

Source maps are automatically uploaded when building with EAS.

The Sentry plugin in `app.config.ts` handles this:
```typescript
[
  "@sentry/react-native/expo",
  {
    url: "https://sentry.io/",
    project: process.env.SENTRY_PROJECT,
    organization: process.env.SENTRY_ORG,
  },
],
```

### Authentication

For source map uploads, you'll need a Sentry auth token:

1. Go to Settings → Auth Tokens
2. Create a new token with `project:releases` scope
3. Add to your CI/CD secrets as `SENTRY_AUTH_TOKEN`

## Dashboard Overview

### Issues Tab
- See all errors grouped by type
- Click to see full stack trace
- View affected users
- See breadcrumbs leading to error

### Performance Tab
- See slow screens and operations
- Identify performance bottlenecks
- Track app startup time

### Releases Tab
- Track which version has issues
- Compare error rates between versions
- Deploy health monitoring

## Best Practices

### 1. Add Context to Errors

```tsx
try {
  await api.post("/purchase", data);
} catch (error) {
  logErrorToSentry(error as Error, {
    api_endpoint: "/purchase",
    user_action: "checkout",
    data_size: JSON.stringify(data).length,
  });
}
```

### 2. Use Breadcrumbs

```tsx
addBreadcrumb("Started checkout flow");
addBreadcrumb("Validated cart items");
addBreadcrumb("Submitted payment");
// If payment fails, Sentry shows all these steps
```

### 3. Filter Sensitive Data

The Sentry config already filters sensitive data:
- Console logs are not sent as breadcrumbs
- Development events are not sent

Add more filters in `src/lib/sentry.ts`:
```typescript
beforeSend(event) {
  // Remove sensitive data
  if (event.request?.cookies) {
    delete event.request.cookies;
  }
  return event;
},
```

### 4. Monitor Releases

Tag errors with your app version:
```typescript
Sentry.setTag("app.version", "1.2.3");
```

### 5. Create Alerts

In Sentry dashboard:
1. Go to Alerts → Create Alert Rule
2. Set conditions (e.g., "new error" or "error rate > 10/min")
3. Choose notification method (email, Slack, etc.)

## Troubleshooting

### Errors Not Appearing

1. Check `SENTRY_DSN` is set in your .env file
2. Check console for "Sentry initialized" message
3. Verify environment (dev doesn't send events)
4. Check Sentry project settings

### Source Maps Not Working

1. Verify `SENTRY_AUTH_TOKEN` is configured in CI/CD
2. Check EAS build logs for source map upload
3. Ensure Sentry plugin is in `app.config.ts`

### Too Many Events

If you hit the free tier limit:
1. Reduce `tracesSampleRate` in `src/lib/sentry.ts`
2. Add more filters in `beforeSend`
3. Upgrade to paid tier

## Integration with PostHog

Sentry and PostHog work together:

- **PostHog**: Product analytics, feature flags, user behavior
- **Sentry**: Error tracking, performance monitoring, debugging

They complement each other perfectly! Use PostHog to understand what users do, and Sentry to understand when things break.

## Resources

- [Sentry React Native Docs](https://docs.sentry.io/platforms/react-native/)
- [Error Tracking Best Practices](https://docs.sentry.io/product/issues/)
- [Performance Monitoring](https://docs.sentry.io/product/performance/)
- [Sentry CLI](https://docs.sentry.io/product/cli/)

## Next Steps

1. Set up alerts for critical errors
2. Create separate Sentry projects for dev/staging/prod
3. Configure source maps for production builds
4. Set up Slack/email notifications
5. Review errors weekly and fix top issues

Happy error tracking!
