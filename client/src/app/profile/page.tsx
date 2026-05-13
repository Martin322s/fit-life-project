"use client";

import PrivateRoute from "@/src/components/PrivateRoute";
import Profile from "@/src/views/Profile/Profile";

export default function ProfilePage() {
  return (
    <PrivateRoute>
      <Profile />
    </PrivateRoute>
  );
}

