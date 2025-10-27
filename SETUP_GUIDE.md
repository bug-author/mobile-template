# Setup Guide

This guide will walk you through setting up the React Native mobile template for development.

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 18 or higher
- [Bun](https://bun.sh) (recommended) or npm/yarn
- Git
- Expo CLI: `bun install -g expo-cli` or `npm install -g expo-cli`
- EAS CLI: `bun install -g eas-cli` or `npm install -g eas-cli`

### Installing Bun

Install Bun on macOS/Linux:
```bash
curl -fsSL https://bun.sh/install | bash
```

Install Bun on Windows:
```powershell
powershell -c "irm bun.sh/install.ps1 | iex"
```

For iOS development:
- macOS
- Xcode (latest version)
- CocoaPods

For Android development:
- Android Studio
- Java Development Kit (JDK)

## Initial Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd mobile-template
```

### 2. Install Dependencies

Using Bun (recommended):
```bash
bun install
```

Or using npm:
```bash
npm install
```

This will also set up Git hooks using Husky for code quality checks.

### 3. Configure Environment Variables

Create environment files for each flavor:

```bash
cp .env.example .env.development
cp .env.example .env.staging
cp .env.example .env.production
```

Update each file with your actual values:

#### Development (.env.development)
```env
APP_VARIANT=development
APP_NAME=MobileApp (Dev)
APP_ID=com.yourcompany.mobileapp.dev
API_URL=https://dev-api.yourcompany.com
POSTHOG_API_KEY=your-posthog-dev-key
REVENUECAT_API_KEY=your-revenuecat-dev-key
ONESIGNAL_APP_ID=your-onesignal-dev-id
```

#### Staging (.env.staging)
```env
APP_VARIANT=staging
APP_NAME=MobileApp (Staging)
APP_ID=com.yourcompany.mobileapp.staging
API_URL=https://staging-api.yourcompany.com
POSTHOG_API_KEY=your-posthog-staging-key
REVENUECAT_API_KEY=your-revenuecat-staging-key
ONESIGNAL_APP_ID=your-onesignal-staging-id
```

#### Production (.env.production)
```env
APP_VARIANT=production
APP_NAME=MobileApp
APP_ID=com.yourcompany.mobileapp
API_URL=https://api.yourcompany.com
POSTHOG_API_KEY=your-posthog-prod-key
REVENUECAT_API_KEY=your-revenuecat-prod-key
ONESIGNAL_APP_ID=your-onesignal-prod-id
```

### 4. Update App Configuration

Edit `app.config.ts` and update:

```typescript
const getBundleId = () => {
  if (IS_DEV) return "com.yourcompany.mobileapp.dev";
  if (IS_STAGING) return "com.yourcompany.mobileapp.staging";
  return "com.yourcompany.mobileapp";
};
```

Replace `yourcompany` and `mobileapp` with your actual company and app names.

### 5. Configure App Icons

Create app icons for each flavor:

- Development: `assets/icon-dev.png` (1024x1024)
- Staging: `assets/icon-staging.png` (1024x1024)
- Production: `assets/icon.png` (1024x1024)

Tip: Use different colored overlays or badges to distinguish between flavors.

### 6. Set Up EAS

Initialize EAS for your project:

```bash
eas login
eas build:configure
```

Update `eas.json` with your project configuration.

## Third-Party Service Setup

### PostHog

1. Sign up at https://posthog.com
2. Create a new project
3. Copy your API key
4. Add it to your environment files

### RevenueCat

1. Sign up at https://www.revenuecat.com
2. Create a new project
3. Set up products in App Store Connect and Google Play Console
4. Configure products in RevenueCat dashboard
5. Copy your API keys for each environment
6. Add them to your environment files

### OneSignal

1. Sign up at https://onesignal.com
2. Create a new app for each environment
3. Configure iOS (APNs) and Android (FCM) certificates
4. Copy your App IDs
5. Add them to your environment files

## Running the App

### Development

Using Bun:
```bash
bun run start:dev
```

Or using npm:
```bash
npm run start:dev
```

Then press:
- `i` for iOS Simulator
- `a` for Android Emulator
- `w` for Web Browser

### Staging

```bash
bun run start:staging
```

### Production

```bash
bun run start:prod
```

## Pre-Commit Hooks

This template includes Git hooks that automatically run when you commit code:

### What Gets Checked

- **Linting**: ESLint checks your TypeScript/JavaScript files
- **Formatting**: Prettier formats your code
- **Commit Messages**: Commitlint validates commit message format

### Making Your First Commit

```bash
# 1. Stage your changes
git add .

# 2. Commit with proper message format
git commit -m "feat: add new feature"

# Hooks will run automatically:
# ✔ Running lint-staged...
# ✔ Checking commit message...
```

### Commit Message Format

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
type: description

Examples:
feat: add user profile screen
fix: resolve login crash
docs: update setup guide
refactor: improve auth logic
test: add user service tests
```

### Troubleshooting Hooks

If hooks fail:

```bash
# Fix linting errors
bun run lint:fix

# Format code
bun run format

# Then try committing again
git commit -m "feat: your message"
```

For more details, see [PRE_COMMIT_HOOKS.md](./PRE_COMMIT_HOOKS.md).

## Building the App

### Development Build

Create a development build for testing on physical devices:

```bash
eas build --profile development --platform ios
eas build --profile development --platform android
```

Install the development build on your device and run:

```bash
npm run start:dev
```

### Staging Build

```bash
eas build --profile staging --platform ios
eas build --profile staging --platform android
```

### Production Build

```bash
eas build --profile production --platform ios
eas build --profile production --platform android
```

## Testing

### Run Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm test -- --watch
```

### Run Tests with Coverage

```bash
npm test -- --coverage
```

## Common Issues

### Metro Bundler Cache Issues

Clear the cache:

```bash
npm start -- --clear
```

### iOS Pod Install Issues

```bash
cd ios
pod install
cd ..
```

### Android Build Issues

Clean the Android build:

```bash
cd android
./gradlew clean
cd ..
```

### Environment Variables Not Loading

Make sure you're using the correct start script:
- `npm run start:dev` for development
- `npm run start:staging` for staging
- `npm run start:prod` for production

## Project Structure

```
mobile-template/
├── assets/              # Static assets (images, fonts)
├── src/
│   ├── app/            # Expo Router screens
│   │   ├── (auth)/     # Authentication screens
│   │   ├── _layout.tsx # Root layout
│   │   └── index.tsx   # Home screen
│   ├── components/     # Reusable components
│   ├── hooks/         # Custom hooks
│   ├── lib/           # Utilities and configurations
│   ├── services/      # API services
│   ├── stores/        # Zustand stores
│   └── types/         # TypeScript types
├── .env.example       # Example environment file
├── app.config.ts      # Expo configuration
├── eas.json          # EAS Build configuration
├── package.json      # Dependencies and scripts
└── tsconfig.json     # TypeScript configuration
```

## Next Steps

1. Customize the theme in `tailwind.config.js`
2. Set up your API endpoints in `src/services/`
3. Create your app screens in `src/app/`
4. Configure app store metadata
5. Set up CI/CD pipeline
6. Configure app signing
7. Submit to app stores

## Additional Resources

- [Expo Documentation](https://docs.expo.dev)
- [React Native Documentation](https://reactnative.dev)
- [NativeWind Documentation](https://www.nativewind.dev)
- [TanStack Query Documentation](https://tanstack.com/query)
- [Expo Router Documentation](https://docs.expo.dev/router)
- [RevenueCat Documentation](https://docs.revenuecat.com)
- [OneSignal Documentation](https://documentation.onesignal.com)
- [PostHog Documentation](https://posthog.com/docs)
