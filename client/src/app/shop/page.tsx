"use client";

import PrivateRoute from "@/src/components/PrivateRoute";
import Shop from "@/src/views/Shop/Shop";

export default function ShopPage() {
  return (
    <PrivateRoute>
      <Shop />
    </PrivateRoute>
  );
}

