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
+-- web/      Unified full-stack app — Next.js 15 web UI + /api/* REST endpoints + Server Actions
+-- mobile/   Mobile app — Expo 54 + React Native 0.81
```

**Important:** `web/` is the primary and production-intended app. It contains both the web frontend and the backend API. Make all backend changes in `web/src/app/api/` and `web/src/lib/server/`.

---

## Unified App (`web/`)

### Framework & Runtime

| Concern | Technology |
|---|---|
| Framework | Next.js 15 App Router |
| UI | React 19 |
| Language | TypeScript 5.9 |
| Styling | Tailwind CSS v4 (globals.css) + legacy `fitlife-styles-v2.css` for existing views |
| Backend logic | `src/lib/server/` (auth, JWT, repositories, storage, validation) |
| Database | Drizzle ORM + Neon PostgreSQL (`src/db/`) |
| Server Actions | `src/app/actions/` (primary web ↔ backend channel) |
| REST API | `src/app/api/` (for Expo mobile app and legacy web fallback) |
| Deployment | Netlify with `@netlify/plugin-nextjs` |

### Directory Layout

```text
web/
+-- src/
|   +-- app/
|   |   +-- api/          REST API route handlers (35+ endpoints)
|   |   +-- actions/      Server Actions (auth, profile, catalog, progress)
|   |   +-- [page]/       Web UI pages (page.tsx wrappers)
|   +-- db/               Drizzle schema, DB connection, seed scripts
|   +-- lib/
|   |   +-- server/       Backend logic: auth, JWT, repositories, storage, validation
|   |   +-- (other)       Frontend utilities: calculators, label maps
|   +-- views/            Feature view implementations and section components
|   +-- layout/           MainLayout, DashboardLayout, Navbar, Footer
|   +-- components/       Shared UI and route guards
|   +-- context/          AuthContext and ThemeContext
|   +-- hooks/            Feature data hooks and local storage hook
|   +-- services/         REST API client modules (used by mobile and legacy web calls)
+-- drizzle/              Generated SQL migration files
+-- drizzle.config.ts     Drizzle Kit configuration
+-- public/               Static assets and global stylesheet (fitlife-styles-v2.css)
+-- next.config.ts
+-- netlify.toml
```

### Communication Conventions

- **Web client → backend**: Prefer Server Actions from `src/app/actions/`.
- **Mobile → backend**: REST API routes in `src/app/api/`.
- **Existing web service calls** in `src/services/*Api.ts` use same-origin `/api/*` fetch (no base URL); these are a valid fallback while Server Actions cover more flows.
- Do **not** add a new `NEXT_PUBLIC_API_BASE_URL` reference for web-only calls — it is reserved for the Expo mobile app.

### Authentication Model

FitLife uses a **dual-layer auth** strategy so both the web app and the mobile app can share the same backend:

| Layer | Web client | Mobile client |
|---|---|---|
| Primary login action | `loginAction()` — Server Action | `authApi.login()` — REST |
| Token storage | httpOnly cookie (`fitlife-token`) set by Server Action | AsyncStorage (bearer token) |
| Session restore | `AuthContext` reads localStorage token → calls `/api/auth/me` | `AuthContext` reads AsyncStorage → calls `/api/auth/me` |
| Logout | `logoutAction()` clears cookie + `clearAuth()` clears localStorage | `authApi.logout()` + clear AsyncStorage |
| SSR protection | `src/middleware.ts` verifies httpOnly cookie before rendering protected pages | Not applicable |
| API auth | `requireAuth()` in each route handler validates `Authorization: Bearer <token>` | Same — bearer token in header |

**Rules:**
- `loginAction` / `registerAction` / `logoutAction` / `setAuthCookieAction` are the Server Actions that manage the httpOnly cookie. Call them from web client components.
- REST routes (`/api/auth/*`) remain unchanged for mobile clients.
- Never read or write `JWT_SECRET` outside `src/lib/server/jwt.ts` and `src/middleware.ts`.
- Do not store the JWT in a plain (non-httpOnly) cookie in new code.

### Backend Conventions

- API route handlers live in `src/app/api/**/route.ts`.
- Auth helpers live in `src/lib/server/`:
  - `jwt.ts` — token signing and verification.
  - `require-auth.ts` — `requireAuth()` validates Bearer token from the `Authorization` header.
  - `auth.ts` — login, register, forgotPassword, resetPassword, getUserFromToken.
- Database access goes through typed repository modules in `src/lib/server/repositories/`.
- Admin endpoints must enforce the admin role via `requireAuth()` + role check.
- Never hardcode secrets. Use environment variables as documented in `.env.example`.

### Tailwind CSS

- **Tailwind CSS v4** is the configured styling system.
  - Plugin: `@tailwindcss/postcss` in `postcss.config.mjs`.
  - Base import: `@import "tailwindcss"` in `src/app/globals.css`.
  - Custom theme tokens (`--color-brand`, `--color-surface`, etc.) defined in the `@theme` block in `globals.css`.
- **New and updated components** use Tailwind utility classes (e.g., `LoadingScreen`, `CTABanner`, `Team`, `StatsBand`, `Login`).
- **Existing CSS-heavy views** (`src/views/`) retain the legacy `fitlife-styles-v2.css` loaded via `<link>` in `layout.tsx`; migrate to Tailwind progressively without breaking the UI.
- Do not add an explicit `tailwind.config.js` — Tailwind v4 uses `postcss.config.mjs` + `globals.css` instead.

### Client Scripts

```bash
cd web
npm install
npm run dev          # http://localhost:3000 (web + /api/*)
npm run build
npm run typecheck
npm run db:generate
npm run db:migrate
npm run db:seed
npm run db:seed:full  # all catalogs + 10K rows
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
| API config | `src/config/app.config.ts` — resolves `NEXT_PUBLIC_API_BASE_URL` |

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
|   +-- config/              API configuration
|   +-- context/             AuthContext
|   +-- services/            API service wrappers (calls web/ /api/* routes)
|   +-- types/               Shared TypeScript interfaces
|   +-- theme.ts             Design tokens (`C`, `R`)
```

### Mobile Conventions

- Route files live under `mobile/app/`; use Expo Router group folders.
- Use `StyleSheet.create()` for styles; import tokens from `src/theme.ts` (`C`, `R`).
- Do not add NativeWind, Tailwind, or another styling library to the mobile app.
- Use existing primitives in `src/components/` before creating new shared components.
- Put shared interfaces in `src/types/index.ts`.

### Mobile Scripts

```bash
cd mobile
npm install
npm run start         # Expo dev server (a=Android, i=iOS, w=web)
npm run typecheck
npx expo export --platform web   # Expo web export for static deployment
```

---

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
- Tailwind CSS v4 is configured in `web/`; do not add it to `mobile/`.
- Do not add global state libraries unless explicitly requested.

---

## Safety Rules

- The backend is `web/src/app/api/` and `web/src/lib/server/`. There is no separate `server/` directory.
- Do not hardcode secrets, API keys, JWT secrets, database URLs, or email credentials.
- Do not revert unrelated user changes.
- Do not use `any` types unless there is no reasonable typed alternative.
- Keep changes scoped to the requested app/module.
- When changing API contracts, update both the `web/src/app/api/` route and affected `mobile/src/services/` types.
