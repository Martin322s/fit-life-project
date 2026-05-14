# FitLife Deployment Guide

FitLife is split into three deployable surfaces:

- `server/` — Next.js 16 App Router API backed by Neon PostgreSQL and Drizzle ORM.
- `client/` — Next.js 15 App Router web client.
- `mobile/` — Expo / React Native mobile app (Android APK via EAS Build).

All user-facing copy is in Bulgarian. Never commit real `.env` files.

---

## Environment Variables

### Server (`server/`)

Create `server/.env.local` from `server/.env.example`:

```env
JWT_SECRET=strong-random-secret-min-32-chars
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
CLIENT_URL=https://fitlife-com.netlify.app
SERVER_URL=https://fit-life-api.netlify.app
MOBILE_URL=
CORS_ALLOWED_ORIGINS=
EMAILJS_SERVICE_ID=
EMAILJS_TEMPLATE_ID=
EMAILJS_PUBLIC_KEY=
EMAILJS_ACCESS_TOKEN=
CONTACT_EMAILJS_SERVICE_ID=
CONTACT_EMAILJS_TEMPLATE_ID=
CONTACT_EMAILJS_PUBLIC_KEY=
CONTACT_EMAILJS_ACCESS_TOKEN=
CONTACT_TO_EMAIL=your@email.com

# ─── Cloudflare R2 object storage ────────────────────────────────────────────
R2_ACCOUNT_ID=
R2_BUCKET_NAME=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_PUBLIC_URL=
```

**CORS note:** `CLIENT_URL` must exactly match the deployed web client origin.
Any origin not listed in `CLIENT_URL`, `SERVER_URL`, `MOBILE_URL`, or `CORS_ALLOWED_ORIGINS`
will be blocked by the CORS middleware in `server/middleware.ts`.

### Web Client (`client/`)

Create `client/.env` from `client/.env.example`:

```env
NEXT_PUBLIC_API_BASE_URL=https://fit-life-api.netlify.app
```

In development this should point to your local server:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

`NEXT_PUBLIC_` prefix makes the variable available in both server components and
client components. It is read by `client/src/services/apiConfig.ts`.

### Mobile (`mobile/`)

The API base URL is resolved automatically in `mobile/src/config/app.config.ts`.
In development it uses the Expo `debuggerHost` to reach your local server.
In production builds it uses the hardcoded production URL. No `.env` file is
required unless you need to override the production URL.

---

## Local Development

### Requirements

- Node.js 18+
- A Neon (or local) PostgreSQL database
- Expo Go on a physical device (optional)

### 1. Install dependencies

```powershell
cd server && npm install
cd ../client && npm install
cd ../mobile && npm install
```

### 2. Configure the server

```powershell
cd server
copy .env.example .env.local   # Windows
# cp .env.example .env.local    # macOS / Linux
```

Edit `server/.env.local` and fill in `DATABASE_URL` and `JWT_SECRET`.

### 3. Prepare the database

```powershell
cd server
npm run db:migrate
npm run db:seed
```

Seed the global content catalog (recipes, products, training plans, diets, challenges):

```powershell
npm run db:seed:recipes
npm run db:seed:diets
npm run db:seed:training-plans
npm run db:seed:products
npm run db:seed:challenges
```

Optionally seed 10,000+ rows for load testing:

```powershell
npm run db:seed:catalog-load
```

### 4. Start the development servers

```powershell
# Terminal 1 — API server on http://localhost:3001
cd server && npm run dev

# Terminal 2 — Web client on http://localhost:3000
cd client && npm run dev

# Terminal 3 — Mobile app (optional)
cd mobile && npm run start
```

Press `a` for Android emulator, `i` for iOS simulator, or scan the QR code with Expo Go.

---

## Production Deployment

### Server (Netlify)

The server deploys as a Next.js app on Netlify using `@netlify/plugin-nextjs`.

1. Create a Neon PostgreSQL database.
2. In Netlify → **Site configuration → Environment variables**, add all server
   environment variables listed above (especially `DATABASE_URL`, `JWT_SECRET`,
   `CLIENT_URL`, `R2_*`).
3. Set the **Base directory** to `server/` and **Build command** to `npm run build`.
4. After the first deploy, run the database migrations and seed from a local
   environment pointing at the production database:
   ```powershell
   cd server
   npm run db:migrate
   npm run db:seed
   npm run db:seed:catalog-load   # seeds 10,000 rows + performance indexes
   ```

**Required Netlify environment variables for `fit-life-api` site:**

| Variable | Value |
|---|---|
| `JWT_SECRET` | A strong random string (≥ 32 chars) |
| `DATABASE_URL` | Neon connection string |
| `CLIENT_URL` | `https://fitlife-com.netlify.app` |
| `SERVER_URL` | `https://fit-life-api.netlify.app` |
| `R2_ACCOUNT_ID` | Cloudflare account ID |
| `R2_BUCKET_NAME` | R2 bucket name |
| `R2_ACCESS_KEY_ID` | R2 access key |
| `R2_SECRET_ACCESS_KEY` | R2 secret key |
| `R2_PUBLIC_URL` | R2 public URL base |
| `EMAILJS_*` | EmailJS credentials for password reset |
| `CONTACT_EMAILJS_*` | EmailJS credentials for contact form |

### Web Client (Netlify)

The client deploys as a Next.js app on Netlify using `@netlify/plugin-nextjs`.

1. In Netlify → **Site configuration → Environment variables**, add:
   - `NEXT_PUBLIC_API_BASE_URL=https://fit-life-api.netlify.app`
2. Set the **Base directory** to `client/` and **Build command** to `npm run build`.
3. Netlify handles routing automatically via `@netlify/plugin-nextjs`; no
   `_redirects` file or manual rewrite rules are needed.

**Required Netlify environment variables for `fitlife-com` site:**

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | `https://fit-life-api.netlify.app` |

### Mobile (EAS Build)

1. Install the EAS CLI: `npm install -g eas-cli`
2. Log in: `eas login`
3. Build an Android APK:
   ```powershell
   cd mobile
   eas build --platform android --profile preview
   ```
4. The build URL and QR code are shown in the EAS dashboard and linked in `README.md`.

---

## Production Smoke Test

After deploying both Netlify sites:

1. Register a new user at the live web URL.
2. Log in.
3. Refresh `/dashboard` — confirm session is restored via `/api/auth/me`.
4. Log out.
5. Use "Forgot password" — confirm the reset email arrives and the link uses the
   correct `CLIENT_URL` domain.
6. Open `/reset-password?token=...` and reset the password.
7. Log in with the new password.
8. Open Dashboard, Calories, Weight, Recipes, Diets, Training Plans, Products,
   Challenges, Calculators, Profile.
9. Confirm the Admin route returns 403 for a regular user.
10. Open the Admin panel as an admin — confirm stats and user list load.
11. Open the browser Network tab — no requests should go to `localhost`.
12. Submit the Contact form — confirm EmailJS delivery.

---

## Backup System

Automated daily backups run via GitHub Actions (`.github/workflows/project-backup.yml`).

```
Schedule: 03:00 UTC every day
Runner:   ubuntu-latest
Output:   pg_dump → gzip → R2 private backup bucket
          R2 app bucket → zip → R2 private backup bucket
Retention: 7 most-recent daily, 5 most-recent weekly, 12 most-recent monthly
```

See [BACKUP.md](./BACKUP.md) for full details and restore instructions.

### Required GitHub Secrets for backup

| Secret | Value |
|---|---|
| `DATABASE_URL` | Neon production connection string |
| `R2_ACCOUNT_ID` | Cloudflare account ID |
| `R2_ACCESS_KEY_ID` | R2 API token key ID |
| `R2_SECRET_ACCESS_KEY` | R2 API token secret |
| `R2_APP_BUCKET_NAME` | App media bucket (`fitlife-media`) |
| `R2_BACKUP_BUCKET_NAME` | Private backup bucket (`fitlife-backups`) |

---

## Current Known Limitations

- Admin panel is web-only; the mobile app has no admin interface.
- Mobile stores JWT tokens in AsyncStorage (a TODO to migrate to Expo SecureStore
  before a store release).
- `pg_trgm`-based full-text search indexes (created by `db:seed:catalog-load`)
  require the `pg_trgm` extension. Neon enables this by default. On a self-hosted
  PostgreSQL instance, run `CREATE EXTENSION IF NOT EXISTS pg_trgm;` once before
  running `db:seed:catalog-load`.
