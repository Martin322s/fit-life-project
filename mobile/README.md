# FitLife — Mobile App

Expo / React Native app for iOS and Android. Uses file-based routing via Expo Router and communicates with the same FitLife server API as the web client.

## Tech Stack

- **Expo 54** (SDK)
- **React Native 0.81** / **React 19**
- **Expo Router 6** (file-based navigation)
- **TypeScript 5.9**
- **AsyncStorage** — local auth token persistence
- **React Native Gesture Handler**, **Safe Area Context**, **Screens**
- **EAS Build** — cloud build for iOS and Android

## Project Structure

```
mobile/
├── app/                    # Expo Router pages (file = route)
│   ├── _layout.tsx         # Root layout, auth gate
│   ├── index.tsx           # Entry redirect
│   ├── (auth)/             # Login, register, forgot/reset password
│   └── (tabs)/             # Bottom-tab pages: dashboard, calories, weight, training, more
├── src/
│   ├── components/         # Shared UI components
│   ├── context/            # AuthContext
│   ├── data/               # Static/seeded data helpers
│   ├── hooks/              # useStorage and other hooks
│   ├── services/           # API service modules per feature
│   ├── types/              # Shared TypeScript types
│   └── theme.ts            # Design tokens
├── assets/images/          # App icon variants, splash screen
├── app.json                # Expo config
├── eas.json                # EAS build profiles
└── .env                    # EXPO_PUBLIC_API_BASE_URL
```

## Environment Variables

Create `mobile/.env`:

```env
EXPO_PUBLIC_API_BASE_URL=http://localhost:3001
```

Device-specific values:

```env
# iOS Simulator or web
EXPO_PUBLIC_API_BASE_URL=http://localhost:3001

# Android Emulator (10.0.2.2 maps to host machine localhost)
EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:3001

# Physical device (replace with your machine's LAN IP)
EXPO_PUBLIC_API_BASE_URL=http://192.168.x.x:3001

# Production
EXPO_PUBLIC_API_BASE_URL=https://your-deployed-api.example.com
```

## Setup & Development

```bash
npm install
npm run start
```

Scan the QR code with **Expo Go** (iOS/Android) or press `a` for Android emulator / `i` for iOS simulator.

## Available Scripts

| Script | Description |
|---|---|
| `npm run start` | Start Expo dev server |
| `npm run android` | Open on Android emulator |
| `npm run ios` | Open on iOS simulator |
| `npm run web` | Open in browser |
| `npm run lint` | Run ESLint via `expo lint` |
| `npm run typecheck` | TypeScript type check (no emit) |

## Building for Production (EAS)

Requires an [Expo account](https://expo.dev) and the EAS CLI:

```bash
npm install -g eas-cli
eas login
```

Build an Android APK (preview profile):

```bash
eas build --profile preview --platform android
```

Build for production:

```bash
eas build --profile production --platform android
eas build --profile production --platform ios
```

Pre-built Android APK: https://expo.dev/accounts/martin13s18/projects/fit-life/builds/ec050589-bc7a-4f19-918f-3ee2fb0ecaab

## Navigation Structure

```
Root layout (_layout.tsx)
└── Auth check
    ├── (auth)/            Guest-only stack
    │   ├── login
    │   ├── register
    │   ├── forgot-password
    │   └── reset-password
    └── (tabs)/            Authenticated tab navigator
        ├── dashboard
        ├── calories
        ├── weight
        ├── training
        └── more           → links to recipes, diets, products, challenges, calculators, profile
```

## Notes

- Auth tokens are stored in AsyncStorage. Before a store release, migrate to Expo SecureStore.
- All user-facing copy is in Bulgarian.
