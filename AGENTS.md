# AGENTS.md - fit-life-project

AI agent instructions for the fit-life-project codebase. Read this before generating code.

---

## App Context

**Fit Life** is a full-stack fitness and nutrition tracking application for Bulgarian-speaking users. The UI language is **Bulgarian** throughout: all visible text, labels, validation messages, and page copy must be in Bulgarian. Code identifiers, file names, and comments are written in English.

Core features include authentication, calorie and meal tracking, hydration, weight/progress logging, workouts, goals, recipes, diet guides, training plans, challenges, nutrition products, calculators, profile management, contact messages, password reset, and admin management.

---

## Repository Structure

```text
fit-life-project/
+-- client/   Web frontend - Next.js 15 + React 19
+-- server/   Backend API - Next.js 16 route handlers + PostgreSQL + Drizzle
+-- mobile/   Mobile app - Expo 54 + React Native 0.81
```

All three apps are active. Do not assume `server/` is empty or that work is mobile-only. Before editing, inspect the relevant app and follow its existing patterns.

---

## Web Client (`client/`)

### Framework & Runtime

| Concern | Technology |
|---|---|
| Framework | Next.js 15 App Router |
| UI | React 19 |
| Language | TypeScript 5.9 |
| Styling | Existing CSS files/public stylesheet; Tailwind CSS 4 is installed as a dependency |
| Deployment | Netlify with `@netlify/plugin-nextjs` |
| API config | `src/services/apiConfig.ts` and `NEXT_PUBLIC_API_BASE_URL` |

### Directory Layout

```text
client/
+-- src/
|   +-- app/          Next.js App Router route folders and `page.tsx` wrappers
|   +-- views/        Feature view implementations and section components
|   +-- layout/       MainLayout, DashboardLayout, Navbar, Footer, Logo
|   +-- components/   Shared UI and route guards
|   +-- context/      AuthContext and ThemeContext
|   +-- hooks/        Feature data hooks and local storage hook
|   +-- services/     API client modules
|   +-- lib/          Utility helpers, calculators, label maps
|   +-- assets/       Imported client assets
+-- public/           Public assets and global stylesheet
+-- next.config.ts
+-- netlify.toml
```

### Client Conventions

- Routes live under `src/app/<route>/page.tsx`.
- Keep route files thin when possible; put feature UI in `src/views/<Feature>/`.
- Use existing service modules in `src/services/` for API calls.
- Use existing feature hooks in `src/hooks/` before creating new data-fetching logic.
- Use `MainLayout`, `DashboardLayout`, and existing route guards instead of inlining layout/auth logic.
- The app uses `AuthContext` and `ThemeContext`; do not add Redux, Zustand, MobX, or another global state library unless explicitly requested.
- Tailwind is installed, but do not rewrite existing CSS to Tailwind unless the task specifically asks for it.

### Client Scripts

```powershell
cd client
npm install
npm run dev      # http://localhost:3000
npm run build
npm run start
```

---

## Server API (`server/`)

### Framework & Runtime

| Concern | Technology |
|---|---|
| Framework | Next.js 16 App Router route handlers |
| Language | TypeScript |
| Database | PostgreSQL / Neon |
| ORM | Drizzle ORM |
| Auth | JWT + bcryptjs |
| Email | EmailJS for contact and password reset flows |
| Local port | `3001` via `npm run dev` |

### Directory Layout

```text
server/
+-- app/api/          REST endpoints
+-- db/schema.ts      Drizzle schema
+-- db/seed*.ts       Seed scripts
+-- drizzle/          Generated migrations
+-- lib/              Auth, repositories, validation, storage helpers
+-- middleware.ts     CORS / origin-whitelist only (not JWT)
+-- scripts/backups/  Database backup scripts
```

### Server Conventions

- API routes live in `app/api/**/route.ts`.
- Keep database access in repository/helper modules under `lib/` where that pattern already exists.
- Update `db/schema.ts` for schema changes and generate migrations with Drizzle when required.
- Use existing auth helpers:
  - `lib/jwt.ts` — token signing and verification.
  - `lib/require-auth.ts` — `requireAuth()` extracts and validates the JWT Bearer
    token from the `Authorization` header; returns a typed payload or a 401/403
    response. Use this in every protected route handler.
  - `lib/auth.ts` — higher-level login/register/forgot-password business logic.
  - `middleware.ts` handles **CORS / origin whitelist only** — it does not validate
    JWT tokens. Do not rely on it for authorization.
- Admin endpoints must enforce the admin role via `requireAuth()` + role check.
- Do not bypass validation helpers when a feature already has validation modules.
- Never commit real secrets. Use `.env.example` for documented variable names only.

### Server Scripts

```powershell
cd server
npm install
npm run dev          # http://localhost:3001
npm run build
npm run db:generate
npm run db:migrate
npm run db:seed
```

---

## Mobile App (`mobile/`)

### Framework & Runtime

| Concern | Technology |
|---|---|
| Framework | Expo 54 / React Native 0.81 |
| Language | TypeScript 5.9 |
| Routing | Expo Router 6 |
| Persistence | AsyncStorage |
| Styling | React Native `StyleSheet.create()` + centralized theme tokens |
| API config | `src/config/app.config.ts` |

### Directory Layout

```text
mobile/
+-- app/                     Expo Router pages and route groups
|   +-- (auth)/              login, register, forgot-password, reset-password
|   +-- (tabs)/              dashboard, calories, weight, training, more
|   +-- _layout.tsx          Root layout
|   +-- index.tsx            Splash/redirect guard
+-- src/
|   +-- components/          Shared React Native UI primitives
|   +-- config/              App/API configuration
|   +-- context/             AuthContext
|   +-- data/                Local/static data where still used
|   +-- hooks/               Custom hooks
|   +-- services/            API and platform service wrappers
|   +-- types/               Shared TypeScript interfaces
|   +-- theme.ts             Design tokens (`C`, `R`)
+-- assets/images/           Icons and splash assets
```

### Mobile Conventions

- Route files live under `mobile/app/`; use Expo Router group folders like `(auth)` and `(tabs)`.
- Use `StyleSheet.create()` for styles.
- Import design tokens from `src/theme.ts`:
  - `C` for colors.
  - `R` for border radii.
- Do not add NativeWind, Styled Components, Tailwind, or another styling library to the mobile app unless explicitly requested.
- Use existing primitives in `src/components/` before creating new shared components.
- Keep props type aliases named `Props` in component files and destructure props in the function signature.
- Put shared interfaces in `src/types/index.ts`.

### Mobile Scripts

```powershell
cd mobile
npm install
npm run start
npm run typecheck
```

---

## Naming Conventions

| Artifact | Convention | Example |
|---|---|---|
| React components | PascalCase | `StatCard.tsx`, `ProgressBar.tsx` |
| Hooks | camelCase prefixed with `use` | `useDashboardData.ts` |
| Utilities/services | camelCase | `apiConfig.ts`, `recipeLabels.ts` |
| Next route folders | kebab-case | `forgot-password/page.tsx` |
| Expo route files | kebab-case | `training-plans.tsx` |
| Expo route groups | lowercase with parentheses | `(auth)`, `(tabs)` |
| Constants | SCREAMING_SNAKE_CASE | `API_BASE_URL` |
| Types/interfaces | PascalCase | `UserProfile`, `WeightEntry` |
| Local props alias | `Props` | `type Props = { ... }` |

---

## Language & Copy

- All user-facing strings must be in **Bulgarian**.
- Code identifiers, comments, and file names must be in English.
- Do not introduce English UI copy.
- Keep Bulgarian copy natural and consistent with the existing tone.

---

## Dependency Rules

- Do not install new dependencies without flagging and justifying the addition.
- Prefer existing libraries and local helpers before adding packages.
- Tailwind CSS is already installed in the web client, but not in the mobile app.
- Do not add global state libraries unless explicitly requested.

---

## Safety Rules

- Do not generate backend code in a different stack; the backend is already implemented in `server/`.
- Do not hardcode secrets, API keys, JWT secrets, database URLs, or email credentials.
- Do not revert unrelated user changes.
- Do not use `any` types unless there is no reasonable typed alternative and the choice is explained.
- Keep changes scoped to the requested app/module.
- When changing API contracts, update both the relevant server endpoint and affected client/mobile service types.
