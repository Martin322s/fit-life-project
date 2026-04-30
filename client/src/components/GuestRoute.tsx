import type { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingScreen from "./LoadingScreen";

type Props = { children: JSX.Element };

/** Redirects already-authenticated users to /dashboard. */
function GuestRoute({ children }: Props): JSX.Element {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;
  if (user) return <Navigate to="/dashboard" replace />;

  return children;
}

export default GuestRoute;
