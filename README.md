# React Native Mobile Template

A production-ready React Native template built with Expo, featuring modern development tools and best practices.

## Features

### Core Technologies
- **Expo SDK 54** with the new architecture enabled
- **Expo Router** for file-based routing
- **NativeWind v4** for Tailwind CSS styling
- **TypeScript** for type safety
- **Bun** as the package manager

### State Management & Data
- **TanStack Query** for data fetching and caching
- **Axios** for HTTP requests
- **React Hook Form** with Zod validation
- **Zustand** for state management

### Third-Party Services
- **PostHog** for analytics
- **RevenueCat** for in-app purchases
- **OneSignal** for push notifications

### Development Tools
- **React Native Testing Library** for testing
- **ESLint** and **Prettier** for code quality
- **Husky** and **Lint-staged** for pre-commit hooks
- **Commitlint** for conventional commits
- **App Flavors** (dev, staging, production)

## Prerequisites

- Node.js 18+
- [Bun](https://bun.sh) (recommended) or npm/yarn
- Expo CLI
- iOS Simulator or Android Emulator

### Installing Bun

```bash
curl -fsSL https://bun.sh/install | bash
```

Or on Windows:
```powershell
powershell -c "irm bun.sh/install.ps1 | iex"
```

## Getting Started

### 1. Install Dependencies

Using Bun (recommended):
```bash
bun install
```

Or using npm:
```bash
npm install
```

### 2. Configure Environment Variables

Copy the environment files and update them with your API keys:

- `.env.development`
- `.env.staging`
- `.env.production`

Update the following values:
- `API_URL` - Your API base URL
- `POSTHOG_API_KEY` - PostHog API key
- `REVENUECAT_API_KEY` - RevenueCat API key
- `ONESIGNAL_APP_ID` - OneSignal App ID

### 3. Update App Configuration

Edit `app.config.ts` and update:
- Bundle identifiers (iOS and Android)
- App name
- EAS project ID

### 4. Run the App

Development:
```bash
npm run start:dev
```

Staging:
```bash
npm run start:staging
```

Production:
```bash
npm run start:prod
```

## Pre-Commit Hooks

This project uses Husky to run pre-commit hooks that ensure code quality:

### What runs on commit:
- **Lint-staged**: Runs ESLint and Prettier on staged files
- **Commitlint**: Validates commit messages follow conventional commits

### Commit Message Format

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): subject

Examples:
feat: add user authentication
fix: resolve login button crash
docs: update README
refactor: improve auth service
test: add tests for user service
chore: update dependencies
```

### Bypassing Hooks (Not Recommended)

Only in emergency situations:
```bash
git commit --no-verify -m "emergency fix"
```

## Project Structure

```
src/
├── app/              # Expo Router screens
│   ├── (auth)/       # Authentication screens
│   ├── _layout.tsx   # Root layout
│   └── index.tsx     # Home screen
├── components/       # Reusable components
├── hooks/           # Custom hooks
├── lib/             # Utilities and configurations
│   ├── axios.ts     # Axios instance
│   ├── config.ts    # App configuration
│   ├── onesignal.ts # OneSignal setup
│   ├── posthog.ts   # PostHog setup
│   ├── query-client.ts # TanStack Query client
│   └── revenuecat.ts # RevenueCat setup
├── services/        # API services
├── stores/          # Zustand stores
└── types/           # TypeScript types
```

## App Flavors

This template supports three app flavors:

- **Development**: For local development with debug features
- **Staging**: For testing with production-like environment
- **Production**: For release builds

Each flavor has:
- Different bundle identifier
- Different app name
- Different app icon
- Different environment variables

## Building for Production

### Using EAS Build

1. Install EAS CLI:
```bash
npm install -g eas-cli
```

2. Login to Expo:
```bash
eas login
```

3. Configure your project:
```bash
eas build:configure
```

4. Build for development:
```bash
eas build --profile development --platform ios
eas build --profile development --platform android
```

5. Build for staging:
```bash
eas build --profile staging --platform ios
eas build --profile staging --platform android
```

6. Build for production:
```bash
eas build --profile production --platform ios
eas build --profile production --platform android
```

## Testing

Run tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm test -- --coverage
```

## Type Checking

```bash
npm run type-check
```

## Libraries Included

### Core
- **Expo**: Development framework
- **React Native**: Mobile framework
- **TypeScript**: Type safety

### Navigation
- **Expo Router**: File-based routing

### Styling
- **NativeWind**: Tailwind CSS for React Native
- **Tailwind CSS**: Utility-first CSS

### State Management
- **Zustand**: Lightweight state management
- **TanStack Query**: Server state management

### Forms
- **React Hook Form**: Form handling
- **Zod**: Schema validation

### API
- **Axios**: HTTP client

### Analytics & Monitoring
- **PostHog**: Product analytics

### Monetization
- **RevenueCat**: In-app purchases and subscriptions

### Push Notifications
- **OneSignal**: Push notification service

### Testing
- **Jest**: Testing framework
- **React Native Testing Library**: Component testing

## Environment Variables

Environment variables are loaded from `.env.{variant}` files and made available through `expo-constants`.

Access them in your code:
```typescript
import { config } from './src/lib/config';

console.log(config.apiUrl);
console.log(config.isDevelopment);
```

## Customization

### Adding New Screens

Create a new file in `src/app/`:
```tsx
// src/app/settings.tsx
import { View, Text } from "react-native";

export default function SettingsScreen() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-2xl font-bold">Settings</Text>
    </View>
  );
}
```

### Adding New API Services

Create a service file in `src/services/`:
```typescript
// src/services/user.service.ts
import { api } from "../lib/axios";

export const userService = {
  getProfile: async () => {
    const response = await api.get("/user/profile");
    return response.data;
  },
};
```

### Adding New Stores

Create a store file in `src/stores/`:
```typescript
// src/stores/theme.store.ts
import { create } from "zustand";

interface ThemeState {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: "light",
  setTheme: (theme) => set({ theme }),
}));
```

## License

MIT
