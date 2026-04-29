import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fit Life API",
  description: "Fit Life backend API",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
