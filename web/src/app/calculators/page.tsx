"use client";

import PrivateRoute from "@/src/components/PrivateRoute";
import Calculators from "@/src/views/Calculators/Calculators";

export default function CalculatorsPage() {
  return (
    <PrivateRoute>
      <Calculators />
    </PrivateRoute>
  );
}

