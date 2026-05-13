"use client";

import PrivateRoute from "@/src/components/PrivateRoute";
import Challenges from "@/src/views/Challenges/Challenges";

export default function ChallengesPage() {
  return (
    <PrivateRoute>
      <Challenges />
    </PrivateRoute>
  );
}

