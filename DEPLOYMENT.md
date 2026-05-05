# FitLife Deployment Guide

FitLife is split into three deployable surfaces:

- `server/` - Next.js App Router API backed by Neon PostgreSQL and Drizzle ORM.
- `client/` - React + Vite single page web app.
- `mobile/` - Expo / React Native app.

All user-facing product copy is Bulgarian. Never commit real `.env` files.

## Environment Variables

Server local example, `server/.env.local`:

```env
JWT_SECRET=local-dev-secret
DATABASE_URL=postgresql://...
CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:3000
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
CONTACT_TO_EMAIL=
```

Server production example:

```env
JWT_SECRET=strong-production-secret
DATABASE_URL=postgresql://...
CLIENT_URL=https://fitlife-web.example.com
SERVER_URL=https://fitlife-api.example.com
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
CONTACT_TO_EMAIL=m.sofroniev12@gmail.com
```

Client local example, `client/.env`:

```env
VITE_API_BASE_URL=http://localhost:3000
```

Client production example:

```env
VITE_API_BASE_URL=https://fitlife-api.example.com
```

Mobile local examples:

```env
EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:3000
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000
EXPO_PUBLIC_API_BASE_URL=http://YOUR_LAN_IP:3000
```

Mobile production example:

```env
EXPO_PUBLIC_API_BASE_URL=https://fitlife-api.example.com
```

## Local Setup

Install dependencies:

```bash
cd server && npm install
cd ../client && npm install
cd ../mobile && npm install
```

Prepare the database:

```bash
cd server
npm run db:migrate
npm run db:seed
npm run db:seed:recipes
npm run db:seed:diets
npm run db:seed:products
npm run db:seed:training-plans
npm run db:seed:challenges
```

Run locally:

```bash
cd server && npm run start
cd client && npm run dev
cd mobile && npm run start
```

The current local production-style server command is `npm run start` on port `3000` after `npm run build`. If you use `npm run dev`, check `server/package.json` for the configured port and align `VITE_API_BASE_URL`.

## Production Deployment

Server:

1. Create a Neon PostgreSQL database.
2. Configure all server environment variables in the hosting provider.
3. Run `npm install`.
4. Run `npm run db:migrate`.
5. Run seed scripts only when the production database needs initial global catalog data.
6. Run `npm run build`.
7. Start with `npm run start`.

Client:

1. Configure `VITE_API_BASE_URL` to the deployed server URL.
2. Run `npm install`.
3. Run `npm run build`.
4. Deploy `client/dist`.
5. For Netlify, `client/public/_redirects` contains `/* /index.html 200` for SPA routing.
6. For Vercel/static hosts, configure an equivalent fallback rewrite to `/index.html`.

Mobile:

1. Configure `EXPO_PUBLIC_API_BASE_URL`.
2. Run `npm install`.
3. Run `npm run lint`.
4. Run `npm run typecheck`.
5. Run `npm run start` for Expo testing.

## URL Behavior

- Password reset links are generated from `CLIENT_URL`.
- The web app calls the API through `VITE_API_BASE_URL`.
- The mobile app calls the API through `EXPO_PUBLIC_API_BASE_URL`, with local emulator fallbacks only for development.
- CORS is built from `CLIENT_URL`, `SERVER_URL`, `MOBILE_URL`, and `CORS_ALLOWED_ORIGINS`. Localhost origins are added only outside production.

## Production Smoke Test

- Register a new user.
- Login.
- Refresh `/dashboard` and confirm session restore through `/api/auth/me`.
- Logout.
- Request forgot password.
- Confirm the reset email link uses the deployed `CLIENT_URL`.
- Open `/reset-password?token=...` directly and reset the password.
- Login with the new password.
- Open Dashboard, Calories, Weight, Recipes, Diets, Training Plans, Products, Challenges, Calculators, Profile.
- Confirm Admin route is blocked for normal users.
- Confirm Admin APIs return `403` for non-admin JWTs.
- Check browser Network tab for no production calls to localhost.
- Submit Contact form and confirm EmailJS delivery.

## Current Product Notes

- The Settings tab/API was intentionally removed from the active app surface.
- Admin is implemented for web only.
- Mobile uses AsyncStorage for auth tokens with a TODO to move to Expo SecureStore before store release.
