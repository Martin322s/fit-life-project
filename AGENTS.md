# AGENTS.md — fit-life-project

AI agent instructions for the fit-life-project codebase. Read this before generating any code.

---

## App Context

**Fit Life** is a full-stack fitness tracking application targeted at Bulgarian-speaking users. The UI language is **Bulgarian** throughout — all visible text, labels, and copy must be in Bulgarian. Code (variable names, function names, comments) is written in English.

Core features: calorie tracking, weight logging, workout plans, recipes, diet guides, challenges, nutrition products, shop, calculators, and user profile management.

---

## Repository Structure

```
fit-life-project/
├── mobile/      # React Native app (Expo) — primary active codebase
├── client/      # Web frontend (React + Vite)
└── server/      # Backend API (placeholder — not yet implemented)
```

Work is happening primarily in `mobile/`. The `server/` directory is empty; do not generate backend code unless explicitly requested.

---

## Mobile App (`mobile/`)

### Framework & Runtime

| Concern | Technology |
|---|---|
| Framework | Expo ~54 / React Native 0.81 |
| Language | TypeScript ~5.9 (strict) |
| Routing | Expo Router ~6 (file-based, Next.js-style) |
| Persistence | `@react-native-async-storage/async-storage` ~2.2 |
| Styling | React Native `StyleSheet.create()` + centralized theme tokens |

No Redux, Zustand, Context API, or external state management library. State is local (`useState`) or persisted via the `useStorage` hook.

### Directory Layout

```
mobile/
├── app/                     # Expo Router pages (file = route)
│   ├── _layout.tsx          # Root layout
│   ├── index.tsx            # Splash / redirect guard
│   ├── (auth)/              # Route group: login, register, forgot-password
│   └── (tabs)/              # Route group: dashboard, calories, weight, training, more
├── src/
│   ├── components/          # Shared UI primitives
│   ├── data/                # Hardcoded mock data (no API yet)
│   ├── hooks/               # Custom React hooks
│   ├── services/            # Platform service wrappers (AsyncStorage)
│   ├── types/               # Shared TypeScript interfaces
│   └── theme.ts             # Design tokens (colors C, radii R)
└── assets/images/           # Icons, splash screens
```

### Routing Conventions (Expo Router)

- Route files live directly under `app/`. Filename = URL segment.
- Use parenthesised folders for layout groups: `(auth)/`, `(tabs)/`.
- Each group has a `_layout.tsx` that defines its navigator (Stack or Tabs).
- New top-level pages go at `app/<page>.tsx`.
- Nested routes are rare; prefer flat structure.

### Styling

- **Never** use external styling libraries (no NativeWind, no Styled Components).
- All styles use `StyleSheet.create()` at the bottom of each file.
- Import design tokens from `src/theme.ts`:
  - `C` — color palette (`C.bg`, `C.card`, `C.primary`, `C.green`, `C.red`, `C.amber`, `C.purple`, `C.cyan`, `C.text`, `C.muted`, `C.border`)
  - `R` — border radii (`R.sm`, `R.md`, `R.lg`, `R.xl`, `R.full`)
- The app uses a **dark theme only** — no light mode.
- Do not hardcode hex colors or numeric radii inline; always reference `C` and `R`.

### Component Guidelines

- One component per file.
- Props type is named `Props` and defined as a local `type Props = { ... }`.
- Destructure props in the function signature.
- Reusable primitives live in `src/components/`: `Card`, `StatCard`, `ProgressBar`, `ScreenHeader`, `BackHeader`.
- Use existing primitives before creating new ones.

### Data & State

- All data is currently mock/hardcoded in `src/data/*.ts`. Do not move data to a different location unless adding real API calls.
- For persistent state, use the `useStorage<T>(key, initialValue)` hook from `src/hooks/useStorage.ts`. It returns `{ value, set, loaded }`.
- Storage keys are defined in `src/services/storage.ts` under the `KEYS` constant (`AUTH`, `PROFILE`, `WEIGHT_LOG`, `FOOD_LOG`). Add new keys there.
- When adding a new data entity, define its TypeScript interface in `src/types/index.ts`.

### TypeScript

- Strict mode is enabled — no `any`, no implicit `any`.
- All shared interfaces go in `src/types/index.ts`.
- Use `type` for simple shapes; `interface` when extension is expected.

---

## Web App (`client/`)

### Framework & Runtime

| Concern | Technology |
|---|---|
| Framework | React 19 |
| Build tool | Vite 8 |
| Routing | React Router DOM 7 |
| Language | TypeScript ~5.9 |
| Theme | localStorage-based dark/light attribute on `document.documentElement` |

### Directory Layout

```
client/src/
├── App.tsx              # Route definitions
├── components/          # Shared UI components
├── hooks/               # e.g. useLocalStorageState
├── layout/              # MainLayout, Navbar, Footer, DashboardLayout
└── pages/               # One folder per route feature
    ├── Home/
    ├── Dashboard/
    ├── Calories/
    ├── Weight/
    ├── Training/
    └── ...              # (16+ feature pages)
```

- Each page folder contains its own component and sub-section components.
- Layout wrappers are in `layout/`; never inline layout logic in page components.

---

## Naming Conventions

| Artifact | Convention | Example |
|---|---|---|
| React components | PascalCase | `StatCard.tsx`, `ProgressBar.tsx` |
| Hooks | camelCase prefixed `use` | `useStorage.ts` |
| Utilities / services | camelCase | `storage.ts`, `dashboardData.ts` |
| Route files (Expo Router) | kebab-case | `forgot-password.tsx` |
| Route group folders | lowercase with parens | `(auth)/`, `(tabs)/` |
| Constants | SCREAMING_SNAKE_CASE | `KEYS.AUTH` |
| TypeScript types/interfaces | PascalCase | `UserProfile`, `WeightEntry` |
| Props type | `Props` (local alias) | `type Props = { ... }` |

---

## Language & Copy

- All user-facing strings are in **Bulgarian**.
- Code identifiers, comments, and file names are in **English**.
- Do not mix languages within the same layer (no Bulgarian variable names, no English UI text).

---

## What Not To Do

- Do not install new dependencies without flagging it — justify any addition.
- Do not add Redux, Zustand, MobX, or any global state library unless explicitly requested.
- Do not use NativeWind, Tailwind, or any CSS-in-JS library in the mobile app.
- Do not hardcode colors or spacing values; use `C` and `R` from `theme.ts`.
- Do not create a backend implementation in `server/` unless explicitly asked.
- Do not generate English UI text.
- Do not generate `any` types.
- Do not create new shared components if an existing one in `src/components/` already covers the use case.
