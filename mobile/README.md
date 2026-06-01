# FitLife — Mobile App

Expo / React Native app for iOS, Android, and **web**. Uses file-based routing via Expo Router and communicates with the FitLife unified Next.js app (`web/`) via REST API calls.

## Tech Stack

- **Expo 54** (SDK)
- **React Native 0.81** / **React 19**
- **Expo Router 6** (file-based navigation)
- **TypeScript 5.9**
- **AsyncStorage** — local auth token persistence
- **React Native Gesture Handler**, **Safe Area Context**, **Screens**
- **EAS Build** — cloud build for iOS and Android (optional)

## Deployment — Expo Web (capstone-required)

The primary deployment path for the capstone is **Expo web export** — a static site served from Netlify or similar:

```bash
npm install
npm run export:web       # runs: npx expo export --platform web
# Output: mobile/dist/
```

Deploy the `dist/` folder to Netlify:
1. In the Netlify dashboard, click **"Add new site → Deploy manually"**.
2. Drag and drop the `mobile/dist/` folder.
3. Netlify serves the static Expo web app instantly.

The web export connects to the same `/api/*` endpoints on the unified Next.js app.

## Deployment — Android APK (optional bonus)

EAS Build creates a distributable `.apk` for Android sideloading:

```bash
npm install -g eas-cli
eas login
eas build --profile preview --platform android
```

Pre-built Android APK: <https://expo.dev/accounts/martin13s18/projects/fit-life/builds/ec050589-bc7a-4f19-918f-3ee2fb0ecaab>

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
│   ├── config/             # API base URL resolution
│   ├── context/            # AuthContext
│   ├── services/           # API service modules per feature
│   ├── types/              # Shared TypeScript types
│   └── theme.ts            # Design tokens (C, R)
├── assets/images/          # App icon variants, splash screen
├── app.json                # Expo config
└── eas.json                # EAS build profiles
```

## Environment Variables

The mobile app resolves the API base URL automatically from `src/config/app.config.ts`:
- **Development**: Expo debugger host (LAN IP of your dev machine), port `3000`.
- **Production builds**: reads `process.env.NEXT_PUBLIC_API_BASE_URL` set in `web/.env`.

No separate `mobile/.env` is required for standard usage. If you need to override the API URL:

```env
# iOS Simulator or web
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000

# Android Emulator (10.0.2.2 maps to host machine localhost)
EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:3000

# Physical device
EXPO_PUBLIC_API_BASE_URL=http://192.168.x.x:3000

# Production
EXPO_PUBLIC_API_BASE_URL=https://fitlife-com.netlify.app
```

## Setup & Development

```bash
cd mobile
npm install
npm run start
```

Press `a` for Android emulator, `i` for iOS simulator, `w` for browser, or scan the QR code with Expo Go.

## Available Scripts

| Script | Description |
|---|---|
| `npm run start` | Start Expo dev server |
| `npm run android` | Open on Android emulator |
| `npm run ios` | Open on iOS simulator |
| `npm run web` | Open in browser (Expo dev mode) |
| `npm run export:web` | **Build static Expo web export → `dist/`** |
| `npm run lint` | Run ESLint via `expo lint` |
| `npm run typecheck` | TypeScript type check (no emit) |

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

Additional detail screens (outside tabs):
`recipes`, `diets`, `training-plans`, `products`, `challenges`, `calculators`, `profile`

## Notes

- Auth tokens are stored in AsyncStorage. Before a store release, migrate to Expo SecureStore.
- All user-facing copy is in Bulgarian.
- The REST API endpoints are hosted by `web/src/app/api/` in the unified Next.js app.
