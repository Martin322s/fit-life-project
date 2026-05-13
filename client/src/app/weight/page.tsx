"use client";

import PrivateRoute from "@/src/components/PrivateRoute";
import Weight from "@/src/views/Weight/Weight";

export default function WeightPage() {
  return (
    <PrivateRoute>
      <Weight />
    </PrivateRoute>
  );
}

