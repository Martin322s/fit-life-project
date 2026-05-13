"use client";

import PrivateRoute from "@/src/components/PrivateRoute";
import Diets from "@/src/views/Diets/Diets";

export default function DietsPage() {
  return (
    <PrivateRoute>
      <Diets />
    </PrivateRoute>
  );
}

