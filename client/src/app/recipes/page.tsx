"use client";

import PrivateRoute from "@/src/components/PrivateRoute";
import Recipes from "@/src/views/Recipes/Recipes";

export default function RecipesPage() {
  return (
    <PrivateRoute>
      <Recipes />
    </PrivateRoute>
  );
}

