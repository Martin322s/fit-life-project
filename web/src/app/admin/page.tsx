"use client";

import AdminRoute from "@/src/components/AdminRoute";
import Admin from "@/src/views/Admin/Admin";

export default function AdminPage() {
  return (
    <AdminRoute>
      <Admin />
    </AdminRoute>
  );
}

