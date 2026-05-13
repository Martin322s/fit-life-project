"use client";

import PrivateRoute from "@/src/components/PrivateRoute";
import Products from "@/src/views/Products/Products";

export default function ProductsPage() {
  return (
    <PrivateRoute>
      <Products />
    </PrivateRoute>
  );
}

