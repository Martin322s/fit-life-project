# Fit Life

Fit Life is a fitness tracking project with three parts:

```text
fit-life-project/
|-- client/   Web app, React + Vite
|-- mobile/   Mobile app, Expo + React Native
`-- server/   API/server app, Next.js + database scripts
```

This guide shows the simplest way to start the app locally after cloning the project.

## Requirements

Install these first:

- Node.js 18 or newer
- npm
- Expo Go on your phone, if you want to run the mobile app on a real device
- A PostgreSQL/Neon database connection for the server

## 1. Clone the Project

```powershell
git clone <repository-url>
cd fit-life-project
```

## 2. Start the Server

Open a terminal in the main project folder and run:

```powershell
cd server
npm install
copy .env.example .env.local
```

Open `server/.env.local` and fill in the real values, especially the database connection.

Then prepare the database:

```powershell
npm run db:migrate
npm run db:seed
```

If you need to seed only specific data, you can run these instead:

```powershell
npm run db:seed:diets
npm run db:seed:recipes
npm run db:seed:products
npm run db:seed:training-plans
npm run db:seed:challenges
```

Start the server:

```powershell
npm run dev
```

Server URL:

```text
http://localhost:3001
```

Keep this terminal open.

## 3. Start the Web Client

Open a second terminal in the main project folder and run:

```powershell
cd client
npm install
copy .env.example .env
npm run dev
```

Web client URL:

```text
http://localhost:5173
```

Keep this terminal open.

## 4. Start the Mobile App

Open a third terminal in the main project folder and run:

```powershell
cd mobile
npm install
copy .env.example .env
npm run start
```

Expo will start. You can then:

```text
a  run on Android emulator
i  run on iOS simulator, macOS only
w  run in web preview
```

You can also scan the QR code with Expo Go on your phone.

For Android emulator, the mobile API URL usually needs to be:

```env
EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:3001
```

For a real phone, use your computer's local network IP instead:

```env
EXPO_PUBLIC_API_BASE_URL=http://YOUR_LOCAL_IP:3001
```

Example:

```env
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.50:3001
```

## Quick Commands

After the first setup, you usually only need these three terminals:

```powershell
cd server
npm run dev
```

```powershell
cd client
npm run dev
```

```powershell
cd mobile
npm run start
```

## Useful Server Commands

```powershell
npm run db:migrate
npm run db:seed
npm run db:seed:diets
npm run db:seed:recipes
npm run db:seed:products
npm run db:seed:training-plans
npm run db:seed:challenges
```

Backup commands:

```powershell
npm run backup:db
npm run backup:clean
```

## Notes

- Do not commit real `.env` files.
- The server runs on `http://localhost:3001` in development.
- The web client runs on `http://localhost:5173`.
- The mobile app is started with Expo from the `mobile/` folder.
- Production/deployment notes are in [DEPLOYMENT.md](./DEPLOYMENT.md).
