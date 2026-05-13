"use client";

import PrivateRoute from "@/src/components/PrivateRoute";
import TrainingPlans from "@/src/views/TrainingPlans/TrainingPlans";

export default function TrainingPlansPage() {
  return (
    <PrivateRoute>
      <TrainingPlans />
    </PrivateRoute>
  );
}

