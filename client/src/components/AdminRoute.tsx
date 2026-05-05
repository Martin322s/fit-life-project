import type { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }: { children: JSX.Element }): JSX.Element {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) return <></>;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (user?.role !== "admin") return <Navigate to="/dashboard" replace />;

  return children;
}
