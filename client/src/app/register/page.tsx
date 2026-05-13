"use client";

import GuestRoute from "@/src/components/GuestRoute";
import Register from "@/src/views/Register/Register";

export default function RegisterPage() {
  return (
    <GuestRoute>
      <Register />
    </GuestRoute>
  );
}

