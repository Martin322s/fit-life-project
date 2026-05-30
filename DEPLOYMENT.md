# FitLife Deployment Guide

FitLife is deployed as **two surfaces**:

1. `client/` — **Unified full-stack Next.js app** — serves the web UI and all `/api/*` REST endpoints from a single Netlify site. This is the primary deployment target.
2. `mobile/` — Expo mobile app — Expo Web export (capstone requirement) or Android APK via EAS Build (optional).

The `server/` directory is a legacy standalone API that is kept for reference. It is **not** the primary deployment.

All user-facing copy is in Bulgarian. Never commit real `.env` files.

---

## Architecture Summary

```
Netlify (single site: fitlife-com.netlify.app)
  └── client/ Next.js 15 app
       ├── Web pages  (/, /dashboard, /recipes, ...)
       ├── API routes (/api/auth/*, /api/meals/*, /api/recipes/*, ...)
       ├── Server Actions (auth, profile, catalog, progress)
       ├── Drizzle ORM  ──▶  Neon PostgreSQL
       └── AWS S3 SDK  ──▶  Cloudflare R2

Expo Web / EAS Build
  └── mobile/ app  ──HTTP──▶  https://fitlife-com.netlify.app/api/*
```

---

## Environment Variables

### Unified App (`client/.env`)

Copy `.env.example` from the project root to `client/.env` and fill in your values:

```env
# Database
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require

# Auth
JWT_SECRET=strong-random-secret-min-32-chars

# App URL — used in password-reset email links
APP_URL=https://fitlife-com.netlify.app

# Mobile API base URL — Expo reads this to reach /api/* routes
NEXT_PUBLIC_API_BASE_URL=https://fitlife-com.netlify.app

# EmailJS — password reset
EMAILJS_SERVICE_ID=
EMAILJS_TEMPLATE_ID=
EMAILJS_PUBLIC_KEY=
EMAILJS_ACCESS_TOKEN=

# EmailJS — contact form
CONTACT_EMAILJS_SERVICE_ID=
CONTACT_EMAILJS_TEMPLATE_ID=
CONTACT_EMAILJS_PUBLIC_KEY=
CONTACT_EMAILJS_ACCESS_TOKEN=
CONTACT_TO_EMAIL=your@email.com

# Cloudflare R2 object storage
R2_ACCOUNT_ID=
R2_BUCKET_NAME=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_PUBLIC_URL=
```

**Key variables explained:**

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Neon (or Postgres) connection string |
| `JWT_SECRET` | Shared secret for signing/verifying JWT tokens |
| `APP_URL` | Used to build password-reset links in emails |
| `NEXT_PUBLIC_API_BASE_URL` | Exposed to the Expo mobile app to reach `/api/*` routes |

### Mobile (`mobile/`)

The API base URL is resolved automatically in `mobile/src/config/app.config.ts`. In development it uses the Expo debugger host; in production it uses `NEXT_PUBLIC_API_BASE_URL`. No `.env` file is required.

---

## Local Development

### Requirements

- Node.js 18+
- Neon or local PostgreSQL database
- Expo Go (optional, for physical device)

### 1. Install dependencies

```bash
cd client && npm install
cd ../mobile && npm install
```

### 2. Configure the unified app

```bash
cd client
cp ../.env.example .env
# Edit .env — fill in DATABASE_URL, JWT_SECRET, APP_URL, etc.
```

For local development:

```env
APP_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

### 3. Prepare the database

```bash
cd client
npm run db:migrate
npm run db:seed
npm run db:seed:full   # seeds all catalogs + 10,000+ rows
```

### 4. Start development servers

```bash
# Terminal 1 — unified app on http://localhost:3000 (web + /api/*)
cd client && npm run dev

# Terminal 2 — mobile app (optional)
cd mobile && npm run start
```

Press `a` for Android emulator, `i` for iOS simulator, `w` for Expo web, or scan the QR code.

---

## Production Deployment

### Unified App — Netlify

The `client/` directory deploys as one Next.js Netlify site. Both the web UI and `/api/*` routes are served from this single deployment.

1. Create a Neon PostgreSQL database.
2. In Netlify → **Site configuration → Environment variables**, add all variables from the table above.
3. Set **Base directory** to `client/` and **Build command** to `npm run build`.
4. After first deploy, run migrations and seeds pointing at the production DB:
   ```bash
   cd client
   npm run db:migrate
   npm run db:seed:full
   ```

**Required Netlify environment variables:**

| Variable | Value |
|---|---|
| `DATABASE_URL` | Neon production connection string |
| `JWT_SECRET` | Strong random string (≥ 32 chars) |
| `APP_URL` | `https://fitlife-com.netlify.app` |
| `NEXT_PUBLIC_API_BASE_URL` | `https://fitlife-com.netlify.app` |
| `R2_ACCOUNT_ID` | Cloudflare account ID |
| `R2_BUCKET_NAME` | R2 bucket name |
| `R2_ACCESS_KEY_ID` | R2 access key |
| `R2_SECRET_ACCESS_KEY` | R2 secret key |
| `R2_PUBLIC_URL` | R2 public URL base |
| `EMAILJS_*` | EmailJS credentials for password reset |
| `CONTACT_EMAILJS_*` | EmailJS credentials for contact form |

### Mobile — Expo Web Export (capstone-required)

Expo web export produces a static site that can be deployed to Netlify, Vercel, or GitHub Pages:

```bash
cd mobile
npm install
npx expo export --platform web
# Output folder: mobile/dist/
```

Deploy the `dist/` folder to Netlify:
- In Netlify, create a new site from the `mobile/dist/` folder, or drag-and-drop it in the Netlify UI.
- No build command is needed — it's a pre-built static export.

The Expo web export connects to the same `NEXT_PUBLIC_API_BASE_URL` API as the native app.

### Mobile — Android APK (optional bonus)

EAS Build creates a distributable `.apk` for Android sideloading:

```bash
npm install -g eas-cli
eas login
cd mobile
eas build --platform android --profile preview
```

The build URL and QR code appear in the EAS dashboard and are linked in `README.md`.

---

## Production Smoke Test

After deploying the unified Netlify site:

1. Register a new user at the live web URL.
2. Log in — session token is stored as an httpOnly cookie (Server Action) or localStorage (REST fallback).
3. Refresh `/dashboard` — confirm session is restored.
4. Log out.
5. Use "Forgot password" — confirm the reset email arrives and the link uses the correct `APP_URL` domain.
6. Open `/reset-password?token=...` and reset the password.
7. Log in with the new password.
8. Open Dashboard, Calories, Weight, Recipes, Diets, Training Plans, Products, Challenges, Profile.
9. Confirm the Admin route returns 403 for a regular user.
10. Open the Admin panel as admin — confirm stats and user list load.
11. Check the browser Network tab — no requests should go to `localhost`.
12. Submit the Contact form — confirm EmailJS delivery.

---

## Backup System

Automated daily backups run via GitHub Actions (`.github/workflows/project-backup.yml`).

```
Schedule: 03:00 UTC every day
Runner:   ubuntu-latest
Output:   pg_dump → gzip → Cloudflare R2 private backup bucket
          R2 app bucket → zip → Cloudflare R2 private backup bucket
Retention: 7 daily, 5 weekly, 12 monthly
```

See [BACKUP.md](./BACKUP.md) for full details and restore instructions.

### Required GitHub Secrets for backup

| Secret | Value |
|---|---|
| `DATABASE_URL` | Neon production connection string |
| `R2_ACCOUNT_ID` | Cloudflare account ID |
| `R2_ACCESS_KEY_ID` | R2 API token key |
| `R2_SECRET_ACCESS_KEY` | R2 API token secret |
| `R2_APP_BUCKET_NAME` | App media bucket (`fitlife-media`) |
| `R2_BACKUP_BUCKET_NAME` | Private backup bucket (`fitlife-backups`) |

---

## Known Limitations

- Admin panel is web-only; the mobile app has no admin interface.
- Mobile stores JWT in AsyncStorage (migrate to Expo SecureStore before a store release).
- `pg_trgm` full-text search indexes require the extension (enabled by default on Neon; on self-hosted PostgreSQL run `CREATE EXTENSION IF NOT EXISTS pg_trgm;` once).
- The `server/` directory is kept for reference but is not deployed separately in the production-intended architecture.
