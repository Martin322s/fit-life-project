# Fit Life

Fitness tracking app with three parts:

```
fit-life-project/
├── server/   API — Next.js + PostgreSQL
├── client/   Web app — React + Vite
└── mobile/   Mobile app — Expo + React Native
```

## Requirements

- Node.js 18+
- PostgreSQL / Neon database
- Expo Go on your phone (optional, for physical device testing)

---

## 1. Server

```powershell
cd server
npm install
copy .env.example .env.local
```

Edit `server/.env.local` and fill in the database connection string.

Prepare the database:

```powershell
npm run db:migrate
npm run db:seed
```

Start:

```powershell
npm run dev
```

Runs on `http://localhost:3001`

---

## 2. Web Client

```powershell
cd client
npm install
copy .env.example .env
npm run dev
```

Runs on `http://localhost:5173`

---

## 3. Mobile App

```powershell
cd mobile
npm install
npm run start
```

Press `a` for Android emulator, `i` for iOS simulator, `w` for browser, or scan the QR code with Expo Go.

The app connects to `localhost:3001` automatically. Android emulator uses `10.0.2.2:3001`.

---

## Hosted

- Web: https://fitlife-bg.netlify.app
- Android APK: https://expo.dev/accounts/martin13s18/projects/fit-life/builds/4d49c3a1-48dd-484b-bded-2e005690cbb3

## Download the Mobile App

Scan this QR code to download the Android APK directly to your phone.

<img src="mobile-app-qr.svg" alt="QR code for downloading the Fit Life Android app" style="display:block;width:min(520px,100%);height:auto;" />
