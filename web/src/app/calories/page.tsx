"use client";

import PrivateRoute from "@/src/components/PrivateRoute";
import Calories from "@/src/views/Calories/Calories";

export default function CaloriesPage() {
  return (
    <PrivateRoute>
      <Calories />
    </PrivateRoute>
  );
}

