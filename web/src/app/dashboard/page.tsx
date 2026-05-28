"use client";

import PrivateRoute from "@/src/components/PrivateRoute";
import Dashboard from "@/src/views/Dashboard/Dashboard";

export default function DashboardPage() {
  return (
    <PrivateRoute>
      <Dashboard />
    </PrivateRoute>
  );
}

