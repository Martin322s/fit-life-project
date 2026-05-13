import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AuthProvider } from "@/src/context/AuthContext";
import { ThemeProvider } from "@/src/context/ThemeContext";

export const metadata: Metadata = {
  title: "FitLife — Твоята платформа за здравословен начин на живот",
  description:
    "Проследявай тегло, калории и хранене. Умни калкулатори, рецепти и персонализирани планове — всичко на едно място.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="bg">
      <head>
        <link rel="icon" href="/dumbbell.png" />
        <link rel="stylesheet" href="/fitlife-styles-v2.css" />
      </head>
      <body>
        <AuthProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
