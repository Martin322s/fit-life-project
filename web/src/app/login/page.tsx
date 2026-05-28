"use client";

import GuestRoute from "@/src/components/GuestRoute";
import Login from "@/src/views/Login/Login";

export default function LoginPage() {
  return (
    <GuestRoute>
      <Login />
    </GuestRoute>
  );
}

